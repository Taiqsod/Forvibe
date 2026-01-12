import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertScore } from "@shared/routes";

// GET /api/scores/:gameName
export function useScores(gameName: string) {
  return useQuery({
    queryKey: [api.scores.list.path, gameName],
    queryFn: async () => {
      const url = buildUrl(api.scores.list.path, { gameName });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch scores");
      return api.scores.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/scores
export function useSubmitScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertScore) => {
      const validated = api.scores.create.input.parse(data);
      const res = await fetch(api.scores.create.path, {
        method: api.scores.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Invalid score data");
        }
        throw new Error("Failed to submit score");
      }
      
      return api.scores.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific game's leaderboard
      queryClient.invalidateQueries({ 
        queryKey: [api.scores.list.path, variables.gameName] 
      });
    },
  });
}
