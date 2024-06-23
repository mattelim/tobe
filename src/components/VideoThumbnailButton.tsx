import Image from "next/image";

import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useSubscriptions } from "@/components/Contexts";

export default function VideoThumbnailButton({
  item,
  setSelectedVideo,
  selectedVideo,
}: {
  item: any;
  setSelectedVideo: any;
  selectedVideo: any;
}) {
  const { subs } = useSubscriptions();

  function formatDuration(duration: string) {
    const match = duration?.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) {
      return "0:00";
    }

    const hours = parseInt(match[1] || "0");
    const minutes = parseInt(match[2] || "0");
    const seconds = parseInt(match[3] || "0");

    return `${hours ? hours + ":" : ""}${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return (
    <Card
      key={item?.id}
      className="overflow-clip flex flex-col relative cursor-pointer"
      onClick={() => setSelectedVideo(item)}
    >
      <div
        className={`absolute z-10 flex justify-center items-center w-full h-full text-lg tracking-wide text-secondary bg-secondary-foreground/75 ${item?.id === selectedVideo?.id ? "block" : "hidden"}`}
      >
        <svg
          viewBox="0 0 250 250"
          xmlns="http://www.w3.org/2000/svg"
          className="w-32 h-32 animate-spin-slow timing"
        >
          <path
            id="circle"
            fill="transparent"
            d="M 125 45 A 80 80 0 1 1 125 205 A 80 80 0 1 1 125 45"
          />
          <text
            width="1000"
            fontSize="1.75rem"
            letterSpacing="0.1rem"
            fontFamily="Inter, sans-serif"
          >
            <textPath
              alignmentBaseline="baseline"
              xlinkHref="#circle"
              className="fill-white uppercase"
            >
              Now Playing ‣ Now Playing ‣
            </textPath>
          </text>
        </svg>
      </div>
      <Image
        width={320}
        height={180}
        className="w-full aspect-video"
        src={item?.snippet?.thumbnails.medium.url}
        alt={item?.snippet?.title}
      />
      <div className="relative p-4 h-full flex flex-col justify-between">
        <p className="absolute text-xs right-2 -top-8 bg-primary p-1 text-primary-foreground rounded tracking-wide">
          {formatDuration(item?.contentDetails?.duration)}
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <h3 className="line-clamp-2 leading-snug text-left">
                {item?.snippet?.title}
              </h3>
            </TooltipTrigger>
            <TooltipContent className="w-48">
              <p>{item?.snippet?.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex gap-3 mt-3">
          <Image
            width={32}
            height={32}
            className="rounded-full inline-block"
            src={
              subs.find((sub: any) => sub.id === item?.snippet?.channelId)
                ?.snippet?.thumbnails.default.url
            }
            alt={item?.snippet?.channelTitle}
          />
          <div className="leading-tight">
            <p className="text-xs text-muted-foreground line-clamp-1">
              <span className="font-medium">{item?.snippet?.channelTitle}</span>
            </p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {new Date(item?.snippet?.publishedAt).toLocaleString(undefined, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
