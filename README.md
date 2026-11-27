# Roll & Brew — Board Game Café

Roll & Brew is our **SE-E Group 03** project: a website for a cozy neighborhood board game café with 50+ curated tabletop games, specialty espresso, fresh snacks, and welcoming tables for friends and groups.

---

## Pages & Styling So Far

On this branch (`i263250_Fatima_Noor`), the main café pages and their shared stylesheet are set up using plain HTML, CSS, and lightweight vanilla JavaScript (for the mobile nav menu and contact form validation):

- **`index.html` (Home)** — Features the hero banner with daily hours (`11:00 AM – 12:00 AM`), a *Game of the Week* spotlight (*Settlers of Catan*), a *Why Visit Roll & Brew* section, quick links to other café sections, and a group bookings banner.
- **`about.html` (About Us)** — Shares the café's story (18 wooden gaming tables and 500+ weekly players), core values (*What We Stand For*), staff roles (*Game Masters*, *Head Baristas*, *Kitchen Crew*), and a café snapshot banner. *(Currently at the repo root on this branch; planned for `pages/about.html` in the final layout.)*
- **`contact.html` (Contact Us)** — Includes a table reservation / inquiry form with client-side validation (name, email format check, topic selector, message, and a confirmation banner), plus direct email/phone contact, address, and opening hours. *(Currently at the repo root on this branch; planned for `pages/contact.html` in the final layout.)*
- **`css/home-about-contact.css`** — The shared stylesheet for the Home, About, and Contact pages. It defines a warm cream (`#F6EFE2` / `#EFE4D1`), dark roasted coffee brown (`#2F1B10` / `#351F12`), and caramel (`#C28144`) color palette, Google Fonts (`Fraunces` and `Plus Jakarta Sans`), responsive navbar/drawer, cards, form styles, and footer.

> **Note:** The navigation and section links also point to upcoming teammate pages (`pages/games.html`, `pages/menu.html`, `pages/events.html`, `pages/quiz.html`, and `pages/faq.html`), which are being built on separate branches and are not in this branch yet.

---

## Current Folder Structure

```text
SE-E_Group03_RollAndBrew/
├── index.html
├── about.html
├── contact.html
├── README.md
├── css/
│   └── home-about-contact.css
├── images/
│   └── logo.png
└── docs/
    └── ai-logs/
        └── 26i-3250/
            ├── session-01.md
            └── session-02.md
```

---

## Team & Contributions (Group 03)

- **Fatima Noor (`i263250`)** — `index.html`, `pages/about.html` (`about.html`), `pages/contact.html` (`contact.html`), and `css/home-about-contact.css`
- **[Teammate Name] (`[Roll Number]`)** — *[Assigned pages / files]*
- **[Teammate Name] (`[Roll Number]`)** — *[Assigned pages / files]*
- **[Teammate Name] (`[Roll Number]`)** — *[Assigned pages / files]*
- **[Teammate Name] (`[Roll Number]`)** — *[Assigned pages / files]*

---

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Muhammad-Talha-Khan2058/SE-E_Group03_RollAndBrew.git
   ```
2. Open the project folder:
   ```bash
   cd SE-E_Group03_RollAndBrew
   ```
3. *(Optional)* Switch to this branch:
   ```bash
   git checkout i263250_Fatima_Noor
   ```
4. Open `index.html` directly in your browser (or launch it with VS Code's **Live Server** extension).
