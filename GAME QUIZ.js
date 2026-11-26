/* ==========================================================================
   Roll & Brew — Interactive Tabletop Experience
   1. Navigation & Live Café Status
   2. Find Your Game Quiz Engine
   3. Tabletop Dice Roller Engine
   4. Membership Billing Toggle & Booking Modal
   5. Scroll Reveal Animations
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initScrollReveal();
  initCafeStatus();
  initGameQuiz();
  initDiceRoller();
  initMembershipToggle();
  initModal();
  initNewsletter();
});

/* --------------------------------------------------------------------------
   1. Navigation & Mobile Drawer
   -------------------------------------------------------------------------- */
function initNavigation() {
  const toggle = document.getElementById("nav-toggle");
  const drawer = document.getElementById("mobile-drawer");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id], footer[id]");

  if (toggle && drawer) {
    toggle.addEventListener("click", () => {
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isExpanded));
      drawer.hidden = isExpanded;
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        drawer.hidden = true;
      });
    });
  }

  // Highlight active section in navbar
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const matches = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("active", matches);
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );

    sections.forEach((sec) => spy.observe(sec));
  }
}

/* --------------------------------------------------------------------------
   Scroll Reveal
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Live Café Hours Status
   -------------------------------------------------------------------------- */
function initCafeStatus() {
  const statusEl = document.getElementById("cafe-status-text");
  const yearEl = document.getElementById("current-year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (!statusEl) return;

  const now = new Date();
  const day = now.getDay(); // 0 Sun .. 6 Sat
  const hour = now.getHours();
  const isWeekend = day === 0 || day === 5 || day === 6;
  const openHour = isWeekend ? 10 : 11;
  const closeText = isWeekend ? "12 am" : "11 pm";

  if (hour >= openHour || hour < 0) {
    statusEl.textContent = `Open now: until ${closeText}`;
  } else {
    statusEl.textContent = `Opens today at ${openHour}:00 am`;
  }
}

/* --------------------------------------------------------------------------
   2. Find Your Game Quiz
   -------------------------------------------------------------------------- */
function initGameQuiz() {
  const QUESTIONS = [
    {
      id: "players",
      prompt: "How many players are at your table?",
      options: [
        { value: "solo", title: "Solo (1 Player)", desc: "Quiet coffee & deep puzzle" },
        { value: "duo", title: "Two Players (2)", desc: "Head-to-head or cozy co-op" },
        { value: "group", title: "Small Group (3–4)", desc: "Classic café table size" },
        { value: "crowd", title: "Party Crowd (5+)", desc: "Big booth energy & laughs" }
      ]
    },
    {
      id: "vibe",
      prompt: "What vibe are you craving tonight?",
      options: [
        { value: "strategy", title: "Clever Strategy", desc: "Resource trading & engine building" },
        { value: "cozy", title: "Cozy & Visual", desc: "Relaxed turns & tactile tiles" },
        { value: "party", title: "Social & Fast", desc: "Clues, bluffing & quick laughs" },
        { value: "coop", title: "Team Co-op & Lore", desc: "Beat the board together" }
      ]
    },
    {
      id: "duration",
      prompt: "How long do you want the session to run?",
      options: [
        { value: "short", title: "15–30 Minutes", desc: "Espresso-break quick round" },
        { value: "medium", title: "45–60 Minutes", desc: "Sweet spot for one latte" },
        { value: "long", title: "90+ Minutes", desc: "Full evening campaign" },
        { value: "any", title: "Flexible", desc: "Surprise us with the best fit" }
      ]
    },
    {
      id: "complexity",
      prompt: "How heavy should the rules teach be?",
      options: [
        { value: "light", title: "2-Minute Teach", desc: "Jump straight into turn one" },
        { value: "medium", title: "Medium Crunch", desc: "Rich choices, smooth rules" },
        { value: "heavy", title: "Brain-Burner", desc: "Deep tactics & long arcs" },
        { value: "any", title: "Any Weight", desc: "We love reading rulebooks" }
      ]
    }
  ];

  const GAME_CATALOG = [
    {
      title: "Cascadia",
      players: ["solo", "duo", "group"],
      vibes: ["cozy", "strategy"],
      duration: "medium",
      complexity: "light",
      stats: "1–4 players • 30–45 min • Light-Medium",
      shelf: "Shelf B-04",
      desc: "Draft Pacific Northwest habitats and wildlife tokens to build the highest-scoring ecosystem.",
      pairing: "Honey Lavender Oat Latte & Almond Croissant"
    },
    {
      title: "Azul",
      players: ["duo", "group"],
      vibes: ["cozy", "strategy"],
      duration: "short",
      complexity: "light",
      stats: "2–4 players • 30–45 min • Easy to Learn",
      shelf: "Shelf A-08",
      desc: "Draft colorful ceramic tiles from factory displays to mosaic your palace wall with crisp precision.",
      pairing: "Iced Cinnamon Cortado & Lemon Shortbread"
    },
    {
      title: "Catan",
      players: ["group"],
      vibes: ["strategy"],
      duration: "long",
      complexity: "medium",
      stats: "3–4 players • 75–90 min • Medium Strategy",
      shelf: "Shelf A-12",
      desc: "Trade brick, grain, and ore across a modular island while racing friends to build settlements.",
      pairing: "Toasted Hazelnut Latte & Sea-Salt Brownie"
    },
    {
      title: "Wingspan",
      players: ["solo", "duo", "group"],
      vibes: ["cozy", "strategy"],
      duration: "long",
      complexity: "medium",
      stats: "1–5 players • 60–75 min • Medium Engine",
      shelf: "Shelf C-02",
      desc: "Attract illustrated birds into your nature reserve, triggering cascading food and egg combos.",
      pairing: "Matcha Vanilla Cold Foam & Pistachio Muffin"
    },
    {
      title: "Codenames",
      players: ["group", "crowd"],
      vibes: ["party"],
      duration: "short",
      complexity: "light",
      stats: "4–8+ players • 20 min • Social Wordplay",
      shelf: "Shelf D-01",
      desc: "Give clever one-word clues so your teammates spot secret agents without hitting the assassin.",
      pairing: "Caramel Macchiato Pitcher & Cinnamon Bites"
    },
    {
      title: "Wavelength",
      players: ["crowd", "group"],
      vibes: ["party", "coop"],
      duration: "short",
      complexity: "light",
      stats: "2–12 players • 30 min • Hilarious Debate",
      shelf: "Shelf D-09",
      desc: "Read your friend's mind by placing a clue on a spectrum between hot and cold, or coffee and tea.",
      pairing: "Dirty Chai Latte & Chocolate Chip Cookie"
    },
    {
      title: "Patchwork",
      players: ["duo"],
      vibes: ["cozy", "strategy"],
      duration: "short",
      complexity: "light",
      stats: "2 players • 25 min • Tactical Quilt",
      shelf: "Shelf B-11",
      desc: "Outmaneuver your partner for polyomino fabric scraps and buttons in a timeless two-player duel.",
      pairing: "Single-Origin Pour-Over & Berry Scone"
    },
    {
      title: "Spirit Island",
      players: ["solo", "duo", "group"],
      vibes: ["coop", "strategy"],
      duration: "long",
      complexity: "heavy",
      stats: "1–4 players • 90–120 min • Heavy Co-op",
      shelf: "Shelf E-03",
      desc: "Coordinate elemental spirits with asymmetric powers to defend an island from encroaching invaders.",
      pairing: "Double Americano & Dark Espresso Fudge"
    },
    {
      title: "Pandemic",
      players: ["duo", "group"],
      vibes: ["coop"],
      duration: "medium",
      complexity: "medium",
      stats: "2–4 players • 45 min • Classic Co-op",
      shelf: "Shelf C-14",
      desc: "Work together as specialists racing across the globe to contain outbreaks and discover four cures.",
      pairing: "Mocha Mint Breve & Warm Pretzel Twist"
    },
    {
      title: "Brass: Birmingham",
      players: ["duo", "group"],
      vibes: ["strategy"],
      duration: "long",
      complexity: "heavy",
      stats: "2–4 players • 120 min • Heavy Euro",
      shelf: "Shelf E-01",
      desc: "Build canals, rail links, and breweries across Industrial-era England in a fiercely rewarding economic duel.",
      pairing: "Maple Bourbon Cold Brew & Pecan Tart"
    },
    {
      title: "Scout",
      players: ["group", "crowd"],
      vibes: ["party", "strategy"],
      duration: "short",
      complexity: "light",
      stats: "3–5 players • 20 min • Ladder Card Game",
      shelf: "Shelf A-03",
      desc: "Play circus-themed card sets without rearranging your hand—scout rivals' cards to build stronger runs.",
      pairing: "Iced Brown Sugar Shaken Espresso"
    },
    {
      title: "Heat: Pedal to the Metal",
      players: ["solo", "group", "crowd"],
      vibes: ["strategy", "party"],
      duration: "medium",
      complexity: "medium",
      stats: "1–6 players • 45–60 min • Hand Management",
      shelf: "Shelf C-07",
      desc: "Shift gears and push your 1960s race car through hairpin corners without overheating your engine.",
      pairing: "Nitro Cold Brew & Salted Caramel Éclair"
    }
  ];

  const stepLabel = document.getElementById("quiz-step-label");
  const percentLabel = document.getElementById("quiz-percent-label");
  const progressFill = document.getElementById("quiz-progress-fill");
  const questionEl = document.getElementById("quiz-question");
  const optionsEl = document.getElementById("quiz-options");
  const backBtn = document.getElementById("quiz-back-btn");
  const resetBtn = document.getElementById("quiz-reset-btn");
  const quizBody = document.getElementById("quiz-body");
  const quizResult = document.getElementById("quiz-result");

  if (!questionEl || !optionsEl) return;

  let currentStep = 0;
  const answers = {};

  function renderStep() {
    const q = QUESTIONS[currentStep];
    const progress = Math.round(((currentStep + 1) / QUESTIONS.length) * 100);

    stepLabel.textContent = `Question ${currentStep + 1} of ${QUESTIONS.length}`;
    percentLabel.textContent = `${progress}%`;
    progressFill.style.width = `${progress}%`;

    questionEl.textContent = q.prompt;
    optionsEl.innerHTML = "";

    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      if (answers[q.id] === opt.value) {
        btn.classList.add("selected");
      }
      btn.innerHTML = `
        <span class="quiz-option-title">${opt.title}</span>
        <span class="quiz-option-desc">${opt.desc}</span>
      `;
      btn.addEventListener("click", () => {
        answers[q.id] = opt.value;
        if (currentStep < QUESTIONS.length - 1) {
          currentStep += 1;
          renderStep();
        } else {
          showResults();
        }
      });
      optionsEl.appendChild(btn);
    });

    backBtn.disabled = currentStep === 0;
    resetBtn.hidden = currentStep === 0 && Object.keys(answers).length === 0;
  }

  function scoreGame(game) {
    let score = 0;
    if (game.players.includes(answers.players)) score += 40;
    if (game.vibes.includes(answers.vibe)) score += 32;
    if (answers.duration === "any" || game.duration === answers.duration) score += 16;
    if (answers.complexity === "any" || game.complexity === answers.complexity) score += 12;
    return score;
  }

  function showResults() {
    const ranked = [...GAME_CATALOG]
      .map((game) => ({ ...game, score: scoreGame(game) }))
      .sort((a, b) => b.score - a.score);

    const top = ranked[0];
    const runners = ranked.slice(1, 3);
    const matchPct = Math.min(99, Math.max(76, top.score));

    stepLabel.textContent = "Your Match is Ready";
    percentLabel.textContent = "100%";
    progressFill.style.width = "100%";

    quizBody.hidden = true;
    quizResult.hidden = false;
    resetBtn.hidden = false;

    quizResult.innerHTML = `
      <div class="quiz-result-card">
        <div class="quiz-result-top">
          <span class="match-badge">${matchPct}% Table Match</span>
          <span class="spotlight-shelf">${top.shelf}</span>
        </div>
        <h4 class="quiz-result-title">${top.title}</h4>
        <p class="quiz-result-meta">${top.stats}</p>
        <p class="quiz-result-desc">${top.desc}</p>
        <div class="quiz-pairing-box">
          <strong>Café Pairing:</strong> ${top.pairing}
        </div>
        <div class="spotlight-actions">
          <button type="button" class="btn btn-primary btn-sm" id="quiz-reserve-btn">
            Reserve ${top.title}
          </button>
          <button type="button" class="btn btn-ghost btn-sm" id="quiz-retake-btn">
            Retake Quiz
          </button>
        </div>
      </div>

      <div class="runner-ups">
        ${runners
          .map(
            (r) => `
          <div class="runner-up-item">
            <div>
              <strong>${r.title}</strong>
              <span style="color: var(--text-muted); display:block; font-size:0.78rem;">${r.stats}</span>
            </div>
            <span class="spotlight-shelf">${r.shelf}</span>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    document.getElementById("quiz-retake-btn")?.addEventListener("click", resetQuiz);
    document.getElementById("quiz-reserve-btn")?.addEventListener("click", () => {
      openActionModal({ mode: "table", game: top.title });
    });
  }

  function resetQuiz() {
    currentStep = 0;
    Object.keys(answers).forEach((k) => delete answers[k]);
    quizResult.hidden = true;
    quizBody.hidden = false;
    renderStep();
  }

  backBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep -= 1;
      renderStep();
    }
  });

  resetBtn.addEventListener("click", resetQuiz);
  renderStep();
}

/* --------------------------------------------------------------------------
   3. Tabletop Dice Roller
   -------------------------------------------------------------------------- */
function initDiceRoller() {
  const dieChips = document.querySelectorAll(".die-chip");
  const countDisplay = document.getElementById("dice-count-display");
  const modDisplay = document.getElementById("dice-mod-display");
  const decCountBtn = document.getElementById("dice-count-dec");
  const incCountBtn = document.getElementById("dice-count-inc");
  const decModBtn = document.getElementById("dice-mod-dec");
  const incModBtn = document.getElementById("dice-mod-inc");
  const advToggle = document.getElementById("dice-advantage-toggle");
  const rollBtn = document.getElementById("roll-dice-btn");
  const perkBtn = document.getElementById("perk-roll-btn");
  const clearBtn = document.getElementById("clear-history-btn");
  const trayEl = document.getElementById("dice-tray");
  const formulaEl = document.getElementById("tray-formula");
  const totalEl = document.getElementById("tray-total");
  const calloutEl = document.getElementById("tray-callout");
  const resultsListEl = document.getElementById("dice-results-list");
  const historyListEl = document.getElementById("roll-history-list");
  const rollCountBadge = document.getElementById("roll-count-badge");

  if (!rollBtn || !trayEl) return;

  const CAFE_PERKS = [
    "1: First Player Token — You go first tonight!",
    "2: Barista's Choice — Ask for today's secret syrup.",
    "3: Free Espresso Extra Shot with any pastry.",
    "4: Reroll Card — Redeem one friendly table reroll.",
    "5: Wildcard Rule — Pick the next café background playlist.",
    "6: Critical Brew! 10% off your next specialty drink."
  ];

  let sides = 6;
  let diceCount = 2;
  let modifier = 0;
  let d20Mode = "normal"; // normal | adv | dis
  const history = [];

  function formatMod(val) {
    return val >= 0 ? `+${val}` : `${val}`;
  }

  function updateControlsUI() {
    countDisplay.textContent = String(diceCount);
    modDisplay.textContent = formatMod(modifier);
    formulaEl.textContent =
      d20Mode !== "normal" && sides === 20
        ? `2D20 (${d20Mode === "adv" ? "Advantage" : "Disadvantage"}) ${formatMod(modifier)}`
        : `${diceCount}D${sides} ${formatMod(modifier)}`;

    advToggle.disabled = sides !== 20;
    if (sides !== 20) {
      d20Mode = "normal";
      advToggle.setAttribute("aria-pressed", "false");
      advToggle.textContent = "D20 Only";
    } else {
      advToggle.setAttribute("aria-pressed", String(d20Mode !== "normal"));
      advToggle.textContent =
        d20Mode === "normal" ? "Normal" : d20Mode === "adv" ? "Advantage" : "Disadvantage";
    }
  }

  function rollSingleDie(max) {
    return Math.floor(Math.random() * max) + 1;
  }

  function animateTray() {
    trayEl.classList.remove("rolling");
    void trayEl.offsetWidth;
    trayEl.classList.add("rolling");
  }

  function renderHistory() {
    rollCountBadge.textContent = `${history.length} ${history.length === 1 ? "roll" : "rolls"}`;
    if (history.length === 0) {
      historyListEl.innerHTML = `<li class="history-empty">Roll your first hand to track turn totals here.</li>`;
      return;
    }

    historyListEl.innerHTML = history
      .slice(0, 8)
      .map(
        (item) => `
      <li class="history-item">
        <span class="history-formula">${item.label} [${item.rolls.join(", ")}]</span>
        <span class="history-total">= ${item.total}</span>
      </li>
    `
      )
      .join("");
  }

  function executeRoll() {
    let rolls = [];
    let droppedIndex = -1;
    let sum = 0;

    if (sides === 20 && d20Mode !== "normal") {
      const a = rollSingleDie(20);
      const b = rollSingleDie(20);
      rolls = [a, b];
      if (d20Mode === "adv") {
        sum = Math.max(a, b);
        droppedIndex = a >= b ? 1 : 0;
      } else {
        sum = Math.min(a, b);
        droppedIndex = a <= b ? 1 : 0;
      }
    } else {
      for (let i = 0; i < diceCount; i += 1) {
        const val = rollSingleDie(sides);
        rolls.push(val);
        sum += val;
      }
    }

    const finalTotal = sum + modifier;
    totalEl.textContent = String(finalTotal);

    const activeDice = rolls.filter((_, idx) => idx !== droppedIndex);
    if (sides === 20 && activeDice.includes(20)) {
      calloutEl.textContent = "Natural 20! Critical Hit";
    } else if (sides === 20 && activeDice.includes(1)) {
      calloutEl.textContent = "Natural 1 — Table Fumble";
    } else if (rolls.length > 1 && rolls.every((r) => r === rolls[0])) {
      calloutEl.textContent = `Doubles / Matching ${rolls[0]}s!`;
    } else {
      calloutEl.textContent = `${activeDice.length}d${sides} rolled`;
    }

    resultsListEl.innerHTML = rolls
      .map((val, idx) => {
        const classes = ["rolled-die"];
        if (idx === droppedIndex) classes.push("dropped");
        if (val === sides) classes.push("crit-max");
        else if (val === 1) classes.push("crit-min");
        return `<span class="${classes.join(" ")}">${val}</span>`;
      })
      .join("");

    const label =
      sides === 20 && d20Mode !== "normal"
        ? `2D20(${d20Mode.toUpperCase()}) ${formatMod(modifier)}`
        : `${diceCount}D${sides} ${formatMod(modifier)}`;

    history.unshift({ label, rolls, total: finalTotal });
    renderHistory();
    animateTray();
  }

  dieChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      dieChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      sides = Number(chip.dataset.sides);
      updateControlsUI();
    });
  });

  decCountBtn.addEventListener("click", () => {
    if (diceCount > 1) {
      diceCount -= 1;
      updateControlsUI();
    }
  });

  incCountBtn.addEventListener("click", () => {
    if (diceCount < 10) {
      diceCount += 1;
      updateControlsUI();
    }
  });

  decModBtn.addEventListener("click", () => {
    if (modifier > -10) {
      modifier -= 1;
      updateControlsUI();
    }
  });

  incModBtn.addEventListener("click", () => {
    if (modifier < 15) {
      modifier += 1;
      updateControlsUI();
    }
  });

  advToggle.addEventListener("click", () => {
    if (sides !== 20) return;
    d20Mode = d20Mode === "normal" ? "adv" : d20Mode === "adv" ? "dis" : "normal";
    updateControlsUI();
  });

  rollBtn.addEventListener("click", executeRoll);

  perkBtn.addEventListener("click", () => {
    const roll = rollSingleDie(6);
    formulaEl.textContent = "House D6 Perk";
    totalEl.textContent = String(roll);
    calloutEl.textContent = CAFE_PERKS[roll - 1];
    resultsListEl.innerHTML = `<span class="rolled-die crit-max">${roll}</span>`;
    history.unshift({ label: "Café Perk D6", rolls: [roll], total: roll });
    renderHistory();
    animateTray();
  });

  clearBtn.addEventListener("click", () => {
    history.length = 0;
    renderHistory();
  });

  updateControlsUI();
}

/* --------------------------------------------------------------------------
   4. Membership Billing Toggle
   -------------------------------------------------------------------------- */
let currentBillingCycle = "monthly";

function initMembershipToggle() {
  const billingBtns = document.querySelectorAll(".billing-btn");
  const amounts = document.querySelectorAll(".plan-price .amount");
  const notes = document.querySelectorAll(".billing-note");

  billingBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      billingBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentBillingCycle = btn.dataset.billing || "monthly";

      amounts.forEach((el) => {
        const nextVal = el.dataset[currentBillingCycle];
        if (nextVal) el.textContent = nextVal;
      });

      notes.forEach((note) => {
        const key = currentBillingCycle === "annual" ? "annualText" : "monthlyText";
        if (note.dataset[key]) note.textContent = note.dataset[key];
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Booking & Membership Modal
   -------------------------------------------------------------------------- */
let openActionModal = () => {};

function initModal() {
  const modal = document.getElementById("action-modal");
  const closeBtn = document.getElementById("modal-close");
  const doneBtn = document.getElementById("modal-done-btn");
  const form = document.getElementById("modal-form");
  const formView = document.getElementById("modal-form-view");
  const successView = document.getElementById("modal-success-view");

  const modalTag = document.getElementById("modal-tag");
  const modalTitle = document.getElementById("modal-title");
  const modalSubtitle = document.getElementById("modal-subtitle");
  const submitBtn = document.getElementById("modal-submit-btn");

  const tableFields = document.getElementById("table-fields");
  const gamePrefillRow = document.getElementById("game-prefill-row");
  const requestedGameInput = document.getElementById("requested-game");
  const planSummaryRow = document.getElementById("plan-summary-row");
  const selectedPlanInput = document.getElementById("selected-plan-input");
  const successTitle = document.getElementById("success-title");
  const successMessage = document.getElementById("success-message");

  if (!modal || !form) return;

  let activeMode = "table";

  openActionModal = ({ mode = "table", game = "", plan = "", price = "" } = {}) => {
    activeMode = mode;
    formView.hidden = false;
    successView.hidden = true;
    form.reset();

    if (mode === "membership") {
      modalTag.textContent = "Club Membership";
      modalTitle.textContent = `Join ${plan}`;
      modalSubtitle.textContent = "Complete your details to activate your Roll & Brew member pass at the counter.";
      submitBtn.textContent = "Reserve Membership";
      tableFields.hidden = true;
      gamePrefillRow.hidden = true;
      planSummaryRow.hidden = false;
      selectedPlanInput.value = `${plan} — ${price} (${currentBillingCycle})`;
    } else {
      modalTag.textContent = "Café Reservation";
      modalTitle.textContent = "Book a Table";
      modalSubtitle.textContent = "Lock in your booth and let us know if you'd like a game waiting on the table.";
      submitBtn.textContent = "Confirm Reservation";
      tableFields.hidden = false;
      gamePrefillRow.hidden = false;
      planSummaryRow.hidden = true;
      if (game) requestedGameInput.value = game;
    }

    modal.hidden = false;
    document.getElementById("guest-name")?.focus();
  };

  function closeModal() {
    modal.hidden = true;
  }

  document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const mode = trigger.dataset.openModal;
      if (mode === "membership") {
        const plan = trigger.dataset.plan || "Meeple Regular";
        const price =
          currentBillingCycle === "annual"
            ? trigger.dataset.priceAnnual
            : trigger.dataset.priceMonthly;
        openActionModal({ mode: "membership", plan, price });
      } else {
        openActionModal({
          mode: "table",
          game: trigger.dataset.prefillGame || ""
        });
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const guestName = document.getElementById("guest-name").value.trim() || "Player";
    const guestEmail = document.getElementById("guest-email").value.trim();

    formView.hidden = true;
    successView.hidden = false;

    if (activeMode === "membership") {
      successTitle.textContent = `Welcome to the Guild, ${guestName}!`;
      successMessage.textContent = `We've reserved your ${selectedPlanInput.value} pass and sent pickup instructions to ${guestEmail}. Show this confirmation at the espresso bar for a complimentary welcome pour-over.`;
    } else {
      const party = document.getElementById("party-size").value;
      const arrival = document.getElementById("arrival-time").value;
      const game = requestedGameInput.value.trim();
      successTitle.textContent = `Booth Reserved for ${guestName}`;
      successMessage.textContent = `We've held a table for ${party} players at ${arrival}${
        game ? ` with ${game} set aside` : ""
      }. Confirmation sent to ${guestEmail}.`;
    }
  });

  closeBtn.addEventListener("click", closeModal);
  doneBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
}

/* --------------------------------------------------------------------------
   Footer Newsletter
   -------------------------------------------------------------------------- */
function initNewsletter() {
  const form = document.getElementById("newsletter-form");
  const emailInput = document.getElementById("newsletter-email");
  const feedback = document.getElementById("newsletter-feedback");

  if (!form || !emailInput || !feedback) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) return;
    feedback.textContent = `Subscribed ${email} to Friday Game Night alerts!`;
    emailInput.value = "";
  });
}
