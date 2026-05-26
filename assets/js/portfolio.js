/**
 * GW Properties & Development LLC - Portfolio JavaScript
 * Grid, filtering, modal detail view
 */

(function() {
  'use strict';

  let projectsData = [];
  let currentFilter = 'All';

  function escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function getPaths() {
    const basePath = window.location.pathname.split('/').slice(0, -1).join('/') || '';
    const imageBase = basePath ? `${basePath}/` : '';
    return { basePath, imageBase };
  }

  async function loadProjects() {
    try {
      const { basePath } = getPaths();
      const jsonPath = basePath ? `${basePath}/data/projects.json` : 'data/projects.json';

      const response = await fetch(jsonPath);
      if (!response.ok) {
        throw new Error(`Failed to load projects data: ${response.status}`);
      }
      projectsData = await response.json();
      return projectsData;
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  }

  function deriveCategories(projects) {
    const cats = [...new Set(projects.map((p) => p.category).filter(Boolean))];
    cats.sort((a, b) => a.localeCompare(b));
    return cats;
  }

  function countForCategory(category) {
    if (category === 'All') return projectsData.length;
    return projectsData.filter((p) => p.category === category).length;
  }

  function renderFilterButtons() {
    const container = document.getElementById('portfolioFilters');
    if (!container || !projectsData.length) return;

    const categories = deriveCategories(projectsData);
    const pills = [{ label: 'All', value: 'All' }]
      .concat(categories.map((c) => ({ label: c, value: c })));

    container.innerHTML = pills
      .map(
        ({ label, value }, i) =>
          `<button type="button" class="filter-btn${i === 0 ? ' active' : ''}" data-filter="${escapeHtml(value)}">${escapeHtml(label)} <span aria-hidden="true">(${countForCategory(value)})</span></button>`
      )
      .join('');
  }

  function updatePortfolioEmpty(visibleCount) {
    const el = document.getElementById('portfolioEmpty');
    if (!el) return;
    if (visibleCount === 0) {
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  }

  function updatePortfolioCount(filter, filteredCount) {
    const el = document.getElementById('portfolioCount');
    if (!el) return;

    if (!projectsData.length) {
      el.textContent = 'No projects to display yet.';
      return;
    }

    if (filter === 'All') {
      el.textContent = `${filteredCount} project${filteredCount === 1 ? '' : 's'}`;
    } else {
      el.textContent = `${filteredCount} project${filteredCount === 1 ? '' : 's'} in ${filter}`;
    }
  }

  function filterProjects(filter) {
    if (filter === 'All') return projectsData.slice();
    return projectsData.filter((p) => p.category === filter);
  }

  function renderFeaturedProjects(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!projectsData || projectsData.length === 0) {
      container.innerHTML =
        '<p style="text-align: center; color: var(--text-gray);">Projects loading...</p>';
      return;
    }

    const featuredProjects = projectsData.filter((p) => p.featured).slice(0, 3);

    if (featuredProjects.length === 0) {
      container.innerHTML =
        '<p style="text-align: center; color: var(--text-gray);">No featured projects available at this time.</p>';
      return;
    }

    const { imageBase } = getPaths();
    const fallbackImage = imageBase + 'assets/img/portfolio-kitchen.png';

    container.innerHTML = featuredProjects.map((project) => projectCardMarkup(project, imageBase, fallbackImage)).join('');

    attachCardHandlers(container);
  }

  function projectCardMarkup(project, imageBase, fallbackImage) {
    const imagePath = project.image.startsWith('http')
      ? project.image
      : imageBase + project.image;
    const title = escapeHtml(project.title);
    const category = escapeHtml(project.category || '');
    const location = escapeHtml(project.location || '');
    const summary = escapeHtml(project.summary || '');

    return `
      <article class="portfolio-card" tabindex="0" role="listitem" data-project-id="${escapeHtml(project.id)}"
        aria-label="View details: ${title}">
        <div class="portfolio-card-media">
          <img src="${imagePath}" alt="" class="portfolio-card-image" loading="lazy" decoding="async"
            onerror="this.onerror=null; this.src='${fallbackImage.replace(/'/g, "\\'")}';">
          <div class="portfolio-card-overlay" aria-hidden="true"><span>View project</span></div>
        </div>
        <div class="portfolio-card-body">
          ${category ? `<span class="portfolio-card-category">${category}</span>` : ''}
          <h3 class="portfolio-card-title">${title}</h3>
          ${location ? `<p class="portfolio-card-location">${location}</p>` : ''}
          <p class="portfolio-card-summary">${summary}</p>
        </div>
      </article>`;
  }

  function attachCardHandlers(root) {
    root.querySelectorAll('.portfolio-card').forEach((card) => {
      const openForCard = () => {
        const id = card.getAttribute('data-project-id');
        const project = projectsData.find((p) => p.id === id);
        if (project) openModal(project);
      };

      card.addEventListener('click', openForCard);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openForCard();
        }
      });
    });
  }

  function renderPortfolioGrid(filter = 'All') {
    const container = document.getElementById('portfolioGrid');
    if (!container) return;

    const filteredProjects = filterProjects(filter);
    updatePortfolioCount(filter, filteredProjects.length);
    updatePortfolioEmpty(filteredProjects.length);

    if (!projectsData.length) {
      container.innerHTML =
        '<p class="portfolio-empty">Unable to load projects. Please refresh or try again later.</p>';
      return;
    }

    if (filteredProjects.length === 0) {
      container.innerHTML = '';
      return;
    }

    const { imageBase } = getPaths();
    const fallbackImage = imageBase + 'assets/img/portfolio-kitchen.png';

    container.innerHTML = filteredProjects
      .map((project) => projectCardMarkup(project, imageBase, fallbackImage))
      .join('');

    attachCardHandlers(container);
  }

  function initFilters() {
    const strip = document.getElementById('portfolioFilters');
    if (!strip) return;

    strip.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      const filter = btn.getAttribute('data-filter');
      if (filter === null || filter === undefined) return;

      currentFilter = filter;

      strip.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      renderPortfolioGrid(filter);

      if (typeof gtag !== 'undefined') {
        gtag('event', 'portfolio_filter', {
          event_category: 'Portfolio',
          event_label: filter,
        });
      }
    });
  }

  function openModal(project) {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    const modalContent = modal.querySelector('.modal-content');
    const { imageBase } = getPaths();
    const imagePath = project.image.startsWith('http')
      ? project.image
      : imageBase + project.image;
    const fallbackImage = imageBase + 'assets/img/portfolio-kitchen.png';

    const title = escapeHtml(project.title);
    const location = escapeHtml(project.location || '');
    const summary = escapeHtml(project.summary || '');
    const scopeItems = (project.details && project.details.scope) || [];
    const highlights = (project.details && project.details.highlights) || [];
    const timeline = escapeHtml((project.details && project.details.timeline) || '—');

    modalContent.innerHTML = `
      <button type="button" class="modal-close" aria-label="Close project details">&times;</button>
      <img src="${imagePath}" alt="" class="modal-image" onerror="this.onerror=null; this.src='${fallbackImage.replace(/'/g, "\\'")}';">
      <h2 id="projectModalTitle">${title}</h2>
      <p class="modal-location" style="color: var(--text-gray); margin-bottom: 1rem;">${location}</p>
      <p style="color: var(--text-dark); margin-bottom: 2rem;">${summary}</p>
      <div class="modal-details">
        <div class="modal-detail-item">
          <h4>Scope</h4>
          <ul>
            ${scopeItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>
        <div class="modal-detail-item">
          <h4>Timeline</h4>
          <p>${timeline}</p>
        </div>
        <div class="modal-detail-item">
          <h4>Highlights</h4>
          <ul>
            ${highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-modal', 'true');

    const closeBtn = modalContent.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
      closeBtn.focus();
    }

    if (typeof gtag !== 'undefined') {
      gtag('event', 'portfolio_view', {
        event_category: 'Portfolio',
        event_label: project.title,
      });
    }
  }

  function closeModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
  }

  document.addEventListener('click', (e) => {
    const modal = document.getElementById('projectModal');
    if (modal && e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  async function init() {
    await loadProjects();

    if (document.getElementById('portfolioFilters')) {
      renderFilterButtons();
      initFilters();
    }

    if (document.getElementById('portfolioGrid')) {
      currentFilter = 'All';
      renderPortfolioGrid('All');
    }

    renderFeaturedProjects('featuredProjects');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.portfolioModule = {
    renderPortfolioGrid,
    openModal,
    closeModal,
  };
})();
