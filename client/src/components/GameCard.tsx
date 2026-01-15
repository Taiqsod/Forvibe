import { LucideIcon, Trophy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Leaderboard } from "@/components/Leaderboard";

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  active?: boolean;
  color?: "purple" | "pink" | "cyan";
  gameName: string;
}

export function GameCard({ title, description, icon: Icon, onClick, active, color = "purple", gameName }: GameCardProps) {
  const colorStyles = {
    purple: {
      card: "bg-gradient-to-br from-purple-500/20 via-primary/10 to-fuchsia-500/20 border-purple-400/30 hover:border-purple-400/60",
      icon: "bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-500/30",
      badge: "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/40",
    },
    pink: {
      card: "bg-gradient-to-br from-pink-500/20 via-rose-500/10 to-orange-500/20 border-pink-400/30 hover:border-pink-400/60",
      icon: "bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30",
      badge: "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20 hover:shadow-lg hover:shadow-pink-500/40",
    },
    cyan: {
      card: "bg-gradient-to-br from-cyan-500/20 via-teal-500/10 to-emerald-500/20 border-cyan-400/30 hover:border-cyan-400/60",
      icon: "bg-gradient-to-br from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/30",
      badge: "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/40",
    },
  };

  const styles = colorStyles[color];

  return (
    <div className="relative group">
      <motion.button
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
          "w-full text-left p-6 rounded-3xl border-2 transition-all duration-300 backdrop-blur-sm",
          active ? "ring-4 ring-offset-2 ring-primary/40 border-primary shadow-2xl" : "",
          styles.card
        )}
      >
        <div className="flex items-start gap-4">
          <motion.div 
            className={cn("p-4 rounded-2xl", styles.icon)}
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
          <div className="flex-1 pt-1">
            <h3 className="text-xl font-display font-bold mb-1 flex items-center gap-2">
              {title}
              {active && <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">{description}</p>
          </div>
        </div>
      </motion.button>
      
      <Dialog>
        <DialogTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "absolute -top-2 -right-2 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all",
              styles.badge
            )}
            data-testid={`button-leaderboard-${gameName}`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Top 10
          </motion.button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              {title} Leaderboard
            </DialogTitle>
          </DialogHeader>
          <Leaderboard gameName={gameName} gameLabel={title} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
