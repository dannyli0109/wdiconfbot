var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
//LEdaFjQaXAeP7xfXyGXLQ71
//ab2418c4-c895-4534-9802-e6c24af8fe4b
var server = restify.createServer();

// var questions = [
//     { field: 'name', prompt: "What's your name?" },
//     { field: 'age', prompt: "How old are you?" },
//     { field: 'state', prompt: "What state are you in?" }
// ];

var topics = [
  "Fintech for all",
  "The Rise of Citizen Development",
  "The Box Model or How I Learned to Love Again",
  "Breaking from Loops - Functional Programming in JS",
  "Twitch streamers & the new age of eSports",
  "Exploring Continuous Integration with Travis.",
  "Create pixelated version of an image using p5.js",
  "Data Structure- Linked List",
  "Promises in JavaScript",
  "Machine Does A Learn",
  "5 ways video games could be used to improve our lives"
]


server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
  appId: "ab2418c4-c895-4534-9802-e6c24af8fe4b",
  appPassword: "LEdaFjQaXAeP7xfXyGXLQ71"
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, [

  function (session) {
    session.userData.name = session.message.user.name;
    session.send("Welcome to wdi conf voting system!")
    builder.Prompts.choice(session, "What is your first choice?", topics);
  },
  function (session, results) {
    session.userData.first = results.response.entity;
    builder.Prompts.choice(session, "What is your second choice?", topics);
  },
  function (session, results) {
    session.userData.second = results.response.entity;
    session.send("Got it... " + session.userData.name + " chooses " + session.userData.first + " and " + session.userData.second);
  }
]);
