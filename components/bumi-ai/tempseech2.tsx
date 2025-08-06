"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";

type SpeechRecognitionConstructor =
  | typeof window.SpeechRecognition
  | typeof window.webkitSpeechRecognition;

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface VoiceInputProps {
  onSilence?: () => void;
}

function VoiceInput({ onSilence }: VoiceInputProps): JSX.Element {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [bubbles, setBubbles] = useState<string[]>([]);

  const recognitionRef =
    useRef<InstanceType<SpeechRecognitionConstructor> | null>(null);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);

  const resetSilenceTimer = () => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);

    silenceTimer.current = setTimeout(() => {
      console.log("🔥 No speech detected for 3 seconds!");

      // Save the finished transcript into bubbles if there's anything to save
      setTranscript((prevTranscript) => {
        if (prevTranscript.trim()) {
          setBubbles((prevBubbles) => [...prevBubbles, prevTranscript.trim()]);
        }
        return "";
      });

      setInterimTranscript("");
      onSilence?.();
    }, 3000);
  };

  // Clean up recognition instance and timer on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    };
  }, []);

  // Create a fresh SpeechRecognition instance with all handlers
  const createRecognition = () => {
    const SpeechRecognition = (window.SpeechRecognition ||
      window.webkitSpeechRecognition) as SpeechRecognitionConstructor;

    if (!SpeechRecognition) {
      console.error("Web Speech API not supported in this browser");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("✅ Speech recognition started");
      resetSilenceTimer();
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcriptPiece = result[0].transcript;
        if (result.isFinal) {
          setTranscript((prev) => `${prev}${transcriptPiece} `);
          setInterimTranscript("");
        } else {
          interim += transcriptPiece;
          setInterimTranscript(interim);
        }
      }
      resetSilenceTimer();
    };

    recognition.onend = () => {
      console.log("🔁 Speech recognition ended");
      if (isListening) {
        resetSilenceTimer();
        try {
          recognition.start();
          console.log("🎙️ Speech recognition restarted");
        } catch (err) {
          console.error("❌ Failed to restart recognition:", err);
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event);
    };

    return recognition;
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    } else {
      setTranscript("");
      setInterimTranscript("");

      recognitionRef.current = createRecognition();
      if (!recognitionRef.current) return;

      // Small delay before starting recognition again
      setTimeout(() => {
        try {
          recognitionRef.current?.start();
          setIsListening(true);
          resetSilenceTimer();
        } catch (err) {
          console.error("❌ Failed to start recognition:", err);
        }
      }, 150);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-lg rounded border p-4">
      <div className="mt-4 overflow-y-auto whitespace-pre-wrap bg-blue-300 p-2">
        <p>{transcript || "test"}</p>
        <p className="italic text-gray-400">{interimTranscript}</p>
      </div>

      {/* Display chat-style bubbles */}
      <div className="space-y-2 bg-red-300">
        {bubbles ? `${JSON.stringify(bubbles)}` : "bubbles do not exist"}
        {bubbles.map((text, index) => (
          <div
            key={index}
            className="max-w-fit rounded-lg bg-blue-100 px-4 py-2 text-black shadow"
          >
            {text}
          </div>
        ))}
      </div>

      {isListening && <span className="block"> I&apos;m Listening </span>}

      <button
        type="button"
        onClick={toggleListening}
        className={`rounded-full p-5 ${isListening ? "bg-slate-800 text-slate-400" : "bg-white text-black"}`}
      >
        <div className={` ${isListening ? "text-slate-400" : "text-black"}`}>
          {/* had to wrap the lucide icon in a div, since text-black and stroke-black wasn't working directly 
          stroke-current inherits the text-black from the parent div. Tailwind interprets text-black as color: black, which stroke-current picks up on.
          */}
          <Mic className="stroke-current" />
        </div>
      </button>
      {!isListening && <span className="block"> Tap to speak </span>}
    </div>
  );
}

export default VoiceInput;
