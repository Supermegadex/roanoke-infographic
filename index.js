var fab1 = document.querySelector("#nxt-fab");
var fab2 = document.querySelector("#pre-fab");
var fab3 = document.querySelector("#vid-fab");
var fab4 = document.querySelector("#info-fab");
var ripple1 = document.querySelector("#fab-ripple-1");
var mapEl = document.querySelector("#map");
var card = document.querySelector("#main-card");
var endCard = document.querySelector("#end-card");
var infoCard = document.querySelector("#info-card");
var content = document.querySelector("#main-card .card-inner");
var image = document.querySelector("#main-card .card-image");
var infoContent = document.querySelector("#info-card .card-inner");
var title = document.querySelector("#main-card .card-title");
var paragraph = document.querySelector("#main-card .card-paragraph");
var video = document.querySelector(".video");

function makeLine(start, end, angle, name) {
  var ro = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": start
    }
  };

  var cr = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": end
    }
  };

  var crMidpoint = turf.midpoint(ro, cr);

  var x1 = crMidpoint.geometry.coordinates[0], y1 = crMidpoint.geometry.coordinates[1];
  var x2 = ro.geometry.coordinates[0], y2 = ro.geometry.coordinates[1];
  var m = (y2 - y1) / (x2 - x1);
  var angle_rad = Math.tan(angle * Math.PI / 180);
  var new_y = (angle_rad * (x2 - x1)) + y1;
  var new_x = x1 - (m * (new_y - y1));

  var crLine = {
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      "coordinates": [
        ro.geometry.coordinates,
        [new_x, new_y],
        cr.geometry.coordinates
      ]
    }
  };

  var curvedCr = turf.bezier(crLine, 10000, 1);
  var rand = Math.random();

  map.addSource("route" + rand, {
    "type": "geojson",
    "data": curvedCr
  });

  map.addLayer({
    "id": name,
    "type": "line",
    "source": "route" + rand,
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": "#FFFF00",
      "line-width": 2
    }
  });
}

var england = [1.1743, 52.3555];
var roanoke = [-75.6615, 35.8897];
var croatoa = [-75.5393, 35.2480];
var virgini = [-76.6949, 35.9957];
var ocean = [-61.075467, 36.953999];
var sat = "mapbox://styles/supermegadex/cj6z2pxfvbi8k2rqx8e81hgcd";
var MAX = 6;

mapboxgl.accessToken = 'pk.eyJ1Ijoic3VwZXJtZWdhZGV4IiwiYSI6ImNqNnc4c242NDFjcG0zMm56MzlqMDk1czMifQ.gFotKrTtsriSfvGxKVzsoA';

var map = new mapboxgl.Map({
  container: 'map',
  style: sat,
  center: england,
  zoom: 4
});

map.on('load', function() {
  updateFabs();
  document.onkeydown = function (e) {
    console.log(e);
    if (e.keyCode === 39) {
      nxtClick();
    }
    if (e.keyCode === 37) {
      preClick();
    }
  }, false;
});

function updateFabs() {
  if (counter < 1) {
    fab2.style.transform = "scale(0)";
  }
  else {
    fab2.style.transform = "scale(1)";
  }
  if (counter >= actions.length - 1) {
    fab1.style.transform = "scale(0)";
  }
  else {
    fab1.style.transform = "scale(1)";
  }
}

function fly(center, zoom, speed) {
  map.flyTo({
    center: center,
    zoom: zoom,
    bearing: 0,
    speed: speed,
    curve: 1,
    easing: function (t) {
      return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    }
});
}

function goToCroatoan() {
  map.setLayoutProperty("roline", 'visibility', 'none');
  makeLine(roanoke, croatoa, -10, "crline");
  updateText("\"CROATOAN\"", "One theory rests on a carving found on a tree in the settlement. It said, \"CROATOAN,\" the name of a Native tribe and an island just south of Roanoke.", "croatoan.jpg");
  fly(croatoa, 9, .2);
}

function goBack() {
  if (counter === 7) {
    updateText("Roanoke", "The next one is more mysterious...");
    fly(roanoke, 9, .4);
  }
  if (counter === 9) {
    updateText("Roanoke", "The last theory is perhaps the most depressing.");
    fly(roanoke, 9, 1);
  }
}

function goToRoanoke() {
  makeLine(england, roanoke, -5, "roline");
  if (counter === 1) {
    updateText("Roanoke, July 4, 1584", "Settlers arrived at Roanoke Island, where they searched for <strong>gold</strong> and <strong>silver</strong>. The settlement did not last long.", "gold.jpg");
    fly(roanoke, 9, .4);
  }
  if (counter === 3) {
    updateText("Roanoke, 1587", "<strong>115</strong> settlers, as family groups, settled in Roanoke for a second time. As they began to run out of food, they asked Governor White to return to England and ask for help.");
    fly(roanoke, 9, .9);
  }
  if (counter === 5) {
    updateText("Roanoke, 1590", "When White returned to Roanoke, he discovered that not one colonist remained in Roanoke. Even today, no one can give a definitive answer about where they went.");
    fly(roanoke, 9, .9);
  }
}

function goToVa() {
  map.setLayoutProperty("crline", 'visibility', 'none');
  makeLine(roanoke, virgini, 2, "valine");
  updateText("Merry Hill, North Carolina", "Scholars discovered that a map of Roanoke had a patch over a red mark, a mark that some people think is where the colonists went. This is where that red mark was.");
  fly(virgini, 11, .5)
}

function goToEngland() {
  makeLine(england, roanoke, -5, "roline");
  if (counter === 0) {
    updateText("England, April 27, 1584", "Sir Walter Raleigh dispatches expedition led by Philip Amadas and Arthur Barlowe.");
    fly(england, 4, .5);
  }
  if (counter === 2) {
    updateText("England, 1587", "Raleigh sends another group of colonists. This time, their focus will be on <strong>plantations</strong>.", "plant.jpg");
    fly(england, 4, .9);
  }
  if (counter === 4) {
    updateText("England, 1590", "White's return to resupply has been delayed by three years because of wars between England and Spain.", "ship.jpg");
    fly(england, 4, .9);
  }
}

function goToOcean() {
  makeLine(roanoke, ocean, -5, "ocline");
  updateText("Bottom of the Ocean", "Well, it may seem pessimistic, but the Roanoke settlers may have just tried to sail home--then sank on their way.");
  fly(ocean, 15, .2);
}

var fin = false;

function finishAnim() {
  fab3.children[1].innerHTML = "&#xE5CD;";
  fin = true;
  video.style.display = "none";
  mapEl.style.transform = "translateY(40vh)";
  setTimeout(function() {
    fab1.style.transform = "scale(0)";
    fab2.style.transform = "scale(0)";
    card.style.transform = "translateY(-100%)"
  }, 250);
  setTimeout(function() {
    endCard.style.display = "block";
    endCard.style.animation = "ripple-card 500ms ease-in-out forwards";
    setTimeout(function() {
      video.style.display = "inline";
    }, 500);
  }, 1000);
}

function infoAnim() {
  fab4.children[1].innerHTML = "&#xE5CD;";
  inf = true;
  infoContent.style.display = "none";
  mapEl.style.transform = "translateY(40vh)";
  setTimeout(function () {
    fab1.style.transform = "scale(0)";
    fab2.style.transform = "scale(0)";
    card.style.transform = "translateY(-100%)"
  }, 250);
  setTimeout(function () {
    infoCard.style.display = "block";
    infoCard.style.animation = "ripple-card 500ms ease-in-out forwards";
    setTimeout(function () {
      infoContent.style.display = "inline";
    }, 500);
  }, 1000);
}

function vidToInfo() {
  fab3.children[1].innerHTML = "&#xE63A;";
  fab4.children[1].innerHTML = "&#xE5CD;";
  inf = true;
  video.style.display = "none";
  infoContent.style.display = "none";
  endCard.style.animation = "ripple-card-reverse 500ms ease-in-out forwards";
  fin = false;
  setTimeout(function() {
    infoCard.style.animation = "ripple-card 500ms ease-in-out forwards";
    infoCard.style.display = "block";
    setTimeout(function () {
      infoContent.style.display = "block";
    }, 500);
  }, 500);
}

function infoToVid() {
  fab3.children[1].innerHTML = "&#xE5CD;";
  fab4.children[1].innerHTML = "&#xE88F;";
  inf = false;
  video.style.display = "none";
  infoContent.style.display = "none";
  infoCard.style.animation = "ripple-card-reverse 500ms ease-in-out forwards";
  fin = true;
  setTimeout(function () {
    endCard.style.animation = "ripple-card 500ms ease-in-out forwards";
    endCard.style.display = "block";
    setTimeout(function () {
      video.style.display = "block";
    }, 500);
  }, 500);
}

function resumeAnimation() {
  fab3.children[1].innerHTML = "&#xE63A;";
  fin = false;
  video.style.display = "none";
  endCard.style.animation = "ripple-card-reverse 500ms ease-in-out forwards";
  setTimeout(function () {
    card.style.transform = "translateY(0)";
    updateFabs();
    setTimeout(function () {
      mapEl.style.transform = "translateY(0)";
    }, 250);
  }, 500);
}

function resumeInfo() {
  fab4.children[1].innerHTML = "&#xE88F;";
  inf = false;
  infoContent.style.display = "none";
  infoCard.style.animation = "ripple-card-reverse 500ms ease-in-out forwards";
  setTimeout(function () {
    card.style.transform = "translateY(0)";
    updateFabs();
    setTimeout(function () {
      mapEl.style.transform = "translateY(0)";
    }, 250);
  }, 500);
}

var actions = [
  goToEngland,
  goToRoanoke,
  goToEngland,
  goToRoanoke,
  goToEngland,
  goToRoanoke,
  goToCroatoan,
  goBack,
  goToVa,
  goBack,
  goToOcean
];

function updateText(ttext, text, img) {
  content.style.opacity = "0";
  setTimeout(function() {
    title.innerHTML = ttext;
    image.innerHTML = img ? "<img src='" + img + "' class='image' alt='" + ttext + "'>" : "";
    setTimeout(function () {
      paragraph.innerHTML = text;
      content.style.opacity = "1";
    }, 100);
  }, 500);
}

counter = 0;

function rippler(e) {
  e = e || window.event;

  function m62(val) { return val - 50 }

  var pageX = e.pageX;
  var pageY = e.pageY;

  // IE 8
  if (pageX === undefined) {
    pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  var top = m62(pageY) + "px";
  var left = m62(pageX) + "px";
  ripple1.style.top = top;
  ripple1.style.left = left;
  ripple1.style.animation = "ripple 250ms forwards";
  setTimeout(function() {
    ripple1.style.animation = "idle 1ms forwards"
  }, 250);
}

function nxtClick() {
  counter++;
  updateFabs();
  actions[counter]();
  rippler();
}

function preClick() {
  counter--;
  updateFabs();
  actions[counter]();
  rippler();
}

function vidClick() {
  rippler();
  if (inf) {
    infoToVid();
  }
  else if (!fin) {
    finishAnim();
  }
  else {
    resumeAnimation();
  }
}

var inf = false;

function infClick() {
  rippler();
  if (fin) {
    vidToInfo();
  }
  else if (!inf) {
    infoAnim();
  }
  else {
    resumeInfo();
  }
}

fab1.addEventListener("click", nxtClick);
fab2.addEventListener("click", preClick);
fab3.addEventListener("click", vidClick);
fab4.addEventListener("click", infClick);