"use client";

import { useEffect } from "react";
import { initFirebaseAnalytics } from "@/firebase/client";

export function FirebaseAnalytics() {
  useEffect(() => {
    initFirebaseAnalytics();
  }, []);
  return null;
}
