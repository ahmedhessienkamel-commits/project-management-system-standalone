import { useCallback, useEffect, useRef, useState } from "react";

type DraftStatus = "idle" | "restored" | "saving" | "saved";

export function parseDraft<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function serializeDraft<T>(value: T): string {
  return JSON.stringify(value);
}

function readDraft<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return parseDraft(window.localStorage.getItem(key), fallback);
  } catch {
    return fallback;
  }
}

export function useDraft<T>(key: string, initialValue: T, delay = 450) {
  const [value, setValue] = useState<T>(() => readDraft(key, initialValue));
  const [status, setStatus] = useState<DraftStatus>(() => {
    if (typeof window === "undefined") return "idle";
    return window.localStorage.getItem(key) ? "restored" : "idle";
  });
  const ready = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      ready.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready.current || typeof window === "undefined") return;
    setStatus("saving");
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(key, serializeDraft(value));
        setStatus("saved");
      } catch {
        setStatus("idle");
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [key, value, delay]);

  const clear = useCallback(() => {
    if (typeof window !== "undefined") window.localStorage.removeItem(key);
    setValue(initialValue);
    setStatus("idle");
  }, [initialValue, key]);

  return { value, setValue, clear, status, hasDraft: status === "restored" || status === "saving" || status === "saved" };
}

export type { DraftStatus };
