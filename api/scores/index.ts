import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { scores } from '../_lib/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { gameName, score, playerName } = req.body;
    
    if (!gameName || score === undefined || !playerName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (playerName.length < 2 || playerName.length > 20) {
      return res.status(400).json({ error: 'Player name must be 2-20 characters' });
    }

    const [newScore] = await db
      .insert(scores)
      .values({ gameName, score, playerName })
      .returning();
    
    return res.status(201).json(newScore);
  } catch (error) {
    console.error('Error creating score:', error);
    return res.status(500).json({ error: 'Failed to create score' });
  }
}
