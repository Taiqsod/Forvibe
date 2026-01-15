import { useScores } from "@/hooks/use-scores";
import { Trophy, Medal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface LeaderboardProps {
  gameName: string;
  gameLabel: string;
}

export function Leaderboard({ gameName, gameLabel }: LeaderboardProps) {
  const { data: scores, isLoading } = useScores(gameName);

  // Sort scores (descending for clicker, could be different for others)
  const sortedScores = scores?.sort((a, b) => {
    if (gameName === "reaction") {
      // For reaction, lower is better
      return a.score - b.score;
    }
    return b.score - a.score;
  }).slice(0, 10); // Top 10

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!sortedScores || sortedScores.length === 0) {
    return (
      <div className="text-center py-10 bg-muted/30 rounded-2xl border-2 border-dashed border-muted-foreground/20">
        <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-muted-foreground font-medium">No scores yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h3 className="text-xl font-bold font-display">{gameLabel} Leaderboard</h3>
      </div>

      <div className="space-y-3">
        {sortedScores.map((score, index) => {
          let rankIcon;
          let rankClass = "bg-muted text-muted-foreground";
          
          if (index === 0) {
            rankIcon = <Medal className="w-5 h-5" />;
            rankClass = "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700/50";
          } else if (index === 1) {
            rankIcon = <Medal className="w-5 h-5" />;
            rankClass = "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
          } else if (index === 2) {
            rankIcon = <Medal className="w-5 h-5" />;
            rankClass = "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700/50";
          } else {
            rankIcon = <span className="text-sm font-bold font-mono">#{index + 1}</span>;
          }

          return (
            <div 
              key={score.id}
              className="flex items-center justify-between p-3 rounded-xl bg-background/80 border border-border/50 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${rankClass}`}>
                  {rankIcon}
                </div>
                <div className="font-bold">
                  {score.playerName}
                </div>
              </div>
              <div className="font-mono font-bold text-lg text-primary">
                {score.score}
                <span className="text-xs text-muted-foreground ml-1 font-sans font-normal">
                  {gameName === "reaction" ? "ms" : "pts"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
