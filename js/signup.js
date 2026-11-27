(function () {
  "use strict";

  const REGISTRATIONS_KEY = "rollAndBrew_registrations";
  const VALID_PROMO_CODE = "ROLL10";
  const PROMO_DISCOUNT_RATE = 0.1;
  const MIN_PLAYERS = 1;
  const MAX_PLAYERS = 6;

  const events = Array.isArray(window.ROLL_AND_BREW_EVENTS)
    ? window.ROLL_AND_BREW_EVENTS
    : [];

  const els = {
    form: document.getElementById("signupForm"),
    fullName: document.getElementById("fullName"),
    fullNameError: document.getElementById("fullNameError"),
    email: document.getElementById("email"),
    emailError: document.getElementById("emailError"),
    phone: document.getElementById("phone"),
    phoneError: document.getElementById("phoneError"),
    eventSelect: document.getElementById("eventSelect"),
    eventSelectError: document.getElementById("eventSelectError"),
    fullEventAlert: document.getElementById("fullEventAlert"),
    playersMinus: document.getElementById("playersMinus"),
    playersPlus: document.getElementById("playersPlus"),
    playersCount: document.getElementById("playersCount"),
    spotsHint: document.getElementById("spotsHint"),
    playersError: document.getElementById("playersError"),
    promoCode: document.getElementById("promoCode"),
    applyPromoBtn: document.getElementById("applyPromoBtn"),
    promoError: document.getElementById("promoError"),
    promoSuccess: document.getElementById("promoSuccess"),
    agreeRules: document.getElementById("agreeRules"),
    agreeRulesError: document.getElementById("agreeRulesError"),
    submitBtn: document.getElementById("submitBtn"),
    noEventSelectedMsg: document.getElementById("noEventSelectedMsg"),
    summaryContent: document.getElementById("summaryContent"),
    summaryEventType: document.getElementById("summaryEventType"),
    summaryEventTitle: document.getElementById("summaryEventTitle"),
    summaryEventMeta: document.getElementById("summaryEventMeta"),
    summarySpotsStatus: document.getElementById("summarySpotsStatus"),
    summaryEntryFee: document.getElementById("summaryEntryFee"),
    summaryPlayers: document.getElementById("summaryPlayers"),
    summarySubtotal: document.getElementById("summarySubtotal"),
    summaryPromoTag: document.getElementById("summaryPromoTag"),
    summaryDiscount: document.getElementById("summaryDiscount"),
    summaryTotal: document.getElementById("summaryTotal"),
    summaryWaitlistNote: document.getElementById("summaryWaitlistNote"),
    confirmationModal: document.getElementById("confirmationModal"),
    confirmationModalLabel: document.getElementById("confirmationModalLabel"),
    confirmationModalBody: document.getElementById("confirmationModalBody")
  };

  const state = {
    players: 1,
    appliedPromo: null,
    discountRate: 0,
    touched: {
      fullName: false,
      email: false,
      phone: false,
      eventSelect: false,
      players: false,
      agreeRules: false
    }
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatEventDate(isoString) {
    return new Date(isoString).toLocaleString("en-PK", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }

  function formatFee(amount) {
    return "Rs. " + Number(amount).toLocaleString("en-PK");
  }

  function getSelectedEvent() {
    const selectedId = Number(els.eventSelect.value);
    if (!els.eventSelect.value || Number.isNaN(selectedId)) {
      return null;
    }
    return events.find((item) => item.id === selectedId) || null;
  }

  function populateEventDropdown() {
    const fragment = document.createDocumentFragment();
    events.forEach((item) => {
      const option = document.createElement("option");
      option.value = String(item.id);
      const statusSuffix =
        item.spotsLeft === 0
          ? "Full — Waitlist"
          : `${item.spotsLeft} ${item.spotsLeft === 1 ? "spot" : "spots"} left`;
      option.textContent = `${item.title} (${formatFee(item.fee)} • ${statusSuffix})`;
      fragment.appendChild(option);
    });
    els.eventSelect.appendChild(fragment);
  }

  function preselectEventFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const eventParam = params.get("event");
    if (!eventParam) return;

    const matchingEvent = events.find(
      (item) => String(item.id) === String(eventParam).trim()
    );
    if (matchingEvent) {
      els.eventSelect.value = String(matchingEvent.id);
      state.touched.eventSelect = true;
    }
  }

  function setFieldError(inputEl, errorEl, message) {
    errorEl.textContent = message;
    if (inputEl) {
      inputEl.classList.toggle("is-invalid", Boolean(message));
    }
  }

  function validateFullName(showError) {
    const value = els.fullName.value.trim();
    const message = value ? "" : "Full name is required.";
    if (showError) {
      setFieldError(els.fullName, els.fullNameError, message);
    }
    return !message;
  }

  function validateEmail(showError) {
    const value = els.email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    let message = "";
    if (!value) {
      message = "Email address is required.";
    } else if (!emailPattern.test(value)) {
      message = "Please enter a valid email address.";
    }
    if (showError) {
      setFieldError(els.email, els.emailError, message);
    }
    return !message;
  }

  function validatePhone(showError) {
    const value = els.phone.value.trim();
    const phonePattern = /^03\d{2}\s\d{7}$/;
    let message = "";
    if (!value) {
      message = "Phone number is required.";
    } else if (!phonePattern.test(value)) {
      message = "Use format 03xx xxxxxxx (e.g. 0300 1234567).";
    }
    if (showError) {
      setFieldError(els.phone, els.phoneError, message);
    }
    return !message;
  }

  function validateEvent(showError) {
    const selectedEvent = getSelectedEvent();
    const message = selectedEvent ? "" : "Please select an event.";
    if (showError) {
      setFieldError(els.eventSelect, els.eventSelectError, message);
    }
    return !message;
  }

  function validatePlayers(showError) {
    const selectedEvent = getSelectedEvent();
    let message = "";

    if (state.players < MIN_PLAYERS || state.players > MAX_PLAYERS) {
      message = `Number of players must be between ${MIN_PLAYERS} and ${MAX_PLAYERS}.`;
    } else if (
      selectedEvent &&
      selectedEvent.spotsLeft > 0 &&
      state.players > selectedEvent.spotsLeft
    ) {
      message = `Only ${selectedEvent.spotsLeft} ${
        selectedEvent.spotsLeft === 1 ? "spot" : "spots"
      } left for this event.`;
    }

    if (showError) {
      setFieldError(els.playersCount, els.playersError, message);
    }
    return !message;
  }

  function validateAgreeRules(showError) {
    const isChecked = els.agreeRules.checked;
    const message = isChecked
      ? ""
      : "You must agree to the café rules before submitting.";
    if (showError) {
      setFieldError(els.agreeRules, els.agreeRulesError, message);
    }
    return !message;
  }

  function updateStepperUi() {
    els.playersCount.value = String(state.players);
    els.playersMinus.disabled = state.players <= MIN_PLAYERS;
    els.playersPlus.disabled = state.players >= MAX_PLAYERS;

    const selectedEvent = getSelectedEvent();
    if (!selectedEvent) {
      els.spotsHint.textContent = "1 to 6 players per booking.";
    } else if (selectedEvent.spotsLeft === 0) {
      els.spotsHint.textContent = "Waitlist booking for 1 to 6 players.";
    } else {
      els.spotsHint.textContent = `${selectedEvent.spotsLeft} ${
        selectedEvent.spotsLeft === 1 ? "spot" : "spots"
      } remaining (max 6 per booking).`;
    }
  }

  function calculatePricing(selectedEvent) {
    if (!selectedEvent) {
      return {
        entryFee: 0,
        subtotal: 0,
        discount: 0,
        total: 0
      };
    }

    const entryFee = Number(selectedEvent.fee);
    const subtotal = entryFee * state.players;
    const discount =
      state.appliedPromo === VALID_PROMO_CODE
        ? Math.round(subtotal * state.discountRate)
        : 0;
    const total = subtotal - discount;

    return { entryFee, subtotal, discount, total };
  }

  function updateEventAndSummaryUi() {
    const selectedEvent = getSelectedEvent();
    const isFull = Boolean(selectedEvent && selectedEvent.spotsLeft === 0);

    els.fullEventAlert.classList.toggle("d-none", !isFull);
    els.submitBtn.textContent = isFull ? "Join waitlist" : "Complete Sign-up";
    els.submitBtn.classList.toggle("btn-waitlist-mode", isFull);

    if (!selectedEvent) {
      els.noEventSelectedMsg.classList.remove("d-none");
      els.summaryContent.classList.add("d-none");
      updateStepperUi();
      return;
    }

    els.noEventSelectedMsg.classList.add("d-none");
    els.summaryContent.classList.remove("d-none");

    els.summaryEventType.textContent = selectedEvent.type;
    els.summaryEventTitle.textContent = selectedEvent.title;
    els.summaryEventMeta.textContent = `${selectedEvent.game} • ${formatEventDate(
      selectedEvent.date
    )}`;

    els.summarySpotsStatus.classList.remove("is-full", "is-low");
    if (isFull) {
      els.summarySpotsStatus.textContent = "This event is full (Waitlist open)";
      els.summarySpotsStatus.classList.add("is-full");
    } else if (selectedEvent.spotsLeft <= 4) {
      els.summarySpotsStatus.textContent = `${selectedEvent.spotsLeft} ${
        selectedEvent.spotsLeft === 1 ? "spot" : "spots"
      } left`;
      els.summarySpotsStatus.classList.add("is-low");
    } else {
      els.summarySpotsStatus.textContent = `${selectedEvent.spotsLeft} spots available`;
    }

    const pricing = calculatePricing(selectedEvent);
    els.summaryEntryFee.textContent = formatFee(pricing.entryFee);
    els.summaryPlayers.textContent = String(state.players);
    els.summarySubtotal.textContent = formatFee(pricing.subtotal);

    if (state.appliedPromo === VALID_PROMO_CODE) {
      els.summaryPromoTag.textContent = "ROLL10 (10% off)";
      els.summaryPromoTag.classList.remove("d-none");
      els.summaryDiscount.textContent = `- ${formatFee(pricing.discount)}`;
    } else {
      els.summaryPromoTag.textContent = "";
      els.summaryPromoTag.classList.add("d-none");
      els.summaryDiscount.textContent = "Rs. 0";
    }

    els.summaryTotal.textContent = formatFee(pricing.total);
    els.summaryWaitlistNote.classList.toggle("d-none", !isFull);

    updateStepperUi();
  }

  function handleApplyPromo() {
    const rawCode = els.promoCode.value.trim().toUpperCase();

    if (rawCode === VALID_PROMO_CODE) {
      state.appliedPromo = VALID_PROMO_CODE;
      state.discountRate = PROMO_DISCOUNT_RATE;
      setFieldError(els.promoCode, els.promoError, "");
      els.promoSuccess.textContent = "Code ROLL10 applied — 10% discount active!";
    } else {
      state.appliedPromo = null;
      state.discountRate = 0;
      els.promoSuccess.textContent = "";
      setFieldError(
        els.promoCode,
        els.promoError,
        rawCode
          ? "Invalid promo code. Enter ROLL10 for 10% off."
          : "Please enter a promo code before applying."
      );
    }

    updateEventAndSummaryUi();
  }

  function saveRegistration(registration) {
    try {
      const existingRaw = window.localStorage.getItem(REGISTRATIONS_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const list = Array.isArray(existing) ? existing : [];
      list.push(registration);
      window.localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(list));
    } catch (_err) {
      // Ignore storage errors if localStorage is restricted
    }
  }

  function showConfirmationModal(registration) {
    const isWaitlist = registration.status === "waitlist";
    els.confirmationModalLabel.textContent = isWaitlist
      ? "Waitlist Request Confirmed"
      : "Registration Confirmed!";

    const promoLine = registration.promoCode
      ? `<li><span>Promo (${escapeHtml(registration.promoCode)})</span><strong>- ${escapeHtml(
          formatFee(registration.discount)
        )}</strong></li>`
      : "";

    els.confirmationModalBody.innerHTML = `
      <p class="mb-2">
        ${
          isWaitlist
            ? "You have been added to the waitlist. We will contact you if spots open up."
            : "Your table seat is reserved! Show your booking reference at the café counter."
        }
      </p>
      <ul class="modal-summary-list">
        <li><span>Reference ID</span><strong>${escapeHtml(registration.id)}</strong></li>
        <li><span>Name</span><strong>${escapeHtml(registration.fullName)}</strong></li>
        <li><span>Email</span><strong>${escapeHtml(registration.email)}</strong></li>
        <li><span>Phone</span><strong>${escapeHtml(registration.phone)}</strong></li>
        <li><span>Event</span><strong>${escapeHtml(registration.eventTitle)}</strong></li>
        <li><span>Date</span><strong>${escapeHtml(formatEventDate(registration.eventDate))}</strong></li>
        <li><span>Players</span><strong>${escapeHtml(registration.players)}</strong></li>
        ${promoLine}
        <li><span>Total Fee</span><strong>${escapeHtml(formatFee(registration.total))}</strong></li>
      </ul>
    `;

    if (window.bootstrap && window.bootstrap.Modal) {
      const modalInstance = window.bootstrap.Modal.getOrCreateInstance(
        els.confirmationModal
      );
      modalInstance.show();
    }
  }

  function resetFormState() {
    els.form.reset();
    state.players = 1;
    state.appliedPromo = null;
    state.discountRate = 0;
    Object.keys(state.touched).forEach((key) => {
      state.touched[key] = false;
    });

    setFieldError(els.fullName, els.fullNameError, "");
    setFieldError(els.email, els.emailError, "");
    setFieldError(els.phone, els.phoneError, "");
    setFieldError(els.eventSelect, els.eventSelectError, "");
    setFieldError(els.playersCount, els.playersError, "");
    setFieldError(els.promoCode, els.promoError, "");
    setFieldError(els.agreeRules, els.agreeRulesError, "");
    els.promoSuccess.textContent = "";

    updateEventAndSummaryUi();
  }

  function bindEvents() {
    els.fullName.addEventListener("input", () => {
      state.touched.fullName = true;
      validateFullName(true);
    });
    els.fullName.addEventListener("blur", () => {
      state.touched.fullName = true;
      validateFullName(true);
    });

    els.email.addEventListener("input", () => {
      state.touched.email = true;
      validateEmail(true);
    });
    els.email.addEventListener("blur", () => {
      state.touched.email = true;
      validateEmail(true);
    });

    els.phone.addEventListener("input", () => {
      state.touched.phone = true;
      validatePhone(true);
    });
    els.phone.addEventListener("blur", () => {
      state.touched.phone = true;
      validatePhone(true);
    });

    els.eventSelect.addEventListener("change", () => {
      state.touched.eventSelect = true;
      validateEvent(true);
      updateEventAndSummaryUi();
      validatePlayers(true);
    });

    els.playersMinus.addEventListener("click", () => {
      if (state.players > MIN_PLAYERS) {
        state.players -= 1;
        state.touched.players = true;
        updateEventAndSummaryUi();
        validatePlayers(true);
      }
    });

    els.playersPlus.addEventListener("click", () => {
      if (state.players < MAX_PLAYERS) {
        state.players += 1;
        state.touched.players = true;
        updateEventAndSummaryUi();
        validatePlayers(true);
      }
    });

    els.applyPromoBtn.addEventListener("click", handleApplyPromo);

    els.promoCode.addEventListener("input", () => {
      const normalized = els.promoCode.value.trim().toUpperCase();
      if (state.appliedPromo && normalized !== state.appliedPromo) {
        state.appliedPromo = null;
        state.discountRate = 0;
        els.promoSuccess.textContent = "";
        updateEventAndSummaryUi();
      }
      if (els.promoError.textContent) {
        setFieldError(els.promoCode, els.promoError, "");
      }
    });

    els.promoCode.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleApplyPromo();
      }
    });

    els.agreeRules.addEventListener("change", () => {
      state.touched.agreeRules = true;
      validateAgreeRules(true);
    });

    els.form.addEventListener("submit", (event) => {
      event.preventDefault();

      Object.keys(state.touched).forEach((key) => {
        state.touched[key] = true;
      });

      const checks = [
        { valid: validateFullName(true), el: els.fullName },
        { valid: validateEmail(true), el: els.email },
        { valid: validatePhone(true), el: els.phone },
        { valid: validateEvent(true), el: els.eventSelect },
        { valid: validatePlayers(true), el: els.playersPlus },
        { valid: validateAgreeRules(true), el: els.agreeRules }
      ];

      const firstInvalid = checks.find((item) => !item.valid);
      if (firstInvalid) {
        firstInvalid.el.focus();
        return;
      }

      const selectedEvent = getSelectedEvent();
      const pricing = calculatePricing(selectedEvent);
      const registration = {
        id: "RB-" + Date.now().toString(36).toUpperCase(),
        eventId: selectedEvent.id,
        eventTitle: selectedEvent.title,
        eventDate: selectedEvent.date,
        fullName: els.fullName.value.trim(),
        email: els.email.value.trim(),
        phone: els.phone.value.trim(),
        players: state.players,
        promoCode: state.appliedPromo,
        entryFee: pricing.entryFee,
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        total: pricing.total,
        status: selectedEvent.spotsLeft === 0 ? "waitlist" : "confirmed",
        submittedAt: new Date().toISOString()
      };

      saveRegistration(registration);
      showConfirmationModal(registration);
      resetFormState();
    });
  }

  function init() {
    populateEventDropdown();
    preselectEventFromUrl();
    bindEvents();
    updateEventAndSummaryUi();
    if (getSelectedEvent()) {
      validatePlayers(true);
    }
  }

  init();
})();
