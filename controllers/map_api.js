// Import the Express router module to create routes
const router = require("express").Router();
// Immediately-invoked function expression (IIFE) to encapsulate the code and avoid polluting the global scope
(function () {
    // Retrieve the Mapbox API key stored in the environment variable MAP_API_KEY
    var mapBoxKey = MAP_API_KEY


    // Initialize the map using the Mapbox API key    
    mapboxgl.accessToken = mapBoxKey;
    var map = new mapboxgl.Map({
        container: "map", // The container ID where the map will be rendered
        style: "mapbox://styles/mapbox/streets-v11", // The map style URL
        center: [-95.7129, 37.0902], // Set the initial center of the map
        zoom: 3, // Set the initial zoom level of the map
    });

    // Add a navigation control to the top-right corner of the map
    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, "top-right");


    // Function to handle geocoding(converting search query to coordinates)
    function geocode(query) {
        var geocoder = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(query) + '.json?access_token=' + mapboxgl.accessToken;

        // Fetch the geocoding data from the Mapbox Geocoding API
        fetch(geocoder)
            .then(response => response.json())
            .then(data => {
                if (data.features.length > 0) {
                     // If at least one location is found, extract the coordinates of the first result
                    var location = data.features[0].center;
                    // Fly the map to the searched location with a zoom level of 14
                    map.flyTo({
                        center: location,
                        zoom: 14
                    });

                    // Add a marker at the searched location on the map
                    var marker = new mapboxgl.Marker().setLngLat(location).addTo(map);
                } else {
                    // If no locaiton is found, display an alert to the user 
                    alert('Location not found. Please try a different search term.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Event listener for search button click
    document.getElementById('search-button').addEventListener('click', function () {
        var query = document.getElementById('search-input').value;
        geocode(query);
    });

    // Event listener for pressing 'Enter' key in the search box
    document.getElementById('search-input').addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            var query = document.getElementById('search-input').value;
            // Call the geocode function with the user's search query
            geocode(query);
        }
    });


});
// Export the router to make it accessible from other files
module.exports = router;