import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { GameCard } from "@/components/GameCard";
import { Leaderboard } from "@/components/Leaderboard";
import { ScoreSubmission } from "@/components/ScoreSubmission";
import { Button } from "@/components/ui/button";
import { MousePointer2, Zap, RotateCcw, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function Games() {
  const [activeGame, setActiveGame] = useState<"clicker" | "reaction" | null>(null);
  
  return (
    <div className="min-h-screen bg-[url('/grid-pattern.svg')] bg-fixed pb-20">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display text-gradient mb-4">Arcade</h1>
          <p className="text-muted-foreground">Challenge yourself and top the leaderboards</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          {/* Game Selection / Active Game Area */}
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
                title="Reaction Test" 
                description="Wait for green, then click!"
                icon={Zap}
                active={activeGame === "reaction"}
                onClick={() => setActiveGame("reaction")}
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
                    <ClickerGame />
                  </motion.div>
                )}
                
                {activeGame === "reaction" && (
                  <motion.div
                    key="reaction"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-panel p-8 rounded-3xl h-full border-2 border-accent/20"
                  >
                    <ReactionGame />
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

          {/* Leaderboards */}
          <div className="lg:col-span-4 space-y-6">
            <Leaderboard gameName="clicker" gameLabel="Click Mania" />
            <Leaderboard gameName="reaction" gameLabel="Reaction Test" />
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
      // Small vibration/feedback
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
        >
          Start
        </Button>
      )}

      {isPlaying && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className="w-48 h-48 rounded-full text-2xl font-bold bg-gradient-to-br from-primary to-purple-600 text-white shadow-xl shadow-primary/30 flex items-center justify-center flex-col gap-2"
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
            <Button onClick={startGame} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" /> Try Again
            </Button>
            <Button onClick={() => setShowSubmit(true)} className="gap-2 bg-primary">
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

function ReactionGame() {
  const [gameState, setGameState] = useState<"waiting" | "ready" | "clicked" | "early">("waiting");
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startTest = () => {
    setGameState("waiting");
    setReactionTime(null);
    
    // Random delay between 2-5 seconds
    const delay = 2000 + Math.random() * 3000;
    
    timeoutRef.current = setTimeout(() => {
      setGameState("ready");
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (gameState === "waiting") {
      setGameState("early");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    if (gameState === "ready") {
      const endTime = Date.now();
      const time = endTime - startTime;
      setReactionTime(time);
      setGameState("clicked");
      
      if (time < 300) { // Good reaction
        confetti({
          particleCount: 50,
          spread: 40,
          origin: { y: 0.6 }
        });
      }
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center gap-6">
      <div 
        onClick={handleClick}
        className={`
          w-full max-w-lg aspect-square sm:aspect-video rounded-3xl cursor-pointer
          flex flex-col items-center justify-center text-center p-8 transition-all duration-200 shadow-2xl
          ${gameState === "waiting" ? "bg-red-500 hover:bg-red-600 text-white" : ""}
          ${gameState === "ready" ? "bg-green-500 text-white scale-[1.02]" : ""}
          ${gameState === "clicked" ? "bg-accent text-accent-foreground" : ""}
          ${gameState === "early" ? "bg-orange-500 text-white" : ""}
          ${!gameState && "bg-muted text-muted-foreground"}
        `}
      >
        {gameState === "waiting" && (
          <>
            <Timer className="w-16 h-16 mb-4 animate-pulse" />
            <h3 className="text-3xl font-bold">Wait for Green...</h3>
          </>
        )}
        
        {gameState === "ready" && (
          <>
            <Zap className="w-16 h-16 mb-4 scale-150" />
            <h3 className="text-4xl font-bold">CLICK NOW!</h3>
          </>
        )}
        
        {gameState === "early" && (
          <>
            <RotateCcw className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Too Early!</h3>
            <p>Click to try again</p>
          </>
        )}
        
        {gameState === "clicked" && reactionTime && (
          <div className="space-y-4">
            <h3 className="text-2xl font-medium">Reaction Time</h3>
            <p className="text-6xl font-mono font-bold">{reactionTime}ms</p>
            <p className="text-lg opacity-80">Click to restart</p>
            <div className="flex gap-2 justify-center mt-4" onClick={e => e.stopPropagation()}>
              <Button onClick={() => setShowSubmit(true)} className="bg-primary hover:bg-primary/90 text-white">
                Submit Score
              </Button>
            </div>
          </div>
        )}
        
        {!gameState && (
          <Button size="lg" onClick={startTest}>Start Test</Button>
        )}
      </div>

      {/* Initial Start Button when first loading component */}
      {!reactionTime && gameState === "clicked" && (
        <Button size="lg" onClick={startTest} className="mt-4">
          Start Test
        </Button>
      )}
      
      {/* Reset for early click */}
      {gameState === "early" && (
        <Button variant="outline" onClick={startTest}>Try Again</Button>
      )}

      {/* Start button for fresh state */}
      {gameState === null && (
        <Button size="lg" onClick={startTest}>Start Reaction Test</Button>
      )}

      <ScoreSubmission 
        isOpen={showSubmit}
        onClose={() => setShowSubmit(false)}
        score={reactionTime || 0}
        gameName="reaction"
        gameLabel="Reaction Test"
      />
    </div>
  );
}

function TrophyIcon(props: any) {
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
  )
}
