/**
 * Roll & Brew Board Game Café — Weekend Dice Discount & Order Calculator
 * Pure vanilla JavaScript (no jQuery or external UI frameworks).
 */

(function () {
  "use strict";

  /* ========================================================================
     1. CONSTANTS & DATA TABLES
     ======================================================================== */

  /**
   * Days of the week when the dice is active, matching Date.prototype.getDay():
   * 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday.
   * Stored in a named constant array so it can be changed easily.
   */
  const WEEKEND_DAYS = [0, 6];

  /** Maximum allowed discount percentage (never exceeded). */
  const MAX_DISCOUNT_PERCENT = 40;

  /** Duration of the CSS dice roll animation in milliseconds (~1.5 seconds). */
  const ROLL_ANIMATION_MS = 1500;

  /** Key used to persist today's roll in localStorage. */
  const STORAGE_KEY = "rollAndBrewWeekendDice";

  /** Quantity limits for each menu item in the order calculator. */
  const MIN_ITEM_QTY = 0;
  const MAX_ITEM_QTY = 10;

  /**
   * Discount table mapping each dice face (1 to 6) to a reward tier and % off.
   * Rendered dynamically into the page's discount table.
   */
  const DISCOUNT_TABLE = [
    { roll: 1, label: "Warm-Up Sip", discount: 5 },
    { roll: 2, label: "Coffee Boost", discount: 10 },
    { roll: 3, label: "Cozy Table", discount: 20 },
    { roll: 4, label: "Board Master", discount: 25 },
    { roll: 5, label: "Café Regular", discount: 30 },
    { roll: 6, label: "Golden Six Jackpot", discount: 40 }
  ];

  /**
   * Café menu items rendered into the Order Calculator (prices in PKR).
   */
  const MENU_ITEMS = [
    { id: "cappuccino", name: "Cappuccino", category: "Hot Drinks", price: 550 },
    { id: "cold-coffee", name: "Cold Coffee", category: "Cold Drinks", price: 650 },
    { id: "caramel-latte", name: "Caramel Latte", category: "Hot Drinks", price: 620 },
    { id: "mint-lemonade", name: "Mint Lemonade", category: "Cold Drinks", price: 380 },
    { id: "brownie", name: "Fudge Brownie", category: "Bakery", price: 450 },
    { id: "fries", name: "Loaded Masala Fries", category: "Snacks", price: 500 },
    { id: "sandwich", name: "Grilled Club Sandwich", category: "Snacks", price: 850 },
    { id: "table-fee", name: "Game Table Fee (Per Person)", category: "Board Games", price: 400 }
  ];

  /* ========================================================================
     2. APPLICATION STATE & DOM REFERENCES
     ======================================================================== */

  /** Tracks whether a dice roll animation is currently running. */
  let isRolling = false;

  /** Stores current item quantities keyed by item id (e.g. { cappuccino: 2 }). */
  const orderQuantities = {};
  MENU_ITEMS.forEach(function (item) {
    orderQuantities[item.id] = 0;
  });

  /** Reference to the 1-second weekday countdown timer interval. */
  let countdownIntervalId = null;

  /** Cached DOM elements used across functions. */
  const elements = {
    dayStatusBadge: document.getElementById("day-status-badge"),
    diceBox: document.getElementById("dice-box"),
    diceStatusText: document.getElementById("dice-status-text"),
    countdownText: document.getElementById("countdown-text"),
    celebrationBanner: document.getElementById("celebration-banner"),
    diceAriaLive: document.getElementById("dice-aria-live"),
    rollButton: document.getElementById("roll-dice-btn"),
    discountTableBody: document.getElementById("discount-table-body"),
    menuItemsList: document.getElementById("menu-items-list"),
    clearOrderBtn: document.getElementById("clear-order-btn"),
    emptyOrderNotice: document.getElementById("empty-order-notice"),
    selectedItemsList: document.getElementById("selected-items-list"),
    orderSubtotal: document.getElementById("order-subtotal"),
    appliedDiscountBadge: document.getElementById("applied-discount-badge"),
    orderDiscountAmount: document.getElementById("order-discount-amount"),
    orderFinalTotal: document.getElementById("order-final-total"),
    discountValidityNote: document.getElementById("discount-validity-note"),
    confettiContainer: document.getElementById("confetti-container")
  };

  /* ========================================================================
     3. DATE, WEEKEND & COUNTDOWN HELPERS
     ======================================================================== */

  /**
   * Returns true if the given Date falls on one of the configured WEEKEND_DAYS.
   * @param {Date} [date=new Date()] - Visitor's local Date object.
   * @returns {boolean}
   */
  function isWeekend(date) {
    const targetDate = date || new Date();
    return WEEKEND_DAYS.includes(targetDate.getDay());
  }

  /**
   * Formats a Date into a local calendar string ("YYYY-MM-DD").
   * Uses local year/month/day instead of UTC to avoid timezone rollover bugs.
   * @param {Date} [date=new Date()]
   * @returns {string}
   */
  function getLocalDateString(date) {
    const targetDate = date || new Date();
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  /**
   * Finds the Date/time of the next upcoming Saturday at 00:00:00 (or next
   * enabled weekend day if WEEKEND_DAYS is customized).
   * @param {Date} [fromDate=new Date()]
   * @returns {Date}
   */
  function getNextWeekendStart(fromDate) {
    const now = fromDate || new Date();
    // Search up to 7 days ahead starting from tomorrow at 00:00:00.
    for (let offset = 1; offset <= 7; offset += 1) {
      const candidate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + offset,
        0,
        0,
        0,
        0
      );
      if (WEEKEND_DAYS.includes(candidate.getDay())) {
        return candidate;
      }
    }
    // Fallback to next Saturday if WEEKEND_DAYS was emptied.
    const daysUntilSaturday = (6 - now.getDay() + 7) % 7 || 7;
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSaturday, 0, 0, 0, 0);
  }

  /**
   * Formats milliseconds remaining into a human-readable "Xd Xh Xm Xs" string.
   * @param {number} msRemaining
   * @returns {string}
   */
  function formatCountdown(msRemaining) {
    const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return (
      days + "d " +
      String(hours).padStart(2, "0") + "h " +
      String(minutes).padStart(2, "0") + "m " +
      String(seconds).padStart(2, "0") + "s"
    );
  }

  /**
   * Updates the weekday countdown display to the next Saturday 00:00.
   */
  function updateCountdownDisplay() {
    const now = new Date();
    if (isWeekend(now)) {
      elements.countdownText.classList.add("d-none");
      return;
    }

    const nextWeekend = getNextWeekendStart(now);
    const remainingMs = nextWeekend.getTime() - now.getTime();
    elements.countdownText.textContent = "Next roll opens in: " + formatCountdown(remainingMs);
    elements.countdownText.classList.remove("d-none");
  }

  /**
   * Starts or stops the 1-second weekday countdown timer depending on the day.
   */
  function syncCountdownTimer() {
    if (isWeekend(new Date())) {
      if (countdownIntervalId !== null) {
        clearInterval(countdownIntervalId);
        countdownIntervalId = null;
      }
      elements.countdownText.classList.add("d-none");
    } else {
      updateCountdownDisplay();
      if (countdownIntervalId === null) {
        countdownIntervalId = setInterval(function () {
          // If the clock just crossed into a weekend, refresh the entire UI.
          if (isWeekend(new Date())) {
            refreshPageState();
          } else {
            updateCountdownDisplay();
          }
        }, 1000);
      }
    }
  }

  /* ========================================================================
     4. DISCOUNT LOOKUP & SAFE LOCALSTORAGE PERSISTENCE
     ======================================================================== */

  /**
   * Looks up the discount percentage for a roll (1-6) and enforces the 40% cap.
   * @param {number} rollNumber
   * @returns {number} Discount percentage between 0 and MAX_DISCOUNT_PERCENT.
   */
  function getDiscountForRoll(rollNumber) {
    const entry = DISCOUNT_TABLE.find(function (row) {
      return row.roll === rollNumber;
    });
    if (!entry) {
      return 0;
    }
    return Math.min(entry.discount, MAX_DISCOUNT_PERCENT);
  }

  /**
   * Safely reads and validates the saved roll from localStorage.
   * If data is missing, malformed, or tampered with, resets safely to null.
   * @returns {{ number: number, discount: number, date: string } | null}
   */
  function loadSavedRoll() {
    try {
      const rawValue = localStorage.getItem(STORAGE_KEY);
      if (!rawValue) {
        return null;
      }

      const parsed = JSON.parse(rawValue);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        resetSavedRoll();
        return null;
      }

      const isValidNumber =
        typeof parsed.number === "number" &&
        Number.isInteger(parsed.number) &&
        parsed.number >= 1 &&
        parsed.number <= 6;

      const isValidDate =
        typeof parsed.date === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(parsed.date);

      const expectedDiscount = isValidNumber ? getDiscountForRoll(parsed.number) : -1;
      const isValidDiscount =
        typeof parsed.discount === "number" &&
        Number.isFinite(parsed.discount) &&
        parsed.discount >= 0 &&
        parsed.discount <= MAX_DISCOUNT_PERCENT &&
        parsed.discount === expectedDiscount;

      if (!isValidNumber || !isValidDate || !isValidDiscount) {
        resetSavedRoll();
        return null;
      }

      return {
        number: parsed.number,
        discount: Math.min(parsed.discount, MAX_DISCOUNT_PERCENT),
        date: parsed.date
      };
    } catch (error) {
      // Handles corrupted JSON or blocked storage without crashing the page.
      resetSavedRoll();
      return null;
    }
  }

  /**
   * Saves a verified roll result (number, capped discount, local date) to localStorage.
   * @param {number} number - Rolled number 1 to 6.
   * @param {number} discount - Discount percent (capped at 40).
   * @param {string} dateStr - Local date string "YYYY-MM-DD".
   */
  function saveRoll(number, discount, dateStr) {
    const safeDiscount = Math.min(Math.max(0, discount), MAX_DISCOUNT_PERCENT);
    const payload = {
      number: number,
      discount: safeDiscount,
      date: dateStr
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      // Storage quota or privacy mode errors are ignored gracefully.
    }
  }

  /**
   * Removes corrupted or invalid saved roll data from localStorage.
   */
  function resetSavedRoll() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Ignore storage access errors.
    }
  }

  /**
   * Checks whether a saved roll is valid for today's date AND today is a weekend.
   * @param {{ number: number, discount: number, date: string } | null} savedRoll
   * @param {Date} [now=new Date()]
   * @returns {boolean}
   */
  function isSavedRollValidToday(savedRoll, now) {
    const currentDate = now || new Date();
    if (!savedRoll || !isWeekend(currentDate)) {
      return false;
    }
    return savedRoll.date === getLocalDateString(currentDate);
  }

  /**
   * Returns the active discount percentage for today (0 if not rolled or weekday).
   * @returns {number}
   */
  function getActiveDiscountPercent() {
    const now = new Date();
    const savedRoll = loadSavedRoll();
    if (isSavedRollValidToday(savedRoll, now)) {
      return Math.min(savedRoll.discount, MAX_DISCOUNT_PERCENT);
    }
    return 0;
  }

  /* ========================================================================
     5. ACCESSIBILITY, ANIMATION & CONFETTI HELPERS
     ======================================================================== */

  /**
   * Returns true if the visitor has enabled "prefers-reduced-motion" in their OS/browser.
   * @returns {boolean}
   */
  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  /**
   * Sends a polite screen-reader announcement via the aria-live region.
   * @param {string} message
   */
  function announceToScreenReader(message) {
    if (!elements.diceAriaLive) {
      return;
    }
    // Clear first so identical consecutive announcements still trigger if needed.
    elements.diceAriaLive.textContent = "";
    window.setTimeout(function () {
      elements.diceAriaLive.textContent = message;
    }, 30);
  }

  /**
   * Updates the CSS dice face attribute (1..6) so the corresponding dots are shown.
   * @param {number} faceNumber
   */
  function setDiceFace(faceNumber) {
    elements.diceBox.setAttribute("data-face", String(faceNumber));
  }

  /**
   * Launches a lightweight vanilla JS + CSS confetti celebration when rolling a 6.
   * Skipped automatically when prefers-reduced-motion is enabled.
   */
  function triggerConfetti() {
    if (prefersReducedMotion() || !elements.confettiContainer) {
      return;
    }

    const colors = ["#3B2418", "#C88A4B", "#E8B86D", "#9A3412", "#246A3B", "#FAF3E8"];
    const pieceCount = 45;

    for (let i = 0; i < pieceCount; i += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.backgroundColor = colors[i % colors.length];
      piece.style.animationDuration = (1.6 + Math.random() * 1.2).toFixed(2) + "s";
      piece.style.animationDelay = (Math.random() * 0.25).toFixed(2) + "s";
      elements.confettiContainer.appendChild(piece);
    }

    // Clean up confetti DOM elements after animation completes.
    window.setTimeout(function () {
      elements.confettiContainer.textContent = "";
    }, 3200);
  }

  /* ========================================================================
     6. DISCOUNT TABLE & DICE UI RENDERING
     ======================================================================== */

  /**
   * Renders the discount table rows from DISCOUNT_TABLE and highlights the winning row.
   * @param {number | null} winningRoll - Rolled number (1-6) for today, or null.
   */
  function renderDiscountTable(winningRoll) {
    elements.discountTableBody.textContent = "";

    DISCOUNT_TABLE.forEach(function (entry) {
      const tr = document.createElement("tr");
      const isWinner = winningRoll === entry.roll;
      if (isWinner) {
        tr.classList.add("winning-row");
      }

      // Column 1: Dice roll number badge
      const rollTd = document.createElement("td");
      const rollBadge = document.createElement("span");
      rollBadge.className = "roll-number-badge";
      rollBadge.textContent = String(entry.roll);
      rollTd.appendChild(rollBadge);

      // Column 2: Reward tier label + optional "Won!" badge
      const labelTd = document.createElement("td");
      labelTd.textContent = entry.label;
      if (isWinner) {
        const wonBadge = document.createElement("span");
        wonBadge.className = "won-badge";
        wonBadge.textContent = "Your Roll";
        labelTd.appendChild(wonBadge);
      }

      // Column 3: Discount percentage
      const discountTd = document.createElement("td");
      discountTd.className = "text-end fw-semibold";
      discountTd.textContent = Math.min(entry.discount, MAX_DISCOUNT_PERCENT) + "% off";

      tr.appendChild(rollTd);
      tr.appendChild(labelTd);
      tr.appendChild(discountTd);
      elements.discountTableBody.appendChild(tr);
    });
  }

  /**
   * Synchronizes the dice card, roll button, weekday/weekend banners, discount table,
   * and order calculator with the current date and localStorage state.
   */
  function refreshPageState() {
    const now = new Date();
    const weekendActive = isWeekend(now);
    const savedRoll = loadSavedRoll();
    const rolledToday = isSavedRollValidToday(savedRoll, now);

    // Update top hero status pill
    if (weekendActive) {
      elements.dayStatusBadge.textContent = "Weekend Special Active!";
      elements.dayStatusBadge.classList.add("is-weekend");
    } else {
      elements.dayStatusBadge.textContent = "Weekday — Dice Resting";
      elements.dayStatusBadge.classList.remove("is-weekend");
    }

    if (!weekendActive) {
      // Weekday state: disable Roll button, grey out dice, show message + countdown
      elements.rollButton.disabled = true;
      elements.diceBox.classList.add("dice-disabled");
      elements.diceBox.setAttribute("aria-disabled", "true");
      elements.diceStatusText.textContent = "The dice sleeps on weekdays! Come back Saturday";
      elements.celebrationBanner.classList.add("d-none");
      renderDiscountTable(null);
    } else if (rolledToday) {
      // Weekend & already rolled today: lock roll button and show today's saved roll
      elements.rollButton.disabled = true;
      elements.diceBox.classList.remove("dice-disabled");
      elements.diceBox.setAttribute("aria-disabled", "true");
      setDiceFace(savedRoll.number);
      elements.diceStatusText.textContent =
        "You already rolled today. Your discount: " + savedRoll.discount + "%";

      if (savedRoll.number === 6) {
        elements.celebrationBanner.classList.remove("d-none");
      } else {
        elements.celebrationBanner.classList.add("d-none");
      }

      renderDiscountTable(savedRoll.number);
    } else {
      // Weekend & eligible to roll today
      elements.rollButton.disabled = isRolling;
      elements.diceBox.classList.remove("dice-disabled");
      elements.diceBox.setAttribute("aria-disabled", isRolling ? "true" : "false");
      if (!isRolling) {
        elements.diceStatusText.textContent = "It's the weekend! Click below to roll for today's discount.";
        elements.celebrationBanner.classList.add("d-none");
      }
      renderDiscountTable(null);
    }

    syncCountdownTimer();
    updateOrderSummary();
  }

  /* ========================================================================
     7. DICE ROLLING LOGIC
     ======================================================================== */

  /**
   * Executes a dice roll if today is a weekend and the user has not rolled today.
   * Plays a 1.5s CSS animation (unless reduced motion is requested), picks 1-6,
   * saves to localStorage, updates the UI, and triggers confetti on a 6.
   */
  function handleRollDice() {
    const now = new Date();
    const existingRoll = loadSavedRoll();

    if (isRolling || !isWeekend(now) || isSavedRollValidToday(existingRoll, now)) {
      return;
    }

    isRolling = true;
    elements.rollButton.disabled = true;
    elements.diceBox.setAttribute("aria-disabled", "true");
    elements.celebrationBanner.classList.add("d-none");
    elements.diceStatusText.textContent = "Rolling the dice...";

    const skipAnimation = prefersReducedMotion();
    const duration = skipAnimation ? 0 : ROLL_ANIMATION_MS;
    let previewTimerId = null;

    if (!skipAnimation) {
      elements.diceBox.classList.add("dice-rolling");
      // Briefly cycle dots during the roll animation for visual realism.
      previewTimerId = window.setInterval(function () {
        const previewFace = Math.floor(Math.random() * 6) + 1;
        setDiceFace(previewFace);
      }, 150);
    }

    window.setTimeout(function () {
      if (previewTimerId !== null) {
        clearInterval(previewTimerId);
      }
      elements.diceBox.classList.remove("dice-rolling");

      // Generate random integer 1..6 using Math.random()
      const rolledNumber = Math.floor(Math.random() * 6) + 1;
      const discountPercent = getDiscountForRoll(rolledNumber);
      const todayString = getLocalDateString(new Date());

      setDiceFace(rolledNumber);
      saveRoll(rolledNumber, discountPercent, todayString);
      isRolling = false;

      if (rolledNumber === 6) {
        triggerConfetti();
      }

      refreshPageState();
      announceToScreenReader(
        "You rolled a " + rolledNumber + ". Your discount is " + discountPercent + " percent."
      );
    }, duration);
  }

  /* ========================================================================
     8. ORDER CALCULATOR LOGIC
     ======================================================================== */

  /**
   * Formats a number as Pakistani Rupees (e.g., "PKR 1,250").
   * @param {number} amount
   * @returns {string}
   */
  function formatPKR(amount) {
    return "PKR " + Math.round(amount).toLocaleString("en-PK");
  }

  /**
   * Renders the café menu item cards with accessible +/- quantity controls.
   */
  function renderMenuItems() {
    elements.menuItemsList.textContent = "";

    MENU_ITEMS.forEach(function (item) {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6";
      col.setAttribute("role", "listitem");

      const card = document.createElement("div");
      card.className = "menu-item-card";

      // Top section: category, title, price
      const infoDiv = document.createElement("div");
      const categorySpan = document.createElement("span");
      categorySpan.className = "menu-category-tag d-block";
      categorySpan.textContent = item.category;

      const nameHeading = document.createElement("h3");
      nameHeading.className = "h6 fw-bold mb-1";
      nameHeading.textContent = item.name;

      const pricePara = document.createElement("p");
      pricePara.className = "mb-0 fw-semibold text-muted-cafe small";
      pricePara.textContent = formatPKR(item.price);

      infoDiv.appendChild(categorySpan);
      infoDiv.appendChild(nameHeading);
      infoDiv.appendChild(pricePara);

      // Bottom section: quantity - / value / + buttons
      const controlsRow = document.createElement("div");
      controlsRow.className = "d-flex justify-content-between align-items-center";

      const qtyControls = document.createElement("div");
      qtyControls.className = "qty-controls";

      const minusBtn = document.createElement("button");
      minusBtn.type = "button";
      minusBtn.className = "qty-btn";
      minusBtn.textContent = "−";
      minusBtn.setAttribute("aria-label", "Decrease quantity of " + item.name);
      minusBtn.dataset.itemId = item.id;
      minusBtn.dataset.action = "decrease";
      minusBtn.disabled = true;

      const qtyDisplay = document.createElement("span");
      qtyDisplay.className = "qty-value";
      qtyDisplay.id = "qty-" + item.id;
      qtyDisplay.textContent = "0";
      qtyDisplay.setAttribute("aria-live", "polite");

      const plusBtn = document.createElement("button");
      plusBtn.type = "button";
      plusBtn.className = "qty-btn";
      plusBtn.textContent = "+";
      plusBtn.setAttribute("aria-label", "Increase quantity of " + item.name);
      plusBtn.dataset.itemId = item.id;
      plusBtn.dataset.action = "increase";

      qtyControls.appendChild(minusBtn);
      qtyControls.appendChild(qtyDisplay);
      qtyControls.appendChild(plusBtn);

      const lineTotal = document.createElement("span");
      lineTotal.className = "small fw-bold";
      lineTotal.id = "line-total-" + item.id;
      lineTotal.textContent = formatPKR(0);

      controlsRow.appendChild(qtyControls);
      controlsRow.appendChild(lineTotal);

      card.appendChild(infoDiv);
      card.appendChild(controlsRow);
      col.appendChild(card);
      elements.menuItemsList.appendChild(col);
    });
  }

  /**
   * Changes the quantity of a single menu item while enforcing [0, 10] bounds.
   * @param {string} itemId
   * @param {number} delta - +1 or -1.
   */
  function updateItemQuantity(itemId, delta) {
    if (!Object.prototype.hasOwnProperty.call(orderQuantities, itemId)) {
      return;
    }

    const currentQty = orderQuantities[itemId];
    const nextQty = Math.min(MAX_ITEM_QTY, Math.max(MIN_ITEM_QTY, currentQty + delta));
    if (nextQty === currentQty) {
      return;
    }

    orderQuantities[itemId] = nextQty;
    syncMenuItemControls(itemId);
    updateOrderSummary();
  }

  /**
   * Updates the displayed quantity, line total, and button disabled states for one item.
   * @param {string} itemId
   */
  function syncMenuItemControls(itemId) {
    const item = MENU_ITEMS.find(function (entry) {
      return entry.id === itemId;
    });
    if (!item) {
      return;
    }

    const qty = orderQuantities[itemId];
    const qtyEl = document.getElementById("qty-" + itemId);
    const lineTotalEl = document.getElementById("line-total-" + itemId);
    const decreaseBtn = elements.menuItemsList.querySelector(
      'button[data-item-id="' + itemId + '"][data-action="decrease"]'
    );
    const increaseBtn = elements.menuItemsList.querySelector(
      'button[data-item-id="' + itemId + '"][data-action="increase"]'
    );

    if (qtyEl) {
      qtyEl.textContent = String(qty);
    }
    if (lineTotalEl) {
      lineTotalEl.textContent = formatPKR(item.price * qty);
    }
    if (decreaseBtn) {
      decreaseBtn.disabled = qty <= MIN_ITEM_QTY;
    }
    if (increaseBtn) {
      increaseBtn.disabled = qty >= MAX_ITEM_QTY;
    }
  }

  /**
   * Resets all menu item quantities back to 0.
   */
  function clearOrder() {
    MENU_ITEMS.forEach(function (item) {
      orderQuantities[item.id] = 0;
      syncMenuItemControls(item.id);
    });
    updateOrderSummary();
  }

  /**
   * Recalculates subtotal, active weekend discount, discount amount, and final total.
   * Handles empty orders ("Your order is empty" and total 0).
   */
  function updateOrderSummary() {
    let subtotal = 0;
    let totalItemCount = 0;
    elements.selectedItemsList.textContent = "";

    MENU_ITEMS.forEach(function (item) {
      const qty = orderQuantities[item.id];
      if (qty > 0) {
        const lineSubtotal = item.price * qty;
        subtotal += lineSubtotal;
        totalItemCount += qty;

        const li = document.createElement("li");
        const nameSpan = document.createElement("span");
        nameSpan.textContent = item.name + " × " + qty;

        const priceSpan = document.createElement("span");
        priceSpan.className = "fw-semibold";
        priceSpan.textContent = formatPKR(lineSubtotal);

        li.appendChild(nameSpan);
        li.appendChild(priceSpan);
        elements.selectedItemsList.appendChild(li);
      }
    });

    const discountPercent = getActiveDiscountPercent();
    const isEmpty = totalItemCount === 0;

    elements.clearOrderBtn.disabled = isEmpty;

    if (isEmpty) {
      elements.emptyOrderNotice.classList.remove("d-none");
      elements.selectedItemsList.classList.add("d-none");
      elements.orderSubtotal.textContent = formatPKR(0);
      elements.appliedDiscountBadge.textContent = discountPercent + "%";
      elements.orderDiscountAmount.textContent = "- " + formatPKR(0);
      elements.orderFinalTotal.textContent = formatPKR(0);
    } else {
      elements.emptyOrderNotice.classList.add("d-none");
      elements.selectedItemsList.classList.remove("d-none");

      const discountAmount = Math.round((subtotal * discountPercent) / 100);
      const finalTotal = Math.max(0, subtotal - discountAmount);

      elements.orderSubtotal.textContent = formatPKR(subtotal);
      elements.appliedDiscountBadge.textContent = discountPercent + "%";
      elements.orderDiscountAmount.textContent = "- " + formatPKR(discountAmount);
      elements.orderFinalTotal.textContent = formatPKR(finalTotal);
    }

    // Explain discount eligibility clearly below the total
    if (!isWeekend(new Date())) {
      elements.discountValidityNote.textContent =
        "Weekend discount is inactive on weekdays (Saturday & Sunday rolls only).";
    } else if (discountPercent > 0) {
      elements.discountValidityNote.textContent =
        "Your " + discountPercent + "% weekend discount is applied automatically for today.";
    } else {
      elements.discountValidityNote.textContent =
        "Roll the weekend dice above to unlock your discount for today!";
    }
  }

  /* ========================================================================
     9. EVENT LISTENERS & INITIALIZATION
     ======================================================================== */

  /**
   * Attaches click and keyboard listeners and starts the periodic 1-minute date check.
   */
  function init() {
    renderMenuItems();
    refreshPageState();

    // Roll button click (native button also triggers on Enter/Space)
    elements.rollButton.addEventListener("click", handleRollDice);

    // Allow clicking or pressing Enter/Space directly on the dice graphic
    elements.diceBox.addEventListener("click", handleRollDice);
    elements.diceBox.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleRollDice();
      }
    });

    // Event delegation for menu +/- quantity buttons
    elements.menuItemsList.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-item-id]");
      if (!button) {
        return;
      }
      const itemId = button.dataset.itemId;
      const delta = button.dataset.action === "increase" ? 1 : -1;
      updateItemQuantity(itemId, delta);
    });

    // Clear order button
    elements.clearOrderBtn.addEventListener("click", clearOrder);

    // Re-check date every minute while the page stays open (e.g., midnight rollover)
    window.setInterval(refreshPageState, 60000);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
