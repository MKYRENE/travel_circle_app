mapboxgl.accessToken = 'pk.eyJ1IjoiamVyZW15dGJveWVyIiwiYSI6ImNsaXYwa3EzODAzamIzZm53ajAzOG13eGUifQ.2OBZgtgqI-ZgvNqhPN1iFw';

// Initialize the map
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-74.5, 40], // Longitude, Latitude
  zoom: 9, // Zoom level
});

// Add a search control
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
});

// Add the search control to the map
map.addControl(geocoder);

// Listen for the 'result' event when a search result is selected
geocoder.on('result', (e) => {
  console.log(e.result); // The selected search result
});

