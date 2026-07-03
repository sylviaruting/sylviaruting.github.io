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
  let activeLoads = [];
  let blobUrls = [];

  function abortActiveLoads() {
    activeLoads.forEach((xhr) => xhr.abort());
    activeLoads = [];
  }

  function revokeBlobUrls() {
    blobUrls.forEach((url) => URL.revokeObjectURL(url));
    blobUrls = [];
  }

  function cleanupLightboxLoads() {
    abortActiveLoads();
    revokeBlobUrls();
  }

  function loadImageWithProgress(src, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      activeLoads.push(xhr);
      xhr.open('GET', src);
      xhr.responseType = 'blob';

      let reportedIndeterminate = false;

      xhr.onprogress = (e) => {
        if (e.lengthComputable && e.total > 0) {
          onProgress(e.loaded / e.total, false);
        } else if (!reportedIndeterminate) {
          reportedIndeterminate = true;
          onProgress(0, true);
        }
      };

      xhr.onload = () => {
        const idx = activeLoads.indexOf(xhr);
        if (idx !== -1) activeLoads.splice(idx, 1);

        if (xhr.status >= 200 && xhr.status < 300) {
          const blobUrl = URL.createObjectURL(xhr.response);
          blobUrls.push(blobUrl);
          resolve(blobUrl);
        } else {
          reject(new Error(`HTTP ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        const idx = activeLoads.indexOf(xhr);
        if (idx !== -1) activeLoads.splice(idx, 1);
        reject(new Error('Network error'));
      };

      xhr.onabort = () => {
        const idx = activeLoads.indexOf(xhr);
        if (idx !== -1) activeLoads.splice(idx, 1);
        reject(new Error('Aborted'));
      };

      xhr.send();
    });
  }

  function createLightboxViewport(work, src, index) {
    const viewport = document.createElement('div');
    viewport.className = 'lightbox-zoom-viewport is-loading';
    viewport.dataset.src = src;
    viewport.innerHTML = `
      <div class="lightbox-load-overlay" aria-hidden="false">
        <div class="lightbox-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div class="lightbox-progress-bar"></div>
        </div>
        <span class="lightbox-progress-text">加载中…</span>
      </div>
      <img alt="${work.title}（${index + 1}）" hidden>
    `;
    return viewport;
  }

  function startViewportLoad(viewport) {
    const src = viewport.dataset.src;
    const img = viewport.querySelector('img');
    const overlay = viewport.querySelector('.lightbox-load-overlay');
    const progress = viewport.querySelector('.lightbox-progress');
    const progressBar = viewport.querySelector('.lightbox-progress-bar');
    const progressText = viewport.querySelector('.lightbox-progress-text');

    overlay.classList.remove('is-error');
    overlay.onclick = null;
    overlay.style.cursor = '';
    overlay.setAttribute('aria-hidden', 'false');
    viewport.classList.add('is-loading');
    img.hidden = true;
    img.removeAttribute('src');
    progress.classList.remove('is-indeterminate');
    progressBar.style.width = '0%';
    progress.setAttribute('aria-valuenow', '0');
    progressText.textContent = '加载中…';

    const loadId = Symbol('load');
    viewport._loadId = loadId;

    loadImageWithProgress(src, (ratio, indeterminate) => {
      if (viewport._loadId !== loadId) return;

      if (indeterminate) {
        progress.classList.add('is-indeterminate');
        progressText.textContent = '加载中…';
        return;
      }

      progress.classList.remove('is-indeterminate');
      const pct = Math.round(ratio * 100);
      progressBar.style.width = `${pct}%`;
      progress.setAttribute('aria-valuenow', String(pct));
      progressText.textContent = `加载中 ${pct}%`;
    })
      .then((blobUrl) => {
        if (viewport._loadId !== loadId) {
          URL.revokeObjectURL(blobUrl);
          const blobIdx = blobUrls.indexOf(blobUrl);
          if (blobIdx !== -1) blobUrls.splice(blobIdx, 1);
          return;
        }

        img.src = blobUrl;
        img.hidden = false;

        const onReady = () => {
          if (viewport._loadId !== loadId) return;
          viewport.classList.remove('is-loading');
          overlay.setAttribute('aria-hidden', 'true');
          setupLightboxZoom(viewport, img);
        };

        if (img.complete) {
          onReady();
        } else {
          img.addEventListener('load', onReady, { once: true });
        }
      })
      .catch((err) => {
        if (viewport._loadId !== loadId || err.message === 'Aborted') return;

        overlay.classList.add('is-error');
        progress.classList.remove('is-indeterminate');
        progressBar.style.width = '0%';
        progressText.textContent = '加载失败，点击重试';
        overlay.style.cursor = 'pointer';
        overlay.onclick = () => startViewportLoad(viewport);
      });
  }

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
    cleanupLightboxLoads();
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

  const MIN_ZOOM = 1;
  const ABS_MAX_ZOOM = 12;
  const DEFAULT_MAX_ZOOM = 4;

  function getRenderedImageSize(img) {
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const boxW = img.clientWidth;
    const boxH = img.clientHeight;

    if (!nw || !nh || !boxW || !boxH) {
      return {
        width: Math.max(img.offsetWidth, 1),
        height: Math.max(img.offsetHeight, 1),
      };
    }

    const imageRatio = nw / nh;
    const boxRatio = boxW / boxH;

    if (imageRatio > boxRatio) {
      return { width: boxW, height: boxW / imageRatio };
    }
    return { width: boxH * imageRatio, height: boxH };
  }

  function getMaxZoomForImage(baseWidth, baseHeight) {
    const containerW = lightboxImages.clientWidth || 1;
    const containerH = window.innerHeight * 0.8;
    const fillZoom = Math.max(containerW / baseWidth, containerH / baseHeight);
    return Math.min(ABS_MAX_ZOOM, Math.max(DEFAULT_MAX_ZOOM, fillZoom * 1.25));
  }

  function setupLightboxZoom(viewport, img) {
    let scale = 1;
    let baseWidth = 0;
    let baseHeight = 0;
    let maxZoom = DEFAULT_MAX_ZOOM;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartScrollLeft = 0;
    let dragStartScrollTop = 0;
    let pinchStartDist = 0;
    let pinchStartScale = 1;
    let eventsBound = false;

    function captureBaseSize() {
      viewport.style.width = '';
      viewport.style.height = '';
      viewport.style.margin = '';
      img.style.width = '';
      img.style.height = '';
      img.style.maxHeight = '';

      const rendered = getRenderedImageSize(img);
      baseWidth = Math.max(rendered.width, 1);
      baseHeight = Math.max(rendered.height, 1);
      maxZoom = getMaxZoomForImage(baseWidth, baseHeight);

      viewport.style.width = `${baseWidth}px`;
      viewport.style.height = `${baseHeight}px`;
      viewport.style.margin = '0 auto';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.maxHeight = 'none';
    }

    function applyScale() {
      img.style.transform = '';

      if (scale <= MIN_ZOOM) {
        scale = MIN_ZOOM;
        captureBaseSize();
        viewport.classList.remove('is-zoomed', 'is-dragging');
        return;
      }

      viewport.style.width = `${baseWidth * scale}px`;
      viewport.style.height = `${baseHeight * scale}px`;
      viewport.style.margin = '0 auto';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.maxHeight = 'none';
      viewport.classList.add('is-zoomed');
    }

    function zoomAt(clientX, clientY, newScale) {
      const clampedScale = Math.max(MIN_ZOOM, Math.min(maxZoom, newScale));
      const oldScale = scale;
      const scrollEl = lightboxImages;
      const scrollRect = scrollEl.getBoundingClientRect();

      if (clampedScale <= MIN_ZOOM) {
        scale = MIN_ZOOM;
        applyScale();
        scrollEl.scrollLeft = 0;
        scrollEl.scrollTop = 0;
        return;
      }

      const contentX = scrollEl.scrollLeft + (clientX - scrollRect.left);
      const contentY = scrollEl.scrollTop + (clientY - scrollRect.top);

      scale = clampedScale;
      applyScale();

      const ratio = scale / oldScale;
      scrollEl.scrollLeft = contentX * ratio - (clientX - scrollRect.left);
      scrollEl.scrollTop = contentY * ratio - (clientY - scrollRect.top);
    }

    function touchDistance(t0, t1) {
      return Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
    }

    function bindEvents() {
      viewport.addEventListener(
        'wheel',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          const factor = e.deltaY > 0 ? 0.9 : 1.1;
          zoomAt(e.clientX, e.clientY, scale * factor);
        },
        { passive: false }
      );

      viewport.addEventListener('mousedown', (e) => {
        if (scale <= MIN_ZOOM || e.button !== 0) return;
        e.preventDefault();
        isDragging = true;
        viewport.classList.add('is-dragging');
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragStartScrollLeft = lightboxImages.scrollLeft;
        dragStartScrollTop = lightboxImages.scrollTop;
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        lightboxImages.scrollLeft = dragStartScrollLeft - (e.clientX - dragStartX);
        lightboxImages.scrollTop = dragStartScrollTop - (e.clientY - dragStartY);
      });

      window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        viewport.classList.remove('is-dragging');
      });

      viewport.addEventListener(
        'touchstart',
        (e) => {
          if (e.touches.length === 2) {
            e.preventDefault();
            isDragging = false;
            viewport.classList.remove('is-dragging');
            pinchStartDist = touchDistance(e.touches[0], e.touches[1]);
            pinchStartScale = scale;
          } else if (e.touches.length === 1 && scale > MIN_ZOOM) {
            e.preventDefault();
            isDragging = true;
            dragStartX = e.touches[0].clientX;
            dragStartY = e.touches[0].clientY;
            dragStartScrollLeft = lightboxImages.scrollLeft;
            dragStartScrollTop = lightboxImages.scrollTop;
          }
        },
        { passive: false }
      );

      viewport.addEventListener(
        'touchmove',
        (e) => {
          if (e.touches.length === 2) {
            e.preventDefault();
            const t0 = e.touches[0];
            const t1 = e.touches[1];
            const ratio = touchDistance(t0, t1) / pinchStartDist;
            const centerX = (t0.clientX + t1.clientX) / 2;
            const centerY = (t0.clientY + t1.clientY) / 2;
            zoomAt(centerX, centerY, pinchStartScale * ratio);
          } else if (e.touches.length === 1 && isDragging && scale > MIN_ZOOM) {
            e.preventDefault();
            lightboxImages.scrollLeft = dragStartScrollLeft - (e.touches[0].clientX - dragStartX);
            lightboxImages.scrollTop = dragStartScrollTop - (e.touches[0].clientY - dragStartY);
          }
        },
        { passive: false }
      );

      viewport.addEventListener('touchend', () => {
        isDragging = false;
        viewport.classList.remove('is-dragging');
      });
    }

    function init() {
      const tryCapture = () => {
        captureBaseSize();
        if (baseWidth <= 1 || baseHeight <= 1) {
          return false;
        }
        if (!eventsBound) {
          bindEvents();
          eventsBound = true;
        }
        return true;
      };

      requestAnimationFrame(() => {
        if (tryCapture()) return;
        requestAnimationFrame(() => {
          if (tryCapture()) return;
          img.addEventListener('load', () => tryCapture(), { once: true });
        });
      });
    }

    init();
  }

  function updateLightbox() {
    cleanupLightboxLoads();

    const work = visibleWorks[currentIndex];
    const images = getWorkImages(work);
    const isGroup = images.length > 1;

    lightboxContent.classList.toggle('is-group', isGroup);
    lightboxContent.classList.toggle('is-single', !isGroup);

    lightboxImages.innerHTML = '';
    lightboxImages.scrollLeft = 0;
    lightboxImages.scrollTop = 0;

    images.forEach((src, index) => {
      const viewport = createLightboxViewport(work, src, index);
      lightboxImages.appendChild(viewport);
      startViewportLoad(viewport);
    });

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
