const router = require("express").Router();

(function () {
    var mapBoxKey = MAP_API_KEY


    // Initialize the map
    mapboxgl.accessToken = mapBoxKey;
    var map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-95.7129, 37.0902], // Set the initial center of the map
        zoom: 3, // Set the initial zoom level of the map
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, "top-right");


    // Function to handle search
    function geocode(query) {
        var geocoder = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(query) + '.json?access_token=' + mapboxgl.accessToken;

        fetch(geocoder)
            .then(response => response.json())
            .then(data => {
                if (data.features.length > 0) {
                    var location = data.features[0].center;
                    map.flyTo({
                        center: location,
                        zoom: 14
                    });

                    // Add a marker at the searched location
                    var marker = new mapboxgl.Marker().setLngLat(location).addTo(map);
                } else {
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
            geocode(query);
        }
    });


});

module.exports = router;