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

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
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
      
      const mailtoLink = `mailto:info@gwproperties.com?subject=${subject}&body=${body}`;
      
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
  // Initialize on DOM Ready
  // ============================================
  document.addEventListener('DOMContentLoaded', function() {
    console.log('GW Properties & Development site loaded successfully');
    
    // Set active nav link after DOM is ready
    setActiveNavLink();
  });

})();
