"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BumiGif from "@/public/bumi.gif";
import BumiModal from "./BumiModal";
import PartyMode, { usePartyMode } from "./PartyMode";
import useVoiceRecognition from "@/lib/hooks/useVoiceRecognition";
import { useApiMutation } from "@/lib/api-client";

interface BumiQuickTrickDetails {
  success: boolean;
  message: string;
  booking: object;
}

interface BumiQuickTrickRequest {
  message: string;
  conversation_history: string[];
}

interface BumiQuickTrickResponse {
  message: string;
  success: boolean;
  details: BumiQuickTrickDetails;
  action: string;
}

export default function Bumi() {
  const router = useRouter();
  const [isBumiModalOpen, setIsBumiModalOpen] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);
  const { isPartyMode, activatePartyMode } = usePartyMode();

  const bookingActionMutation = useApiMutation<
    BumiQuickTrickResponse,
    BumiQuickTrickRequest
  >("/bumi/ai/quickTricks", "POST");

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

  const {
    inProgressBubbles,
    setInProgressBubbles,
    isListening,
    toggleListening,
  } = useVoiceRecognition({
    onApiResponse: () => {
      /* No-op */
    },
    onBeforeApiCall: useCallback(
      (text: string) => {
        const lowerText = text.toLowerCase().trim();

        // Check for bumi flow demo
        if (lowerText.includes("brain")) {
          router.push("/bumi-flow-demo");
          return true;
        }

        // Check for party mode activation
        if (lowerText.includes("party")) {
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
            conversation_history: [],
          });
          return true;
        }
        return true;
      },
      [activatePartyMode, bookingActionMutation],
    ),
    apiEndPath: "bumi/booking/chat",
    setErrorMessage: () => {},
    setRequestCopy: () => {},
  });

  // Handle party mode activation when voice recognition detects party keywords
  useEffect(() => {
    if (inProgressBubbles) {
      const lowerText = inProgressBubbles.toLowerCase().trim();
      if (lowerText.includes("party") || lowerText.includes("celebration")) {
        activatePartyMode();
        setInProgressBubbles("🎉 Party mode activated! 🎉");
        setTimeout(() => setInProgressBubbles(""), 3000);
      }
    }
  }, [inProgressBubbles, activatePartyMode, setInProgressBubbles]);

  useEffect(() => {
    const handleOpenBumiModal = () => {
      setIsBumiModalOpen(true);
    };

    window.addEventListener("open-bumi-modal", handleOpenBumiModal);

    return () => {
      window.removeEventListener("open-bumi-modal", handleOpenBumiModal);
    };
  }, []);

  useEffect(() => {
    if (bookingActionMutation.isPending) {
      setInProgressBubbles("Thinking...");
    }
    if (bookingActionMutation.isSuccess) {
      setInProgressBubbles(bookingActionMutation?.data.message);
      setTimeout(() => setInProgressBubbles(""), 3000);
    }
    if (bookingActionMutation.isError) {
      setInProgressBubbles("Something went wrong, please try again");
      setTimeout(() => setInProgressBubbles(""), 3000);
    }
  }, [
    bookingActionMutation.data,
    bookingActionMutation.isPending,
    bookingActionMutation.isSuccess,
    bookingActionMutation.isError,
    setInProgressBubbles,
  ]);

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
  const buttonStyles = useMemo(() => {
    let backgroundColor = "#4490d3"; // default color

    if (isListening) {
      backgroundColor = "#ef4444";
    } else if (isPartyMode) {
      backgroundColor = "#8b5cf6";
    }

    return { backgroundColor };
  }, [isListening, isPartyMode]);

  // Memoize the button classes to prevent string concatenation on every render
  const buttonClasses = useMemo(() => {
    const baseClasses =
      "cursor-pointer rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 relative";

    let listeningClasses =
      "hover:ring-2 hover:ring-blue-300 hover:ring-opacity-50"; // default

    if (isListening) {
      listeningClasses = "ring-4 ring-red-400 ring-opacity-75";
    } else if (isPartyMode) {
      listeningClasses =
        "ring-4 ring-purple-400 ring-opacity-75 animate-bounce";
    }

    return `${baseClasses} ${listeningClasses}`;
  }, [isListening, isPartyMode]);

  // Helper function to render word content
  const renderWordContent = (word: string, isLastWord: boolean) => {
    if (isLastWord) {
      return <span className="text-blue-600 font-medium">{word}</span>;
    }
    return word;
  };

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
                    {renderWordContent(word, isLastWord)}
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

  return (
    <>
      <PartyMode isActive={isPartyMode} />

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
              <div className="absolute top-1 right-1 size-3 bg-red-500 rounded-full animate-pulse" />
            </>
          )}

          {isPartyMode && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-75" />
              <div className="absolute inset-0 rounded-full border-2 border-purple-500" />
              <div className="absolute -top-2 -right-2 size-4 bg-purple-500 rounded-full animate-pulse">
                🎉
              </div>
            </>
          )}

          <Image
            src={BumiGif}
            alt="Bumi"
            width={50}
            height={50}
            className="size-[35px] rounded-full object-cover transition-all duration-300"
          />
        </button>
      </div>

      <BumiModal isOpen={isBumiModalOpen} onOpenChange={handleCloseModal} />
    </>
  );
}
