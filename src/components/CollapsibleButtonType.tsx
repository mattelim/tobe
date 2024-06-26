import Image from "next/image";
import Link from "next/link";

export default function CollapsibleButtonType({
  item,
  linkPrefix,
}: {
  item: any;
  linkPrefix: string;
}) {
  switch (linkPrefix) {
    case "/subs/":
      return (
        <Link
          href={linkPrefix + item?.snippet?.customUrl}
          className="flex w-full items-center"
        >
          <Image
            width={28}
            height={28}
            className="aspect-square rounded-full"
            src={item?.snippet?.thumbnails?.default?.url}
            alt={item?.snippet?.title}
          />
          <p className="text-sm px-3 line-clamp-1">{item?.snippet?.title}</p>
        </Link>
      );

    case "/channels/":
      return (
        <>
          <Link
            href={linkPrefix + item?.title}
            className="text-sm p-2 line-clamp-1"
          >
            {item.title}
          </Link>
        </>
      );
    case "/saved/":
      return (
        <>
          <Link
            href={linkPrefix + item?.title}
            className="text-sm p-2 line-clamp-1"
          >
            {item.title}
          </Link>
        </>
      );
  }
}
