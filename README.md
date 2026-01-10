# GW Properties & Development LLC Website

A premium, modern-craftsman static website for GW Properties & Development LLC, a general contractor specializing in residential and light commercial construction.

## Features

- **Multi-page static site** - Home, About, Services, Portfolio, Testimonials, FAQ, Contact, and 404 pages
- **Premium design** - Modern-craftsman aesthetic with luxury branding
- **Fully responsive** - Optimized for all devices (320px to 1440px+)
- **SEO optimized** - Complete meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
- **Accessible** - WCAG compliant with keyboard navigation and screen reader support
- **Google Analytics** - Integrated tracking (G-8C0BWCXBF0)
- **Portfolio system** - Dynamic project gallery with filtering and modal lightbox
- **Contact form** - Mailto-based form submission (no backend required)
- **FAQ accordion** - Accessible accordion component
- **GitHub Pages ready** - Configured for static hosting

## Project Structure

```
Landon/
├── index.html              # Home page
├── about.html              # About page
├── services.html           # Services page
├── portfolio.html          # Portfolio gallery
├── testimonials.html       # Client testimonials
├── faq.html               # Frequently asked questions
├── contact.html            # Contact form
├── 404.html                # 404 error page
├── robots.txt              # SEO robots file
├── sitemap.xml             # SEO sitemap
├── .nojekyll               # GitHub Pages config
├── assets/
│   ├── css/
│   │   └── styles.css      # Main stylesheet
│   ├── js/
│   │   ├── main.js         # Navigation, forms, accordion
│   │   └── portfolio.js   # Portfolio functionality
│   └── img/                # Image assets
│       ├── logo.jpg         # Company logo (add your logo here)
│       ├── hero-placeholder.jpg
│       └── project-*.jpg   # Portfolio images
└── data/
    └── projects.json       # Portfolio project data
```

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Landon
   ```

2. **Add your logo**
   - Place your logo image as `assets/img/logo.jpg`
   - The logo should display "GW Properties & Development LLC" and "ESTD 2025"

3. **Add project images**
   - Add portfolio images to `assets/img/` (project-1.jpg, project-2.jpg, etc.)
   - Update image paths in `data/projects.json` if needed

4. **Update contact information**
   - Update email address in contact forms and footer
   - Update phone number if different from (205) 834-5845
   - Update service area information

5. **Update SEO URLs**
   - Replace `yourusername.github.io/landon` with your actual GitHub Pages URL in:
     - `sitemap.xml`
     - All HTML files (canonical, og:url, twitter:url)

## Local Development

To run a local server for testing:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## Deployment to GitHub Pages

1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select source branch (usually `main` or `master`)
4. Your site will be available at `https://<username>.github.io/<repository-name>/`

## Brand Colors

- **Background**: Deep evergreen (#0c1403, #183225)
- **Gold Accents**: #c8bb96, #af9c71, #8d7f58
- **Text**: Off-white (#f5f3ea, #dcd7c8)

## Typography

- **Headings**: Cinzel (600 weight)
- **Body**: Inter (400, 500, 600 weights)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

© 2025 GW Properties & Development LLC. All rights reserved.

## Notes

- The contact form uses mailto links (no backend required)
- Portfolio images are loaded from `data/projects.json`
- All images have fallback SVG placeholders if images are missing
- License information placeholders marked with asterisks - update with actual license details
- Update sitemap.xml with your actual domain before going live
