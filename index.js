import express from 'express'
import request from 'request'
import cors from 'cors'

const app = express()

app.set('port', (process.env.PORT || 5000))

app.use(cors())

app.get('/list-countries', (req, res) => {
  const url = 'https://restcountries.eu/rest/v1/all'

  request({
    url,
    method: 'GET',
    headers: {
      'user-agent': 'node.js'
    }
  }, ( error, response ) => {
    const data = JSON.parse(response.body)

    const countries = data.map(data => {
      let countryData = {
        name: data.name,
        capital: data.capital,
        population: data.population
      }

      return countryData
    })

    res.json(countries)
  })
})

// app.get('/flag', (req, res) => {
//   let url = 'https://www.mediawiki.org/api/rest_v1/page'
//
//   request({
//     method: 'GET',
//     url,
//     headers: {
//       'user-agent': 'node.js'
//     }
//   },
//   ( error, response ) => {
//     const flag = JSON.parse(response.body)
//
//     res.json(flag)
//   })
// })

app.use(express.static(__dirname + '/public'))

app.listen(app.get('port'), () => console.log('Node app is running on port', app.get('port')) )
