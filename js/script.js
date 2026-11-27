// Wait until the HTML document is fully loaded before looking for elements
document.addEventListener("DOMContentLoaded", function () {
  var feedbackForm = document.getElementById("feedback-form");
  var thanksBox = document.getElementById("feedback-thanks");
  var thanksText = document.getElementById("feedback-thanks-text");

  // Only run the feedback form handler on pages that contain the form
  if (feedbackForm && thanksBox && thanksText) {
    feedbackForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var nameInput = document.getElementById("visitor-name");
      var topicSelect = document.getElementById("feedback-topic");
      var selectedRating = feedbackForm.querySelector('input[name="rating"]:checked');

      var visitorName = nameInput ? nameInput.value.trim() : "friend";
      var topic = topicSelect && topicSelect.value ? topicSelect.value : "your visit";
      var rating = selectedRating ? selectedRating.value : "5";

      thanksText.textContent =
        "Thanks so much, " +
        (visitorName || "friend") +
        "! We received your " +
        rating +
        "/5 rating about \"" +
        topic +
        "\" and can't wait to see you at the game tables again soon.";

      thanksBox.hidden = false;
      feedbackForm.reset();
    });
  }
});
