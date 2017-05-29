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
  console.log(db);
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
  let messaging_events = req.body.entry[0].messaging
  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i]
    let sender = event.sender.id
    if (event.message && event.message.text) {
      let text = event.message.text
      if (text === 'Generic'){ 
        console.log("welcome to chatbot")
        sendGenericMessage(sender)
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

// Function to echo back messages
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

// Send structure message as cards or buttons
function sendGenericMessage(sender) {
    let messageData = {
      "attachment": {
        "type": "template",
        "payload": {
        "template_type": "generic",
          "elements": [{
          "title": "First card",
            "subtitle": "Element #1 of an hscroll",
            "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
            "buttons": [{
              "type": "web_url",
              "url": "https://www.messenger.com",
              "title": "web url"
            }, {
              "type": "postback",
              "title": "Postback",
              "payload": "Payload for first element in a generic bubble",
            }],
          }, {
            "title": "Second card",
            "subtitle": "Element #2 of an hscroll",
            "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
            "buttons": [{
              "type": "postback",
              "title": "Postback",
              "payload": "Payload for second element in a generic bubble",
            }],
          }]
        }
      }
    }
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

// Start server
app.listen(app.get('port'), () => {
  console.log('running on port', app.get('port'))
})