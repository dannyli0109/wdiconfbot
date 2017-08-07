var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
//LEdaFjQaXAeP7xfXyGXLQ71
//ab2418c4-c895-4534-9802-e6c24af8fe4b
var server = restify.createServer();
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
    session.send("user: " + session.message.user.name)
  //   for (var a in session) {
  //   session.send(a + ": " + session[a])
  // }
    // session.send("Welcome to wdi conf")
    // builder.Prompts.text(session, "What is your name?");
  }

  // session.send("hi said: %s", session.message.text);
]);
