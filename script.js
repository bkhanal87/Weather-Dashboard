let apikey = "ca77d6416875b9f8966e57181ce172b4";
// let currentDate = moment().format("MM/DD/YYYY");
let unit = "imperial";
let citiesListWrapper = document.querySelector("#citiesList");
let cityBtns = document.querySelector(".city-button");

let searchHisArray = JSON.parse(localStorage.getItem("citySearched")) || [];

function onPageLoad() {
    searchHisArray.forEach((city) => {
        let li = document.createElement("li");
        li.classList.add("cityListItem");
        let button = document.createElement("btn");
        button.classList.add("city-button");
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



