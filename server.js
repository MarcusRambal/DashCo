const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(cors())

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'CampanaPlateada1902',
  database: 'covid_data'
})

db.connect(err => {
  if (err) {
    console.error('🚨 Error conectando a MySQL:', err)
    return
  }
  console.log('✅ Conectado a MySQL')
})

app.get('/countries', (req, res) => {
  const query = 'SELECT DISTINCT entity FROM casos_covid'
  db.query(query, (err, results) => {
    if (err) {
      console.error('🚨 Error en la consulta:', err)
      return res.status(500).send('Error en la base de datos')
    }
    res.json(results.map(row => row.entity))
    console.log('✅ Consulta de países exitosa')
  })
})

app.get('/data', (req, res) => {
  const selectedCountries = req.query.countries.split(',')

  const placeholders = selectedCountries.map(() => '?').join(',')

  const query = `select cc.entity, DATE_FORMAT(day, '%Y-%m-01') as month, SUM(cc.daily_deaths) as total_deaths
          from casos_covid cc
          WHERE 
            entity IN (${placeholders})
          GROUP BY entity, month
          ORDER BY entity, month`

  db.query(query, [selectedCountries], (err, results) => {
    if (err) {
      console.error('🚨 Error en la consulta:', err)
      return res.status(500).send('Error en la base de datos')
    }
    const grouped = {}

    results.forEach(row => {
      // eslint-disable-next-line camelcase
      const { entity, month, total_deaths } = row

      if (!grouped[entity]) {
        grouped[entity] = []
      }

      grouped[entity].push({
        day: month, 
        daily_deaths: Number(total_deaths)
      })
    })

    const formatted = Object.entries(grouped).map(([country, data]) => ({
      country,
      data
    }))

    res.json(formatted)
    console.log('✅ Consulta de datos exitosa')
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
})
