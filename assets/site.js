// Track the paragraph crossing the reading line. All of the article text stays in document order.
const spreads = Array.from(document.querySelectorAll('[data-scroll-story]'));

if (spreads.length && 'IntersectionObserver' in window && CSS.supports('position', 'sticky')) {
  const pinning = window.matchMedia('(prefers-reduced-motion: no-preference) and (min-height: 36rem)');
  const refreshers = spreads.map((spread) => {
    const steps = Array.from(spread.querySelectorAll('[data-step]'));
    let observer;

    return function observeSteps() {
      observer?.disconnect();
      if (!pinning.matches) {
        delete spread.dataset.active;
        return;
      }

      const height = document.documentElement.clientHeight;
      const fraction = Number(getComputedStyle(spread).getPropertyValue('--reading-line'));
      const line = Math.round(height * fraction);

      function syncStep() {
        let current = steps[0];
        for (const step of steps) {
          if (step.firstElementChild.getBoundingClientRect().top > line) break;
          current = step;
        }
        spread.dataset.active = current.dataset.step;
      }

      // Watch both the text and its surrounding step so a large scroll can skip whole paragraphs.
      observer = new IntersectionObserver(syncStep, {
        rootMargin: `0px 0px -${height - line}px 0px`,
      });
      steps.forEach((step) => {
        observer.observe(step);
        observer.observe(step.firstElementChild);
      });
      syncStep();
    };
  });

  function refreshStories() {
    refreshers.forEach((refresh) => refresh());
  }

  window.addEventListener('resize', refreshStories);
  window.addEventListener('pageshow', refreshStories);
  pinning.addEventListener('change', refreshStories);
  refreshStories();
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
