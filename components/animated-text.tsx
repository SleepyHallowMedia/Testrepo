"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function AnimatedText({ 
  text, 
  className = "", 
  delay = 0,
  staggerDelay = 50 
}: AnimatedTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayedChars, setDisplayedChars] = useState<string[]>([]);
  const ref = useRef<HTMLSpanElement>(null);
  const chars = text.split('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < chars.length) {
        setDisplayedChars(chars.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, staggerDelay);

    return () => clearInterval(interval);
  }, [isVisible, chars, staggerDelay]);

  return (
    <span ref={ref} className={`inline font-mono ${className}`}>
      {displayedChars.join('')}
      {displayedChars.length < chars.length && displayedChars.length > 0 && (
        <span className="cursor-blink text-primary">_</span>
      )}
    </span>
  );
}

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function FadeIn({ 
  children, 
  className = "", 
  delay = 0,
  direction = 'up'
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)';
    switch (direction) {
      case 'up': return 'translate(0, 20px)';
      case 'down': return 'translate(0, -20px)';
      case 'left': return 'translate(20px, 0)';
      case 'right': return 'translate(-20px, 0)';
      case 'none': return 'none';
    }
  };

  return (
    <div
      ref={ref}
      className={`boot-sequence ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      {children}
    </div>
  );
}

interface ScrambleTextProps {
  text: string;
  className?: string;
}

export function ScrambleText({ text, className = "" }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>[]{}';

  useEffect(() => {
    if (isHovering) {
      let iteration = 0;
      
      intervalRef.current = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < iteration) return text[index];
              return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            })
            .join('')
        );

        if (iteration >= text.length) {
          clearInterval(intervalRef.current);
        }

        iteration += 0.5;
      }, 30);
    } else {
      setDisplayText(text);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovering, text, glitchChars]);

  return (
    <span
      className={`${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {displayText}
    </span>
  );
}

interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

export function Typewriter({ text, className = "", speed = 50, delay = 0 }: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          // Blink cursor after completion
          const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
          }, 500);
          return () => clearInterval(cursorInterval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return (
    <span className={`font-mono ${className}`}>
      {displayText}
      <span className={`text-primary ${showCursor ? 'opacity-100' : 'opacity-0'}`}>_</span>
    </span>
  );
}
