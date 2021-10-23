let apikey = "ca77d6416875b9f8966e57181ce172b4";
let currentDate = moment().format("MM/DD/YYYY");
let unit = "imperial";
let citiesListWrapper = document.querySelector("#citiesList");
let cityBtns = document.querySelector(".city-button");

let searchHisArray = JSON.parse(localStorage.getItem("citySearched")) || [];

function onPageLoad() {
    searchHisArray.forEach((city) => {
        let li = document.createElement("li");
        li.classList.add("cityListItem");
        let button = document.createElement("button");
        button.classList.add("cityButton");
        button.innerHTML = city;
        li.appendChild(button);
        citiesListWrapper.appendChild(li);
    });
};

onPageLoad();

$(".city-button").on("click", function () {
    console.log("this worked");
    apiCall($(this).text());
});

function apiCall(cityEntered) {
    let weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityEntered + "&appid=" + appkey + "&units=" + unit;
    fetch(weatherUrl)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
            let cityE1 = document.querySelector("#cityName");
            cityE1.textContent = cityEntered + " (" + (currentDate) + ")";
            let tempE1 = document.querySelector("#temp");
            tempE1.textContent = "Temperature: " + parseInt(data.main.temp) + "°F";
            let humidityE1 = document.querySelector("#humidity");
            humidityE1.textContent = "Humidity: " + parseInt(data.main.humidity) + "%";
            let windE1 = document.querySelector("#windspeed");
            windE1.textContent = "Wind Speed: " +parseInt(data.wind.speed) + "MPH";
            let lat = parseInt(data.coord.lat);
            let lon = parseInt(data.coord.lon);

            let uvIndexUrl = "https:api.openweather.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "appid=" + appkey;

            fetch(uvIndexUrl)
                .then(function (response) {
                return response.json();

                })
                .then(function(data) {
                    uvIndexNumber = parseInt(data.value);
                    let uvIndexE1 = document.querySelector("#uvindex");
                    uvIndexE1.textContent = "UV Index: " + uvIndexNumber;

                    if (uvIndexNumber < 4) {
                        uvIndexE1.classList.add("favorable");
                    } else if (uvIndexNumber >= 4 && uvIndexNumber <= 7) {
                        uvIndexE1.classList.add("severe");
                    }
                })
        })
        fiveDayAPICall(cityInput)
}

$("#searchBtn").on("click", function () {
    event.preventDefault();
    let cityEntered = $("#citySearched").val().toUpperCase().trim();
})

