"use client";

import { useState } from "react";
import { Switch, Spinner, Card, CardBody } from "@heroui/react";

interface ConversationMessage {
  user: string;
  bumi: string;
}

interface ChatRequest {
  message: string;
  conversation_history: ConversationMessage[];
}

interface ChatResponse {
  action: "recommend" | "clarify";
  ai_message: string;
  services?: ServiceRecommendation[];
  clarification_question?: string;
}

export default function BumiTestPage() {
  const [message, setMessage] = useState("");
  const [conversationHistory, setConversationHistory] = useState<
    ConversationMessage[]
  >([]);
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useLocalhost, setUseLocalhost] = useState(true);
  const [customApiUrl, setCustomApiUrl] = useState(
    "https://maidyoulook-backend.onrender.com",
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const apiBaseUrl = useLocalhost ? "http://localhost:8000" : customApiUrl;

  const testScenarios = [
    {
      id: "simple-greeting",
      name: "Simple Greeting",
      message: "Hello, how are you?",
      description: "Basic functionality test",
    },
    {
      id: "emergency-plumbing",
      name: "Emergency Plumbing",
      message: "My sink is leaking everywhere! It's an emergency!",
      description: "Should recommend emergency services",
    },
    {
      id: "vague-request",
      name: "Vague Request",
      message: "I need help with my house",
      description: "Should ask for clarification",
    },
    {
      id: "move-out-cleaning",
      name: "Move-Out Cleaning",
      message: "I need my house cleaned before I move out",
      description: "Should recommend cleaning services",
    },

    {
      id: "multiple-issues",
      name: "Multiple Issues",
      message: "I have plumbing issues and my yard needs work",
      description: "Complex scenario with multiple services",
    },
    {
      id: "kitchen-problems",
      name: "Kitchen Problems",
      message:
        "My kitchen faucet is dripping and the garbage disposal is broken",
      description: "Specific kitchen issues",
    },
    {
      id: "seasonal-cleaning",
      name: "Seasonal Cleaning",
      message: "I need spring cleaning for my 3-bedroom house",
      description: "Seasonal cleaning request",
    },
    {
      id: "appliance-repair",
      name: "Appliance Repair",
      message:
        "My dishwasher stopped working and my refrigerator is making strange noises",
      description: "Multiple appliance issues",
    },
    {
      id: "landscaping",
      name: "Landscaping",
      message: "I need my lawn mowed and some tree trimming done",
      description: "Landscaping services",
    },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById(
      "image-input",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      let apiResponse;

      if (selectedImage) {
        // Use multipart form data for image upload
        const formData = new FormData();
        formData.append("message", message.trim());
        formData.append(
          "conversation_history",
          JSON.stringify(conversationHistory),
        );
        formData.append("image", selectedImage);

        apiResponse = await fetch(`${apiBaseUrl}/bumi/booking/chat/image`, {
          method: "POST",
          body: formData,
        });
      } else {
        // Use JSON for text-only requests
        const requestBody: ChatRequest = {
          message: message.trim(),
          conversation_history: conversationHistory,
        };

        apiResponse = await fetch(`${apiBaseUrl}/bumi/booking/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
      }

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const data: ChatResponse = await apiResponse.json();
      setResponse(data);

      // Add to conversation history
      if (data.ai_message) {
        setConversationHistory((prev) => [
          ...prev,
          {
            user: message.trim(),
            bumi: data.ai_message,
          },
        ]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleTestMessage = (testMessage: string) => {
    setMessage(testMessage);
  };

  const clearHistory = () => {
    setConversationHistory([]);
    setResponse(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <Card className="shadow-sm">
          <CardBody className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-slate-900">
                  🤖 Bumi Chat Test
                </h1>
                <p className="text-slate-600">
                  Test the Bumi AI chat endpoint with text and images.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    API URL:
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm ${useLocalhost ? "font-medium text-blue-600" : "text-slate-500"}`}
                    >
                      Localhost
                    </span>
                    <Switch
                      isSelected={!useLocalhost}
                      onValueChange={(checked) => setUseLocalhost(!checked)}
                      size="sm"
                      color="primary"
                    />
                    <span
                      className={`text-sm ${!useLocalhost ? "font-medium text-blue-600" : "text-slate-500"}`}
                    >
                      Custom
                    </span>
                  </div>
                </div>

                {!useLocalhost && (
                  <input
                    type="text"
                    value={customApiUrl}
                    onChange={(e) => setCustomApiUrl(e.target.value)}
                    placeholder="Enter API URL"
                    className="rounded-lg border border-slate-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>

            <div className="mb-6 rounded-lg bg-slate-100 p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Current API:
                </span>
                <code className="rounded bg-slate-200 px-2 py-1 text-sm text-slate-800">
                  {selectedImage
                    ? `${apiBaseUrl}/bumi/booking/chat/image`
                    : `${apiBaseUrl}/bumi/booking/chat`}
                </code>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="mb-3 text-lg font-semibold text-slate-800">
                Quick Test Messages:
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {testScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => handleTestMessage(scenario.message)}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50"
                  >
                    <h3 className="text-base font-semibold text-slate-900">
                      {scenario.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-800">
                      {scenario.message}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {scenario.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {conversationHistory.length > 0 && (
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-800">
                    Conversation History:
                  </h2>
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="rounded-lg bg-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-300"
                  >
                    Clear History
                  </button>
                </div>
                <div className="max-h-60 space-y-3 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
                  {conversationHistory.map((msg) => (
                    <div
                      key={`conversation-${msg.user.substring(0, 10)}-${msg.bumi.substring(0, 10)}`}
                      className="space-y-2"
                    >
                      <div className="rounded-lg bg-white p-3">
                        <span className="text-sm font-medium text-blue-600">
                          User:
                        </span>
                        <p className="text-sm text-slate-800">{msg.user}</p>
                      </div>
                      <div className="rounded-lg bg-blue-100 p-3">
                        <span className="text-sm font-medium text-blue-800">
                          Bumi:
                        </span>
                        <p className="text-sm text-slate-800">{msg.bumi}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mb-6">
              <div className="space-y-4">
                {/* Image Upload Section */}
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-3 text-sm font-medium text-slate-800">
                    📷 Upload Image (Optional)
                  </h3>
                  <div className="flex items-center gap-4">
                    <input
                      id="image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="flex-1 rounded-lg border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {selectedImage && (
                      <button
                        type="button"
                        onClick={clearImage}
                        className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 hover:bg-red-200"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {imagePreview && (
                    <div className="mt-3">
                      <p className="mb-2 text-xs text-slate-600">Preview:</p>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-32 rounded-lg border border-slate-200"
                      />
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:bg-slate-400"
                  >
                    {loading ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            </form>

            {loading && (
              <div className="mb-6 rounded-lg bg-blue-50 p-4">
                <div className="flex items-center gap-2">
                  <Spinner size="sm" color="primary" />
                  <span className="text-blue-800">
                    Waiting for Bumi&apos;s response...
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <h3 className="mb-2 font-semibold text-red-800">Error:</h3>
                <p className="text-red-700">{error}</p>
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
                    <h4 className="mb-2 font-medium text-slate-800">
                      Raw Response:
                    </h4>
                    <pre className="whitespace-pre-wrap text-xs text-slate-600">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 rounded-lg bg-slate-50 p-4">
              <h3 className="mb-2 font-semibold text-slate-800">
                API Information:
              </h3>
              <div className="space-y-1 text-sm text-slate-600">
                <p>
                  <strong>Text Endpoint:</strong> POST {apiBaseUrl}
                  /bumi/booking/chat
                </p>
                <p>
                  <strong>Image Endpoint:</strong> POST {apiBaseUrl}
                  /bumi/booking/chat/image
                </p>
                <p>
                  <strong>Text Request Format:</strong>{" "}
                  {
                    "{message: string, conversation_history: ConversationMessage[]}"
                  }
                </p>
                <p>
                  <strong>Image Request Format:</strong>
                  FormData with message, conversation_history (JSON string), and
                  image file
                </p>
                <p>
                  <strong>Response Format:</strong>{" "}
                  {
                    "{action: string, ai_message: string, services?: ServiceRecommendation[], clarification_question?: string}"
                  }
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  💡 <strong>Tip:</strong> Upload an image of a maintenance
                  issue to get more accurate service recommendations!
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
