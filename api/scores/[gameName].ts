import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { scores } from '../_lib/schema';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { gameName } = req.query;
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const topScores = await db
      .select()
      .from(scores)
      .where(eq(scores.gameName, gameName as string))
      .orderBy(desc(scores.score))
      .limit(10);
    
    return res.status(200).json(topScores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    return res.status(500).json({ error: 'Failed to fetch scores' });
  }
}
