import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

import client_secret from "@/client_secret.json";

var fs = require("fs");

var readline = require("readline");
var { google } = require("googleapis");
var OAuth2 = google.auth.OAuth2;

var SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];
var TOKEN_DIR =
  (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) +
  "/.credentials/";
var TOKEN_PATH = TOKEN_DIR + "youtube-nodejs-quickstart.json";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  var oauth2Client = new OAuth2(
    client_secret.web.client_id,
    client_secret.web.client_secret,
    client_secret.web.redirect_uris[0],
  );

  var authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  res.status(200).json({ name: authUrl });
}

function authorize(
  credentials: {
    web: { client_secret: any; client_id: any; redirect_uris: any[] };
  },
  callback: { (auth: any): void; (arg0: any): void },
) {
  var clientSecret = credentials.web.client_secret;
  var clientId = credentials.web.client_id;
  var redirectUrl = credentials.web.redirect_uris[0];
  var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  fs.readFile(TOKEN_PATH, function (err: any, token: string) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

function getNewToken(
  oauth2Client: {
    generateAuthUrl: (arg0: { access_type: string; scope: string[] }) => any;
    getToken: (arg0: any, arg1: (err: any, token: any) => void) => void;
    credentials: any;
  },
  callback: (arg0: any) => void,
) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", function (code: any) {
    rl.close();
    oauth2Client.getToken(code, function (err: any, token: any) {
      if (err) {
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

function storeToken(token: any) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err: any) {
    if (err.code != "EEXIST") {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err: any) => {
    if (err) throw err;
  });
}
