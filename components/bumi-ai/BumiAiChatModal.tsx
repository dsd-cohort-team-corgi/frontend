"use client";

import React from "react";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";

import SpeechToText from "@/components/bumi-ai/SpeechToText";
import BumiAiHeader from "./BumiAiHeader";

type BumiAiChatModalType = {
  isOpen: boolean;
  onClose: () => void;
};

export default function BumiAiChatModal({
  isOpen,
  onClose,
}: BumiAiChatModalType) {
  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      onClose={onClose}
      isDismissable={false} // This stops closing on outside clicks or escape
      classNames={{
        closeButton: "text-slate-300 top-8 right-6 hover:text-primary",
        // the X defaults to the top right corner, moved it with top and right
        base: "max-w-[500px]",
        // default version was too small and had a max-w-m
      }}
    >
      <ModalContent className="bg-slate-800 bg-opacity-70 text-white backdrop-blur">
        {() => (
          <>
            <ModalHeader className="mb-4 flex flex-row items-center bg-[#2a323b] bg-opacity-70 text-2xl font-extrabold">
              <BumiAiHeader />
            </ModalHeader>
            <ModalBody>
              <SpeechToText />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
