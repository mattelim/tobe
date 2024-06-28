import { useRouter } from "next/router";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { Save } from "lucide-react";

import { useSaved } from "@/components/Contexts";

export default function SaveVideosDropDown({ video }: { video: any }) {
  const router = useRouter();

  const { saved, setSaved } = useSaved();

  async function postObjects(newObjects: any) {
    const response = await fetch(`/api/saved`, {
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
    setSaved(newObjects);
    postObjects(newObjects);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button className="w-10 h-10 p-[0.375rem] shadow-white/50 hover:border-white hover:border shadow">
          <Save strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex gap-2">
          <Save size={20} />
          Save to...
        </DropdownMenuLabel>
        {saved.map((item: any) => (
          <DropdownMenuItem
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              const newItem = {
                ...item,
                videos: [...item.videos, video],
              };
              handleChange([
                ...saved.filter((savedItem: any) => savedItem.id !== item.id),
                newItem,
              ]);
            }}
          >
            <p>{item.title}</p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
