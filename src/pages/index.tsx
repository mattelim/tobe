import VideosPage from "@/components/VideosPage";
import Layout from "@/layouts/Layout1";
import { useVideos, useUserSettings } from "@/components/Contexts";
import { ytDurationStringCheck } from "@/lib/utils";

export default function Home() {
  const { videos } = useVideos();
  const { userSettings } = useUserSettings();

  const videosFiltered = videos.filter((video: any) => {
    if (userSettings?.video?.noShorts) {
      return ytDurationStringCheck(video.contentDetails.duration);
    }
    return true;
  });

  const videosByTime = videosFiltered.sort((a: any, b: any) => {
    return (
      new Date(b.snippet.publishedAt).getTime() -
      new Date(a.snippet.publishedAt).getTime()
    );
  });

  return <VideosPage videosList={videosByTime.slice(0, 200)} />;
}

Home.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
