import React from "react";
import { Spinner } from "@heroui/react";

type LoadingMessageType = {
  text: string;
};
export default function LoadingMessage({ text }: LoadingMessageType) {
  return (
    <div className="mx-auto flex flex-col items-center justify-center">
      <span className="inline-block text-gray-400 text-sm mt-4">{text}</span>
      <Spinner variant="dots" color="white" size="lg" />
    </div>
  );
}
