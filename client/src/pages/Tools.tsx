import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Tools() {
  return (
    <div className="min-h-screen bg-[url('/grid-pattern.svg')] bg-fixed pb-20">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-8 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-display text-gradient mb-4">Creative Tools</h1>
          <p className="text-muted-foreground">Little utilities to express your vibe</p>
        </div>

        <FancyTextGenerator />
      </div>
    </div>
  );
}

function FancyTextGenerator() {
  const [input, setInput] = useState("Vibe check");
  const { toast } = useToast();

  const generators = [
    { name: "Cursive", fn: (s: string) => toUnicodeVariant(s, 'cursive') },
    { name: "Bold Serif", fn: (s: string) => toUnicodeVariant(s, 'bold') },
    { name: "Monospace", fn: (s: string) => toUnicodeVariant(s, 'monospace') },
    { name: "Bubble", fn: (s: string) => toUnicodeVariant(s, 'circled') },
    { name: "Square", fn: (s: string) => toUnicodeVariant(s, 'squared') },
    { name: "Wide", fn: (s: string) => s.split('').join(' ') },
    { name: "Flip", fn: (s: string) => flipString(s) },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard ✨",
      duration: 2000,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-8 rounded-3xl space-y-8"
    >
      <div className="space-y-4">
        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Type something</label>
        <Input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="text-2xl h-16 rounded-2xl border-2 focus-visible:ring-primary/20 bg-white/50"
          placeholder="Type here..."
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {generators.map((gen) => {
          const result = gen.fn(input);
          return (
            <div key={gen.name} className="p-4 rounded-xl bg-white/40 border border-white/20 hover:border-primary/30 transition-colors group relative">
              <div className="text-xs font-bold text-muted-foreground mb-2 uppercase">{gen.name}</div>
              <div className="text-lg font-medium pr-8 truncate">{result || <span className="opacity-30">Result</span>}</div>
              
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(result)}
              >
                <Copy className="w-4 h-4 text-primary" />
              </Button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Helper utilities for fancy text
// Simplified version for demo - a real library would be more robust
function toUnicodeVariant(str: string, variant: string) {
  const map: Record<string, string> = {
    'cursive': '𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩',
    'bold': '𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙',
    'monospace': '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉',
    'circled': 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ',
    'squared': '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉',
  };
  
  const normal = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const target = map[variant];
  
  if (!target) return str;
  
  return str.split('').map(char => {
    const i = normal.indexOf(char);
    return i === -1 ? char : Array.from(target)[i]; // Array.from handles unicode surrogate pairs
  }).join('');
}

function flipString(str: string) {
  const map: Record<string, string> = {
    'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ',
    'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u',
    'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n',
    'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z', 'A': '∀', 'B': 'q',
    'C': 'Ɔ', 'D': 'p', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': 'פ', 'H': 'H', 'I': 'I',
    'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'd',
    'Q': 'b', 'R': 'ɹ', 'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ', 'W': 'M',
    'X': 'X', 'Y': '⅄', 'Z': 'Z', '?': '¿', '!': '¡', '.': '˙', '_': '‾'
  };

  return str.split('').reverse().map(char => map[char] || char).join('');
}
