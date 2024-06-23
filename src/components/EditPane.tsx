import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Minus, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";

import { useSubscriptions, useChannels } from "@/components/Contexts";

export default function EditPane() {
  const router = useRouter();

  const { slug } = router.query;
  const { subs } = useSubscriptions();
  const { channels, setChannels } = useChannels();

  const channelIndex = channels.findIndex((channel) => channel.title === slug);
  const [selectedChannelSubIndex, setSelectedChannelSubIndex] =
    useState<any>(0);

  const [channelTitle, setChannelTitle] = useState<string>(
    channels[channelIndex]?.title,
  );
  const [titleChanged, setTitleChanged] = useState<boolean>(false);

  const [isDelete, setIsDelete] = useState<boolean>(false);

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
    <>
      {isDelete && (
        <div className="absolute top-0 left-0 w-full h-full bg-primary/85 backdrop-blur flex flex-col justify-center items-center gap-6 z-10">
          <p className="text-secondary">
            Are you sure you want to delete this channel?
          </p>
          <div className="flex gap-4">
            <Button
              variant={"destructive"}
              onClick={() => {
                const newChannels = [
                  ...channels.slice(0, channelIndex),
                  ...channels.slice(channelIndex + 1),
                ];
                handleChange(newChannels);
                setIsDelete(false);
                router.push("/channels");
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
            channel
            {titleChanged && (
              <Button
                className="ml-6"
                onClick={() => {
                  const newChannels = [
                    ...channels.slice(0, channelIndex),
                    {
                      ...channels[channelIndex],
                      title: channelTitle,
                    },
                    ...channels.slice(channelIndex + 1),
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
        <CardContent className="px-2" style={{ height: "calc(100% - 5.5rem)" }}>
          <div className="grid grid-cols-3 divide-x h-full">
            <div className="flex flex-col px-4 gap-3 h-full max-h-full overflow-hidden">
              <h2 className="font-semibold text-lg">All Subscriptions</h2>
              <Command className="border">
                <CommandInput placeholder="Search..." />
                <CommandList className="max-h-none">
                  <CommandEmpty>No results found.</CommandEmpty>
                  {subs.map((sub: any) => (
                    <CommandItem
                      key={sub.id}
                      className="group data-[selected=true]:bg-background hover:!bg-accent"
                    >
                      <div
                        className="relative cursor-pointer flex w-full items-center"
                        onClick={() => {
                          const newChannels = [
                            ...channels.slice(0, channelIndex),
                            {
                              ...channels[channelIndex],
                              channels: [
                                ...channels[channelIndex].channels,
                                {
                                  ...sub,
                                  include: [],
                                  exclude: [],
                                },
                              ],
                            },
                            ...channels.slice(channelIndex + 1),
                          ];
                          handleChange(newChannels);
                        }}
                      >
                        <Image
                          width={28}
                          height={28}
                          className="aspect-square rounded-full"
                          src={sub?.snippet?.thumbnails?.default?.url}
                          alt={sub?.snippet?.title}
                        />
                        <p className="text-sm px-3 line-clamp-1">
                          {sub?.snippet?.title}
                        </p>
                        <Plus
                          size={24}
                          strokeWidth={2}
                          className="absolute right-0 p-1 text-primary/50 group-hover:text-primary"
                        />
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </div>
            {slug ? (
              <div className="flex flex-col px-4 gap-3 h-full max-h-full overflow-hidden">
                <h2 className="font-semibold text-lg">Channel Subscriptions</h2>
                <ScrollArea className=" h-full rounded-md w-full">
                  <div className="flex flex-col gap-3">
                    {channels[channelIndex]?.channels?.map(
                      (channelSub: any, index: number) => (
                        <Card
                          key={channelSub.id}
                          className={`group relative flex flex-row overflow-clip gap-3 items-center cursor-pointer ${channels[channelIndex]?.channels[selectedChannelSubIndex]?.id === channelSub.id ? "bg-accent text-accent-foreground font-semibold" : ""}`}
                          onClick={() => {
                            setSelectedChannelSubIndex(index);
                          }}
                        >
                          <Image
                            width={36}
                            height={36}
                            className="aspect-square "
                            src={channelSub.snippet.thumbnails.default.url}
                            alt={channelSub.snippet.title}
                          />
                          <p className="text-sm line-clamp-1">
                            {channelSub.snippet.title}
                          </p>
                          <Minus
                            size={24}
                            strokeWidth={2}
                            className="hidden group-hover:block absolute right-2 bg-destructive/50 text-white rounded-md p-1 hover:bg-destructive"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const newChannels = [
                                ...channels.slice(0, channelIndex),
                                {
                                  ...channels[channelIndex],
                                  channels: [
                                    ...channels[channelIndex].channels.slice(
                                      0,
                                      index,
                                    ),
                                    ...channels[channelIndex].channels.slice(
                                      index + 1,
                                    ),
                                  ],
                                },
                                ...channels.slice(channelIndex + 1),
                              ];
                              handleChange(newChannels);
                            }}
                          />
                        </Card>
                      ),
                    )}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-4">
                <p>
                  <span className="font-medium">All Subscriptions</span> can
                  only be updated on YouTube.
                </p>
                <p>
                  Go to your{" "}
                  <a
                    className="underline"
                    href="https://www.youtube.com/feed/subscriptions"
                    target="_blank"
                    rel="noreferrer"
                  >
                    subscriptions{" "}
                    <ExternalLink size={16} className="inline-block" />
                  </a>
                </p>
                <Button className="w-full mt-2">Create sub-sub</Button>
              </div>
            )}

            <div className="flex flex-col px-4 gap-3 h-full max-h-full overflow-hidden">
              {router.pathname.includes("channels") ? (
                slug ? (
                  <>
                    <h2 className="font-semibold text-lg line-clamp-1">
                      Title Filters for{" "}
                      <span className="italic">
                        {
                          channels[channelIndex]?.channels[
                            selectedChannelSubIndex
                          ]?.snippet?.title
                        }
                      </span>
                    </h2>
                    <ScrollArea className=" h-full rounded-md w-full">
                      <div className="flex flex-col gap-4">
                        <Card className="p-3">
                          <h2 className="font-semibold mb-2">Include</h2>
                          <div className="flex flex-col gap-3">
                            {channels[channelIndex]?.channels[
                              selectedChannelSubIndex
                            ]?.include?.map((include: any, index: number) => (
                              <div key={index} className="group relative">
                                <Input
                                  value={include}
                                  onChange={(e) => {
                                    const newChannels = [
                                      ...channels.slice(0, channelIndex),
                                      {
                                        ...channels[channelIndex],
                                        channels: [
                                          ...channels[
                                            channelIndex
                                          ].channels.slice(
                                            0,
                                            selectedChannelSubIndex,
                                          ),
                                          {
                                            ...channels[channelIndex].channels[
                                              selectedChannelSubIndex
                                            ],
                                            include: [
                                              ...channels[
                                                channelIndex
                                              ].channels[
                                                selectedChannelSubIndex
                                              ].include.slice(0, index),
                                              e.target.value,
                                              ...channels[
                                                channelIndex
                                              ].channels[
                                                selectedChannelSubIndex
                                              ].include.slice(index + 1),
                                            ],
                                          },
                                          ...channels[
                                            channelIndex
                                          ].channels.slice(
                                            selectedChannelSubIndex + 1,
                                          ),
                                        ],
                                      },
                                      ...channels.slice(channelIndex + 1),
                                    ];
                                    handleChange(newChannels);
                                  }}
                                />
                                <Minus
                                  size={24}
                                  strokeWidth={2}
                                  className="hidden group-hover:block absolute top-2 right-2 bg-destructive/50 text-white rounded-md p-1 hover:bg-destructive"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const newChannels = [
                                      ...channels.slice(0, channelIndex),
                                      {
                                        ...channels[channelIndex],
                                        channels: [
                                          ...channels[
                                            channelIndex
                                          ].channels.slice(
                                            0,
                                            selectedChannelSubIndex,
                                          ),
                                          {
                                            ...channels[channelIndex].channels[
                                              selectedChannelSubIndex
                                            ],
                                            include: [
                                              ...channels[
                                                channelIndex
                                              ].channels[
                                                selectedChannelSubIndex
                                              ].include.slice(0, index),
                                              ...channels[
                                                channelIndex
                                              ].channels[
                                                selectedChannelSubIndex
                                              ].include.slice(index + 1),
                                            ],
                                          },
                                          ...channels[
                                            channelIndex
                                          ].channels.slice(
                                            selectedChannelSubIndex + 1,
                                          ),
                                        ],
                                      },
                                      ...channels.slice(channelIndex + 1),
                                    ];
                                    handleChange(newChannels);
                                  }}
                                />
                              </div>
                            ))}
                            <Button
                              variant="ghost"
                              className="w-full bg-accent/50"
                              onClick={() => {
                                const newChannels = [
                                  ...channels.slice(0, channelIndex),
                                  {
                                    ...channels[channelIndex],
                                    channels: [
                                      ...channels[channelIndex].channels.slice(
                                        0,
                                        selectedChannelSubIndex,
                                      ),
                                      {
                                        ...channels[channelIndex].channels[
                                          selectedChannelSubIndex
                                        ],
                                        include: [
                                          ...channels[channelIndex].channels[
                                            selectedChannelSubIndex
                                          ].include,
                                          "",
                                        ],
                                      },
                                      ...channels[channelIndex].channels.slice(
                                        selectedChannelSubIndex + 1,
                                      ),
                                    ],
                                  },
                                  ...channels.slice(channelIndex + 1),
                                ];
                                handleChange(newChannels);
                              }}
                            >
                              <Plus size={16} className="inline-block" />
                              Add include
                            </Button>
                          </div>
                        </Card>
                        <Card className="p-3">
                          <h2 className="font-semibold mb-2">Exclude</h2>
                          <div className="flex flex-col gap-2">
                            {channels[channelIndex]?.channels[
                              selectedChannelSubIndex
                            ]?.exclude?.map((exclude: any, index: number) => (
                              <div key={index} className="group relative">
                                <Input
                                  value={exclude}
                                  onChange={(e) => {
                                    const newChannels = [
                                      ...channels.slice(0, channelIndex),
                                      {
                                        ...channels[channelIndex],
                                        channels: [
                                          ...channels[
                                            channelIndex
                                          ].channels.slice(
                                            0,
                                            selectedChannelSubIndex,
                                          ),
                                          {
                                            ...channels[channelIndex].channels[
                                              selectedChannelSubIndex
                                            ],
                                            exclude: [
                                              ...channels[
                                                channelIndex
                                              ].channels[
                                                selectedChannelSubIndex
                                              ].exclude.slice(0, index),
                                              e.target.value,
                                              ...channels[
                                                channelIndex
                                              ].channels[
                                                selectedChannelSubIndex
                                              ].exclude.slice(index + 1),
                                            ],
                                          },
                                          ...channels[
                                            channelIndex
                                          ].channels.slice(
                                            selectedChannelSubIndex + 1,
                                          ),
                                        ],
                                      },
                                      ...channels.slice(channelIndex + 1),
                                    ];
                                    handleChange(newChannels);
                                  }}
                                />
                                <Minus
                                  size={24}
                                  strokeWidth={2}
                                  className="hidden group-hover:block absolute top-2 right-2 bg-destructive/50 text-white rounded-md p-1 hover:bg-destructive"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const newChannels = [
                                      ...channels.slice(0, channelIndex),
                                      {
                                        ...channels[channelIndex],
                                        channels: [
                                          ...channels[
                                            channelIndex
                                          ].channels.slice(
                                            0,
                                            selectedChannelSubIndex,
                                          ),
                                          {
                                            ...channels[channelIndex].channels[
                                              selectedChannelSubIndex
                                            ],
                                            exclude: [
                                              ...channels[
                                                channelIndex
                                              ].channels[
                                                selectedChannelSubIndex
                                              ].exclude.slice(0, index),
                                              ...channels[
                                                channelIndex
                                              ].channels[
                                                selectedChannelSubIndex
                                              ].exclude.slice(index + 1),
                                            ],
                                          },
                                          ...channels[
                                            channelIndex
                                          ].channels.slice(
                                            selectedChannelSubIndex + 1,
                                          ),
                                        ],
                                      },
                                      ...channels.slice(channelIndex + 1),
                                    ];
                                    handleChange(newChannels);
                                  }}
                                />
                              </div>
                            ))}
                            <Button
                              variant="ghost"
                              className="w-full bg-accent/50"
                              onClick={() => {
                                const newChannels = [
                                  ...channels.slice(0, channelIndex),
                                  {
                                    ...channels[channelIndex],
                                    channels: [
                                      ...channels[channelIndex].channels.slice(
                                        0,
                                        selectedChannelSubIndex,
                                      ),
                                      {
                                        ...channels[channelIndex].channels[
                                          selectedChannelSubIndex
                                        ],
                                        exclude: [
                                          ...channels[channelIndex].channels[
                                            selectedChannelSubIndex
                                          ].exclude,
                                          "",
                                        ],
                                      },
                                      ...channels[channelIndex].channels.slice(
                                        selectedChannelSubIndex + 1,
                                      ),
                                    ],
                                  },
                                  ...channels.slice(channelIndex + 1),
                                ];
                                handleChange(newChannels);
                              }}
                            >
                              <Plus size={16} className="inline-block" />
                              Add exclude
                            </Button>
                          </div>
                        </Card>
                      </div>
                    </ScrollArea>
                  </>
                ) : (
                  <p className="text-sm pt-2">Select a channelSub to edit.</p>
                )
              ) : (
                ""
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
