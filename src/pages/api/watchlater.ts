import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method === "GET") {
    try {
      const data = require("./watchlater.json");
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "POST") {
    try {
      const data = req.body;
      const filePath = path.resolve("./src/pages/api/watchlater.json");

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
