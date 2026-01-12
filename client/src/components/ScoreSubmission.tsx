import { useState } from "react";
import { useSubmitScore } from "@/hooks/use-scores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

interface ScoreSubmissionProps {
  score: number;
  gameName: string;
  isOpen: boolean;
  onClose: () => void;
  gameLabel: string;
}

export function ScoreSubmission({ score, gameName, isOpen, onClose, gameLabel }: ScoreSubmissionProps) {
  const [playerName, setPlayerName] = useState("");
  const { mutate: submitScore, isPending } = useSubmitScore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    submitScore(
      { gameName, score, playerName },
      {
        onSuccess: () => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          onClose();
          setPlayerName("");
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-2 border-primary/10 rounded-3xl shadow-2xl">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-yellow-600">
            <Trophy className="w-6 h-6" />
          </div>
          <DialogTitle className="text-center text-2xl font-display">New High Score!</DialogTitle>
          <DialogDescription className="text-center">
            You scored <span className="font-bold text-primary text-lg">{score}</span> in {gameLabel}. 
            Enter your name to join the leaderboard.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Input
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="text-center text-lg font-bold rounded-xl border-2 focus-visible:ring-primary/20 h-12"
            maxLength={15}
            autoFocus
          />
          
          <DialogFooter className="sm:justify-center">
            <Button 
              type="submit" 
              disabled={isPending || !playerName.trim()}
              className="w-full rounded-xl h-12 text-md font-bold bg-primary hover:bg-primary/90"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Submit Score
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
