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
  cpu: string;
  ram: string;
  gpu: string;
  img: string;
};

export const products: Product[] = [
  { id: "1", name: "Phantom X9", badge: "GAMING BEAST", badgeColor: "cyan", category: "Gaming", processor: "Intel i9", price: 389900, cpu: "i9 15900HX", ram: "64GB DDR5", gpu: "RTX 5090", img: gaming },
  { id: "2", name: "Atelier Pro", badge: "CREATOR PRO", badgeColor: "purple", category: "Ultrabook", processor: "Apple M Max", price: 429900, cpu: "M4 Max", ram: "96GB", gpu: "40 core", img: creator },
  { id: "3", name: "Forge W17", badge: "WORKSTATION", badgeColor: "blue", category: "Workstation", processor: "AMD Ryzen 9", price: 519900, cpu: "Ryzen 9 9955", ram: "128GB ECC", gpu: "RTX 5000 Ada", img: workstation },
  { id: "4", name: "Edge 14", badge: "ULTRABOOK", badgeColor: "cyan", category: "Ultrabook", processor: "Intel i9", price: 219900, cpu: "Core Ultra 9", ram: "32GB", gpu: "Arc Xe2", img: business },
  { id: "5", name: "Strike R15", badge: "ESPORTS", badgeColor: "purple", category: "Gaming", processor: "AMD Ryzen 9", price: 289900, cpu: "Ryzen 9 9945HX", ram: "32GB DDR5", gpu: "RTX 5080", img: gaming2 },
  { id: "6", name: "Studio 16", badge: "CINEMA OLED", badgeColor: "blue", category: "Ultrabook", processor: "Apple M Max", price: 369900, cpu: "M4 Pro", ram: "48GB", gpu: "20 core", img: creator2 },
];
