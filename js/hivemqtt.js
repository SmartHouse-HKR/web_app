
    let isFireAlarmActive = false;
    let isBurglarAlarmActive = false;
    let isWindowALarmActive = false;
    let isOutdoorSensorActive = false;
    let isBTfanOn= 0;
    let timerPressed = false ;
    let btFanTimerEndTime ;
    let isMicrowaveInUse = false;

// Called after form input is processed
function startLogin() {

    // Generate a random client ID
    clientID = "clientID-" + parseInt(Math.random() * 100);

    host = "broker.mqttdashboard.com";
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
    document.getElementById("client").innerHTML += '<span>Logged in as: ' + client.clientId + '</span>';

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

    document.getElementById("bt_fan_timer_str").innerHTML = '<span> 00:00:00</span>';
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
    client.subscribe("smarthouse/bt_light1/state");
    client.subscribe("smarthouse/bt_fan1/state");
    client.subscribe("smarthouse/bt_fan1/swing");
    client.subscribe("smarthouse/bt_fan1/timer");
    client.subscribe("smarthouse/bt_fan1/mode");
    client.subscribe("smarthouse/bt_lamp1/state");
    client.subscribe("smarthouse/microwave/preset_start");


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

    if (message.destinationName === "smarthouse/microwave/preset_start") {

        if (message.payloadString === "defrost") {

            document.getElementById("bt_defrost_img").src = "images/defrost-on.svg"
            document.getElementById("bt_microwave_card").style.boxShadow = "10px 12px 10px rgba(153,255,0,0.6)";
        } else if (message.payloadString === "chicken") {
            document.getElementById("bt_chicken_img").src = "images/chicken-on.svg"
            document.getElementById("bt_microwave_card").style.boxShadow = "10px 12px 10px rgba(153,255,0,0.6)";
        }else if (message.payloadString === "fish") {
            document.getElementById("bt_fish_img").src = "images/fish-on.svg"
            document.getElementById("bt_microwave_card").style.boxShadow = "10px 12px 10px rgba(153,255,0,0.6)";
        }else {
            document.getElementById("bt_defrost_img").src = "images/defrost.svg"
            document.getElementById("bt_chicken_img").src = "images/chicken.svg"
            document.getElementById("bt_fish_img").src = "images/fish.svg"
            document.getElementById("bt_microwave_card").style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)";  }

    }

    if (message.destinationName === "smarthouse/bt_lamp1/state") {
        if (message.payloadString === "on") {
            document.getElementById("bt_lamp_checkbox").checked = true
            document.getElementById("bt_lamp_img").src = "images/lamp-on.svg"
            document.getElementById("bt_lamp_card").style.boxShadow = "10px 12px 10px rgba(153,255,0,0.6)";
        } else {
            document.getElementById("bt_lamp_checkbox").checked = false
            document.getElementById("bt_lamp_img").src = "images/lamp-off.svg"
            document.getElementById("bt_lamp_card").style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)";
        }

    }

if(isOutdoorSensorActive){
    if (message.destinationName === "smarthouse/outdoor_light/trigger") {
        if (message.payloadString === "true") {
          document.getElementById("out_light_img").src = "images/exposure.svg"
            document.getElementById("outdoor_light_card").style.boxShadow = "10px 12px 10px rgba(153,255,0,0.6)";
        } else {
          document.getElementById("out_light_img").src = "images/no-exposure.svg"
            document.getElementById("outdoor_light_card").style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)";
        }

    }
  }

if (message.destinationName === "smarthouse/bt_fan1/mode") {
  if(isBTfanOn===1 ){
    document.getElementById("bt_fan_mode_img").src = "images/half-moon.svg";

    isBTfanOn=2
  }else if(isBTfanOn===2){
    document.getElementById("bt_fan_mode_img").src = "images/wind.svg";

    isBTfanOn=3
  }else if(isBTfanOn===3){
    document.getElementById("bt_fan_mode_img").src = "images/bt-fan-on-standard.svg"

    isBTfanOn=1
  }

}

  if (message.destinationName === "smarthouse/bt_fan1/state") {
    if (message.payloadString === "on") {
        document.getElementById("bt_fan_checkbox").checked = true;
        document.getElementById("bt_fan_mode_img").src="images/bt-fan-on-standard.svg";
        isBTfanOn=1;


    } else {


        isBTfanOn=0;
        btFanTimerEndTime=new Date() ;
        timerPressed=false;
        document.getElementById("bt_fan_checkbox").checked = false;
        document.getElementById("bt_fan_mode_img").src="images/bt-fan-off.svg";
        document.getElementById("bt_fan_swing_checkbox").checked = false;
        document.getElementById("bt_fan_swing_img").src="images/swing-off.svg";
        document.getElementById("bt_fan_timer_img").src="images/chronometer-off.svg";
    }


  }
  if (message.destinationName === "smarthouse/bt_fan1/swing") {
    if(isBTfanOn!==0){
      if (message.payloadString === "true") {
        document.getElementById("bt_fan_swing_checkbox").checked = true;
          document.getElementById("bt_fan_swing_img").src="images/swing-on.svg"


      } else {
        document.getElementById("bt_fan_swing_checkbox").checked = false;
          document.getElementById("bt_fan_swing_img").src="images/swing-off.svg";
      }
    }

  }

  if (message.destinationName === "smarthouse/bt_fan1/timer") {

    if(isBTfanOn!==0 ){


    if(!timerPressed){
        btFanTimerEndTime = addMinutes(new Date(), 30);
        timerPressed = true
        document.getElementById("bt_fan_timer_img").src="images/chronometer.svg";

    }else{
      var updatedEndTime = addMinutes(btFanTimerEndTime, 30);
      btFanTimerEndTime = updatedEndTime;



    }
    initializeClock("bt_fan_timer_str");


}

  }


    if (message.destinationName === "smarthouse/outdoor_light/state") {
        if (message.payloadString === "on") {
            document.getElementById("outdoor_light_sensor_checkbox").checked = true
            isOutdoorSensorActive = true;
        } else {
            document.getElementById("outdoor_light_sensor_checkbox").checked = false
            document.getElementById("out_light_img").src = "images/no-exposure.svg";

            document.getElementById("outdoor_light_card").style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)";
            isOutdoorSensorActive = false;
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
            document.getElementById("fire_img").src = "images/no-fire.svg"

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

    if (message.destinationName === "smarthouse/bt_light1/state") {


        if (message.payloadString==="0000") {
            document.getElementById("bt_light_checkbox1").checked = false;
            document.getElementById("bt_light_checkbox2").checked = false;
            document.getElementById("bt_light_checkbox3").checked = false;
            document.getElementById("bt_light_checkbox4").checked = false;
            document.getElementById("bt_light_img1").src = "images/light-off.svg"
            document.getElementById("bt_light_img2").src = "images/light-off.svg"
            document.getElementById("bt_light_img3").src = "images/light-off.svg"
            document.getElementById("bt_light_img4").src = "images/light-off.svg"
        } else if (message.payloadString==="0001"){
          document.getElementById("bt_light_checkbox1").checked = false;
          document.getElementById("bt_light_checkbox2").checked = false;
          document.getElementById("bt_light_checkbox3").checked = false;
          document.getElementById("bt_light_checkbox4").checked = true;
          document.getElementById("bt_light_img1").src = "images/light-off.svg"
          document.getElementById("bt_light_img2").src = "images/light-off.svg"
          document.getElementById("bt_light_img3").src = "images/light-off.svg"
          document.getElementById("bt_light_img4").src = "images/light-on.svg"
        }else if (message.payloadString==="0010") {
          document.getElementById("bt_light_checkbox1").checked = false;
          document.getElementById("bt_light_checkbox2").checked = false;
          document.getElementById("bt_light_checkbox3").checked = true;
          document.getElementById("bt_light_checkbox4").checked = false;
          document.getElementById("bt_light_img1").src = "images/light-off.svg"
          document.getElementById("bt_light_img2").src = "images/light-off.svg"
          document.getElementById("bt_light_img3").src = "images/light-on.svg"
          document.getElementById("bt_light_img4").src = "images/light-off.svg"
        }else if (message.payloadString==="0011") {
          document.getElementById("bt_light_checkbox1").checked = false;
          document.getElementById("bt_light_checkbox2").checked = false;
          document.getElementById("bt_light_checkbox3").checked = true;
          document.getElementById("bt_light_checkbox4").checked = true;
          document.getElementById("bt_light_img1").src = "images/light-off.svg"
          document.getElementById("bt_light_img2").src = "images/light-off.svg"
          document.getElementById("bt_light_img3").src = "images/light-on.svg"
          document.getElementById("bt_light_img4").src = "images/light-on.svg"
        }else if (message.payloadString==="0100") {
          document.getElementById("bt_light_checkbox1").checked = false;
          document.getElementById("bt_light_checkbox2").checked = true;
          document.getElementById("bt_light_checkbox3").checked = false;
          document.getElementById("bt_light_checkbox4").checked = false;
          document.getElementById("bt_light_img1").src = "images/light-off.svg"
          document.getElementById("bt_light_img2").src = "images/light-on.svg"
          document.getElementById("bt_light_img3").src = "images/light-off.svg"
          document.getElementById("bt_light_img4").src = "images/light-off.svg"
        }else if (message.payloadString==="0101") {
          document.getElementById("bt_light_checkbox1").checked = false;
          document.getElementById("bt_light_checkbox2").checked = true;
          document.getElementById("bt_light_checkbox3").checked = false;
          document.getElementById("bt_light_checkbox4").checked = true;
          document.getElementById("bt_light_img1").src = "images/light-off.svg"
          document.getElementById("bt_light_img2").src = "images/light-on.svg"
          document.getElementById("bt_light_img3").src = "images/light-off.svg"
          document.getElementById("bt_light_img4").src = "images/light-on.svg"
        }else if (message.payloadString==="0110") {
          document.getElementById("bt_light_checkbox1").checked = false;
          document.getElementById("bt_light_checkbox2").checked = true;
          document.getElementById("bt_light_checkbox3").checked = true;
          document.getElementById("bt_light_checkbox4").checked = false;
          document.getElementById("bt_light_img1").src = "images/light-off.svg"
          document.getElementById("bt_light_img2").src = "images/light-on.svg"
          document.getElementById("bt_light_img3").src = "images/light-on.svg"
          document.getElementById("bt_light_img4").src = "images/light-off.svg"
        }else if (message.payloadString==="0111") {
          document.getElementById("bt_light_checkbox1").checked = false;
          document.getElementById("bt_light_checkbox2").checked = true;
          document.getElementById("bt_light_checkbox3").checked = true;
          document.getElementById("bt_light_checkbox4").checked = true;
          document.getElementById("bt_light_img1").src = "images/light-off.svg"
          document.getElementById("bt_light_img2").src = "images/light-on.svg"
          document.getElementById("bt_light_img3").src = "images/light-on.svg"
          document.getElementById("bt_light_img4").src = "images/light-on.svg"
        }else if (message.payloadString==="1000") {
          document.getElementById("bt_light_checkbox1").checked = true;
          document.getElementById("bt_light_checkbox2").checked = false;
          document.getElementById("bt_light_checkbox3").checked = false;
          document.getElementById("bt_light_checkbox4").checked = false;
          document.getElementById("bt_light_img1").src = "images/light-on.svg"
          document.getElementById("bt_light_img2").src = "images/light-off.svg"
          document.getElementById("bt_light_img3").src = "images/light-off.svg"
          document.getElementById("bt_light_img4").src = "images/light-off.svg"
        }else if (message.payloadString==="1001") {
          document.getElementById("bt_light_checkbox1").checked = true;
          document.getElementById("bt_light_checkbox2").checked = false;
          document.getElementById("bt_light_checkbox3").checked = false;
          document.getElementById("bt_light_checkbox4").checked = true;
          document.getElementById("bt_light_img1").src = "images/light-on.svg"
          document.getElementById("bt_light_img2").src = "images/light-off.svg"
          document.getElementById("bt_light_img3").src = "images/light-off.svg"
          document.getElementById("bt_light_img4").src = "images/light-on.svg"
        }else if (message.payloadString==="1010") {
          document.getElementById("bt_light_checkbox1").checked = true;
          document.getElementById("bt_light_checkbox2").checked = false;
          document.getElementById("bt_light_checkbox3").checked = true;
          document.getElementById("bt_light_checkbox4").checked = false;
          document.getElementById("bt_light_img1").src = "images/light-on.svg"
          document.getElementById("bt_light_img2").src = "images/light-off.svg"
          document.getElementById("bt_light_img3").src = "images/light-on.svg"
          document.getElementById("bt_light_img4").src = "images/light-off.svg"
        }else if (message.payloadString==="1011") {
          document.getElementById("bt_light_checkbox1").checked = true;
          document.getElementById("bt_light_checkbox2").checked = false;
          document.getElementById("bt_light_checkbox3").checked = true;
          document.getElementById("bt_light_checkbox4").checked = true;
          document.getElementById("bt_light_img1").src = "images/light-on.svg"
          document.getElementById("bt_light_img2").src = "images/light-off.svg"
          document.getElementById("bt_light_img3").src = "images/light-on.svg"
          document.getElementById("bt_light_img4").src = "images/light-on.svg"
        }else if (message.payloadString==="1100") {
          document.getElementById("bt_light_checkbox1").checked = true;
          document.getElementById("bt_light_checkbox2").checked = true;
          document.getElementById("bt_light_checkbox3").checked = false;
          document.getElementById("bt_light_checkbox4").checked = false;
          document.getElementById("bt_light_img1").src = "images/light-on.svg"
          document.getElementById("bt_light_img2").src = "images/light-on.svg"
          document.getElementById("bt_light_img3").src = "images/light-off.svg"
          document.getElementById("bt_light_img4").src = "images/light-off.svg"
        }else if (message.payloadString==="1101") {
          document.getElementById("bt_light_checkbox1").checked = true;
          document.getElementById("bt_light_checkbox2").checked = true;
          document.getElementById("bt_light_checkbox3").checked = false;
          document.getElementById("bt_light_checkbox4").checked = true;
          document.getElementById("bt_light_img1").src = "images/light-on.svg"
          document.getElementById("bt_light_img2").src = "images/light-on.svg"
          document.getElementById("bt_light_img3").src = "images/light-off.svg"
          document.getElementById("bt_light_img4").src = "images/light-on.svg"
        }else if (message.payloadString==="1110") {
          document.getElementById("bt_light_checkbox1").checked = true;
          document.getElementById("bt_light_checkbox2").checked = true;
          document.getElementById("bt_light_checkbox3").checked = true;
          document.getElementById("bt_light_checkbox4").checked = false;
          document.getElementById("bt_light_img1").src = "images/light-on.svg"
          document.getElementById("bt_light_img2").src = "images/light-on.svg"
          document.getElementById("bt_light_img3").src = "images/light-on.svg"
          document.getElementById("bt_light_img4").src = "images/light-off.svg"
        }else if (message.payloadString==="1111") {
          document.getElementById("bt_light_checkbox1").checked = true;
          document.getElementById("bt_light_checkbox2").checked = true;
          document.getElementById("bt_light_checkbox3").checked = true;
          document.getElementById("bt_light_checkbox4").checked = true;
          document.getElementById("bt_light_img1").src = "images/light-on.svg"
          document.getElementById("bt_light_img2").src = "images/light-on.svg"
          document.getElementById("bt_light_img3").src = "images/light-on.svg"
          document.getElementById("bt_light_img4").src = "images/light-on.svg"
        }else{

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

    function checkBtLampState() {

        if (document.getElementById("bt_lamp_checkbox").checked === true) {
            client.send("smarthouse/bt_lamp1/state", "on", 0, true);
        } else {
            client.send("smarthouse/bt_lamp1/state", "off", 0, true);
        }
    }

    function checkOutdoorLightSensorState() {

        if (document.getElementById("outdoor_light_sensor_checkbox").checked === true) {
            client.send("smarthouse/outdoor_light/state", "on", 0, true);
            isOutdoorSensorActive = true;
        } else {
            client.send("smarthouse/outdoor_light/state", "off", 0, true);
            isOutdoorSensorActive = false;
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

    function defrost(){

    if(!isMicrowaveInUse){
        client.send("smarthouse/microwave/preset_start", "defrost", 0, true);
        isMicrowaveInUse = true;
      }else{

        client.send("smarthouse/microwave/preset_start", "ready", 0, true);
        isMicrowaveInUse= false;
      }

    }

    function cookChicken(){

    if(!isMicrowaveInUse){
        client.send("smarthouse/microwave/preset_start", "chicken", 0, true);
        isMicrowaveInUse = true;
      }else{

        client.send("smarthouse/microwave/preset_start", "ready", 0, true);
        isMicrowaveInUse= false;
      }

    }
    function cookFish(){

    if(!isMicrowaveInUse){
        client.send("smarthouse/microwave/preset_start", "fish", 0, true);
        isMicrowaveInUse = true;
      }else{

        client.send("smarthouse/microwave/preset_start", "ready", 0, true);
        isMicrowaveInUse= false;
      }

    }

    function checkBTLightState(){
      var msg = '';
      if (document.getElementById("bt_light_checkbox1").checked === true) {
          msg = msg + '1';
      } else {
          msg = msg + '0';
      }
      if (document.getElementById("bt_light_checkbox2").checked === true) {
          msg = msg + '1';
      } else {
          msg = msg + '0';
      }
      if (document.getElementById("bt_light_checkbox3").checked === true) {
        msg = msg + '1';
      } else {
          msg = msg + '0';
      }
      if (document.getElementById("bt_light_checkbox4").checked === true) {
        msg = msg + '1';
      } else {
          msg = msg + '0';
      }

      client.send("smarthouse/bt_light1/state", msg, 0, true);

    }

    function setFanSpeed() {

      var temp = document.getElementById("sliderFan").value

      client.send("smarthouse/fan/speed", temp, 0, true);


    }


    function checkBTfanMode(){

      if(isBTfanOn===1){
        document.getElementById("bt_fan_mode_img").src = "images/half-moon.svg";
        client.send("smarthouse/bt_fan1/mode", "on", 0, true);
        isBTfanOn=2
      }else if(isBTfanOn===2){
        document.getElementById("bt_fan_mode_img").src = "images/wind.svg";
        client.send("smarthouse/bt_fan1/mode", "on", 0, true);
        isBTfanOn=3
      }else if(isBTfanOn===3){
        document.getElementById("bt_fan_mode_img").src = "images/bt-fan-on-standard.svg"
        client.send("smarthouse/bt_fan1/mode", "on", 0, true);
        isBTfanOn=1
      }
    }

  function checkBTfanState(){

    if (document.getElementById("bt_fan_checkbox").checked === true) {
        client.send("smarthouse/bt_fan1/state", "on", 0, true);
        document.getElementById("bt_fan_mode_img").src = "images/bt-fan-on-standard.svg"
        isBTfanOn=1;


    } else {

        client.send("smarthouse/bt_fan1/state", "off", 0, true);
        isBTfanOn=0;
        btFanTimerEndTime=new Date() ;
        timerPressed=false;
        document.getElementById("bt_fan_swing_checkbox").checked = false;
        document.getElementById("bt_fan_swing_img").src="images/swing-off.svg";
        document.getElementById("bt_fan_timer_img").src="images/chronometer-off.svg";
    }


  }

  function checkBTfanSwingState(){
    if(isBTfanOn!==0){
      if (document.getElementById("bt_fan_swing_checkbox").checked === true) {
          client.send("smarthouse/bt_fan1/swing", "true", 0, true);
          document.getElementById("bt_fan_swing_img").src="images/swing-on.svg"


      } else {
          client.send("smarthouse/bt_fan1/swing", "false", 0, true);
          document.getElementById("bt_fan_swing_img").src="images/swing-off.svg";
      }
    }
  }

  function addTimeBTfan(){
    if(isBTfanOn!==0 ){
    client.send("smarthouse/bt_fan1/timer", "on", 0, true);

    if(!timerPressed){
        btFanTimerEndTime = addMinutes(new Date(), 30);
        timerPressed = true
        document.getElementById("bt_fan_timer_img").src="images/chronometer.svg";

    }else{
      var updatedEndTime = addMinutes(btFanTimerEndTime, 30);
      btFanTimerEndTime = updatedEndTime;



    }
    initializeClock("bt_fan_timer_str");


}
  }

  function addMinutes(date, minutes) {
      return new Date(date.getTime() + minutes*60000);
  }

  function getTimeRemaining(endtime){
  var t = Date.parse(endtime) - Date.parse(new Date());
  if (t>27000000){
    t=0;
    btFanTimerEndTime = new Date();
  }
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}


function initializeClock(id) {

  var clock = document.getElementById(id);


  function updateClock() {
    var t = getTimeRemaining(btFanTimerEndTime);
    clock.innerHTML =  ('0' + t.hours).slice(-2) + ':' + ('0' + t.minutes).slice(-2) + ':' + ('0' + t.seconds).slice(-2);


    if (t.total <= 0) {
      clearInterval(timeinterval);
      clock.innerHTML = '00:00:00 ';

    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
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
