console.log("Map script Loaded");
console.log("autocomplete location selected:",location);
const input = document.getElementById("location");
const apiKey = process.env.MAP_TOKEN; // replace with your key


const autocomplete = new GeocoderAutocomplete(input, apiKey, {
  type: "city",
  lang: "en",
});

autocomplete.on("select", (location) => {
  console.log("Selected Location:", location);
  const { lat, lon, formatted } = location.properties;

  document.getElementById("latitude").value = lat;
  document.getElementById("longitude").value = lon;
  document.getElementById("selectedLocation").textContent = formatted;
  console.log( "Formatted",formatted)

  // ⬇️ Only update the existing marker
  window.previewMarker.setLatLng([lat, lon])
    .setPopupContent(`📍 ${formatted}`)
    .openPopup();

  map.setView([lat, lon], 13);

});

