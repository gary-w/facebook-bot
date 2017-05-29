'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const db = require('../database/index.js')
const pgp = require('pg-promise')();
const app = express()


// Set port number to 3000
app.set('port', (process.env.PORT || 3000))

// Body parser for url encoded and application json
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json())

// Index route
app.get('/', (req, res) => {
  res.send('Heya, I\'m your new chat bot!')
})

// Facebook verification
app.get('/webhook/', (req, res) => {
  if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong token')
})

// Post data to Facebook
app.post('/webhook/', (req, res) => {
  let itemNumber = 4;
  let item = 'Complete chatbot'

  let messaging_events = req.body.entry[0].messaging
  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i]
    let sender = event.sender.id
    if (event.message && event.message.text) {
      let text = event.message.text
      
      // User asks for active to-do list
      if (text === 'LIST'){ 
        activeToDo(sender)
        continue
      // User marks a certain to-do list item as DONE
      } else if (text === `${itemNumber} DONE`) {
        markAsDone(sender, itemNumber)
        continue
      // User adds an item to the to-do list
      } else if (text === `ADD ${item}`) {
        addItem(sender, item)
        continue
      // User marks the whole list as DONE
      } else if (text === 'LIST DONE') {
        markAllDone(sender)
        continue
      }

      sendTextMessage(sender, text.substring(0, 200))
    }
    if (event.postback) {
      let text = JSON.stringify(event.postback)
      sendTextMessage(sender, text.substring(0, 200), token)
      continue
    }
  }
  res.sendStatus(200)
})

const token = process.env.FB_PAGE_TOKEN

// Function to send messages
function sendTextMessage(sender, text) {
  let messageData = { text:text }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
  json: {
      recipient: {id:sender},
    message: messageData,
  }
}, function(error, response, body) {
  if (error) {
      console.log('Error sending messages: ', error)
  } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

function activeToDo(sender) {
  // let list = db.query('SELECT * FROM todo WHERE status = FALSE')



  sendTextMessage(sender, sender)
}

function markAsDone(sender, itemNumber) {
  sendTextMessage(sender, `${itemNumber} done!`)
  // return db.one(
  //   'UPDATE todo SET order_status = $1\
  //    WHERE order_id = $2\
  //    RETURNING vendor_id\
  //   ', [int, order_id]);
}

function addItem(sender, item) {
  sendTextMessage(sender, `${item} added!`)
  // return db.query('INSERT INTO todo VALUES item')
}

function markAllDone(sender) {
  sendTextMessage(sender, 'All done!')
  return db.query('UPDATE todo SET status = TRUE')
}

// Start server
app.listen(app.get('port'), () => {
  console.log('running on port', app.get('port'))
})