"use client";

import { useState } from "react";

import BumiAiChatModal from "@/components/bumi-ai/BumiAiChatModal";

export default function ShowBearerToken() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="text-center">
      <img
        src="https://cdn.pixabay.com/photo/2020/03/31/19/20/dog-4988985_960_720.jpg"
        className="w-full"
      />
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full bg-primary px-4 py-2 text-white shadow-lg hover:bg-blue-800"
      >
        Open Chat
      </button>

      <BumiAiChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
