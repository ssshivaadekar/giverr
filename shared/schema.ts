import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  bio: text("bio"),
  totalReps: integer("total_reps").default(0),
  totalStars: integer("total_stars").default(0),
  weeklyGrowth: integer("weekly_growth").default(0),
  kindnessLevel: varchar("kindness_level").default("Rising Star"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Gratitude stories table
export const gratitudeStories = pgTable("gratitude_stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  giverId: varchar("giver_id").notNull(),
  receiverId: varchar("receiver_id").notNull(),
  content: text("content").notNull(),
  repsEarned: integer("reps_earned").default(0),
  starsGiven: integer("stars_given").default(0),
  isConfirmed: boolean("is_confirmed").default(false),
  confirmationNote: text("confirmation_note"),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User search/connection table for finding people
export const userConnections = pgTable("user_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  connectedUserId: varchar("connected_user_id").notNull(),
  connectionType: varchar("connection_type").default("colleague"), // colleague, friend, family, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  givenGratitude: many(gratitudeStories, { relationName: "giver" }),
  receivedGratitude: many(gratitudeStories, { relationName: "receiver" }),
  connections: many(userConnections, { relationName: "user" }),
  connectedTo: many(userConnections, { relationName: "connected" }),
}));

export const gratitudeStoriesRelations = relations(gratitudeStories, ({ one }) => ({
  giver: one(users, {
    fields: [gratitudeStories.giverId],
    references: [users.id],
    relationName: "giver",
  }),
  receiver: one(users, {
    fields: [gratitudeStories.receiverId],
    references: [users.id],
    relationName: "receiver",
  }),
}));

export const userConnectionsRelations = relations(userConnections, ({ one }) => ({
  user: one(users, {
    fields: [userConnections.userId],
    references: [users.id],
    relationName: "user",
  }),
  connectedUser: one(users, {
    fields: [userConnections.connectedUserId],
    references: [users.id],
    relationName: "connected",
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  bio: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertGratitudeStorySchema = createInsertSchema(gratitudeStories).pick({
  giverId: true,
  receiverId: true,
  content: true,
}).extend({
  content: z.string().min(100, "Story must be at least 100 characters").max(1000, "Story must be under 1000 characters"),
});

export const confirmGratitudeSchema = createInsertSchema(gratitudeStories).pick({
  id: true,
  confirmationNote: true,
}).extend({
  isConfirmed: z.boolean(),
});

export const userSearchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

// Types
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type GratitudeStory = typeof gratitudeStories.$inferSelect;
export type InsertGratitudeStory = z.infer<typeof insertGratitudeStorySchema>;
export type ConfirmGratitude = z.infer<typeof confirmGratitudeSchema>;
export type UserConnection = typeof userConnections.$inferSelect;

export type GratitudeStoryWithUsers = GratitudeStory & {
  giver: User;
  receiver: User;
};
