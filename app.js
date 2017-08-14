var restify = require('restify');
var builder = require('botbuilder');
var request = require("request")

// Setup Restify Server
//LEdaFjQaXAeP7xfXyGXLQ71
//ab2418c4-c895-4534-9802-e6c24af8fe4b
var server = restify.createServer();

// var questions = [
//     { field: 'name', prompt: "What's your name?" },
//     { field: 'age', prompt: "How old are you?" },
//     { field: 'state', prompt: "What state are you in?" }
// ];

var topics


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


  // function (session) {
  //   session.send("Sorry i don't understand.")
  // }
  // function (session) {
  //   session.userData.name = session.message.user.name;
  //   session.send("Welcome to wdi conf voting system!")
  //   builder.Prompts.choice(session, "What is your first choice?", topics);
  // }
  // ,
  // function (session, results) {
  //   session.userData.first = results.response.entity;
  //   builder.Prompts.choice(session, "What is your second choice?", topics);
  // },
  // function (session, results) {
  //   session.userData.second = results.response.entity;
  //   session.send("Got it... " + session.userData.name + " chose " + session.userData.first + " and " + session.userData.second);
  // }
]);

function sendProactiveMessage(address) {
  var msg = new builder.Message().address(address);
  msg.text('Hello, this is a notification');
  msg.textLocale('en-US');
  bot.send(msg);
}

bot.recognizer({
  recognize: function (context, done) {
    var intent = { score: 0.0 };

    if (context.message.text) {
      if (
        context.message.text.toLowerCase().split(" ").includes("hi") ||
        context.message.text.toLowerCase().split(" ").includes("hello") ||
        context.message.text.toLowerCase().split(" ").includes("hey")
      ) {
        intent = { score: 1.0, intent: 'Hello' };
      }
      if (
        context.message.text.toLowerCase().split(" ").includes('votes') ||
        context.message.text.toLowerCase().split(" ").includes('vote')
      ) {
        intent = { score: 1.0, intent: 'Vote' };
      }
      if (
        context.message.text.toLowerCase().split(" ").includes('goodbye') ||
        context.message.text.toLowerCase().split(" ").includes('bye')
      ) {
        intent = { score: 1.0, intent: 'Goodbye' };
      }
      if (
        context.message.text.toLowerCase().split(" ").includes('warmup') ||
        context.message.text.toLowerCase().split(" ").includes('warmups')
      ) {
        intent = { score: 1.0, intent: "Warmup"}
      }
    }
    done(null, intent);
  }
});

// Add a help dialog with a trigger action that is bound to the 'Help' intent
bot.dialog('voteDialog', function (session) {
  session.endDialog("Voting is expire, visit https://secure-everglades-33652.herokuapp.com/api/votes/all to seed the tally");
}).triggerAction({ matches: 'Vote' });


bot.dialog('warmupDialog', function (session) {
  session.endDialog("Warmup detected!");
}).triggerAction({ matches: 'Warmup' });


// Add a global endConversation() action that is bound to the 'Goodbye' intent
bot.endConversationAction('goodbyeAction', "Ok... See you later.", { matches: 'Goodbye' });


bot.dialog('helloDialog', [
  function (session) {
    request({
      uri: "https://secure-everglades-33652.herokuapp.com/api/users/u",
      qs: {
        username: session.message.user.name
        // username: "dannyli0109"
      }
    }, function(error, res, body) {
      var user = JSON.parse(body)
      console.log(user);
      if (user != null) {
        session.userData.name = user.name
        session.userData.id = user.id

        request({
          uri: "https://secure-everglades-33652.herokuapp.com/api/talks/all"
        }, function(error, res, body) {
          topics = JSON.parse(body).map(function(talk) {
            return talk.title
          })
          session.send("Hello, " + session.userData.name + ", i'm a quiet bot");
          session.endDialog()
          // builder.Prompts.choice(session, "What is your first choice?", topics);
        })
      } else {
        session.send("Sorry you are not registered in our system.")
        session.send("Bye")
        session.endDialog()
      }
    })
    // },
    // function (session, results) {
    //   session.userData.first = results.response.entity
    //   session.userData.firstIndex = results.response.index
    //   builder.Prompts.choice(session, "What is your second choice?", topics);
    // },
    // function (session, results) {
    //   session.userData.second = results.response.entity
    //   session.userData.secondIndex = results.response.index
    //
    //
    //
    //   // Configure the request
    //   var url = 'https://secure-everglades-33652.herokuapp.com/users/' + session.userData.id + "/votes"
    //
    //   // Start the request
    //   request({
    //     uri: url,
    //     qs: {
    //       first: session.userData.first,
    //       second: session.userData.second
    //     }
    //   }, function (error, response, body) {
    //     // Print out the response body
    //     var message = JSON.parse(body).message;
    //     session.send(message);
    //     session.endDialog()
    //   })
    //
  }
]).triggerAction({ matches: 'Hello' });
