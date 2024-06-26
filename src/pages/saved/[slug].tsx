import { useRouter } from "next/router";

import VideosPage from "@/components/VideosPage";
import Layout from "@/layouts/Layout1";
import { useSaved } from "@/components/Contexts";

export default function Home() {
  const router = useRouter();
  const { slug } = router.query;

  const { saved } = useSaved();

  const videos = saved.find((s) => s.title === slug)?.videos || [];
  const videosReversed = videos.slice().reverse();

  return <VideosPage videosList={videosReversed} />;
}

Home.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
