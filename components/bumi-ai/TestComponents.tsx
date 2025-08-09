import React from "react";

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

interface RequestCopyType {
  message: string;
  conversation_history: ConversationMessage[];
}

interface TestComponentsProps {
  errorMessage?: string;
  response?: ChatResponse | null;
  requestCopy?: RequestCopyType | null;
}

function TestComponents({
  errorMessage,
  response,
  requestCopy,
}: TestComponentsProps) {
  return (
    <>
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
                  {response.services.map(
                    (service: ServiceRecommendation, index: number) => (
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
                    ),
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

                {requestCopy.conversation_history.map(
                  (msg: ConversationMessage, i: number) => (
                    /* eslint-disable react/no-array-index-key */
                    <div key={i} className="mb-4">
                      <p>
                        <strong>user:</strong> {msg.user}
                      </p>
                      <p>
                        <strong>bumi:</strong> {msg.bumi}
                      </p>
                    </div>
                  ),
                )}
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
    </>
  );
}

export default TestComponents;
