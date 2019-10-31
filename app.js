/************
 * Require/Globals
************/

require('dotenv').config()
const inquirer = require('inquirer')
const moment = require('moment')
const Spotify = require('node-spotify-api')
const axios = require('axios')

const keys = require('./keys.js')

const spotify = new Spotify(keys.spotify)


/************
 * Functions
************/


const restart = () => {
  inquirer.prompt({
    type: 'confirm',
    message: 'Search again?',
    name: 'restart'
  })
  .then(({restart}) => {
    if (restart) {
      liri()
    } else {
      console.log('Goodbye! Have a great day!')
    }
  })
}


const liri = () => {
  inquirer.prompt(
    {
      type: 'list',
      name: 'command',
      message: 'What can liri help you with today?',
      choices: ['Concets for artist/band', 'Spotify song', 'Movie info', 'Random']
    }
  )
  .then(({command}) => {
    switch(command) {
      case 'Concets for artist/band':
        inquirer.prompt(
          {
            type: 'input',
            name: 'artist',
            message: 'What artist/band should I search for?'
          }
        )
        .then(({artist}) => {
          axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`)
          .then(({data}) => {
            let resp = data.slice(0,3)
            if (typeof resp.forEach === 'undefined') {
              console.log('Could not find a response')
              restart()
              //return false
            }
            resp.forEach(e => {
              console.log(
    `
    ~~~~~~~~~~~~~~~~~~~~
    Venue: ${e.venue.name}
    Location: ${e.venue.city} ${e.venue.region === '' ? e.venue.country : e.venue.region + ', ' + e.venue.country}
    Date: ${moment(e.datetime, 'YYYY-MM-DDTHH:mm:ss').format('MM/DD/YYYY')}
    ~~~~~~~~~~~~~~~~~~~~`)
            })
            restart()
          })
          .catch(err => {
            if (err.response.status === 404) {
              console.log('Artist not found')
              restart()
            } else {
              console.log(err)
            }
          })
        })
        .catch(err => console.log(err))
        break;
      deafult:
        console.log('How\'d you get here?')
        break;
    }
  })
  .catch(err => console.log(err))
}



liri()

