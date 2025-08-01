import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertGratitudeStorySchema, 
  confirmGratitudeSchema, 
  userSearchSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Health check endpoint for Railway
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  app.get('/', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    } else {
      res.send('Giverr Development Server Running');
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User search
  app.get('/api/users/search', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { query } = userSearchSchema.parse(req.query);
      
      const users = await storage.searchUsers(query, userId);
      res.json(users);
    } catch (error) {
      console.error("Error searching users:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid search query", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to search users" });
      }
    }
  });

  // Gratitude stories
  app.get('/api/gratitude-stories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stories = await storage.getGratitudeStories();
      res.json(stories);
    } catch (error) {
      console.error("Error fetching gratitude stories:", error);
      res.status(500).json({ message: "Failed to fetch gratitude stories" });
    }
  });

  app.post('/api/gratitude-stories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const storyData = insertGratitudeStorySchema.parse({
        ...req.body,
        giverId: userId,
      });

      const story = await storage.createGratitudeStory(storyData);
      res.status(201).json(story);
    } catch (error) {
      console.error("Error creating gratitude story:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid story data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create gratitude story" });
      }
    }
  });

  // Get pending gratitude for current user
  app.get('/api/gratitude-stories/pending', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const pendingStories = await storage.getPendingGratitudeForUser(userId);
      res.json(pendingStories);
    } catch (error) {
      console.error("Error fetching pending gratitude:", error);
      res.status(500).json({ message: "Failed to fetch pending gratitude" });
    }
  });

  // Confirm gratitude story
  app.patch('/api/gratitude-stories/:id/confirm', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const storyId = req.params.id;
      
      const confirmData = confirmGratitudeSchema.parse({
        ...req.body,
        id: storyId,
      });

      // Verify the user is the receiver of this gratitude
      const [story] = await storage.getGratitudeStories();
      const targetStory = story ? [story].find(s => s.id === storyId && s.receiver.id === userId) : null;
      
      if (!targetStory) {
        return res.status(403).json({ message: "You can only confirm gratitude directed to you" });
      }

      const updatedStory = await storage.confirmGratitudeStory(confirmData);
      res.json(updatedStory);
    } catch (error) {
      console.error("Error confirming gratitude story:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid confirmation data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to confirm gratitude story" });
      }
    }
  });

  // Get user profile with stats
  app.get('/api/users/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.params.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
