'use strict';

const projectLabels = {frontend:'Frontend',backend:'Backend',fullstack:'Fullstack',ferramentas:'Ferramentas'};
let selectedArea = 'all';
const projectGrid = document.getElementById('project-grid');
const projectSearch = document.getElementById('project-search');
const projectFilters = document.getElementById('project-filters');

function escapeProjectText(value) {
  return String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
}

function safeProjectURL(value) {
  try {
    const url = new URL(value, location.href);
    return ['https:', 'http:'].includes(url.protocol) ? url : null;
  } catch { return null; }
}

function matchingProjects() {
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
  const query = normalize(projectSearch.value.trim());
  return projectCatalog.filter(project => safeProjectURL(project.url) &&
    (selectedArea === 'all' || project.category === selectedArea) &&
    normalize(project.name + ' ' + project.description + ' ' + (projectLabels[project.category] || '')).includes(query));
}

function renderProjects() {
  const projects = matchingProjects();
  projectGrid.innerHTML = projects.map(project => {
    const url = safeProjectURL(project.url);
    const external = url.origin !== location.origin;
    const tone = ['available','progress','concept'].includes(project.statusTone) ? project.statusTone : 'progress';
    return `<a class="project-card" href="${escapeProjectText(project.url)}" ${external ? 'target="_blank" rel="noopener noreferrer"' : ''} aria-label="${escapeProjectText(project.name + ': ' + project.destination)}">
      <div class="project-card-top"><span class="project-symbol">${icon(project.icon)}</span><span class="project-open" aria-hidden="true">${icon('arrow')}</span></div>
      <h2>${escapeProjectText(project.name)}</h2>
      <p>${escapeProjectText(project.description)}</p>
      <div class="project-details"><span>${escapeProjectText(projectLabels[project.category] || 'Projeto')}</span><span>${escapeProjectText(project.destination)}</span></div>
      <div class="project-card-footer"><span class="project-status ${tone}"><span class="status-point" aria-hidden="true"></span>${escapeProjectText(project.status)}</span><span class="project-version">${escapeProjectText(project.version || 'Sem versão')}</span></div>
    </a>`;
  }).join('');
  document.getElementById('project-empty').hidden = projects.length > 0;
  document.getElementById('project-result').textContent = projects.length === 1 ? '1 projeto encontrado' : `${projects.length} projetos encontrados`;
}

const areas = ['all', ...Object.keys(projectLabels).filter(area => projectCatalog.some(project => project.category === area))];
projectFilters.innerHTML = areas.map(area => `<button type="button" data-area="${area}" class="${area === 'all' ? 'active' : ''}" aria-pressed="${area === 'all'}">${area === 'all' ? 'Todos' : projectLabels[area]}</button>`).join('');
projectFilters.querySelectorAll('[data-area]').forEach(button => {
  button.onclick = () => {
    selectedArea = button.dataset.area;
    projectFilters.querySelectorAll('[data-area]').forEach(item => {
      const active = item.dataset.area === selectedArea;
      item.classList.toggle('active',active);
      item.setAttribute('aria-pressed',active);
    });
    renderProjects();
  };
});
projectSearch.addEventListener('input', renderProjects);
document.getElementById('project-reset').onclick = () => {
  projectSearch.value = '';
  projectFilters.querySelector('[data-area="all"]').click();
  projectSearch.focus();
};
renderProjects();
