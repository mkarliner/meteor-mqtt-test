console.log("Starting")

// Connect to MQTT via websockets.
// NOTE: This assumes you are running your browser on the same machine as the server!!!
client = mqtt.connect("ws://localhost:9001", {
	clientId: "fromBrowser"
});

client.on("connect", function() {
	console.log("Connected")
});

client.subscribe("test/topic");

client.publish("test/topic", "bunch of stuff");

topicmap = [
	{topic: "user/+id/online", 				action: "upsertTopic", 	collection: "onlineUsers" },
	{topic: "user/+id/offline",				action: "deleteTopic", 	collection: "onlineUsers"},
	{topic: "myHouse/livingRoom/temperature", 	action: "log", 		collection:	"livingRoomTemperatureLog"},
	{topic: "doorBell",						action: "setSession", 	session: 	"doorbell"},
	{topic: "toaster",						action: "call",			function: 	"myFunction"},
	{topic: "#",							action: "call",			function: 	"unexpectedTopicFunction"}
];

mqttRouter = {
	route: function(){}
	
} //Dummy

client.on("message", function(topic, payload) {
	console.log(topic, payload.toString());
	mqttRouter.route(topicmap);
});

// counter starts at 0
Session.setDefault('counter', 0);

Template.hello.helpers({
	counter: function() {
		console.log("Help!")
		return Session.get('counter');
	},
	messages: function() {
		//return MQTT.messages.find({topic: 'test/topic'});
	}
});



Template.hello.events({
	'click #subscribe': function() {
		console.log("Subscribing");
		MQTT.subscribe("test/topic");
	},
	'click #click': function() {
		// increment the counter when button is clicked
		Session.set('counter', Session.get('counter') + 1);
	}
});
