import { useEffect, memo } from "react";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "./ui/toggle";
import {
  Eye,
  EyeOff,
  Pin,
  PinOff,
  Grid2X2,
  Grid3X3,
  RefreshCw,
} from "lucide-react";

import EditPane from "@/components/EditPane";
import {
  useResizing,
  useUserSettings,
  useThumbnailSize,
  useSubscriptions,
} from "@/components/Contexts";

function PlayEdit({
  selectedVideo,
  initialPageLoad,
}: {
  selectedVideo: any;
  initialPageLoad: boolean;
}) {
  const {
    show,
    setShow,
    pinned,
    setPinned,
    calculatePaddingTopHeight,
    iframeWidth,
    calculateWidth,
    calculatePaddingTopHeightResize,
  } = useResizing();
  const { userSettings, setUserSettings } = useUserSettings();

  const router = useRouter();

  const { thumbnailSize, setThumbnailSize } = useThumbnailSize();

  const { fetchSubs } = useSubscriptions();

  function toggleShow() {
    calculatePaddingTopHeight(true, pinned);
    setShow(!show);
    calculateWidth();
  }

  function togglePinned() {
    calculatePaddingTopHeight(false, !pinned);
    setPinned(!pinned);
    calculateWidth(true);
  }

  function handleResize() {
    calculatePaddingTopHeightResize();
    calculateWidth();
  }

  useEffect(() => {
    handleResize();
  }, [initialPageLoad]);

  return (
    <Tabs
      defaultValue="player"
      id="playEditContainer"
      style={{ width: iframeWidth }}
      className={`${pinned ? "fixed border border-muted p-4 bg-background/80 backdrop-blur rounded-md overflow-clip shadow-md z-20" : ""}`}
    >
      <div className="flex gap-2 justify-between pb-1">
        <div className="flex gap-2">
          <Toggle aria-label="Toggle show" onClick={toggleShow}>
            {show ? <Eye strokeWidth={1} /> : <EyeOff strokeWidth={1} />}
          </Toggle>
          <Toggle aria-label="Toggle pin" onClick={togglePinned}>
            {pinned ? <Pin strokeWidth={1} /> : <PinOff strokeWidth={1} />}
          </Toggle>
          {router.pathname === "/" && (
            <Button variant="outline" onClick={fetchSubs}>
              <RefreshCw strokeWidth={1} className="mr-2" /> Sync Subs
            </Button>
          )}
          {router.pathname.includes("/channels") && (
            <TabsList className="grid w-60 grid-cols-2">
              <TabsTrigger value="player" onClick={handleResize}>
                Player
              </TabsTrigger>
              <TabsTrigger value="edit" onClick={handleResize}>
                Edit
              </TabsTrigger>
            </TabsList>
          )}
        </div>
        <div className="flex gap-2 justify-center items-center">
          <Grid2X2 strokeWidth={1} />
          <Slider
            value={[thumbnailSize]}
            onValueChange={(values) => setThumbnailSize(values[0])}
            defaultValue={[1]}
            max={2}
            step={1}
            className="w-16"
          />
          <Grid3X3 strokeWidth={1} />
        </div>
      </div>
      <div className={`${show ? "block" : "hidden"}`}>
        <TabsContent value="player">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={100}>
              <iframe
                width={"100%"}
                src={`https://www.youtube.com/embed/${selectedVideo?.id}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className={`aspect-video rounded-md overflow-clip`}
              ></iframe>
            </ResizablePanel>
            <ResizableHandle
              withHandle
              className="ml-4 mr-2"
              onDragging={handleResize}
            />
            <ResizablePanel className="overflow-hidden">{}</ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>

        <TabsContent value="edit">
          <EditPane />
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default memo(PlayEdit);
