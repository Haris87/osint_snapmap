const express = require("express");
const snapMap = require("./snap-api");
const fs = require("fs");
const path = require("path");
const app = express();

app.use("/", express.static(path.join(__dirname, "public")));

app.get("/test", (req, res) => {
  return res.send({ test: "test" });
});

app.get("/map", (req, res) => {
  console.log(req.query);
  snapMap
    .getPlaylist(Number(req.query.lat), Number(req.query.long), 500, 12)
    .then(function (response) {
      return res.send(minimize(response));
    })
    .catch(function (error) {
      console.log(error);
      return res.send("ERROR");
    });
});

function minimize(response) {
  if (response.hasOwnProperty("elements")) {
    return response.elements.map(function (snap) {
      if (hasVideo(snap)) {
        return {
          type: "VIDEO",
          url: getVideo(snap),
          datetime: snap.timestamp,
        };
      } else {
        return {
          type: "IMAGE",
          url: getImage(snap),
          datetime: snap.timestamp,
        };
      }
    });
  } else {
    throw { error: "INVALID RESPONSE" };
  }
}

function hasVideo(snap) {
  if (snap.snapInfo.hasOwnProperty("snapMediaType")) {
    return snap.snapInfo.snapMediaType == "SNAP_MEDIA_TYPE_VIDEO";
  }
  return false;
}

function getVideo(snap) {
  console.log(snap.snapInfo);
  var info = snap.snapInfo;
  return info.streamingMediaInfo.prefixUrl + info.streamingMediaInfo.mediaUrl;
}

function getImage(snap) {
  console.log(snap.snapInfo);
  var info = snap.snapInfo;
  if (info.streamingMediaInfo.hasOwnProperty("prefixUrl")) {
    return (
      info.streamingMediaInfo.prefixUrl + info.streamingMediaInfo.previewUrl
    );
  } else if (info.hasOwnProperty("publicMediaInfo")) {
    return info.publicMediaInfo.publicImageMediaInfo.mediaUrl;
  }
}

app.listen(3000, () => console.log("Example app listening on port 3000!"));
