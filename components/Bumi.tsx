"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import Image from "next/image";

import BumiGif from "@/public/bumi.gif";
import BumiModal from "./BumiModal";
import ConfettiExplosion from "react-confetti-explosion";
import FallingEmojis, { usePartyMode } from "./FallingEmojis";
import useVoiceRecognition from "@/lib/hooks/useVoiceRecognition";
import { useApiMutation } from "@/lib/api-client";

export default function Bumi() {
  const [isBumiModalOpen, setIsBumiModalOpen] = useState(false);
  const { isPartyMode, isDarkMode, activatePartyMode } = usePartyMode();
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);
  const bookingActionMutation = useApiMutation("/bumi/ai/quickTricks", "POST");

  // listens to the click event of the button on the landing page, to open bumi ai
  useEffect(() => {
    const handleOpenBumiModal = () => {
      setIsBumiModalOpen(true);
    };

    window.addEventListener("open-bumi-modal", handleOpenBumiModal);

    return () => {
      window.removeEventListener("open-bumi-modal", handleOpenBumiModal);
    };
  }, []);

  const { inProgressBubbles, isListening, toggleListening } =
    useVoiceRecognition({
      onApiResponse: () => {
        /* No-op */
      },
      onBeforeApiCall: useCallback((text: string) => {
        const lowerText = text.toLowerCase().trim();
        console.log("Processing voice command:", lowerText);

        if (lowerText.includes("party")) {
          // Activate party mode
          activatePartyMode();
          return true;
        }

        if (
          lowerText.includes("cancel") ||
          lowerText.includes("reschedule") ||
          lowerText.includes("rescheduling") ||
          lowerText.includes("uncanceling")
        ) {
          bookingActionMutation.mutate({
            message: lowerText,
            conversationHistory: [],
          });
          // return true; // Prevent API call
        }
        if (bookingActionMutation.isSuccess) {
          console.log(bookingActionMutation.data);
        }
        return true; // Allow API call for normal speech
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
      backgroundColor: isPartyMode
        ? "#ff6b6b"
        : isListening
          ? "#ef4444"
          : "#4490d3",
    }),
    [isListening, isPartyMode],
  );

  // Memoize the button classes to prevent string concatenation on every render
  const buttonClasses = useMemo(() => {
    const baseClasses =
      "cursor-pointer rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 relative";
    const listeningClasses = isListening
      ? "ring-4 ring-red-400 ring-opacity-75"
      : "hover:ring-2 hover:ring-blue-300 hover:ring-opacity-50";
    const partyClasses = isPartyMode
      ? "ring-4 ring-pink-400 ring-opacity-75 animate-bounce"
      : "";
    return `${baseClasses} ${listeningClasses} ${partyClasses}`;
  }, [isListening, isPartyMode]);

  // Memoize the transcription display to prevent unnecessary re-renders
  const transcriptionDisplay = useMemo(() => {
    if (!inProgressBubbles) return null;

    return (
      <div
        className={`rounded-lg px-3 py-2 shadow-lg border max-w-xs transition-all duration-300 ${
          isPartyMode
            ? "bg-gradient-to-r from-pink-400 to-purple-400 border-pink-300 text-white"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-start space-x-1">
          <div className="flex flex-wrap items-center">
            {inProgressBubbles.split(" ").map((word, index, array) => {
              const isLastWord = index === array.length - 1;

              return (
                <React.Fragment key={word}>
                  <span
                    className={`text-sm ${isPartyMode ? "text-white" : "text-gray-700"}`}
                  >
                    {isLastWord ? (
                      <span
                        className={`font-medium ${isPartyMode ? "text-yellow-200" : "text-blue-600"}`}
                      >
                        {word}
                      </span>
                    ) : (
                      word
                    )}
                  </span>
                  {!isLastWord && (
                    <span
                      className={isPartyMode ? "text-white" : "text-gray-700"}
                    >
                      &nbsp;
                    </span>
                  )}
                </React.Fragment>
              );
            })}
            <span
              className={`animate-pulse ml-1 font-bold text-lg ${
                isPartyMode ? "text-yellow-200" : "text-blue-600"
              }`}
            >
              |
            </span>
          </div>
        </div>
      </div>
    );
  }, [inProgressBubbles, isPartyMode]);
  console.log({ inProgressBubbles });
  return (
    <>
      <div className="fixed bottom-10 right-10 z-50 flex items-center space-x-4">
        {/* Voice transcription display - left of Bumi */}
        {transcriptionDisplay}

        {/* Party mode indicator */}
        {isPartyMode && (
          <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-3 py-2 rounded-full shadow-lg animate-pulse">
            <span className="text-lg">🎉</span>
            <span className="text-sm font-medium">PARTY MODE</span>
          </div>
        )}

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

          {isPartyMode && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-pink-400 animate-ping opacity-75" />
              <div
                className="absolute inset-0 rounded-full border-2 border-purple-500 animate-ping opacity-75"
                style={{ animationDelay: "0.5s" }}
              />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce" />
              <div
                className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.3s" }}
              />
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
      {isPartyMode && (
        <div className="fixed inset-0 pointer-events-none z-[60]">
          <ConfettiExplosion
            force={0.8}
            duration={6000}
            particleCount={200}
            width={1600}
            colors={[
              "#ff6b6b",
              "#4ecdc4",
              "#45b7d1",
              "#96ceb4",
              "#feca57",
              "#ff9ff3",
              "#54a0ff",
              "#5f27cd",
            ]}
          />
        </div>
      )}
      <FallingEmojis isActive={isPartyMode} />
    </>
  );
}
