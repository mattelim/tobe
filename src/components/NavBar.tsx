import { useRouter } from "next/router";
import { useState, useRef, memo } from "react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Home,
  Heart,
  ListVideo,
  History,
  Settings,
  GalleryThumbnails,
  ChevronLeft,
} from "lucide-react";

import {
  useNavBar,
  useSubscriptions,
  useResizing,
  SecondsProvider,
  useChannels,
} from "@/components/Contexts";
import NavCollapsibleButton from "@/components/NavCollapsibleButton";
import NavCollapsibleButtonScroll from "@/components/NavCollapsibleButtonScroll";
import TimeBar from "@/components/TimeBar";

function NavBar() {
  const router = useRouter();

  const { subs } = useSubscriptions();
  const { calculateWidth, calculatePaddingTopHeightResize } = useResizing();
  const [onHoverExpandStore, setOnHoverExpandStore] = useState(false);

  const {
    isNavBarExpanded,
    setIsNavBarExpanded,
    isSubsExpanded,
    setIsSubsExpanded,
    isChannelsExpanded,
    setIsChannelsExpanded,
  } = useNavBar();

  const { channels } = useChannels();

  const resizeWidthTimeout = useRef<any>(null);
  const resizePaddingTopTimeout = useRef<any>(null);

  function handleNavBarExpand() {
    setIsNavBarExpanded(!isNavBarExpanded);
    setIsSubsExpanded(false);
    setIsChannelsExpanded(false);
    clearTimeout(resizeWidthTimeout.current);
    resizeWidthTimeout.current = setTimeout(() => {
      calculateWidth();

      clearTimeout(resizePaddingTopTimeout.current);
      resizePaddingTopTimeout.current = setTimeout(() => {
        calculatePaddingTopHeightResize();
      }, 10);
    }, 320);
  }

  return (
    <nav
      className={`relative p-4 h-full shrink-0 transition-all ${isNavBarExpanded ? "w-64" : "w-28"}`}
    >
      <Card
        className={`relative w-full h-full bg-primary-foreground ${isNavBarExpanded ? "p-4" : "p-2"} py-4 overflow-clip shadow-md shadow-primary/25 flex flex-col justify-between`}
      >
        <div
          className="group absolute flex justify-center items-center h-full w-[6px] right-0 top-0 hover:w-4 transition-all cursor-pointer"
          onClick={handleNavBarExpand}
        >
          <div className="absolute h-full w-full right-0 top-0 blur-sm group-hover:blur-md bg-primary/10 group-hover:bg-primary/20 "></div>
          <ChevronLeft
            className={`hidden group-hover:block transition-all duration-300 ${isNavBarExpanded ? "" : "rotate-180"}`}
          />
        </div>
        <div
          className={`flex flex-col overflow-y-auto overflow-x-hidden  ${isNavBarExpanded ? "" : "px-2"} pb-2`}
        >
          <NavCollapsibleButton
            title="Subscriptions"
            href="/"
            Icon={Home}
            subList={subs}
            linkPrefix="/subs/"
            isNavBarExpanded={isNavBarExpanded}
            isListExpanded={isSubsExpanded}
            setIsListExpanded={setIsSubsExpanded}
          />
          <NavCollapsibleButtonScroll
            title="Channels"
            href="/channels"
            Icon={GalleryThumbnails}
            linkPrefix="/channels/"
            isNavBarExpanded={isNavBarExpanded}
            isListExpanded={isChannelsExpanded}
            setIsListExpanded={setIsChannelsExpanded}
          />
          <Button
            variant="ghost"
            className={`${isNavBarExpanded ? "w-full justify-start" : "w-12 justify-center"} p-2 h-12 gap-3 transition-opacity ${router.pathname === "/watchLater" ? "hover:bg-primary-foreground" : "opacity-50 hover:opacity-100"}`}
          >
            <ListVideo className="shrink-0" />
            {isNavBarExpanded && <p>Watch Later</p>}
          </Button>
          <Button
            variant="ghost"
            className={`${isNavBarExpanded ? "w-full justify-start" : "w-12 justify-center"} p-2 h-12 gap-3 transition-opacity ${router.pathname === "/watchLater" ? "hover:bg-primary-foreground" : "opacity-50 hover:opacity-100"}`}
          >
            <Heart className="shrink-0" />
            {isNavBarExpanded && <p>Favourites</p>}
          </Button>
          <Button
            variant="ghost"
            className={`${isNavBarExpanded ? "w-full justify-start" : "w-12 justify-center"} p-2 h-12 gap-3 transition-opacity ${router.pathname === "/watchLater" ? "hover:bg-primary-foreground" : "opacity-50 hover:opacity-100"}`}
          >
            <History className="shrink-0" />
            {isNavBarExpanded && <p>Watch History</p>}
          </Button>
          <Link href="/settings">
            <Button
              variant="ghost"
              className={`${isNavBarExpanded ? "w-full justify-start" : "w-12 justify-center"} p-2 h-12 gap-3 transition-opacity ${router.pathname === "/settings" ? "hover:bg-primary-foreground" : "opacity-50 hover:opacity-100"}`}
            >
              <Settings className="shrink-0" />
              {isNavBarExpanded && <p>Settings</p>}
            </Button>
          </Link>
        </div>
        <SecondsProvider>
          <TimeBar />
        </SecondsProvider>
      </Card>
    </nav>
  );
}

export default memo(NavBar);
