"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function PathLogger() {
  const pathname = usePathname();

  useEffect(() => {
    console.log("🔍 PATH CHANGED:", pathname, new Error().stack);
  }, [pathname]);

  return null;
}
