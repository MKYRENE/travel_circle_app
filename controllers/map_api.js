const router = require("express").Router();

$(function () {
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
  
    // Store the map markers in an array
    var markers = [];
  
    // Function to add markers to the map
    function addMarkers(venues) {
      venues.forEach(function (venue) {
        var marker = new mapboxgl.Marker()
          .setLngLat(venue.coordinates.split(","))
          .addTo(map)
          .setPopup(
            new mapboxgl.Popup().setHTML(
              "<h3><b>" +
                venue.name +
                "</b></h3>" +
                "<p>Date: " +
                venue.date +
                "</p>" +
                "<p>Time: " +
                venue.time +
                "</p>" +
                "<p>Address: " +
                venue.address +
                "</p>" +
                '<p><a href="' +
                venue.url +
                '" target="_blank">Event Details</a></p>'
            )
          );
  
        markers.push(marker);
      });
  
      // Set bounding box to snap map to markers on submit
      var bounds = new mapboxgl.LngLatBounds();
      markers.forEach(function (marker) {
        bounds.extend(marker.getLngLat());
      });
      console.log(bounds);
      map.fitBounds(bounds, { padding: 50 });
    }
  
    // Function to remove markers from the map
    function removeMarkers() {
      markers.forEach(function (marker) {
        marker.remove();
      });
      markers = [];
    }
});

module.exports = router;