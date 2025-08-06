import React from "react";
import type { PressEvent } from "@react-types/shared";
import { Mic } from "lucide-react";
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
      {apiThinking && <span className="block">Hmm, let me think...</span>}

      {!apiThinking && isListening && (
        <span className="block">I'm listening...</span>
      )}

      {!apiThinking && (
        <StyledAsButton
          className={`rounded-full p-5 ${
            isListening ? "bg-slate-800 text-slate-400" : "bg-white text-black"
          }`}
          onPress={toggleListening}
          startContent={<Mic size={18} />}
        />
        // <button
        //   type="button"
        //   onClick={toggleListening}
        // >
        //   <div className={`${isListening ? "text-slate-400" : "text-black"}`}>
        //     <Mic className="stroke-current" />
        //   </div>
        // </button>
      )}

      {!apiThinking && !isListening && (
        <span className="block">Tap to speak</span>
      )}
    </>
  );
}
