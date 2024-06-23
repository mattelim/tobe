import type { NextApiRequest, NextApiResponse } from "next";

import credCheck from "@/lib/credentials/credCheck";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const oauth2Client = await credCheck(req.body.code);
  if (Object.keys(oauth2Client.credentials).length === 0) {
    res.status(401).json({ error: "No credentials found" });
  }

  res.status(200).json("Connection successful");
}
