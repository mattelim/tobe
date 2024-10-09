import VideosSummaryPage from "@/components/VideosSummaryPage";
import Layout from "@/layouts/Layout1";
import { useSaved } from "@/components/Contexts";

export default function Channels() {
  const { saved } = useSaved();

  const savedVideoReversed = saved.map((s) => {
    return {
      ...s,
      videos: s.videos.slice().reverse(),
    };
  });

  return <VideosSummaryPage summaryList={savedVideoReversed} />;
}

Channels.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
