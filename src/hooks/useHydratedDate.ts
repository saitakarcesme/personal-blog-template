"use client";

import { useState, useSyncExternalStore } from "react";

function getTodayDateValue() {
  return new Date().toISOString().slice(0, 10);
}

function subscribe() {
  return () => {};
}

function getServerSnapshot() {
  return "";
}

export function useHydratedDate(initialDate?: string) {
  const today = useSyncExternalStore(
    subscribe,
    getTodayDateValue,
    getServerSnapshot,
  );
  const [date, setDate] = useState<string | null>(initialDate ?? null);

  return [date ?? today, setDate] as const;
}
