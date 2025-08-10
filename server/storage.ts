import {
  users,
  gratitudeStories,
  userConnections,
  type User,
  type UpsertUser,
  type InsertGratitudeStory,
  type GratitudeStory,
  type GratitudeStoryWithUsers,
  type ConfirmGratitude,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, or, ilike, and, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // User search and connections
  searchUsers(query: string, currentUserId: string): Promise<User[]>;
  importConnections(currentUserId: string, contacts: { email?: string; firstName?: string; lastName?: string }[]): Promise<{ connectedCount: number; skippedCount: number }>;
  listConnections(currentUserId: string): Promise<User[]>;
  
  // Gratitude story operations
  createGratitudeStory(story: InsertGratitudeStory): Promise<GratitudeStory>;
  getGratitudeStories(userId?: string): Promise<GratitudeStoryWithUsers[]>;
  getPendingGratitudeForUser(userId: string): Promise<GratitudeStoryWithUsers[]>;
  confirmGratitudeStory(data: ConfirmGratitude): Promise<GratitudeStory>;
  
  // Stats and reputation
  updateUserStats(userId: string, repsChange: number, starsChange: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // User search and connections
  async searchUsers(query: string, currentUserId: string): Promise<User[]> {
    const searchTerm = `%${query}%`;
    return await db
      .select()
      .from(users)
      .where(
        and(
          or(
            ilike(users.firstName, searchTerm),
            ilike(users.lastName, searchTerm),
            ilike(users.email, searchTerm),
            ilike(sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`, searchTerm)
          ),
          sql`${users.id} != ${currentUserId}`
        )
      )
      .limit(10);
  }

  async importConnections(currentUserId: string, contacts: { email?: string; firstName?: string; lastName?: string }[]): Promise<{ connectedCount: number; skippedCount: number }> {
    let connectedCount = 0;
    let skippedCount = 0;

    for (const contact of contacts) {
      // Try to find user by email first
      let matchedUser: User | undefined = undefined;
      if (contact.email) {
        const [byEmail] = await db.select().from(users).where(eq(users.email, contact.email));
        if (byEmail) matchedUser = byEmail;
      }

      // If not found by email, attempt a loose name match
      if (!matchedUser && (contact.firstName || contact.lastName)) {
        const first = contact.firstName ? `%${contact.firstName}%` : '%';
        const last = contact.lastName ? `%${contact.lastName}%` : '%';
        const results = await db
          .select()
          .from(users)
          .where(
            and(
              ilike(users.firstName, first),
              ilike(users.lastName, last),
              sql`${users.id} != ${currentUserId}`
            )
          )
          .limit(1);
        matchedUser = results[0];
      }

      if (!matchedUser) {
        skippedCount += 1;
        continue;
      }

      // Avoid self-connection or duplicates
      if (matchedUser.id === currentUserId) {
        skippedCount += 1;
        continue;
      }

      const existing = await db
        .select()
        .from(userConnections)
        .where(
          and(
            eq(userConnections.userId, currentUserId),
            eq(userConnections.connectedUserId, matchedUser.id)
          )
        );

      if (existing && existing.length > 0) {
        skippedCount += 1;
        continue;
      }

      await db.insert(userConnections).values({
        userId: currentUserId,
        connectedUserId: matchedUser.id,
        connectionType: 'friend',
      });
      connectedCount += 1;
    }

    return { connectedCount, skippedCount };
  }

  async listConnections(currentUserId: string): Promise<User[]> {
    // Join userConnections to users to return connected user profiles
    const results = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        bio: users.bio,
        totalReps: users.totalReps,
        totalStars: users.totalStars,
        weeklyGrowth: users.weeklyGrowth,
        kindnessLevel: users.kindnessLevel,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(userConnections)
      .leftJoin(users, eq(userConnections.connectedUserId, users.id))
      .where(eq(userConnections.userId, currentUserId));

    return results as unknown as User[];
  }

  // Gratitude story operations
  async createGratitudeStory(story: InsertGratitudeStory): Promise<GratitudeStory> {
    const [newStory] = await db
      .insert(gratitudeStories)
      .values(story)
      .returning();
    return newStory;
  }

  async getGratitudeStories(userId?: string): Promise<GratitudeStoryWithUsers[]> {
    const results = await db
      .select({
        id: gratitudeStories.id,
        giverId: gratitudeStories.giverId,
        receiverId: gratitudeStories.receiverId,
        content: gratitudeStories.content,
        repsEarned: gratitudeStories.repsEarned,
        starsGiven: gratitudeStories.starsGiven,
        isConfirmed: gratitudeStories.isConfirmed,
        confirmationNote: gratitudeStories.confirmationNote,
        likes: gratitudeStories.likes,
        comments: gratitudeStories.comments,
        createdAt: gratitudeStories.createdAt,
        updatedAt: gratitudeStories.updatedAt,
        giver: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          bio: users.bio,
          totalReps: users.totalReps,
          totalStars: users.totalStars,
          weeklyGrowth: users.weeklyGrowth,
          kindnessLevel: users.kindnessLevel,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
      })
      .from(gratitudeStories)
      .leftJoin(users, eq(gratitudeStories.giverId, users.id))
      .where(
        userId ? 
          and(
            eq(gratitudeStories.isConfirmed, true),
            or(
              eq(gratitudeStories.giverId, userId),
              eq(gratitudeStories.receiverId, userId)
            )
          ) :
          eq(gratitudeStories.isConfirmed, true)
      )
      .orderBy(desc(gratitudeStories.createdAt));

    // Get receiver data separately and merge
    const storiesWithReceivers = await Promise.all(
      results.map(async (story) => {
        const [receiver] = await db
          .select()
          .from(users)
          .where(eq(users.id, story.receiverId));
        
        return {
          ...story,
          receiver: receiver || null,
        };
      })
    );

    return storiesWithReceivers.filter(story => story.giver && story.receiver) as GratitudeStoryWithUsers[];
  }

  async getPendingGratitudeForUser(userId: string): Promise<GratitudeStoryWithUsers[]> {
    const results = await db
      .select({
        id: gratitudeStories.id,
        giverId: gratitudeStories.giverId,
        receiverId: gratitudeStories.receiverId,
        content: gratitudeStories.content,
        repsEarned: gratitudeStories.repsEarned,
        starsGiven: gratitudeStories.starsGiven,
        isConfirmed: gratitudeStories.isConfirmed,
        confirmationNote: gratitudeStories.confirmationNote,
        likes: gratitudeStories.likes,
        comments: gratitudeStories.comments,
        createdAt: gratitudeStories.createdAt,
        updatedAt: gratitudeStories.updatedAt,
        giver: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          bio: users.bio,
          totalReps: users.totalReps,
          totalStars: users.totalStars,
          weeklyGrowth: users.weeklyGrowth,
          kindnessLevel: users.kindnessLevel,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
      })
      .from(gratitudeStories)
      .leftJoin(users, eq(gratitudeStories.giverId, users.id))
      .where(
        and(
          eq(gratitudeStories.receiverId, userId),
          eq(gratitudeStories.isConfirmed, false)
        )
      )
      .orderBy(desc(gratitudeStories.createdAt));

    // Get receiver data and merge
    const storiesWithReceivers = await Promise.all(
      results.map(async (story) => {
        const [receiver] = await db
          .select()
          .from(users)
          .where(eq(users.id, story.receiverId));
        
        return {
          ...story,
          receiver: receiver || null,
        };
      })
    );

    return storiesWithReceivers.filter(story => story.giver && story.receiver) as GratitudeStoryWithUsers[];
  }

  async confirmGratitudeStory(data: ConfirmGratitude): Promise<GratitudeStory> {
    // Calculate reps based on story quality and confirmation
    const repsToAward = data.isConfirmed ? 20 : 0;
    const starsToAward = data.isConfirmed ? 5 : 0;

    const [updatedStory] = await db
      .update(gratitudeStories)
      .set({
        isConfirmed: data.isConfirmed,
        confirmationNote: data.confirmationNote,
        repsEarned: repsToAward,
        starsGiven: starsToAward,
        updatedAt: new Date(),
      })
      .where(eq(gratitudeStories.id, data.id))
      .returning();

    if (data.isConfirmed) {
      // Update receiver's total reps
      await db
        .update(users)
        .set({
          totalReps: sql`${users.totalReps} + ${repsToAward}`,
          weeklyGrowth: sql`${users.weeklyGrowth} + ${repsToAward}`,
          updatedAt: new Date(),
        })
        .where(eq(users.id, updatedStory.receiverId));

      // Update giver's total stars
      await db
        .update(users)
        .set({
          totalStars: sql`${users.totalStars} + ${starsToAward}`,
          updatedAt: new Date(),
        })
        .where(eq(users.id, updatedStory.giverId));
    }

    return updatedStory;
  }

  // Stats and reputation
  async updateUserStats(userId: string, repsChange: number, starsChange: number): Promise<void> {
    await db
      .update(users)
      .set({
        totalReps: sql`${users.totalReps} + ${repsChange}`,
        totalStars: sql`${users.totalStars} + ${starsChange}`,
        weeklyGrowth: sql`${users.weeklyGrowth} + ${repsChange}`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();