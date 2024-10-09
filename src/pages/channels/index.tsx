import VideosSummaryPage from "@/components/VideosSummaryPage";
import Layout from "@/layouts/Layout1";
import { useVideos, useUserSettings, useChannels } from "@/components/Contexts";
import { videosFilter, createChannelsSummary } from "@/lib/utils";

export default function Channels() {
  const { videos } = useVideos();
  const { userSettings } = useUserSettings();

  const { channels } = useChannels();

  const videosFiltered = videosFilter(videos, userSettings);

  const channelsSummary = createChannelsSummary(videosFiltered, channels);

  return <VideosSummaryPage summaryList={channelsSummary} />;
}

Channels.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
