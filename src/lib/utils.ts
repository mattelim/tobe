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

export function videosFilter(videos: any, userSettings: any) {
  return videos.filter((video: any) => {
    if (userSettings?.video?.noShorts) {
      return ytDurationStringCheck(video.contentDetails.duration);
    }
    return true;
  });
}

export function videosChannelFilter(videos: any[], channel: any) {
  const videosChListArray = channel?.channels?.map((channelSub: any) => {
    const videosById = videos.filter(
      (video) => video.snippet.channelId === channelSub.id,
    );

    const videosByTitle =
      channelSub.include?.length > 0
        ? videosById.filter((video) =>
            channelSub.include.some((include: string) =>
              video.snippet.title.includes(include),
            ),
          )
        : videosById;

    const videosByTitleExclude =
      channelSub.exclude?.length > 0
        ? videosByTitle.filter(
            (video) =>
              !channelSub.exclude.some((exclude: string) =>
                video.snippet.title.includes(exclude),
              ),
          )
        : videosByTitle;

    return videosByTitleExclude;
  });

  const videosChList = videosChListArray?.flat();

  const videosByTime = videosChList?.sort((a: any, b: any) => {
    return (
      new Date(b.snippet.publishedAt).getTime() -
      new Date(a.snippet.publishedAt).getTime()
    );
  });

  return videosByTime;
}

export function createChannelsSummary(videos: any[], channels: any[]) {
  return channels.map((channel) => {
    return {
      ...channel,
      videos: videosChannelFilter(videos, channel),
    };
  });
}
