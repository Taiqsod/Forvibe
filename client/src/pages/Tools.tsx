import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Sparkles, MessageCircle, Send, Loader2, ImagePlus, X } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Tools() {
  return (
    <div className="min-h-screen bg-[url('/grid-pattern.svg')] bg-fixed pb-20">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-8 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-display text-gradient mb-4">Creative Tools</h1>
          <p className="text-muted-foreground">Little utilities to express your vibe</p>
        </div>

        <Tabs defaultValue="fancy-text" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto mb-8 p-1 h-14 bg-white/50 dark:bg-white/10 backdrop-blur rounded-full border border-primary/10">
            <TabsTrigger value="fancy-text" className="rounded-full h-12 data-[state=active]:bg-primary data-[state=active]:text-white transition-all" data-testid="tab-fancy-text">
              <Sparkles className="w-4 h-4 mr-2" /> Fancy Text
            </TabsTrigger>
            <TabsTrigger value="ai-chat" className="rounded-full h-12 data-[state=active]:bg-primary data-[state=active]:text-white transition-all" data-testid="tab-ai-chat">
              <MessageCircle className="w-4 h-4 mr-2" /> Chat with AI
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="fancy-text" className="outline-none">
            <FancyTextGenerator />
          </TabsContent>
          
          <TabsContent value="ai-chat" className="outline-none">
            <AIChatbot />
          </TabsContent>
        </Tabs>
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
      description: "Text copied to clipboard",
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
          className="text-2xl h-16 rounded-2xl border-2 focus-visible:ring-primary/20 bg-white/50 dark:bg-white/10"
          placeholder="Type here..."
          data-testid="input-fancy-text"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {generators.map((gen) => {
          const result = gen.fn(input);
          return (
            <div key={gen.name} className="p-4 rounded-xl bg-white/40 dark:bg-white/10 border border-white/20 hover:border-primary/30 transition-colors group relative">
              <div className="text-xs font-bold text-muted-foreground mb-2 uppercase">{gen.name}</div>
              <div className="text-lg font-medium pr-8 truncate">{result || <span className="opacity-30">Result</span>}</div>
              
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(result)}
                data-testid={`button-copy-${gen.name.toLowerCase().replace(' ', '-')}`}
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

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
}

function formatAIResponse(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`(.*?)`/g, '$1');
}

function AIChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Error", description: "Image must be less than 5MB", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startConversation = async () => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Chat" }),
      });
      const data = await res.json();
      setConversationId(data.id);
      return data.id;
    } catch (error) {
      toast({ title: "Error", description: "Failed to start conversation", variant: "destructive" });
      return null;
    }
  };

  const sendMessage = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage = input.trim();
    const imageToSend = selectedImage;
    setInput("");
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setMessages(prev => [...prev, { role: "user", content: userMessage, imageUrl: imageToSend || undefined }]);
    setIsLoading(true);

    try {
      let convId = conversationId;
      if (!convId) {
        convId = await startConversation();
        if (!convId) {
          setIsLoading(false);
          return;
        }
      }

      const res = await fetch(`/api/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMessage, imageUrl: imageToSend }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                assistantMessage += data.content;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: assistantMessage };
                  return updated;
                });
              }
            } catch {
            }
          }
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to get response", variant: "destructive" });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-3xl overflow-hidden flex flex-col h-[500px]"
    >
      <div className="p-4 border-b border-primary/10 bg-primary/5">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          Chat with AI
        </h3>
        <p className="text-sm text-muted-foreground">Ask anything, or share an image for analysis</p>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Start a conversation!</p>
              <p className="text-sm">Ask me anything creative</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
                data-testid={`message-${msg.role}-${idx}`}
              >
                {msg.imageUrl && (
                  <img 
                    src={msg.imageUrl} 
                    alt="Uploaded" 
                    className="max-w-full max-h-48 rounded-lg mb-2 object-contain"
                  />
                )}
                {msg.content && <p className="whitespace-pre-wrap">{formatAIResponse(msg.content)}</p>}
              </div>
            </div>
          ))}
          
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-muted px-4 py-3 rounded-2xl">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-primary/10 bg-white/50 dark:bg-white/5">
        {selectedImage && (
          <div className="mb-3 relative inline-block">
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="max-h-24 rounded-lg object-contain border border-primary/20"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-md hover:bg-destructive/90"
              data-testid="button-remove-image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            ref={fileInputRef}
            className="hidden"
            data-testid="input-image-upload"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="icon"
            className="rounded-full flex-shrink-0"
            disabled={isLoading}
            data-testid="button-add-image"
          >
            <ImagePlus className="w-4 h-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 rounded-full bg-white dark:bg-white/10"
            disabled={isLoading}
            data-testid="input-chat-message"
          />
          <Button 
            onClick={sendMessage} 
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className="rounded-full"
            size="icon"
            data-testid="button-send-message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

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
    return i === -1 ? char : Array.from(target)[i];
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
