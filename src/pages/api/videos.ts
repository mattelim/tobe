import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

import credCheck from "@/lib/credentials/credCheck";
import { getPlaylistItems, getVideos } from "@/lib/youTubeAPI";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const oauth2Client = await credCheck();
  if (Object.keys(oauth2Client.credentials).length === 0) {
    res.status(401).json({ error: "No credentials found" });
  }

  const retentionDateAfter = new Date(req.body.retentionDateAfter);
  fs.writeFileSync(
    "./src/pages/api/videosReqBody.json",
    JSON.stringify(req.body),
  );

  const subsIds = Object.keys(req.body.newestVideos);
  let highestCounter = 0;
  let everReturnedEmpty = false;

  const playlistItemsArrays = await Promise.all(
    subsIds.map(async (channelId: any) => {
      const uploadPlaylistId = channelId[0] + "U" + channelId.slice(2);

      const newestVideo = req.body.newestVideos[channelId];

      let playListItem: any;
      let playListItemResponse: any = await getPlaylistItems(
        oauth2Client,
        uploadPlaylistId,
      );

      playListItem = playListItemResponse.data.items;

      let counter = 0;

      while (counter === 0 || playListItemResponse.data.nextPageToken) {
        playListItem.sort((a: any, b: any) => {
          return (
            +new Date(b.snippet.publishedAt) - +new Date(a.snippet.publishedAt)
          );
        });

        const isVideoInPlaylist =
          Boolean(newestVideo) &&
          playListItem.some((item: any) => {
            return item.snippet.resourceId.videoId === newestVideo.id;
          });
        if (isVideoInPlaylist) {
          const newestVideoIndex = playListItem.findIndex((item: any) => {
            return item.snippet.resourceId.videoId === newestVideo.id;
          });
          if (newestVideoIndex !== 0) {
            const videoIds = playListItem.map(
              (item: any) => item.snippet.resourceId.videoId,
            );
          }

          playListItem = playListItem.slice(0, newestVideoIndex);
          return playListItem;
        }

        const firstVideoBeforeRetentionDateAfterIndex = playListItem.findIndex(
          (item: any) => {
            return new Date(item.snippet.publishedAt) < retentionDateAfter;
          },
        );
        if (firstVideoBeforeRetentionDateAfterIndex !== -1) {
          playListItem = playListItem.slice(
            0,
            firstVideoBeforeRetentionDateAfterIndex,
          );
          return playListItem;
        }

        playListItemResponse = await getPlaylistItems(
          oauth2Client,
          uploadPlaylistId,
          playListItemResponse.data.nextPageToken,
        );
        playListItem = [...playListItem, ...playListItemResponse.data.items];
        counter++;
        if (counter > highestCounter) highestCounter = counter;
      }

      everReturnedEmpty = true;
      return [];
    }),
  );
  const playlistItems = playlistItemsArrays.flat();

  if (playlistItems.length === 0) {
    res.status(200).json({
      videos: [],
    });
    return;
  }

  const videoIds = playlistItems.map(
    (item: any) => item.snippet.resourceId.videoId,
  );
  let videoIdStrings: string[] = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);

    const videoIdString = batch.join(",");

    videoIdStrings.push(videoIdString);
  }
  const videoArrays = await Promise.all(
    videoIdStrings.map(async (videoIdString: string) => {
      const videos = (await getVideos(oauth2Client, videoIdString)) as any[];
      return videos;
    }),
  );
  const videos = videoArrays.flat();
  const videosSelect = videos.map((video: any) => {
    return {
      id: video.id,
      contentDetails: {
        duration: video.contentDetails.duration,
      },
      snippet: {
        channelId: video.snippet.channelId,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,

        thumbnails: {
          medium: video.snippet.thumbnails.medium,
        },
        title: video.snippet.title,
      },
    };
  });

  const data = {
    videos: videos,
  };
  fs.writeFileSync("./src/pages/api/videosData.json", JSON.stringify(data));

  res.status(200).json({
    videos: videosSelect,
  });
}
