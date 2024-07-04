import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ytDurationStringCheck(duration: string) {
  return (
    duration &&
    duration.includes("M") &&
    duration !== "PT1M" &&
    duration !== "PT1M1S"
  );
}
