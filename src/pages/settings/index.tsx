import { useState } from "react";
import { useRouter } from "next/router";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import Layout from "@/layouts/Layout1";
import { useUserSettings, useThumbnailSize } from "@/components/Contexts";

export default function Settings() {
  const router = useRouter();

  const { userSettings, setUserSettings } = useUserSettings();

  const { thumbnailSize, setThumbnailSize } = useThumbnailSize();

  const [isChanged, setIsChanged] = useState(false);

  async function postSettings(newSettings: any) {
    const response = await fetch("/api/userSettings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSettings),
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

  function handleChange(newSettings: any) {
    setUserSettings(newSettings);
    postSettings(newSettings);
  }

  return (
    <div className="p-4 pt-8 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <Card className="p-6 flex flex-col gap-8">
        <Table>
          <TableBody>
            <TableRow className="border-0">
              <TableCell className="align-top">
                <h2 className="text-base font-semibold mr-10">Time</h2>
              </TableCell>
              <TableCell className="align-top">
                <label htmlFor="dailyLimit" className="block w-32">
                  Daily Limit
                </label>
              </TableCell>
              <TableCell className="align-top">
                <Input
                  type="number"
                  id="dailyLimit"
                  name="dailyLimit"
                  value={userSettings?.time?.dailyLimit}
                  onChange={(e) => {
                    const newSettings = {
                      ...userSettings,
                      time: {
                        ...userSettings.time,
                        dailyLimit: e.target.value,
                      },
                    };
                    handleChange(newSettings);
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="align-top"></TableCell>
              <TableCell className="align-top">
                <label htmlFor="dailyLimitReset" className="block w-32">
                  Daily Limit Reset
                </label>
              </TableCell>
              <TableCell className="align-top">
                <Input
                  type="time"
                  id="dailyLimitReset"
                  name="dailyLimitReset"
                  value={userSettings?.time?.dailyLimitReset}
                  onChange={(e) => {
                    const newSettings = {
                      ...userSettings,
                      time: {
                        ...userSettings.time,
                        dailyLimitReset: e.target.value,
                      },
                    };
                    handleChange(newSettings);
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow className="border-0 h-2"></TableRow>
            <TableRow className="border-0">
              <TableCell className="align-top">
                <h2 className="text-base font-semibold mr-10">Video</h2>
              </TableCell>
              <TableCell className="align-top">
                <label htmlFor="thumbnailSize" className="block w-32">
                  Default Thumbnail Size
                </label>
              </TableCell>
              <TableCell className="align-top">
                <Select
                  name="thumbnailSize"
                  value={String(thumbnailSize)}
                  onValueChange={(value: string) => {
                    setIsChanged(true);
                    setThumbnailSize(+value);
                    const newSettings = {
                      ...userSettings,
                      video: {
                        ...userSettings.video,
                        thumbnailSize: +value,
                      },
                    };
                    handleChange(newSettings);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">large</SelectItem>
                    <SelectItem value="1">medium</SelectItem>
                    <SelectItem value="2">small</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
            <TableRow className="border-0">
              <TableCell className="align-top"></TableCell>
              <TableCell className="align-top">
                <label htmlFor="noShorts" className="block w-32">
                  Shorts
                </label>
              </TableCell>
              <TableCell className="align-top">
                <Input
                  className="w-6 h-6"
                  type="checkbox"
                  id="noShorts"
                  name="noShorts"
                  checked={!userSettings?.video?.noShorts}
                  onChange={(e) => {
                    setIsChanged(true);
                    const newSettings = {
                      ...userSettings,
                      video: {
                        ...userSettings.video,
                        noShorts: !e.target.checked,
                      },
                    };
                    handleChange(newSettings);
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow onClick={(e) => e.preventDefault()}>
              <TableCell className="align-top"></TableCell>
              <TableCell className="align-top">
                <label htmlFor="noShorts" className="block w-32">
                  Retention Period (weeks)
                </label>
              </TableCell>
              <TableCell className="align-top">
                <Input
                  type="number"
                  id="retentionPeriodWeeks"
                  name="retentionPeriodWeeks"
                  value={userSettings?.video?.retentionPeriodWeeks}
                  onChange={(e) => {
                    const newSettings = {
                      ...userSettings,
                      video: {
                        ...userSettings.video,
                        retentionPeriodWeeks: e.target.value,
                      },
                    };
                    handleChange(newSettings);
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow className="border-0 h-2"></TableRow>
            <TableRow className="border-0">
              <TableCell className="align-top">
                <h2 className="text-base font-semibold mr-10">Watch Later</h2>
              </TableCell>
              <TableCell className="align-top">
                <label htmlFor="thumbnailSize" className="block w-32">
                  Retention Period (days)
                </label>
              </TableCell>
              <TableCell className="align-top">
                <Input
                  type="number"
                  id="retentionPeriodDays"
                  name="retentionPeriodDays"
                  value={userSettings?.watchLater?.retentionPeriodDays}
                  onChange={(e) => {
                    const newSettings = {
                      ...userSettings,
                      watchLater: {
                        ...userSettings.watchLater,
                        retentionPeriodDays: e.target.value,
                      },
                    };
                    handleChange(newSettings);
                  }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

Settings.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
