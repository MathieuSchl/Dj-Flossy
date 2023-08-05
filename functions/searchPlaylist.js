const axios = require("axios");
require("dotenv").config();
const key = process.env.GOOGLE_TOKEN;

function getVideosTag(playlistId, videoList, nextPageToken, callback) {
  if (!videoList) videoList = [];
  const URL =
    "https://www.googleapis.com/youtube/v3/playlistItems?key=" +
    key +
    "&part=snippet&playlistId=" +
    playlistId +
    "&maxResults=50" +
    (nextPageToken[nextPageToken.length - 1] ? "&pageToken=" + nextPageToken[nextPageToken.length - 1] : "");
  axios({
    method: "GET",
    url: URL,
  })
    .then(function (response) {
      const body = response.data;
      const bodyObject = body;
      for (let index = 0; index < bodyObject.items.length; index++) {
        //console.log(bodyObject.items[index].snippet);
        const element = bodyObject.items[index].snippet.resourceId.videoId;
        videoList.push(element);
      }
      if (!nextPageToken.includes(bodyObject.nextPageToken)) {
        nextPageToken.push(bodyObject.nextPageToken);
        return getVideosTag(playlistId, videoList, nextPageToken, callback);
      } else return callback(videoList);
    })
    .catch(async function (err) {
      console.log(err);
      return false;
    });
}

module.exports.run = async (playlistId) => {
  return await new Promise((resolve, reject) => {
    getVideosTag(playlistId, [], [], (playlist) => {
      resolve(playlist);
    });
  });
};

module.exports.getName = getName;
async function getName(playlistString) {
  const playlistId = playlistString.startsWith("https://www.youtube.com/playlist?list=")
    ? playlistString.split("https://www.youtube.com/playlist?list=")[1]
    : playlistString.startsWith("https://youtube.com/playlist?list=")
    ? playlistString.split("https://youtube.com/playlist?list=")[1]
    : playlistString;

  const URL = "https://www.googleapis.com/youtube/v3/playlists?part=snippet&key=" + key + "&id=" + playlistId;
  return await new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: URL,
    })
      .then(function (response) {
        const body = response.data;
        const bodyObject = body;
        if (!bodyObject.items.length) resolve(false);
        else resolve(bodyObject.items[0].snippet.title);
      })
      .catch(async function (err) {
        resolve(false);
      });
  });
}
