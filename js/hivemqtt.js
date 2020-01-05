
    let isFireAlarmActive = false;
    let isBurglarAlarmActive = false;
    let isWindowALarmActive = false;

// Called after form input is processed
function startLogin() {

    // Generate a random client ID
    clientID = "clientID-" + parseInt(Math.random() * 100);

    host = "127.0.0.1";
    port = "8000";

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

//Heater 1 settings
    var range1 = document.getElementById("sliderHeater1");
    var output = document.getElementById("goal_temperature_heater1");
    output.innerHTML = '<span> ' + range1.value + ' °C</span><br/>';
    range1.oninput = function(){

      document.getElementById("goal_temperature_heater1").innerHTML = '<span> ' + range1.value + ' °C</span><br/>';
    }

//Heater 2 settings
    var range2 = document.getElementById("sliderHeater2");
    var output = document.getElementById("goal_temperature_heater2");
    output.innerHTML = '<span> ' + range2.value + ' °C</span><br/>';
    range2.oninput = function(){

      document.getElementById("goal_temperature_heater2").innerHTML = '<span> ' + range2.value + ' °C</span><br/>';
    }


}


// Called when the client logs in
function onLogIn() {
    // Fetch the MQTT topic from the form
    //topic = document.getElementById("topic").value;
    console.log("redirecting........");


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
    client.subscribe("smarthouse/indoor_temperature/value");
    client.subscribe("smarthouse/outdoor_temperature/value");
    client.subscribe("smarthouse/indoor_light/state");
    client.subscribe("smarthouse/outdoor_light/state");
    client.subscribe("smarthouse/outdoor_light/trigger");
    client.subscribe("smarthouse/fire_alarm/state");
    client.subscribe("smarthouse/fire_alarm/trigger");
    client.subscribe("smarthouse/burglar_alarm/state");
    client.subscribe("smarthouse/burglar_alarm/trigger");
    client.subscribe("smarthouse/heater_1/state");
    client.subscribe("smarthouse/heater_1/value");
    client.subscribe("smarthouse/heater_2/state");
    client.subscribe("smarthouse/heater_2/value");
    client.subscribe("smarthouse/fan/speed");
    client.subscribe("smarthouse/voltage/value");
    client.subscribe("smarthouse/power/state")
    client.subscribe("smarthouse/water_leak/trigger")
    client.subscribe("smarthouse/oven/state")
    client.subscribe("smarthouse/window_alarm/state");
    client.subscribe("smarthouse/window_alarm/trigger");

}

// Called when the client loses its connection
function onConnectionLost(responseObject) {
    console.log("connection lost")
}

// Called when a message arrives
function onMessageArrived(message) {

    console.log("onMessageArrived: " + message.payloadString);

    console.log("from topic " + message.destinationName);

    if (message.destinationName === "smarthouse/indoor_light/state") {
        if (message.payloadString === "on") {
            document.getElementById("indoor_light_checkbox").checked = true
            document.getElementById("in_light_img").src = "images/light-on.svg"
            document.getElementById("indoor_light_card").style.boxShadow = "10px 12px 10px rgba(153,255,0,0.6)";
        } else {
            document.getElementById("indoor_light_checkbox").checked = false
            document.getElementById("in_light_img").src = "images/light-off.svg"
            document.getElementById("indoor_light_card").style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)";
        }

    }

    if (message.destinationName === "smarthouse/outdoor_light/trigger") {
        if (message.payloadString === "true") {
          document.getElementById("out_light_img").src = "images/exposure.svg"
            document.getElementById("outdoor_light_card").style.boxShadow = "10px 12px 10px rgba(153,255,0,0.6)";
        } else {
          document.getElementById("out_light_img").src = "images/no-exposure.svg"
            document.getElementById("outdoor_light_card").style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)";
        }

    }

    if (message.destinationName === "smarthouse/outdoor_light/state") {
        if (message.payloadString === "on") {
            document.getElementById("outdoor_light_sensor_checkbox").checked = true
        } else {
            document.getElementById("outdoor_light_sensor_checkbox").checked = false
            document.getElementById("outdoor_light_card").style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)";
        }

    }

    if (message.destinationName === "smarthouse/indoor_temperature/value") {
        document.getElementById("indoor_temperature_str").innerHTML = '<span>' + message.payloadString + ' °C</span><br/>';

    }

    if (message.destinationName === "smarthouse/outdoor_temperature/value") {
        document.getElementById("outdoor_temperature_str").innerHTML = '<span>' + message.payloadString + ' °C</span><br/>';

    }

    if (message.destinationName === "smarthouse/voltage/value") {
        document.getElementById("voltage_str").innerHTML = '<span>' + message.payloadString + ' V</span><br/>';

    }

    if (message.destinationName === "smarthouse/power/state") {
        if (message.payloadString === "on") {
            document.getElementById("power_img").src = "images/power-on.svg"
            document.getElementById("power_card").style.boxShadow = "10px 12px 10px rgba(153,255,0,0.6)";
        } else {
            document.getElementById("power_img").src = "images/power-off.svg"
            document.getElementById("power_card").style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)"
        }

    }

    if (message.destinationName === "smarthouse/water_leak/trigger") {
        if (message.payloadString === "true") {
            document.getElementById("water_leak_img").src = "images/leak.svg"
            document.getElementById("water_leak_card").style.boxShadow = "10px 12px 10px rgba(255,51,0,0.6)";
        } else {
            document.getElementById("water_leak_img").src = "images/no-leak.svg"
            document.getElementById("water_leak_card").style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)"
        }

    }

    if (message.destinationName === "smarthouse/window_alarm/state") {
        if (message.payloadString === "on") {
            document.getElementById("window_alarm_checkbox").checked = true;
            isWindowALarmActive =true;

        } else {
          document.getElementById("window_alarm_checkbox").checked = false;
          isWindowALarmActive=false;

        }

    }
    if(isWindowALarmActive){
    if (message.destinationName === "smarthouse/window_alarm/trigger") {
        if (message.payloadString === "true") {

            document.getElementById("window_img").src = "images/window-open.svg"
            document.getElementById("window_card").style.boxShadow = "10px 12px 10px rgba(255,51,0,0.6)";
        } else {

            document.getElementById("window_img").src = "images/window-closed.svg"
            document.getElementById("window_card").style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)"
        }

    }
  }

    if (message.destinationName === "smarthouse/oven/state") {
        if (message.payloadString === "on") {
            document.getElementById("oven_img").src = "images/oven-on.svg"
            document.getElementById("oven_card").style.boxShadow = "10px 12px 10px rgba(255,51,0,0.6)";
        } else {
            document.getElementById("oven_img").src = "images/oven-off.svg"
            document.getElementById("oven_card").style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)"
        }

    }

    if (message.destinationName === "smarthouse/fire_alarm/state") {
        if (message.payloadString === "on") {
            document.getElementById("fire_alarm_checkbox").checked = true;
            isFireAlarmActive = true;
        } else {
            document.getElementById("fire_alarm_checkbox").checked = false;
            isFireAlarmActive = false;
            document.getElementById("fire_alarm_card").style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)";
        }

    }

if(isFireAlarmActive){
    if (message.destinationName === "smarthouse/fire_alarm/trigger") {
        if (message.payloadString === "true") {
            document.getElementById("fire_img").src = "images/fire.svg"
            document.getElementById("fire_alarm_card").style.boxShadow = "10px 12px 10px rgba(255,51,0,0.6)";
        } else {
            document.getElementById("fire_img").src = "images/no-fire.svg"
            document.getElementById("fire_alarm_card").style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)";
        }

    }
}

    if (message.destinationName === "smarthouse/burglar_alarm/state") {
        if (message.payloadString === "on") {
            document.getElementById("burglar_alarm_checkbox").checked = true;
            isBurglarAlarmActive = true;
        } else {
            isBurglarAlarmActive= false;
            document.getElementById("burglar_alarm_checkbox").checked = false;
            document.getElementById("burglar_alarm_card").style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)";
        }

    }

if(isBurglarAlarmActive){
    if (message.destinationName === "smarthouse/burglar_alarm/trigger") {
        if (message.payloadString === "true") {
              document.getElementById("burglar_img").src = "images/siren-on.svg"
              document.getElementById("burglar_alarm_card").style.boxShadow = "10px 12px 10px rgba(255,51,0,0.6)";
        } else {
          document.getElementById("burglar_img").src = "images/siren-off.svg"
            document.getElementById("burglar_alarm_card").style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)";
        }

    }
}
    if (message.destinationName === "smarthouse/heater_1/state") {
        if (message.payloadString === "on") {
            document.getElementById("heater1_checkbox").checked = true
        } else {
            document.getElementById("heater1_checkbox").checked = false
        }

    }

    if (message.destinationName === "smarthouse/heater_1/value") {


        if (isNaN(message.payloadString)===false) {
            document.getElementById("sliderHeater1").value = message.payloadString
            document.getElementById("goal_temperature_heater1").innerHTML = '<span> ' + document.getElementById("sliderHeater1").value + ' °C</span><br/>';
        }
    }

    if (message.destinationName === "smarthouse/heater_2/state") {
        if (message.payloadString === "on") {
            document.getElementById("heater2_checkbox").checked = true
        } else {
            document.getElementById("heater2_checkbox").checked = false
        }

    }

    if (message.destinationName === "smarthouse/heater_2/value") {


        if (isNaN(message.payloadString)===false) {
            document.getElementById("sliderHeater2").value = message.payloadString
            document.getElementById("goal_temperature_heater2").innerHTML = '<span> ' + document.getElementById("sliderHeater2").value + ' °C</span><br/>';
        }

    }

    if (message.destinationName === "smarthouse/fan/speed") {


        if (isNaN(message.payloadString)===false) {
            document.getElementById("sliderFan").value = message.payloadString
            document.getElementById("fan_speed_str").innerHTML = '<span> ' + document.getElementById("sliderFan").value + '</span><br/>';
        }

    }

}

// Called when the disconnection button is pressed
    function startDisconnect() {
        client.disconnect();
    }

    function checkIndoorLightState() {

        if (document.getElementById("indoor_light_checkbox").checked === true) {
            client.send("smarthouse/indoor_light/state", "on", 0, true);
        } else {
            client.send("smarthouse/indoor_light/state", "off", 0, true);
        }
    }

    function checkOutdoorLightSensorState() {

        if (document.getElementById("outdoor_light_sensor_checkbox").checked === true) {
            client.send("smarthouse/outdoor_light/state", "on", 0, true);
        } else {
            client.send("smarthouse/outdoor_light/state", "off", 0, true);
        }
    }

    function checkFireAlarmState() {

        if (document.getElementById("fire_alarm_checkbox").checked === true) {
            client.send("smarthouse/fire_alarm/state", "on", 0, true);
            isFireAlarmActive = true;
        } else {
            client.send("smarthouse/fire_alarm/state", "off", 0, true);
            isFireAlarmActive = false;
        }
    }

    function checkWindowAlarmState() {

        if (document.getElementById("window_alarm_checkbox").checked === true) {
            client.send("smarthouse/window_alarm/state", "on", 0, true);
            isWindowALarmActive=true;
        } else {
            client.send("smarthouse/window_alarm/state", "off", 0, true);
            isWindowALarmActive=false;
        }
    }


    function checkBurglarAlarmState() {

        if (document.getElementById("burglar_alarm_checkbox").checked === true) {
            client.send("smarthouse/burglar_alarm/state", "on", 0, true);
            isBurglarAlarmActive = true;

        } else {
            client.send("smarthouse/burglar_alarm/state", "off", 0, true);
            isBurglarAlarmActive =false;

        }
    }


    function checkHeater1State() {

        if (document.getElementById("heater1_checkbox").checked === true) {
            client.send("smarthouse/heater_1/state", "on", 0, true);
        } else {
            client.send("smarthouse/heater_1/state", "off", 0, true);
        }
    }

    function setHeater1Temperature() {
      var temp = document.getElementById("sliderHeater1").value

            client.send("smarthouse/heater_1/value", temp, 0, true);

    }

    function checkHeater2State() {

        if (document.getElementById("heater2_checkbox").checked === true) {
            client.send("smarthouse/heater_2/state", "on", 0, true);
        } else {
            client.send("smarthouse/heater_2/state", "off", 0, true);
        }
    }

    function setHeater2Temperature() {
      var temp = document.getElementById("sliderHeater2").value

            client.send("smarthouse/heater_2/value", temp, 0, true);

    }

    function setFanSpeed() {

      var temp = document.getElementById("sliderFan").value

      client.send("smarthouse/fan/speed", temp, 0, true);


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
