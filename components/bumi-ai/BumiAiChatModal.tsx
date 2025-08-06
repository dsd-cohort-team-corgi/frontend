"use client";

import React from "react";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";

import SpeechToText from "@/components/bumi-ai/SpeechToText";

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
      classNames={{
        closeButton: "text-white top-8 right-6 hover:text-primary",
        // the X defaults to the top right corner, moved it with top and right
        base: "max-w-[500px]",
        // default version was too small and had a max-w-m
      }}
    >
      <ModalContent className="bg-gray-800 bg-opacity-90 text-white">
        {() => (
          <>
            <ModalHeader className="my-4 flex flex-row gap-1 text-2xl font-extrabold">
              <div> Icon</div>
              <div>
                <h3 className="font-medium"> Bumi </h3>
                <span className="text-small"> Home maintenance assistant </span>
              </div>
            </ModalHeader>
            <ModalBody className="gap-0 pl-12">
              <SpeechToText />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
