import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerChatRoutes } from "./replit_integrations/chat";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Scores API
  app.get(api.scores.list.path, async (req, res) => {
    const gameName = req.params.gameName;
    const scores = await storage.getTopScores(gameName);
    res.json(scores);
  });

  app.post(api.scores.create.path, async (req, res) => {
    try {
      const input = api.scores.create.input.parse(req.body);
      const score = await storage.createScore(input);
      res.status(201).json(score);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Register chat routes for AI chatbot
  registerChatRoutes(app);

  return httpServer;
}

// Seed function to populate some initial scores
async function seedDatabase() {
  const existingScores = await storage.getTopScores('clicker');
  if (existingScores.length === 0) {
    await storage.createScore({ gameName: 'clicker', score: 42, playerName: 'VibeCheck' });
    await storage.createScore({ gameName: 'reaction', score: 250, playerName: 'Speedy' });
    console.log("Seeded database with initial scores");
  }
}

// Call seed after a short delay to ensure DB is ready
setTimeout(seedDatabase, 2000);
