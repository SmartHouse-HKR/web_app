// Called after form input is processed
function startLogin() {
    // Generate a random client ID
    clientID = "clientID-" + parseInt(Math.random() * 100);

    host = document.getElementById("host").value;
    port = document.getElementById("port").value;

    console.log(host)

    localStorage["host"] = host;
    localStorage["port"] = port;
    localStorage["clientID"] = clientID;

    // Initialize new Paho client connection
    client = new Paho.MQTT.Client(host, Number(port), "/mqtt",clientID);

    console.log(client.clientId);

    // Set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;



    // Connect the client, if successful, call onConnect function
    client.connect({
        onSuccess: onLogIn,
        //userName : document.getElementById("username").value,
        //password : document.getElementById("password").value
    });
}

// called when switch to dashboard is made
function onLoadDashboard() {
    savedHost = localStorage["host"];
    savedPort = localStorage["port"];
    savedClientId = localStorage["clientID"];

    console.log(savedHost);

    client = new Paho.MQTT.Client(savedHost, Number(savedPort), "/mqtt", savedClientId);

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // Connect the client, if successful, call onConnect function
    client.connect({
        onSuccess: onConnect,
        //userName : document.getElementById("username").value,
        //password : document.getElementById("password").value
    });
    console.log("logged in client is" + client.clientId);
    document.getElementById("client").innerHTML += '<span>Logged in as: ' + client.clientId + '</span><br/>';


}

// Called when the client logs in
function onLogIn() {
    // Fetch the MQTT topic from the form
    //topic = document.getElementById("topic").value;
    console.log("redirecting");


    // Subscribe to the requested topic
    //client.subscribe("#");
    //console.log("subscribed to all")

    document.location.href = 'dashboard.html';


}

// Called when the client connects
function onConnect() {
    console.log("Connected");

    // Subscribe to the requested topic
    //client.subscribe("#");
    //console.log("subscribed to all")
    //client.send("/test/delay/state", "is awesome", 0, true);
    // document.location.href = 'dashboard.html';
    client.subscribe("/smarthouse/temp/state");

}

// Called when the client loses its connection
function onConnectionLost(responseObject) {
    console.log("connection lost")
}

// Called when a message arrives
function onMessageArrived(message) {

    console.log("onMessageArrived: " + message.payloadString);

    console.log("from topic " + message.destinationName);

    string1 = message.destinationName;
    string2 = "/smarthouse/temp/state";
    if(string1 === string2) {
        document.getElementById("temperature_str").innerHTML = '<span>' + message.payloadString + '</span><br/>';

    }

}

// Called when the disconnection button is pressed
function startDisconnect() {
    client.disconnect();
}

function checkLightState(){
    if (document.getElementById("light_checkbox").checked === true){
        client.send("/smarthouse/light/state", "TRUE", 0, true);
    }else{
        client.send("/smarthouse/light/state", "FALSE", 0, true);
    }
}

function checkFanState(){
    if (document.getElementById("fan_checkbox").checked === true){
        client.send("/smarthouse/fan/state", "ON", 0, true);
    }else{
        client.send("/smarthouse/fan/state", "OFF", 0, true);
    }
}

// Set the width of the side navigation to 250px and the left margin of the page content to 250px
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

// Set the width of the side navigation to 0 and the left margin of the page content to 0
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}