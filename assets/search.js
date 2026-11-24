const searchForm = document.querySelector('[data-lesson-search]');

if (searchForm && typeof webzineSearchIndex !== 'undefined') {
  const field = searchForm.querySelector('input[type="search"]');
  const status = searchForm.querySelector('[role="status"]');
  const results = document.querySelector('[data-search-results]');
  let previousQuery;

  function makeResult(page, matches, pattern) {
    const card = document.createElement('li');
    const context = document.createElement('p');
    context.className = 'search-result-meta';
    context.textContent = [page.label, page.grade].filter(Boolean).join(' · ');

    const heading = document.createElement('h3');
    const title = document.createElement('a');
    title.href = page.url;
    title.textContent = page.title;
    heading.append(title);

    const locations = document.createElement('ul');
    locations.className = 'search-locations';
    for (const { section, line } of matches) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = section.anchor ? page.url + '#' + section.anchor : page.url;
      link.className = 'search-location';
      link.textContent = section.label + ' 보기';

      const snippet = document.createElement('p');
      const match = line.match(pattern);
      const end = match.index + match[0].length;
      const mark = document.createElement('mark');
      mark.textContent = match[0];
      snippet.append(line.slice(0, match.index), mark, line.slice(end));
      item.append(link, snippet);
      locations.append(item);
    }
    card.append(context, heading, locations);
    return card;
  }

  function updateResults() {
    const query = field.value.normalize('NFC').trim().replace(/\s+/g, ' ');
    if (query === previousQuery) return;
    previousQuery = query;

    if (!query) {
      results.hidden = true;
      results.replaceChildren();
      status.textContent = '';
      return;
    }

    const pattern = new RegExp(query.replace(/[.?*+^$(){}|[\]\\]/g, '\\$&'), 'iu');
    const cards = [];
    for (const page of webzineSearchIndex) {
      const matches = [];
      for (const section of page.sections) {
        const line = section.lines.find((text) => pattern.test(text));
        if (line) matches.push({ section, line });
      }
      if (matches.length) {
        matches.sort((left, right) => Number(right.section.anchor.startsWith('session-')) -
          Number(left.section.anchor.startsWith('session-')));
        cards.push(makeResult(page, matches, pattern));
      }
    }

    results.replaceChildren(...cards);
    results.hidden = cards.length === 0;
    status.textContent = cards.length ? '검색 결과 ' + cards.length + '개' : '일치하는 문장이 없습니다.';
  }

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    updateResults();
  });
  field.addEventListener('input', (event) => {
    if (!event.isComposing) updateResults();
  });
  field.addEventListener('compositionend', updateResults);
  window.addEventListener('pageshow', updateResults);
  searchForm.hidden = false;
  updateResults();
}
