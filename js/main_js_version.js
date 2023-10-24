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

let arrAllSum = [];

// =========================== Element page end =========================== //

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

// =========================== push group stats on page =========================== //
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

// =========================== push group stats on page end =========================== //

// =========================== push prediction stats on page =========================== //
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

// =========================== push prediction stats on page end =========================== //

// =========================== DATA GROUP SELECT =========================== //

selectLeaudeLikn.addEventListener("change", () => {
	for (let key in linkJson) {
		if (key === selectLeaudeLikn.value) {
			clearPredoctionBlocks(); // remove попередній прогноз і всі його стилі
			clearPredoctionSelect(); // remove значення селекту прогнозистів
			pushDataGroups(linkJson[key]);
			maxNumOfPointsPossible(linkJson[key], selectLeaudeLikn.value);
		}
	}
});

// =========================== PREDICTION GROUP SELECT =========================== //
selectPredictionLikn.addEventListener("change", () => {
	for (const key in linkPredJson) {
		if (key === selectPredictionLikn.value) {
			for (const linkKey in linkPredJson[key]) {
				if (linkKey === selectLeaudeLikn.value) {
					clearPredoctionBlocks(); // remove advance forecast and all its styles
					pushPredictionData(linkPredJson[key][linkKey]);
					backgroundStats();
				}
			}
		}
	}
	generalPoints(selectPredictionLikn.value, linkJson, linkPredJson);
});

// =========================== GROUP SELECT end =========================== //

// =========================== background stats =========================== //
function backgroundStats() {
	teamText.forEach((el) => {
		groupsPrediction.forEach((items) => {
			for (let i = 0; i < items.children.length; i++) {
				if (items.children[i].dataset.id == el.children[0].dataset.id) {
					if (
						items.children[i].dataset.position ==
						el.children[0].dataset.position
					) {
						items.children[i].classList.add("background-green");
					} else if (
						items.children[i].dataset.position !=
						el.children[0].dataset.position &&
						el.children[0].dataset.position < 3
					) {
						items.children[i].classList.add("background-yellow");
					} else {
						items.children[i].classList.add("background-red");
					}
				}
			}

		});
	});
}

// =========================== background stats end =========================== //


// ================================================================== //
function countSum(index) {
	switch (index) {
		case 0:
			return fivePoints;
			break;

		case 1:
			return fourPoints;
			break;

		case 2:
			return threePoints;
			break;

		default:
			break;
	}
}


function maxNumOfPointsPossible(arr, val) {
	let maxLeaugePointsCount = 0;
	switch (val) {
		case "urlChampionsLeague":
			maxLeaugePointsCount = fivePoints * arr.length * 2;
			break;

		case "urlEuropaLeague":
			maxLeaugePointsCount = fourPoints * arr.length * 2;
			break;

		case "urlConferenceLeague":
			maxLeaugePointsCount = threePoints * arr.length * 2;
			break;

		default:
			break;
	}
	pointsLeagueMax.innerHTML = maxLeaugePointsCount;
}

function newObjArrays(obj) {
	let arr = [[], [], []];
	for (const key in obj) {
		for (let i = 0; i < obj[key].length; i++) {
			for (let k = 0; k < obj[key][i].teams.length; k++) {
				let newObj = {
					id: obj[key][i].teams[k].id,
					position: obj[key][i].teams[k].position
				}
				switch (key) {
					case "urlChampionsLeague":
						arr[0].push(newObj);
						break;

					case "urlEuropaLeague":
						arr[1].push(newObj);
						break;

					case "urlConferenceLeague":
						arr[2].push(newObj);
						break;

					default:
						break;
				}
			}
		}
	}
	return arr;
}

function countingAndComparing(index, arrLg, arrUser) {
	// const objLength = Object.keys(linkJson).length;
	count = 0;
	for (let a = 0; a < 1; a++) {
		for (let i = 0; i < arrLg.length; i++) {
			for (let k = 0; k < arrUser.length; k++) {
				if (arrLg[i].id == arrUser[k].id) {
					if (arrLg[i].position == arrUser[k].position) {
						count += countSum(index);
					} else if (arrLg[i].position !== arrUser[k].position && arrUser[k].position < 3) {
						count += twoPoints;
					}
				}
			}
		}
		arrAllSum.push(count);
	}
	return arrAllSum;
}

function generalPoints(name, leaugesJson, predJson) {
	const leaugesArr = newObjArrays(leaugesJson);
	const predictionArr = newObjArrays(predJson[name]);
	let generalCount;
	for (let i = 0; i < predictionArr.length; i++) {
		for (let k = 0; k < leaugesArr.length; k++) {
			if (i !== k) {
				continue;
			} else {
				generalCount = countingAndComparing(i, predictionArr[i], leaugesArr[k]);
			}
		}
	}
	let max = generalCount.reduce(function (accum, item) {
		accum += item;
		return accum;
	}, 0);
	showPoints(max, pointsPredictionSum);
	pointOnLeague(generalCount);
	clearArray(arrAllSum);
}

// ================================================================== //


function pointOnLeague(arr) {
	const select = document.querySelector(".select-leaude-likn");
	switch (select.value) {
		case "urlChampionsLeague":
			showPoints(arr[0], pointsLeague);
			break;

		case "urlEuropaLeague":
			showPoints(arr[1], pointsLeague);
			break;

		case "urlConferenceLeague":
			showPoints(arr[2], pointsLeague);
			break;

		default:
			break;
	}
}


// =========================== show =========================== //

function showPoints(num, block) {
	block.innerHTML = num;
}

// =========================== show end =========================== //
// =========================== clear =========================== //

function clearBlockValue(block) {
	block.innerHTML = "";
}

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
		clearBlockValue(item);
	});
	clearBlockValue(pointsLeague);
	clearBlockValue(pointsPredictionSum);
}


function clearArray(arr) {
	arr.length = 0;
}

function clearPredoctionSelect() {
	return (selectPredictionLikn.value = "");
}

// =========================== clear end =========================== //
// pushDataGroups(linkJson.urlChampionsLeague);
