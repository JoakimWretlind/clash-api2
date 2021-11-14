const PORT = process.env.PORT // this is for deploying on heroku
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

// pages scraped
const pages = [
    {
        name: 'fandom',
        address: 'https://clashofclans.fandom.com/wiki/Elixir_Troops',
        base: 'https://clashofclans.fandom.com'
    }
]

const app = express()

const troops = []

// loop through pages if more pages are added
pages.forEach(pages => {
    axios.get(pages.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            // get the troop title and url
            $('td>a', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                // const url = $(this).attr('href/title')                 
                troops.push({
                    title,
                    url: pages.base + url,
                    source: pages.name
                })
            })
        })
})

app.get('/', (res) => {
    res.json("welcom to the coc api")
})

app.get('/troops', (req, res) => {
    res.json(troops)
})

app.get('/troops/:troopId', (req, res) => {
    const troopId = req.params.troopId

    const pageAdress = pages.filter(page => page.name === troopId)[0].address
    const pageBase = pages.filter(page => page.name == troopId)[0].base

    axios.get(pageAdress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specTroops = []

            $('td>a', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specTroops.push({
                    title,
                    url: pageBase + url,
                    source: troopId
                })
            })
            res.json(specTroops)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))