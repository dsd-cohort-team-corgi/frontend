import { useState } from "react";

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

type UseImageUploadOptions = {
  apiEndPath: string;
  conversationHistory: ConversationMessage[];
  onSuccess: (data: ChatResponse) => void;
  onError: (message: string) => void;
};

export default function useImageUpload({
  apiEndPath,
  conversationHistory,
  onSuccess,
  onError,
}: UseImageUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("message", "I've uploaded an image of my issue");
      formData.append(
        "conversation_history",
        JSON.stringify(conversationHistory),
      );
      formData.append("image", file);

      const apiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/${apiEndPath}/image`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const data: ChatResponse = await apiResponse.json();
      onSuccess(data);
    } catch (err) {
      console.error("Image upload error:", err);
      onError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
  };
}
