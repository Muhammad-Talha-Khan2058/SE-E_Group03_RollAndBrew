(function () {
  "use strict";

  const STORAGE_KEY = "rollAndBrew_galleryCategory";
  const VALID_CATEGORIES = [
    "All",
    "Tournaments",
    "Game Nights",
    "Café & Food",
    "Games"
  ];

  const GALLERY_PHOTOS = [
    {
      id: 1,
      title: "Catan Finals Table",
      category: "Tournaments",
      date: "2026-10-18",
      caption:
        "Four finalists trading wheat and ore down to the final victory point during our autumn Settlers Cup.",
      image: "../images/gallery/catan-finals-table.jpg",
      imageAlt:
        "Four players gathered around a wooden table studying hexagonal Catan tiles during a café tournament"
    },
    {
      id: 2,
      title: "Blitz Chess & Cardamom Chai",
      category: "Tournaments",
      date: "2026-10-25",
      caption:
        "Clocks ticking in the five-minute blitz bracket with steaming cups of house chai beside the board.",
      image: "../images/gallery/blitz-chess-chai.jpg",
      imageAlt:
        "Wooden Staunton chess pieces and a digital chess clock next to a warm ceramic cup of cardamom chai"
    },
    {
      id: 3,
      title: "Dune Imperium Bracket Play",
      category: "Tournaments",
      date: "2026-11-02",
      caption:
        "Tight worker-placement decisions in round three of our monthly strategy showdown.",
      image: "../images/gallery/dune-bracket-play.jpg",
      imageAlt:
        "Dune Imperium game board, intrigue cards, and wooden player tokens under warm café lights"
    },
    {
      id: 4,
      title: "Friday Social Deduction Night",
      category: "Game Nights",
      date: "2026-10-11",
      caption:
        "Laughter and dramatic accusations echoing across the main hall during a ten-player Secret Hitler round.",
      image: "../images/gallery/friday-social-deduction.jpg",
      imageAlt:
        "Group of smiling friends holding secret role cards around a large wooden table at night"
    },
    {
      id: 5,
      title: "Co-Op Table: Saving the Map",
      category: "Game Nights",
      date: "2026-10-30",
      caption:
        "Regulars teaming up over Pandemic to plan the final cure with only two cards left in the deck.",
      image: "../images/gallery/coop-table-pandemic.jpg",
      imageAlt:
        "Players leaning over a colorful world map board game covered in cubes and research markers"
    },
    {
      id: 6,
      title: "Sunday Beginner Mixer",
      category: "Game Nights",
      date: "2026-11-09",
      caption:
        "First-time visitors learning Azul and Splendor with our café game masters guiding every turn.",
      image: "../images/gallery/sunday-beginner-mixer.jpg",
      imageAlt:
        "Game host explaining mosaic tile rules to newcomers seated at a sunlit café table"
    },
    {
      id: 7,
      title: "House Espresso & Dice Tray",
      category: "Café & Food",
      date: "2026-10-14",
      caption:
        "Double-shot latte art pulled fresh from our espresso bar and served beside a walnut dice tray.",
      image: "../images/gallery/espresso-dice-tray.jpg",
      imageAlt:
        "Latte with rosetta foam art in a ceramic mug sitting beside a wooden tray of polyhedral dice"
    },
    {
      id: 8,
      title: "Cinnamon Rolls & Cold Brew",
      category: "Café & Food",
      date: "2026-10-22",
      caption:
        "Warm glazed cinnamon rolls and chilled caramel cold brew fueling a three-hour Ticket to Ride marathon.",
      image: "../images/gallery/cinnamon-rolls-cold-brew.jpg",
      imageAlt:
        "Freshly baked glazed cinnamon rolls on a stoneware plate next to two glasses of iced cold brew coffee"
    },
    {
      id: 9,
      title: "Loaded Nachos Share Platter",
      category: "Café & Food",
      date: "2026-11-06",
      caption:
        "Table-friendly snack bowls kept neatly off the card sleeves with our elevated side trays.",
      image: "../images/gallery/loaded-nachos-platter.jpg",
      imageAlt:
        "Crispy tortilla chips topped with melted cheese, jalapenos, and salsa served on an elevated café stand"
    },
    {
      id: 10,
      title: "The Wall of 250+ Titles",
      category: "Games",
      date: "2026-10-08",
      caption:
        "Floor-to-ceiling wooden shelves stocked with party classics, eurogames, and two-player favorites.",
      image: "../images/gallery/board-game-wall.jpg",
      imageAlt:
        "Floor-to-ceiling oak shelves neatly stacked with colorful board game boxes at Roll and Brew"
    },
    {
      id: 11,
      title: "Wingspan Birdhouse Display",
      category: "Games",
      date: "2026-10-27",
      caption:
        "Pastel eggs, illustrated bird cards, and the wooden dice feeder set up and ready for afternoon play.",
      image: "../images/gallery/wingspan-display.jpg",
      imageAlt:
        "Wingspan board game setup featuring a wooden birdhouse dice tower, pastel egg tokens, and bird cards"
    },
    {
      id: 12,
      title: "Azul Mosaic Tiles Close-Up",
      category: "Games",
      date: "2026-11-12",
      caption:
        "Hand-crafted resin tiles arranged on player boards during a quiet weekday afternoon match.",
      image: "../images/gallery/azul-mosaic-tiles.jpg",
      imageAlt:
        "Close-up of colorful patterned Azul resin tiles arranged on a cream player board"
    }
  ];

  const state = {
    selectedCategory: loadSelectedCategory(),
    activeLightboxIndex: -1
  };

  const els = {
    filterButtons: Array.from(document.querySelectorAll("[data-filter-category]")),
    resultsSummary: document.getElementById("resultsSummary"),
    galleryGrid: document.getElementById("galleryGrid"),
    noPhotosMessage: document.getElementById("noPhotosMessage"),
    resetFilterBtn: document.getElementById("resetFilterBtn"),
    lightboxModalEl: document.getElementById("galleryLightboxModal"),
    lightboxCounter: document.getElementById("lightboxCounter"),
    lightboxCategory: document.getElementById("lightboxCategory"),
    lightboxImage: document.getElementById("lightboxImage"),
    lightboxTitle: document.getElementById("lightboxTitle"),
    lightboxDate: document.getElementById("lightboxDate"),
    lightboxCaption: document.getElementById("lightboxCaption"),
    lightboxPrevBtn: document.getElementById("lightboxPrevBtn"),
    lightboxNextBtn: document.getElementById("lightboxNextBtn")
  };

  const lightboxModal =
    els.lightboxModalEl && window.bootstrap
      ? new window.bootstrap.Modal(els.lightboxModalEl)
      : null;

  let lastTriggerEl = null;

  function loadSelectedCategory() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && VALID_CATEGORIES.includes(saved)) {
        return saved;
      }
      return "All";
    } catch (_err) {
      return "All";
    }
  }

  function saveSelectedCategory(category) {
    try {
      window.localStorage.setItem(STORAGE_KEY, category);
    } catch (_err) {
      // Ignore storage errors when localStorage is unavailable
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

  function formatPhotoDate(isoDate) {
    const parsed = new Date(isoDate + "T00:00:00");
    if (Number.isNaN(parsed.getTime())) return isoDate;
    return parsed.toLocaleDateString("en-PK", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  function getCategoryBadgeClass(category) {
    if (category === "Tournaments") return "badge-tournaments";
    if (category === "Game Nights") return "badge-game-nights";
    if (category === "Café & Food") return "badge-cafe-food";
    return "badge-games";
  }

  function getCategoryAccent(category) {
    if (category === "Tournaments") return "#5C3D2E";
    if (category === "Game Nights") return "#D9822B";
    if (category === "Café & Food") return "#9B6A43";
    return "#7C5843";
  }

  function createPlaceholderSvg(photo) {
    const badgeFill = getCategoryAccent(photo.category);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" role="img" aria-label="${escapeHtml(photo.imageAlt)}">
        <defs>
          <linearGradient id="galleryBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#5C3D2E"/>
            <stop offset="100%" stop-color="#3B2A20"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#galleryBgGrad)"/>
        <circle cx="670" cy="100" r="125" fill="#C9A27A" fill-opacity="0.16"/>
        <circle cx="130" cy="500" r="150" fill="#D9822B" fill-opacity="0.15"/>
        <rect x="52" y="52" width="696" height="496" rx="26" fill="#FBF5EA" fill-opacity="0.08" stroke="#C9A27A" stroke-opacity="0.48" stroke-width="2.5"/>
        <g transform="translate(342, 165)">
          <rect x="0" y="0" width="116" height="116" rx="22" fill="${badgeFill}" stroke="#FBF5EA" stroke-width="3.5"/>
          <circle cx="36" cy="36" r="8" fill="#FBF5EA"/>
          <circle cx="80" cy="36" r="8" fill="#FBF5EA"/>
          <circle cx="58" cy="58" r="8" fill="#FBF5EA"/>
          <circle cx="36" cy="80" r="8" fill="#FBF5EA"/>
          <circle cx="80" cy="80" r="8" fill="#FBF5EA"/>
        </g>
        <text x="400" y="346" text-anchor="middle" fill="#F6EFE2" font-family="Plus Jakarta Sans, Segoe UI, Arial, sans-serif" font-size="32" font-weight="700">${escapeHtml(photo.title)}</text>
        <text x="400" y="392" text-anchor="middle" fill="#EAD6BE" font-family="Plus Jakarta Sans, Segoe UI, Arial, sans-serif" font-size="22" font-weight="600">${escapeHtml(photo.category)} • Roll &amp; Brew</text>
      </svg>
    `.trim();

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function applyImageWithFallback(imgEl, photo) {
    imgEl.onerror = function () {
      imgEl.onerror = null;
      imgEl.src = createPlaceholderSvg(photo);
    };
    imgEl.alt = photo.imageAlt;
    imgEl.src = photo.image;
  }

  function getFilteredPhotos() {
    if (state.selectedCategory === "All") {
      return GALLERY_PHOTOS;
    }
    return GALLERY_PHOTOS.filter(
      (photo) => photo.category === state.selectedCategory
    );
  }

  function updateFilterButtons() {
    els.filterButtons.forEach((btn) => {
      const isActive =
        btn.getAttribute("data-filter-category") === state.selectedCategory;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function renderGallery() {
    const visiblePhotos = getFilteredPhotos();

    els.resultsSummary.textContent =
      visiblePhotos.length === 1
        ? "Showing 1 photo"
        : `Showing ${visiblePhotos.length} photos`;

    if (visiblePhotos.length === 0) {
      els.galleryGrid.innerHTML = "";
      els.galleryGrid.classList.add("d-none");
      els.noPhotosMessage.classList.remove("d-none");
      return;
    }

    els.noPhotosMessage.classList.add("d-none");
    els.galleryGrid.classList.remove("d-none");

    const fragment = document.createDocumentFragment();

    visiblePhotos.forEach((photo, index) => {
      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-3";

      const article = document.createElement("article");
      article.className = "gallery-card";

      article.innerHTML = `
        <button
          type="button"
          class="gallery-card-trigger"
          data-photo-index="${index}"
          aria-label="View photo: ${escapeHtml(photo.title)} (${escapeHtml(photo.category)})"
        >
          <div class="gallery-card-media">
            <img class="gallery-card-img" loading="lazy" alt="" />
            <span class="gallery-category-badge ${getCategoryBadgeClass(photo.category)}">
              ${escapeHtml(photo.category)}
            </span>
          </div>
          <div class="gallery-card-body">
            <div class="gallery-card-date">${escapeHtml(formatPhotoDate(photo.date))}</div>
            <h2 class="gallery-card-title">${escapeHtml(photo.title)}</h2>
            <p class="gallery-card-caption">${escapeHtml(photo.caption)}</p>
          </div>
        </button>
      `;

      const imgEl = article.querySelector(".gallery-card-img");
      applyImageWithFallback(imgEl, photo);

      col.appendChild(article);
      fragment.appendChild(col);
    });

    els.galleryGrid.innerHTML = "";
    els.galleryGrid.appendChild(fragment);
  }

  function updateLightboxContent() {
    const visiblePhotos = getFilteredPhotos();
    if (visiblePhotos.length === 0 || state.activeLightboxIndex < 0) return;

    const safeIndex =
      ((state.activeLightboxIndex % visiblePhotos.length) +
        visiblePhotos.length) %
      visiblePhotos.length;
    state.activeLightboxIndex = safeIndex;

    const photo = visiblePhotos[safeIndex];

    els.lightboxCounter.textContent = `${safeIndex + 1} of ${visiblePhotos.length}`;
    els.lightboxCategory.textContent = photo.category;
    els.lightboxCategory.className = `lightbox-category-badge ${getCategoryBadgeClass(
      photo.category
    )}`;
    els.lightboxTitle.textContent = photo.title;
    els.lightboxDate.textContent = formatPhotoDate(photo.date);
    els.lightboxCaption.textContent = photo.caption;

    applyImageWithFallback(els.lightboxImage, photo);

    const disableNav = visiblePhotos.length <= 1;
    els.lightboxPrevBtn.disabled = disableNav;
    els.lightboxNextBtn.disabled = disableNav;
  }

  function openLightbox(index, triggerEl) {
    const visiblePhotos = getFilteredPhotos();
    if (index < 0 || index >= visiblePhotos.length) return;

    lastTriggerEl = triggerEl || document.activeElement;
    state.activeLightboxIndex = index;
    updateLightboxContent();

    if (lightboxModal) {
      lightboxModal.show();
    }
  }

  function stepLightbox(delta) {
    const visiblePhotos = getFilteredPhotos();
    if (visiblePhotos.length <= 1 || state.activeLightboxIndex < 0) return;

    state.activeLightboxIndex =
      (state.activeLightboxIndex + delta + visiblePhotos.length) %
      visiblePhotos.length;
    updateLightboxContent();
  }

  function isLightboxOpen() {
    return (
      els.lightboxModalEl && els.lightboxModalEl.classList.contains("show")
    );
  }

  function selectCategory(category) {
    state.selectedCategory = VALID_CATEGORIES.includes(category)
      ? category
      : "All";
    saveSelectedCategory(state.selectedCategory);
    updateFilterButtons();
    renderGallery();
  }

  function bindEvents() {
    els.filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const category = btn.getAttribute("data-filter-category") || "All";
        selectCategory(category);
      });
    });

    if (els.resetFilterBtn) {
      els.resetFilterBtn.addEventListener("click", () => {
        selectCategory("All");
      });
    }

    els.galleryGrid.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-photo-index]");
      if (!trigger) return;
      const index = Number(trigger.getAttribute("data-photo-index"));
      openLightbox(index, trigger);
    });

    els.lightboxPrevBtn.addEventListener("click", () => {
      stepLightbox(-1);
    });

    els.lightboxNextBtn.addEventListener("click", () => {
      stepLightbox(1);
    });

    document.addEventListener("keydown", (event) => {
      if (!isLightboxOpen()) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepLightbox(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        stepLightbox(1);
      } else if (event.key === "Escape") {
        if (lightboxModal) {
          lightboxModal.hide();
        }
      }
    });

    if (els.lightboxModalEl) {
      els.lightboxModalEl.addEventListener("hidden.bs.modal", () => {
        state.activeLightboxIndex = -1;
        if (lastTriggerEl && typeof lastTriggerEl.focus === "function") {
          lastTriggerEl.focus();
          lastTriggerEl = null;
        }
      });
    }
  }

  function init() {
    bindEvents();
    updateFilterButtons();
    renderGallery();
  }

  init();
})();
