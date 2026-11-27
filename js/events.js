(function () {
  "use strict";

  const STORAGE_KEY = "rollAndBrew_interestedEvents";

  const events = [
    {
      id: 1,
      title: "Catan: Settlers Cup",
      type: "Tournament",
      date: "2026-11-29T17:00:00+05:00",
      game: "Catan",
      spotsLeft: 4,
      fee: 1000,
      description: "Three-round Swiss tournament with house-roasted espresso shots between rounds and café vouchers for top finalists.",
      image: "../images/event-catan.jpg",
      imageAlt: "Wooden hexagonal Catan tiles, dice, and resource cards on a warm café table"
    },
    {
      id: 2,
      title: "Dune: Imperium Strategy Showdown",
      type: "Tournament",
      date: "2026-12-19T18:00:00+05:00",
      game: "Dune: Imperium",
      spotsLeft: 0,
      fee: 1200,
      description: "Competitive deck-building and worker placement bracket for seasoned strategists. Full house — waitlist open.",
      image: "../images/event-dune.jpg",
      imageAlt: "Dune Imperium board game cards and wooden tokens arranged next to a coffee mug"
    },
    {
      id: 3,
      title: "Sunday Latte & Ticket to Ride",
      type: "Casual",
      date: "2026-12-02T18:30:00+05:00",
      game: "Ticket to Ride",
      spotsLeft: 9,
      fee: 500,
      description: "Relaxed mid-week railway building across Europe and North America maps. Solo players welcome at shared tables.",
      image: "../images/event-ticket-to-ride.jpg",
      imageAlt: "Colorful plastic train pieces and route cards laid out on a Ticket to Ride board"
    },
    {
      id: 4,
      title: "First-Timers Board Game Mixer",
      type: "Beginner",
      date: "2026-12-05T15:00:00+05:00",
      game: "Azul & Splendor",
      spotsLeft: 12,
      fee: 400,
      description: "Never played modern tabletop games? Our hosts teach quick 20-minute rulesets while you sip a complimentary brew.",
      image: "../images/event-beginner-mixer.jpg",
      imageAlt: "Patterned Azul mosaic tiles and Splendor gem chips prepared for new players"
    },
    {
      id: 5,
      title: "Secret Hitler & Coup Late Night",
      type: "Casual",
      date: "2026-12-08T20:00:00+05:00",
      game: "Secret Hitler",
      spotsLeft: 0,
      fee: 600,
      description: "High-energy social deduction night filled with bluffing, alliances, and iced mocha refills until closing.",
      image: "../images/event-social-deduction.jpg",
      imageAlt: "Envelopes and secret role cards fanned out on a wooden café table"
    },
    {
      id: 6,
      title: "Chess & Chai Blitz Open",
      type: "Tournament",
      date: "2026-12-12T16:00:00+05:00",
      game: "Speed Chess",
      spotsLeft: 2,
      fee: 800,
      description: "Fast-paced 5+3 blitz format paired with bottomless cardamom chai. Clocks and wooden Staunton sets provided.",
      image: "../images/event-chess.jpg",
      imageAlt: "Wooden Staunton chess pieces and a digital chess clock beside a steaming cup of chai"
    },
    {
      id: 7,
      title: "Learn Wingspan with a Game Master",
      type: "Beginner",
      date: "2026-12-15T17:30:00+05:00",
      game: "Wingspan",
      spotsLeft: 6,
      fee: 700,
      description: "Guided playthrough of the award-winning bird-collecting engine builder with step-by-step turn coaching.",
      image: "../images/event-wingspan.jpg",
      imageAlt: "Illustrated bird cards, pastel egg miniatures, and dice tray from Wingspan"
    },
    {
      id: 8,
      title: "Cozy Co-Op Night: Codenames & Pandemic",
      type: "Casual",
      date: "2026-12-23T19:00:00+05:00",
      game: "Codenames & Pandemic",
      spotsLeft: 10,
      fee: 500,
      description: "Team up with fellow café regulars to crack one-word clues or save the world together before the timer runs out.",
      image: "../images/event-coop.jpg",
      imageAlt: "Word clue cards and cooperative board game map pieces under warm café lighting"
    }
  ];

  const state = {
    typeFilter: "All",
    searchQuery: "",
    sortOrder: "soonest",
    interestedIds: loadInterestedIds()
  };

  const els = {
    countdownBanner: document.getElementById("countdownBanner"),
    filterButtons: Array.from(document.querySelectorAll("[data-filter-type]")),
    searchInput: document.getElementById("eventSearch"),
    sortSelect: document.getElementById("sortOrder"),
    resultsSummary: document.getElementById("resultsSummary"),
    eventsGrid: document.getElementById("eventsGrid"),
    noEventsMessage: document.getElementById("noEventsMessage"),
    resetFiltersBtn: document.getElementById("resetFiltersBtn")
  };

  let countdownIntervalId = null;

  function loadInterestedIds() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return new Set();
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? new Set(parsed.map(Number)) : new Set();
    } catch (_err) {
      return new Set();
    }
  }

  function saveInterestedIds() {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(state.interestedIds))
      );
    } catch (_err) {
      // Ignore storage errors when storage is unavailable
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatEventDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString("en-PK", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }

  function formatFee(fee) {
    if (fee === 0) return "Free";
    return "Rs. " + Number(fee).toLocaleString("en-PK");
  }

  function createPlaceholderArt(eventItem) {
    const badgeColor =
      eventItem.type === "Tournament"
        ? "#5C3D2E"
        : eventItem.type === "Casual"
        ? "#D9822B"
        : "#7C5843";

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" role="img" aria-label="${escapeHtml(eventItem.imageAlt)}">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#5C3D2E"/>
            <stop offset="100%" stop-color="#3B2A20"/>
          </linearGradient>
        </defs>
        <rect width="640" height="400" fill="url(#bgGrad)"/>
        <circle cx="530" cy="70" r="95" fill="#C9A27A" fill-opacity="0.16"/>
        <circle cx="110" cy="340" r="120" fill="#D9822B" fill-opacity="0.16"/>
        <rect x="44" y="48" width="552" height="304" rx="22" fill="#FBF5EA" fill-opacity="0.08" stroke="#C9A27A" stroke-opacity="0.45" stroke-width="2"/>
        <g transform="translate(278, 108)">
          <rect x="0" y="0" width="84" height="84" rx="16" fill="${badgeColor}" stroke="#FBF5EA" stroke-width="3"/>
          <circle cx="25" cy="25" r="6" fill="#FBF5EA"/>
          <circle cx="59" cy="25" r="6" fill="#FBF5EA"/>
          <circle cx="42" cy="42" r="6" fill="#FBF5EA"/>
          <circle cx="25" cy="59" r="6" fill="#FBF5EA"/>
          <circle cx="59" cy="59" r="6" fill="#FBF5EA"/>
        </g>
        <text x="320" y="246" text-anchor="middle" fill="#FBF5EA" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="700">${escapeHtml(eventItem.game)}</text>
        <text x="320" y="284" text-anchor="middle" fill="#C9A27A" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="600">Roll &amp; Brew Tabletop Session</text>
      </svg>
    `.trim();

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function getBadgeClass(type) {
    if (type === "Tournament") return "badge-tournament";
    if (type === "Casual") return "badge-casual";
    return "badge-beginner";
  }

  function getFilteredAndSortedEvents() {
    const query = state.searchQuery.trim().toLowerCase();

    const filtered = events.filter((item) => {
      const matchesType =
        state.typeFilter === "All" || item.type === state.typeFilter;
      const matchesSearch =
        query === "" ||
        item.title.toLowerCase().includes(query) ||
        item.game.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query);
      return matchesType && matchesSearch;
    });

    filtered.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return state.sortOrder === "latest" ? timeB - timeA : timeA - timeB;
    });

    return filtered;
  }

  function renderEvents() {
    const visibleEvents = getFilteredAndSortedEvents();

    els.resultsSummary.textContent =
      visibleEvents.length === 1
        ? "Showing 1 event"
        : `Showing ${visibleEvents.length} events`;

    if (visibleEvents.length === 0) {
      els.eventsGrid.innerHTML = "";
      els.eventsGrid.classList.add("d-none");
      els.noEventsMessage.classList.remove("d-none");
      return;
    }

    els.noEventsMessage.classList.add("d-none");
    els.eventsGrid.classList.remove("d-none");

    const fragment = document.createDocumentFragment();

    visibleEvents.forEach((item) => {
      const isInterested = state.interestedIds.has(item.id);
      const isFull = item.spotsLeft === 0;
      const signupLabel = isFull ? "Join waitlist" : "Sign up";
      const signupClass = isFull ? "btn-signup btn-waitlist" : "btn-signup";
      const spotsText = isFull
        ? "0 (Waitlist open)"
        : `${item.spotsLeft} ${item.spotsLeft === 1 ? "spot" : "spots"} left`;
      const spotsClass = isFull
        ? "spots-full"
        : item.spotsLeft <= 4
        ? "spots-low"
        : "";

      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-4";

      const article = document.createElement("article");
      article.className = "event-card";
      article.innerHTML = `
        <div class="event-card-media">
          <img class="event-card-img" alt="${escapeHtml(item.imageAlt)}" loading="lazy" />
          <span class="event-type-badge ${getBadgeClass(item.type)}">${escapeHtml(item.type)}</span>
        </div>
        <div class="event-card-body">
          <div class="event-date-pill">${escapeHtml(formatEventDate(item.date))}</div>
          <h2 class="event-title">${escapeHtml(item.title)}</h2>
          <p class="event-description">${escapeHtml(item.description)}</p>
          <ul class="event-details">
            <li>
              <span class="detail-label">Game</span>
              <span class="detail-value">${escapeHtml(item.game)}</span>
            </li>
            <li>
              <span class="detail-label">Availability</span>
              <span class="detail-value ${spotsClass}">${escapeHtml(spotsText)}</span>
            </li>
            <li>
              <span class="detail-label">Entry Fee</span>
              <span class="detail-value">${escapeHtml(formatFee(item.fee))}</span>
            </li>
          </ul>
          <div class="event-actions">
            <button
              type="button"
              class="btn-interested ${isInterested ? "is-interested" : ""}"
              data-interested-id="${item.id}"
              aria-pressed="${isInterested ? "true" : "false"}"
            >
              ${isInterested ? "&#10003; Interested" : "&#9825; Interested"}
            </button>
            <a
              href="signup.html?event=${encodeURIComponent(item.id)}"
              class="${signupClass}"
            >
              ${signupLabel}
            </a>
          </div>
        </div>
      `;

      const img = article.querySelector(".event-card-img");
      img.addEventListener(
        "error",
        function () {
          img.src = createPlaceholderArt(item);
        },
        { once: true }
      );
      img.src = item.image;

      col.appendChild(article);
      fragment.appendChild(col);
    });

    els.eventsGrid.innerHTML = "";
    els.eventsGrid.appendChild(fragment);
  }

  function getNextUpcomingEvent(nowMs) {
    return events
      .filter((item) => new Date(item.date).getTime() > nowMs)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }

  function padZero(num) {
    return String(num).padStart(2, "0");
  }

  function renderCountdown() {
    const nowMs = Date.now();
    const nextEvent = getNextUpcomingEvent(nowMs);

    if (!nextEvent) {
      els.countdownBanner.innerHTML = `
        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <span class="countdown-label">Next Event</span>
            <h2 class="countdown-title h4">New Café Schedule Coming Soon</h2>
            <p class="countdown-meta mb-0">Follow our table announcements for upcoming tournaments and beginner nights.</p>
          </div>
          <a href="signup.html" class="btn-signup flex-grow-0 px-4">Reserve a Table</a>
        </div>
      `;
      if (countdownIntervalId) {
        window.clearInterval(countdownIntervalId);
        countdownIntervalId = null;
      }
      return;
    }

    const diffMs = Math.max(0, new Date(nextEvent.date).getTime() - nowMs);
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const isFull = nextEvent.spotsLeft === 0;
    const ctaText = isFull ? "Join waitlist" : "Sign up";

    els.countdownBanner.innerHTML = `
      <div class="row align-items-center g-3">
        <div class="col-12 col-lg-6">
          <span class="countdown-label">Next Upcoming Event</span>
          <h2 class="countdown-title h4">${escapeHtml(nextEvent.title)}</h2>
          <p class="countdown-meta mb-0">
            <strong>${escapeHtml(nextEvent.game)}</strong> &bull;
            ${escapeHtml(formatEventDate(nextEvent.date))} &bull;
            ${escapeHtml(formatFee(nextEvent.fee))}
          </p>
        </div>
        <div class="col-12 col-sm-8 col-lg-4">
          <div class="countdown-grid" aria-label="Countdown timer">
            <div class="countdown-unit">
              <span class="countdown-value">${padZero(days)}</span>
              <span class="countdown-caption">Days</span>
            </div>
            <div class="countdown-unit">
              <span class="countdown-value">${padZero(hours)}</span>
              <span class="countdown-caption">Hours</span>
            </div>
            <div class="countdown-unit">
              <span class="countdown-value">${padZero(minutes)}</span>
              <span class="countdown-caption">Mins</span>
            </div>
            <div class="countdown-unit">
              <span class="countdown-value">${padZero(seconds)}</span>
              <span class="countdown-caption">Secs</span>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-4 col-lg-2 d-grid">
          <a href="signup.html?event=${encodeURIComponent(nextEvent.id)}" class="btn-signup ${isFull ? "btn-waitlist bg-light" : ""}">
            ${ctaText}
          </a>
        </div>
      </div>
    `;
  }

  function updateFilterButtons() {
    els.filterButtons.forEach((btn) => {
      const isActive = btn.getAttribute("data-filter-type") === state.typeFilter;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function bindEvents() {
    els.filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        state.typeFilter = btn.getAttribute("data-filter-type") || "All";
        updateFilterButtons();
        renderEvents();
      });
    });

    if (els.searchInput) {
      els.searchInput.addEventListener("input", (event) => {
        state.searchQuery = event.target.value;
        renderEvents();
      });
    }

    if (els.sortSelect) {
      els.sortSelect.addEventListener("change", (event) => {
        state.sortOrder = event.target.value;
        renderEvents();
      });
    }

    if (els.resetFiltersBtn) {
      els.resetFiltersBtn.addEventListener("click", () => {
        state.typeFilter = "All";
        state.searchQuery = "";
        state.sortOrder = "soonest";
        if (els.searchInput) els.searchInput.value = "";
        if (els.sortSelect) els.sortSelect.value = "soonest";
        updateFilterButtons();
        renderEvents();
      });
    }

    els.eventsGrid.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-interested-id]");
      if (!btn) return;

      const eventId = Number(btn.getAttribute("data-interested-id"));
      if (state.interestedIds.has(eventId)) {
        state.interestedIds.delete(eventId);
      } else {
        state.interestedIds.add(eventId);
      }

      saveInterestedIds();
      renderEvents();
    });
  }

  function init() {
    bindEvents();
    updateFilterButtons();
    renderEvents();
    renderCountdown();
    countdownIntervalId = window.setInterval(renderCountdown, 1000);
  }

  init();
})();
