import { Link, useLocation } from "wouter";
import { Home, Gamepad2, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Navigation() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/games", label: "Games", icon: Gamepad2 },
    { href: "/tools", label: "Tools", icon: PenTool },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full px-4 py-4 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="glass-panel rounded-full px-2 py-2 flex items-center justify-between shadow-2xl shadow-primary/10 border border-primary/10">
          {links.map((link) => {
            const isActive = location === link.href;
            const Icon = link.icon;
            
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-full transition-colors duration-300 flex flex-col items-center group",
                  isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={cn("w-5 h-5", isActive && "scale-110 transition-transform")} />
                  <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">
                    {link.label}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
