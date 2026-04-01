"use client";

import { useMemo } from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const html = useMemo(() => parseMarkdown(content), [content]);

  return (
    <div 
      className={`prose-terminal ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function parseMarkdown(md: string): string {
  let html = md;

  // Code blocks - terminal style
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const langLabel = lang || 'OUTPUT';
    return `<div class="my-8 border border-border/30 bg-card/50"><div class="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-secondary/30"><span class="text-[10px] font-mono text-primary tracking-widest">${langLabel.toUpperCase()}</span><span class="text-[10px] font-mono text-muted-foreground/30">COPY</span></div><pre class="p-4 overflow-x-auto"><code class="text-sm font-mono text-foreground/80">${escapeHtml(code.trim())}</code></pre></div>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="px-2 py-0.5 bg-primary/10 border border-primary/20 font-mono text-sm text-primary">$1</code>');

  // Tables - data grid style
  html = html.replace(/\|(.+)\|\n\|[-|\s]+\|\n((?:\|.+\|\n?)+)/g, (_, header, body) => {
    const headers = header.split('|').filter(Boolean).map((h: string) => 
      `<th class="px-4 py-3 text-left border-b border-primary/30 font-mono text-[10px] tracking-widest text-primary uppercase">${h.trim()}</th>`
    ).join('');
    
    const rows = body.trim().split('\n').map((row: string) => {
      const cells = row.split('|').filter(Boolean).map((cell: string) => 
        `<td class="px-4 py-3 border-b border-border/20 font-mono text-sm text-foreground/70">${cell.trim()}</td>`
      ).join('');
      return `<tr class="hover:bg-primary/5 transition-colors">${cells}</tr>`;
    }).join('');
    
    return `<div class="overflow-x-auto my-8 border border-border/30"><table class="w-full"><thead class="bg-secondary/30"><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
  });

  // Checkboxes - task list style
  html = html.replace(/- \[x\] (.+)/g, '<div class="flex items-center gap-3 my-2"><span class="w-4 h-4 border border-primary bg-primary/20 flex items-center justify-center text-primary text-[10px]">&#10003;</span><span class="line-through text-muted-foreground/50 font-mono text-sm">$1</span></div>');
  html = html.replace(/- \[ \] (.+)/g, '<div class="flex items-center gap-3 my-2"><span class="w-4 h-4 border border-border/50"></span><span class="text-foreground/80 font-mono text-sm">$1</span></div>');

  // Headers - HUD style
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-serif text-foreground mt-12 mb-4 tracking-wider flex items-center gap-3"><span class="text-primary/30">&gt;&gt;&gt;</span>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-serif text-foreground mt-16 mb-6 tracking-wider flex items-center gap-4"><span class="text-primary">&gt;&gt;</span>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-serif text-foreground mt-20 mb-8 tracking-wider terminal-glow">$1</h1>');

  // Blockquotes - transmission style
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-accent pl-6 py-2 my-8 bg-accent/5"><span class="text-[10px] text-accent font-mono tracking-widest block mb-2">// TRANSMISSION</span><span class="text-foreground/70 italic text-lg leading-relaxed">$1</span></blockquote>');

  // Horizontal rules - data break
  html = html.replace(/^---$/gm, '<div class="my-16 flex items-center justify-center gap-4"><div class="w-16 h-px bg-gradient-to-r from-transparent to-primary/50"></div><span class="text-[10px] text-primary/50 font-mono tracking-widest">DATA_BREAK</span><div class="w-16 h-px bg-gradient-to-l from-transparent to-primary/50"></div></div>');

  // Bold and italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-foreground terminal-glow">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-accent">$1</em>');

  // Lists (ordered)
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-6 my-2 text-foreground/80 list-none font-mono text-sm"><span class="text-primary mr-3">$1.</span>$2</li>');
  
  // Lists (unordered)
  html = html.replace(/^- ([^\[].*)$/gm, '<li class="ml-6 my-2 text-foreground/80 list-none font-mono text-sm"><span class="text-primary mr-3">&gt;</span>$1</li>');

  // Wrap consecutive list items
  html = html.replace(/((?:<li class="ml-6 my-2 text-foreground\/80 list-none font-mono text-sm"><span class="text-primary mr-3">\d+\.<\/span>.+<\/li>\n?)+)/g, '<ol class="my-6 space-y-1">$1</ol>');
  html = html.replace(/((?:<li class="ml-6 my-2 text-foreground\/80 list-none font-mono text-sm"><span class="text-primary mr-3">&gt;<\/span>.+<\/li>\n?)+)/g, '<ul class="my-6 space-y-1">$1</ul>');

  // Paragraphs
  html = html.split('\n\n').map(block => {
    if (
      block.startsWith('<') || 
      block.trim() === '' ||
      block.includes('<h1') ||
      block.includes('<h2') ||
      block.includes('<h3') ||
      block.includes('<blockquote') ||
      block.includes('<pre') ||
      block.includes('<ul') ||
      block.includes('<ol') ||
      block.includes('<hr') ||
      block.includes('<div') ||
      block.includes('<table')
    ) {
      return block;
    }
    return `<p class="my-6 leading-relaxed text-foreground/80">${block.replace(/\n/g, '<br />')}</p>`;
  }).join('\n');

  return html;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
