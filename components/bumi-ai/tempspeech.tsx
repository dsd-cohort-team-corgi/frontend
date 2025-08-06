"use client";

import React, { useEffect, useRef, useState } from "react";

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

  const recognitionRef =
    useRef<InstanceType<SpeechRecognitionConstructor> | null>(null);
  // we want to type a variable as an instance of the SpeechRecognition construction function
  //  typeof SpeechRecognition = the type of the constructor function itself
  // <InstanceType<SpeechRecognitionConstructor> aka  InstanceType<typeof SpeechRecognition> = the type of an instance created by new SpeechRecognition()
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);

  // Reset silence timer whenever user speaks
  const resetSilenceTimer = () => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);

    silenceTimer.current = setTimeout(() => {
      console.log("🔥 No speech detected for 3 seconds!");
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

  // Check for browser support
  useEffect(() => {
    const SpeechRecognition = (window.SpeechRecognition ||
      window.webkitSpeechRecognition) as SpeechRecognitionConstructor;

    if (!SpeechRecognition) {
      console.error("Web Speech API not supported in this browser");
      return;
    }

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
          setInterimTranscript(""); // clear interim when final result received
        } else {
          interim += transcriptPiece;
          setInterimTranscript(interim);
        }
      }
      // reset time on ever reset
      resetSilenceTimer();
    };

    recognition.onend = () => {
      console.log("🔁 Speech recognition ended");
      if (isListening) {
        resetSilenceTimer(); // Give some time to detect silence before restarting
        // Restart onend if we're still listening

        try {
          recognition.start();
          // Chrome sometimes stops on its own
          console.log("🎙️ Speech recognition restarted");
        } catch (err) {
          console.error("❌ Failed to restart recognition:", err);
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event);
    };
    recognitionRef.current = recognition;
    return recognition;
  };


  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    } else {
      setTranscript("");
      setInterimTranscript("");

      // Small delay before starting recognition again to avoid Chrome glitches
      setTimeout(() => {
        try {
          recognitionRef.current?.start();
          console.log("🎙️ Recognition started");
          resetSilenceTimer();
          setIsListening(true);
        } catch (err) {
          console.error("❌ Failed to start recognition:", err);
        }
      }, 150); // 150ms delay works well in practice
    }
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    } else {
      setTranscript("");
      setInterimTranscript("");
      try {
        recognitionRef.current.start();
        console.log("🎙️ Recognition started");
        resetSilenceTimer();
      } catch (err) {
        console.error("❌ Failed to start recognition:", err);
      }
      setIsListening(true);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-lg rounded border p-4">
      <button
        type="button"
        onClick={toggleListening}
        className={`rounded px-4 py-2 text-white ${isListening ? "bg-red-500" : "bg-green-500"}`}
      >
        {isListening ? "Stop 🎙️" : "Start 🎤"}
      </button>
      <span className="text-black">{transcript || "say something"}</span>
      <span className="italic text-gray-400">{interimTranscript}</span>
    </div>
  );
}

export default VoiceInput;
