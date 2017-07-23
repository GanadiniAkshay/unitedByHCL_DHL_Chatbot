var restify = require('restify')
var builder = require('botbuilder')

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

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Recieve Messages from the user and respond by echoing each message back 
var bot = new builder.UniversalBot(connector, [
    function(session){
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/gif",
                contentUrl: "https://media.giphy.com/media/l41lTR6jmXXxHDgxG/giphy.gif"
            }]);
        session.endDialog(msg);
    }
]);