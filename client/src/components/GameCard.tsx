import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  active?: boolean;
  color?: "purple" | "pink" | "cyan";
}

export function GameCard({ title, description, icon: Icon, onClick, active, color = "purple" }: GameCardProps) {
  const colors = {
    purple: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
    pink: "bg-secondary text-secondary-foreground border-secondary-foreground/20 hover:bg-secondary/80",
    cyan: "bg-accent text-accent-foreground border-accent-foreground/20 hover:bg-accent/80",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 flex items-start gap-4",
        active ? "ring-4 ring-offset-2 ring-primary/30 border-primary" : "border-transparent",
        colors[color]
      )}
    >
      <div className={cn("p-3 rounded-xl bg-white/50 backdrop-blur-sm")}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-xl font-display font-bold mb-1">{title}</h3>
        <p className="text-sm opacity-80 font-medium">{description}</p>
      </div>
    </motion.button>
  );
}
