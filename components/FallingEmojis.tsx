"use client";

import React, { useState, useEffect } from "react";

interface Emoji {
  id: number;
  emoji: string;
  left: number;
  animationDuration: number;
  fontSize: number;
}

interface PartyModeHookReturn {
  isPartyMode: boolean;
  isDarkMode: boolean;
  activatePartyMode: () => void;
}

// Custom hook for party mode state management
export const usePartyMode = (): PartyModeHookReturn => {
  const [isPartyMode, setIsPartyMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode to body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Auto-disable party mode after 10 seconds
  useEffect(() => {
    if (isPartyMode) {
      const timer = setTimeout(() => {
        setIsPartyMode(false);
        setIsDarkMode(false);
        // Dispatch custom event for performance optimization
        window.dispatchEvent(new CustomEvent("party-mode-changed"));
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isPartyMode]);

  const activatePartyMode = () => {
    setIsPartyMode(true);
    setIsDarkMode(true);
    // Dispatch custom event for performance optimization
    window.dispatchEvent(new CustomEvent("party-mode-changed"));
  };

  return {
    isPartyMode,
    isDarkMode,
    activatePartyMode,
  };
};

// Falling Emojis component
interface FallingEmojisProps {
  isActive: boolean;
}

const FallingEmojis = ({ isActive }: FallingEmojisProps) => {
  const [emojis, setEmojis] = useState<Emoji[]>([]);

  const emojiList = [
    "🎉",
    "⭐",
    "🎊",
    "💫",
    "✨",
    "🌟",
    "🎈",
    "🎁",
    "🐶",
    "🐕",
    "🐩",
    "🐕‍🦺",
    "🐕‍🦺",
    "🎪",
    "🎭",
    "🎨",
    "🎵",
  ];

  const generateEmoji = (): Emoji => {
    return {
      id: Math.random(),
      emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
      left: Math.random() * 100, // Random position 0-100%
      animationDuration: Math.random() * 3 + 2, // 2-5 seconds
      fontSize: Math.random() * 30 + 20, // 20-50px
    };
  };

  useEffect(() => {
    if (!isActive) {
      setEmojis([]);
      return;
    }

    const interval = setInterval(() => {
      const newEmoji = generateEmoji();
      setEmojis((prev) => [...prev, newEmoji]);

      // Remove emoji after animation completes
      setTimeout(() => {
        setEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
      }, newEmoji.animationDuration * 1000);
    }, 200); // New emoji every 200ms

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[70] overflow-hidden">
      {emojis.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute"
          style={{
            left: `${emoji.left}%`,
            top: "-50px",
            fontSize: `${emoji.fontSize}px`,
            animation: `fall ${emoji.animationDuration}s linear`,
          }}
        >
          {emoji.emoji}
        </div>
      ))}

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(calc(100vh + 50px));
          }
        }
      `}</style>
    </div>
  );
};

export default FallingEmojis;
