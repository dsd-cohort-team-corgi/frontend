"use client";

import React, { useState } from "react";
import UserTextBubbles from "./UserTextBubbles";
import MicUi from "./SpeechUi";
import useVoiceRecognition from "@/lib/hooks/useVoiceRecognition";

interface ServiceRecommendation {
  id: string;
  name: string;
  provider: string;
  price: number;
  rating: number;
  description: string;
  category: string;
  duration: number;
}

interface ChatResponse {
  action: "recommend" | "clarify";
  ai_message: string;
  services?: ServiceRecommendation[];
  clarification_question?: string;
}

function VoiceInput() {
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const apiBaseUrl = "";
  // process.env.NEXT_PUBLIC_URL? "http://localhost:8000"
  // "https://maidyoulook-backend.onrender.com",

  const {
    finishedBubbles,
    inProgressBubbles,
    isListening,
    aiThinking,
    toggleListening,
    conversationHistoryRef,
  } = useVoiceRecognition({
    onApiResponse: (data) => {
      // Customize this for whatever works best for the data you need
      setResponse(data);
      // data, data.message, data.response
    },
    apiBaseUrl,
    setErrorMessage,
  });

  return (
    <div className="mt-10 flex max-w-lg flex-col items-center space-y-4">
      <UserTextBubbles
        finishedBubbles={finishedBubbles}
        inProgressBubbles={inProgressBubbles}
      />
      <MicUi
        aiThinking={aiThinking}
        isListening={isListening}
        toggleListening={toggleListening}
      />

      {/* ################ Testing Frontend Code Starts here  ################ */}

      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="mb-2 font-semibold text-red-800">Error:</h3>
          <p className="text-red-700">{errorMessage}</p>
        </div>
      )}

      {response && (
        <div className="border-green-200 bg-green-50 mb-6 rounded-lg border p-4">
          <h3 className="text-green-800 mb-2 font-semibold">
            Bumi&apos;s Response:
          </h3>
          <div className="space-y-4">
            <div className="rounded-lg border bg-white p-3">
              <h4 className="mb-2 font-medium text-slate-800">
                Action: {response.action}
              </h4>
              <p className="text-slate-800">{response.ai_message}</p>
            </div>

            {response.services && response.services.length > 0 && (
              <div className="rounded-lg border bg-white p-3">
                <h4 className="mb-2 font-medium text-slate-800">
                  Recommended Services:
                </h4>
                <div className="space-y-2">
                  {response.services.map((service, index) => (
                    <div
                      key={`service-${service.id || index}-${service.name}`}
                      className="rounded-lg border border-slate-200 p-2"
                    >
                      <p className="font-medium text-slate-800">
                        {service.name}
                      </p>
                      <p className="text-sm text-slate-600">
                        {service.provider} • ${service.price}
                      </p>
                      <p className="text-sm text-slate-600">
                        {service.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {response.clarification_question && (
              <div className="rounded-lg border bg-yellow-50 p-3">
                <h4 className="mb-2 font-medium text-yellow-800">
                  Clarification Question:
                </h4>
                <p className="text-yellow-700">
                  {response.clarification_question}
                </p>
              </div>
            )}

            <div className="rounded-lg border bg-slate-50 p-3">
              <h4 className="mb-2 font-medium text-slate-800">Raw Response:</h4>
              <pre className="whitespace-pre-wrap text-xs text-slate-600">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
      <div>
        {" "}
        {conversationHistoryRef.current.map((chat, index) => (
          <div
            /* eslint-disable react/no-array-index-key */
            key={`chatHistory-${index}-${chat}`}
            className="rounded-lg border border-slate-200 bg-white p-2"
          >
            <p className="font-medium text-slate-800">
              <span>User: </span>
              {chat.user}
            </p>
            <p className="text-sm text-slate-600">
              <span>Bumi: </span>
              {chat.bumi}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg bg-slate-50 p-4">
        <h3 className="mb-2 font-semibold text-slate-800">API Information:</h3>
        <div className="space-y-1 text-sm text-slate-600">
          <p>
            <strong>Current Endpoint:</strong> POST api/speech
          </p>
          <p>
            <strong>Future Endpoint:</strong> POST {apiBaseUrl}
            /bumi/booking/chat
          </p>

          <p>
            <strong>Request Format:</strong>{" "}
            {"{message: string, conversation_history: ConversationMessage[]}"}
          </p>
          <p>
            <strong>Response Format:</strong>{" "}
            {
              "{action: string, ai_message: string, services?: ServiceRecommendation[], clarification_question?: string}"
            }
          </p>
        </div>
      </div>
    </div>
  );
}

export default VoiceInput;
