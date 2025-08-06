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
      isDismissable={false} // This stops closing on outside clicks or escape
      classNames={{
        closeButton: "text-slate-300 top-8 right-6 hover:text-primary",
        // the X defaults to the top right corner, moved it with top and right
        base: "max-w-[500px]",
        // default version was too small and had a max-w-m
      }}
    >
      <ModalContent className="bg-slate-800 bg-opacity-80 text-white">
        {() => (
          <>
            <ModalHeader className="mb-4 flex flex-row items-center bg-slate-900 bg-opacity-80 text-2xl font-extrabold">
              <img
                src="/bumi.png"
                width={75}
                height={75}
                className="mr-4 rounded-full bg-primary"
              />
              <div>
                <h3 className="font-small"> Bumi </h3>
                <span className="block text-base font-light">
                  {" "}
                  Home maintenance assistant{" "}
                </span>
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
