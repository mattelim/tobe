import { useRouter } from "next/router";

import VideosPage from "@/components/VideosPage";
import Layout from "@/layouts/Layout1";
import {
  useSubscriptions,
  useVideos,
  useUserSettings,
} from "@/components/Contexts";

export default function Home() {
  const router = useRouter();
  const { slug } = router.query;

  const { subs } = useSubscriptions();

  if (slug?.includes("UC") && subs) {
    router.push(`/subs/${subs.find((s) => s.id === slug)?.snippet.customUrl}`);
  }

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

  const videosByTime = videosFiltered.sort((a: any, b: any) => {
    return (
      new Date(b.snippet.publishedAt).getTime() -
      new Date(a.snippet.publishedAt).getTime()
    );
  });

  const sub = subs.find((sub) => sub.snippet.customUrl === slug);

  return (
    <VideosPage
      videosList={videosByTime.filter(
        (video) => video.snippet.channelId === sub?.id,
      )}
    />
  );
}

Home.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
