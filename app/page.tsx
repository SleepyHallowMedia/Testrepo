"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { articles, getAllCategories } from "@/lib/articles";
import { ArticleCard } from "@/components/article-card";
import { Navigation } from "@/components/navigation";
import { AbstractBackground } from "@/components/abstract-background";
import { InteractiveCursor } from "@/components/interactive-cursor";
import { ScrollProgress } from "@/components/scroll-progress";
import { FadeIn } from "@/components/animated-text";

function HomeContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [bootSequence, setBootSequence] = useState(true);
  const [bootText, setBootText] = useState<string[]>([]);
  const [showContent, setShowContent] = useState(false);

  const filteredArticles = categoryFilter
    ? articles.filter(a => a.category === categoryFilter)
    : articles;

  const categories = getAllCategories();

  // Boot sequence animation
  useEffect(() => {
    const bootMessages = [
      "INITIALIZING NEXUS CORE...",
      "LOADING ARCHIVE DATABASE...",
      "ESTABLISHING SECURE CONNECTION...",
      "AUTHENTICATION: VERIFIED",
      "WELCOME, OPERATOR",
      "",
      "SYSTEM READY"
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < bootMessages.length) {
        setBootText(prev => [...prev, bootMessages[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setBootSequence(false);
          setShowContent(true);
        }, 500);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  if (bootSequence) {
    return (
      <main className="relative min-h-screen bg-background flex items-center justify-center">
        <AbstractBackground />
        <div className="relative z-10 font-mono text-sm max-w-lg px-6">
          {bootText.map((text, i) => (
            <div 
              key={i} 
              className={`mb-2 ${
                text.includes('VERIFIED') || text.includes('READY') 
                  ? 'text-primary terminal-glow' 
                  : text === 'WELCOME, OPERATOR'
                    ? 'text-accent cyan-glow'
                    : 'text-muted-foreground'
              }`}
            >
              {text && <span className="text-primary/50 mr-2">&gt;</span>}
              {text}
              {i === bootText.length - 1 && <span className="cursor-blink text-primary">_</span>}
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className={`relative min-h-screen transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      <AbstractBackground />
      <InteractiveCursor />
      <ScrollProgress />
      <Navigation />

      {/* Hero Section - Terminal Style */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 pt-24">
        <div className="max-w-7xl mx-auto w-full">
          {/* System identifier */}
          <FadeIn delay={100}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ boxShadow: '0 0 10px var(--primary)' }} />
              <p className="text-xs font-mono tracking-[0.3em] text-muted-foreground">
                CLASSIFIED ARCHIVE // LEVEL 5 CLEARANCE
              </p>
            </div>
          </FadeIn>
          
          {/* Main title - HUD style */}
          <div className="relative mb-12">
            <FadeIn delay={200}>
              <div className="flex items-start gap-4">
                <span className="text-primary/30 text-6xl md:text-8xl font-serif">[</span>
                <div>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-wider text-foreground terminal-glow">
                    NEXUS
                  </h1>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-wider text-primary alert-glow">
                    ARCHIVE
                  </h1>
                </div>
                <span className="text-primary/30 text-6xl md:text-8xl font-serif self-end">]</span>
              </div>
            </FadeIn>
          </div>

          {/* Subtitle - terminal prompt */}
          <FadeIn delay={400}>
            <div className="max-w-xl mb-16">
              <p className="text-muted-foreground leading-loose font-mono text-sm">
                <span className="text-primary">&gt;</span> Restricted document repository. Essays, fiction, and classified narratives. Handle with appropriate clearance.
              </p>
            </div>
          </FadeIn>

          {/* Stats display */}
          <FadeIn delay={500}>
            <div className="flex flex-wrap gap-8 mb-16">
              <div className="border border-border/30 px-6 py-4 bg-card/30">
                <div className="text-3xl font-serif text-primary terminal-glow">{articles.length}</div>
                <div className="text-[10px] text-muted-foreground/50 tracking-widest mt-1">TOTAL FILES</div>
              </div>
              {categories.map(cat => (
                <div key={cat} className="border border-border/30 px-6 py-4 bg-card/30 hover:border-primary/30 transition-colors">
                  <div className="text-3xl font-serif text-accent cyan-glow">
                    {articles.filter(a => a.category === cat).length}
                  </div>
                  <div className="text-[10px] text-muted-foreground/50 tracking-widest mt-1">{cat.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Scroll indicator */}
          <FadeIn delay={600}>
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
              <span className="text-[10px] font-mono tracking-[0.3em] text-muted-foreground/40">
                SCROLL TO ACCESS
              </span>
              <div className="w-px h-16 relative overflow-hidden">
                <div className="absolute top-0 w-full h-full bg-gradient-to-b from-primary to-transparent animate-pulse" />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Divider - HUD style */}
      <div className="relative h-24 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4">
          <div className="w-32 h-px bg-gradient-to-r from-transparent to-primary" />
          <div className="w-3 h-3 border border-primary rotate-45" style={{ boxShadow: '0 0 10px var(--primary)' }} />
          <div className="w-32 h-px bg-gradient-to-l from-transparent to-primary" />
        </div>
      </div>

      {/* Category filters */}
      <section className="px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <FadeIn delay={100}>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[10px] text-primary font-mono">FILTER://</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="/"
                className={`px-4 py-2 text-xs font-mono tracking-widest border transition-all ${
                  !categoryFilter
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-border/30 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
              >
                ALL_FILES
              </a>
              {categories.map(category => (
                <a
                  key={category}
                  href={`/?category=${category}`}
                  className={`px-4 py-2 text-xs font-mono tracking-widest border transition-all ${
                    categoryFilter === category
                      ? 'border-accent text-accent bg-accent/10'
                      : 'border-border/30 text-muted-foreground hover:border-accent/50 hover:text-foreground'
                  }`}
                >
                  {category.toUpperCase()}
                </a>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Articles grid */}
      <section className="relative px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <FadeIn delay={100}>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/30">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-primary">&gt;&gt;</span>
                <h2 className="text-xs font-mono tracking-[0.3em] text-muted-foreground">
                  DOCUMENT_ARCHIVE
                </h2>
              </div>
              <span className="text-xs font-mono text-muted-foreground/50">
                {filteredArticles.length} FILE{filteredArticles.length !== 1 ? 'S' : ''} FOUND
              </span>
            </div>
          </FadeIn>

          {/* Article grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredArticles.map((article, index) => (
              <FadeIn key={article.id} delay={200 + index * 100}>
                <ArticleCard article={article} index={index} />
              </FadeIn>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <FadeIn delay={100}>
              <div className="text-center py-32 border border-border/30">
                <div className="text-primary font-mono text-sm mb-4">ERROR 404</div>
                <p className="text-muted-foreground/50 font-mono text-xs tracking-widest">
                  NO FILES MATCHING QUERY
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Footer - Terminal style */}
      <footer className="relative py-16 px-6 border-t border-border/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <FadeIn delay={100}>
              <div>
                <div className="text-primary font-serif text-xl tracking-wider mb-4 terminal-glow">NEXUS</div>
                <p className="text-muted-foreground/50 text-xs font-mono leading-loose">
                  CLASSIFIED DOCUMENT ARCHIVE<br/>
                  CYBERDYNE SYSTEMS DIVISION<br/>
                  EST. 2024
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div>
                <div className="text-[10px] text-muted-foreground/30 tracking-widest mb-4">NAVIGATION</div>
                {['Archive', 'Essays', 'Fiction', 'Poetry'].map(item => (
                  <a 
                    key={item}
                    href={item === 'Archive' ? '/' : `/?category=${item}`}
                    className="block text-xs font-mono text-muted-foreground/50 hover:text-primary transition-colors py-1"
                  >
                    &gt; {item.toUpperCase()}
                  </a>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="md:text-right">
                <div className="text-[10px] text-muted-foreground/30 tracking-widest mb-4">SYSTEM INFO</div>
                <div className="text-xs font-mono text-muted-foreground/40 space-y-1">
                  <div>VERSION: 2.0.84</div>
                  <div>STATUS: <span className="text-primary">OPERATIONAL</span></div>
                  <div>CLEARANCE: LEVEL 5</div>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="mt-16 pt-8 border-t border-border/20 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground/20 font-mono">
              &copy; 2026 NEXUS SYSTEMS. ALL RIGHTS RESERVED.
            </span>
            <span className="text-[10px] text-muted-foreground/20 font-mono">
              TERMINAL: MAIN_HUB
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary font-mono text-sm tracking-widest flicker">
          INITIALIZING...
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
