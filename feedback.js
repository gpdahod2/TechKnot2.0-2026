// ------------------------------------------------------------------
// TECHNOT 2.0 — Feedback form submission to Google Sheets
// ------------------------------------------------------------------
(function () {
  var SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz_J6yn2TUO_MriPrHB8QZ8yp38v_QtLuhF9lx7sB6sfdh-ryEW4j94xzNTnmPOtyxH3g/exec";

  var form = document.getElementById("technot-feedback-form");
  if (!form) return;

  var successBox = document.getElementById("feedback-success");
  var submitBtn = document.getElementById("submit-feedback");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var nameGroup = document.getElementById("feedback-name").closest(".input-group");
    var msgGroup = document.getElementById("feedback-message").closest(".input-group");
    nameGroup.classList.remove("has-error");
    msgGroup.classList.remove("has-error");

    var name = document.getElementById("feedback-name").value.trim();
    var message = document.getElementById("feedback-message").value.trim();

    var valid = true;
    if (!name) {
      nameGroup.classList.add("has-error");
      nameGroup.querySelector(".error-msg").textContent = "NAME IS REQUIRED";
      valid = false;
    }
    if (!message) {
      msgGroup.classList.add("has-error");
      msgGroup.querySelector(".error-msg").textContent = "FEEDBACK IS REQUIRED";
      valid = false;
    }
    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.querySelector(".btn-text").textContent = "SENDING...";

    fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ name: name, message: message })
    })
      .then(function () {
        form.style.display = "none";
        successBox.style.display = "block";
      })
      .catch(function (err) {
        console.error("Feedback submit failed:", err);
        submitBtn.disabled = false;
        submitBtn.querySelector(".btn-text").textContent = "SEND FEEDBACK";
        alert("Something went wrong. Please try again.");
      });
  });
})();
