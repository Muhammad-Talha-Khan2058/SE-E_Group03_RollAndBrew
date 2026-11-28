(() => {
  "use strict";

  const STORAGE_KEYS = {
    MEMBERSHIP: "rollAndBrew_membership",
    BILLING: "rollAndBrew_billingCycle"
  };

  const HOURLY_TABLE_RATE_PKR = 350;
  const AVG_HOURS_PER_VISIT = 2;

  const MEMBERSHIP_TIERS = [
    {
      id: "pawn",
      name: "Pawn",
      tagline: "Great for casual weekend board gamers",
      monthlyPrice: 1500,
      yearlyPrice: 14400,
      discountPercent: 10,
      freeTableHours: 6,
      highlighted: false,
      priorityBooking: "24-hour advance booking",
      guestPassesPerMonth: 1,
      tournamentEntry: "Standard entry",
      perks: [
        "6 free table hours every month",
        "10% off all coffee, tea & café food",
        "1 free guest table pass per month",
        "24-hour advance table reservations"
      ]
    },
    {
      id: "knight",
      name: "Knight",
      tagline: "Our community favorite for regular game nights",
      monthlyPrice: 2800,
      yearlyPrice: 26880,
      discountPercent: 15,
      freeTableHours: 14,
      highlighted: true,
      priorityBooking: "72-hour priority booking",
      guestPassesPerMonth: 2,
      tournamentEntry: "20% off tournament entry",
      perks: [
        "14 free table hours every month",
        "15% off all coffee, tea & café food",
        "2 free guest table passes per month",
        "72-hour priority weekend table booking",
        "20% off monthly café tournaments"
      ]
    },
    {
      id: "king",
      name: "King",
      tagline: "Unlimited-feel perks for serious strategists",
      monthlyPrice: 4500,
      yearlyPrice: 43200,
      discountPercent: 25,
      freeTableHours: 30,
      highlighted: false,
      priorityBooking: "7-day VIP booth priority",
      guestPassesPerMonth: 4,
      tournamentEntry: "Free entry to all tournaments",
      perks: [
        "30 free table hours every month",
        "25% off all coffee, tea & café food",
        "4 free guest table passes per month",
        "7-day VIP booth & campaign room booking",
        "Free entry to all Roll & Brew tournaments",
        "Complimentary birthday brew platter"
      ]
    }
  ];

  const FAQ_ITEMS = [
    {
      id: "faq-1",
      question: "How do free monthly table hours work?",
      answer:
        "Each membership tier includes a set number of free table hours per calendar month. Simply show your digital membership card when you check in at Roll & Brew, and our hosts will deduct your table time automatically."
    },
    {
      id: "faq-2",
      question: "Does my café discount apply to both drinks and food?",
      answer:
        "Yes! Your member discount (10%, 15%, or 25% depending on your tier) applies to your entire food and beverage bill, including specialty coffees, iced brews, snacks, and sharing platters."
    },
    {
      id: "faq-3",
      question: "Can I bring friends who aren't members?",
      answer:
        "Absolutely. Every tier includes monthly guest passes so friends can join your table without paying the walk-in table fee. Additional guests simply pay the standard hourly table rate."
    },
    {
      id: "faq-4",
      question: "What happens if I switch from Monthly to Yearly billing?",
      answer:
        "Yearly billing locks in a 20% discount compared to paying month-to-month. You can switch your plan or billing preference anytime using the Upgrade / Switch option on your membership."
    },
    {
      id: "faq-5",
      question: "Can I upgrade or cancel my membership later?",
      answer:
        "Yes. You can upgrade your tier whenever you want to unlock extra table hours and deeper café discounts, or cancel your membership at any time with no cancellation penalties."
    },
    {
      id: "faq-6",
      question: "Do unused free table hours roll over to next month?",
      answer:
        "Free table hours reset on your monthly renewal date so our tables stay fairly available for all club members. Our savings calculator can help you pick a tier that matches your usual visit pace."
    }
  ];

  // State
  let billingCycle = loadBillingCycle();
  let currentMembership = loadMembership();
  let recommendedTierId = null;
  let signupModalInstance = null;
  let cancelModalInstance = null;

  const touchedFields = new Set();

  // DOM References
  const dom = {
    billingToggle: document.getElementById("billingToggle"),
    monthlyLabelBtn: document.getElementById("monthlyLabelBtn"),
    yearlyLabelBtn: document.getElementById("yearlyLabelBtn"),
    toggleSaveBadge: document.getElementById("toggleSaveBadge"),
    plansGrid: document.getElementById("plansGrid"),
    compareTableHead: document.getElementById("compareTableHead"),
    compareTableBody: document.getElementById("compareTableBody"),
    calcVisits: document.getElementById("calcVisits"),
    calcSpend: document.getElementById("calcSpend"),
    calcResultBox: document.getElementById("calcResultBox"),
    faqAccordion: document.getElementById("faqAccordion"),
    memberCardSection: document.getElementById("memberCardSection"),
    heroViewCardBtn: document.getElementById("heroViewCardBtn"),
    heroEyebrow: document.getElementById("heroEyebrow"),
    heroPitch: document.getElementById("heroPitch"),
    cardPlanBadge: document.getElementById("cardPlanBadge"),
    cardMemberName: document.getElementById("cardMemberName"),
    cardMemberId: document.getElementById("cardMemberId"),
    cardStartDate: document.getElementById("cardStartDate"),
    cardRenewalDate: document.getElementById("cardRenewalDate"),
    memberWelcomeHeading: document.getElementById("memberWelcomeHeading"),
    memberStatusSummary: document.getElementById("memberStatusSummary"),
    upgradePlanBtn: document.getElementById("upgradePlanBtn"),
    cancelMembershipBtn: document.getElementById("cancelMembershipBtn"),
    confirmCancelBtn: document.getElementById("confirmCancelBtn"),
    signupModalEl: document.getElementById("signupModal"),
    cancelModalEl: document.getElementById("cancelModal"),
    signupForm: document.getElementById("signupForm"),
    signupModalLabel: document.getElementById("signupModalLabel"),
    modalModeTag: document.getElementById("modalModeTag"),
    memberName: document.getElementById("memberName"),
    memberEmail: document.getElementById("memberEmail"),
    memberPhone: document.getElementById("memberPhone"),
    memberPlan: document.getElementById("memberPlan"),
    memberBillingCycle: document.getElementById("memberBillingCycle"),
    memberStartDate: document.getElementById("memberStartDate"),
    agreeTerms: document.getElementById("agreeTerms"),
    modalPriceSummary: document.getElementById("modalPriceSummary"),
    submitSignupBtn: document.getElementById("submitSignupBtn")
  };

  function formatPKR(amount) {
    return `PKR ${Math.round(amount).toLocaleString("en-PK")}`;
  }

  function getYearlyDiscountPercent(tier) {
    const fullYearly = tier.monthlyPrice * 12;
    return Math.round(((fullYearly - tier.yearlyPrice) / fullYearly) * 100);
  }

  function getTodayISO() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function calculateRenewalDate(startISO, cycle) {
    const [year, month, day] = startISO.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (cycle === "yearly") {
      date.setFullYear(date.getFullYear() + 1);
    } else {
      const targetMonth = date.getMonth() + 1;
      date.setMonth(targetMonth);
      // Guard against month-end rollover (e.g., Jan 31 -> Mar 3)
      if (date.getMonth() !== targetMonth % 12) {
        date.setDate(0);
      }
    }
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function formatReadableDate(isoDate) {
    if (!isoDate) return "—";
    const [year, month, day] = isoDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function generateMemberId(tierId) {
    const prefix = tierId.slice(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `RB-${prefix}-${year}-${randomNum}`;
  }

  function loadBillingCycle() {
    const saved = localStorage.getItem(STORAGE_KEYS.BILLING);
    return saved === "yearly" ? "yearly" : "monthly";
  }

  function saveBillingCycle(cycle) {
    localStorage.setItem(STORAGE_KEYS.BILLING, cycle);
  }

  function loadMembership() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.MEMBERSHIP);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.planId || !parsed.memberId) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function saveMembership(membership) {
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIP, JSON.stringify(membership));
  }

  function clearMembership() {
    localStorage.removeItem(STORAGE_KEYS.MEMBERSHIP);
  }

  function getTierById(id) {
    return MEMBERSHIP_TIERS.find((tier) => tier.id === id) || MEMBERSHIP_TIERS[0];
  }

  function getNextUpgradeTier(currentTierId) {
    const idx = MEMBERSHIP_TIERS.findIndex((t) => t.id === currentTierId);
    if (idx === -1 || idx >= MEMBERSHIP_TIERS.length - 1) return null;
    return MEMBERSHIP_TIERS[idx + 1];
  }

  // Rendering: Billing Toggle
  function syncBillingToggleUI() {
    const isYearly = billingCycle === "yearly";
    dom.billingToggle.checked = isYearly;
    dom.monthlyLabelBtn.classList.toggle("active", !isYearly);
    dom.yearlyLabelBtn.classList.toggle("active", isYearly);

    const maxSave = Math.max(...MEMBERSHIP_TIERS.map(getYearlyDiscountPercent));
    dom.toggleSaveBadge.textContent = `Save ${maxSave}%`;
  }

  // Rendering: Plans Grid
  function renderPlans() {
    const isYearly = billingCycle === "yearly";
    dom.plansGrid.innerHTML = "";

    MEMBERSHIP_TIERS.forEach((tier) => {
      const col = document.createElement("div");
      col.className = "col-md-6 col-lg-4";

      const isCurrentPlan = Boolean(currentMembership && currentMembership.planId === tier.id);
      const isRecommended = recommendedTierId === tier.id;
      const savePercent = getYearlyDiscountPercent(tier);
      const displayPrice = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
      const periodText = isYearly ? "/year" : "/month";
      const effectiveMonthly = Math.round(tier.yearlyPrice / 12);
      const subpriceText = isYearly
        ? `Save ${savePercent}% (${formatPKR(effectiveMonthly)}/mo effective)`
        : `Or ${formatPKR(tier.yearlyPrice)}/yr (Save ${savePercent}%)`;

      const cardClasses = ["plan-card"];
      if (tier.highlighted) cardClasses.push("plan-highlighted");
      if (isRecommended) cardClasses.push("plan-recommended");

      let badgesHtml = "";
      if (tier.highlighted) {
        badgesHtml += `<span class="badge-popular">Most Popular</span>`;
      }
      if (isRecommended) {
        badgesHtml += `<span class="badge-recommended">Recommended for you</span>`;
      }
      if (isCurrentPlan) {
        badgesHtml += `<span class="badge-current">Your Current Plan</span>`;
      }

      let buttonLabel = `Join ${tier.name}`;
      if (currentMembership) {
        if (isCurrentPlan) {
          buttonLabel = "Current Plan";
        } else {
          const currentIdx = MEMBERSHIP_TIERS.findIndex((t) => t.id === currentMembership.planId);
          const thisIdx = MEMBERSHIP_TIERS.findIndex((t) => t.id === tier.id);
          buttonLabel = thisIdx > currentIdx ? `Upgrade to ${tier.name}` : `Switch to ${tier.name}`;
        }
      }

      const perksHtml = tier.perks
        .map(
          (perk) =>
            `<li><span class="perk-check" aria-hidden="true">&#10003;</span><span>${perk}</span></li>`
        )
        .join("");

      col.innerHTML = `
        <article class="${cardClasses.join(" ")}" data-tier-id="${tier.id}">
          <div class="plan-badges">${badgesHtml}</div>
          <h3 class="plan-name">${tier.name}</h3>
          <p class="plan-tagline">${tier.tagline}</p>

          <div class="plan-price-wrap">
            <div class="plan-price">
              ${formatPKR(displayPrice)} <span class="plan-period">${periodText}</span>
            </div>
            <div class="plan-subprice">${subpriceText}</div>
          </div>

          <div class="plan-highlights">
            <div class="plan-stat">
              <span class="plan-stat-value">${tier.freeTableHours} hrs</span>
              <span class="plan-stat-label">Free table/mo</span>
            </div>
            <div class="plan-stat">
              <span class="plan-stat-value">${tier.discountPercent}% off</span>
              <span class="plan-stat-label">Food &amp; drinks</span>
            </div>
          </div>

          <ul class="plan-perks">${perksHtml}</ul>

          <button
            type="button"
            class="btn btn-cafe-primary w-100 join-plan-btn"
            data-plan-id="${tier.id}"
            ${isCurrentPlan ? "disabled" : ""}
          >
            ${buttonLabel}
          </button>
        </article>
      `;

      dom.plansGrid.appendChild(col);
    });

    dom.plansGrid.querySelectorAll(".join-plan-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        openSignupModal(btn.dataset.planId);
      });
    });
  }

  // Rendering: Comparison Table
  function renderCompareTable() {
    const headerCols = MEMBERSHIP_TIERS.map((tier) => {
      const popularTag = tier.highlighted ? ' <span class="badge bg-warning text-dark ms-1">Popular</span>' : "";
      return `<th scope="col" class="text-center">${tier.name}${popularTag}</th>`;
    }).join("");

    dom.compareTableHead.innerHTML = `
      <tr>
        <th scope="col">Feature</th>
        ${headerCols}
      </tr>
    `;

    const rows = [
      {
        label: "Monthly Price",
        render: (t) => formatPKR(t.monthlyPrice)
      },
      {
        label: "Yearly Price",
        render: (t) => `${formatPKR(t.yearlyPrice)} <small class="text-success fw-semibold">(Save ${getYearlyDiscountPercent(t)}%)</small>`
      },
      {
        label: "Free Table Hours / Month",
        render: (t) => `<strong>${t.freeTableHours} hours</strong>`
      },
      {
        label: "Café Food & Drink Discount",
        render: (t) => `<strong>${t.discountPercent}%</strong>`
      },
      {
        label: "Guest Table Passes / Month",
        render: (t) => `${t.guestPassesPerMonth} guest${t.guestPassesPerMonth > 1 ? "s" : ""}`
      },
      {
        label: "Table Reservations",
        render: (t) => t.priorityBooking
      },
      {
        label: "Tournaments & Events",
        render: (t) => t.tournamentEntry
      }
    ];

    dom.compareTableBody.innerHTML = rows
      .map((row) => {
        const cells = MEMBERSHIP_TIERS.map(
          (tier) => `<td class="text-center">${row.render(tier)}</td>`
        ).join("");
        return `
          <tr>
            <th scope="row">${row.label}</th>
            ${cells}
          </tr>
        `;
      })
      .join("");
  }

  // Rendering: Savings Calculator
  function updateSavingsCalculator() {
    const rawVisits = parseFloat(dom.calcVisits.value);
    const rawSpend = parseFloat(dom.calcSpend.value);

    const visits = Number.isFinite(rawVisits) && rawVisits >= 0 ? rawVisits : 0;
    const spend = Number.isFinite(rawSpend) && rawSpend >= 0 ? rawSpend : 0;
    const isYearly = billingCycle === "yearly";

    const analyses = MEMBERSHIP_TIERS.map((tier) => {
      const discountSavings = visits * spend * (tier.discountPercent / 100);
      const tableHoursUsed = Math.min(visits * AVG_HOURS_PER_VISIT, tier.freeTableHours);
      const tableSavings = tableHoursUsed * HOURLY_TABLE_RATE_PKR;
      const grossPerks = discountSavings + tableSavings;
      const monthlyFee = isYearly ? Math.round(tier.yearlyPrice / 12) : tier.monthlyPrice;
      const netSavings = grossPerks - monthlyFee;

      return {
        tier,
        discountSavings,
        tableSavings,
        grossPerks,
        monthlyFee,
        netSavings
      };
    });

    // Pick best value tier (highest net savings; break ties with highlighted/lower cost)
    const best = analyses.reduce((prev, curr) => {
      if (curr.netSavings > prev.netSavings) return curr;
      if (curr.netSavings === prev.netSavings && curr.tier.highlighted) return curr;
      return prev;
    }, analyses[0]);

    recommendedTierId = best.tier.id;

    const isPositiveSavings = best.netSavings >= 0;
    const headlineFigure = isPositiveSavings
      ? `${formatPKR(best.netSavings)} <span class="fs-6 fw-normal opacity-75">/ month</span>`
      : `${formatPKR(best.grossPerks)} <span class="fs-6 fw-normal opacity-75">perks value / mo</span>`;

    const adviceNote = isPositiveSavings
      ? `The <strong>${best.tier.name}</strong> plan delivers the highest net savings for your visit schedule.`
      : `With ${visits} visit${visits === 1 ? "" : "s"}/month, <strong>${best.tier.name}</strong> has the lowest monthly commitment. Visit 3+ times a month to come out ahead!`;

    const isAlreadyOnBest = Boolean(currentMembership && currentMembership.planId === best.tier.id);
    const ctaText = isAlreadyOnBest
      ? `You're on ${best.tier.name}`
      : currentMembership
        ? `Switch to ${best.tier.name}`
        : `Join ${best.tier.name}`;

    dom.calcResultBox.innerHTML = `
      <span class="calc-best-pill">Best Value: ${best.tier.name} (${isYearly ? "Yearly" : "Monthly"})</span>
      <div class="calc-savings-figure">${headlineFigure}</div>
      <p class="small opacity-90 mb-3">${adviceNote}</p>

      <div class="mb-3">
        <div class="calc-breakdown-row">
          <span>Café discount (${best.tier.discountPercent}%)</span>
          <strong>+${formatPKR(best.discountSavings)}</strong>
        </div>
        <div class="calc-breakdown-row">
          <span>Free table value (up to ${best.tier.freeTableHours} hrs)</span>
          <strong>+${formatPKR(best.tableSavings)}</strong>
        </div>
        <div class="calc-breakdown-row">
          <span>${best.tier.name} monthly cost</span>
          <strong>-${formatPKR(best.monthlyFee)}</strong>
        </div>
        <div class="calc-breakdown-row pt-2">
          <span>Estimated net monthly balance</span>
          <strong>${best.netSavings >= 0 ? "+" : "-"}${formatPKR(Math.abs(best.netSavings))}</strong>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-calc-cta"
        id="calcChooseRecommendedBtn"
        ${isAlreadyOnBest ? "disabled" : ""}
      >
        ${ctaText}
      </button>
    `;

    const calcBtn = document.getElementById("calcChooseRecommendedBtn");
    if (calcBtn && !isAlreadyOnBest) {
      calcBtn.addEventListener("click", () => openSignupModal(best.tier.id));
    }

    renderPlans();
  }

  // Rendering: FAQ Accordion
  function renderFAQ() {
    dom.faqAccordion.innerHTML = FAQ_ITEMS.map((item, index) => {
      const headingId = `faqHeading-${item.id}`;
      const collapseId = `faqCollapse-${item.id}`;
      const isFirst = index === 0;

      return `
        <div class="accordion-item">
          <h3 class="accordion-header" id="${headingId}">
            <button
              class="accordion-button ${isFirst ? "" : "collapsed"}"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#${collapseId}"
              aria-expanded="${isFirst ? "true" : "false"}"
              aria-controls="${collapseId}"
            >
              ${item.question}
            </button>
          </h3>
          <div
            id="${collapseId}"
            class="accordion-collapse collapse ${isFirst ? "show" : ""}"
            aria-labelledby="${headingId}"
            data-bs-parent="#faqAccordion"
          >
            <div class="accordion-body">${item.answer}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Rendering: Membership Card & Page State for Existing Member
  function renderMemberState() {
    if (!currentMembership) {
      dom.memberCardSection.classList.add("d-none");
      dom.heroViewCardBtn.classList.add("d-none");
      dom.heroEyebrow.textContent = "Roll & Brew Club";
      dom.heroPitch.textContent =
        "Enjoy free table hours, specialty brew discounts, and priority game night reservations every month.";
      renderPlans();
      return;
    }

    const tier = getTierById(currentMembership.planId);
    const cycleLabel = currentMembership.billingType === "yearly" ? "Yearly" : "Monthly";
    const nextTier = getNextUpgradeTier(currentMembership.planId);

    dom.memberCardSection.classList.remove("d-none");
    dom.heroViewCardBtn.classList.remove("d-none");
    dom.heroEyebrow.textContent = `Active ${tier.name} Member`;
    dom.heroPitch.textContent =
      `Welcome back, ${currentMembership.name}! Your ${tier.name} perks (${tier.freeTableHours} free hrs/mo & ${tier.discountPercent}% café discount) are ready.`;

    dom.cardPlanBadge.textContent = `${tier.name} • ${cycleLabel}`;
    dom.cardMemberName.textContent = currentMembership.name;
    dom.cardMemberId.textContent = currentMembership.memberId;
    dom.cardStartDate.textContent = formatReadableDate(currentMembership.startDate);
    dom.cardRenewalDate.textContent = formatReadableDate(currentMembership.renewalDate);

    dom.memberWelcomeHeading.textContent = `Welcome to the club, ${currentMembership.name}!`;
    dom.memberStatusSummary.textContent =
      `Your ${tier.name} (${cycleLabel}) pass includes ${tier.freeTableHours} free table hours/month and ${tier.discountPercent}% off food & drinks.`;

    if (nextTier) {
      dom.upgradePlanBtn.textContent = `Upgrade to ${nextTier.name}`;
      dom.upgradePlanBtn.disabled = false;
    } else {
      dom.upgradePlanBtn.textContent = "Top Tier Active (Manage Billing)";
      dom.upgradePlanBtn.disabled = false;
    }

    renderPlans();
  }

  // Populate Plan Select in Modal
  function populateModalPlanSelect() {
    dom.memberPlan.innerHTML = MEMBERSHIP_TIERS.map(
      (tier) => `<option value="${tier.id}">${tier.name} (${tier.discountPercent}% off, ${tier.freeTableHours} hrs/mo)</option>`
    ).join("");
  }

  function updateModalPriceSummary() {
    const tier = getTierById(dom.memberPlan.value);
    const cycle = dom.memberBillingCycle.value;
    const price = cycle === "yearly" ? tier.yearlyPrice : tier.monthlyPrice;
    const startVal = dom.memberStartDate.value || getTodayISO();
    const renewalVal = calculateRenewalDate(startVal, cycle);

    dom.modalPriceSummary.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-1">
        <span class="fw-semibold">${tier.name} Plan (${cycle === "yearly" ? "Yearly" : "Monthly"})</span>
        <strong class="text-nowrap">${formatPKR(price)}</strong>
      </div>
      <div class="small text-muted-cafe">
        Renews on <strong>${formatReadableDate(renewalVal)}</strong> • Cancel anytime
      </div>
    `;
  }

  // Validation
  function setFieldValidation(inputEl, errorEl, errorMessage) {
    if (errorMessage) {
      inputEl.classList.add("is-invalid");
      inputEl.classList.remove("is-valid");
      errorEl.textContent = errorMessage;
      return false;
    }
    inputEl.classList.remove("is-invalid");
    inputEl.classList.add("is-valid");
    errorEl.textContent = "";
    return true;
  }

  function validateField(fieldId, forceShow = false) {
    if (!forceShow && !touchedFields.has(fieldId)) {
      return true;
    }

    if (fieldId === "memberName") {
      const val = dom.memberName.value.trim();
      const letterCount = (val.match(/[a-zA-Z]/g) || []).length;
      const err = letterCount < 2 ? "Please enter your full name (at least 2 letters)." : "";
      return setFieldValidation(dom.memberName, document.getElementById("memberNameError"), err);
    }

    if (fieldId === "memberEmail") {
      const val = dom.memberEmail.value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
      const err = emailOk ? "" : "Please enter a valid email address (e.g., name@example.com).";
      return setFieldValidation(dom.memberEmail, document.getElementById("memberEmailError"), err);
    }

    if (fieldId === "memberPhone") {
      const val = dom.memberPhone.value.trim();
      const phoneOk = /^03\d{2}-\d{7}$/.test(val);
      const err = phoneOk ? "" : "Phone must match Pakistani format 03XX-XXXXXXX (e.g., 0300-1234567).";
      return setFieldValidation(dom.memberPhone, document.getElementById("memberPhoneError"), err);
    }

    if (fieldId === "memberPlan") {
      const validPlan = MEMBERSHIP_TIERS.some((t) => t.id === dom.memberPlan.value);
      const err = validPlan ? "" : "Please select a valid membership plan.";
      return setFieldValidation(dom.memberPlan, document.getElementById("memberPlanError"), err);
    }

    if (fieldId === "memberStartDate") {
      const val = dom.memberStartDate.value;
      const today = getTodayISO();
      let err = "";
      if (!val) {
        err = "Please choose a start date.";
      } else if (val < today) {
        err = "Start date cannot be in the past.";
      }
      return setFieldValidation(dom.memberStartDate, document.getElementById("memberStartDateError"), err);
    }

    if (fieldId === "agreeTerms") {
      const err = dom.agreeTerms.checked ? "" : "You must agree to the terms before joining.";
      return setFieldValidation(dom.agreeTerms, document.getElementById("agreeTermsError"), err);
    }

    return true;
  }

  function resetFormValidationUI() {
    touchedFields.clear();
    const fields = [
      dom.memberName,
      dom.memberEmail,
      dom.memberPhone,
      dom.memberPlan,
      dom.memberStartDate,
      dom.agreeTerms
    ];
    fields.forEach((el) => {
      el.classList.remove("is-invalid", "is-valid");
    });
    [
      "memberNameError",
      "memberEmailError",
      "memberPhoneError",
      "memberPlanError",
      "memberStartDateError",
      "agreeTermsError"
    ].forEach((id) => {
      document.getElementById(id).textContent = "";
    });
  }

  function openSignupModal(planId) {
    resetFormValidationUI();

    const today = getTodayISO();
    dom.memberStartDate.min = today;

    const targetPlan = planId || MEMBERSHIP_TIERS[1].id;
    dom.memberPlan.value = targetPlan;
    dom.memberBillingCycle.value = billingCycle;

    if (currentMembership) {
      dom.modalModeTag.textContent = "Update Membership";
      dom.signupModalLabel.textContent = "Upgrade or Switch Your Plan";
      dom.submitSignupBtn.textContent = "Update Membership";
      dom.memberName.value = currentMembership.name || "";
      dom.memberEmail.value = currentMembership.email || "";
      dom.memberPhone.value = currentMembership.phone || "";
      dom.memberStartDate.value =
        currentMembership.startDate && currentMembership.startDate >= today
          ? currentMembership.startDate
          : today;
      dom.agreeTerms.checked = false;
    } else {
      dom.modalModeTag.textContent = "New Membership";
      dom.signupModalLabel.textContent = "Join the Roll & Brew Club";
      dom.submitSignupBtn.textContent = "Confirm & Activate Membership";
      dom.signupForm.reset();
      dom.memberPlan.value = targetPlan;
      dom.memberBillingCycle.value = billingCycle;
      dom.memberStartDate.value = today;
    }

    updateModalPriceSummary();
    signupModalInstance.show();
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const fieldOrder = [
      "memberName",
      "memberEmail",
      "memberPhone",
      "memberPlan",
      "memberStartDate",
      "agreeTerms"
    ];

    let firstInvalidEl = null;
    let allValid = true;

    fieldOrder.forEach((id) => {
      touchedFields.add(id);
      const valid = validateField(id, true);
      if (!valid) {
        allValid = false;
        if (!firstInvalidEl) {
          firstInvalidEl = document.getElementById(id);
        }
      }
    });

    if (!allValid) {
      if (firstInvalidEl) firstInvalidEl.focus();
      return;
    }

    const chosenTier = getTierById(dom.memberPlan.value);
    const chosenBilling = dom.memberBillingCycle.value === "yearly" ? "yearly" : "monthly";
    const startDate = dom.memberStartDate.value;
    const renewalDate = calculateRenewalDate(startDate, chosenBilling);

    // Sync page billing toggle if user changed billing in modal
    billingCycle = chosenBilling;
    saveBillingCycle(billingCycle);
    syncBillingToggleUI();

    currentMembership = {
      name: dom.memberName.value.trim(),
      email: dom.memberEmail.value.trim(),
      phone: dom.memberPhone.value.trim(),
      planId: chosenTier.id,
      planName: chosenTier.name,
      billingType: chosenBilling,
      memberId:
        currentMembership && currentMembership.planId === chosenTier.id
          ? currentMembership.memberId
          : generateMemberId(chosenTier.id),
      startDate,
      renewalDate
    };

    saveMembership(currentMembership);
    signupModalInstance.hide();
    renderMemberState();
    updateSavingsCalculator();

    dom.memberCardSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setupEventListeners() {
    // Billing toggle
    dom.billingToggle.addEventListener("change", () => {
      billingCycle = dom.billingToggle.checked ? "yearly" : "monthly";
      saveBillingCycle(billingCycle);
      syncBillingToggleUI();
      updateSavingsCalculator();
    });

    dom.monthlyLabelBtn.addEventListener("click", () => {
      if (billingCycle === "monthly") return;
      billingCycle = "monthly";
      saveBillingCycle(billingCycle);
      syncBillingToggleUI();
      updateSavingsCalculator();
    });

    dom.yearlyLabelBtn.addEventListener("click", () => {
      if (billingCycle === "yearly") return;
      billingCycle = "yearly";
      saveBillingCycle(billingCycle);
      syncBillingToggleUI();
      updateSavingsCalculator();
    });

    // Savings calculator live inputs
    dom.calcVisits.addEventListener("input", updateSavingsCalculator);
    dom.calcSpend.addEventListener("input", updateSavingsCalculator);

    // Upgrade & Cancel membership controls
    dom.upgradePlanBtn.addEventListener("click", () => {
      if (!currentMembership) return;
      const nextTier = getNextUpgradeTier(currentMembership.planId);
      if (nextTier) {
        openSignupModal(nextTier.id);
      } else {
        openSignupModal(currentMembership.planId);
      }
    });

    dom.cancelMembershipBtn.addEventListener("click", () => {
      cancelModalInstance.show();
    });

    dom.confirmCancelBtn.addEventListener("click", () => {
      clearMembership();
      currentMembership = null;
      cancelModalInstance.hide();
      renderMemberState();
      updateSavingsCalculator();
    });

    // Live validation for modal form fields
    const textFields = ["memberName", "memberEmail", "memberPhone"];
    textFields.forEach((id) => {
      const el = document.getElementById(id);
      el.addEventListener("input", () => {
        touchedFields.add(id);
        validateField(id);
      });
      el.addEventListener("blur", () => {
        touchedFields.add(id);
        validateField(id);
      });
    });

    ["memberPlan", "memberStartDate", "agreeTerms"].forEach((id) => {
      const el = document.getElementById(id);
      el.addEventListener("change", () => {
        touchedFields.add(id);
        validateField(id);
        updateModalPriceSummary();
      });
      el.addEventListener("blur", () => {
        touchedFields.add(id);
        validateField(id);
      });
    });

    dom.memberBillingCycle.addEventListener("change", updateModalPriceSummary);
    dom.signupForm.addEventListener("submit", handleFormSubmit);
  }

  function init() {
    signupModalInstance = new bootstrap.Modal(dom.signupModalEl);
    cancelModalInstance = new bootstrap.Modal(dom.cancelModalEl);

    populateModalPlanSelect();
    syncBillingToggleUI();
    renderCompareTable();
    renderFAQ();
    renderMemberState();
    updateSavingsCalculator();
    setupEventListeners();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
