# AI Session 02 Log (`26i-3250`)

## Prompt 1
> hi can u make the top part of @contact.html and put the styles in @css/home-about-contact.css so it looks like @index.html and @about.html?
>
> - put the same dark brown navbar at the top with images/logo.png and Contact Us highlighted
> - in the middle put a big "Get in Touch" title and a short sentence about booking a table or asking us something
> - below that make a big rounded off-white box with a form inside:
>   - name box
>   - email box (only show the "enter a valid email" message if they type a wrong email)
>   - a dropdown for table reservation, group event, or general question
>   - a bigger text box for date, time, or how many people
>   - a dark brown "Send Message" button with "Replies within 2 hrs" next to it, and when u click send it shows a thank you message without refreshing the page

### Response 1
Created `contact.html` and added the contact page styles to `css/home-about-contact.css` to match `index.html` and `about.html`:

- **Navbar**: Uses the same dark brown `.site-header` with `images/logo.png`, responsive mobile toggle, and **Contact Us** highlighted with `.nav-link--active` and `aria-current="page"`.
- **Header**: Centered **Get in Touch** heading (`#contact-heading`) with a short subtitle about booking a table or asking a question.
- **Contact Form Card** (`.contact-card` in `css/home-about-contact.css`): Rounded off-white surface containing:
  - **Name** input (`#contact-name`)
  - **Email** input (`#contact-email`) with `#email-error` (`"Enter a valid email"`) hidden by default and only shown when an invalid email is entered/submitted
  - **Topic dropdown** (`#contact-topic`) with *Table Reservation*, *Group Event*, and *General Question*
  - **Details textarea** (`#contact-message`) for date, time, party size, or questions
  - **Send Message** button (`.btn-dark`) with **"Replies within 2 hrs"** beside it, plus client-side submit handling that displays `#form-success` without refreshing the page.

---

## Prompt 2
> okay now can u do the rest of @contact.html and add the styles to @css/home-about-contact.css so it matches @index.html and @about.html?
>
> - right under the form box, put "Visit Us" on the left and "Full Hours & Location" on the right
> - add an off-white card with the dark brown circle icons for email (hello@rollandbrew.cafe) and phone ((555) 234-8910 — make sure the phone number stays on one line)
> - under that, add one more off-white card with our cafe address + a "Get Directions" button, and our opening hours (Mon-Thu 12pm-11pm, Fri-Sat 12pm-1am, Sun 1pm-11pm) plus a short note about walk-ins
> - at the bottom put the same dark brown group bookings banner from @index.html with a button going to faq.html, and the exact same dark brown footer from @index.html and @about.html

### Response 2
Completed the rest of `contact.html` and added the corresponding styles to `css/home-about-contact.css`:

- **Visit Us Header** (`.visit-section` / `.visit-header`): Tinted section with **Visit Us** on the left and **Full Hours & Location** on the right.
- **Direct Contact Card** (`.visit-contact-card`): Off-white card with dark brown circle icons (`.visit-icon-circle`) for `hello@rollandbrew.cafe` and `(555) 234-8910` (`.visit-phone` with `white-space: nowrap` so it stays on one line).
- **Address & Opening Hours Card** (`.visit-details-card`): Off-white card featuring the café address, a **Get Directions** button, opening hours (`Mon–Thu 12pm – 11pm`, `Fri–Sat 12pm – 1am`, `Sun 1pm – 11pm`), and a short walk-ins note.
- **Bottom Banner & Footer**: Dark brown **Questions or Group Bookings?** banner with a **View FAQ** button linking to `pages/faq.html`, followed by the matching dark brown `.site-footer` from `index.html` and `about.html`.
