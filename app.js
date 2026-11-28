/* ==========================================================================
   Roll & Brew — Shared Navigation & Bill Sync Helpers
   ========================================================================== */
(function (global) {
  const STORAGE_KEY = "rollAndBrewBill";
  const MAX_ITEM_QTY = 20;

  function clampInt(value, min, max) {
    const num = parseInt(value, 10);
    if (Number.isNaN(num)) return min;
    return Math.min(max, Math.max(min, num));
  }

  function normalizeItems(rawList) {
    if (!Array.isArray(rawList)) return [];
    const merged = [];

    rawList.forEach((entry) => {
      if (!entry || typeof entry.name !== "string") return;
      const name = entry.name.trim();
      const price = Number(entry.price);
      if (!name || !Number.isFinite(price) || price < 0) return;

      const qty = clampInt(entry.qty ?? 1, 1, MAX_ITEM_QTY);
      const category = entry.category === "drink" ? "drink" : "snack";

      const existing = merged.find((item) => item.name === name);
      if (existing) {
        existing.qty = clampInt(existing.qty + qty, 1, MAX_ITEM_QTY);
      } else {
        merged.push({ name, price, qty, category });
      }
    });

    return merged;
  }

  function getBillItems() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return normalizeItems(parsed);
    } catch {
      return [];
    }
  }

  function saveBillItems(items) {
    const normalized = normalizeItems(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch {
      // Ignore storage errors in restricted environments
    }
    updateBillBadge(normalized);
    return normalized;
  }

  function getTotalQty(items) {
    const list = Array.isArray(items) ? items : getBillItems();
    return list.reduce((sum, item) => sum + clampInt(item.qty ?? 1, 1, MAX_ITEM_QTY), 0);
  }

  function updateBillBadge(items, animate) {
    const badge = document.getElementById("navBillCount");
    if (!badge) return;
    const totalQty = getTotalQty(items);
    badge.textContent = String(totalQty);
    badge.setAttribute("aria-label", `${totalQty} ${totalQty === 1 ? "item" : "items"} in bill`);

    if (animate) {
      badge.classList.remove("bump");
      void badge.offsetWidth;
      badge.classList.add("bump");
    }
  }

  function addBillItem({ name, price, category }) {
    const items = getBillItems();
    const existing = items.find((entry) => entry.name === name);
    let maxReached = false;

    if (existing) {
      if (existing.qty >= MAX_ITEM_QTY) {
        maxReached = true;
      } else {
        existing.qty += 1;
      }
    } else {
      items.push({
        name,
        price: Number(price) || 0,
        qty: 1,
        category: category === "drink" ? "drink" : "snack"
      });
    }

    const saved = saveBillItems(items);
    updateBillBadge(saved, !maxReached);
    return {
      added: !maxReached,
      maxReached,
      totalQty: getTotalQty(saved)
    };
  }

  function syncActiveNavLink() {
    const navMenu = document.getElementById("navMenu");
    if (!navMenu) return;

    const path = window.location.pathname.split("/").pop() || "index.html";
    const links = navMenu.querySelectorAll(".nav-link[href]");
    const hasMatch = Array.from(links).some((link) => link.getAttribute("href") === path);
    if (!hasMatch) return;

    links.forEach((link) => {
      const isCurrent = link.getAttribute("href") === path;
      link.classList.toggle("active", isCurrent);
      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function initNavbar(options) {
    const onBillSync = options && typeof options.onBillSync === "function" ? options.onBillSync : null;
    const navbar = document.querySelector(".navbar");
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const navMenu = document.getElementById("navMenu");

    syncActiveNavLink();
    updateBillBadge();

    function closeMenu(returnFocus) {
      if (!navMenu || !hamburgerBtn || !navMenu.classList.contains("open")) return;
      navMenu.classList.remove("open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      if (returnFocus) hamburgerBtn.focus();
    }

    if (hamburgerBtn && navMenu) {
      hamburgerBtn.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");
        hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
      });

      navMenu.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => closeMenu(false));
      });

      document.addEventListener("click", (event) => {
        if (navbar && !navbar.contains(event.target)) {
          closeMenu(false);
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeMenu(true);
        }
      });

      const desktopMedia = window.matchMedia("(min-width: 721px)");
      const handleViewportChange = (e) => {
        if (e.matches) closeMenu(false);
      };
      if (typeof desktopMedia.addEventListener === "function") {
        desktopMedia.addEventListener("change", handleViewportChange);
      } else if (typeof desktopMedia.addListener === "function") {
        desktopMedia.addListener(handleViewportChange);
      }
    }

    function syncAll() {
      updateBillBadge();
      if (onBillSync) onBillSync();
    }

    // Keep badge & bill page synced on bfcache Back/Forward navigation and across tabs
    window.addEventListener("pageshow", syncAll);
    window.addEventListener("storage", (event) => {
      if (!event.key || event.key === STORAGE_KEY) {
        syncAll();
      }
    });
  }

  global.RollAndBrew = {
    STORAGE_KEY,
    MAX_ITEM_QTY,
    clampInt,
    getBillItems,
    saveBillItems,
    getTotalQty,
    updateBillBadge,
    addBillItem,
    initNavbar
  };
})(window);
