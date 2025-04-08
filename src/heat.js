/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', async () => {
  const yearSelector = document.getElementById('yearSelector')
  const width = 900
  const height = 600

  const colorScale = d3.scaleSequential(d3.interpolateReds)
    .domain([0, 1700])

  const svg = d3.select('#HeatChart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const projection = d3.geoMercator().scale(140).translate([width / 2, height / 1.4])
  const path = d3.geoPath(projection)

  const g = svg.append('g')

  const countriesData = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
  const countries = topojson.feature(countriesData, countriesData.objects.countries)
  console.log(countries)
  g.selectAll('path').data(countries.features).enter().append('path')
    .attr('class', 'country')
    .attr('d', path)

  async function loadHeatData () {
    try {
      const response = await fetch('http://127.0.0.1:3000/dataYear')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const dataYear = await response.json()
      return dataYear
    } catch (error) {
      console.error('Error al cargar los datos de calor:', error)
    }
  }

  const dataYear = await loadHeatData()

  if (!dataYear) return

  Object.keys(dataYear).forEach(year => {
    const option = document.createElement('option')
    option.value = year
    option.textContent = year
    yearSelector.appendChild(option)
  })

  function updateMapByYear (dataForYear) {
    console.log('Actualizando mapa para el mes:', dataForYear)
    g.selectAll('path')
      .transition()
      .duration(500)
      .attr('fill', d => {
        const countryName = d.properties.name
        const deaths = dataForYear[countryName] || 0
        return colorScale(deaths)
      })
  }

  yearSelector.addEventListener('change', e => {
    const selectedYear = e.target.value
    updateMapByYear(dataYear[selectedYear])
  })

  const initialYear = Object.keys(dataYear)[0]
  yearSelector.value = initialYear
  updateMapByYear(dataYear[initialYear])
})
