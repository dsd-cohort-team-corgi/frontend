"use client";

import React, { useRef, useState, useEffect } from "react";
import { Mic } from "lucide-react";

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
  const [interimTranscript, setInterimTranscript] = useState("");
  const [apiThinking, setApiThinking] = useState(false);

  const recognitionRef =
    useRef<InstanceType<SpeechRecognitionConstructor> | null>(null);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);

  // Accumulate all new user bubbles (strings) since last API call here:
  const accumulatedTextRef = useRef<string>("");

  const interimRef = useRef("");

  useEffect(() => {
    interimRef.current = interimTranscript;
  }, [interimTranscript]);

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
          setInterimTranscript("");
          interimRef.current = "";

          // Reset silence timer here because we just got new final text
          resetSilenceTimer();
        } else {
          interim += transcriptPiece;
        }
      }

      if (interim) {
        setInterimTranscript(interim);
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

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (silenceTimer.current) clearTimeout(silenceTimer.current);

      // Clear accumulation on stop
      accumulatedTextRef.current = "";
      setInterimTranscript("");
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
      <div className="space-y-2">
        {bubbles.map((text, index) => (
          <div
            key={index}
            className="rounded-2xl bg-gray-900 p-3 text-sm font-extralight text-white shadow"
          >
            {text}
          </div>
        ))}
        {interimTranscript && (
          <div className="rounded bg-gray-200 p-2 text-sm italic text-gray-500 shadow">
            {interimTranscript}
          </div>
        )}
      </div>

      {apiThinking && <span className="block">Hmm, let me think...</span>}
      {!apiThinking && isListening && (
        <span className="block">I'm listening...</span>
      )}

      {!apiThinking && (
        <button
          type="button"
          onClick={toggleListening}
          className={`rounded-full p-5 ${
            isListening ? "bg-slate-800 text-slate-400" : "bg-white text-black"
          }`}
        >
          <div className={`${isListening ? "text-slate-400" : "text-black"}`}>
            <Mic className="stroke-current" />
          </div>
        </button>
      )}

      {!apiThinking && !isListening && (
        <span className="block">Tap to speak</span>
      )}
    </div>
  );
}

export default VoiceInput;
