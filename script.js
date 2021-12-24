let apikey = "ca77d6416875b9f8966e57181ce172b4";
let currentDate = moment().format("MM/D/YYYY");
let unit = "imperial";
let citiesListWrapper = document.querySelector("#citiesList");
let cityBtns = document.querySelectorAll(".city-button");

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
}

onPageLoad();

$(".city-button").on("click", function () {
  console.log("this worked");
  apiCall($(this).text());
});

function apiCall(cityEntered) {
  let weatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityEntered +
    "&appid=" +
    apikey +
    "&units=" +
    unit;

  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let cityEl = document.querySelector("#cityName");
      cityEl.textContent = cityEntered + " (" + currentDate + ")";
      let tempEl = document.querySelector("#temp");
      tempEl.textContent = "Temperature: " + parseInt(data.main.temp) + "°F";
      let humidityEl = document.querySelector("#humidity");
      humidityEl.textContent =
        "Humidity: " + parseInt(data.main.humidity) + "%";
      let windEl = document.querySelector("#windspeed");
      windEl.textContent = "Wind Speed: " + parseInt(data.wind.speed) + "MPH";
      let lat = parseInt(data.coord.lat);
      let lon = parseInt(data.coord.lon);

      let uvIndexUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&exclude = current, minutely, hourly" +
        "appid=" +
        apikey;

      fetch(uvIndexUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          uvIndexNumber = parseInt(data.value);
          let uvIndexEl = document.querySelector("#uvindex");
          uvIndexEl.textContent = "UV Index: " + uvIndexNumber;

          if (uvIndexNumber < 4) {
            uvIndexEl.classList.add("favorable");
          } else if (uvIndexNumber >= 4 && uvIndexNumber <= 7) {
            uvIndexEl.classList.add("moderate");
          } else {
            uvIndexEl.classList.add("severe");
          }
        });
      fiveDayAPICall({ lat, lon });
    });
}

// To get five-day forecast weather
function fiveDayAPICall({ lat, lon }) {
  let fiveDayAPI =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon;
  "&exclude=" + hourly, daily;
  "&appid=" + apikey;

  fetch(fiveDayAPI)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // let data = data;
      let arrayList = data.list;

      // For each loop to get the data for each day from the array
      arrayList.forEach((dayObject) => {
        let noon = dayObject.dt_txt.includes("12:00:00");
        if (noon) {
          // setting variables to put into the document
          let date = dayObject.dt_txt.split(" ")[0];
          let temp = dayObject.main.temp;
          let humidity = dayObject.main.humidity;
          let icon = dayObject.weather[0].icon;
          let iconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
          let forecast = document.querySelector(".forecastWrapper");
          let dayForecastData = document.createElement("div");
          dayForecastData.className = "forecast_box";

          dayForecastData.innerHTML = `<P class = "forecast_date">${date}</p> <img src="${iconUrl}"><p class="forecast_temp">Temp:${temp} F</p> <p class="forecast_humidity">Humidity:${humidity}%</p>`;

          forecast.appendChild(dayForecastData);
        }
      });
    });
}

// To clear out the previous 5 day data if another city is searched for

function clear5Day() {
  let forecast = document.querySelector(".forecastWrapper");
  forecast.innerHTML = "";
}

// Onclick event to add to the city list

$("#searchBtn").on("click", function () {
  event.preventDefault();
  let cityEntered = $("#citySearched").val().toUpperCase().trim();

  // Create an Li element if value of city entered is not equal to ""

  if (cityEntered !== "") {
    console.log("city button is working");
    citiesListWrapper.innerHTML = "";
    searchHisArray.push(cityEntered);

    // To add the cities array to local storage
    localStorage.setItem("cityEntered", JSON.stringify(searchHisArray));

    // To create an li and append to the ul for every city in the array

    searchHisArray.forEach((city) => {
      let li = document.createElement("li");
      li.classList.add("cityListItem");
      let button = document.createElement("button");
      button.innerHTML = city;
      li.appendChild(button);
      citiesListWrapper.appendChild(li);
    });

    // To clear the 5 day forecast from before when a city is clicked

    clear5Day();

    apiCall(cityEntered);
  }
});
