"use client";

import { useState } from "react";
import Image from "next/image";
import BumiGif from "@/public/bumi.gif";
import BumiModal from "./BumiModal";

export default function Bumi() {
  const [isBumiModalOpen, setIsBumiModalOpen] = useState(false);

  const handleBumiClick = () => {
    setIsBumiModalOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-10 right-10 z-50">
        <div
          className="cursor-pointer rounded-full p-2 shadow-lg transition-transform duration-200 hover:scale-110"
          style={{ backgroundColor: "#4490d3" }}
          onClick={handleBumiClick}
        >
          <Image
            src={BumiGif}
            alt="Bumi"
            width={50}
            height={50}
            className="h-[35px] w-[35px] rounded-full object-cover"
          />
        </div>
      </div>
      <BumiModal
        isOpen={isBumiModalOpen}
        onOpenChange={() => setIsBumiModalOpen(false)}
      />
    </>
  );
}
