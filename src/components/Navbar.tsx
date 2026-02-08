"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, User, Tv, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        background: "linear-gradient(to bottom, hsl(220 20% 6% / 0.95), hsl(220 20% 6% / 0.4))",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <Tv className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold text-foreground tracking-tight">
            Open<span className="text-gradient">Claw</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavItem to="/" label="Home" active={pathname === "/"} />
          <NavItem to="/browse" label="Browse" active={pathname === "/browse"} />
          <NavItem to="/ad-studio" label="Ad Studio" active={pathname === "/ad-studio"} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <Search className="h-5 w-5 text-muted-foreground" />
        </button>
        <button className="p-2 rounded-full hover:bg-secondary transition-colors relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-foreground">AI Active</span>
        </div>
        <button className="p-2 rounded-full bg-secondary hover:bg-muted transition-colors">
          <User className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </motion.nav>
  );
};

const NavItem = ({ to, label, active }: { to: string; label: string; active: boolean }) => (
  <Link
    href={to}
    className={`text-sm font-medium transition-colors relative ${
      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {label}
    {active && (
      <motion.div
        layoutId="nav-indicator"
        className="absolute -bottom-1 left-0 right-0 h-0.5 gradient-accent rounded-full"
      />
    )}
  </Link>
);

export default Navbar;
