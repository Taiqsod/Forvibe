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
    <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <div className="glass-panel rounded-2xl px-3 py-4 flex flex-col gap-2 shadow-2xl shadow-primary/10 border border-primary/10">
        {links.map((link) => {
          const isActive = location === link.href;
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "relative px-3 py-3 rounded-xl transition-colors duration-300 flex items-center gap-3 group",
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
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
                <Icon className={cn("w-5 h-5", isActive && "scale-110 transition-transform")} />
                <span className="text-xs font-bold uppercase tracking-wider hidden md:block">
                  {link.label}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
