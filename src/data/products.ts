const gaming = "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80";
const creator = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80";
const workstation = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80";
const business = "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80";
const gaming2 = "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?auto=format&fit=crop&w=1200&q=80";
const creator2 = "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80";

export type Product = {
  id: string;
  name: string;
  badge: string;
  badgeColor: "cyan" | "purple" | "blue";
  category: "Gaming" | "Ultrabook" | "Workstation";
  processor: "Intel i9" | "AMD Ryzen 9" | "Apple M Max";
  price: number;
  priceUsd?: string;
  cpu: string;
  ram: string;
  gpu: string;
  display?: string;
  batteryWeight?: string;
  specialHighlight?: string;
  img: string;
  detailedSpecs?: {
    displayTech: string;
    refreshRate: string;
    ports: string;
    cooling: string;
    chassis: string;
    benchmarkScore: number;
  };
};

export const products: Product[] = [
  {
    id: "1",
    name: "Phantom X9",
    badge: "GAMING BEAST",
    badgeColor: "cyan",
    category: "Gaming",
    processor: "Intel i9",
    price: 389900,
    priceUsd: "$3,899",
    cpu: "i9-15900HX",
    ram: "64GB DDR5",
    gpu: "RTX 5090 24GB",
    display: '18" Mini-LED 4K 240Hz (1100 nits)',
    batteryWeight: "99.9Wh (Up to 6.5 hrs) · 2.85 kg",
    specialHighlight: "Max 175W RTX 5090 TGP with Cryo-Chamber Vapor Cooling",
    img: gaming,
    detailedSpecs: {
      displayTech: "18-inch Mini-LED 4K HDR 1000 w/ G-Sync",
      refreshRate: "240Hz / 3ms Response",
      ports: "2x Thunderbolt 4, HDMI 2.1, 2.5G LAN, SD Card",
      cooling: "Quad Fan Cryo-Chamber + Liquid Metal",
      chassis: "Anodized Dark Titanium Alloy",
      benchmarkScore: 9850,
    },
  },
  {
    id: "2",
    name: "Atelier Pro",
    badge: "CREATOR PRO",
    badgeColor: "purple",
    category: "Ultrabook",
    processor: "Apple M Max",
    price: 429900,
    priceUsd: "$4,299",
    cpu: "M4 Max 16-Core",
    ram: "96GB Unified",
    gpu: "40-Core Neural GPU",
    display: '16.2" Liquid Retina XDR OLED',
    batteryWeight: "100Wh (Up to 21 hrs) · 2.15 kg",
    specialHighlight: "96GB High-Bandwidth Unified Memory & ProRes Accelerator",
    img: creator,
    detailedSpecs: {
      displayTech: "16.2-inch XDR Tandem OLED 1600 nits",
      refreshRate: "120Hz ProMotion Adaptive",
      ports: "3x Thunderbolt 5, HDMI 2.1, MagSafe 3, SDXC",
      cooling: "Dual-Impeller Acoustic Silent Fans",
      chassis: "Unibody Space Black Recycled Aluminum",
      benchmarkScore: 9940,
    },
  },
  {
    id: "3",
    name: "Forge W17",
    badge: "WORKSTATION",
    badgeColor: "blue",
    category: "Workstation",
    processor: "AMD Ryzen 9",
    price: 519900,
    priceUsd: "$5,199",
    cpu: "Ryzen 9 9955 PRO",
    ram: "128GB ECC DDR5",
    gpu: "RTX 5000 Ada 32GB",
    display: '17.3" 4K UHD OLED 100% Adobe RGB',
    batteryWeight: "99.9Wh (Up to 8 hrs) · 3.10 kg",
    specialHighlight: "32GB VRAM RTX Ada Workstation GPU for AI & CAD",
    img: workstation,
    detailedSpecs: {
      displayTech: "17.3-inch 4K OLED Pantone Validated",
      refreshRate: "120Hz Adaptive Sync",
      ports: "2x USB4 40Gbps, 3x USB-A 3.2, Dual RJ45 10G",
      cooling: "Vapor Chamber + Tri-Fan Workstation Thermal Array",
      chassis: "Magnesium-Aluminum Structural Shell",
      benchmarkScore: 9910,
    },
  },
  {
    id: "4",
    name: "Edge 14",
    badge: "ULTRABOOK",
    badgeColor: "cyan",
    category: "Ultrabook",
    processor: "Intel i9",
    price: 219900,
    priceUsd: "$2,199",
    cpu: "Core Ultra 9 185H",
    ram: "32GB LPDDR5X",
    gpu: "Arc Xe2 8-Core",
    display: '14.0" 2.8K OLED 120Hz Touch Display',
    batteryWeight: "75Wh (Up to 16 hrs) · 1.28 kg",
    specialHighlight: "Ultra-light Aerospace Carbon Fiber Body at just 1.28 kg",
    img: business,
    detailedSpecs: {
      displayTech: "14.0-inch 2.8K Pure-OLED Touch Screen",
      refreshRate: "120Hz VRR",
      ports: "2x Thunderbolt 4, 1x USB-A 3.2, 3.5mm Audio",
      cooling: "Dual Heat-Pipe Ultra-Quiet Axial Blower",
      chassis: "3D Weave Aerospace Carbon Fiber",
      benchmarkScore: 8450,
    },
  },
  {
    id: "5",
    name: "Strike R15",
    badge: "ESPORTS",
    badgeColor: "purple",
    category: "Gaming",
    processor: "AMD Ryzen 9",
    price: 289900,
    priceUsd: "$2,899",
    cpu: "Ryzen 9 9945HX",
    ram: "32GB DDR5-6000",
    gpu: "RTX 5080 16GB",
    display: '15.6" QHD+ 360Hz Fast-IPS Esports Screen',
    batteryWeight: "90Wh (Up to 7 hrs) · 2.35 kg",
    specialHighlight: "360Hz Ultra-Low Latency Esports Display Panel",
    img: gaming2,
    detailedSpecs: {
      displayTech: "15.6-inch QHD+ Fast-IPS 100% DCI-P3",
      refreshRate: "360Hz Ultra-Low Motion Blur",
      ports: "1x USB4, 3x USB-A 3.2 Gen 2, HDMI 2.1, Gigabit Ethernet",
      cooling: "Liquid Metal HyperFlow Dual-Fan",
      chassis: "Eclipse Gray Textured Polycarbonate & Metal Lid",
      benchmarkScore: 9420,
    },
  },
  {
    id: "6",
    name: "Studio 16",
    badge: "CINEMA OLED",
    badgeColor: "blue",
    category: "Ultrabook",
    processor: "Apple M Max",
    price: 369900,
    priceUsd: "$3,699",
    cpu: "M4 Pro 14-Core",
    ram: "48GB Unified",
    gpu: "20-Core GPU Engine",
    display: '16.0" 4K+ OLED Dolby Vision Studio Panel',
    batteryWeight: "95Wh (Up to 18 hrs) · 1.95 kg",
    specialHighlight: "CalMAN Verified 100% DCI-P3 Reference Grade Studio Display",
    img: creator2,
    detailedSpecs: {
      displayTech: "16.0-inch 4K+ OLED True 10-Bit Color",
      refreshRate: "120Hz Studio Sync",
      ports: "3x Thunderbolt 4, HDMI 2.1b, UHS-II SD Card",
      cooling: "Silent Vapor Heat Exchanger",
      chassis: "CNC Machined Platinum Aluminum",
      benchmarkScore: 9280,
    },
  },
];
