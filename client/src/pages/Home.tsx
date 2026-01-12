import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Heart } from "lucide-react";
import heroImg from "@assets/hero.jpg"; // Using import but placeholder for effect

export default function Home() {
  return (
    <div className="min-h-screen bg-[url('/grid-pattern.svg')] bg-fixed">
      <Navigation />
      
      <main className="container mx-auto px-4 pb-20 pt-10">
        {/* Hero Section */}
        <section className="text-center py-20 md:py-32 relative overflow-hidden">
          {/* Decorative floating elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur border border-primary/10 text-sm font-medium text-primary mb-8 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Welcome to the vibe zone</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl mb-6 text-gradient font-display leading-tight">
              forvibe
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              A creative playground for relaxing, playing simple games, and vibing
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/games">
                <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-1">
                  Play Games <Zap className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/tools">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-2 hover:bg-secondary/20 hover:text-secondary-foreground transition-all">
                  Use Tools <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Play",
              desc: "Simple, addictive browser games to test your reflexes.",
              icon: Zap,
              color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            },
            {
              title: "Create",
              desc: "Fun tools to spice up your text and generate ideas.",
              icon: Sparkles,
              color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
            },
            {
              title: "Vibe",
              desc: "A minimalist space designed to make you feel good.",
              icon: Heart,
              color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400"
            }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-8 rounded-3xl hover:border-primary/30 transition-colors group"
            >
              <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </section>
      </main>
      
      <footer className="py-8 text-center text-muted-foreground text-sm font-medium">
        <p>© 2026 Forvibe, made with by Taiqsod</p>
      </footer>
    </div>
  );
}
