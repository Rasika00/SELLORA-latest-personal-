import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, User } from "lucide-react";

export function Navbar() {
  const links = [
    { label: "Gaming", href: "/#products" },
    { label: "Creator", href: "/#products" },
    { label: "Workstation", href: "/#products" },
    { label: "Tech", href: "/#features" },
    { label: "Support", href: "/" },
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
      <nav className="glass-strong mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 rounded-lg bg-gradient-primary shadow-neon-cyan" />
          <span className="font-display text-lg font-black tracking-widest">SELLORA</span>
        </Link>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-neon-cyan"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button aria-label="Search" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
            <Search className="h-4 w-4" />
          </button>
          <button aria-label="Account" className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground sm:inline-flex">
            <User className="h-4 w-4" />
          </button>
          <button aria-label="Cart" className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
            <ShoppingCart className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-neon-cyan shadow-neon-cyan" />
          </button>
          <button aria-label="Menu" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground md:hidden">
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </nav>
    </header>
  );
}
