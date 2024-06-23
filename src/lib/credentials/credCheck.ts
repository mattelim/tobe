import fs from "fs";
import path from "path";
import client_secret from "@/client_secret.json";

const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const absCredentialsPath = path.resolve(
  process.cwd(),
  "src/lib/credentials/credentials.json",
);

export default async function credCheck(apiCode: string = ""): Promise<any> {
  const oauth2Client = new OAuth2(
    client_secret.web.client_id,
    client_secret.web.client_secret,
    client_secret.web.redirect_uris[0],
  );

  try {
    const credentials = JSON.parse(fs.readFileSync(absCredentialsPath, "utf8"));

    if (!credentials) throw new Error("No credentials found");

    oauth2Client.setCredentials(credentials);

    if (credentials.expiry_date < Date.now() + 60000) {
      oauth2Client.setCredentials({
        refresh_token: credentials.refresh_token,
      });

      const tokenResponse = await oauth2Client.getAccessToken();

      const newCredentials = tokenResponse.res.data;

      fs.writeFileSync(absCredentialsPath, JSON.stringify(newCredentials));

      oauth2Client.setCredentials(newCredentials);
    }
  } catch (error) {}

  if (Object.keys(oauth2Client.credentials).length === 0 && apiCode) {
    try {
      const { tokens } = await oauth2Client.getToken(apiCode);
      oauth2Client.setCredentials(tokens);

      fs.writeFileSync(absCredentialsPath, JSON.stringify(tokens));
    } catch (error) {}
  }

  return oauth2Client;
}
