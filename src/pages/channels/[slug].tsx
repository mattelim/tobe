import { useRouter } from "next/router";

import VideosPage from "@/components/VideosPage";
import Layout from "@/layouts/Layout1";
import { useVideos, useUserSettings, useChannels } from "@/components/Contexts";

export default function Home() {
  const router = useRouter();
  const { slug } = router.query;

  const { videos } = useVideos();
  const { userSettings } = useUserSettings();

  const videosFiltered = videos.filter((video: any) => {
    if (userSettings?.video?.noShorts) {
      return (
        video.contentDetails.duration.includes("M") &&
        video.contentDetails.duration !== "PT1M" &&
        video.contentDetails.duration !== "PT1M1S"
      );
    }
    return true;
  });

  const { channels } = useChannels();

  const channel = channels.find((channel) => channel.title === slug);

  const videosChListArray = channel?.channels?.map((channelSub: any) => {
    const videosById = videosFiltered.filter(
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

  return <VideosPage videosList={videosByTime || []} />;
}

Home.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
