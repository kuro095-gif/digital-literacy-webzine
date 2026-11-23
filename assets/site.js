const story = document.querySelector('[data-story]');

if (story) {
  const stage = story.querySelector('[data-story-stage]');
  const panels = Array.from(stage.querySelectorAll('[data-scene]'));
  const jumps = Array.from(stage.querySelectorAll('[data-story-jump]'));
  const headlineButtons = Array.from(stage.querySelectorAll('[data-headline]'));
  const secondHeadline = stage.querySelector('[data-headline="b"]');
  const photoHeadline = stage.querySelector('[data-photo-headline]');
  const headlineStatus = stage.querySelector('[data-headline-status]');
  const reveals = Array.from(stage.querySelectorAll('[data-reveal-at]'), (element) => [
    element, Number(element.dataset.revealAt),
  ]);
  const pinning = window.matchMedia(
    '(prefers-reduced-motion: no-preference) and (min-width: 761px) and (min-height: 37rem), ' +
    '(prefers-reduced-motion: no-preference) and (max-width: 760px) and (min-height: 41rem)',
  );
  const phases = [
    { name: 'teach', scene: 'teach', start: 0.79 },
    { name: 'evidence', scene: 'evidence', start: 0.58 },
    { name: 'title-b', scene: 'headlines', start: 0.39, headline: 'b' },
    { name: 'title-a', scene: 'headlines', start: 0.17, headline: 'a' },
    { name: 'opening', scene: 'opening', start: 0 },
  ];
  let activePhase;
  let animationFrame = 0;

  function selectHeadline(button, announce = false) {
    headlineButtons.forEach((choice) => {
      choice.setAttribute('aria-pressed', String(choice === button));
    });

    const line = button.querySelector('span');
    photoHeadline.replaceChildren(...Array.from(line.childNodes, (node) => node.cloneNode(true)));
    if (announce) headlineStatus.textContent = button.textContent.trim().replace(/\s+/g, ' ');
  }

  headlineButtons.forEach((button) => {
    button.addEventListener('click', () => selectHeadline(button, true));
  });

  function updatePhase(phase) {
    if (activePhase === phase) return;
    activePhase = phase;
    stage.dataset.phase = phase.name;
    secondHeadline.hidden = phase.name === 'title-a';
    panels.forEach((panel) => {
      const active = panel.dataset.scene === phase.scene;
      panel.classList.toggle('is-current', active);
      panel.inert = !active;
    });
    jumps.forEach((button) => {
      if (button.dataset.storyJump === phase.scene) {
        button.setAttribute('aria-current', 'step');
      } else {
        button.removeAttribute('aria-current');
      }
    });
    if (phase.headline) selectHeadline(headlineButtons.find((button) => button.dataset.headline === phase.headline));
  }

  function storyDistance() {
    return Math.max(1, story.offsetHeight - stage.offsetHeight);
  }

  function drawStory() {
    animationFrame = 0;
    if (!story.classList.contains('is-enhanced')) return;

    const progress = Math.min(1, Math.max(0, -story.getBoundingClientRect().top / storyDistance()));
    const movement = Math.min(1, Math.max(0, (progress - 0.02) / 0.15));
    const framing = movement * movement * (3 - 2 * movement);
    stage.style.setProperty('--story-progress', progress.toFixed(4));
    stage.style.setProperty('--framing', framing.toFixed(4));
    updatePhase(phases.find((phase) => progress >= phase.start));
    reveals.forEach(([element, start]) => {
      element.classList.toggle('is-revealed', progress >= start);
    });
  }

  function requestStoryFrame() {
    if (!animationFrame) animationFrame = window.requestAnimationFrame(drawStory);
  }

  function setStoryMode() {
    const enhanced = pinning.matches && CSS.supports('height', '100svh');
    story.classList.toggle('is-enhanced', enhanced);
    if (enhanced) {
      requestStoryFrame();
      return;
    }
    activePhase = undefined;
    delete stage.dataset.phase;
    stage.style.removeProperty('--framing');
    stage.style.removeProperty('--story-progress');
    secondHeadline.hidden = false;
    panels.forEach((panel) => { panel.inert = false; });
  }

  jumps.forEach((button) => {
    button.addEventListener('click', () => {
      const phase = phases.find((entry) => entry.scene === button.dataset.storyJump);
      const start = story.getBoundingClientRect().top + window.scrollY;
      const offset = phase.start === 0 ? 0 : 4;
      window.scrollTo({ top: start + storyDistance() * phase.start + offset, behavior: 'smooth' });
    });
  });

  window.addEventListener('scroll', requestStoryFrame, { passive: true });
  window.addEventListener('resize', requestStoryFrame, { passive: true });
  pinning.addEventListener('change', setStoryMode);
  setStoryMode();
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
