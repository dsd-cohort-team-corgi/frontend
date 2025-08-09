"use client";

import React, { useState } from "react";
import UserTextBubbles from "./UserTextBubbles";
import MicUi from "./SpeechUi";
import useVoiceRecognition from "@/lib/hooks/useVoiceRecognition";
import Calendar from "@/components/icons/Calendar";
import Star from "../icons/Star";
import CheckoutButton from "../buttons/CheckoutButton";
import StyledAsButton from "../StyledAsButton";

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
      // Customize this for whatever works best for the data you need
      setResponse(data);
      // data, data.message, data.response
    },
    apiEndPath,
    setErrorMessage,
    setRequestCopy,
  });

  const [providerInfo, setProviderInfo] =
    useState<ServiceRecommendation | null>(null);

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

      {response && (
        <div className="">
          <div className="my-4 flex items-center justify-center">
            <img
              src="/bumi.png"
              width={30}
              height={30}
              className="mr-2 rounded-full bg-primary"
            />
            <h3 className="text-green-800 text-center text-small">
              Bumi says:
            </h3>
          </div>
          <div className="space-y-4">
            <p className="text-white">{response.ai_message}</p>

            {response.services && response.services.length > 0 && (
              <div className="rounded-2xl bg-slate-900 bg-opacity-70 p-3">
                <div className="space-y-2">
                  {response.services.map((service, index) => (
                    <section
                      key={`service-${service.id || index}-${service.name}`}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{service.name}</span>
                        <span> ${service.price} </span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-300">
                        <span>{service.provider}</span>
                        <div className="my-1 flex items-center text-[#ffd250]">
                          <Star size={14} />
                          <span className="ml-px inline-block">
                            {" "}
                            {service.rating}{" "}
                          </span>
                        </div>
                      </div>
                      <p className="py-1 text-sm text-slate-300">
                        {service.description}
                      </p>
                      <div className="flex items-center text-sm text-slate-300">
                        <Calendar size={16} />
                        <span className="ml-1">
                          {new Date(
                            service.available_time,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-center">
                        <StyledAsButton
                          label="select"
                          onPress={() => setProviderInfo(service)}
                        />
                      </div>
                    </section>
                  ))}

                  {providerInfo ? (
                    <CheckoutButton
                      providerInfo={providerInfo}
                      disabled={!providerInfo}
                    />
                  ) : (
                    <CheckoutButton
                      providerInfo={{} as ProviderInfo | ServiceRecommendation}
                      disabled
                    />
                  )}
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
        {requestCopy && (
          <div className="border-green-200 bg-green-50 mb-6 rounded-lg border p-4">
            <h3 className="text-green-800 mb-2 font-semibold">
              requestCopy.message
            </h3>
            <div className="space-y-4">
              <div className="rounded-lg border bg-white p-3 text-black">
                <p>
                  {" "}
                  <strong>Customers Message: </strong> {requestCopy.message}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="mt-5 rounded-lg border bg-white p-3 text-black">
                <h5 className="text-green-800 mb-2 font-semibold">
                  requestCopy.conversation_history
                </h5>

                {requestCopy.conversation_history.map((msg, i) => (
                  /* eslint-disable react/no-array-index-key */
                  <div key={i} className="mb-4">
                    <p>
                      <strong>user:</strong> {msg.user}
                    </p>
                    <p>
                      <strong>bumi:</strong> {msg.bumi}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg border bg-slate-50 p-3">
        <h4 className="mb-2 font-medium text-slate-800">Raw Request :</h4>
        <pre className="whitespace-pre-wrap text-xs text-slate-600">
          {JSON.stringify(response, null, 2)}
        </pre>
      </div>

      <div className="mt-8 rounded-lg bg-slate-50 p-4">
        <h3 className="mb-2 font-semibold text-slate-800">API Information:</h3>
        <div className="space-y-1 text-sm text-slate-600">
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
