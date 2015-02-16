// Setup Mosca MQTT broker listening on the standard port 1833 for
// normal clients and 9001 for websockets clients.

var ascoltatore = {
	//using ascoltatore
	type: 'mongo',
	url: 'mongodb://localhost:3001/mqtt',
	pubsubCollection: 'ascoltatori',
	mongo: {}
};

var moscaSettings = {
	port: 1883,
	backend: ascoltatore,
	persistence: {
		factory: mosca.persistence.Mongo,
		url: 'mongodb://localhost:3001/mqtt'
	},
	http: {
		port: 9001,
		bundle: true,
		static: './'
	}
};


var server = new mosca.Server(moscaSettings);
server.on('ready', setup);

// fired when the mqtt server is ready 

function setup() {
	console.log('Mosca server is up and running');
}

server.on('clientConnected', function(client) {
	console.log('client connected', client.id);
});

// fired when a message is received
//NOTE: This is not a subscribe, (see below), it shows *everything* published, including system message.
// server.on('published', function(packet, client) {
//   console.log('Published', packet.topic, packet.payload);
// });
//


//Connect to my the broker defined above.
mqttClient = mqtt.connect('mqtt://localhost:1883', {
	clientId: "fromServer"
});
mqttClient.on("connect", function(param) {
	console.log("Connected", param);

	mqttClient.on("message", function(param, p2) {
		console.log("Server message", param, p2);
	})

	mqttClient.on("error", function(param) {
		console.log("Wahhhh");
	})

	mqttClient.publish("pubtest", "hello world", function() {
		console.log("Sent Sir!");
	});
});




Meteor.startup(function() {
	console.log("Starting");


})
