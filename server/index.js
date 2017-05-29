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
      // User adds an item to the to-do list
      } else if (text === `ADD ${item}`) {
        addItem(sender, item)
      // User marks the whole list as DONE
      } else if (text === 'LIST DONE') {
        markAllDone(sender)
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
  let messageData = { text:text + 'this is great' }
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
  sendTextMessage(sender, 'Here is the list!')
  console.log('Here is the list!')
}

function markAsDone(sender, itemNumber) {
  console.log('One item done!')
}

function addItem(sender, item) {
  console.log('Add item!')
}

function markAllDone(sender) {
  console.log('All done!')
}

// // Send structure message as cards or buttons
// function sendGenericMessage(sender) {
//     let messageData = {
//       "attachment": {
//         "type": "template",
//         "payload": {
//         "template_type": "generic",
//           "elements": [{
//           "title": "First card",
//             "subtitle": "Element #1 of an hscroll",
//             "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
//             "buttons": [{
//               "type": "web_url",
//               "url": "https://www.messenger.com",
//               "title": "web url"
//             }, {
//               "type": "postback",
//               "title": "Postback",
//               "payload": "Payload for first element in a generic bubble",
//             }],
//           }, {
//             "title": "Second card",
//             "subtitle": "Element #2 of an hscroll",
//             "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
//             "buttons": [{
//               "type": "postback",
//               "title": "Postback",
//               "payload": "Payload for second element in a generic bubble",
//             }],
//           }]
//         }
//       }
//     }
//     request({
//       url: 'https://graph.facebook.com/v2.6/me/messages',
//       qs: {access_token:token},
//       method: 'POST',
//       json: {
//         recipient: {id:sender},
//         message: messageData,
//       }
//     }, function(error, response, body) {
//       if (error) {
//         console.log('Error sending messages: ', error)
//       } else if (response.body.error) {
//         console.log('Error: ', response.body.error)
//       }
//     })
// }

// Start server
app.listen(app.get('port'), () => {
  console.log('running on port', app.get('port'))
})