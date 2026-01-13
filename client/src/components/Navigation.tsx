import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, Gamepad2, PenTool, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/games", label: "Games", icon: Gamepad2 },
    { href: "/tools", label: "Tools", icon: PenTool },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary font-medium">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm md:text-base">Welcome to the vibe zone</span>
        </Link>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-primary/10 transition-colors"
          data-testid="nav-menu-toggle"
          aria-label="Toggle menu"
        >
          <span className={cn(
            "w-5 h-0.5 bg-foreground rounded-full transition-all duration-300",
            isOpen && "rotate-45 translate-y-2"
          )} />
          <span className={cn(
            "w-5 h-0.5 bg-foreground rounded-full transition-all duration-300",
            isOpen && "opacity-0"
          )} />
          <span className={cn(
            "w-5 h-0.5 bg-foreground rounded-full transition-all duration-300",
            isOpen && "-rotate-45 -translate-y-2"
          )} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 top-16 bg-background/95 backdrop-blur-md rounded-xl px-2 py-2 flex flex-col gap-1 shadow-lg border border-primary/10 min-w-[160px]"
          >
            {links.map((link) => {
              const isActive = location === link.href;
              const Icon = link.icon;
              
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "relative px-4 py-2.5 rounded-lg transition-colors duration-200 flex items-center gap-3",
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                  )}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
