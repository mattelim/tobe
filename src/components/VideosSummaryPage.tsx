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

function VideosSummaryPage({ summaryList }: { summaryList: any[] }) {
  const router = useRouter();

  const [initialPageLoad, setInitialPageLoad] = useState(true);

  const { subs, setSubs } = useSubscriptions();
  const { videos, setVideos } = useVideos();
  const { paddingTopVal } = useResizing();
  const { userSettings, setUserSettings } = useUserSettings();

  const { thumbnailSize } = useThumbnailSize();

  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  useEffect(() => {
    if (summaryList.length > 0) {
      setInitialPageLoad(false);
    }
  }, [summaryList]);

  const getGridColsClass = () => {
    switch (thumbnailSize) {
      case 0:
        return "text-base w-80";
      case 1:
        return "text-sm w-60";
      case 2:
        return "text-sm w-40";
      default:
        return "w-80";
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
      <div>
        {summaryList.map((sItem: any, index) => (
          <div
            key={sItem.id}
            style={{ paddingTop: index === 0 ? paddingTopVal : "4rem" }}
          >
            <h3 className="text-xl font-semibold pb-4">{sItem.title}</h3>
            <div className={`flex flex-row gap-4 overflow-x-scroll`}>
              {sItem?.videos?.map((item: any) => (
                <div
                  className={`${getGridColsClass()} shrink-0 [&>div]:h-full`}
                  key={item.id}
                >
                  <VideoThumbnailButton
                    item={item}
                    selectedVideo={selectedVideo}
                    setSelectedVideo={setSelectedVideo}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(VideosSummaryPage);
