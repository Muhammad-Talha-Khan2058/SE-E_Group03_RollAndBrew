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

  const GAME_SETUP_MAP = {
    1: "Assemble the modular hexagonal terrain tiles into an island with numbered chits, sort resource and Development Card decks beside the board, place the Robber on the desert, and have players place their starting settlements and roads.",
    2: "Give each player 45 colored plastic trains, deal 4 train cards and secret Destination Tickets, and reveal 5 face-up train cards next to the draw deck.",
    3: "Arrange the Factory displays in a circle (5 for 2 players, 7 for 3, 9 for 4), fill each with 4 tiles drawn from the bag, and give every player a 5x5 mosaic board.",
    4: "Lay out a 5x5 grid of 25 word cards, split into Red and Blue teams, and seat both Spymasters together with a shared secret key card.",
    5: "Shuffle the deck, deal 7 cards face down to each player, and flip the top card face up to start the discard pile.",
    6: "Remove all Exploding Kittens and Defuse cards, deal 7 cards plus 1 Defuse card to each player, then shuffle the required Exploding Kittens back into the draw deck.",
    7: "Shuffle the sushi deck and deal a starting hand to each player based on table size (10 cards for 2 players, 9 for 3, 8 for 4, or 7 for 5).",
    8: "Place the treasury coins in the center, deal 2 coins and 2 face-down character cards to each player, and set the remaining Court deck in the middle.",
    9: "Set out the world map board, deal Role cards and starting city cards to each player, build the Epidemic-seeded Player Deck, and draw initial Infection cards to place starting disease cubes.",
    10: "Place the starting tile in the center of the table, stack the remaining landscape tiles face down, and give each player 8 meeples in their chosen color.",
    11: "Lay out 10 Kingdom card piles alongside Copper, Silver, Gold, Estate, Duchy, Province, and Curse piles; each player begins with 7 Coppers and 3 Estates and draws a 5-card hand.",
    12: "Place the Mars board with temperature, oxygen, and ocean markers at starting positions, deal Corporation and Project cards, and give each player a resource mat.",
    13: "Orient the 8x8 board with a light square in each player's bottom-right corner. Place 8 pawns on the second rank and arrange the back rank with rooks on the corners, knights, bishops, queen on her matching color, and king beside her.",
    14: "Each player picks a color and places all 4 matching tokens in their corner starting yard, keeping one six-sided die ready in the center.",
    15: "Place the Chance and Community Chest decks on the board, designate a Banker to give each player $1,500 in starting cash, and place every player's token on GO.",
    16: "Mix all 100 letter tiles inside the cloth bag; each player draws 1 tile to determine turn order, returns them to the bag, and draws a starting rack of 7 tiles."
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

    if (!toggleBtn || !primaryNav || toggleBtn.dataset.navBound === "true") {
      return;
    }

    toggleBtn.dataset.navBound = "true";
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
          <div class="empty-state-actions">
            <a class="btn btn-primary" href="board-games.html">Browse Board Games</a>
            <a class="btn btn-secondary" href="card-games.html">Browse Card Games</a>
          </div>
        </div>
      `;
    }
  }

  /**
   * Return setup instructions for a game, preferring an explicit setup field if present.
   * @param {Object} game
   * @returns {string}
   */
  function getGameSetup(game) {
    if (game.setup) {
      return game.setup;
    }
    return (
      GAME_SETUP_MAP[game.id] ||
      "Place the game components in the center of the table, deal starting player pieces or hands as listed in the box insert, and choose a starting player."
    );
  }

  /**
   * Mark the matching shelf nav link active on game-details.html.
   * @param {string} href
   */
  function setActiveCategoryNavLink(href) {
    const navLinks = document.querySelectorAll(".primary-nav .nav-link");
    const hasDetailsNavLink = Array.from(navLinks).some(function (link) {
      return link.getAttribute("href") === "game-details.html";
    });
    if (hasDetailsNavLink) {
      return;
    }
    navLinks.forEach(function (link) {
      const isMatch = link.getAttribute("href") === href;
      link.classList.toggle("nav-link--active", isMatch);
      if (isMatch) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
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
    const setupInstructions = getGameSetup(game);
    const backHref = game.type === "card" ? "card-games.html" : "board-games.html";
    const backLabel = game.type === "card" ? "Back to Card Games" : "Back to Board Games";
    const otherHref = game.type === "card" ? "board-games.html" : "card-games.html";
    const otherLabel = game.type === "card" ? "Explore Board Games" : "Explore Card Games";

    setActiveCategoryNavLink(backHref);
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
        <section class="related-games-section" aria-labelledby="related-heading">
          <h2 id="related-heading" class="related-games-heading">More ${escapeHtml(typeLabel)}s at Roll &amp; Brew</h2>
          <div class="games-grid">
            ${relatedGames.map(buildGameCardHtml).join("")}
          </div>
        </section>
      `
      : "";

    elements.containerEl.innerHTML = `
      <article class="game-detail-card">
        <div class="game-card-header">
          <span class="game-type-badge ${typeClass}">${escapeHtml(typeLabel)}</span>
          <span class="game-status-badge ${statusClass}">${escapeHtml(game.status)}</span>
        </div>

        <h2 class="detail-title-heading">${escapeHtml(game.title)}</h2>

        <div class="game-meta">
          <span class="meta-pill">${escapeHtml(playersText)}</span>
          <span class="meta-pill">${escapeHtml(game.duration)}</span>
          <span class="meta-pill ${difficultyClass}">${escapeHtml(game.difficulty)}</span>
          <span class="meta-pill">Catalog #${escapeHtml(game.id)}</span>
        </div>

        <p class="detail-description">${escapeHtml(game.description)}</p>

        <div class="detail-sections">
          <section class="detail-section-box" aria-labelledby="setup-heading">
            <h3 id="setup-heading">Setup Instructions</h3>
            <p>${escapeHtml(setupInstructions)}</p>
          </section>

          <section class="detail-section-box" aria-labelledby="rules-heading">
            <h3 id="rules-heading">Full Rules</h3>
            <p>${escapeHtml(game.rules)}</p>
          </section>
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
