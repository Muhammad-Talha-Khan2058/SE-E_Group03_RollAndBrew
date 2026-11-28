 /**
 * Roll & Brew — Main Site Script
 * Handles mobile navigation menu toggle and contact form validation & submission.
 */

/* ==========================================================================
   Mobile Navigation Menu Toggle
   ========================================================================== */
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".primary-nav");

if (navToggle && primaryNav) {
  const setMenuOpen = (isOpen) => {
    navToggle.setAttribute("aria-expanded", String(isOpen));
    primaryNav.classList.toggle("is-open", isOpen);
  };

  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!expanded);
  });

  primaryNav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && primaryNav.classList.contains("is-open")) {
      setMenuOpen(false);
      navToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      primaryNav.classList.contains("is-open") &&
      !primaryNav.contains(event.target) &&
      !navToggle.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && primaryNav.classList.contains("is-open")) {
      setMenuOpen(false);
    }
  });
}

/* ==========================================================================
   Contact Form Validation & Local Submission
   ========================================================================== */
const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById("contact-name");
const emailInput = document.getElementById("contact-email");
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const formSuccess = document.getElementById("form-success");

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const updateEmailValidation = (forceCheck = false) => {
  const value = emailInput.value.trim();

  if (value === "") {
    if (forceCheck) {
      emailInput.classList.add("is-invalid");
      if (emailError) emailError.hidden = false;
      return false;
    }
    emailInput.classList.remove("is-invalid");
    if (emailError) emailError.hidden = true;
    return false;
  }

  const valid = isValidEmail(value);
  emailInput.classList.toggle("is-invalid", !valid);
  if (emailError) emailError.hidden = valid;
  return valid;
};

if (contactForm && nameInput && emailInput) {
  nameInput.addEventListener("input", () => {
    if (nameInput.value.trim() !== "") {
      nameInput.classList.remove("is-invalid");
      if (nameError) nameError.hidden = true;
    }
  });

  emailInput.addEventListener("blur", () => {
    if (emailInput.value.trim() !== "") {
      updateEmailValidation(false);
    }
  });

  emailInput.addEventListener("input", () => {
    if (emailInput.value.trim() === "" || isValidEmail(emailInput.value.trim())) {
      emailInput.classList.remove("is-invalid");
      if (emailError) emailError.hidden = true;
    } else if (emailError && !emailError.hidden) {
      updateEmailValidation(false);
    }
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (formSuccess) formSuccess.hidden = true;

    const nameValid = nameInput.value.trim() !== "";
    nameInput.classList.toggle("is-invalid", !nameValid);
    if (nameError) nameError.hidden = nameValid;

    const emailValid = updateEmailValidation(true);

    if (!nameValid) {
      nameInput.focus();
      return;
    }

    if (!emailValid) {
      emailInput.focus();
      return;
    }

    contactForm.reset();
    emailInput.classList.remove("is-invalid");
    if (emailError) emailError.hidden = true;
    nameInput.classList.remove("is-invalid");
    if (nameError) nameError.hidden = true;
    if (formSuccess) formSuccess.hidden = false;
  });
}

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