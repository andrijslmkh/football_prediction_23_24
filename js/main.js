"use strict";
// =========================== Element page =========================== //
const groupsStats = document.querySelectorAll('.groups-stats__body');
const groupsPrediction = document.querySelectorAll('.groups-prediction__body');

const selectLeaudeLikn = document.querySelector('.select-leaude-likn');
const selectPredictionLikn = document.querySelector('.select-prediction-likn');

let points = document.querySelector('.points');
let count = 0;
// =========================== =========================== //

// =========================== JSON =========================== //
const linkJson = {
	urlChampionsLeague: '../json/champions_league.json',
	urlEuropaLeague: '../json/europa_league.json',
	urlConferenceLeague: '../json/conference_league.json',
};


const linkPredJson = {
	milanskih: {
		urlChampionsLeague: '../json/milanskih_champions_league.json',
		urlEuropaLeague: '../json/milanskih_europa_league.json',
		urlConferenceLeague: '../json/milanskih_conference_league.json',
	},
	slmkh: {
		urlChampionsLeague: '../json/slmkh_champions_league.json',
		urlEuropaLeague: '../json/slmkh_europa_league.json',
		urlConferenceLeague: '../json/slmkh_conference_league.json',
	}
};
// =========================== JSON end =========================== //
// =========================== data leagues =========================== //
// Получання даних з JSON
async function groupsData(url) {
	try {
		const response = await fetch(url);
		const data = await response.json();
		pushDataGroupsStats(data);
	} catch (e) {
		console.error(`error: ${e.message}`);
	}
}

function pushDataGroupsStats(data) {
	for (let i = 0; i < data.length; i++) {

		//push name group
		groupsStats[i].children[0].children[0].children[0].innerHTML = data[i].group_name;

		for (let k = 0; k < 4; k++) {

			//push name team on position
			groupsStats[i].children[data[i].teams[k].position].children[0].setAttribute("data-id", data[i].teams[k].id);
			groupsStats[i].children[data[i].teams[k].position].children[0].setAttribute("data-position", data[i].teams[k].position);
			groupsStats[i].children[data[i].teams[k].position].children[0].innerHTML = data[i].teams[k].name;

			//push stats team on position
			groupsStats[i].children[data[i].teams[k].position].children[1].innerHTML = data[i].teams[k].stats.win;
			groupsStats[i].children[data[i].teams[k].position].children[2].innerHTML = data[i].teams[k].stats.draw;
			groupsStats[i].children[data[i].teams[k].position].children[3].innerHTML = data[i].teams[k].stats.lose;
			groupsStats[i].children[data[i].teams[k].position].children[4].innerHTML = data[i].teams[k].stats.points;
		}
	}
}

// =========================== data leagues end =========================== //

// =========================== prediction =========================== //
// Получання даних з JSON
// Змінювати тут силку на прогноз
async function predictionData(url) {
	try {
		const response = await fetch(url);
		const data = await response.json();
		pushPredictionData(data);
		forecastStatistics(groupsPrediction);
	} catch (e) {
		console.error(`error: ${e.message}`);
	}
}


function pushPredictionData(data) {
	for (let i = 0; i < data.length; i++) {
		// 0 index
		groupsPrediction[i].children[data[i].teams[0].position - 1].innerHTML = data[i].teams[0].name;
		groupsPrediction[i].children[data[i].teams[0].position - 1].setAttribute("data-id", data[i].teams[0].id);
		groupsPrediction[i].children[data[i].teams[0].position - 1].setAttribute("data-position", data[i].teams[0].position);
		// 1 index
		groupsPrediction[i].children[data[i].teams[1].position - 1].innerHTML = data[i].teams[1].name;
		groupsPrediction[i].children[data[i].teams[1].position - 1].setAttribute("data-id", data[i].teams[1].id);
		groupsPrediction[i].children[data[i].teams[1].position - 1].setAttribute("data-position", data[i].teams[1].position);
	}
}

// =========================== prediction end =========================== //


// =========================== DATA GROUP SELECT =========================== //

selectLeaudeLikn.addEventListener('change', () => {
	for (let key in linkJson) {
		if (key === selectLeaudeLikn.value) {
			clearPredoctionBlocks(); // remove попередній прогноз і всі його стилі
			clearPredoctionSelect(); // remove значення селекту прогнозистів
			groupsData(linkJson[key]);
		}
	}
});

// =========================== PREDICTION GROUP SELECT =========================== //
selectPredictionLikn.addEventListener('change', () => {
	for (const key in linkPredJson) {
		if (key === selectPredictionLikn.value) {
			for (const linkKey in linkPredJson[key]) {
				if (linkKey === selectLeaudeLikn.value) {
					clearPredoctionBlocks(); // remove попередній прогноз і всі його стилі
					predictionData(linkPredJson[key][linkKey]);
				}
			}
		}
	}
});

// =========================== =========================== //

function forecastStatistics(predTeam) {
	const teamText = document.querySelectorAll('.table__team-text');
	count = 0;

	teamText.forEach(el => {
		predTeam.forEach(items => {
			for (let i = 0; i < items.children.length; i++) {
				if (items.children[i].dataset.id == el.children[0].dataset.id) {

					if (items.children[i].dataset.position == el.children[0].dataset.position) {
						items.children[i].classList.add('background-green');
						count += 5;
					} else if (items.children[i].dataset.position != el.children[0].dataset.position && el.children[0].dataset.position < 3) {
						items.children[i].classList.add('background-yellow');
						count += 2;
					} else {
						items.children[i].classList.add('background-red');
					}

				}
			}
		})
	});
	points.innerHTML = count;
}

// =========================== =========================== //

function clearPredoctionBlocks() {
	const predictionTeamName = document.querySelectorAll('.prediction__team-name');

	predictionTeamName.forEach(item => {
		delete item.dataset.id;
		delete item.dataset.position;
		item.classList.remove('background-green');
		item.classList.remove('background-yellow');
		item.classList.remove('background-red');
		item.innerHTML = '';
	});
	points.innerHTML = '';

}

function clearPredoctionSelect() {
	return selectPredictionLikn.value = '';
}


// ================================================================== //

groupsData(linkJson.urlChampionsLeague);