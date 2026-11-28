hi can u please help me make my second page for Roll & Brew? its called Location & Hours and should be saved as pages/location.html. first look at pages/faq.html and css/style.css so my new page has the exact same header, top menu links, footer, colors, and style as my FAQ page.

here is what i want on the Location & Hours page:
- a big title saying Location & Hours and a cute little line under it inviting people to visit our board game cafe
- a box showing where we are located (like F-7 Markaz, Islamabad), some nearby landmarks so people dont get lost, and where they can park
- a neat opening hours box or table that puts weekday timings together (Monday - Thursday: 12:00 PM - 11:00 PM) and then puts weekend timings together separately (Friday - Sunday: 1:00 PM - 1:00 AM)
- a pretend map box with a button that says Get Directions
- please put any new styles inside css/style.css so both my FAQ page and Location page look pretty and work on mobile too!

I created the Location & Hours page in pages/location.html and updated css/style.css so it shares the same header, navigation, footer, and coffee-and-cream theme as pages/faq.html.

What was added

- pages/location.html
  - Shared Layout: Uses the exact same .site-header, .main-nav links (faq.html, location.html with aria-current="page", and feedback.html), .site-footer, stylesheet link (../css/style.css), and script tag (../js/script.js) as pages/faq.html.
  - Hero Banner (.page-hero): Features the Location & Hours title and an inviting subtitle.
  - Find Us Section (.location-grid): Displays three cards covering the cafe address in F-7 Markaz (Jinnah Super Market), Islamabad, nearby landmarks, and parking details.
  - Opening Hours Table (.table-wrapper): Groups Monday - Thursday: 12:00 PM - 11:00 PM and Friday - Sunday: 1:00 PM - 1:00 AM cleanly into separate rows.
  - Pretend Map Box (.map-box): Includes a styled map grid with street labels, a centered pin badge for Roll & Brew, and a Get Directions button (.btn).

- css/style.css
  - Updated button, .btn to support link buttons cleanly (display: inline-block; text-decoration: none;).
  - Added styles for .location-grid, .location-card, .location-list, .hours-note, .map-box, .map-canvas, .map-road, .map-pin-card, and .map-footer using the existing color variables.
  - Added mobile layout rules under @media (max-width: 640px) so the map box, cards, and full-width button adapt cleanly on smaller screens without affecting pages/faq.html.

hi can u please help me make my third and last page for Roll & Brew? its called Feedback and should be saved as pages/feedback.html. first look at pages/faq.html, pages/location.html, and css/style.css so this page has the exact same header, top menu links, footer, colors, and style as my other pages.

here is what i want on the Feedback page:
- a big title saying Feedback and a nice welcoming line asking visitors to share their thoughts about our board game cafe
- a simple feedback form where people can type their name, email, pick what they are writing about (like Cafe Experience, Board Game Suggestion, Food & Drinks, or Something Else), choose a star or number rating from 1 to 5, and write their message
- a Submit Feedback button that shows a cute thank-you message on the page when clicked (using simple JavaScript in js/script.js so it doesnt give an error!)
- please put any new styles inside css/style.css so all three of my pages look matching and work nicely on mobile too!

I created the Feedback page in pages/feedback.html, added the form script in js/script.js, and updated css/style.css so all three pages share the same header, navigation, footer, colors, and responsive layout.

What was added

- pages/feedback.html
  - Shared Layout: Uses the same .site-header, .main-nav links (faq.html, location.html, and feedback.html with aria-current="page"), .site-footer, stylesheet link (../css/style.css), and script tag (../js/script.js) as pages/faq.html and pages/location.html.
  - Hero Banner (.page-hero): Displays the Feedback title and welcoming subtitle.
  - Feedback Form (#feedback-form): Includes fields for name (#visitor-name), email (#visitor-email), topic (#feedback-topic with Cafe Experience, Board Game Suggestion, Food & Drinks, and Something Else), a 1-to-5 star rating radio group (name="rating"), message (#feedback-message), and a Submit Feedback button.
  - Thank-You Box (#feedback-thanks): Hidden by default (hidden) and populated dynamically on submit.

- js/script.js
  - Runs on DOMContentLoaded and checks if (feedbackForm && thanksBox && thanksText) so it safely does nothing on pages/faq.html and pages/location.html without throwing errors.
  - Prevents page reload on form submission, displays a personalized thank-you message in #feedback-thanks-text with the visitor's name, rating, and selected topic, reveals #feedback-thanks, and resets the form.

- css/style.css
  - Added styles for .rating-fieldset, .rating-options, .rating-option (with active selected highlight), and .feedback-thanks using the existing warm cream and coffee-brown variables, plus .feedback-thanks[hidden] so the thank-you box stays hidden until submitted.
