// Import the necessary modules
const axios = require("axios");
const router = require("express").Router();

// User provides this info
const location = "London";
const date = "2023-07-18";

// This is for the function
const apiKey = process.env.WEATHER_API_KEY;
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&dt=${new Date(date).getTime() / 1000}&units=imperial&appid=${apiKey}`;

// Route to get weather data based on user-provided location and date
router.get("/weather", async (req, res) => {
    // Extract the location and date from the query parameters
    const { location, date } = req.query;

    try {
        // Check if both location and date are provided; if not, return a 400 error
        if (!location || !date) {
            return res.status(400).json({ error: "Location and date are required." })
        }

        // Fetch weather data from the OpenWeatherMap API using Axios
        const response = await axios.get(weatherUrl);
        const weatherData = response.data;

        // Format the weather data to extract relevant information
        const formattedWeatherData = {
            location: weatherData.name,
            date: new Date(weatherData.dt * 1000).toISOString().slice(0, 10),
            temperature: weatherData.main.temp,
            humidity: weatherData.main.humidity,
            wind_speed: weatherData.wind.speed,
            weather_icon: `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`,
        };

        // Send the formatted weather data as a JSON response
        res.json(formattedWeatherData);
    } catch (error) {
        // If there's an error while fetching weather data, log the error and return a 500 error
        console.error("Error fetching weather data:", error.message);
        res.status(500).json({ error: "Internal Server Error - please contact the developers to fix." })
    }
});

// Export the router to make it accessible from other files
module.exports = router;
