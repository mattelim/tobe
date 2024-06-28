import { useRouter } from "next/router";

import VideosPage from "@/components/VideosPage";
import Layout from "@/layouts/Layout1";
import { useWatchLater } from "@/components/Contexts";

export default function WatchLater() {
  const router = useRouter();

  const { watchLater } = useWatchLater();

  const videosReversed = watchLater.slice().reverse();

  return <VideosPage videosList={videosReversed} />;
}

WatchLater.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
