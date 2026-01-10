/**
 * GW Properties & Development LLC - Portfolio JavaScript
 * Handles portfolio grid rendering, filtering, and modal functionality
 */

(function() {
  'use strict';

  let projectsData = [];
  let currentFilter = 'All';

  // ============================================
  // Load Projects Data
  // ============================================
  async function loadProjects() {
    try {
      // Determine base path for GitHub Pages
      const basePath = window.location.pathname.split('/').slice(0, -1).join('/') || '';
      const jsonPath = basePath ? `${basePath}/data/projects.json` : 'data/projects.json';
      
      const response = await fetch(jsonPath);
      if (!response.ok) {
        throw new Error(`Failed to load projects data: ${response.status}`);
      }
      projectsData = await response.json();
      console.log('Projects loaded successfully:', projectsData.length);
      return projectsData;
    } catch (error) {
      console.error('Error loading projects:', error);
      // Return empty array so site still works
      return [];
    }
  }

  // ============================================
  // Render Featured Projects (Home Page)
  // ============================================
  function renderFeaturedProjects(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.log('Featured projects container not found');
      return;
    }

    if (!projectsData || projectsData.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-200);">Projects loading...</p>';
      return;
    }

    const featuredProjects = projectsData.filter(p => p.featured).slice(0, 3);
    
    if (featuredProjects.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-200);">No featured projects available at this time.</p>';
      return;
    }

    // Get base path for images
    const basePath = window.location.pathname.split('/').slice(0, -1).join('/') || '';
    const imageBase = basePath ? `${basePath}/` : '';
    const fallbackImage = imageBase + 'assets/img/home.png';

    container.innerHTML = featuredProjects.map(project => {
      const imagePath = project.image.startsWith('http') ? project.image : (imageBase + project.image);
      
      return `
        <div class="portfolio-card" data-project-id="${project.id}">
          <img src="${imagePath}" alt="${project.title}" class="portfolio-card-image" onerror="this.onerror=null; this.src='${fallbackImage}';">
          <div class="portfolio-card-content">
            <span class="portfolio-card-category">${project.category}</span>
            <h3 class="portfolio-card-title">${project.title}</h3>
            <p class="portfolio-card-location">${project.location}</p>
            <p class="portfolio-card-summary">${project.summary}</p>
          </div>
        </div>
      `;
    }).join('');

    // Add click handlers for featured projects
    container.querySelectorAll('.portfolio-card').forEach(card => {
      card.addEventListener('click', function() {
        const projectId = this.getAttribute('data-project-id');
        const project = projectsData.find(p => p.id === projectId);
        if (project) {
          openModal(project);
        }
      });
    });
  }

  // ============================================
  // Render Portfolio Grid (Portfolio Page)
  // ============================================
  function renderPortfolioGrid(filter = 'All') {
    const container = document.getElementById('portfolioGrid');
    if (!container) return;

    let filteredProjects = projectsData;
    
    if (filter !== 'All') {
      filteredProjects = projectsData.filter(p => {
        if (filter === 'New Builds') return p.category === 'New Builds';
        if (filter === 'Renovations') return p.category === 'Renovations';
        if (filter === 'Outdoor') return p.category === 'Outdoor';
        if (filter === 'Commercial') return p.category === 'Commercial';
        return true;
      });
    }

    if (filteredProjects.length === 0) {
      container.innerHTML = '<p class="text-center">No projects found in this category.</p>';
      return;
    }

    // Get base path for images
    const basePath = window.location.pathname.split('/').slice(0, -1).join('/') || '';
    const imageBase = basePath ? `${basePath}/` : '';
    const fallbackImage = imageBase + 'assets/img/home.png';

    container.innerHTML = filteredProjects.map(project => {
      const imagePath = project.image.startsWith('http') ? project.image : (imageBase + project.image);
      
      return `
        <div class="portfolio-card" data-project-id="${project.id}">
          <img src="${imagePath}" alt="${project.title}" class="portfolio-card-image" onerror="this.onerror=null; this.src='${fallbackImage}';">
          <div class="portfolio-card-content">
            <span class="portfolio-card-category">${project.category}</span>
            <h3 class="portfolio-card-title">${project.title}</h3>
            <p class="portfolio-card-location">${project.location}</p>
            <p class="portfolio-card-summary">${project.summary}</p>
          </div>
        </div>
      `;
    }).join('');

    // Add click handlers
    container.querySelectorAll('.portfolio-card').forEach(card => {
      card.addEventListener('click', function() {
        const projectId = this.getAttribute('data-project-id');
        const project = projectsData.find(p => p.id === projectId);
        if (project) {
          openModal(project);
        }
      });
    });
  }

  // ============================================
  // Portfolio Filter Functionality
  // ============================================
  function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        currentFilter = filter;
        
        // Update active state
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Re-render grid
        renderPortfolioGrid(filter);
        
        // Track filter usage
        if (typeof gtag !== 'undefined') {
          gtag('event', 'portfolio_filter', {
            'event_category': 'Portfolio',
            'event_label': filter
          });
        }
      });
    });
  }

  // ============================================
  // Modal / Lightbox Functionality
  // ============================================
  function openModal(project) {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    const modalContent = modal.querySelector('.modal-content');
    
    // Get base path for images
    const basePath = window.location.pathname.split('/').slice(0, -1).join('/') || '';
    const imageBase = basePath ? `${basePath}/` : '';
    const imagePath = project.image.startsWith('http') ? project.image : (imageBase + project.image);
    const fallbackImage = imageBase + 'assets/img/home.png';
    
    modalContent.innerHTML = `
      <button class="modal-close" aria-label="Close modal">&times;</button>
      <img src="${imagePath}" alt="${project.title}" class="modal-image" onerror="this.onerror=null; this.src='${fallbackImage}';">
      <h2>${project.title}</h2>
      <p style="color: var(--text-200); margin-bottom: 1rem;">${project.location}</p>
      <p style="color: var(--text-200); margin-bottom: 2rem;">${project.summary}</p>
      
      <div class="modal-details">
        <div class="modal-detail-item">
          <h4>Scope</h4>
          <ul>
            ${project.details.scope.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        <div class="modal-detail-item">
          <h4>Timeline</h4>
          <p>${project.details.timeline}</p>
        </div>
        <div class="modal-detail-item">
          <h4>Highlights</h4>
          <ul>
            ${project.details.highlights.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Close button handler
    const closeBtn = modalContent.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Track modal open
    if (typeof gtag !== 'undefined') {
      gtag('event', 'portfolio_view', {
        'event_category': 'Portfolio',
        'event_label': project.title
      });
    }
  }

  function closeModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Close modal on overlay click
  document.addEventListener('click', function(e) {
    const modal = document.getElementById('projectModal');
    if (modal && e.target === modal) {
      closeModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // ============================================
  // Initialize Portfolio
  // ============================================
  async function init() {
    await loadProjects();
    
    // Render featured projects if on home page
    if (document.getElementById('featuredProjects')) {
      renderFeaturedProjects('featuredProjects');
    }
    
    // Render portfolio grid if on portfolio page
    if (document.getElementById('portfolioGrid')) {
      renderPortfolioGrid('All');
      initFilters();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export functions for global access if needed
  window.portfolioModule = {
    renderFeaturedProjects,
    renderPortfolioGrid,
    openModal,
    closeModal
  };

})();
