(function () {
  const gallery = document.getElementById('gallery');
  const filterBar = document.getElementById('filterBar');
  const awardsList = document.getElementById('awardsList');
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxImages = document.getElementById('lightboxImages');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxMeta = document.getElementById('lightboxMeta');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentFilter = 'all';
  let visibleWorks = [];
  let currentIndex = 0;

  function getWorkImages(work) {
    return work.images && work.images.length ? work.images : [work.image];
  }

  function thumbPath(imagePath) {
    const base = imagePath.split('/').pop().replace(/\.[^.]+$/, '');
    return `assets/thumbs/${base}.jpg`;
  }

  function renderGallery() {
    gallery.innerHTML = WORKS.map((work) => {
      const imageCount = getWorkImages(work).length;
      const countTag = imageCount > 1 ? `<span class="gallery-count">${imageCount} 张</span>` : '';
      return `
      <article class="gallery-item${currentFilter !== 'all' && work.category !== currentFilter ? ' hidden' : ''}"
               data-id="${work.id}" data-category="${work.category}">
        <div class="gallery-frame">
          <img src="${thumbPath(work.image)}" alt="${work.title}" loading="lazy" decoding="async">
          <span class="gallery-tag">${work.categoryLabel}</span>
          ${countTag}
        </div>
        <div class="gallery-info">
          <h3>${work.title}</h3>
          <p>${work.year} · ${work.medium}</p>
        </div>
      </article>
    `;
    }).join('');

    gallery.querySelectorAll('.gallery-item').forEach((item, index) => {
      item.style.animationDelay = `${index * 0.04}s`;
      item.addEventListener('click', () => openLightbox(item.dataset.id));
    });
  }

  function renderAwards() {
    awardsList.innerHTML = AWARDS.map((item) => `<li>${item}</li>`).join('');
  }

  function getVisibleWorks() {
    return currentFilter === 'all'
      ? WORKS
      : WORKS.filter((w) => w.category === currentFilter);
  }

  function openLightbox(id) {
    visibleWorks = getVisibleWorks();
    currentIndex = visibleWorks.findIndex((w) => w.id === id);
    if (currentIndex === -1) return;
    updateLightbox();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImages.innerHTML = '';
  }

  function formatMeta(work, extra) {
    const parts = [work.categoryLabel, work.year, work.size, work.medium, extra].filter(
      (part) => part && part !== '—'
    );
    return parts.join(' · ');
  }

  function updateLightbox() {
    const work = visibleWorks[currentIndex];
    const images = getWorkImages(work);
    const isGroup = images.length > 1;

    lightboxContent.classList.toggle('is-group', isGroup);
    lightboxContent.classList.toggle('is-single', !isGroup);

    lightboxImages.innerHTML = images
      .map((src, index) => `<img src="${src}" alt="${work.title}（${index + 1}）">`)
      .join('');

    lightboxTitle.textContent = work.title;
    lightboxMeta.textContent = isGroup
      ? formatMeta(work, `共 ${images.length} 张`)
      : formatMeta(work);
    lightboxDesc.textContent = work.description;
  }

  function navigateLightbox(dir) {
    currentIndex = (currentIndex + dir + visibleWorks.length) % visibleWorks.length;
    updateLightbox();
  }

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    filterBar.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;

    gallery.querySelectorAll('.gallery-item').forEach((item) => {
      const match = currentFilter === 'all' || item.dataset.category === currentFilter;
      item.classList.toggle('hidden', !match);
    });
  });

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  lightboxNext.addEventListener('click', () => navigateLightbox(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  renderGallery();
  renderAwards();
})();
