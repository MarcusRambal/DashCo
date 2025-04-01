document.addEventListener('DOMContentLoaded', function () {
  // Obtener datos desde el backend Express
  fetch('http://localhost:3000/data')
    .then(response => response.json())
    .then(data => {
      console.log(data)
    })
    .catch(error => console.error('Error al obtener los datos:', error))
})
