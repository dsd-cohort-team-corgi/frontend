import React from "react";
import { Spinner } from "@heroui/react";

type LoadingMessageType = {
  text: string;
};
export default function LoadingMessage({ text }: LoadingMessageType) {
  return (
    <div className="mx-auto flex items-center justify-center">
      <span className="inline-block">{text} </span>
      <Spinner className="ml-2" variant="dots" color="white" />
    </div>
  );
}
