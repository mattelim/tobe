import { useEffect } from "react";

import { useSeconds, useUserSettings } from "@/components/Contexts";

export default function TimeBar() {
  const { seconds, setSeconds } = useSeconds();
  const { userSettings, setUserSettings } = useUserSettings();

  const dailyLimit = userSettings?.time?.dailyLimit;

  const remainingSeconds = dailyLimit * 60 - seconds;

  useEffect(() => {
    const interval = setInterval(() => {
      const todaysDate = new Date();
      const prevTodaysStorage = localStorage.getItem("todaysDate");
      const prevTodaysDate = prevTodaysStorage
        ? new Date(prevTodaysStorage)
        : new Date(0);

      if (todaysDate.toDateString() === prevTodaysDate.toDateString()) {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds + 1;
          localStorage.setItem(
            "todayWatchedSeconds",
            JSON.stringify(newSeconds),
          );

          return newSeconds;
        });
      } else {
        localStorage.setItem("todayWatchedSeconds", "0");
        localStorage.setItem("todaysDate", todaysDate.toISOString());

        setSeconds(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(Math.abs(remainingSeconds / 3600));

    const minutes = Math.floor(Math.abs(remainingSeconds / 60) % 60);

    const seconds = Math.abs(remainingSeconds % 60);

    return `${hours ? String(hours).padStart(1, "0") + ":" : ""}${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const percentBar = () => {
    const percent = Math.floor((remainingSeconds / (dailyLimit * 60)) * 100);

    if (percent < 0) {
      return 0;
    }
    return percent;
  };

  return (
    <div className="relative shrink-0 flex flex-col w-full gap-2 border-t pt-6 pb-2 justify-center items-center">
      <div
        className={`absolute h-10 w-full top-4 rounded-md border ${remainingSeconds < 0 ? "border-destructive animate-pulse-fast" : "border-primary/20"}`}
      >
        <div
          className={`h-full backdrop-invert rounded overflow-clip backdrop-opacity-80 z-10`}
          style={{ width: `${percentBar()}%` }}
        ></div>
      </div>
      <div
        className={`h-6 ${remainingSeconds < 0 ? "text-destructive animate-pulse-fast" : "text-primary"} font-mono ${Math.abs(remainingSeconds) > 3600 ? "text-sm pt-px" : ""}`}
      >
        {formatTime(seconds)}
      </div>
    </div>
  );
}
