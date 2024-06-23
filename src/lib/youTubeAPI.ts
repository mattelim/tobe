const { google } = require("googleapis");

export function getSubscriptions(auth: any, nextPageToken?: string) {
  var service = google.youtube("v3");
  return new Promise((resolve, reject) => {
    service.subscriptions.list(
      {
        auth: auth,

        part: "snippet",
        mine: true,
        maxResults: 50,
        pageToken: nextPageToken,
      },
      function (err: string, response: { data: { items: any } }) {
        if (err) {
          reject(err);
        } else {
          var subscriptions = response.data.items;

          if (subscriptions.length == 0) {
          } else {
          }
          resolve(response);
        }
      },
    );
  });
}

export function getChannel(auth: any, channelId: string) {
  var service = google.youtube("v3");
  return new Promise((resolve, reject) => {
    service.channels.list(
      {
        auth: auth,
        part: "snippet,contentDetails",

        id: channelId,
        maxResults: 50,
      },
      function (err: string, response: { data: { items: any } }) {
        if (err) {
          reject(err);
        } else {
          var channel = response.data.items;

          if (channel.length == 0) {
          } else {
          }
          resolve(channel);
        }
      },
    );
  });
}

export function getPlaylists(auth: any, playlistId: string) {
  var service = google.youtube("v3");
  return new Promise((resolve, reject) => {
    service.playlists.list(
      {
        auth: auth,
        part: "snippet,contentDetails,player",
        id: playlistId,

        maxResults: 50,
      },
      function (err: string, response: { data: { items: any } }) {
        if (err) {
          reject(err);
        } else {
          var playlist = response.data.items;

          if (playlist.length == 0) {
          } else {
          }
          resolve(playlist);
        }
      },
    );
  });
}

export function getPlaylistItems(
  auth: any,
  playlistId: string,
  nextPageToken?: string,
) {
  var service = google.youtube("v3");
  return new Promise((resolve, reject) => {
    service.playlistItems.list(
      {
        auth: auth,

        part: "snippet",
        playlistId: playlistId,
        maxResults: 50,
        pageToken: nextPageToken,
      },
      function (err: string, response: { data: { items: any } }) {
        if (err) {
          reject(err);
        } else {
          var playlist = response.data.items;

          if (playlist.length == 0) {
          } else {
          }

          resolve(response);
        }
      },
    );
  });
}

export function getVideos(auth: any, videoId: string) {
  var service = google.youtube("v3");
  return new Promise((resolve, reject) => {
    service.videos.list(
      {
        auth: auth,

        part: "snippet,contentDetails",

        id: videoId,
        maxResults: 50,
      },
      function (err: string, response: { data: { items: any } }) {
        if (err) {
          reject(err);
        } else {
          var playlist = response.data.items;

          if (playlist.length == 0) {
          } else {
          }
          resolve(playlist);
        }
      },
    );
  });
}
