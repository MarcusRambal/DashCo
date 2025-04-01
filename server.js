const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(cors())

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
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
    console.log('✅ Consulta de países exitosa' + results.map(row => row.entity))
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
})
