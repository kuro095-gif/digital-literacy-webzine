const headlineExample = document.querySelector('[data-headline-example]');

if (headlineExample) {
  const headlines = [
    { before: '시민들이 도심에 ', emphasis: '평화롭게', after: ' 모였다' },
    { before: '시민들이 도심에 ', emphasis: '혼란을', after: ' 일으켰다' },
  ];
  const buttons = Array.from(headlineExample.querySelectorAll('button[data-headline]'));
  const caption = headlineExample.querySelector('[data-caption]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let transition;

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') === 'true') return;

      const { before, emphasis, after } = headlines[index];
      const highlight = document.createElement('strong');
      highlight.textContent = emphasis;
      caption.replaceChildren(before, highlight, after);

      buttons.forEach((choice) => {
        choice.setAttribute('aria-pressed', String(choice === button));
      });

      transition?.cancel();
      if (!motion.matches && typeof caption.animate === 'function') {
        transition = caption.animate(
          [{ opacity: 0.35, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 190, easing: 'ease-out' },
        );
      }
    });
  });
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
