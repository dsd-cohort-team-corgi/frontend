"use client";

import React from "react";
import Image from "next/image";
import Bumi from "@/public/bumi-actual.png";

export default function BumiFlowHeader() {
  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="max-w-lg pr-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Meet Bumi AI
            </h1>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              A purpose-built intelligence system for home services. Not a
              chatbot wrapper, but a specialized AI that understands context,
              manages complex workflows, and orchestrates real booking actions.
            </p>
            <p className="text-sm text-gray-500">
              Named after our beloved mascot — the smartest pup we know.
            </p>
          </div>

          <div className="flex-shrink-0">
            <div className="w-48 h-48 bg-gray-100 rounded-full overflow-hidden">
              <Image
                src={Bumi}
                alt="Bumi the dog - our AI mascot"
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
