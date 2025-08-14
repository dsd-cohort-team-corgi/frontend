"use client";

import styled from "styled-components";
import Image from "next/image";
import Bumi from "@/public/bumi.gif";
import SpeechToText from "./bumi-ai/SpeechToText";

type BumiModalType = {
  isOpen: boolean;
  onOpenChange: () => void;
};

/* mega search box */

// Styled Components
const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 50;
  animation: ${(props) =>
    props.isOpen
      ? "overlayFadeIn 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      : "none"};

  @keyframes overlayFadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  position: relative;
  min-height: 125px;
  width: 800px;
  max-height: 80vh;
  overflow-y: scroll;
  background: #23262f;
  box-shadow:
    0px 40px 64px -32px rgba(15, 15, 15, 0.1),
    inset 0px 0px 20px 5px rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  border-radius: 24px;
  padding: 40px 40px 40px 40px;
  padding-top: 130px;
  animation: modalSlideIn 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  @keyframes modalSlideIn {
    0% {
      transform: scale(0.95) translateY(10px);
      opacity: 0;
    }
    100% {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }
`;

function ModalHeader() {
  return (
    <div className="absolute left-0 top-0 flex h-[100px] w-full items-center justify-between rounded-t-[24px] bg-black bg-opacity-10 p-6">
      <div className="flex items-center gap-4">
        <div
          className="flex cursor-pointer items-center rounded-full p-2 shadow-lg transition-transform duration-200 hover:scale-110"
          style={{ backgroundColor: "rgb(29, 30, 33, 0.5)" }}
        >
          <div
            className="cursor-pointer rounded-full p-2 shadow-lg transition-transform duration-200 hover:scale-110"
            style={{ backgroundColor: "#4490d3" }}
          >
            <Image
              src={Bumi}
              alt="Bumi"
              width={50}
              height={50}
              unoptimized
              className="h-[35px] w-[35px] rounded-full object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-lg font-bold text-white">Bumi</p>
          <p className="text-sm text-gray-300">
            Your AI companion for home services
          </p>
        </div>
      </div>
    </div>
  );
}

function BumiModal({ isOpen, onOpenChange }: BumiModalType) {
  return (
    <ModalOverlay isOpen={isOpen} onClick={onOpenChange}>
      {isOpen && (
        <ModalContainer
          onClick={(e) => e.stopPropagation()}
          className="no-scrollbar"
        >
          <ModalHeader />
          <SpeechToText onClose={onOpenChange} />
        </ModalContainer>
      )}
    </ModalOverlay>
  );
}

export default BumiModal;
