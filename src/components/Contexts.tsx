import { useRouter } from "next/router";
import {
  useState,
  useContext,
  createContext,
  ReactNode,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";

interface SecondsContextType {
  seconds: number;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
}
const SecondsContext = createContext<SecondsContextType>({
  seconds: 0,
  setSeconds: () => {},
});
export const useSeconds = () => useContext(SecondsContext);

export const SecondsProvider = ({ children }: { children: ReactNode }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const localStorageSeconds = localStorage.getItem("todayWatchedSeconds");

    setSeconds(localStorageSeconds ? JSON.parse(localStorageSeconds) : 0);
  }, []);

  return (
    <SecondsContext.Provider value={{ seconds, setSeconds }}>
      {children}
    </SecondsContext.Provider>
  );
};

interface ChannelsContextType {
  channels: any[];
  setChannels: React.Dispatch<React.SetStateAction<any[]>>;
}

const ChannelsContext = createContext<ChannelsContextType>({
  channels: [],
  setChannels: () => {},
});
export const useChannels = () => useContext(ChannelsContext);

export const ChannelsProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [channels, setChannels] = useState<any[]>([]);

  const setChannelsCallback = useCallback(
    (value: any) => setChannels(value),
    [],
  );

  const channelsContextValues = useMemo(
    () => ({
      channels,
      setChannels: setChannelsCallback,
    }),
    [channels, setChannelsCallback],
  );

  async function fetchChannels() {
    const response = await fetch("/api/channels", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      const data = await response.json();
      if (!router.query.code) {
        router.push("/auth");
      }
    }
    if (!response.ok) {
      return;
    }
    const data = await response.json();

    setChannels(data);
  }

  useEffect(() => {
    fetchChannels();
  }, []);

  return (
    <ChannelsContext.Provider value={channelsContextValues}>
      {children}
    </ChannelsContext.Provider>
  );
};

interface SavedContextType {
  saved: any[];
  setSaved: React.Dispatch<React.SetStateAction<any[]>>;
}

const SavedContext = createContext<SavedContextType>({
  saved: [],
  setSaved: () => {},
});
export const useSaved = () => useContext(SavedContext);

export const SavedProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [saved, setSaved] = useState<any[]>([]);

  const setSavedCallback = useCallback((value: any) => setSaved(value), []);

  const savedContextValues = useMemo(
    () => ({
      saved,
      setSaved: setSavedCallback,
    }),
    [saved, setSavedCallback],
  );

  async function fetchSaved() {
    const response = await fetch("/api/saved", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      const data = await response.json();
      if (!router.query.code) {
        router.push("/auth");
      }
    }
    if (!response.ok) {
      return;
    }
    const data = await response.json();

    setSaved(data);
  }

  useEffect(() => {
    fetchSaved();
  }, []);

  return (
    <SavedContext.Provider value={savedContextValues}>
      {children}
    </SavedContext.Provider>
  );
};

interface WatchLaterContextType {
  watchLater: any[];
  setWatchLater: React.Dispatch<React.SetStateAction<any[]>>;
  fetchWatchLater: () => void;
  postWatchLater: (newObjects: any) => void;
  handleWatchLater: (newWatchLater: any) => void;
}

const WatchLaterContext = createContext<WatchLaterContextType>({
  watchLater: [],
  setWatchLater: () => {},
  fetchWatchLater: () => {},
  postWatchLater: () => {},
  handleWatchLater: () => {},
});
export const useWatchLater = () => useContext(WatchLaterContext);

export const WatchLaterProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [watchLater, setWatchLater] = useState<any[]>([]);

  const setWatchLaterCallback = useCallback(
    (value: any) => setWatchLater(value),
    [],
  );

  async function fetchWatchLater() {
    const response = await fetch("/api/watchlater", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      const data = await response.json();
      if (!router.query.code) {
        router.push("/auth");
      }
    }
    if (!response.ok) {
      return;
    }
    const data = await response.json();

    setWatchLater(data);
  }

  async function postWatchLater(newObjects: any) {
    const response = await fetch("/api/watchlater", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newObjects),
    });

    if (response.status === 401) {
      const data = await response.json();
      if (!router.query.code) {
        router.push("/auth");
      }
    }
    if (!response.ok) {
      return;
    }
    const data = await response.json();
  }

  const fetchWatchLaterCallback = useCallback(() => fetchWatchLater(), []);

  const postWatchLaterCallback = useCallback(
    (value: any) => postWatchLater(value),
    [],
  );

  const handleWatchLater = (newWatchLater: any) => {
    setWatchLater(newWatchLater);
    postWatchLater(newWatchLater);
  };

  const handleWatchLaterCallback = useCallback(
    (value: any) => handleWatchLater(value),
    [],
  );

  useEffect(() => {
    fetchWatchLater();
  }, []);

  const { userSettings } = useUserSettings();

  useEffect(() => {
    if (watchLater.length && userSettings.watchLater.retentionPeriodDays) {
      const retentionDate = new Date();
      retentionDate.setDate(
        retentionDate.getDate() - userSettings.watchLater.retentionPeriodDays,
      );
      retentionDate.setHours(0, 0, 0, 0);
      const newWatchLater = watchLater.filter(
        (v) => new Date(v.savedAt) > retentionDate,
      );
      if (watchLater.length !== newWatchLater.length) {
        handleWatchLater(newWatchLater);
      }
    }
  }, [watchLater, userSettings.watchLater.retentionPeriodDays]);

  const watchLaterContextValues = useMemo(
    () => ({
      watchLater,
      setWatchLater: setWatchLaterCallback,
      fetchWatchLater: fetchWatchLaterCallback,
      postWatchLater: postWatchLaterCallback,
      handleWatchLater: handleWatchLaterCallback,
    }),
    [
      watchLater,
      setWatchLaterCallback,
      fetchWatchLaterCallback,
      postWatchLaterCallback,
      handleWatchLaterCallback,
    ],
  );

  return (
    <WatchLaterContext.Provider value={watchLaterContextValues}>
      {children}
    </WatchLaterContext.Provider>
  );
};

interface ThumbnailSizeContextType {
  thumbnailSize: number;
  setThumbnailSize: React.Dispatch<React.SetStateAction<number>>;
}

const ThumbnailSizeContext = createContext<ThumbnailSizeContextType>({
  thumbnailSize: 0,
  setThumbnailSize: () => {},
});
export const useThumbnailSize = () => useContext(ThumbnailSizeContext);

export const ThumbnailSizeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const router = useRouter();

  const [thumbnailSize, setThumbnailSize] = useState(0);

  async function fetchUserSettings() {
    const response = await fetch("/api/userSettings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      const data = await response.json();
      if (!router.query.code) {
        router.push("/auth");
      }
    }
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setThumbnailSize(data.video.thumbnailSize);
    localStorage.setItem("dailyLimit", data.time.dailyLimit);
  }

  useEffect(() => {
    fetchUserSettings();
  }, []);

  return (
    <ThumbnailSizeContext.Provider value={{ thumbnailSize, setThumbnailSize }}>
      {children}
    </ThumbnailSizeContext.Provider>
  );
};

interface NavBarContextType {
  isNavBarExpanded: boolean;
  setIsNavBarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isSubsExpanded: boolean;
  setIsSubsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isChannelsExpanded: boolean;
  setIsChannelsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isSavedExpanded: boolean;
  setIsSavedExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBarContext = createContext<NavBarContextType>({
  isNavBarExpanded: true,
  setIsNavBarExpanded: () => {},
  isSubsExpanded: false,
  setIsSubsExpanded: () => {},
  isChannelsExpanded: false,
  setIsChannelsExpanded: () => {},
  isSavedExpanded: false,
  setIsSavedExpanded: () => {},
});
export const useNavBar = () => useContext(NavBarContext);

interface SubscriptionsContextType {
  subs: any[];
  setSubs: React.Dispatch<React.SetStateAction<any[]>>;
  fetchSubs: () => void;
}

const SubscriptionsContext = createContext<SubscriptionsContextType>({
  subs: [],
  setSubs: () => {},
  fetchSubs: () => {},
});
export const useSubscriptions = () => useContext(SubscriptionsContext);

interface VideosContextType {
  videos: any[];
  setVideos: React.Dispatch<React.SetStateAction<any[]>>;
}

const VideosContext = createContext<VideosContextType>({
  videos: [],
  setVideos: () => {},
});
export const useVideos = () => useContext(VideosContext);

export const VideosContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const router = useRouter();

  const [videos, setVideos] = useState<any>([]);

  const setVideosCallback = useCallback((value: any) => setVideos(value), []);

  const videoContextValues = useMemo(
    () => ({
      videos,
      setVideos: setVideosCallback,
    }),
    [videos, setVideosCallback],
  );

  async function fetchVideos() {
    const response = await fetch("/api/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lastIds: [],
      }),
    });

    if (response.status === 401) {
      const data = await response.json();
      if (!router.query.code) {
        router.push("/auth");
      }
    }
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setVideos(data.videos);
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <VideosContext.Provider value={videoContextValues}>
      {children}
    </VideosContext.Provider>
  );
};

interface ResizingContextType {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  pinned: boolean;
  setPinned: React.Dispatch<React.SetStateAction<boolean>>;
  iframeWidth: string;
  setIframeWidth: React.Dispatch<React.SetStateAction<string>>;
  paddingTopVal: number;
  setPaddingTopVal: React.Dispatch<React.SetStateAction<number>>;
  calculatePaddingTopHeight: (
    isToggleShow: boolean,
    newPinned: boolean,
  ) => void;
  calculateWidth: (isClicked?: boolean) => void;
  calculatePaddingTopHeightResize: (isResized?: boolean) => void;
}

const ResizingContext = createContext<ResizingContextType>({
  show: true,
  setShow: () => {},
  pinned: false,
  setPinned: () => {},
  iframeWidth: "100%",
  setIframeWidth: () => {},
  paddingTopVal: 16,
  setPaddingTopVal: () => {},
  calculatePaddingTopHeight: () => {},
  calculateWidth: () => {},
  calculatePaddingTopHeightResize: () => {},
});
export const useResizing = () => useContext(ResizingContext);

interface UserSettingsContextType {
  userSettings: any;
  setUserSettings: React.Dispatch<React.SetStateAction<number>>;
}

const UserSettingsContext = createContext<UserSettingsContextType>({
  userSettings: {},
  setUserSettings: () => {},
});
export const useUserSettings = () => useContext(UserSettingsContext);

export const ContextsProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [isNavBarExpanded, setIsNavBarExpanded] = useState(true);
  const [isSubsExpanded, setIsSubsExpanded] = useState(false);
  const [isChannelsExpanded, setIsChannelsExpanded] = useState(false);
  const [isSavedExpanded, setIsSavedExpanded] = useState(false);

  const setIsNavBarExpandedCallback = useCallback(
    (value: any) => setIsNavBarExpanded(value),
    [],
  );
  const setIsSubsExpandedCallback = useCallback(
    (value: any) => setIsSubsExpanded(value),
    [],
  );
  const setIsChannelsExpandedCallback = useCallback(
    (value: any) => setIsChannelsExpanded(value),
    [],
  );
  const setIsSavedExpandedCallback = useCallback(
    (value: any) => setIsSavedExpanded(value),
    [],
  );

  const navBarContextValues = useMemo(
    () => ({
      isNavBarExpanded,
      setIsNavBarExpanded: setIsNavBarExpandedCallback,
      isSubsExpanded,
      setIsSubsExpanded: setIsSubsExpandedCallback,
      isChannelsExpanded,
      setIsChannelsExpanded: setIsChannelsExpandedCallback,
      isSavedExpanded,
      setIsSavedExpanded: setIsSavedExpandedCallback,
    }),
    [
      isNavBarExpanded,
      isSubsExpanded,
      isChannelsExpanded,
      isSavedExpanded,
      setIsNavBarExpandedCallback,
      setIsSubsExpandedCallback,
      setIsChannelsExpandedCallback,
      setIsSavedExpandedCallback,
    ],
  );

  const [subs, setSubs] = useState<any[]>([]);

  const setSubsCallback = useCallback((value: any) => setSubs(value), []);
  const fetchSubsCallback = useCallback(() => fetchSubs(), []);

  const subsContextValues = useMemo(
    () => ({
      subs,
      setSubs: setSubsCallback,
      fetchSubs: fetchSubsCallback,
    }),
    [subs, setSubsCallback, fetchSubsCallback],
  );

  const [userSettings, setUserSettings] = useState({
    time: {
      dailyLimit: null,
      dailyLimitReset: null,
    },
    video: {
      thumbnailSize: null,
      noShorts: null,
      lastUpdated: null,
      retentionPeriodWeeks: null,
    },
    watchLater: {
      retentionPeriodDays: null,
    },
  });

  const setUserSettingsCallback = useCallback(
    (value: any) => setUserSettings(value),
    [],
  );

  const userSettingsContextValues = useMemo(
    () => ({
      userSettings,
      setUserSettings: setUserSettingsCallback,
    }),
    [userSettings, setUserSettingsCallback],
  );

  const [videos, setVideos] = useState<any>([]);

  const setVideosCallback = useCallback((value: any) => setVideos(value), []);

  const videoContextValues = useMemo(
    () => ({
      videos,
      setVideos: setVideosCallback,
    }),
    [videos, setVideosCallback],
  );

  const [show, setShow] = useState(true);
  const [pinned, setPinned] = useState(true);
  const [paddingTopVal, setPaddingTopVal] = useState(16);
  const [iframeWidth, setIframeWidth] = useState("100%");

  const setShowCallback = useCallback((value: any) => setShow(value), []);
  const setPinnedCallback = useCallback((value: any) => setPinned(value), []);
  const setPaddingTopValCallback = useCallback(
    (value: any) => setPaddingTopVal(value),
    [],
  );
  const setIframeWidthCallback = useCallback(
    (value: any) => setIframeWidth(value),
    [],
  );
  const calculatePaddingTopHeightCallback = useCallback(
    (isToggleShow: boolean, newPinned: boolean) =>
      calculatePaddingTopHeight(isToggleShow, newPinned),
    [pinned, show],
  );
  const calculateWidthCallback = useCallback(
    (isClicked: boolean = false) => calculateWidth(isClicked),
    [pinned],
  );
  const calculatePaddingTopHeightResizeCallback = useCallback(
    (isResized: boolean = false) => calculatePaddingTopHeightResize(isResized),
    [pinned],
  );

  const resizingContextValues = useMemo(
    () => ({
      show,
      setShow: setShowCallback,
      pinned,
      setPinned: setPinnedCallback,
      paddingTopVal,
      setPaddingTopVal: setPaddingTopValCallback,
      iframeWidth,
      setIframeWidth: setIframeWidthCallback,
      calculatePaddingTopHeight: calculatePaddingTopHeightCallback,
      calculateWidth: calculateWidthCallback,
      calculatePaddingTopHeightResize: calculatePaddingTopHeightResizeCallback,
    }),
    [
      show,
      pinned,
      paddingTopVal,
      iframeWidth,
      setShowCallback,
      setPinnedCallback,
      setPaddingTopValCallback,
      setIframeWidthCallback,
      calculatePaddingTopHeightCallback,
      calculateWidthCallback,
      calculatePaddingTopHeightResizeCallback,
    ],
  );

  async function fetchSubs() {
    const response = await fetch("/api/subs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      const data = await response.json();
      if (!router.query.code) {
        router.push("/auth");
      }
    }
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setSubs(data.channels);
    deleteAllAndSaveSubstoIDB(data.channels);
  }

  function deleteAllAndSaveSubstoIDB(subs: any[]) {
    const db = indexedDB.open("yourtube", 11);

    db.onsuccess = function () {
      const database = db.result;
      const transaction = database.transaction("subs", "readwrite");
      const subsStore = transaction.objectStore("subs");
      const clearRequest = subsStore.clear();

      clearRequest.onsuccess = function () {
        subs.forEach((sub: any) => {
          const addRequest = subsStore.add(sub);
          addRequest.onsuccess = function () {};
        });
      };

      clearRequest.onerror = function (event: Event) {};
    };
  }

  async function fetchUserSettings() {
    const response = await fetch("/api/userSettings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      const data = await response.json();
      if (!router.query.code) {
        router.push("/auth");
      }
    }
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setUserSettings(data);

    localStorage.setItem("dailyLimit", data.time.dailyLimit);
  }

  function getVideosFromIDB() {
    const db = indexedDB.open("yourtube", 11);

    db.onsuccess = function () {
      const database = db.result;
      const transaction = database.transaction("videos", "readonly");
      const videosStore = transaction.objectStore("videos");
      const request = videosStore.getAll();
      request.onsuccess = function () {
        setVideos(request.result);
      };
    };
  }

  function getSubsFromIDB(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const db = indexedDB.open("yourtube", 11);

      db.onsuccess = function () {
        const database = db.result;
        const transaction = database.transaction("subs", "readonly");
        const subsStore = transaction.objectStore("subs");
        const request = subsStore.getAll();

        request.onsuccess = function () {
          setSubs(request.result);
          resolve(request.result);
        };

        request.onerror = function () {
          reject(request.error);
        };
      };

      db.onerror = function () {
        reject(db.error);
      };
    });
  }

  function deleteVideosPastDate() {
    const db = indexedDB.open("yourtube", 11);

    db.onsuccess = function () {
      const database = db.result;
      const transaction = database.transaction("videos", "readwrite");
      const videosStore = transaction.objectStore("videos");

      let publishedAtIndex = videosStore.index("publishedAt");

      let upperBoundDate = new Date();

      let counter = 0;

      upperBoundDate.setDate(
        upperBoundDate.getDate() -
          (userSettings.video.retentionPeriodWeeks ?? 1) * 7,
      );

      upperBoundDate.setHours(0, 0, 0, 0);
      const upperBoundDateISOString = upperBoundDate.toISOString();
      let dateRange = IDBKeyRange.upperBound(upperBoundDateISOString);

      let cursorRequest = publishedAtIndex.openCursor(dateRange);

      cursorRequest.onerror = function (event: Event) {};

      cursorRequest.onsuccess = function (event) {
        let cursor = (event.target as IDBRequest).result;
        if (cursor) {
          let deleteRequest = cursor.delete();

          deleteRequest.onerror = function (event: Event) {};

          deleteRequest.onsuccess = function (event: Event) {
            counter++;
          };
          cursor.continue();
        } else {
        }
      };
    };
  }

  function getNewestVideosForEachChannelFromIDB(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const db = indexedDB.open("yourtube", 11);

      db.onsuccess = function () {
        const database = db.result;
        const transaction = database.transaction("videos", "readwrite");
        const videosStore = transaction.objectStore("videos");

        let index = videosStore.index("channelPublishIndex");

        const newestVideos = subs.reduce((acc, sub) => {
          acc[sub.id] = null;
          return acc;
        }, {});

        let cursorRequest = index.openCursor(null, "prev");

        let counter = 0;

        cursorRequest.onsuccess = function (event) {
          let cursor = (event.target as IDBRequest).result;

          if (cursor) {
            let video = cursor.value;

            if (!newestVideos[video.snippet.channelId]) {
              newestVideos[video.snippet.channelId] = video;
            } else {
              if (
                newestVideos[video.snippet.channelId].contentDetails
                  .duration === "P0D"
              ) {
                newestVideos[video.snippet.channelId] = video;
              }
            }

            counter++;

            cursor.continue();
          } else {
            resolve(newestVideos);
          }
        };

        cursorRequest.onerror = function (event) {
          reject((event.target as IDBRequest).error);
        };

        transaction.oncomplete = function () {};

        transaction.onerror = function (event) {};
      };
    });
  }

  async function fetchNewVideos(newestVideos: any, retentionDateAfter: string) {
    const response = await fetch("/api/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newestVideos: newestVideos,
        retentionDateAfter: retentionDateAfter,
      }),
    });

    if (response.status === 401) {
      const data = await response.json();
      if (!router.query.code) {
        router.push("/auth");
      }
    }
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    if (data.videos.length === 0) return;

    saveNewVideosToIDB(data.videos).then(() => {
      getVideosFromIDB();
    });
  }

  function saveNewVideosToIDB(newVideos: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const db = indexedDB.open("yourtube", 11);

      db.onsuccess = function () {
        const database = db.result;
        const transaction = database.transaction(["videos"], "readwrite");
        const videosStore = transaction.objectStore("videos");

        let counter = 0;

        transaction.oncomplete = function () {
          resolve();
        };

        transaction.onerror = function (event) {
          reject((event.target as IDBRequest).error);
        };

        newVideos.forEach((video) => {
          const addRequest = videosStore.put(video);

          addRequest.onsuccess = function () {
            counter++;
          };

          addRequest.onerror = function (event) {};
        });
      };
    });
  }

  function checkFetchNewVideos() {
    getNewestVideosForEachChannelFromIDB().then((newestVideos) => {
      const subsWithNoNewestVideo = subs.filter((sub) => !newestVideos[sub.id]);
      const retentionDateAfter = new Date();
      retentionDateAfter.setDate(
        retentionDateAfter.getDate() -
          (userSettings.video.retentionPeriodWeeks ?? 1) * 7,
      );
      retentionDateAfter.setHours(0, 0, 0, 0);

      fetchNewVideos(newestVideos, retentionDateAfter.toISOString());
    });
  }

  function initializeIDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const db = indexedDB.open("yourtube", 11);

      db.onupgradeneeded = function (event) {
        const database = db.result;
        const subsStore = database.createObjectStore("subs", { keyPath: "id" });
        subsStore.createIndex("id", "id", { unique: true });
        subsStore.createIndex("customUrl", "snippet.customUrl", {
          unique: true,
        });
        subsStore.createIndex("channelTitle", "snippet.title", {
          unique: false,
        });
        subsStore.createIndex("channelId", "id", { unique: true });

        const videosStore = database.createObjectStore("videos", {
          keyPath: "id",
        });
        videosStore.createIndex("id", "id", { unique: true });
        videosStore.createIndex("channelId", "snippet.channelId", {
          unique: false,
        });
        videosStore.createIndex("publishedAt", "snippet.publishedAt", {
          unique: false,
        });
        videosStore.createIndex(
          "channelPublishIndex",
          ["snippet.channelId", "snippet.publishedAt"],
          { unique: false },
        );
      };

      db.onerror = function () {
        reject();
      };

      db.onsuccess = function () {
        resolve();
      };
    });
  }

  useEffect(() => {
    fetchUserSettings();
    initializeIDB().then(() => {
      getVideosFromIDB();
      getSubsFromIDB();
    });
  }, []);

  useEffect(() => {
    if (userSettings.video.retentionPeriodWeeks) {
      deleteVideosPastDate();
      getVideosFromIDB();
    }
  }, [userSettings.video.retentionPeriodWeeks]);

  useEffect(() => {
    if (subs.length > 0 && userSettings.video.retentionPeriodWeeks) {
      if (process.env.NODE_ENV === "production") {
        checkFetchNewVideos();
      }
    }
  }, [subs, userSettings.video.retentionPeriodWeeks]);

  function calculatePaddingTopHeight(
    isToggleShow: boolean,
    newPinned: boolean,
  ) {
    if (!newPinned) {
      setPaddingTopVal(16);
      return;
    }

    if (isToggleShow && newPinned) {
      setTimeout(() => {
        const baseHeight =
          document.getElementById("playEditContainer")?.clientHeight;
        const paddedHeight = baseHeight ? baseHeight + 20 : 0;
        setPaddingTopVal(paddedHeight ? paddedHeight : 16);
      }, 10);
    } else {
      let add;
      if (!show) {
        add = 52;
      } else {
        add = 32;
      }
      const baseHeight =
        document.getElementById("playEditContainer")?.clientHeight;
      const paddedHeight = baseHeight ? baseHeight + add : 0;
      setPaddingTopVal(paddedHeight ? paddedHeight : 16);
    }
  }

  function calculatePaddingTopHeightResize(isResized: boolean = false) {
    if (!pinned) {
      setPaddingTopVal(16);
      return;
    }

    const baseHeight =
      document.getElementById("playEditContainer")?.clientHeight;
    const paddedHeight = baseHeight ? baseHeight + 20 : 0;
    setPaddingTopVal(paddedHeight ? paddedHeight : 16);
  }

  function calculateWidth(isClicked: boolean = false) {
    let pinnedRelay = isClicked ? !pinned : pinned;
    if (pinnedRelay) {
      const baseWidth = document.getElementById("pageContainer")?.clientWidth;
      const paddedWidth = baseWidth ? baseWidth - 48 : 0;

      setIframeWidth(paddedWidth ? `${paddedWidth}px` : "");
    } else {
      setIframeWidth("100%");
    }
  }

  const resizeWidthTimeout = useRef<any>(null);
  const resizePaddingTopTimeout = useRef<any>(null);

  useEffect(() => {
    window.addEventListener("resize", () => {
      clearTimeout(resizeWidthTimeout.current);
      resizeWidthTimeout.current = setTimeout(() => {
        calculateWidth();

        clearTimeout(resizePaddingTopTimeout.current);
        resizePaddingTopTimeout.current = setTimeout(() => {
          calculatePaddingTopHeightResize();
        }, 10);
      }, 100);
    });

    return () => {
      window.removeEventListener("resize", () => {
        clearTimeout(resizeWidthTimeout.current);
        resizeWidthTimeout.current = setTimeout(() => {
          calculateWidth();

          clearTimeout(resizePaddingTopTimeout.current);
          resizePaddingTopTimeout.current = setTimeout(() => {
            calculatePaddingTopHeightResize();
          }, 10);
        }, 100);
      });
    };
  }, [pinned]);

  return (
    <NavBarContext.Provider value={navBarContextValues}>
      <SubscriptionsContext.Provider value={subsContextValues}>
        <VideosContext.Provider value={videoContextValues}>
          <UserSettingsContext.Provider value={userSettingsContextValues}>
            <ResizingContext.Provider value={resizingContextValues}>
              {children}
            </ResizingContext.Provider>
          </UserSettingsContext.Provider>
        </VideosContext.Provider>
      </SubscriptionsContext.Provider>
    </NavBarContext.Provider>
  );
};
