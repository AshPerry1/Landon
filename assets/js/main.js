/**
 * GW Properties & Development LLC - Main JavaScript
 * Handles navigation, forms, accordions, and general site functionality
 */

(function() {
  'use strict';

  // ============================================
  // Mobile Navigation Toggle
  // ============================================
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  function closeMobileNav() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMobileNav() {
    navMenu.classList.add('active');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  if (navToggle && navMenu) {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-controls', 'navMenu');

    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      if (navMenu.classList.contains('active')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        closeMobileNav();
      });
    });

    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        closeMobileNav();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileNav();
      }
    });
  }

  // ============================================
  // Active Navigation Link Highlighting
  // ============================================
  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      const linkPage = linkHref.split('/').pop();
      
      // Remove active class from all links
      link.classList.remove('active');
      
      // Add active class if it matches current page
      if (linkPage === currentPage || 
          (currentPage === '' && linkPage === 'index.html') ||
          (currentPage === 'index.html' && linkHref === '#home')) {
        link.classList.add('active');
      }
    });
  }

  setActiveNavLink();

  // ============================================
  // Sticky Header Scroll Effect - Hide on scroll down, show on scroll up
  // ============================================
  const header = document.querySelector('.header');
  let lastScroll = 0;
  let scrollThreshold = 100; // Hide header after scrolling 100px

  if (header) {
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      
      // Add scrolled class for styling
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
        header.classList.remove('header-hidden');
      }
      
      // Hide/show header based on scroll direction
      if (currentScroll > scrollThreshold) {
        if (currentScroll > lastScroll) {
          // Scrolling down - hide header
          header.classList.add('header-hidden');
        } else {
          // Scrolling up - show header
          header.classList.remove('header-hidden');
        }
      } else {
        // Near top of page - always show header
        header.classList.remove('header-hidden');
      }
      
      lastScroll = currentScroll;
    });
  }

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // FAQ Accordion Functionality
  // ============================================
  const accordionButtons = document.querySelectorAll('.accordion-button');

  accordionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const item = this.closest('.accordion-item');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Close all other accordion items
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherButton = otherItem.querySelector('.accordion-button');
          if (otherButton) {
            otherButton.setAttribute('aria-expanded', 'false');
          }
        }
      });
      
      // Toggle current item
      if (isExpanded) {
        item.classList.remove('active');
        this.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
    
    // Initialize aria-expanded
    button.setAttribute('aria-expanded', 'false');
  });

  // ============================================
  // Contact Form Handling
  // ============================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const name = formData.get('name') || '';
      const phone = formData.get('phone') || '';
      const email = formData.get('email') || '';
      const address = formData.get('address') || '';
      const projectType = formData.get('projectType') || '';
      const budget = formData.get('budget') || '';
      const message = formData.get('message') || '';
      
      // Basic validation
      if (!name || !email || !phone) {
        alert('Please fill in all required fields (Name, Email, Phone).');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      
      // Build mailto link
      const subject = encodeURIComponent(`Quote Request — ${name}`);
      const body = encodeURIComponent(
        `Quote Request Form Submission\n\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Email: ${email}\n` +
        `Project Address: ${address || 'Not provided'}\n` +
        `Project Type: ${projectType || 'Not specified'}\n` +
        `Budget Range: ${budget || 'Not specified'}\n\n` +
        `Message:\n${message}`
      );
      
      const mailtoLink = `mailto:landongreen898@gmail.com?subject=${subject}&body=${body}`;
      
      // Show confirmation message
      const submitMessage = document.querySelector('.form-submit-message');
      if (submitMessage) {
        submitMessage.classList.add('active');
        submitMessage.textContent = 'Your email app will open to send your request.';
      }
      
      // Open mail client
      window.location.href = mailtoLink;
      
      // Track form submission with Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submission', {
          'event_category': 'Contact',
          'event_label': 'Quote Request Form'
        });
      }
    });
  }

  // ============================================
  // Build Estimate Form
  // ============================================
  const ESTIMATE_RATE_PER_SQFT = 200;
  const estimateForm = document.getElementById('estimateForm');
  const squareFootageInput = document.getElementById('squareFootage');
  const estimateResultEl = document.getElementById('estimateResult');
  const estimatePhotosInput = document.getElementById('estimatePhotos');
  const estimatePhotoPreview = document.getElementById('estimatePhotoPreview');
  let estimatePhotoPreviewUrls = [];

  function formatEstimateCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }

  function updateEstimatePreview() {
    if (!estimateResultEl || !squareFootageInput) return;

    const sqft = parseFloat(squareFootageInput.value);
    if (Number.isFinite(sqft) && sqft > 0) {
      estimateResultEl.textContent = formatEstimateCurrency(sqft * ESTIMATE_RATE_PER_SQFT);
    } else {
      estimateResultEl.textContent = '—';
    }
  }

  if (squareFootageInput) {
    squareFootageInput.addEventListener('input', updateEstimatePreview);
    updateEstimatePreview();
  }

  function clearEstimatePhotoPreview() {
    estimatePhotoPreviewUrls.forEach(function(url) {
      URL.revokeObjectURL(url);
    });
    estimatePhotoPreviewUrls = [];
    if (estimatePhotoPreview) {
      estimatePhotoPreview.innerHTML = '';
      estimatePhotoPreview.hidden = true;
    }
  }

  function renderEstimatePhotoPreview() {
    if (!estimatePhotosInput || !estimatePhotoPreview) return;

    clearEstimatePhotoPreview();

    const files = Array.from(estimatePhotosInput.files || []);
    if (!files.length) return;

    files.forEach(function(file) {
      const url = URL.createObjectURL(file);
      estimatePhotoPreviewUrls.push(url);

      const img = document.createElement('img');
      img.src = url;
      img.alt = file.name;
      img.className = 'estimate-photo-thumb';
      img.loading = 'lazy';
      estimatePhotoPreview.appendChild(img);
    });

    estimatePhotoPreview.hidden = false;
  }

  if (estimatePhotosInput) {
    estimatePhotosInput.addEventListener('change', renderEstimatePhotoPreview);
  }

  if (estimateForm) {
    estimateForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(this);
      const name = (formData.get('name') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const squareFootage = parseFloat(formData.get('squareFootage'));
      const notes = (formData.get('notes') || '').toString().trim();

      if (!name || !email || !phone) {
        alert('Please fill in all required fields (Name, Email, Phone).');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      if (!Number.isFinite(squareFootage) || squareFootage <= 0) {
        alert('Please enter a valid square footage.');
        return;
      }

      const estimateTotal = squareFootage * ESTIMATE_RATE_PER_SQFT;
      const formattedTotal = formatEstimateCurrency(estimateTotal);
      const formattedSqft = new Intl.NumberFormat('en-US').format(squareFootage);
      const photoFiles = estimatePhotosInput ? Array.from(estimatePhotosInput.files || []) : [];
      const photoNames = photoFiles.map(function(file) { return file.name; });

      const subject = encodeURIComponent(`Build Estimate Request — ${name}`);
      const body = encodeURIComponent(
        `Build Estimate Form Submission\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n\n` +
        `Square Footage: ${formattedSqft} sq ft\n` +
        `Rough Estimate: ${formattedTotal}\n\n` +
        (notes ? `Project Notes:\n${notes}\n\n` : '') +
        (photoNames.length
          ? `Photos selected on the form (please attach these in your email before sending):\n${photoNames.map(function(n) { return '- ' + n; }).join('\n')}\n\n`
          : '') +
        `---\n` +
        `Ballpark estimate from the website. The visitor will send this message from their email app.`
      );

      const mailtoLink = `mailto:landongreen898@gmail.com?subject=${subject}&body=${body}`;

      const submitMessage = this.querySelector('.form-submit-message');
      if (submitMessage) {
        submitMessage.classList.add('active');
        submitMessage.textContent = photoNames.length
          ? 'Your email app will open — attach the photos you selected, then tap Send to deliver your request to Landon.'
          : 'Your email app will open — tap Send to deliver your estimate request to Landon.';
      }

      window.location.href = mailtoLink;

      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submission', {
          'event_category': 'Estimate',
          'event_label': 'Build Estimate Form',
          'value': Math.round(estimateTotal)
        });
      }
    });
  }

  // ============================================
  // Intersection Observer for Reveal Animations
  // ============================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements for animation (only if reduced motion is not preferred)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.addEventListener('DOMContentLoaded', function() {
      const animateElements = document.querySelectorAll(
        '.card, .service-card, .portfolio-card, .testimonial-card, .about-text, .contact-card'
      );
      
      animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
      });
    });
  }

  // ============================================
  // Google Analytics Event Tracking
  // ============================================
  if (typeof gtag !== 'undefined') {
    // Track scroll depth
    let maxScroll = 0;
    const scrollThresholds = [25, 50, 75, 100];
    
    window.addEventListener('scroll', function() {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      scrollThresholds.forEach(threshold => {
        if (scrollPercent >= threshold && maxScroll < threshold) {
          maxScroll = threshold;
          gtag('event', 'scroll_depth', {
            'event_category': 'Engagement',
            'event_label': `${threshold}%`
          });
        }
      });
    });
    
    // Track button clicks
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const btnText = this.textContent.trim();
        gtag('event', 'button_click', {
          'event_category': 'Interaction',
          'event_label': btnText
        });
      });
    });
  }

  // ============================================
  // Valentine's Day Banner
  // ============================================
  function initValentinesBanner() {
    const banner = document.getElementById('valentinesBanner');
    if (!banner) return;

    // Check if banner was already dismissed
    const dismissed = localStorage.getItem('valentinesBannerDismissed');
    if (dismissed === 'true') {
      return;
    }

    // Check if we're past February 14th
    const today = new Date();
    const currentYear = today.getFullYear();
    const valentinesDay = new Date(currentYear, 1, 14); // Month is 0-indexed, so 1 = February
    const dayAfterValentines = new Date(currentYear, 1, 15);

    // Only show banner if today is on or before February 14th
    if (today > dayAfterValentines) {
      // Past Valentine's Day - hide forever
      localStorage.setItem('valentinesBannerDismissed', 'true');
      return;
    }

    // Show the banner
    banner.style.display = 'block';
    document.body.classList.add('has-valentines-banner');

    // Close button handler
    const closeBtn = banner.querySelector('.valentines-banner-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        banner.style.display = 'none';
        document.body.classList.remove('has-valentines-banner');
        localStorage.setItem('valentinesBannerDismissed', 'true');
      });
    }
  }

  // ============================================
  // Initialize on DOM Ready
  // ============================================
  document.addEventListener('DOMContentLoaded', function() {
    console.log('GW Properties & Development site loaded successfully');
    
    // Set active nav link after DOM is ready
    setActiveNavLink();
    
    // Initialize Valentine's Day banner
    initValentinesBanner();
  });

})();
