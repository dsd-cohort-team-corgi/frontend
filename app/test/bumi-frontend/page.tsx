"use client";

import { useState } from "react";

import BumiAiChatModal from "@/components/bumi-ai/BumiAiChatModal";

export default function ShowBearerToken() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full bg-purple-600 px-4 py-2 text-white shadow-lg hover:bg-purple-700"
      >
        Open Chat 💬
      </button>

      <BumiAiChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
