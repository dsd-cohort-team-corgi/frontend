import React from "react";
import type { PressEvent } from "@react-types/shared";
import { Mic } from "lucide-react";
import StyledAsButton from "../StyledAsButton";
import LoadingMessage from "../icons/LoadingMessage";

type MicUiType = {
  aiThinking: boolean;
  isListening: boolean;
  toggleListening: (e: PressEvent) => void;
};

export default function MicUi({
  aiThinking,
  isListening,
  toggleListening,
}: MicUiType) {
  return (
    <>
      {aiThinking && <LoadingMessage text="Hmm, let me think" />}
      {!aiThinking && isListening && (
        <span className="block">I&apos;m listening...</span>
      )}

      {!aiThinking && (
        <StyledAsButton
          className={`rounded-full p-5 ${
            isListening ? "bg-slate-800 text-slate-400" : "bg-white text-black"
          }`}
          onPress={toggleListening}
          startContent={<Mic size={18} />}
        />
      )}
      {!aiThinking && !isListening && (
        <span className="block">Tap to speak</span>
      )}
    </>
  );
}
