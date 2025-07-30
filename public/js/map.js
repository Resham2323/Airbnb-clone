console.log("Geoapify Map Loaded");

// Assuming you have MAP_TOKEN available (e.g., injected from EJS)
const locationInput = document.getElementById("location");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");
const countryInput = document.getElementById("country");
const selectedLocation = document.getElementById("selectedLocation");

const autocomplete = new autocomplete.GeocoderAutocomplete(locationInput, 'YOUR_API_KEY', {
  placeholder:"Enter a location",
  limit:3,
});
// On location selection
autocomplete.on("select", (location) => {
  if (location && location.properties) {
    const { lat, lon, country, formatted } = location.properties;

    // Set values in form
    latitudeInput.value = lat;
    longitudeInput.value = lon;
    countryInput.value = country;
    selectedLocation.innerText = `📍 ${formatted}`;

    // Update map if marker and map exist
    if (window.previewMarker && window.map) {
      previewMarker.setLatLng([lat, lon])
        .setPopupContent(`📍 ${formatted}`)
        .openPopup();
      map.setView([lat, lon], 13);
    }
  }
});

// Clear coordinates when input is cleared
input.addEventListener("input", () => {
  if (!input.value.trim()) {
    latitudeInput.value = "";
    longitudeInput.value = "";
    countryInput.value = "";
    selectedLocation.innerText = "";
  }
});

