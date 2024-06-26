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
import { useChannels, useSaved } from "@/components/Contexts";

function NavCollapsibleButton({
  title,
  href,
  Icon,
  linkPrefix,
  isNavBarExpanded,
  isListExpanded,
  setIsListExpanded,
  objects,
  objectName,
}: {
  title: string;
  href: string;
  Icon: any;
  linkPrefix: string;
  isNavBarExpanded: boolean;
  isListExpanded: boolean;
  setIsListExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  objects: any[];
  objectName: string;
}) {
  const router = useRouter();

  const { slug } = router.query;

  const { setChannels } = useChannels();
  const { setSaved } = useSaved();

  async function postObjects(newObjects: any) {
    const response = await fetch(`/api${href}`, {
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

  function handleChange(newObjects: any) {
    switch (linkPrefix) {
      case "/channels/":
        setChannels(newObjects);
        break;
      case "/saved/":
        setSaved(newObjects);
        break;
    }
    postObjects(newObjects);
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
            {objects.map((obj: any) => (
              <div
                key={obj.id}
                className={`group data-[selected=true]:bg-background hover:!bg-accent ${slug && obj?.title === slug ? "font-semibold !bg-accent/75" : ""}`}
              >
                <CollapsibleButtonType item={obj} linkPrefix={linkPrefix} />
              </div>
            ))}
          </ScrollArea>
          <Button
            variant={"outline"}
            className="m-1"
            onClick={() => {
              switch (linkPrefix) {
                case "/channels/":
                  handleChange([
                    ...objects,
                    {
                      id: Math.random().toString(36).substring(2),
                      order: objects.length + 1,
                      title: `New Channel ${objects.length + 1}`,
                      channels: [],
                    },
                  ]);
                  break;
                case "/saved/":
                  handleChange([
                    ...objects,
                    {
                      id: Math.random().toString(36).substring(2),
                      order: objects.length + 1,
                      title: `Saved List ${objects.length + 1}`,
                      videos: [],
                    },
                  ]);
                  break;
              }
            }}
          >
            Create {objectName}
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default memo(NavCollapsibleButton);
