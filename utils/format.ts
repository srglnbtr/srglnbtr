import type { Timestamp } from "firebase/firestore";

export function formatFirestoreDate(ts: Timestamp | null | undefined): string {
  if (!ts) return "";
  try {
    return ts.toDate().toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
