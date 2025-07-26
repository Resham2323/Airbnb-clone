const autocomplete = new GeocoderAutocomplete(
  document.getElementById("autocomplete"),
  "b64015e75aff4a0fa6611a0c27e86a83",
  { placeholder: "Search location..." }
);

const map = L.map("map").setView([28.6139, 77.2090], 12); 
L.tileLayer("https://tile.geoapify.com/v1/tile/osm-liberty/{z}/{x}/{y}.png?apiKey=b64015e75aff4a0fa6611a0c27e86a83", {
     attribution: '© OpenStreetMap contributors',
 }).addTo(map);



const circle = L.circle([28.6139, 77.2090], {
  radius: 3000,
  color: "coral",
  fillColor: "coral",
  fillOpacity: 0.3,     // This ensures it’s visibly filled
  weight: 2   
}).addTo(map);
console.log(circle);

const marker = L.marker([28.6139, 77.2090]).addTo(map);


autocomplete.on("select", (location) => {
  const { lat, lon, country, formatted } = location.properties;

  marker.setLatLng([lat, lon]);
  map.setView([lat, lon], 14);
  marker.bindPopup(`📍 ${formatted}`).openPopup();


  document.querySelector("#location").value = formatted;
  document.querySelector("#latitude").value = lat;
  document.querySelector("#longitude").value = lon;
  document.querySelector("#country").value = country;
});