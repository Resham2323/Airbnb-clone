// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    const lat = document.getElementById("latitude").value;
    const lon = document.getElementById("longitude").value;
    console.log("Submitting lat/lon:", lat, lon);
    if (!lat || !lon) {
      e.preventDefault();
      alert("Please select a location from the suggestions so coordinates can be set.");
    }
  });
});