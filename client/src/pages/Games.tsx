import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { GameCard } from "@/components/GameCard";
import { Leaderboard } from "@/components/Leaderboard";
import { ScoreSubmission } from "@/components/ScoreSubmission";
import { Button } from "@/components/ui/button";
import { MousePointer2, Grid3X3, RotateCcw, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const GLYPH_SHAPES = ["◆", "●", "■", "▲", "★", "♦", "♠", "♣", "♥", "◯", "△", "□"];

export default function Games() {
  const [activeGame, setActiveGame] = useState<"clicker" | "glyph" | null>(null);
  
  return (
    <div className="min-h-screen bg-[url('/grid-pattern.svg')] bg-fixed pb-20">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display text-gradient mb-4">Arcade</h1>
          <p className="text-muted-foreground">Challenge yourself and top the leaderboards</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-8 space-y-8">
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <GameCard 
                title="Click Mania" 
                description="Click as fast as you can in 10 seconds!"
                icon={MousePointer2}
                active={activeGame === "clicker"}
                onClick={() => setActiveGame("clicker")}
                color="purple"
              />
              <GameCard 
                title="Glyph Match" 
                description="Match pairs of symbols to level up!"
                icon={Grid3X3}
                active={activeGame === "glyph"}
                onClick={() => setActiveGame("glyph")}
                color="cyan"
              />
            </div>

            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeGame === "clicker" && (
                  <motion.div
                    key="clicker"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-panel p-8 rounded-3xl h-full border-2 border-primary/10"
                  >
                    <div className="flex justify-end mb-2">
                      <GameHelp 
                        title="How to Play Click Mania"
                        instructions={[
                          "Click the 'Start' button to begin the game",
                          "Click the big purple button as fast as you can",
                          "You have 10 seconds to get as many clicks as possible",
                          "Your final score is the total number of clicks",
                          "Submit your score to the leaderboard to compete with others!"
                        ]}
                      />
                    </div>
                    <ClickerGame />
                  </motion.div>
                )}
                
                {activeGame === "glyph" && (
                  <motion.div
                    key="glyph"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-panel p-8 rounded-3xl h-full border-2 border-accent/20"
                  >
                    <div className="flex justify-end mb-2">
                      <GameHelp 
                        title="How to Play Glyph Match"
                        instructions={[
                          "Click 'Start Game' to begin",
                          "Click on cards to flip them and reveal symbols",
                          "Find matching pairs of symbols",
                          "Try to match all pairs using the fewest moves",
                          "Complete a level to advance - each level adds more pairs!",
                          "Your score increases based on performance",
                          "Reach level 8 for the maximum challenge (8 pairs)"
                        ]}
                      />
                    </div>
                    <GlyphGame />
                  </motion.div>
                )}

                {!activeGame && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex items-center justify-center text-muted-foreground/50 border-2 border-dashed border-muted-foreground/20 rounded-3xl p-12"
                  >
                    Select a game to start playing
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Leaderboard gameName="clicker" gameLabel="Click Mania" />
            <Leaderboard gameName="glyph" gameLabel="Glyph Match" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ClickerGame() {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startGame = () => {
    setClicks(0);
    setTimeLeft(10);
    setIsPlaying(true);
    setIsFinished(false);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setIsFinished(true);
    confetti({
      particleCount: 150,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleClick = () => {
    if (isPlaying) {
      setClicks(prev => prev + 1);
      if (navigator.vibrate) navigator.vibrate(5);
    }
  };

  return (
    <div className="text-center h-full flex flex-col items-center justify-center gap-8">
      <div className="flex items-center justify-between w-full max-w-md px-4">
        <div className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Score</span>
          <span className="text-4xl font-mono font-bold text-primary">{clicks}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Time</span>
          <span className={`text-4xl font-mono font-bold ${timeLeft < 3 ? 'text-destructive' : 'text-foreground'}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {!isPlaying && !isFinished && (
        <Button 
          onClick={startGame} 
          size="lg" 
          className="w-48 h-48 rounded-full text-2xl font-display bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
          data-testid="button-start-clicker"
        >
          Start
        </Button>
      )}

      {isPlaying && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className="w-48 h-48 rounded-full text-2xl font-bold bg-gradient-to-br from-primary to-purple-600 text-white shadow-xl shadow-primary/30 flex items-center justify-center flex-col gap-2"
          data-testid="button-click-target"
        >
          <MousePointer2 className="w-8 h-8" />
          CLICK!
        </motion.button>
      )}

      {isFinished && (
        <div className="space-y-6 animate-in zoom-in duration-300">
          <div className="p-6 bg-secondary/30 rounded-2xl border border-secondary">
            <h3 className="text-2xl font-bold mb-2">Game Over!</h3>
            <p className="text-lg text-muted-foreground">You achieved {clicks} clicks per 10s</p>
            <p className="text-sm font-mono mt-1 opacity-70">({(clicks / 10).toFixed(1)} CPS)</p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button onClick={startGame} variant="outline" className="gap-2" data-testid="button-try-again">
              <RotateCcw className="w-4 h-4" /> Try Again
            </Button>
            <Button onClick={() => setShowSubmit(true)} className="gap-2 bg-primary" data-testid="button-submit-score">
              <TrophyIcon className="w-4 h-4" /> Submit Score
            </Button>
          </div>
        </div>
      )}

      <ScoreSubmission 
        isOpen={showSubmit}
        onClose={() => setShowSubmit(false)}
        score={clicks}
        gameName="clicker"
        gameLabel="Click Mania"
      />
    </div>
  );
}

interface Card {
  id: number;
  shape: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function GlyphGame() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState<"idle" | "playing" | "complete">("idle");
  const [showSubmit, setShowSubmit] = useState(false);

  const getPairsForLevel = (lvl: number) => Math.min(2 + lvl, 8);
  const pairsForLevel = getPairsForLevel(level);

  const initializeGame = (forLevel?: number) => {
    const lvl = forLevel ?? level;
    const pairs = getPairsForLevel(lvl);
    const shapes = GLYPH_SHAPES.slice(0, pairs);
    const cardPairs = [...shapes, ...shapes];
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    
    setCards(shuffled.map((shape, idx) => ({
      id: idx,
      shape,
      isFlipped: false,
      isMatched: false,
    })));
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameState("playing");
  };

  const handleCardClick = (cardId: number) => {
    if (gameState !== "playing") return;
    if (flippedCards.length >= 2) return;
    if (cards[cardId].isFlipped || cards[cardId].isMatched) return;

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);
    
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].shape === cards[second].shape) {
        setTimeout(() => {
          const matched = [...cards];
          matched[first].isMatched = true;
          matched[second].isMatched = true;
          setCards(matched);
          setMatchedPairs(p => p + 1);
          setFlippedCards([]);
          setScore(s => s + (100 * level));

          if (matchedPairs + 1 === pairsForLevel) {
            confetti({ particleCount: 100, spread: 50 });
            setGameState("complete");
          }
        }, 300);
      } else {
        setTimeout(() => {
          const reset = [...cards];
          reset[first].isFlipped = false;
          reset[second].isFlipped = false;
          setCards(reset);
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  const nextLevel = () => {
    const newLevel = level + 1;
    setLevel(newLevel);
    initializeGame(newLevel);
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    initializeGame(1);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-lg px-4">
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Level</span>
          <span className="text-2xl font-bold text-primary">{level}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Score</span>
          <span className="text-2xl font-bold font-mono">{score}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Moves</span>
          <span className="text-2xl font-bold font-mono">{moves}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Pairs</span>
          <span className="text-2xl font-bold">{matchedPairs}/{pairsForLevel}</span>
        </div>
      </div>

      {gameState === "idle" && (
        <Button 
          onClick={() => initializeGame()} 
          size="lg" 
          className="rounded-full px-8 h-14 text-lg"
          data-testid="button-start-glyph"
        >
          Start Game
        </Button>
      )}

      {gameState === "playing" && (
        <div className={`grid gap-3 ${pairsForLevel <= 4 ? 'grid-cols-4' : 'grid-cols-4 sm:grid-cols-5'}`}>
          {cards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              whileTap={{ scale: 0.95 }}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl text-3xl font-bold flex items-center justify-center transition-all duration-200 ${
                card.isMatched 
                  ? "bg-green-500/30 text-green-600 border-2 border-green-500" 
                  : card.isFlipped 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted hover:bg-muted/80 text-transparent"
              }`}
              data-testid={`card-${card.id}`}
            >
              {(card.isFlipped || card.isMatched) ? card.shape : "?"}
            </motion.button>
          ))}
        </div>
      )}

      {gameState === "complete" && (
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-primary">Level Complete!</h3>
          <p className="text-muted-foreground">Completed in {moves} moves</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={nextLevel} className="gap-2" data-testid="button-next-level">
              Next Level
            </Button>
            <Button onClick={() => setShowSubmit(true)} variant="outline" data-testid="button-submit-glyph">
              Submit Score
            </Button>
            <Button onClick={resetGame} variant="ghost" data-testid="button-reset-glyph">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <ScoreSubmission 
        isOpen={showSubmit}
        onClose={() => setShowSubmit(false)}
        score={score}
        gameName="glyph"
        gameLabel="Glyph Match"
      />
    </div>
  );
}

function GameHelp({ title, instructions }: { title: string; instructions: string[] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground" data-testid="button-game-help">
          <HelpCircle className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-4">
          {instructions.map((instruction, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <p className="text-sm text-muted-foreground pt-0.5">{instruction}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
