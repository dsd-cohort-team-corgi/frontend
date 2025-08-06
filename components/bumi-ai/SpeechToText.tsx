"use client";

import React, { useRef, useState, useEffect } from "react";
import type { PressEvent } from "@react-types/shared";
import UserTextBubbles from "./UserTextBubbles";
import MicUi from "./MicUi";

type SpeechRecognitionConstructor =
  | typeof window.SpeechRecognition
  | typeof window.webkitSpeechRecognition;

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

function VoiceInput(): JSX.Element {
  const [isListening, setIsListening] = useState(false);
  const [bubbles, setBubbles] = useState<string[]>([]);
  const [inProgressBattles, setInProgressTranscript] = useState("");
  const [apiThinking, setApiThinking] = useState(false);

  const recognitionRef =
    useRef<InstanceType<SpeechRecognitionConstructor> | null>(null);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);

  // Accumulate all new user bubbles (strings) since last API call here:
  const accumulatedTextRef = useRef<string>("");

  const interimRef = useRef("");

  useEffect(() => {
    interimRef.current = inProgressBattles;
  }, [inProgressBattles]);

  const resetSilenceTimer = () => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);

    silenceTimer.current = setTimeout(() => {
      console.log("🕒 Silence detected: sending accumulated text");

      const textToSend = accumulatedTextRef.current.trim();

      if (textToSend) {
        console.log("📤 Sending to API:", textToSend);

        setApiThinking(true);

        fetch("/api/speech", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: textToSend }),
        })
          .then((res) => {
            if (!res.ok) throw new Error("API request failed");
            return res.json();
          })
          .then((data) => {
            console.log("🧠 API responded:", data);
            // TODO: Add AI bubble response here if you want:
            // setBubbles(prev => [...prev, data.response]);
          })
          .catch((err) => {
            console.error("💥 API error:", err);
          })
          .finally(() => {
            setApiThinking(false);
            accumulatedTextRef.current = ""; // Clear after sending
          });
      } else {
        console.log("⚠️ No text accumulated to send");
      }
    }, 3000); // 3 seconds of silence
  };

  const createRecognition = () => {
    const SpeechRecognition = (window.SpeechRecognition ||
      window.webkitSpeechRecognition) as SpeechRecognitionConstructor;

    if (!SpeechRecognition) {
      console.error("Web Speech API not supported");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        const transcriptPiece = result[0].transcript;

        if (result.isFinal) {
          const finalPiece = transcriptPiece.trim();

          // Add bubble immediately
          setBubbles((prev) => [...prev, finalPiece]);

          // Add this bubble text to the accumulated buffer for API sending
          accumulatedTextRef.current += finalPiece + " ";

          // Clear interim text tracking
          setInProgressTranscript("");
          interimRef.current = "";

          // Reset silence timer here because we just got new final text
          resetSilenceTimer();
        } else {
          interim += transcriptPiece;
        }
      }

      if (interim) {
        setInProgressTranscript(interim);
        interimRef.current = interim;
        // Reset silence timer on interim results as well
        resetSilenceTimer();
      }
    };

    recognition.onend = () => {
      if (isListening) {
        // Restart recognition if still listening
        setTimeout(() => {
          try {
            recognition.start();
          } catch (err) {
            console.error("Failed to restart recognition:", err);
          }
        }, 200);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
    };

    return recognition;
  };

  // we need to type is to be a pressEvent, but we don't use e anywhere. So turn off this eslint warning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleListening = (_e?: PressEvent) => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (silenceTimer.current) clearTimeout(silenceTimer.current);

      // Clear accumulation on stop
      accumulatedTextRef.current = "";
      setInProgressTranscript("");
      interimRef.current = "";
    } else {
      recognitionRef.current = createRecognition();
      if (!recognitionRef.current) return;

      setTimeout(() => {
        try {
          recognitionRef.current?.start();
          setIsListening(true);
          resetSilenceTimer();
        } catch (err) {
          console.error("Failed to start recognition:", err);
        }
      }, 150);
    }
  };

  return (
    <div className="mt-10 flex max-w-lg flex-col items-center space-y-4">
      <UserTextBubbles
        bubbles={bubbles}
        inProgressBattles={inProgressBattles}
      />
      <MicUi
        apiThinking={apiThinking}
        isListening={isListening}
        toggleListening={toggleListening}
      />
    </div>
  );
}

export default VoiceInput;
