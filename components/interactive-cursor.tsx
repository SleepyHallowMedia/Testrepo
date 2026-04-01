"use client";

import { useEffect, useState, useCallback } from "react";

interface Trail {
  x: number;
  y: number;
  id: string;
  opacity: number;
}

let trailIdCounter = 0;

export function InteractiveCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [trails, setTrails] = useState<Trail[]>([]);

  const updateCursor = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
    setIsVisible(true);

    setTrails(prev => {
      trailIdCounter += 1;
      const newTrail = {
        x: e.clientX,
        y: e.clientY,
        id: `trail-${trailIdCounter}`,
        opacity: 1,
      };
      return [...prev.slice(-6), newTrail];
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updateCursor(e);

      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('interactive') ||
        target.closest('.interactive');
      
      setIsPointer(isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const trailInterval = setInterval(() => {
      setTrails(prev => 
        prev
          .map(t => ({ ...t, opacity: t.opacity - 0.2 }))
          .filter(t => t.opacity > 0)
      );
    }, 50);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      clearInterval(trailInterval);
    };
  }, [updateCursor]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      {/* Data trail */}
      {trails.map((trail) => (
        <div
          key={trail.id}
          className="absolute text-[8px] font-mono text-primary"
          style={{
            left: trail.x + 10,
            top: trail.y,
            opacity: trail.opacity * 0.5,
            transform: `translate(0, -50%)`,
          }}
        >
          {Math.random().toString(16).slice(2, 4).toUpperCase()}
        </div>
      ))}

      {/* Main targeting reticle */}
      <div
        className="absolute transition-all duration-75"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) ${isClicking ? 'scale(0.85)' : ''} ${isPointer ? 'scale(1.2)' : ''}`,
        }}
      >
        {/* Outer ring */}
        <div 
          className={`absolute top-1/2 left-1/2 border transition-all duration-200 ${
            isPointer ? 'w-10 h-10 border-primary' : 'w-6 h-6 border-primary/50'
          }`}
          style={{
            transform: 'translate(-50%, -50%) rotate(45deg)',
            opacity: isVisible ? 1 : 0,
            boxShadow: isPointer ? '0 0 15px var(--primary)' : 'none',
          }}
        />

        {/* Crosshair lines */}
        <div 
          className="absolute top-1/2 left-1/2 w-3 h-px bg-primary"
          style={{
            transform: 'translate(-50%, -50%) translateX(-10px)',
            opacity: isVisible ? 0.8 : 0,
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-3 h-px bg-primary"
          style={{
            transform: 'translate(-50%, -50%) translateX(10px)',
            opacity: isVisible ? 0.8 : 0,
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 h-3 w-px bg-primary"
          style={{
            transform: 'translate(-50%, -50%) translateY(-10px)',
            opacity: isVisible ? 0.8 : 0,
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 h-3 w-px bg-primary"
          style={{
            transform: 'translate(-50%, -50%) translateY(10px)',
            opacity: isVisible ? 0.8 : 0,
          }}
        />

        {/* Center dot */}
        <div 
          className={`absolute top-1/2 left-1/2 rounded-full transition-all duration-200 ${
            isPointer ? 'w-2 h-2 bg-primary' : 'w-1 h-1 bg-primary/70'
          }`}
          style={{
            transform: 'translate(-50%, -50%)',
            opacity: isVisible ? 1 : 0,
            boxShadow: '0 0 10px var(--primary)',
          }}
        />

        {/* Target lock indicator on hover */}
        {isPointer && (
          <>
            <div 
              className="absolute -top-6 left-1/2 text-[8px] font-mono text-primary tracking-wider"
              style={{
                transform: 'translateX(-50%)',
                opacity: isVisible ? 1 : 0,
                textShadow: '0 0 5px var(--primary)',
              }}
            >
              TARGET
            </div>
            <div 
              className="absolute -bottom-6 left-1/2 text-[8px] font-mono text-primary"
              style={{
                transform: 'translateX(-50%)',
                opacity: isVisible ? 0.7 : 0,
              }}
            >
              LOCKED
            </div>
          </>
        )}
      </div>

      {/* Coordinate display */}
      <div
        className="absolute text-[8px] font-mono text-muted-foreground/30 transition-opacity duration-300"
        style={{
          left: position.x + 25,
          top: position.y + 15,
          opacity: isVisible ? 1 : 0,
        }}
      >
        X:{Math.round(position.x)} Y:{Math.round(position.y)}
      </div>

      {/* Red glow on hover */}
      <div
        className="absolute w-48 h-48 rounded-full pointer-events-none transition-all duration-500 ease-out"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${isPointer ? 'var(--primary)' : 'var(--accent)'} 0%, transparent 70%)`,
          opacity: isVisible ? (isPointer ? 0.1 : 0.03) : 0,
        }}
      />
    </div>
  );
}
