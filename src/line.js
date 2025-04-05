/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', async () => {
  const updateChartButton = document.getElementById('update-chart')

  async function loadCountries () {
    try {
      const response = await fetch('http://127.0.0.1:3000/countries')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const countries = await response.json()
      console.log(countries)

      const container = document.getElementById('country-list')
      container.innerHTML = ''

      countries.forEach(country => {
        const div = document.createElement('div')
        const checkbox = document.createElement('input')
        const label = document.createElement('label')

        checkbox.type = 'checkbox'
        checkbox.value = country
        checkbox.classList.add('country-checkbox')
        checkbox.id = `checkbox-${country}`

        label.htmlFor = `checkbox-${country}`
        label.textContent = country

        div.appendChild(checkbox)
        div.appendChild(label)
        container.appendChild(div)
      })
    } catch (error) {
      console.error('Error al cargar los países:', error)
    }
  }
  loadCountries()

  async function getSelectedCountries () {
    const checkboxes = document.querySelectorAll('.country-checkbox:checked')
    return Array.from(checkboxes).map(checkbox => checkbox.value)
  }

  async function fetchData (selectedCountries) {
    try {
      const response = await fetch('http://127.0.0.1:3000/data?countries=' + selectedCountries.join(','))
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      console.log(data)
      return data
    } catch (error) {
      console.error('Error al obtener los datos:', error)
    }
  }

  async function drawLineChart (data) {
    // eslint-disable-next-line no-undef
    d3.select('#LineChart').selectAll('*').remove()

    const margin = { top: 30, right: 80, bottom: 40, left: 50 }
    const width = 800 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom
    const svg = d3.select('#LineChart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const allDates = new Set()
    data.forEach(country => {
      country.data.forEach(point => allDates.add(point.day))
    })

    const parseDate = d3.timeParse('%Y-%m-%d')
    const dates = Array.from(allDates).map(d => parseDate(d)).sort((a, b) => a - b)

    // Escalas
    const xScale = d3.scaleTime()
      .domain(d3.extent(dates))
      .range([0, width])

    const yMax = d3.max(data.flatMap(c => c.data.map(p => p.daily_deaths)))
    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([height, 0])

    // Ejes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))

    svg.append('g')
      .call(d3.axisLeft(yScale))

    // Línea
    const line = d3.line()
      .x(d => xScale(parseDate(d.day)))
      .y(d => yScale(d.daily_deaths))

    // Colores para cada país
    const color = d3.scaleOrdinal(d3.schemeCategory10)

    data.forEach((country, index) => {
      svg.append('path')
        .datum(country.data)
        .attr('fill', 'none')
        .attr('stroke', color(index))
        .attr('stroke-width', 2)
        .attr('d', line)

      // Texto del nombre del país
      svg.append('text')
        .attr('transform', `translate(${width - 100},${20 + index * 20})`)
        .attr('fill', color(index))
        .text(country.country)
    })
  }

  updateChartButton.addEventListener('click', async () => {
    const selectedCountries = await getSelectedCountries()
    console.log('Selected countries:', selectedCountries)
    if (selectedCountries.length === 0) {
      console.log('Por favor, selecciona al menos un país.')
      return
    }

    try {
      const data = await fetchData(selectedCountries)
      console.log('Data fetched:', data)
      drawLineChart(data)
    } catch (error) {
      console.error('Error al obtener los datos:', error)
    }
  })
  console.log('Entre a line.js')
})
