const input = document.getElementById("location");
const apiKey = process.env.MAP_TOKEN; // replace with your key

const autocomplete = new GeocoderAutocomplete(input, apiKey, {
  type: "city",
  lang: "en",
});

autocomplete.on("select", (location) => {
  const { lat, lon } = location.properties;
  document.getElementById("latitude").value = lat;
  document.getElementById("longitude").value = lon;

  // Optional: Show marker preview on map
  if (window.previewMarker) previewMarker.remove();
  previewMarker = L.marker([lat, lon]).addTo(map)
    .bindPopup(`📍 ${location.properties.formatted}`)
    .openPopup();
  map.setView([lat, lon], 13);
});