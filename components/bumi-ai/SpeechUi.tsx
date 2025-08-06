import React from "react";
import type { PressEvent } from "@react-types/shared";
import { Mic } from "lucide-react";
import { Spinner } from "@heroui/react";
import StyledAsButton from "../StyledAsButton";

type MicUiType = {
  apiThinking: boolean;
  isListening: boolean;
  toggleListening: (e: PressEvent) => void;
};

export default function MicUi({
  apiThinking,
  isListening,
  toggleListening,
}: MicUiType) {
  return (
    <>
      {apiThinking && (
        <div className="mx-auto flex items-center justify-center">
          <span className="inline-block">Hmm, let me think </span>
          <Spinner className="ml-2" variant="dots" color="white" />
        </div>
      )}
      {!apiThinking && isListening && (
        <span className="block">I&apos;m listening...</span>
      )}

      {!apiThinking && (
        <StyledAsButton
          className={`rounded-full p-5 ${
            isListening ? "bg-slate-800 text-slate-400" : "bg-white text-black"
          }`}
          onPress={toggleListening}
          startContent={<Mic size={18} />}
        />
      )}
      {!apiThinking && !isListening && (
        <span className="block">Tap to speak</span>
      )}
    </>
  );
}
