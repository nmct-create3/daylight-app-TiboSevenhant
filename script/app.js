// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie
const updateSun = function(){
	console.log('Test Update function')
}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (sunriseTimestamp, sunsetTimestamp) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	// Bepaal het aantal minuten dat de zon al op is.
	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	// Vergeet niet om het resterende aantal minuten in te vullen.
	// Nu maken we een functie die de zon elke minuut zal updaten
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
	// console.log(totalMinutes, sunrise);
	let now = new Date();
	//now.setMinutes(now.getMinutes() + 1);
	let sunset = new Date(sunsetTimestamp * 1000);
	let sunrise = new Date(sunriseTimestamp * 1000);
	let verschil = new Date(sunset.getTime() - now.getTime());
	let verschilMin = Math.round(verschil / 60000);
	let totaalTime = new Date(sunset.getTime() - sunrise.getTime());
	let totaalMinutes = Math.round(totaalTime / 60000);
	let percentagePassed = 100 - (verschilMin / totaalMinutes) * 100;
	let y = -0.04 * Math.pow(percentagePassed, 2) + 4 * percentagePassed - 2e-13;
	let x = percentagePassed;
	console.log(totaalMinutes, verschilMin, percentagePassed, y);
	let sun = document.querySelector('.js-sun');
	sun.setAttribute('data-time', _parseMillisecondsIntoReadableTime(now / 1000));
	sun.style.bottom = `${y}%`;
	sun.style.left = `${x}%`;

	if (percentagePassed < 0 || percentagePassed > 100) {
		document.documentElement.classList.remove('is-day');
		document.documentElement.classList.add('is-night');
		document.querySelector('.js-time-left').innerHTML = 0;
		if (percentagePassed > 100) {
			sun.style.opacity = '0';
			clearInterval(timer);
		}
	} else {
		document.documentElement.classList.add('is-day');
		document.documentElement.classList.remove('is-night');
		document.querySelector('.js-time-left').innerHTML = diffMinutes;
	}

	
	updateSun();
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
	// We gaan eerst een paar onderdelen opvullen
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
	console.log(queryResponse);
	document.querySelector('.js-location').innerHTML = `${queryResponse.city.name}, ${queryResponse.city.country}`;
	document.querySelector('.js-sunrise').innerHTML = _parseMillisecondsIntoReadableTime(queryResponse.city.sunrise);
	document.querySelector('.js-sunset').innerHTML = _parseMillisecondsIntoReadableTime(queryResponse.city.sunset);

	now = new Date(queryResponse.city.sunrise * 1000);
	placeSunAndStartMoving(queryResponse.city.sunrise, queryResponse.city.sunset);
	timer = setInterval(() => placeSunAndStartMoving(queryResponse.city.sunrise, queryResponse.city.sunset), 60 * 1000); //60 * 1000
	document.documentElement.classList.add('is-loaded');
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = (lat, lon) => {
	// Eerst bouwen we onze url op
	const apiId = '15448470067381744e3697b424339773';
	let apiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiId}&units=metric&lang=nl&cnt=1`;
	// Met de fetch API proberen we de data op te halen.
	// Als dat gelukt is, gaan we naar onze showResult functie.
	fetch (apiUrl)
		.then(function(response){
			console.log(response);
			return response.json();
		})
		.then(function(json){
			showResult(json);
			console.log(JSON.stringify(json));
		})
};

document.addEventListener('DOMContentLoaded', function() {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
});
