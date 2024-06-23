import { memo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown } from "lucide-react";

import CollapsibleButtonType from "@/components/CollapsibleButtonType";
import { useChannels } from "@/components/Contexts";

function NavCollapsibleButton({
  title,
  href,
  Icon,
  linkPrefix,
  isNavBarExpanded,
  isListExpanded,
  setIsListExpanded,
}: {
  title: string;
  href: string;
  Icon: any;
  linkPrefix: string;
  isNavBarExpanded: boolean;
  isListExpanded: boolean;
  setIsListExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();

  const { slug } = router.query;

  const { channels, setChannels } = useChannels();

  async function postChannels(newChannels: any) {
    const response = await fetch("/api/channels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newChannels),
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

  function handleChange(newChannels: any) {
    setChannels(newChannels);
    postChannels(newChannels);
  }

  return (
    <Collapsible open={isListExpanded} onOpenChange={setIsListExpanded}>
      <div className={`flex justify-between ${isNavBarExpanded && ""}`}>
        <Link href={href} className="grow">
          <Button
            variant="ghost"
            className={`${isNavBarExpanded ? "w-full justify-start" : "w-12 justify-center"} p-2 h-12 gap-3 transition-opacity ${router.pathname === href || router.pathname.includes(linkPrefix) ? "hover:bg-primary-foreground" : "opacity-50 hover:opacity-100"}`}
          >
            <Icon className="shrink-0" />
            {isNavBarExpanded && <p>{title}</p>}
          </Button>
        </Link>
        {isNavBarExpanded && (
          <div className="flex items-center justify-center">
            <CollapsibleTrigger
              className="hover:bg-accent h-full p-2 rounded-md"
              onDoubleClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <ChevronDown
                className={`shrink-0 transition-all duration-300 ${isListExpanded ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
          </div>
        )}
      </div>
      <CollapsibleContent>
        <div className="flex flex-col rounded-md border mb-2 overflow-hidden bg-background">
          <ScrollArea className="h-40">
            {channels.map((sub: any) => (
              <div
                key={sub.id}
                className={`group data-[selected=true]:bg-background hover:!bg-accent ${slug && sub?.title === slug ? "font-semibold !bg-accent/75" : ""}`}
              >
                <CollapsibleButtonType item={sub} linkPrefix={linkPrefix} />
              </div>
            ))}
          </ScrollArea>
          <Button
            variant={"outline"}
            className="m-1"
            onClick={() => {
              const newChannels = [
                ...channels,
                {
                  id: Math.random().toString(36).substring(2),
                  order: 0,
                  title: `New Channel ${channels.length + 1}`,
                  channels: [],
                },
              ];
              handleChange(newChannels);
            }}
          >
            Create Channel
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default memo(NavCollapsibleButton);
