import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, Gamepad2, PenTool, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/games", label: "Games", icon: Gamepad2 },
    { href: "/tools", label: "Tools", icon: PenTool },
  ];

  return (
    <nav className="fixed right-4 top-4 z-50">
      <Button
        size="icon"
        variant="outline"
        className="glass-panel rounded-xl shadow-lg border border-primary/10"
        onClick={() => setIsOpen(!isOpen)}
        data-testid="nav-menu-toggle"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-14 glass-panel rounded-2xl px-3 py-3 flex flex-col gap-1 shadow-2xl shadow-primary/10 border border-primary/10 min-w-[160px]"
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
                    "relative px-4 py-3 rounded-xl transition-colors duration-300 flex items-center gap-3",
                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                  )}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-semibold">{link.label}</span>
                  </span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
