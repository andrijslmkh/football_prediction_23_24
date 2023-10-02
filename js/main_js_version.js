"use strict";
// =========================== Element page =========================== //
const groupsStats = document.querySelectorAll(".groups-stats__body");
const groupsPrediction = document.querySelectorAll(".groups-prediction__body");

const selectLeaudeLikn = document.querySelector(".select-leaude-likn");
const selectPredictionLikn = document.querySelector(".select-prediction-likn");
const teamText = document.querySelectorAll(".table__team-text");

let pointsLeague = document.querySelector(".points-league");
let pointsLeagueMax = document.querySelector(".points-league-max");
let pointsPredictionSum = document.querySelector(".points-prediction-sum");

const twoPoints = 2;
const threePoints = 3;
const fourPoints = 4;
const fivePoints = 5;
let count = 0;

// =========================== =========================== //

// =========================== JSON =========================== //
const linkJson = {
  urlChampionsLeague: championsLeagueJson,
  urlEuropaLeague: europaLeagueJson,
  urlConferenceLeague: conferenceLeagueJson,
};

const linkPredJson = {
  milanskih: {
    urlChampionsLeague: milanskihChampionsLeagueJson,
    urlEuropaLeague: milanskihEuropaLeagueJson,
    urlConferenceLeague: milanskihConferenceLeagueJson,
  },
  slmkh: {
    urlChampionsLeague: slmkhChampionsLeagueJson,
    urlEuropaLeague: slmkhEuropaLeagueJson,
    urlConferenceLeague: slmkhConferenceLeagueJson,
  },
};

// =========================== JSON end =========================== //

function pushDataGroups(data) {
  for (let i = 0; i < data.length; i++) {
    //push name group
    groupsStats[i].children[0].children[0].children[0].innerHTML =
      data[i].group_name;

    for (let k = 0; k < 4; k++) {
      //push name team on position
      groupsStats[i].children[
        data[i].teams[k].position
      ].children[0].setAttribute("data-id", data[i].teams[k].id);
      groupsStats[i].children[
        data[i].teams[k].position
      ].children[0].setAttribute("data-position", data[i].teams[k].position);
      groupsStats[i].children[data[i].teams[k].position].children[0].innerHTML =
        data[i].teams[k].name;

      //push stats team on position
      groupsStats[i].children[data[i].teams[k].position].children[1].innerHTML =
        data[i].teams[k].stats.win;
      groupsStats[i].children[data[i].teams[k].position].children[2].innerHTML =
        data[i].teams[k].stats.draw;
      groupsStats[i].children[data[i].teams[k].position].children[3].innerHTML =
        data[i].teams[k].stats.lose;
      groupsStats[i].children[data[i].teams[k].position].children[4].innerHTML =
        data[i].teams[k].stats.points;
    }
  }
}

// =========================== data leagues end =========================== //

// =========================== prediction =========================== //
// Получання даних з JSON
// Змінювати тут силку на прогноз

function pushPredictionData(data) {
  for (let i = 0; i < data.length; i++) {
    // 0 index
    groupsPrediction[i].children[data[i].teams[0].position - 1].innerHTML =
      data[i].teams[0].name;
    groupsPrediction[i].children[data[i].teams[0].position - 1].setAttribute(
      "data-id",
      data[i].teams[0].id
    );
    groupsPrediction[i].children[data[i].teams[0].position - 1].setAttribute(
      "data-position",
      data[i].teams[0].position
    );
    // 1 index
    groupsPrediction[i].children[data[i].teams[1].position - 1].innerHTML =
      data[i].teams[1].name;
    groupsPrediction[i].children[data[i].teams[1].position - 1].setAttribute(
      "data-id",
      data[i].teams[1].id
    );
    groupsPrediction[i].children[data[i].teams[1].position - 1].setAttribute(
      "data-position",
      data[i].teams[1].position
    );
  }
}

// =========================== prediction end =========================== //

// =========================== DATA GROUP SELECT =========================== //

selectLeaudeLikn.addEventListener("change", () => {
  for (let key in linkJson) {
    if (key === selectLeaudeLikn.value) {
      clearPredoctionBlocks(); // remove попередній прогноз і всі його стилі
      clearPredoctionSelect(); // remove значення селекту прогнозистів
      pushDataGroups(linkJson[key]);
      maxТumOfPointsPossible(linkJson[key]);
    }
  }
});

// =========================== PREDICTION GROUP SELECT =========================== //
selectPredictionLikn.addEventListener("change", () => {
  for (const key in linkPredJson) {
    if (key === selectPredictionLikn.value) {
      for (const linkKey in linkPredJson[key]) {
        if (linkKey === selectLeaudeLikn.value) {
          clearPredoctionBlocks(); // remove попередній прогноз і всі його стилі
          pushPredictionData(linkPredJson[key][linkKey]);
          forecastStatistics();
        }
      }
      generalPoints(selectPredictionLikn.value);
    }
  }
});

// =========================== =========================== //

function forecastStatistics() {
  count = 0;
  teamText.forEach((el) => {
    groupsPrediction.forEach((items) => {
      for (let i = 0; i < items.children.length; i++) {
        if (items.children[i].dataset.id == el.children[0].dataset.id) {
          if (
            items.children[i].dataset.position ==
            el.children[0].dataset.position
          ) {
            items.children[i].classList.add("background-green");
            // countFun
            count += countFun();
          } else if (
            items.children[i].dataset.position !=
              el.children[0].dataset.position &&
            el.children[0].dataset.position < 3
          ) {
            items.children[i].classList.add("background-yellow");
            count += twoPoints;
          } else {
            items.children[i].classList.add("background-red");
          }
        }
      }
    });
  });
  pointsLeague.innerHTML = count;
}

// =========================== =========================== //

function clearPredoctionBlocks() {
  const predictionTeamName = document.querySelectorAll(
    ".prediction__team-name"
  );

  predictionTeamName.forEach((item) => {
    delete item.dataset.id;
    delete item.dataset.position;
    item.classList.remove("background-green");
    item.classList.remove("background-yellow");
    item.classList.remove("background-red");
    item.innerHTML = "";
  });
  pointsLeague.innerHTML = "";
  pointsPredictionSum.innerHTML = "";
}

function clearPredoctionSelect() {
  return (selectPredictionLikn.value = "");
}

// ================================================================== //

function countFun() {
  let leaugeVal = selectLeaudeLikn.value;
  switch (leaugeVal) {
    case "urlChampionsLeague":
      return fivePoints;
      break;

    case "urlEuropaLeague":
      return fourPoints;
      break;

    case "urlConferenceLeague":
      return threePoints;
      break;

    default:
      break;
  }
}

function maxТumOfPointsPossible(point) {
  let maxLeaugePointsCount = 0;
  let leaugeVal = selectLeaudeLikn.value;
  switch (leaugeVal) {
    case "urlChampionsLeague":
      maxLeaugePointsCount = fivePoints * point.length * 2;
      break;

    case "urlEuropaLeague":
      maxLeaugePointsCount = fourPoints * point.length * 2;
      break;

    case "urlConferenceLeague":
      maxLeaugePointsCount = threePoints * point.length * 2;
      break;

    default:
      break;
  }
  pointsLeagueMax.innerHTML = maxLeaugePointsCount;
}

function generalPoints(user) {
  console.log(user);
}
// ================================================================== //

// pushDataGroups(linkJson.urlChampionsLeague);
