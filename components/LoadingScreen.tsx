"use client";

import Image from "next/image";
import logo from "@/public/logo.png";

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <Image
            src={logo}
            alt="Wipe Right Logo"
            width={120}
            height={120}
            priority
          />
        </div>
        <div className="h-1 w-32 overflow-hidden rounded-full bg-gray-200">
          <div className="animate-loading-bar h-full bg-blue-500" />
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
