import { ListVideo, ListX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWatchLater } from "@/components/Contexts";

export default function WatchLaterButton({ video }: { video: any }) {
  const { watchLater, handleWatchLater } = useWatchLater();

  if (watchLater.some((v) => v.id === video.id)) {
    return (
      <Button
        variant="destructive"
        className="w-10 h-10 p-[0.375rem] shadow-white/50 hover:border-white hover:border shadow"
        onClick={(e) => {
          e.stopPropagation();
          handleWatchLater(watchLater.filter((v) => v.id !== video.id));
        }}
      >
        <ListX strokeWidth={1.5} />
      </Button>
    );
  } else {
    return (
      <Button
        className="w-10 h-10 p-[0.375rem] shadow-white/50 hover:border-white hover:border shadow"
        onClick={(e) => {
          e.stopPropagation();
          handleWatchLater([
            ...watchLater,
            {
              ...video,
              savedAt: new Date(),
            },
          ]);
        }}
      >
        <ListVideo strokeWidth={1.5} />
      </Button>
    );
  }
}
