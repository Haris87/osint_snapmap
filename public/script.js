function createVideoElement(snap) {
  var div = document.createElement("div");
  var container = document.getElementById("container");

  container.appendChild(div);
  var video = document.createElement("video");
  video.src = snap.url;
  video.controls = true;
  video.autoplay = false;
  div.appendChild(video);
  div.appendChild(document.createTextNode(new Date(snap.datetime * 1000)));
  return div;
}

function createImageElement(snap) {
  var div = document.createElement("div");
  var container = document.getElementById("container");

  container.appendChild(div);
  var image = document.createElement("img");
  image.src = snap.url;
  div.appendChild(image);
  div.appendChild(document.createTextNode(new Date(snap.datetime * 1000)));
  return div;
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
  console.log("SNAPS", snaps);
  snaps.forEach(function (snap) {
    isVideo(snap) ? createVideoElement(snap) : createImageElement(snap);
  });
}

function isVideo(snap) {
  return snap.type === "VIDEO";
}

function fetchData() {
  var lat = document.getElementById("lat").value.toString();
  var long = document.getElementById("long").value.toString();

  sendRequest("GET", "http://localhost:3000/map?lat=" + lat + "&long=" + long)
    .then(function (response) {
      console.log(response);
      response = JSON.parse(response);
      console.log("RESPONSE", response);
      var snaps = response;
      displaySnaps(snaps);
    })
    .catch(function (error) {
      console.log("ERROR", error);
    });
}
