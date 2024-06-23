import { useRouter } from "next/router";
import { useState, useEffect, memo } from "react";

import PlayEdit from "@/components/PlayEdit";
import VideoThumbnailButton from "@/components/VideoThumbnailButton";
import {
  useSubscriptions,
  useVideos,
  useResizing,
  useUserSettings,
  useThumbnailSize,
} from "@/components/Contexts";

function VideosPage({ videosList }: { videosList: any[] }) {
  const router = useRouter();

  const [initialPageLoad, setInitialPageLoad] = useState(true);

  const { subs, setSubs } = useSubscriptions();
  const { videos, setVideos } = useVideos();
  const { paddingTopVal } = useResizing();
  const { userSettings, setUserSettings } = useUserSettings();

  const { thumbnailSize } = useThumbnailSize();

  const [selectedVideo, setSelectedVideo] = useState<any>(videosList[0]);

  useEffect(() => {
    if (videosList.length > 0) {
      setSelectedVideo(videosList[0]);
      setInitialPageLoad(false);
    }
  }, [videosList]);

  const getGridColsClass = () => {
    switch (thumbnailSize) {
      case 0:
        return "text-base sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";
      case 1:
        return "text-sm sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5";
      case 2:
        return "text-sm sm:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6";
      default:
        return "sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";
    }
  };

  return (
    <div
      id="pageContainer"
      className="overflow-x-hidden relative flex flex-col gap-4 w-full overflow-scroll p-4 pr-8"
    >
      <PlayEdit
        selectedVideo={selectedVideo}
        initialPageLoad={initialPageLoad}
      />
      <div
        className={`flex flex-col sm:grid gap-4 ${getGridColsClass()}`}
        style={{ paddingTop: paddingTopVal }}
      >
        {videosList.map((item: any) => (
          <VideoThumbnailButton
            key={item.id}
            item={item}
            selectedVideo={selectedVideo}
            setSelectedVideo={setSelectedVideo}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(VideosPage);
