import "@/styles/globals.css";

import {
  ContextsProvider,
  ThumbnailSizeProvider,
  ChannelsProvider,
  SavedProvider,
} from "@/components/Contexts";

export default function MyApp({ Component, pageProps }: any) {
  const getLayout = Component.getLayout ?? ((page: any) => page);

  const LayoutPage = () => getLayout(<Component {...pageProps} />);

  return (
    <ContextsProvider>
      <ThumbnailSizeProvider>
        <ChannelsProvider>
          <SavedProvider>
            <LayoutPage {...pageProps} />
          </SavedProvider>
        </ChannelsProvider>
      </ThumbnailSizeProvider>
    </ContextsProvider>
  );
}
