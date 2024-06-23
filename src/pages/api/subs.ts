import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

import credCheck from "@/lib/credentials/credCheck";
import { getSubscriptions, getChannel } from "@/lib/youTubeAPI";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const oauth2Client = await credCheck();
  if (Object.keys(oauth2Client.credentials).length === 0) {
    res.status(401).json({ error: "No credentials found" });
  }

  let subs: any;
  let subsResponse: any = await getSubscriptions(oauth2Client);
  subs = subsResponse.data.items;

  while (subsResponse.data.nextPageToken) {
    subsResponse = await getSubscriptions(
      oauth2Client,
      subsResponse.data.nextPageToken,
    );
    subs = [...subs, ...subsResponse.data.items];
  }
  const channelArrays = await Promise.all(
    subs.map(async (sub: any) => {
      const [channel] = (await getChannel(
        oauth2Client,
        sub.snippet.resourceId.channelId,
      )) as any[];
      return channel;
    }),
  );
  const channels = channelArrays.flat();

  const channelsSelect = channels.map((channel: any) => {
    return {
      id: channel.id,
      uploadPlaylistId: channel.contentDetails.relatedPlaylists.uploads,
      snippet: {
        customUrl: channel.snippet.customUrl,
        title: channel.snippet.title,
        thumbnails: {
          default: channel.snippet.thumbnails.default,
        },
      },
    };
  });

  const data = {
    subs: subs,
    channels: channels,
  };
  fs.writeFileSync("./src/pages/api/subsData.json", JSON.stringify(data));

  res.status(200).json({
    channels: channelsSelect,
  });
}
