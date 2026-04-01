"use client";

import { useEffect, useState, useRef, useMemo } from "react";

export function AbstractBackground() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [time, setTime] = useState(0);
  const [windowHeight, setWindowHeight] = useState(800);
  const [isMounted, setIsMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate stable random values for data streams
  const leftStreamData = useMemo(() => 
    Array.from({ length: 20 }, () => Math.random().toString(16).slice(2, 10).toUpperCase()),
    []
  );
  
  const rightStreamData = useMemo(() => 
    Array.from({ length: 20 }, () => (Math.random() > 0.5 ? '1' : '0').repeat(8)),
    []
  );

  useEffect(() => {
    setIsMounted(true);
    setWindowHeight(window.innerHeight);

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const interval = setInterval(() => {
      setTime(t => t + 0.02);
    }, 50);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);

  // Draw noise/static canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 300;

    const drawNoise = () => {
      const imageData = ctx.createImageData(300, 300);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 8;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    drawNoise();
    const noiseInterval = setInterval(drawNoise, 100);

    return () => clearInterval(noiseInterval);
  }, []);

  if (!isMounted) {
    return <div className="fixed inset-0 pointer-events-none z-0 bg-background" />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(80, 20, 20, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(20, 60, 80, 0.1) 0%, transparent 50%)',
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-50" />

      {/* Horizontal scan lines */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
      />

      {/* Moving scanline */}
      <div 
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent scanline"
      />

      {/* HUD targeting reticle - follows mouse subtly */}
      <svg 
        className="absolute w-[200px] h-[200px] opacity-20 transition-all duration-700"
        style={{
          left: `calc(${mousePos.x}% - 100px)`,
          top: `calc(${mousePos.y}% - 100px)`,
        }}
        viewBox="0 0 200 200"
      >
        <circle 
          cx="100" cy="100" r="80" 
          fill="none" 
          stroke="var(--primary)" 
          strokeWidth="0.5"
          strokeDasharray="4 8"
          style={{ transform: `rotate(${time * 20}deg)`, transformOrigin: 'center' }}
        />
        <circle 
          cx="100" cy="100" r="60" 
          fill="none" 
          stroke="var(--primary)" 
          strokeWidth="0.5"
          style={{ transform: `rotate(${-time * 15}deg)`, transformOrigin: 'center' }}
        />
        <line x1="100" y1="20" x2="100" y2="40" stroke="var(--primary)" strokeWidth="0.5" />
        <line x1="100" y1="160" x2="100" y2="180" stroke="var(--primary)" strokeWidth="0.5" />
        <line x1="20" y1="100" x2="40" y2="100" stroke="var(--primary)" strokeWidth="0.5" />
        <line x1="160" y1="100" x2="180" y2="100" stroke="var(--primary)" strokeWidth="0.5" />
      </svg>

      {/* Corner HUD elements */}
      <div className="absolute top-4 left-4 text-[10px] text-primary/40 font-mono space-y-1">
        <div className="flicker">SYS://NEXUS_CORE</div>
        <div>STATUS: ONLINE</div>
        <div>UPTIME: {Math.floor(time * 100)}s</div>
      </div>

      <div className="absolute top-4 right-4 text-[10px] text-accent/40 font-mono text-right space-y-1">
        <div>LAT: {(mousePos.y * 0.9).toFixed(4)}</div>
        <div>LON: {(mousePos.x * 1.8 - 90).toFixed(4)}</div>
        <div className="flicker">TRACKING: ACTIVE</div>
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] text-primary/30 font-mono">
        <div>MEM: {(Math.sin(time) * 20 + 60).toFixed(1)}%</div>
        <div>CPU: {(Math.cos(time * 1.5) * 15 + 45).toFixed(1)}%</div>
      </div>

      <div className="absolute bottom-4 right-4 text-[10px] text-muted-foreground/30 font-mono text-right">
        <div>BUILD: 2.0.{Math.floor(time % 100)}</div>
        <div>CYBERDYNE SYSTEMS</div>
      </div>

      {/* Data streams on sides */}
      <div className="absolute left-0 top-0 bottom-0 w-8 overflow-hidden opacity-20">
        {leftStreamData.map((data, i) => (
          <div 
            key={`left-stream-${i}`}
            className="text-[8px] text-primary font-mono whitespace-nowrap"
            style={{
              transform: `translateY(${((time * 50 + i * 30) % windowHeight) - 20}px)`,
            }}
          >
            {data}
          </div>
        ))}
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-8 overflow-hidden opacity-20">
        {rightStreamData.map((data, i) => (
          <div 
            key={`right-stream-${i}`}
            className="text-[8px] text-accent font-mono whitespace-nowrap text-right pr-2"
            style={{
              transform: `translateY(${((time * 40 + i * 35) % windowHeight) - 20}px)`,
            }}
          >
            {data}
          </div>
        ))}
      </div>

      {/* Noise texture canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40 mix-blend-overlay"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* CRT vignette */}
      <div className="absolute inset-0 crt-vignette" />

      {/* Red alert bar at top */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
          boxShadow: '0 0 20px var(--primary)',
          opacity: 0.5 + Math.sin(time * 2) * 0.3,
        }}
      />
    </div>
  );
}
