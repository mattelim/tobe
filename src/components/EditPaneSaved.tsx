import { useRouter } from "next/router";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

import { useSaved } from "@/components/Contexts";

export default function EditPane() {
  const router = useRouter();

  const { slug } = router.query;
  const { saved, setSaved } = useSaved();

  const savedIndex = saved.findIndex((s) => s.title === slug);

  const [channelTitle, setChannelTitle] = useState<string>(
    saved[savedIndex]?.title,
  );
  const [titleChanged, setTitleChanged] = useState<boolean>(false);

  const [isDelete, setIsDelete] = useState<boolean>(false);

  async function postChannels(newChannels: any) {
    const response = await fetch("/api/saved", {
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
    setSaved(newChannels);
    postChannels(newChannels);
  }

  return (
    <>
      {isDelete && (
        <div className="absolute top-0 left-0 w-full h-full bg-primary/85 backdrop-blur flex flex-col justify-center items-center gap-6 z-10">
          <p className="text-secondary">
            Are you sure you want to delete this saved list?
          </p>
          <div className="flex gap-4">
            <Button
              variant={"destructive"}
              onClick={() => {
                const newChannels = [
                  ...saved.slice(0, savedIndex),
                  ...saved.slice(savedIndex + 1),
                ];
                handleChange(newChannels);
                setIsDelete(false);
                router.push("/saved");
              }}
            >
              Delete
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => {
                setIsDelete(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      <Card className="aspect-[400/219] overflow-clip flex flex-col max-h-[500px] min-w-[500px]">
        <CardHeader className="h-[5.5rem] flex flex-row justify-between items-center gap-4">
          <CardTitle>
            Edit
            <Input
              value={channelTitle}
              onChange={(e) => {
                setChannelTitle(e.target.value);
                setTitleChanged(true);
              }}
              className="inline-block max-w-fit bg-accent text-xl px-2 py-1 mx-2 rounded-md"
            />
            list
            {titleChanged && (
              <Button
                className="ml-6"
                onClick={() => {
                  const newChannels = [
                    ...saved.slice(0, savedIndex),
                    {
                      ...saved[savedIndex],
                      title: channelTitle,
                    },
                    ...saved.slice(savedIndex + 1),
                  ];
                  handleChange(newChannels);
                  setTitleChanged(false);
                  router.push({
                    query: { slug: channelTitle },
                  });
                }}
              >
                Save and refresh
              </Button>
            )}
          </CardTitle>

          <div
            className="group hover:bg-destructive aspect-square p-2 cursor-pointer rounded-md"
            onClick={() => {
              setIsDelete((prev) => {
                if (!prev) {
                  return true;
                }
                return prev;
              });
            }}
          >
            <Trash2
              size={24}
              className="stroke-destructive/50  group-hover:stroke-white"
            />
          </div>
        </CardHeader>
        <CardContent
          className="px-2"
          style={{ height: "calc(100% - 5.5rem)" }}
        ></CardContent>
      </Card>
    </>
  );
}
