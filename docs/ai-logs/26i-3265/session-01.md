Hey, let's build the initial HTML structure for the "FAQ & House Rules" page of my board game cafe website, Roll & Brew, matching my prototype.

Please write clean, beginner-friendly HTML5 in pages/faq.html using semantic tags (<header>, <nav>, <main>, <section>, <details>, <summary>, <footer>). Use relative links in the top navigation bar pointing between FAQ & House Rules, Location & Hours, and Feedback (plus Home if needed) so they work inside a folder structure with index.html, pages/, css/style.css, js/script.js, and images/. Also include relative links to ../css/style.css in <head> and ../js/script.js before </body>.

For the page content for Roll & Brew:
- Add a page title and subtitle introducing FAQ & House Rules ("Everything you need to know before playing at Roll & Brew.").
- Include a "Frequently Asked Questions" section using <details> and <summary> tags with these exact items (keep the first one open by default, just like in my prototype):
  1. "1. How much does it cost to play?" -> "It is 500 PKR  per person for unlimited access to our library of 500+ board games during your visit."
  2. "2. Do we need to know the rules beforehand?" -> "Not at all! Our friendly staff is happy to recommend a game and teach you the rules before you start."
  3. "3. Can we bring outside food or drinks?" -> "No outside food or drinks are allowed, as we serve fresh coffee, teas, and snacks right from our cafe counter."
  4. "4. Do we need a reservation?" -> "Walk-ins are always welcome! However, Friday and Saturday evenings can get busy, so calling ahead for large groups is recommended."
- Include "Our 4 House Rules" in a clear list:
  1. "Use coasters for all drinks: Keep cups on coasters or side tables so game boards stay dry."
  2. "Treat game pieces with care: Please return all cards, dice, and tokens back into the box when finished."
  3. "Keep noise friendly: Cheer for your wins, but keep volume comfortable for neighboring tables."
  4. "Be kind to everyone: We are a welcoming space for beginners, families, and veteran gamers alike."
- Add a footer with "© 2026 Roll & Brew Board Game Cafe. All rights reserved." 
Keep the HTML clean, well-commented so I can explain it easily in my viva.

Created faq.html (pages/faq.html) with clean, commented HTML5 matching your prototype content.

What Was Built

  
Semantic Structure: Uses <header>, <nav>, <main>, <section>, <details>, <summary>, and <footer>, with aria-current="page" on the active nav link and aria-labelledby connecting each <section> to its heading.

  
Relative Paths (from pages/faq.html):
  
  

  
Stylesheet in <head>: ../css/style.css

  
Script before </body>: ../js/script.js

  
Top navigation bar links: ../index.html (Home), faq.html (FAQ & House Rules), location.html (Location & Hours), and feedback.html (Feedback).

  

  
Content:
  
  

  
Page heading (FAQ & House Rules) and subtitle (Everything you need to know before playing at Roll & Brew.).

  
Frequently Asked Questions: 4 <details>/<summary> items with the first item (open) expanded by default.

  
Our 4 House Rules: Numbered <ol> list with bold rule titles.

  
Footer: © 2026 Roll & Brew Board Game Cafe. All rights reserved.

  

  
Notes

  
The existing empty faq.html and style.css files at the workspace root were left untouched.

  
When you add the remaining pages and assets, make sure the Location & Hours and Feedback pages are named location.html and feedback.html inside pages/ (along with index.html, css/style.css, and js/script.js) so all relative links resolve cleanly.

  
Please update pages/faq.html so the top navigation bar excludes "Home" and only includes links for the 3 pages: "FAQ & House Rules", "Location & Hours", and "Feedback", using clean relative links within the pages/ folder. Keep all existing content, semantic tags, and comments intact.

Updated faq.html so the <nav class="main-nav"> bar now only contains links for the three pages within pages/:


  
faq.html — FAQ & House Rules (aria-current="page")

  
location.html — Location & Hours

  
feedback.html — Feedback

  

All other content, semantic tags, comments, and relative links (../css/style.css, ../js/script.js, and the Roll & Brew brand link to ../index.html) remain intact.

Hey! Now that the HTML for pages/faq.html is ready, let's style the site by writing css/style.css. I want a warm, cozy coffee-and-cream theme for Roll & Brew that works nicely for the FAQ & House Rules page right now and can also be reused for my Location & Hours and Feedback pages later.

For the colors, let's use a warm cream background , dark coffee brown for the header, footer, and main accents, off-white/cream  for the main content cards, soft beige  for the FAQ and house rule boxes, and dark espresso (#1A110B) for the text so everything is easy to read.

Please include these things that i am mentioning 
- Remove default browser margins, use a clean readable font, and make sure the footer stays down at the bottom of the screen even on shorter pages.
- Style the top header and navigation links with good spacing, a hover effect, an active state for the current page, and wrapping so it doesn't break on smaller screens.
- Center the main content area with comfortable padding and style the sections like clean cards (and add some basic matching styles for tables and forms so my Location & Hours and Feedback pages look consistent later).
- Give the FAQ dropdown boxes nice borders, padding, and spacing with a subtle hover/open effect, and make the 4 House Rules list look neat and easy to scan.
- Style the footer in the same coffee brown as the header, and make sure the layout adapts nicely on mobile screens.

Please keep the CSS simple and beginner friendly so I can easily read through it and explain how it works.

Created style.css (css/style.css) with a warm coffee-and-cream theme designed for faq.html and reusable across your upcoming pages.

Summary of Styles

  
Theme Colors (:root variables): Warm cream background (#f6efe4), off-white/cream cards (#fffdf9), soft beige boxes (#efe3d2), dark coffee brown header/footer/accents (#4a2e1b), and dark espresso text (#1a110b).

  
Reset & Sticky Footer: Removes default body margin, sets box-sizing: border-box, uses a clean sans-serif font stack, and uses display: flex; flex-direction: column; min-height: 100vh on body with flex: 1 on .page-content so .site-footer stays at the bottom even on short pages.

  
Header & Navigation: .site-header and .main-nav use flexbox with flex-wrap: wrap, spacing via gap, hover/focus states (#6b442a), and an active pill style matching both aria-current="page" and .active.

  
Cards, Tables & Forms: Centers .page-content (max-width: 900px), styles each <section> (and .card) with warm borders and subtle shadows, and includes matching styles for table/th/td (plus .table-wrapper) and form/.form-group/input/select/textarea/button/.btn for your Location & Hours and Feedback pages.

  
FAQ & House Rules: Styles .faq-item (<details>) with soft beige boxes, hover borders, .faq-item[open] highlight, and a divider above the answer; styles .house-rules-list li as scannable numbered beige cards with a dark coffee left accent border.

  
Mobile Responsiveness: A @media (max-width: 640px) rule stacks and centers the header/nav, adjusts card padding, and makes form buttons full-width on narrow screens.

  

(Note: The empty style.css at the workspace root remains untouched; faq.html links to ../css/style.css.)
