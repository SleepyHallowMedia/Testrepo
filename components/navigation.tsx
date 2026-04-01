"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "ARCHIVE", href: "/", code: "ARC-001" },
  { label: "ESSAYS", href: "/?category=Essays", code: "ESS-002" },
  { label: "FICTION", href: "/?category=Fiction", code: "FIC-003" },
  { label: "POETRY", href: "/?category=Poetry", code: "POE-004" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [systemTime, setSystemTime] = useState("");
  const [glitchText, setGlitchText] = useState("NEXUS");
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogoHover = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    const original = "NEXUS";
    let iterations = 0;
    
    const interval = setInterval(() => {
      setGlitchText(
        original
          .split("")
          .map((char, i) => {
            if (i < iterations) return original[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      
      iterations += 0.5;
      if (iterations >= original.length) {
        clearInterval(interval);
        setGlitchText(original);
      }
    }, 40);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo with HUD styling */}
            <Link
              href="/"
              className="group flex items-center gap-4"
              onMouseEnter={handleLogoHover}
            >
              <div className="relative">
                <div className="absolute -inset-2 border border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-2xl font-serif tracking-[0.3em] text-primary terminal-glow">
                  {glitchText}
                </span>
              </div>
              <div className="hidden sm:block text-[10px] text-muted-foreground/50 border-l border-muted-foreground/20 pl-4">
                <div>SYSTEM V2.0</div>
                <div className="text-primary/50">{systemTime}</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative px-4 py-2 text-xs tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute left-4 -bottom-1 text-[8px] text-primary/0 group-hover:text-primary/50 transition-colors">
                    {item.code}
                  </span>
                  <div className="absolute inset-0 border border-transparent group-hover:border-primary/30 transition-colors" />
                </Link>
              ))}
              
              {/* Status indicator */}
              <div className="ml-4 flex items-center gap-2 text-[10px] text-muted-foreground/40">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ boxShadow: '0 0 10px var(--primary)' }} />
                <span>ONLINE</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 border border-muted-foreground/20 hover:border-primary/50 transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <span 
                className={`w-5 h-px bg-primary transition-all duration-300 ${
                  isOpen ? 'rotate-45 translate-y-[4px]' : ''
                }`} 
              />
              <span 
                className={`w-5 h-px bg-primary transition-all duration-300 ${
                  isOpen ? 'opacity-0' : ''
                }`} 
              />
              <span 
                className={`w-5 h-px bg-primary transition-all duration-300 ${
                  isOpen ? '-rotate-45 -translate-y-[4px]' : ''
                }`} 
              />
            </button>
          </div>
        </div>

        {/* HUD underline */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </nav>

      {/* Mobile Menu - Full screen HUD takeover */}
      <div
        className={`fixed inset-0 z-30 bg-background/98 md:hidden transition-all duration-500 ${
          isOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scanlines in menu */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }}
        />

        <div className="flex flex-col items-start justify-center h-full px-8 gap-6">
          <div className="text-[10px] text-primary/50 mb-8 tracking-widest">
            // NAVIGATION PROTOCOL ACTIVE
          </div>
          
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-6 transition-all duration-500 ${
                isOpen 
                  ? 'translate-x-0 opacity-100' 
                  : '-translate-x-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              <span className="text-[10px] text-primary/50 font-mono w-16">
                {item.code}
              </span>
              <span className="text-3xl font-serif tracking-widest text-foreground group-hover:text-primary transition-colors terminal-glow">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Corner decorations */}
        <div className="absolute bottom-8 left-8 text-[10px] text-muted-foreground/30 font-mono">
          <div>TERMINAL: MOBILE_NAV</div>
          <div>AUTH: GRANTED</div>
        </div>

        <div className="absolute bottom-8 right-8 text-[10px] text-primary/30 font-mono text-right">
          <div>{systemTime}</div>
          <div>NEXUS SYSTEMS</div>
        </div>
      </div>
    </>
  );
}
