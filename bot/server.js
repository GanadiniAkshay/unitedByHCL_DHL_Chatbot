var restify = require('restify')
var builder = require('botbuilder')

//=================================================
// Import external modules
//=================================================
var misc     = require('./smalltalk/misc.js');
var quotes   = require('./quote/getquote.js');
var location = require('./locations/getlocations.js')
var pickup   = require('./pickup/pickup.js');

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

intents.matches('getQuote',[
    function(session){
        builder.Prompts.text(session,"What items do you want to send? (comma seperated if multiple)");
    },
    function(session,results){
        items = results.entity;
        session.userData.items = items;
        builder.Prompts.choice(session,"Where do you want to send the package?","UK|Europe-Non EU| Europe-EU| USA, Canada & Mexico| Rest of World");
    },
    function(session, results){
        location = results.entity;
        session.userData.location = location;
        totalPrice = quotes.getPrice(location,session.userData.items);
        session.endDialog("That would cost you " + totalPrice);
    }
]);

intents.matches('findLocations',[
    function(session){
        builder.Prompts.text(session,"Enter your zipcode");
    },
    function(session, results){
        zip = results.entity;
        location = locations.findLocations(zip);
        session.endDialog("Here is the nearest DHL location: " + location);
    }
]);

intents.matches('pickup',[
    function(session){
        builder.Prompts.choice(session,"Where do you want the package to be picked up from","office|home");
    },
    function(session,results){
        loc = results.entity;
        session.userData.loc = loc;
        builder.Prompts.time(session,"When do you want it to be picked up");
    },
    function(session, results){
        time = results.entity;
        session.userData.time = time;
        pickup.schedule(session.userData.loc,session.userData.time);
        session.endDialog("Your pickup has been scheduled");
    }
])
