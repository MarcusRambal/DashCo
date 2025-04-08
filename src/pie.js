/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', async () => {
  async function loadHeatData () {
    try {
      const response = await fetch('http://127.0.0.1:3000/dataYear')
      if (!response.ok) throw new Error('Network response was not ok')
      return await response.json()
    } catch (error) {
      console.error('Error al cargar los datos de calor:', error)
      return {}
    }
  }

  const dataYear = await loadHeatData()
  console.log('Data Year:', dataYear)
  const yearSelector = document.getElementById('pieYearSelector')

  // Llenar selector
  Object.keys(dataYear).forEach(year => {
    const option = document.createElement('option')
    option.value = year
    option.textContent = year
    yearSelector.appendChild(option)
  })

  const initialyear = Object.keys(dataYear)[0]
  renderpieChart(dataYear[initialyear])

  yearSelector.addEventListener('change', e => {
    const selectedyear = e.target.value
    renderpieChart(dataYear[selectedyear])
  })
})

function renderpieChart (dataForyear) {
  const svg = d3.select('#pieChart')
  svg.selectAll('*').remove() // Limpiar gráfico anterior

  const width = +svg.attr('width')
  const height = +svg.attr('height')
  const radius = Math.min(width, height) / 2

  const g = svg.append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  const color = d3.scaleOrdinal(d3.schemeCategory10)

  const pie = d3.pie()
    .sort(null)
    .value(d => d.deaths)

  const data = Object.entries(dataForyear)
    .map(([country, deaths]) => ({ country, deaths }))
    .filter(d => d.deaths > 0)
    .sort((a, b) => b.deaths - a.deaths)
    .slice(0, 10) // Top 10 países para el gráfico

  const arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0)

  const arcs = g.selectAll('.arc')
    .data(pie(data))
    .enter().append('g')
    .attr('class', 'arc')

  arcs.append('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data.country))

  arcs.append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('dy', '0.35em')
    .style('font-size', '10px')
    .style('text-anchor', 'middle')
    .text(d => d.data.country)
}
