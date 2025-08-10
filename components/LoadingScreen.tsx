"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "@/public/logo.png";

function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const maxLoadingTime = 5000;

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, maxLoadingTime);

    return () => clearTimeout(timeout);
  }, []);

  if (!isVisible) {
    return null;
  }

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
        <div className="mt-2 text-sm text-gray-500">Loading...</div>
      </div>
    </div>
  );
}

export default LoadingScreen;
