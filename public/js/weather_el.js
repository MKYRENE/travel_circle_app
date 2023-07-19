document.addEventListener("DOMContentLoaded", () => {
    const postForm = document.getElementById("postForm");
    const location = prompt("Enter location:");
    const date = prompt("Enter date (YYYY-MM-DD):");

    function fetchWeatherData(city, date) {
        const apiUrl = `/api/weather?location=${encodeURIComponent(city)}&date=${encodeURIComponent(date)}`;
        return fetch(apiUrl)
            .then((response) => response.json())
            .catch((error) => {
                console.error("Error fetching weather data:", error.message);
                return null;
            });
    }

    function displayNewPost(postData, weatherData) {
        const mainSection = document.querySelector(".post");

        const postElement = document.createElement("div");
        postElement.classList.add("post");

        // Display the content of the new post
        postElement.innerHTML = `
          <p>${postData.text}</p>
          <div class="map">
            <!-- Add any additional content for the post here (if needed) -->
          </div>
          <div class="weather">
            <img src="${weatherData.weather_icon}" alt="Weather Icon">
            <p>Location: ${weatherData.location}</p>
            <p>Date: ${weatherData.date}</p>
            <p>Temperature: ${weatherData.temperature} °F</p>
            <p>Humidity: ${weatherData.humidity} %</p>
            <p>Wind Speed: ${weatherData.wind_speed} mph</p>
          </div>
        `;

        // Add the new post to the main section
        mainSection.appendChild(postElement);
    }

    function displayFeed(feedData) {
        feedData.forEach((post) => {
            displayNewPost(post, post.weatherData);
        });
    }

    postForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Get the user's input from the form
        const formData = new FormData(postForm);
        const postContent = formData.get("text");
        const postDate = formData.get("date");
        const postLocation = formData.get("location");

        fetchWeatherData(postLocation, postDate)
            .then((weatherData) => {
                if (weatherData) {
                    const newPost = { text: postContent };

                    // Display the new post in the feed along with weather information
                    displayNewPost(newPost, weatherData);

                    postForm.reset();
                }
            });
    });

    fetchWeatherData(location, date)
        .then((data) => {
            if (data) {
                const feedData = [data];

                displayFeed(feedData);
            }
        });
});
