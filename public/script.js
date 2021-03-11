function createVideoElement(src) {
  var video = document.createElement("video");
  video.src = src;
  video.controls = true;
  video.autoplay = false;
  return video;
}

function createImageElement(src) {
  var image = document.createElement("img");
  image.src = src;
  return image;
}

function sendRequest(method, url, body) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        resolve(xhr.responseText);
      }
    };
    xhr.open(method, url);
    xhr.send();
  });
}

function displaySnaps(snaps) {
  var container = document.getElementById("container");
  container.innerHTML = "";
  console.log(snaps.length);
  snaps.forEach(function (snap) {
    console.log(hasVideo(snap));
    container.appendChild(
      hasVideo(snap)
        ? createVideoElement(getVideo(snap))
        : createImageElement(getImage(snap))
    );
  });
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

function fetchData() {
  var lat = document.getElementById("lat").value.toString();
  var long = document.getElementById("long").value.toString();

  sendRequest("GET", "http://localhost:3000/map?lat=" + lat + "&long=" + long)
    .then(function (response) {
      response = JSON.parse(response);
      console.log("RESPONSE", response);
      var snaps = response.elements;
      displaySnaps(snaps);
    })
    .catch(function (error) {
      console.log("ERROR", error);
    });
}
