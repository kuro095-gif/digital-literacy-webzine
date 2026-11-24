const cover = document.querySelector('.cover');

if (cover) {
  const stacked = window.matchMedia('(max-width: 51.99rem)');
  const canPin = CSS.supports('position', 'sticky');
  const spreads = Array.from(document.querySelectorAll('[data-scroll-story]'), (spread) => ({
    spread,
    visual: spread.querySelector('.story-visual'),
    headings: Array.from(spread.querySelectorAll('[data-step]'), (step) => step.firstElementChild),
  }));
  let frame = 0;
  let coverProgress = 0;

  function updateStory() {
    frame = 0;
    const height = document.documentElement.clientHeight;
    const coverTop = cover.getBoundingClientRect().top;
    const travel = Math.max(1, Math.min(300, height * 0.44));
    const progress = Math.max(0, Math.min(1, -coverTop / travel));
    const activeSteps = spreads.map(({ spread, visual, headings }) => {
      const inset = stacked.matches && spread.hasAttribute('data-pinned')
        ? Math.max(0, Math.min(height, visual.getBoundingClientRect().bottom))
        : 0;
      const readingLine = inset + (height - inset) * 0.54;
      let current = headings[0];
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > readingLine) break;
        current = heading;
      }
      return current.parentElement.dataset.step;
    });

    if (progress !== coverProgress) {
      cover.style.setProperty('--cover-progress', progress.toFixed(4));
      coverProgress = progress;
    }
    spreads.forEach(({ spread }, index) => {
      if (spread.dataset.active !== activeSteps[index]) spread.dataset.active = activeSteps[index];
    });
  }

  function queueStoryUpdate() {
    if (!frame) frame = window.requestAnimationFrame(updateStory);
  }

  function fitStoryVisuals() {
    const height = document.documentElement.clientHeight;
    const maxVisualHeight = stacked.matches ? height - 112 : height * 0.87;
    const fits = spreads.map(({ visual }) => canPin && visual.offsetHeight <= maxVisualHeight);
    // Pinning is optional. The reading position still updates every scene.
    spreads.forEach(({ spread }, index) => spread.toggleAttribute('data-pinned', fits[index]));
    queueStoryUpdate();
  }

  spreads.forEach(({ spread }) => spread.setAttribute('data-enhanced', ''));
  if ('ResizeObserver' in window) {
    const visualSizes = new ResizeObserver(fitStoryVisuals);
    spreads.forEach(({ visual }) => visualSizes.observe(visual));
  }
  window.addEventListener('scroll', queueStoryUpdate, { passive: true });
  window.addEventListener('resize', fitStoryVisuals);
  window.addEventListener('pageshow', fitStoryVisuals);
  fitStoryVisuals();
}

const subjectMenu = document.querySelector('[data-subject-menu]');

if (subjectMenu) {
  const links = Array.from(subjectMenu.querySelectorAll('a[data-subject]'));
  const panels = new Map(
    Array.from(document.querySelectorAll('[data-subject-panel]'), (panel) => [panel.id, panel]),
  );

  function showSubject(id) {
    for (const [name, panel] of panels) {
      panel.hidden = name !== id;
    }
    links.forEach((link) => {
      if (link.dataset.subject === id) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function showFromHash() {
    const id = window.location.hash.slice(1);
    showSubject(panels.has(id) ? id : links[0].dataset.subject);
  }

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
        showSubject(link.dataset.subject);
      }
    });
  });

  window.addEventListener('hashchange', showFromHash);
  showFromHash();
}

if (document.querySelector('.reading-main')) {
  function openLinkedSession() {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target?.matches('details.session')) target.open = true;
  }

  window.addEventListener('hashchange', openLinkedSession);
  openLinkedSession();
}
