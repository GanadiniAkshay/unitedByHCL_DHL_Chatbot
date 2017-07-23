var restify = require('restify')
var builder = require('botbuilder')

//=================================================
// Import external modules
//=================================================
var misc     = require('./smalltalk/misc.js');
var quotes   = require('./quote/getquote.js');

//Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log("%s listening to %s", server.name, server.url);
});

//Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId:'4c64e1db-f20a-4210-a5b4-060968090dd3',
    appPassword:'zgR9gaMeLGJkNhoajkoEN45'
});

// Create bot
// Listen for messages from users
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

var recognizer = new apiairecognizer('ea5a2c0743924810bb21cc1e2f79a542');
var intents = new builder.IntentDialog({
	recognizers: [recognizer]
});

bot.dialog('/', intents);


// Recieve Messages from the user and respond by handling the intent
intents.matches('smalltalk.greetings', misc.smalltalk);
