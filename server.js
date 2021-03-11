const express = require("express");
const snapMap = require("../lib");
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
    .getPlaylist(Number(req.query.lat), Number(req.query.long), 1000, 12)
    .then(function (response) {
      console.log(response);

      return res.send(response);
    })
    .catch(function (error) {
      console.log(error);
      return res.send("ERROR");
    });
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));
