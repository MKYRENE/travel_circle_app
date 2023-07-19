document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/weather?location=London&date=2023-07-18")
        .then((response) => response.json())
        .then((data) => {
            const weatherDataDiv = document.getElementById("weatherData");
            weatherDataDiv.innerHTML = `
          <p>Location: ${data.location}</p>
          <p>Date: ${data.date}</p>
          <p>Temperature: ${data.temperature} °F</p>
          <p>Humidity: ${data.humidity} %</p>
          <p>Wind Speed: ${data.wind_speed} mph</p>
          <img src="${data.weather_icon}" alt="Weather Icon">
        `;
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error.message);
        });
});
