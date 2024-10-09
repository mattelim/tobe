import { useRouter } from "next/router";

import VideosPage from "@/components/VideosPage";
import Layout from "@/layouts/Layout1";
import { useVideos, useUserSettings, useChannels } from "@/components/Contexts";
import { videosFilter, videosChannelFilter } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const { slug } = router.query;

  const { videos } = useVideos();
  const { userSettings } = useUserSettings();

  const videosFiltered = videosFilter(videos, userSettings);

  const { channels } = useChannels();

  const channel = channels.find((channel) => channel.title === slug);

  const videosByTime = videosChannelFilter(videosFiltered, channel);

  return <VideosPage videosList={videosByTime || []} />;
}

Home.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
