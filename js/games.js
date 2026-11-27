/* ==========================================================================
   Roll & Brew — Games Catalog & Details Controller
   Powers board-games.html, card-games.html, and game-details.html using
   window.GAMES_DATA from js/games-data.js and classes from css/games.css.
   ========================================================================== */

(function () {
  "use strict";

  const STATUS_CLASS_MAP = {
    Available: "status-available",
    "Checked Out": "status-checked-out",
    Reserved: "status-reserved"
  };

  const DIFFICULTY_CLASS_MAP = {
    Easy: "difficulty-easy",
    Medium: "difficulty-medium",
    Hard: "difficulty-hard"
  };

  /**
   * Escape HTML special characters so dynamic text renders safely.
   * @param {unknown} value
   * @returns {string}
   */
  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Format a game's player range for display.
   * @param {{ minPlayers: number, maxPlayers: number }} game
   * @returns {string}
   */
  function formatPlayers(game) {
    if (game.minPlayers === game.maxPlayers) {
      return `${game.minPlayers} ${game.minPlayers === 1 ? "Player" : "Players"}`;
    }
    return `${game.minPlayers}–${game.maxPlayers} Players`;
  }

  /**
   * Return human-readable category label for a game type.
   * @param {string} type
   * @returns {string}
   */
  function getTypeLabel(type) {
    return type === "card" ? "Card Game" : "Board Game";
  }

  /**
   * Return CSS badge class for a game's type.
   * @param {string} type
   * @returns {string}
   */
  function getTypeBadgeClass(type) {
    return type === "card" ? "game-type-badge--card" : "game-type-badge--board";
  }

  /**
   * Return CSS badge class for a game's availability status.
   * @param {string} status
   * @returns {string}
   */
  function getStatusClass(status) {
    return STATUS_CLASS_MAP[status] || "status-available";
  }

  /**
   * Return CSS pill class for a game's difficulty level.
   * @param {string} difficulty
   * @returns {string}
   */
  function getDifficultyClass(difficulty) {
    return DIFFICULTY_CLASS_MAP[difficulty] || "";
  }

  /**
   * Initialize responsive mobile navigation toggle.
   */
  function initNavbar() {
    const toggleBtn = document.querySelector(".nav-toggle");
    const primaryNav = document.getElementById("primary-navigation");

    if (!toggleBtn || !primaryNav) {
      return;
    }

    toggleBtn.addEventListener("click", function () {
      const isOpen = primaryNav.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });
  }

  /**
   * Build HTML markup for a single game card in the grid.
   * @param {Object} game
   * @returns {string}
   */
  function buildGameCardHtml(game) {
    const typeLabel = getTypeLabel(game.type);
    const typeClass = getTypeBadgeClass(game.type);
    const statusClass = getStatusClass(game.status);
    const difficultyClass = getDifficultyClass(game.difficulty);
    const playersText = formatPlayers(game);
    const detailUrl = `game-details.html?id=${encodeURIComponent(game.id)}`;

    return `
      <article class="game-card" data-game-id="${escapeHtml(game.id)}">
        <div class="game-card-header">
          <span class="game-type-badge ${typeClass}">${escapeHtml(typeLabel)}</span>
          <span class="game-status-badge ${statusClass}">${escapeHtml(game.status)}</span>
        </div>

        <h2 class="game-title">${escapeHtml(game.title)}</h2>

        <div class="game-meta">
          <span class="meta-pill">${escapeHtml(playersText)}</span>
          <span class="meta-pill">${escapeHtml(game.duration)}</span>
          <span class="meta-pill ${difficultyClass}">${escapeHtml(game.difficulty)}</span>
        </div>

        <p class="game-description">${escapeHtml(game.description)}</p>

        <div class="game-card-footer">
          <a class="btn btn-primary" href="${detailUrl}">
            View Details &amp; Rules
          </a>
        </div>
      </article>
    `;
  }

  /**
   * Check whether a game supports the chosen player-count filter.
   * @param {Object} game
   * @param {string} playerFilter
   * @returns {boolean}
   */
  function matchesPlayerFilter(game, playerFilter) {
    if (!playerFilter || playerFilter === "all") {
      return true;
    }
    if (playerFilter === "5+") {
      return game.maxPlayers >= 5;
    }
    const targetPlayers = Number(playerFilter);
    if (!Number.isFinite(targetPlayers)) {
      return true;
    }
    return game.minPlayers <= targetPlayers && game.maxPlayers >= targetPlayers;
  }

  /**
   * Check whether a game matches the search query across key fields.
   * @param {Object} game
   * @param {string} query
   * @returns {boolean}
   */
  function matchesSearch(game, query) {
    if (!query) {
      return true;
    }
    const haystack = [
      game.title,
      game.type,
      game.difficulty,
      game.status,
      game.duration,
      game.description,
      game.rules
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  }

  /**
   * Initialize catalog rendering, search, and filters on board-games.html & card-games.html.
   * @param {Array<Object>} games
   */
  function initCatalogPage(games) {
    const defaultCategory = document.body.dataset.defaultType || "all";

    const searchInput = document.getElementById("game-search");
    const categorySelect = document.getElementById("filter-category");
    const playersSelect = document.getElementById("filter-players");
    const difficultySelect = document.getElementById("filter-difficulty");
    const statusPills = Array.from(document.querySelectorAll(".filter-pill[data-status]"));
    const resetBtn = document.getElementById("reset-filters");
    const emptyResetBtn = document.getElementById("empty-reset-btn");

    const gridEl = document.getElementById("games-grid");
    const emptyStateEl = document.getElementById("empty-state");
    const resultsCountEl = document.getElementById("results-count");
    const statTotalEl = document.getElementById("stat-total");
    const statAvailableEl = document.getElementById("stat-available");
    const statShowingEl = document.getElementById("stat-showing");

    if (!gridEl) {
      return;
    }

    const state = {
      search: "",
      category: defaultCategory,
      players: "all",
      difficulty: "all",
      status: "all"
    };

    if (categorySelect) {
      categorySelect.value = state.category;
    }

    function syncStatusPills() {
      statusPills.forEach(function (pill) {
        const isActive = pill.dataset.status === state.status;
        pill.classList.toggle("is-active", isActive);
        pill.setAttribute("aria-pressed", String(isActive));
      });
    }

    function renderCatalog() {
      const categoryScopedGames =
        state.category === "all"
          ? games
          : games.filter(function (game) {
              return game.type === state.category;
            });

      const filteredGames = categoryScopedGames.filter(function (game) {
        if (!matchesPlayerFilter(game, state.players)) {
          return false;
        }
        if (state.difficulty !== "all" && game.difficulty !== state.difficulty) {
          return false;
        }
        if (state.status !== "all" && game.status !== state.status) {
          return false;
        }
        return matchesSearch(game, state.search);
      });

      const availableCount = categoryScopedGames.filter(function (game) {
        return game.status === "Available";
      }).length;

      if (statTotalEl) {
        statTotalEl.textContent = String(categoryScopedGames.length);
      }
      if (statAvailableEl) {
        statAvailableEl.textContent = String(availableCount);
      }
      if (statShowingEl) {
        statShowingEl.textContent = String(filteredGames.length);
      }

      if (resultsCountEl) {
        const categoryNoun =
          state.category === "board"
            ? "board games"
            : state.category === "card"
              ? "card games"
              : "games";
        resultsCountEl.innerHTML =
          `Showing <strong>${filteredGames.length}</strong> of <strong>${categoryScopedGames.length}</strong> ${escapeHtml(categoryNoun)}`;
      }

      if (filteredGames.length === 0) {
        gridEl.innerHTML = "";
        gridEl.hidden = true;
        if (emptyStateEl) {
          emptyStateEl.hidden = false;
        }
        return;
      }

      gridEl.hidden = false;
      if (emptyStateEl) {
        emptyStateEl.hidden = true;
      }
      gridEl.innerHTML = filteredGames.map(buildGameCardHtml).join("");
    }

    function resetFilters() {
      state.search = "";
      state.category = defaultCategory;
      state.players = "all";
      state.difficulty = "all";
      state.status = "all";

      if (searchInput) {
        searchInput.value = "";
      }
      if (categorySelect) {
        categorySelect.value = defaultCategory;
      }
      if (playersSelect) {
        playersSelect.value = "all";
      }
      if (difficultySelect) {
        difficultySelect.value = "all";
      }
      syncStatusPills();
      renderCatalog();
    }

    if (searchInput) {
      searchInput.addEventListener("input", function (event) {
        state.search = event.target.value.trim().toLowerCase();
        renderCatalog();
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener("change", function (event) {
        state.category = event.target.value;
        renderCatalog();
      });
    }

    if (playersSelect) {
      playersSelect.addEventListener("change", function (event) {
        state.players = event.target.value;
        renderCatalog();
      });
    }

    if (difficultySelect) {
      difficultySelect.addEventListener("change", function (event) {
        state.difficulty = event.target.value;
        renderCatalog();
      });
    }

    statusPills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        state.status = pill.dataset.status || "all";
        syncStatusPills();
        renderCatalog();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", resetFilters);
    }

    if (emptyResetBtn) {
      emptyResetBtn.addEventListener("click", resetFilters);
    }

    syncStatusPills();
    renderCatalog();
  }

  /**
   * Render fallback state on game-details.html when ID is missing or invalid.
   * @param {string | null} rawId
   * @param {Object} elements
   */
  function renderInvalidGameState(rawId, elements) {
    const trimmedId = rawId ? rawId.trim() : "";
    const heading = trimmedId ? "Game Not Found" : "No Game Selected";
    const message = trimmedId
      ? `We could not find a game with ID "${escapeHtml(trimmedId)}" in the Roll & Brew library.`
      : "No game ID was provided in the page URL. Choose a title from our Board Games or Card Games shelf to view its details and rules.";

    document.title = `${heading} — Roll & Brew`;

    if (elements.kickerEl) {
      elements.kickerEl.textContent = "Catalog Lookup";
    }
    if (elements.titleEl) {
      elements.titleEl.textContent = heading;
    }
    if (elements.subtitleEl) {
      elements.subtitleEl.textContent =
        "Double-check the link or explore our full tabletop library below.";
    }
    if (elements.statsEl) {
      elements.statsEl.innerHTML = "";
    }
    if (elements.breadcrumbEl) {
      elements.breadcrumbEl.innerHTML = "Roll &amp; Brew Library / <strong>Unavailable Entry</strong>";
    }
    if (elements.containerEl) {
      elements.containerEl.innerHTML = `
        <div class="empty-state">
          <h2>${escapeHtml(heading)}</h2>
          <p>${message}</p>
          <div class="filter-pills" style="justify-content: center;">
            <a class="btn btn-primary" href="board-games.html">Browse Board Games</a>
            <a class="btn btn-secondary" href="card-games.html">Browse Card Games</a>
          </div>
        </div>
      `;
    }
  }

  /**
   * Initialize the URL-parameter-driven game detail page.
   * @param {Array<Object>} games
   */
  function initDetailsPage(games) {
    const elements = {
      kickerEl: document.getElementById("detail-kicker"),
      titleEl: document.getElementById("detail-title"),
      subtitleEl: document.getElementById("detail-subtitle"),
      statsEl: document.getElementById("detail-stats"),
      breadcrumbEl: document.getElementById("detail-breadcrumb"),
      containerEl: document.getElementById("game-detail-container")
    };

    if (!elements.containerEl) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const rawId = params.get("id");
    const trimmedId = rawId ? rawId.trim() : "";
    const parsedId = /^\d+$/.test(trimmedId) ? Number(trimmedId) : NaN;
    const game = Number.isInteger(parsedId)
      ? games.find(function (item) {
          return item.id === parsedId;
        })
      : null;

    if (!game) {
      renderInvalidGameState(rawId, elements);
      return;
    }

    const typeLabel = getTypeLabel(game.type);
    const typeClass = getTypeBadgeClass(game.type);
    const statusClass = getStatusClass(game.status);
    const difficultyClass = getDifficultyClass(game.difficulty);
    const playersText = formatPlayers(game);
    const backHref = game.type === "card" ? "card-games.html" : "board-games.html";
    const backLabel = game.type === "card" ? "Back to Card Games" : "Back to Board Games";
    const otherHref = game.type === "card" ? "board-games.html" : "card-games.html";
    const otherLabel = game.type === "card" ? "Explore Board Games" : "Explore Card Games";

    document.title = `${game.title} — Roll & Brew`;

    if (elements.kickerEl) {
      elements.kickerEl.textContent = typeLabel;
    }
    if (elements.titleEl) {
      elements.titleEl.textContent = game.title;
    }
    if (elements.subtitleEl) {
      elements.subtitleEl.textContent = game.description;
    }
    if (elements.statsEl) {
      elements.statsEl.innerHTML = `
        <div class="stat-chip">
          <span class="stat-value">${escapeHtml(playersText)}</span>
          <span class="stat-label">Player Count</span>
        </div>
        <div class="stat-chip">
          <span class="stat-value">${escapeHtml(game.duration)}</span>
          <span class="stat-label">Play Time</span>
        </div>
        <div class="stat-chip">
          <span class="stat-value">${escapeHtml(game.difficulty)}</span>
          <span class="stat-label">Difficulty</span>
        </div>
        <div class="stat-chip">
          <span class="stat-value">${escapeHtml(game.status)}</span>
          <span class="stat-label">Café Status</span>
        </div>
      `;
    }
    if (elements.breadcrumbEl) {
      elements.breadcrumbEl.innerHTML =
        `<a href="${backHref}">${escapeHtml(typeLabel)}s</a> / <strong>${escapeHtml(game.title)}</strong>`;
    }

    const relatedGames = games
      .filter(function (candidate) {
        return candidate.type === game.type && candidate.id !== game.id;
      })
      .slice(0, 3);

    const relatedHtml = relatedGames.length
      ? `
        <section aria-labelledby="related-heading" style="margin-top: 2.25rem;">
          <h2 id="related-heading" class="modal-section-heading">More ${escapeHtml(typeLabel)}s at Roll &amp; Brew</h2>
          <div class="games-grid">
            ${relatedGames.map(buildGameCardHtml).join("")}
          </div>
        </section>
      `
      : "";

    elements.containerEl.innerHTML = `
      <article class="games-controls">
        <div class="game-card-header">
          <span class="game-type-badge ${typeClass}">${escapeHtml(typeLabel)}</span>
          <span class="game-status-badge ${statusClass}">${escapeHtml(game.status)}</span>
        </div>

        <h2 class="game-title">${escapeHtml(game.title)}</h2>

        <div class="game-meta">
          <span class="meta-pill">${escapeHtml(playersText)}</span>
          <span class="meta-pill">${escapeHtml(game.duration)}</span>
          <span class="meta-pill ${difficultyClass}">${escapeHtml(game.difficulty)}</span>
          <span class="meta-pill">Catalog #${escapeHtml(game.id)}</span>
        </div>

        <h3 class="modal-section-heading">About This Game</h3>
        <p class="game-description">${escapeHtml(game.description)}</p>

        <h3 class="modal-section-heading">How to Play &amp; Rules Overview</h3>
        <div class="modal-rules-box">
          <p>${escapeHtml(game.rules)}</p>
        </div>

        <div class="controls-bottom">
          <a class="btn btn-primary" href="${backHref}">&larr; ${escapeHtml(backLabel)}</a>
          <a class="btn btn-secondary" href="${otherHref}">${escapeHtml(otherLabel)}</a>
        </div>
      </article>
      ${relatedHtml}
    `;
  }

  /**
   * Bootstrap navbar and active page controller once DOM is ready.
   */
  function init() {
    initNavbar();

    const games = Array.isArray(window.GAMES_DATA) ? window.GAMES_DATA : [];
    const pageType = document.body.dataset.page;

    if (pageType === "catalog") {
      initCatalogPage(games);
    } else if (pageType === "details") {
      initDetailsPage(games);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
