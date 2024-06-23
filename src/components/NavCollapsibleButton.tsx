import { memo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

import CollapsibleButtonType from "@/components/CollapsibleButtonType";

function NavCollapsibleButton({
  title,
  href,
  Icon,
  subList,
  linkPrefix,
  isNavBarExpanded,
  isListExpanded,
  setIsListExpanded,
}: {
  title: string;
  href: string;
  Icon: any;
  subList: any[];
  linkPrefix: string;
  isNavBarExpanded: boolean;
  isListExpanded: boolean;
  setIsListExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();

  const { slug } = router.query;

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
        <div className="rounded-md border mb-2 overflow-hidden">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList className="max-h-[11rem]">
              <CommandEmpty>No results found.</CommandEmpty>
              {subList.map((sub: any) => (
                <CommandItem
                  key={sub.id}
                  className={`group data-[selected=true]:bg-background hover:!bg-accent ${slug && sub?.snippet?.customUrl === slug ? "font-semibold !bg-accent/75" : ""}`}
                >
                  <CollapsibleButtonType item={sub} linkPrefix={linkPrefix} />
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default memo(NavCollapsibleButton);
