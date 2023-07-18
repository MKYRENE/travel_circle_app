const router = require("express").Router();


// User provides this info
const location = "London";
const date = "2023-07-18";

// This is for the function
const apiKey = WEATHER_API_KEY;
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&dt=${new Date(date).getTime() / 1000}&units=imperial&appid=${apiKey}`;
const weatherInfoEl = document.getElementById("weather-info");
const weatherIconEl = document.getElementById("weather-icon");

function fetchWeatherData(location) {
    fetch(weatherUrl)
        .then((response) => response.json())
        .then((weatherData) => {
            weatherIconEl.innerHTML = `<img src="https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" alt="Weather Icon">`;
            weatherInfoEl.innerHTML = `
            <p>Location: ${weatherData.name}</p>
            <p>Date: ${weatherData.date}</p>
            <p>Temperature: ${weatherData.main.temp}</p>
            <p>Humidity: ${weatherData.main.humidity}</p>
            <p>Wind Speed: ${weatherData.wind.speed}</p>
            `;
        })
        .catch((error) => console.error("Error:", error));
}

module.exports = router;