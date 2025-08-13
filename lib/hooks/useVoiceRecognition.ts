import { useCallback, useEffect, useRef, useState } from "react";

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

interface ConversationMessage {
  user: string;
  bumi: string;
}

interface ChatResponse {
  action: "recommend" | "clarify";
  ai_message: string;
  services?: ServiceRecommendation[];
  clarification_question?: string;
}

type RequestCopyType = {
  message: string;
  conversation_history: ConversationMessage[];
};

type UseVoiceRecognitionOptions = {
  onApiResponse: (data: ChatResponse) => void;
  onBeforeApiCall?: (text: string) => boolean | void; // Return true to prevent API call, false/undefined to continue
  apiEndPath: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setRequestCopy: React.Dispatch<React.SetStateAction<RequestCopyType | null>>;
};

export default function useVoiceRecognition({
  onApiResponse,
  onBeforeApiCall,
  apiEndPath,
  setErrorMessage,
  setRequestCopy,
}: UseVoiceRecognitionOptions) {
  const [isListening, setIsListening] = useState(false);
  const [finishedBubbles, setFinishedBubbles] = useState<string[]>([]);
  const [inProgressBubbles, setInProgressBubbles] = useState("");
  const [aiThinking, setAiThinking] = useState(false);

  const recognitionRef =
    useRef<InstanceType<SpeechRecognitionConstructor> | null>(null);
  //  stores the SpeechRecognition instance so we can start/stop/restart

  const conversationHistoryRef = useRef<ConversationMessage[]>([]);

  const silenceTimer = useRef<NodeJS.Timeout | null>(null);

  const textsAfterLastApiRef = useRef<string>("");
  // stores all the user speech bubbles since last API call to send in one go

  const liveTranscriptRef = useRef("");

  useEffect(() => {
    liveTranscriptRef.current = inProgressBubbles;
  }, [inProgressBubbles]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
    setIsListening(false);
    textsAfterLastApiRef.current = "";
    setInProgressBubbles("");
    liveTranscriptRef.current = "";
    setFinishedBubbles([]);
    console.log("Speech recognition stopped and state reset");
  }, []);

  const resetSilenceTimer = () => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    // clear old timer every time the user talks

    silenceTimer.current = setTimeout(() => {
      // start new 3 second timer, if it reaches its timeout of 3 seconds, send all accumulated speech to the api
      const textToSend = textsAfterLastApiRef.current.trim();
      if (!textToSend) {
        console.warn("No text accumulated to send");
        stopListening();
        return;
      }

      // Check if we should intercept this text before API call
      if (onBeforeApiCall) {
        const shouldPreventApiCall = onBeforeApiCall(textToSend);
        if (shouldPreventApiCall === true) {
          // Prevent API call, reset state, and return
          textsAfterLastApiRef.current = "";
          setInProgressBubbles("");
          liveTranscriptRef.current = "";
          if (silenceTimer.current) clearTimeout(silenceTimer.current);
          stopListening();
          return;
        }
      }

      setAiThinking(true);

      if (!Array.isArray(conversationHistoryRef.current)) {
        setErrorMessage(
          "There was an error with your message! ConversationHistoryRef.current is not an array",
        );
        stopListening();
      }

      setRequestCopy({
        message: textToSend,
        conversation_history: conversationHistoryRef.current,
      });

      stopListening();

      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${apiEndPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          conversation_history: conversationHistoryRef.current,
        }),
      })
        .then((res) => res.json())
        .then((data: ChatResponse) => {
          conversationHistoryRef.current.push({
            user: textsAfterLastApiRef.current.trim(),
            bumi: data.ai_message,
          });
          onApiResponse(data);
          // these next 3 steps are used to turn off listening:
          recognitionRef.current?.stop();
          // turns the mic off, so we don't accidently pick up the user muttering as they read the ai's reply
          setIsListening(false);
          // changes the mic's visual state so it visually turns off
          if (silenceTimer.current) clearTimeout(silenceTimer.current);
          // Clear the silence detection timer
        })
        .catch((err) => {
          console.error("API error:", err);
          setErrorMessage("an error occured when sending your api request");
        })
        .finally(() => {
          setAiThinking(false);
          textsAfterLastApiRef.current = "";
        });
    }, 3000); // 3 seconds of silence
  };

  const createRecognition = () => {
    const SpeechRecognition = (window.SpeechRecognition ||
      window.webkitSpeechRecognition) as SpeechRecognitionConstructor;
    if (!SpeechRecognition) {
      console.error("Web Speech API not supported");
      setErrorMessage("Web Speech API not supported");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let inProgressChat = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcriptPiece = result[0].transcript;

        if (result.isFinal) {
          const finalPiece = transcriptPiece.trim();
          setFinishedBubbles((prev) => [...prev, finalPiece]);
          // Add bubble immediately
          textsAfterLastApiRef.current += `${finalPiece} `;
          // Add this bubble text to the accumulated buffer for API sending
          setInProgressBubbles("");
          liveTranscriptRef.current = "";
          // Clear inProgressChat text tracking
          resetSilenceTimer();
          // Reset silence timer here because we just got new final text
        } else {
          inProgressChat += transcriptPiece;
        }
      }

      if (inProgressChat) {
        setInProgressBubbles(inProgressChat);
        liveTranscriptRef.current = inProgressChat;
        // Reset silence timer on inProgressChat results as well
        resetSilenceTimer();
      }
    };

    recognition.onend = () => {
      if (isListening) {
        // Restart recognition if still listening, aka if it unexpectedly ends
        setTimeout(() => {
          try {
            recognition.start();
          } catch (err) {
            console.error("Failed to restart recognition:", err);
            setErrorMessage("Failed to restart speech recognition");
            stopListening();
          }
        }, 200);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event);
      setErrorMessage("A speech recognition error occured");
      stopListening();
    };

    return recognition;
  };

  const toggleListening = () => {
    if (isListening) {
      // If already listening: stops everything and resets
      stopListening();
    } else {
      // User just clicked the mic to start listening
      recognitionRef.current = createRecognition();
      if (!recognitionRef.current) return;
      // safety check, if recognition fails such as if the browser doesn't support it, then it will return null

      setTimeout(() => {
        try {
          recognitionRef.current?.start();
          setIsListening(true);
          resetSilenceTimer();
        } catch (err) {
          console.error("Failed to start recognition:", err);
          setErrorMessage("Failed to start speech recognition");
          stopListening();
        }
        // setTimeout(150) gives a brief delay before starting recognition to ensure the speech engine is ready
      }, 150);
    }
  };

  // clean up stop listening
  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  return {
    finishedBubbles,
    inProgressBubbles,
    setInProgressBubbles,
    isListening,
    aiThinking,
    toggleListening,
  };
}
