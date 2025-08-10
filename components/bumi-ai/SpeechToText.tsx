"use client";

import React, { useState, useEffect } from "react";
import UserTextBubbles from "./UserTextBubbles";
import InputUi from "./InputUI";
import useVoiceRecognition from "@/lib/hooks/useVoiceRecognition";
import useImageUpload from "@/lib/hooks/useImageUpload";
import ServiceSelection from "./ServiceSelection";
import TestComponents from "./TestComponents";

interface ChatResponse {
  action: "recommend" | "clarify";
  ai_message: string;
  services?: ServiceRecommendation[];
  clarification_question?: string;
}

interface ConversationMessage {
  user: string;
  bumi: string;
}

type RequestCopyType = {
  message: string;
  conversation_history: ConversationMessage[];
};

const isTestMode = false;

function VoiceInput() {
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [requestCopy, setRequestCopy] = useState<RequestCopyType | null>(null);

  const apiEndPath = "bumi/booking/chat";

  const {
    finishedBubbles,
    inProgressBubbles,
    isListening,
    aiThinking,
    toggleListening,
  } = useVoiceRecognition({
    onApiResponse: (data) => {
      setResponse(data);
    },
    apiEndPath,
    setErrorMessage,
    setRequestCopy,
  });

  const { uploadImage, isUploading } = useImageUpload({
    apiEndPath,
    conversationHistory: requestCopy?.conversation_history || [],
    onSuccess: (data) => {
      setResponse(data);
    },
    onError: setErrorMessage,
  });

  const [providerInfo, setProviderInfo] =
    useState<ServiceRecommendation | null>(null);

  useEffect(() => {
    if (response?.services?.length === 1) {
      setProviderInfo(response.services[0]);
    }
  }, [response?.services]);

  const services = response?.services ?? [];
  const shouldShowServices = services.length > 0;
  const action = response?.action;
  const showImageDropzone = action === "clarify";
  const showGreeting = !response && !isListening;
  const showInputUI = !shouldShowServices;
  const showAiMessage = response && !aiThinking;

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {showGreeting && (
        <div className="text-white text-center text-xl">
          How can I help you today?
        </div>
      )}
      <UserTextBubbles
        finishedBubbles={finishedBubbles}
        inProgressBubbles={inProgressBubbles}
      />

      {showAiMessage && (
        <div className="mt-4">
          <div className="my-4 flex items-center justify-center">
            <img
              src="/bumi.png"
              width={30}
              height={30}
              className="mr-2 rounded-full bg-primary"
              alt="a happy corgi with its tongue lolling out of its mouth"
            />
            <h3 className="text-white text-center text-small">Bumi says:</h3>
          </div>
          <div className="space-y-4">
            <p className="text-white text-center text-xl">
              {response.ai_message}
            </p>

            {shouldShowServices && (
              <ServiceSelection
                services={services}
                providerInfo={providerInfo}
                setProviderInfo={setProviderInfo}
              />
            )}
          </div>
        </div>
      )}

      {showInputUI && (
        <InputUi
          aiThinking={aiThinking || isUploading}
          isListening={isListening}
          toggleListening={toggleListening}
          showImageDropzone={showImageDropzone}
          onImageUpload={uploadImage}
        />
      )}

      {isTestMode && (
        <TestComponents
          errorMessage={errorMessage}
          response={response}
          requestCopy={requestCopy}
        />
      )}
    </div>
  );
}

export default VoiceInput;
