"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getArticle, articles } from "@/lib/articles";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Navigation } from "@/components/navigation";
import { AbstractBackground } from "@/components/abstract-background";
import { InteractiveCursor } from "@/components/interactive-cursor";
import { ScrollProgress } from "@/components/scroll-progress";
import { FadeIn } from "@/components/animated-text";

// Generate static paths for all articles at build time
export function generateStaticParams() {
  return articles.map((article) => ({
    id: article.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ArticlePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessText, setAccessText] = useState<string[]>([]);

  const article = getArticle(id);
  
  const currentIndex = articles.findIndex(a => a.id === id);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  // Access sequence
  useEffect(() => {
    if (!article) return;
    
    const messages = [
      `ACCESSING FILE: DOC-${String(currentIndex + 1).padStart(3, '0')}`,
      "DECRYPTING CONTENT...",
      "ACCESS GRANTED"
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < messages.length) {
        setAccessText(prev => [...prev, messages[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setAccessGranted(true), 300);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [article, currentIndex]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      setReadProgress(progress);
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.push('/');
      if (e.key === 'ArrowLeft' && prevArticle) router.push(`/article/${prevArticle.id}`);
      if (e.key === 'ArrowRight' && nextArticle) router.push(`/article/${nextArticle.id}`);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, prevArticle, nextArticle]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!article) {
    return (
      <main className="relative min-h-screen">
        <AbstractBackground />
        <InteractiveCursor />
        <Navigation />
        
        <div className="flex items-center justify-center min-h-screen">
          <FadeIn>
            <div className="text-center border border-primary/30 p-12 bg-card/50">
              <h1 className="text-6xl font-serif mb-4 text-primary terminal-glow">404</h1>
              <div className="text-xs font-mono text-muted-foreground/50 mb-8 tracking-widest">
                FILE NOT FOUND IN ARCHIVE
              </div>
              <Link 
                href="/"
                className="text-xs font-mono tracking-widest text-primary hover:underline"
              >
                &gt;&gt; RETURN TO MAIN TERMINAL
              </Link>
            </div>
          </FadeIn>
        </div>
      </main>
    );
  }

  const fileCode = `DOC-${String(currentIndex + 1).padStart(3, '0')}`;
  const securityLevel = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'OMEGA'][currentIndex % 5];

  // Access sequence screen
  if (!accessGranted) {
    return (
      <main className="relative min-h-screen bg-background flex items-center justify-center">
        <AbstractBackground />
        <div className="relative z-10 font-mono text-sm max-w-lg px-6">
          {accessText.map((text, i) => (
            <div 
              key={i} 
              className={`mb-2 ${
                text.includes('GRANTED') 
                  ? 'text-primary terminal-glow' 
                  : 'text-muted-foreground'
              }`}
            >
              <span className="text-primary/50 mr-2">&gt;</span>
              {text}
              {i === accessText.length - 1 && <span className="cursor-blink text-primary">_</span>}
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <AbstractBackground />
      <InteractiveCursor />
      <ScrollProgress />
      <Navigation />

      {/* Side progress - HUD style */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 z-30">
        <div className="text-[10px] font-mono text-muted-foreground/30 -rotate-90 origin-center whitespace-nowrap mb-8">
          {fileCode}
        </div>
        <div className="h-32 w-1 bg-border/30 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 w-full bg-primary transition-all duration-100"
            style={{ 
              height: `${readProgress}%`,
              boxShadow: '0 0 10px var(--primary)',
            }}
          />
        </div>
        <span className="text-[10px] font-mono text-primary">
          {Math.round(readProgress)}%
        </span>
      </div>

      {/* Article Header */}
      <header className="relative min-h-[60vh] flex flex-col justify-end px-6 pb-12 pt-32">
        <div className="max-w-4xl mx-auto w-full">
          {/* Back link */}
          <FadeIn delay={100}>
            <Link 
              href="/"
              className="inline-flex items-center gap-4 text-muted-foreground/50 hover:text-primary transition-colors font-mono text-xs tracking-widest mb-12"
            >
              <span>&lt;&lt;</span>
              RETURN_TO_ARCHIVE
            </Link>
          </FadeIn>

          {/* File header */}
          <FadeIn delay={200}>
            <div className="border border-border/30 bg-card/30 p-4 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <span className="text-primary font-mono text-sm">{fileCode}</span>
                  <span className="text-muted-foreground/30">|</span>
                  <span className="text-accent font-mono text-xs">{article.category.toUpperCase()}</span>
                  <span className="text-muted-foreground/30">|</span>
                  <span className="text-muted-foreground/50 font-mono text-xs">SEC.LVL: {securityLevel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ boxShadow: '0 0 10px var(--primary)' }} />
                  <span className="text-[10px] text-primary font-mono">ACTIVE</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Title */}
          <FadeIn delay={300}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-wide mb-6 text-foreground terminal-glow leading-tight">
              {article.title}
            </h1>
          </FadeIn>

          {/* Excerpt */}
          <FadeIn delay={400}>
            <p className="text-lg text-muted-foreground/70 max-w-2xl leading-relaxed mb-8">
              {article.excerpt}
            </p>
          </FadeIn>

          {/* Metadata row */}
          <FadeIn delay={500}>
            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-muted-foreground/40">
              <span>DATE: {article.date}</span>
              <span className="text-muted-foreground/20">|</span>
              <span>EST. READ: {article.readTime.toUpperCase()}</span>
              <span className="text-muted-foreground/20">|</span>
              <span>WORDS: ~{article.content.split(' ').length}</span>
            </div>
          </FadeIn>
        </div>
      </header>

      {/* Divider */}
      <div className="relative h-16 mb-8">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-border/50 via-primary/30 to-transparent" />
      </div>

      {/* Article Content */}
      <article className="relative px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <FadeIn delay={100}>
            <div className="prose-terminal">
              <MarkdownRenderer content={article.content} />
            </div>
          </FadeIn>
        </div>
      </article>

      {/* End marker */}
      <div className="flex flex-col items-center pb-24">
        <FadeIn delay={100}>
          <div className="text-center">
            <div className="text-primary font-mono text-xs mb-2">// END OF FILE</div>
            <div className="w-3 h-3 border border-primary rotate-45 mx-auto" style={{ boxShadow: '0 0 10px var(--primary)' }} />
          </div>
        </FadeIn>
      </div>

      {/* Article Navigation */}
      <nav className="relative px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <FadeIn delay={100}>
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-12" />
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            {prevArticle && (
              <FadeIn delay={200}>
                <Link
                  href={`/article/${prevArticle.id}`}
                  className="group block border border-border/30 hover:border-primary/50 p-6 transition-all bg-card/30"
                >
                  <span className="text-[10px] font-mono text-muted-foreground/40 mb-2 block">
                    &lt;&lt; PREVIOUS FILE
                  </span>
                  <span className="text-lg font-serif text-foreground group-hover:text-primary transition-colors block">
                    {prevArticle.title}
                  </span>
                </Link>
              </FadeIn>
            )}
            
            {nextArticle && (
              <FadeIn delay={300}>
                <Link
                  href={`/article/${nextArticle.id}`}
                  className={`group block border border-border/30 hover:border-accent/50 p-6 transition-all bg-card/30 text-right ${!prevArticle ? 'md:col-start-2' : ''}`}
                >
                  <span className="text-[10px] font-mono text-muted-foreground/40 mb-2 block">
                    NEXT FILE &gt;&gt;
                  </span>
                  <span className="text-lg font-serif text-foreground group-hover:text-accent transition-colors block">
                    {nextArticle.title}
                  </span>
                </Link>
              </FadeIn>
            )}
          </div>

          {/* Keyboard hints */}
          <FadeIn delay={400}>
            <div className="mt-16 flex items-center justify-center gap-8 text-[10px] font-mono text-muted-foreground/30">
              <span>
                <kbd className="px-2 py-1 border border-border/30 text-primary">&larr;</kbd>
                {' '}PREV
              </span>
              <span>
                <kbd className="px-2 py-1 border border-border/30 text-primary">&rarr;</kbd>
                {' '}NEXT
              </span>
              <span>
                <kbd className="px-2 py-1 border border-border/30 text-primary">ESC</kbd>
                {' '}EXIT
              </span>
            </div>
          </FadeIn>
        </div>
      </nav>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 flex items-center justify-center border border-border/30 text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300 z-50 bg-background/80 ${
          showScrollTop 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <span className="text-lg">&uarr;</span>
      </button>
    </main>
  );
}
