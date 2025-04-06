/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', async () => {
  async function loadHeatData () {
    try {
      const response = await fetch('http://127.0.0.1:3000/HeatData')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const heatData = await response.json()
      console.log(heatData)
    } catch (error) {
      console.error('Error al cargar los datos de calor:', error)
    }
  }
  loadHeatData()
})

const width = 900
const height = 600

const svg = d3.select('#HeatChart')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

const projection = d3.geoMercator().scale(140).translate([width / 2, height / 1.4])
const path = d3.geoPath(projection)

const g = svg.append('g')

d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(data => {
  const countries = topojson.feature(data, data.objects.countries)
  g.selectAll('path').data(countries.features).enter().append('path')
    .attr('class', 'country').attr('d', path)
  console.log(countries.features[0])
  console.log(countries.features[100].properties.name)
})
