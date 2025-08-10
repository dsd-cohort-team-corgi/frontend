"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import BumiGif from "@/public/bumi.gif";
import BumiModal from "./BumiModal";
import useVoiceRecognition from "@/lib/hooks/useVoiceRecognition";

export default function Bumi() {
  const [isBumiModalOpen, setIsBumiModalOpen] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const { inProgressBubbles, isListening, toggleListening } =
    useVoiceRecognition({
      onApiResponse: () => {
        /* No-op */
      },
      onBeforeApiCall: useCallback((text: string) => {
        const lowerText = text.toLowerCase().trim();
        console.log("Processing voice command:", lowerText);
        if (lowerText === "turn off the lights") {
          alert("Turning off the lights");
          return true; // Prevent API call
        }
        alert("Allowing API call for normal speech");
        return false; // Allow API call for normal speech
      }, []),
      apiEndPath: "bumi/booking/chat",
      setErrorMessage: () => {},
      setRequestCopy: () => {},
    });

  const handleBumiClick = useCallback(() => {
    if (!isLongPressRef.current) {
      setIsBumiModalOpen(true);
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      toggleListening();
    }, 1000);
  }, [toggleListening]);

  const handleMouseUp = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsBumiModalOpen(false);
  }, []);

  // Memoize the button styles to prevent recalculation on every render
  const buttonStyles = useMemo(
    () => ({
      backgroundColor: isListening ? "#ef4444" : "#4490d3",
    }),
    [isListening],
  );

  // Memoize the button classes to prevent string concatenation on every render
  const buttonClasses = useMemo(() => {
    const baseClasses =
      "cursor-pointer rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 relative";
    const listeningClasses = isListening
      ? "ring-4 ring-red-400 ring-opacity-75"
      : "hover:ring-2 hover:ring-blue-300 hover:ring-opacity-50";
    return `${baseClasses} ${listeningClasses}`;
  }, [isListening]);

  // Memoize the transcription display to prevent unnecessary re-renders
  const transcriptionDisplay = useMemo(() => {
    if (!inProgressBubbles) return null;

    return (
      <div className="bg-white rounded-lg px-3 py-2 shadow-lg border border-gray-200 max-w-xs">
        <div className="flex items-start space-x-1">
          <div className="flex flex-wrap items-center">
            {inProgressBubbles.split(" ").map((word, index, array) => {
              const isLastWord = index === array.length - 1;

              return (
                <React.Fragment key={word}>
                  <span className="text-sm text-gray-700">
                    {isLastWord ? (
                      <span className="text-blue-600 font-medium">{word}</span>
                    ) : (
                      word
                    )}
                  </span>
                  {!isLastWord && <span className="text-gray-700">&nbsp;</span>}
                </React.Fragment>
              );
            })}
            <span className="text-blue-600 animate-pulse ml-1 font-bold text-lg">
              |
            </span>
          </div>
        </div>
      </div>
    );
  }, [inProgressBubbles]);
  console.log({ inProgressBubbles });
  return (
    <>
      <div className="fixed bottom-10 right-10 z-50 flex items-center space-x-4">
        {/* Voice transcription display - left of Bumi */}
        {transcriptionDisplay}

        <button
          type="button"
          className={buttonClasses}
          style={buttonStyles}
          onClick={handleBumiClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleBumiClick();
            }
          }}
          aria-label="Open Bumi AI assistant"
        >
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75" />
              <div className="absolute inset-0 rounded-full border-2 border-red-500" />
              <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </>
          )}
          <Image
            src={BumiGif}
            alt="Bumi"
            width={50}
            height={50}
            className="h-[35px] w-[35px] rounded-full object-cover transition-all duration-300"
          />
        </button>
      </div>

      <BumiModal isOpen={isBumiModalOpen} onOpenChange={handleCloseModal} />
    </>
  );
}
