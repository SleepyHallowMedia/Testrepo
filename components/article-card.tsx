"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import type { Article } from "@/lib/articles";

interface ArticleCardProps {
  article: Article;
  index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [glitchTitle, setGlitchTitle] = useState(article.title);
  const [scanProgress, setScanProgress] = useState(0);
  const cardRef = useRef<HTMLAnchorElement>(null);

  // Glitch title on hover
  useEffect(() => {
    if (!isHovered) {
      setGlitchTitle(article.title);
      setScanProgress(0);
      return;
    }

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
    let frame = 0;
    const maxFrames = 15;

    const interval = setInterval(() => {
      frame++;
      setScanProgress((frame / maxFrames) * 100);
      
      if (frame >= maxFrames) {
        setGlitchTitle(article.title);
        clearInterval(interval);
        return;
      }

      setGlitchTitle(
        article.title
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < (frame / maxFrames) * article.title.length) {
              return article.title[i];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
    }, 40);

    return () => clearInterval(interval);
  }, [isHovered, article.title]);

  const fileCode = `DOC-${String(index + 1).padStart(3, '0')}`;
  const securityLevel = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'OMEGA'][index % 5];

  return (
    <Link
      ref={cardRef}
      href={`/article/${article.id}`}
      className="group relative block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative border border-border/30 hover:border-primary/50 transition-all duration-300 bg-card/50">
        {/* HUD corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Top bar - file info */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-secondary/30">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-primary font-mono">{fileCode}</span>
            <span className="text-[10px] text-muted-foreground/50">|</span>
            <span className="text-[10px] text-accent font-mono">{article.category.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground/40 font-mono">{article.readTime.toUpperCase()}</span>
            <span 
              className={`w-2 h-2 rounded-full ${
                isHovered ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30'
              }`}
              style={{ boxShadow: isHovered ? '0 0 10px var(--primary)' : 'none' }}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="p-6">
          {/* Scan line effect on hover */}
          {isHovered && (
            <div 
              className="absolute left-0 right-0 h-px bg-primary/50"
              style={{ 
                top: `${scanProgress}%`,
                boxShadow: '0 0 10px var(--primary)',
                transition: 'top 0.05s linear',
              }}
            />
          )}

          {/* Title */}
          <h2 className="text-xl md:text-2xl font-serif tracking-wide text-foreground group-hover:text-primary transition-colors mb-4 leading-tight">
            {glitchTitle}
            {isHovered && <span className="text-primary cursor-blink">_</span>}
          </h2>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {article.excerpt}
          </p>

          {/* Bottom metadata */}
          <div className="flex items-center justify-between pt-4 border-t border-border/20">
            <span className="text-[10px] text-muted-foreground/40 font-mono">
              {article.date}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground/30 font-mono">
                SEC.LVL:
              </span>
              <span className={`text-[10px] font-mono ${isHovered ? 'text-primary' : 'text-muted-foreground/50'}`}>
                {securityLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Access prompt on hover */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-primary/10 px-4 py-2 flex items-center justify-between transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <span className="text-[10px] text-primary font-mono tracking-wider">
            ACCESS FILE &gt;&gt;
          </span>
          <span className="text-[10px] text-primary/50 font-mono">
            ENTER
          </span>
        </div>
      </div>
    </Link>
  );
}
