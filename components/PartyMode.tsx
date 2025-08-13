"use client";

import { useState, useEffect } from "react";
import ConfettiExplosion from "react-confetti-explosion";

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

  useEffect(() => {
    if (isPartyMode) {
      const timer = setTimeout(() => {
        setIsPartyMode(false);
        setIsDarkMode(false);
        // Dispatch custom event for performance optimization
        window.dispatchEvent(new CustomEvent("party-mode-changed"));
      }, 20000);
      return () => clearTimeout(timer);
    }
    return undefined;
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

// Party Mode component
interface PartyModeProps {
  isActive: boolean;
}

function PartyMode({ isActive }: PartyModeProps) {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setEmojis([]);
      setShowConfetti(false);
      return;
    }

    // Show confetti when party mode starts
    setShowConfetti(true);

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
      "🎪",
      "🎭",
      "🎨",
      "🎵",
    ];

    const generateEmoji = function (): Emoji {
      return {
        id: Math.random(),
        emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
        left: Math.random() * 100, // Random position 0-100%
        animationDuration: Math.random() * 3 + 2, // 2-5 seconds
        fontSize: Math.random() * 30 + 20, // 20-50px
      };
    };

    const interval = setInterval(() => {
      const newEmoji = generateEmoji();
      setEmojis((prev) => {
        return [...prev, newEmoji];
      });

      // Remove emoji after animation completes
      setTimeout(() => {
        setEmojis((prev) => {
          return prev.filter((e) => {
            return e.id !== newEmoji.id;
          });
        });
      }, newEmoji.animationDuration * 1000);
    }, 200); // New emoji every 200ms

    function cleanup() {
      clearInterval(interval);
    }
    // eslint-disable-next-line consistent-return
    return cleanup;
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[70] overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0">
          <ConfettiExplosion
            force={0.8}
            duration={6000}
            particleCount={100}
            width={1600}
            colors={["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"]}
          />
        </div>
      )}

      {emojis.map(function renderEmoji(emoji) {
        // eslint-disable-next-line consistent-return
        return (
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
        );
      })}

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(calc(100vh + 50px));
          }
        }
      `}</style>
    </div>
  );
}

export default PartyMode;
