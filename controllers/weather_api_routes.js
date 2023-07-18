const axios = require("axios");
const router = require("express").Router();


// User provides this info
const location = "London";
const date = "2023-07-18";

// This is for the function
const apiKey = WEATHER_API_KEY;
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&dt=${new Date(date).getTime() / 1000}&units=imperial&appid=${apiKey}`;
const weatherInfoEl = document.getElementById("weather-info");
const weatherIconEl = document.getElementById("weather-icon");


router.get("/weather", async (req, res) => {
    const { location, date } = req.query;

    try {
        if (!location || !date) {
            return res.status(400).json({ error: "Location and date are required." })
        }

        const response = await axios.get(weatherUrl);
        const weatherData = response.data;

        const formattedWeatherData = {
            location: weatherData.name,
            date: new Date(weatherData.dt * 1000).toISOString().slice(0, 10),
            temperature: weatherData.main.temp,
            humidity: weatherData.main.humidity,
            wind_speed: weatherData.wind.speed,
            weather_icon: `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`,
        };

        res.json(formattedWeatherData);
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        res.status(500).json({ error: "Internal Server Error - please contact the developers to fix." })
    }
});

module.exports = router;