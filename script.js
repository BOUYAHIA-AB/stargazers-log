document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('starred-list');
  if (!container) return;

  fetch('events.json')
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load events.json');
      return res.json();
    })
    .then((data) => renderList(data, container))
    .catch((err) => {
      container.innerHTML = `<p class="muted">Unable to load starred repositories: ${err.message}</p>`;
      console.error(err);
    });
});

function renderList(events, container) {
  if (!Array.isArray(events) || events.length === 0) {
    container.innerHTML = '<p class="muted">No starred repositories found.</p>';
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'star-list';

  events.forEach((evt) => {
    const repo = evt.repo || {};
    const li = document.createElement('li');
    li.className = 'star-item';

    const avatar = document.createElement('img');
    avatar.className = 'avatar';
    avatar.src = (evt.actor && evt.actor.avatar_url) || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
    avatar.alt = (evt.actor && evt.actor.login) ? `${evt.actor.login} avatar` : 'avatar';

    const info = document.createElement('div');
    info.className = 'repo-info';

    const name = document.createElement('a');
    name.className = 'repo-name';
    name.href = repo.html_url || '#';
    name.textContent = repo.name || 'unknown/repo';
    name.target = '_blank';
    name.rel = 'noopener noreferrer';

    const desc = document.createElement('div');
    desc.className = 'repo-description';
    desc.textContent = repo.description || '';

    const meta = document.createElement('div');
    meta.className = 'repo-meta';
    const lang = repo.language ? repo.language : '—';
    const stars = (typeof repo.stargazers_count === 'number') ? repo.stargazers_count : '—';
    meta.textContent = `${lang} · ⭐ ${stars}`;

    info.appendChild(name);
    if (desc.textContent) info.appendChild(desc);

    li.appendChild(avatar);
    li.appendChild(info);
    li.appendChild(meta);

    ul.appendChild(li);
  });

  container.innerHTML = '';
  container.appendChild(ul);
}
