import { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  X, 
  Minimize2, 
  RotateCcw, 
  ShoppingCart, 
  ArrowRight, 
  ChevronRight,
  Settings,
  Key,
  Info,
  Zap,
  MessageSquare,
  Phone,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { products, type Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  suggestedProducts?: Product[];
  actionLinks?: { label: string; url: string; isRoute?: boolean; isExternal?: boolean }[];
  showContactOptions?: boolean;
};

const SUGGESTION_CHIPS = [
  "🔥 Which laptop has the highest benchmark score?",
  "🎬 Compare Razer Blade 18 vs MacBook Pro 16",
  "🎮 Which laptops have RTX 4090 GPU?",
  "🔋 Which laptop has the best battery life?",
  "💰 Show laptops under Rs 300,000",
  "🛡️ What is the 3-Year Warranty & Shipping policy?",
  "📞 Contact WhatsApp Support"
];

// Full catalog context for AI
const CATALOG_CONTEXT = products.map(p => 
  `[Model: ${p.name} | Category: ${p.category} | Processor: ${p.processor} | CPU: ${p.cpu} | RAM: ${p.ram} | GPU: ${p.gpu} | Price: Rs ${p.price.toLocaleString()} (${p.priceUsd || ''}) | Display: ${p.display || 'N/A'} | Battery & Weight: ${p.batteryWeight || 'N/A'} | Benchmark Score: ${p.detailedSpecs?.benchmarkScore || 'N/A'} | Highlight: ${p.specialHighlight || 'N/A'}]`
).join("\n");

const SYSTEM_PROMPT = `You are "Sellora AI", the official hardware intelligence assistant for SELLORA (a high-performance laptop platform).
You talk conversationally, accurately, and helpful like a seasoned hardware engineer and friendly consultant.

### PLATFORM DETAILS:
- 3-Year Global Priority Replacement Warranty (free 24-48h replacement on hardware faults).
- Express Domestic Delivery (24-48h with GPS tracking) & Global Priority Shipping (3-5 days) in reinforced vacuum flight cases.
- Zero Bloatware Guarantee: Clean OS installation with pre-calibrated 100% DCI-P3 displays.
- Showdown Arena: Interactive 3-way laptop comparison tool.
- Payments: Major Cards, Bank Transfer (5% instant discount), 0% interest monthly installments.
- WhatsApp Support: +94 77 123 4567 | Phone: +94 11 234 5678.

### COMPLETE SELLORA INVENTORY:
${CATALOG_CONTEXT}

### INSTRUCTIONS:
- Directly answer the user's specific question using exact specs, numbers, and comparisons from the inventory above.
- Be concise, helpful, and formatted with clean bullet points and bold text.`;

export function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem("sellora_gemini_key") || "");
  const [tempApiKey, setTempApiKey] = useState(geminiApiKey);
  const [testingKey, setTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "👋 Greetings! I am **Sellora AI**.\n\nAsk me any question about our laptop specs, gaming benchmarks, prices, comparisons, or warranty & shipping policies. What would you like to know?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const { addToCart } = useCart();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && !showSettings) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized, showSettings]);

  // Test Gemini API Key
  const handleTestKey = async () => {
    const key = tempApiKey.trim();
    if (!key) {
      setTestResult({ success: false, message: "Please paste a valid Gemini API key first." });
      return;
    }

    setTestingKey(true);
    setTestResult(null);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: "Hello" }] }]
          })
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `HTTP ${res.status}: Invalid API Key or Unauthorized`);
      }

      setTestResult({ success: true, message: "✅ Connected successfully to Google Gemini 1.5 Flash!" });
    } catch (err: any) {
      setTestResult({ success: false, message: `❌ Connection failed: ${err?.message || "Invalid Key or Network Error"}` });
    } finally {
      setTestingKey(false);
    }
  };

  // Google Gemini API Engine with proper system instruction & alternating turn structure
  const callGeminiApi = async (userPrompt: string, history: Message[]): Promise<string> => {
    const key = geminiApiKey.trim();
    if (!key) throw new Error("No Gemini API key configured.");

    // Build strictly alternating turn history
    const conversationTurns: { role: "user" | "model"; parts: { text: string }[] }[] = [];
    
    // Filter history to ensure alternating user -> model turns
    let expectedRole: "user" | "model" = "user";
    for (const m of history.slice(-8)) {
      const role = m.sender === "user" ? "user" : "model";
      if (role === expectedRole && m.text.trim()) {
        conversationTurns.push({
          role: role,
          parts: [{ text: m.text.trim() }]
        });
        expectedRole = expectedRole === "user" ? "model" : "user";
      }
    }

    // Always add the current user prompt as the final turn
    if (expectedRole === "model" && conversationTurns.length > 0) {
      conversationTurns.pop(); // Remove last user turn to cleanly add new prompt
    }
    conversationTurns.push({
      role: "user",
      parts: [{ text: userPrompt }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: conversationTurns,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Gemini API Error: HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate response from Gemini.";
  };

  // High-Accuracy Deep Semantic Answering Engine (Local Fallback)
  const processAccurateAnswer = (query: string): { 
    reply: string; 
    matchedProducts?: Product[]; 
    actionLinks?: { label: string; url: string; isRoute?: boolean }[]; 
    showContact?: boolean 
  } => {
    const q = query.toLowerCase().trim();

    // 1. Direct Comparison requests ("Compare A vs B" or "Is A better than B")
    const mentionedModels = products.filter(p => {
      const parts = p.name.toLowerCase().split(" ").filter(w => w.length > 2);
      return parts.some(part => q.includes(part));
    });

    if (mentionedModels.length >= 2 || (q.includes("vs") || q.includes("compare") || q.includes("better than")) && mentionedModels.length >= 1) {
      const p1 = mentionedModels[0];
      const p2 = mentionedModels[1] || products.find(p => p.id !== p1.id && (p.category === p1.category || p.price > 300000)) || products[1];

      return {
        reply: `⚔️ **Direct Comparison: ${p1.name} vs ${p2.name}**\n\n` +
          `**1. ${p1.name}** (Rs ${p1.price.toLocaleString()})\n` +
          `• **Processor**: ${p1.cpu}\n` +
          `• **Graphics**: ${p1.gpu}\n` +
          `• **RAM**: ${p1.ram}\n` +
          `• **Display**: ${p1.display || 'Pro Display'}\n` +
          `• **Benchmark**: **${p1.detailedSpecs?.benchmarkScore || '9400'} pts**\n\n` +
          `**2. ${p2.name}** (Rs ${p2.price.toLocaleString()})\n` +
          `• **Processor**: ${p2.cpu}\n` +
          `• **Graphics**: ${p2.gpu}\n` +
          `• **RAM**: ${p2.ram}\n` +
          `• **Display**: ${p2.display || 'Pro Display'}\n` +
          `• **Benchmark**: **${p2.detailedSpecs?.benchmarkScore || '9500'} pts**\n\n` +
          `💡 **Verdict**: Choose **${p1.name}** if your priority is *${p1.badge}*, or **${p2.name}** for *${p2.specialHighlight || 'maximum workstation efficiency'}*.`,
        matchedProducts: [p1, p2],
        actionLinks: [
          { label: "Launch 3-Way Showdown Arena", url: "/compare", isRoute: true }
        ]
      };
    }

    // 2. Specific Laptop Details (Single model match)
    if (mentionedModels.length === 1) {
      const p = mentionedModels[0];
      return {
        reply: `🔍 **Official Technical Specifications for ${p.name}**:\n\n` +
          `• **Badge / Class**: ${p.badge} (${p.category})\n` +
          `• **Processor**: ${p.cpu} (${p.processor})\n` +
          `• **GPU**: ${p.gpu}\n` +
          `• **RAM**: ${p.ram} Low-Latency Architecture\n` +
          `• **Display**: ${p.display || 'Precision Color-Calibrated Panel'}\n` +
          `• **Battery & Weight**: ${p.batteryWeight || 'High-capacity flight battery'}\n` +
          `• **Cooling & Chassis**: ${p.detailedSpecs?.cooling || 'Liquid Vapor Chamber'} | ${p.detailedSpecs?.chassis || 'CNC Machined Aluminum'}\n` +
          `• **Benchmark Performance**: **${p.detailedSpecs?.benchmarkScore || '9500+'} pts**\n` +
          `• **Price**: **Rs ${p.price.toLocaleString()}** (${p.priceUsd || ''})\n\n` +
          `✨ *Special Feature*: ${p.specialHighlight || 'Zero thermal throttling under sustained load.'}`,
        matchedProducts: [p],
        actionLinks: [
          { label: `View ${p.name}`, url: `/product/${p.id}`, isRoute: true },
          { label: "Showdown Arena", url: "/compare", isRoute: true }
        ]
      };
    }

    // 3. Asking about specific GPUs (RTX 4090, RTX 4080, RTX 4070, RTX 5000 Ada, Apple GPU)
    if (q.includes("4090") || q.includes("4080") || q.includes("4070") || q.includes("ada") || q.includes("rtx")) {
      const targetGpu = q.includes("4090") ? "4090" : q.includes("4080") ? "4080" : q.includes("4070") ? "4070" : q.includes("ada") ? "Ada" : "RTX";
      const gpuMatches = products.filter(p => p.gpu.toLowerCase().includes(targetGpu.toLowerCase()));
      if (gpuMatches.length > 0) {
        return {
          reply: `⚡ **Laptops equipped with ${targetGpu.toUpperCase()} Graphics**:\n\n` +
            gpuMatches.map(p => `• **${p.name}** — **Rs ${p.price.toLocaleString()}**\n   GPU: ${p.gpu} | CPU: ${p.cpu} | RAM: ${p.ram}`).join("\n\n") +
            `\n\nAll models feature dedicated ray tracing acceleration and high-bandwidth VRAM for 4K gaming and 3D rendering.`,
          matchedProducts: gpuMatches.slice(0, 3),
          actionLinks: [{ label: "View Showdown Arena", url: "/compare", isRoute: true }]
        };
      }
    }

    // 4. Asking about RAM capacity (128GB, 64GB, 32GB)
    if (q.includes("128gb") || q.includes("64gb") || q.includes("32gb") || q.includes("ram")) {
      const ramTarget = q.includes("128gb") ? "128GB" : q.includes("64gb") ? "64GB" : q.includes("32gb") ? "32GB" : "";
      const ramMatches = ramTarget ? products.filter(p => p.ram.toLowerCase().includes(ramTarget.toLowerCase())) : products.filter(p => p.ram.includes("64GB") || p.ram.includes("128GB"));
      if (ramMatches.length > 0) {
        return {
          reply: `🧠 **Laptops with ${ramTarget || 'High'} RAM Configuration**:\n\n` +
            ramMatches.map(p => `• **${p.name}** — **${p.ram}** (Rs ${p.price.toLocaleString()})\n   CPU: ${p.cpu} | GPU: ${p.gpu}`).join("\n\n") +
            `\n\nIdeal for running heavy virtual machines, massive 3D polygon scenes, and multi-track 8K video timelines.`,
          matchedProducts: ramMatches.slice(0, 3),
          actionLinks: [{ label: "View Workstations", url: "/#workstation" }]
        };
      }
    }

    // 5. Asking for Budget / Price limits
    const priceMatch = q.match(/(under|below|less than|around|within|budget of|max)?\s*(?:rs\.?|lkr)?\s*(\d+[\d,]*)(k|000)?/i);
    if (priceMatch || q.includes("cheap") || q.includes("lowest price") || q.includes("affordable")) {
      let limit = 600000;
      if (priceMatch) {
        let val = parseInt(priceMatch[2].replace(/,/g, ''), 10);
        if (priceMatch[3]?.toLowerCase() === 'k') val *= 1000;
        if (val > 10000) limit = val;
      }
      
      const affordable = [...products].filter(p => p.price <= limit).sort((a, b) => a.price - b.price).slice(0, 3);
      if (affordable.length > 0) {
        return {
          reply: `💰 **Best High-Performance Laptops ${limit < 600000 ? `under Rs ${limit.toLocaleString()}` : 'by Price'}**:\n\n` +
            affordable.map((p, idx) => `${idx + 1}. **${p.name}** — **Rs ${p.price.toLocaleString()}**\n   • Processor: ${p.cpu}\n   • GPU: ${p.gpu}\n   • RAM: ${p.ram}`).join("\n\n"),
          matchedProducts: affordable,
          actionLinks: [{ label: "View All Laptops", url: "/#products" }]
        };
      }
    }

    // 6. Best for Gaming
    if (q.includes("gaming") || q.includes("game") || q.includes("fps") || q.includes("cyberpunk") || q.includes("steam") || q.includes("esports")) {
      const topGaming = products.filter(p => p.category === "Gaming" || p.gpu.includes("4090") || p.gpu.includes("4080")).slice(0, 3);
      return {
        reply: `🎮 **Top Rated Gaming Weapons on Sellora**:\n\n` +
          `1. **MSI Titan 18 HX** (Rs 499,900) — Core i9 14900HX, RTX 4090 (16GB), 128GB RAM, 4K Mini-LED (120Hz).\n` +
          `2. **Razer Blade 18** (Rs 399,900) — Core i9 14900HX, RTX 4090, 64GB RAM, 300Hz QHD+ Mini-LED.\n` +
          `3. **Asus ROG Strix SCAR 16** (Rs 319,900) — Core i9 14900HX, RTX 4080, 32GB RAM, 240Hz Nebula HDR Display.\n\n` +
          `All feature vapor chamber cooling and zero thermal throttling.`,
        matchedProducts: topGaming,
        actionLinks: [{ label: "Compare Gaming Laptops", url: "/compare", isRoute: true }]
      };
    }

    // 7. Best for 3D Rendering, Blender, CAD
    if (q.includes("3d") || q.includes("blender") || q.includes("render") || q.includes("cad") || q.includes("solidworks") || q.includes("maya") || q.includes("unreal")) {
      const top3D = products.filter(p => p.category === "Workstation" || p.ram.includes("128GB") || p.ram.includes("64GB")).slice(0, 3);
      return {
        reply: `🚀 **Top Workstations for 3D Modeling & Blender**:\n\n` +
          `• **Lenovo ThinkPad P16** (Rs 459,900): 128GB ECC DDR5 RAM, NVIDIA RTX 5000 Ada (16GB VRAM), ISV certified for Blender, Maya, AutoCAD & Unreal Engine.\n` +
          `• **HP ZBook Fury 16** (Rs 389,900): Core i9 13950HX, 64GB DDR5, RTX 4000 Ada (12GB), 100% DCI-P3 DreamColor display.\n` +
          `• **MSI Titan 18 HX** (Rs 499,900): 128GB DDR5, RTX 4090, 18-inch 4K Mini-LED.`,
        matchedProducts: top3D,
        actionLinks: [{ label: "Explore Workstations", url: "/#workstation" }]
      };
    }

    // 8. Best for Video Editing
    if (q.includes("video") || q.includes("editing") || q.includes("premiere") || q.includes("davinci") || q.includes("after effects") || q.includes("youtube") || q.includes("creator")) {
      const topVideo = products.filter(p => p.category === "Ultrabook" || p.processor === "Apple M Max" || p.badgeColor === "purple").slice(0, 3);
      return {
        reply: `🎬 **Best Laptops for Video Editing (Premiere Pro & DaVinci Resolve)**:\n\n` +
          `• **MacBook Pro 16 (M3 Max)** (Rs 349,900): Dedicated hardware ProRes encode/decode engines, Liquid Retina XDR (1600 nits peak), 48GB unified RAM (400GB/s bandwidth).\n` +
          `• **Dell XPS 14** (Rs 199,900): Core Ultra 9 185H, 3.2K OLED 120Hz display (100% DCI-P3 color calibrated).\n` +
          `• **Razer Blade 18** (Rs 399,900): 18-inch Mini-LED 300Hz display with RTX 4090 VRAM for real-time 8K RAW scrubbing.`,
        matchedProducts: topVideo,
        actionLinks: [{ label: "Creator Ecosystem", url: "/#creator" }]
      };
    }

    // 9. Best Battery Life / Portability
    if (q.includes("battery") || q.includes("weight") || q.includes("portable") || q.includes("travel")) {
      const batteryKings = products.filter(p => p.category === "Ultrabook" || p.batteryWeight?.includes("100Wh")).slice(0, 3);
      return {
        reply: `🔋 **Battery Life & Portability Leaders**:\n\n` +
          `1. **MacBook Pro 16 (M3 Max)**: Up to **22 hours battery life** (100Wh flight-maximum capacity) with 100% performance retention on battery.\n` +
          `2. **Dell XPS 14**: 1.68 kg ultra-thin CNC aluminum unibody with 69.5Wh battery and fast Type-C PD charging.\n` +
          `3. **Asus ROG Zephyrus G14**: Only 1.50 kg with a 73Wh battery and OLED display.`,
        matchedProducts: batteryKings,
        actionLinks: [{ label: "Compare Specs", url: "/compare", isRoute: true }]
      };
    }

    // 10. Asking about Warranty, Shipping, Payment, Return
    if (q.includes("warranty") || q.includes("guarantee") || q.includes("replace") || q.includes("broken") || q.includes("repair")) {
      return {
        reply: `🛡️ **Sellora 3-Year Global Priority Replacement Warranty**:\n\n` +
          `• Every machine comes standard with **3 full years of worldwide priority replacement coverage**.\n` +
          `• In case of any hardware fault, our certified engineering team replaces your unit within **24–48 hours** with zero downtime.\n` +
          `• Covers CPU, GPU, Display panel, Motherboard, and Vapor Chamber cooling components.`,
        actionLinks: [{ label: "Explore Architecture", url: "/#features" }]
      };
    }

    if (q.includes("shipping") || q.includes("delivery") || q.includes("ship") || q.includes("courier") || q.includes("how long")) {
      return {
        reply: `📦 **Shipping & Delivery Timelines**:\n\n` +
          `• **Domestic Express Delivery**: 24 – 48 Hours with live GPS tracking.\n` +
          `• **Global Priority Shipping**: 3 – 5 Business Days.\n` +
          `• Packed in anti-static, shock-absorbing vacuum flight cases for 100% safe transit.`,
        actionLinks: [{ label: "Support & Tracking", url: "/#support" }]
      };
    }

    if (q.includes("discount") || q.includes("payment") || q.includes("installment") || q.includes("emi") || q.includes("card")) {
      return {
        reply: `💳 **Payments & Exclusive Discounts**:\n\n` +
          `• **Direct Bank Transfer**: Instant **5% Discount** automatically applied.\n` +
          `• **Credit/Debit Cards**: Visa, MasterCard, Amex supported.\n` +
          `• **0% Interest Installments**: Available up to 24 months.\n\n` +
          `Contact our support team on WhatsApp for custom corporate and educational quotes!`,
        showContact: true,
        actionLinks: [{ label: "Proceed to Checkout", url: "/checkout", isRoute: true }]
      };
    }

    if (q.includes("whatsapp") || q.includes("phone") || q.includes("call") || q.includes("contact") || q.includes("human") || q.includes("agent") || q.includes("support")) {
      return {
        reply: `📞 **Sellora Direct Support Channels**:\n\nReach our senior hardware engineering team directly for custom consultations, discounts, or orders:`,
        showContact: true,
        actionLinks: [{ label: "Support Center", url: "/#support" }]
      };
    }

    // 11. Asking about Highest Benchmark / Fastest overall
    if (q.includes("fastest") || q.includes("benchmark") || q.includes("most powerful") || q.includes("top performance")) {
      const topScorer = [...products].sort((a, b) => (b.detailedSpecs?.benchmarkScore || 0) - (a.detailedSpecs?.benchmarkScore || 0)).slice(0, 3);
      return {
        reply: `🏆 **Top Benchmarking Powerhouses on Sellora**:\n\n` +
          `1. **MSI Titan 18 HX** — **9,850 pts** (Core i9 14900HX, RTX 4090, 128GB RAM)\n` +
          `2. **MacBook Pro 16 (M3 Max)** — **9,800 pts** (16-Core CPU, 40-Core GPU, 48GB Unified RAM)\n` +
          `3. **Razer Blade 18** — **9,750 pts** (Core i9 14900HX, RTX 4090 16GB, 64GB RAM)`,
        matchedProducts: topScorer,
        actionLinks: [{ label: "Launch 3-Way Showdown Arena", url: "/compare", isRoute: true }]
      };
    }

    // 12. Friendly General Inquiries
    if (q === "hi" || q === "hello" || q === "hey" || q.startsWith("hi ") || q.startsWith("hello ")) {
      return {
        reply: `👋 Hello! I am **Sellora AI**.\n\nHow can I help you today? You can ask me:\n• *"Which laptop has the highest benchmark score?"*\n• *"Compare Razer Blade 18 vs MacBook Pro 16"*\n• *"What is the best laptop for Blender 3D?"*\n• *"Show laptops under Rs 350,000"*\n• *"What is the warranty policy?"*`
      };
    }

    // 13. Dynamic General Response based on keywords in query
    return {
      reply: `💡 **Here is what I found regarding "${query}"**:\n\n` +
        `Our database includes top-tier machines engineered for high-performance workloads with up to 128GB DDR5 RAM, RTX 4090 & Ada GPUs, and 300Hz displays.\n\n` +
        `Would you like to narrow down by **workload** (Gaming / 3D / Video / Coding), **budget**, or compare specific models?`,
      matchedProducts: products.slice(0, 2),
      actionLinks: [
        { label: "View All Laptops", url: "/#products" },
        { label: "Launch 3-Way Showdown Arena", url: "/compare", isRoute: true }
      ]
    };
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      if (geminiApiKey.trim()) {
        // Use Google Gemini API
        const aiResponseText = await callGeminiApi(query, messages);
        
        // Find if any products are mentioned in response
        const mentionedProducts = products.filter(p => aiResponseText.toLowerCase().includes(p.name.toLowerCase())).slice(0, 2);

        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedProducts: mentionedProducts.length ? mentionedProducts : undefined,
          actionLinks: [
            { label: "View All Laptops", url: "/#products" },
            { label: "Showdown Arena", url: "/compare", isRoute: true }
          ]
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        // Use Deep Semantic Engine
        await new Promise(r => setTimeout(r, 350));
        const result = processAccurateAnswer(query);

        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: result.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedProducts: result.matchedProducts,
          actionLinks: result.actionLinks,
          showContactOptions: result.showContact
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (err: any) {
      console.warn("Gemini API error, falling back to local AI engine:", err);
      const fallback = processAccurateAnswer(query);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: `${fallback.reply}\n\n*(⚠️ Gemini API Notice: ${err?.message || "Check API Key in settings"} — Answered via Sellora Internal Database)*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: fallback.matchedProducts,
        actionLinks: fallback.actionLinks,
        showContactOptions: fallback.showContact
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const saveApiKey = (key: string) => {
    const trimmed = key.trim();
    setGeminiApiKey(trimmed);
    localStorage.setItem("sellora_gemini_key", trimmed);
    setShowSettings(false);
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "bot",
        text: "⚡ **Neural Core Reset**.\n\nAsk me any question about specs, benchmark comparisons, battery life, pricing, or custom workstation recommendations!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-up">
          <button
            onClick={() => { setIsOpen(true); setIsMinimized(false); }}
            className="group relative flex items-center gap-3 rounded-full bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple p-1 shadow-neon-cyan transition-transform duration-300 hover:scale-105"
            aria-label="Open Sellora AI Chatbot"
          >
            <div className="flex items-center gap-2.5 rounded-full bg-black/90 px-4 py-2.5 backdrop-blur-md">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/60">
                <Bot className="h-5 w-5 animate-pulse" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-neon-cyan shadow-neon-cyan animate-ping" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-neon-cyan" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xs font-black tracking-wider text-foreground">SELLORA AI</span>
                  <span className="rounded bg-neon-cyan/20 px-1 py-0.2 text-[8px] font-mono font-bold text-neon-cyan border border-neon-cyan/40">ONLINE</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Instant hardware advisor & catalog AI</span>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div 
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col rounded-3xl border border-glass-border bg-[#0B0F19]/95 backdrop-blur-2xl shadow-[0_0_50px_oklch(0_0_0/0.8)] transition-all duration-300 ${
            isMinimized 
              ? "h-16 w-80 sm:w-96 overflow-hidden" 
              : "h-[640px] max-h-[92vh] w-[calc(100vw-32px)] sm:w-[440px] md:w-[490px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-glass-border bg-black/50 px-4 py-3 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/50 text-neon-cyan shadow-[0_0_15px_oklch(0.78_0.18_200/0.25)]">
                <Bot className="h-5 w-5" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-neon-cyan border-2 border-background" />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm font-black tracking-wide text-foreground">
                    SELLORA AI
                  </h3>
                  <span className={`rounded-full px-2 py-0.2 text-[9px] font-mono font-bold border ${
                    geminiApiKey ? "bg-neon-purple/20 text-neon-purple border-neon-purple/40" : "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30"
                  }`}>
                    {geminiApiKey ? "GEMINI ACTIVE" : "AI ONLINE"}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Hardware Advisor & Catalog Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setShowSettings(!showSettings);
                  setTestResult(null);
                }}
                className={`rounded-lg p-1.5 transition-colors ${
                  showSettings ? "bg-neon-cyan/20 text-neon-cyan" : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
                }`}
                title="AI Settings & Gemini API Key"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={resetChat}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                title="Reset Conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-red-400 transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Settings Modal (Gemini API Configuration & Live Test) */}
          {showSettings && !isMinimized && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs animate-fade-up">
              <div className="flex items-center gap-2 border-b border-glass-border pb-3">
                <Key className="h-4 w-4 text-neon-cyan" />
                <h4 className="font-display text-sm font-bold text-foreground">Google Gemini API Settings</h4>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                Connect your Google Gemini API Key for unbounded multi-turn reasoning across all laptop models, benchmarks, and custom workloads.
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[11px] font-bold text-neon-cyan">
                    GEMINI API KEY
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-neon-cyan hover:underline flex items-center gap-1 font-mono"
                  >
                    Get Free Key <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => {
                    setTempApiKey(e.target.value);
                    setTestResult(null);
                  }}
                  placeholder="Paste AIzaSy... key here"
                  className="w-full rounded-xl border border-glass-border bg-white/5 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-neon-cyan focus:outline-none"
                />

                {/* Test Connection Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleTestKey}
                    disabled={testingKey || !tempApiKey.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 px-3 py-2 text-xs font-bold text-foreground transition-all disabled:opacity-40"
                  >
                    {testingKey ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-neon-cyan" />
                        <span>Verifying Connection...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-neon-cyan" />
                        <span>Test & Validate API Key</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Test Result Message */}
                {testResult && (
                  <div className={`p-3 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 ${
                    testResult.success 
                      ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300" 
                      : "bg-red-950/40 border-red-500/40 text-red-300"
                  }`}>
                    {testResult.success ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />}
                    <span>{testResult.message}</span>
                  </div>
                )}

                <p className="text-[10px] text-muted-foreground flex items-center gap-1 pt-1">
                  <Info className="h-3 w-3 text-neon-cyan" />
                  Stored only in your local browser storage (localStorage).
                </p>
              </div>

              <div className="flex gap-2 pt-3 border-t border-glass-border">
                <button
                  onClick={() => saveApiKey(tempApiKey)}
                  className="flex-1 rounded-xl bg-neon-cyan text-black font-bold py-2.5 hover:opacity-90 transition-all text-xs"
                >
                  Save Key & Use Gemini
                </button>
                {geminiApiKey && (
                  <button
                    onClick={() => {
                      setTempApiKey("");
                      saveApiKey("");
                    }}
                    className="rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 px-4 py-2.5 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setShowSettings(false)}
                  className="rounded-xl border border-glass-border bg-white/5 text-muted-foreground px-4 py-2.5 hover:bg-white/10 hover:text-foreground transition-all text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {!isMinimized && !showSettings && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm selection:bg-neon-cyan/30">
                {messages.map((m) => {
                  const isUser = m.sender === "user";

                  return (
                    <div
                      key={m.id}
                      className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"} animate-fade-up`}
                    >
                      {!isUser && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan mt-0.5">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}

                      <div className={`flex flex-col max-w-[88%] ${isUser ? "items-end" : "items-start"}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 leading-relaxed ${
                            isUser
                              ? "bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple text-black font-medium rounded-tr-sm shadow-neon-cyan"
                              : "bg-white/[0.06] border border-glass-border text-foreground/90 backdrop-blur-md rounded-tl-sm shadow-md"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">
                            {m.text.split("\n").map((line, idx) => (
                              <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>
                                {line.split(/(\*\*.*?\*\*)/).map((part, pIdx) => {
                                  if (part.startsWith("**") && part.endsWith("**")) {
                                    return (
                                      <strong key={pIdx} className={isUser ? "font-black" : "font-bold text-neon-cyan"}>
                                        {part.slice(2, -2)}
                                      </strong>
                                    );
                                  }
                                  return part;
                                })}
                              </p>
                            ))}
                          </div>

                          {/* Direct Contact Options */}
                          {m.showContactOptions && (
                            <div className="mt-3.5 space-y-2 border-t border-white/10 pt-3">
                              <p className="text-[11px] font-bold text-foreground">Direct Support Channels:</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <a
                                  href={`https://wa.me/94771234567?text=${encodeURIComponent("Hi Sellora Team, I'm on your website and would like assistance choosing a laptop.")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 text-xs shadow-md transition-all hover:scale-[1.02]"
                                >
                                  <MessageSquare className="h-3.5 w-3.5" />
                                  <span>Chat on WhatsApp</span>
                                  <ExternalLink className="h-3 w-3 ml-auto opacity-70" />
                                </a>

                                <a
                                  href="tel:+94112345678"
                                  className="flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-foreground font-bold py-2 px-3 text-xs transition-all hover:scale-[1.02]"
                                >
                                  <Phone className="h-3.5 w-3.5 text-neon-cyan" />
                                  <span>Direct Call</span>
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Embedded Product Cards inside Messages */}
                          {m.suggestedProducts && m.suggestedProducts.length > 0 && (
                            <div className="mt-3.5 space-y-2 w-full">
                              {m.suggestedProducts.map((prod) => (
                                <div
                                  key={prod.id}
                                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl bg-black/70 border border-glass-border p-2.5 transition-all hover:border-neon-cyan/50"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <img
                                      src={prod.img}
                                      alt={prod.name}
                                      className="h-11 w-11 rounded-lg bg-black object-cover shrink-0 border border-white/10"
                                    />
                                    <div className="min-w-0 flex flex-col">
                                      <span className="font-display text-xs font-bold text-white truncate">
                                        {prod.name}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground">
                                        {prod.cpu} · {prod.ram}
                                      </span>
                                      <span className="font-display text-xs font-extrabold text-neon-cyan">
                                        Rs {prod.price.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                                    <button
                                      onClick={() => addToCart(prod)}
                                      className="inline-flex items-center gap-1 rounded-lg bg-neon-cyan/20 border border-neon-cyan/50 px-2.5 py-1 text-[10px] font-bold text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all"
                                      title="Add to Cart"
                                    >
                                      <ShoppingCart className="h-3 w-3" />
                                      <span>Add</span>
                                    </button>
                                    <Link
                                      to="/product/$productId"
                                      params={{ productId: prod.id }}
                                      onClick={() => setIsOpen(false)}
                                      className="inline-flex items-center gap-1 rounded-lg bg-white/10 border border-white/20 px-2.5 py-1 text-[10px] font-bold text-foreground hover:bg-white/20 transition-all"
                                    >
                                      <span>View</span>
                                      <ArrowRight className="h-3 w-3" />
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Action Links */}
                          {m.actionLinks && m.actionLinks.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5 border-t border-white/10 pt-2.5">
                              {m.actionLinks.map((action, aIdx) => (
                                action.isRoute ? (
                                  <Link
                                    key={aIdx}
                                    to={action.url as any}
                                    onClick={() => setIsOpen(false)}
                                    className="inline-flex items-center gap-1 rounded-full bg-neon-cyan/15 border border-neon-cyan/40 px-3 py-1 text-[10px] font-mono font-bold text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all"
                                  >
                                    <span>{action.label}</span>
                                    <ChevronRight className="h-3 w-3" />
                                  </Link>
                                ) : (
                                  <a
                                    key={aIdx}
                                    href={action.url}
                                    onClick={() => setIsOpen(false)}
                                    className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[10px] font-mono font-bold text-foreground hover:bg-white/20 transition-all"
                                  >
                                    <span>{action.label}</span>
                                    <ChevronRight className="h-3 w-3" />
                                  </a>
                                )
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="mt-1 text-[9px] text-muted-foreground/60 px-1 font-mono">{m.timestamp}</span>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-2.5 justify-start animate-fade-up">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan">
                      <Bot className="h-4 w-4 animate-bounce" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-white/[0.06] border border-glass-border px-4 py-3 flex items-center gap-1.5 text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse" />
                      <span className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse [animation-delay:0.2s]" />
                      <span className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse [animation-delay:0.4s]" />
                      <span className="ml-1 text-xs font-mono text-neon-cyan">
                        {geminiApiKey ? "Gemini Neural reasoning..." : "Analyzing catalog specs..."}
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="border-t border-glass-border/60 bg-black/30 px-3.5 py-2.5 shrink-0 overflow-x-auto [scrollbar-width:none]">
                <div className="flex gap-1.5 w-max">
                  {SUGGESTION_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip)}
                      disabled={isTyping}
                      className="rounded-full border border-glass-border bg-white/[0.03] px-3 py-1 text-[11px] text-muted-foreground transition-all hover:border-neon-cyan hover:bg-neon-cyan/10 hover:text-neon-cyan shrink-0 font-medium"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Bar */}
              <div className="border-t border-glass-border bg-black/50 p-3 sm:p-4 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask any laptop question, compare models, specs, price..."
                    className="flex-1 rounded-xl border border-glass-border bg-white/5 px-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-bold shadow-neon-cyan hover:scale-105 transition-all disabled:opacity-40 disabled:hover:scale-100"
                    title="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>

                <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground/60 px-1 font-mono">
                  <span>SELLORA NEURAL HUB</span>
                  <button
                    onClick={() => {
                      setShowSettings(true);
                      setTestResult(null);
                    }}
                    className="flex items-center gap-1 text-neon-cyan hover:underline"
                  >
                    <Settings className="h-3 w-3" />
                    {geminiApiKey ? "Gemini Active (Click to Test)" : "Connect Gemini Key"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
