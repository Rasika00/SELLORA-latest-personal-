import gaming from "@/assets/laptop-gaming.jpg";
import gaming2 from "@/assets/laptop-gaming2.jpg";
import creator from "@/assets/laptop-creator.jpg";
import creator2 from "@/assets/laptop-creator2.jpg";
import business from "@/assets/laptop-business.jpg";
import workstation from "@/assets/laptop-workstation.jpg";

export type Product = {
  id: string;
  name: string;
  badge: string;
  badgeColor: "cyan" | "purple" | "blue";
  category: "Gaming" | "Ultrabook" | "Workstation";
  processor: "Intel i9" | "AMD Ryzen 9" | "Apple M-Max";
  price: number;
  cpu: string;
  ram: string;
  gpu: string;
  img: string;
};

export const products: Product[] = [
  { id: "1", name: "SELLORA Phantom X9", badge: "GAMING BEAST", badgeColor: "cyan", category: "Gaming", processor: "Intel i9", price: 3899, cpu: "i9-15900HX", ram: "64GB DDR5", gpu: "RTX 5090", img: gaming },
  { id: "2", name: "SELLORA Atelier Pro", badge: "CREATOR PRO", badgeColor: "purple", category: "Ultrabook", processor: "Apple M-Max", price: 4299, cpu: "M4 Max", ram: "96GB", gpu: "40-core", img: creator },
  { id: "3", name: "SELLORA Forge W17", badge: "WORKSTATION", badgeColor: "blue", category: "Workstation", processor: "AMD Ryzen 9", price: 5199, cpu: "Ryzen 9 9955", ram: "128GB ECC", gpu: "RTX 5000 Ada", img: workstation },
  { id: "4", name: "SELLORA Edge 14", badge: "ULTRABOOK", badgeColor: "cyan", category: "Ultrabook", processor: "Intel i9", price: 2199, cpu: "Core Ultra 9", ram: "32GB", gpu: "Arc Xe2", img: business },
  { id: "5", name: "SELLORA Strike R15", badge: "ESPORTS", badgeColor: "purple", category: "Gaming", processor: "AMD Ryzen 9", price: 2899, cpu: "Ryzen 9 9945HX", ram: "32GB DDR5", gpu: "RTX 5080", img: gaming2 },
  { id: "6", name: "SELLORA Studio 16", badge: "CINEMA OLED", badgeColor: "blue", category: "Ultrabook", processor: "Apple M-Max", price: 3699, cpu: "M4 Pro", ram: "48GB", gpu: "20-core", img: creator2 },
];
