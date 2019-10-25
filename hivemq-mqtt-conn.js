//https://www.hivemq.com/blog/mqtt-client-library-encyclopedia-paho-js/

function startConnect() {
// Create a client instance
    client = new Paho.MQTT.Client("test.mosquitto.org", 8080,"/",  "some-client");

// set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

// connect the client
    client.connect({
        onSuccess: onConnect
        //onFailure: document.getElementById("messages").innerHTML += '<span>ERROR: Connection to: ' + host + ' on port: ' + port + ' failed.</span><br/>'
    });

}
// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe("#");
    message = new Paho.MQTT.Message("Hello");
    message.destinationName = "#";
    client.send(message);
    console.log(client.getTraceLog());
    //console.log(client.onMessageArrived());

}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
}

// called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived:"+message.payloadString);
}