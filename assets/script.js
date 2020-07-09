var citiesEl = document.querySelector("#cities");
var cityWeatherEl = document.querySelector("#city-weather");
var fiveDayEl = document.querySelector("#five-day-forecast");
var searchFormEl = document.querySelector("form");
var searchValue = document.querySelector("#search");
var appendFiveEl = document.querySelector("#append-five");
var appendFormEl = document.querySelector("#form-element");

var cities = JSON.parse(localStorage.getItem("cities")) || [];
var lastCity = cities.slice(-1);
console.log(cities);


var citySearchHandler = function(event) {
    event.preventDefault();
    var city = searchValue.value;
    getWeather(city);
}

var getWeather = function(city) {
    clearValues();
    var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=2293a78ee4e8dab1902c613c97856ae7"
    fetch(queryUrl)
        .then(response => {
            if (response.ok) {
                response.json()
                    .then(data => {
                        currentWeather(data);
                        fiveDayForecast(data);
                    })
            } else {
                alert("Error: " + response.statusText);
                searchValue.value = ''
            }
        })
        .catch(error => {
            alert(error);
        })
}

var currentWeather = function(data) {

    cityWeatherEl.innerHTML = `<h3> ${searchValue.value}</h3>` +
        `<p>Temperature: ${data.list[0].main.temp}</p>` +
        `<p> Humidity: ${data.list[0].main.humidity} %</p>` +
        `<p> Wind Speed: ${data.list[0].wind.speed}mph`;
}

var fiveDayForecast = function(data) {

    var offsetColumn = true;

    appendFiveEl.innerHTML = `<h3>Five Day Forecast:  ${setCity()}</h3>`;

    var offset;
    for (var i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt.includes("12:00:00")) {
            var dataInfo = data.list[i];
            var fahrenheight = (Math.floor(((parseInt(dataInfo.main.temp) - 273.15) * (9 / 5) + 32))).toString();

            offsetColumn ? offset = 3 : offset = 0;

            fiveDayEl.innerHTML += `<div class="col-2 m-1 offset-${offset} bg-primary">` +
                `<p> ${dataInfo.dt_txt.split(" ")[0]} </p>` +
                `<img src="http://openweathermap.org/img/wn/${dataInfo.weather[0].icon}@2x.png" attr="${dataInfo.weather[0].description}">` +
                `<p> Temp: ${fahrenheight}°F` +
                `<p> Humidity: ${dataInfo.main.humidity}%` +
                `</div>`;

            offsetColumn = false;
        }


    }
    fiveDayEl.firstElementChild.classList.remove("m-1");
    attachCities();
    searchValue.value = '';

}
var attachCities = function() {
    if (searchValue.value !== "") {
        cities.push(searchValue.value);
        localStorage.setItem("cities", JSON.stringify(cities));
    }



    for (var i = 0; i < cities.length; i++) {
        if (i < 10) {
            citiesEl.innerHTML += `<div class="text-center" style="border: 1px solid black;"> ${cities[i]}</div>`;
        }
    }
}
var clearValues = function() {
    citiesEl.innerHTML = "";
    cityWeatherEl.innerHTML = "";
    fiveDayEl.innerHTML = "";
    appendFiveEl.innerHTML = '';
}

var setCity = function() {
    if (searchValue.value === "") {
        return lastCity
    } else {
        return searchValue.value
    }
}
console.log('lasyCity: ', lastCity);
getWeather(lastCity);
searchFormEl.addEventListener("submit", citySearchHandler);