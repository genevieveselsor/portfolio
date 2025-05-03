import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let query = '';
let projects = [];
let selectedIndex = -1;
let data = [];

const searchInput = document.querySelector('.searchBar');
const projectsContainer = document.querySelector('.projects');

function renderPieChart(projectsGiven) {
  const svg = d3.select('svg');
  const legend = d3.select('.legend');

  svg.selectAll('*').remove();
  legend.selectAll('*').remove();

  const rolledData = d3.rollups(
    projectsGiven,
    v => v.length,
    d => d.year,
  );

  data = rolledData.map(([year, count]) => ({
    value: count,
    label: year,
  }));

  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const pie = d3.pie().value(d => d.value);
  const arcData = pie(data);
  const arc = d3.arc().innerRadius(0).outerRadius(50);

  svg
    .attr('viewBox', '-50 -50 100 100')
    .selectAll('path')
    .data(arcData)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => colors(i))
    .attr('class', (d, i) => (i === selectedIndex ? 'selected' : ''))
    .on('click', function (event, d) {
      const i = arcData.indexOf(d);
      selectedIndex = selectedIndex === i ? -1 : i;

      svg.selectAll('path')
        .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

      legend.selectAll('li')
        .attr('class', (_, idx) => (
          `legend-item${idx === selectedIndex ? ' selected' : ''}`
        ));

      renderProjects(getFilteredProjects(), projectsContainer, 'h2');
    });

  data.forEach((d, idx) => {
    legend
      .append('li')
      .attr('class', 'legend-item')
      .attr('style', `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

function getFilteredProjects() {
  return projects.filter((project) => {
    const matchesQuery = Object.values(project)
      .map(v => String(v).toLowerCase())
      .join('\n')
      .includes(query.toLowerCase());

    const matchesYear = selectedIndex === -1 || project.year === data[selectedIndex].label;

    return matchesQuery && matchesYear;
  });
}

searchInput.addEventListener('input', event => {
  query = event.target.value;
  renderProjects(getFilteredProjects(), projectsContainer, 'h2');
  renderPieChart(projects);
});

(async function () {
  projects = await fetchJSON('../lib/projects.json');

  renderProjects(projects, projectsContainer, 'h2');
  renderPieChart(projects);

  const titleElement = document.querySelector('.projects-title');
  if (titleElement) {
    titleElement.textContent = `${projects.length} Projects`;
  }
})();