import { z } from "zod";

export const insertScoreSchema = z.object({
  gameName: z.string(),
  score: z.number(),
  playerName: z.string(),
});

export type Score = {
  id: number;
  gameName: string;
  score: number;
  playerName: string;
  createdAt: Date | null;
};

export type InsertScore = z.infer<typeof insertScoreSchema>;

export type Conversation = {
  id: number;
  title: string;
  createdAt: Date;
};

export type Message = {
  id: number;
  conversationId: number;
  role: string;
  content: string;
  createdAt: Date;
};

export type User = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};
