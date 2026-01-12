import { Navigation } from "@/components/Navigation";
import { motion } from "framer-motion";
import { Github, Twitter, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen bg-[url('/grid-pattern.svg')] bg-fixed pb-20">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-16 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10 text-center"
        >
          <div>
            <h1 className="text-5xl md:text-6xl font-display text-gradient mb-6">About forvibe</h1>
            <div className="w-24 h-2 bg-primary rounded-full mx-auto" />
          </div>

          <div className="prose prose-lg dark:prose-invert mx-auto">
            <p className="text-xl leading-relaxed text-muted-foreground">
              forvibe is a digital playground designed for those moments when you just need to chill. 
              No accounts, no ads, no tracking—just pure vibes.
            </p>
            
            <p className="leading-relaxed">
              We believe the internet should be fun again. Whether you want to test your reaction time, 
              generate some fancy text for your bio, or just stare at pleasing gradients, we've got you covered.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl mt-12">
            <h3 className="text-2xl font-bold mb-6">Connect with us</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="rounded-full gap-2 h-12 px-6">
                <Github className="w-5 h-5" /> GitHub
              </Button>
              <Button variant="outline" className="rounded-full gap-2 h-12 px-6">
                <Twitter className="w-5 h-5 text-blue-400" /> Twitter
              </Button>
              <Button className="rounded-full gap-2 h-12 px-6 bg-pink-500 hover:bg-pink-600 text-white border-none">
                <Coffee className="w-5 h-5" /> Buy me a coffee
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
