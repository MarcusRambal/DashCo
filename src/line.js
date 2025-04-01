document.addEventListener('DOMContentLoaded', async () => {
  async function loadCountries () {
    try {
      const response = await fetch('http://127.0.0.1:3000/countries')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const countries = await response.json()
      console.log(countries)

      const container = document.getElementById('country-list')
      container.innerHTML = '' // Limpiar antes de agregar nuevos elementos

      countries.forEach(country => {
        const div = document.createElement('div') // Contenedor para checkbox + label
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

  // Llamar a la función al cargar la página
  loadCountries()
  console.log('Entre a line.js')
})
