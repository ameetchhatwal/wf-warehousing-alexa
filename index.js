"use strict";

var Alexa = require("alexa-sdk");
const cookbook = require('alexa-cookbook.js');

var carriers = ['USPS', 'FedEx', 'UPS'];

var truckCount = [4, 5, 6, 3, 8, 2, 8];

var truckTiming = ['11:00 AM', '12:00 PM', '6:00 PM', '10:00 PM', '11:59 PM'];

var ordersToBeReleased = [10, 20, 34, 100, 200, 500, 550, 1500, 1000, ];

var operationCount = [0, 18, 45, 200, 28, 350, 100, 5, 1];

const FOLLOW_UP = 'How else can I help you today?'

var handlers = {
  "HelloIntent": function () {
    this.response.speak("Welcome to Wayfair Warehouse!"); 
    this.emit(':responseReady');
  },
  "LaunchRequest": function () {
    this.response.speak("Welcome to Wayfair Warehousing! Please select one of the following warehouse cities: Hebron, Erlanger or Cranbury?")
    .listen("Please select a valid warehouse city?");
    this.emit(':responseReady');
  },
  //Select City
  'WarehouseCityIntent': function () {
    var whName = this.event.request.intent.slots.warehouseCity.value;
    if(whName === 'Hebron' || whName === 'Erlanger' || whName === 'Cranbury'){
        this.attributes['warehouseCity'] = this.event.request.intent.slots.warehouseCity.value;
        this.response.speak("Welcome to "+ whName +" Warehouse. I can help you with quick information about warehouse operations. You can ask me questions like How is picking operation health? or Can I release orders? or What is happening at door 5?").listen("How can I help you today?");
    } else {
      this.response.speak("Please select a valid warehouse city").listen();
    }
    this.emit(':responseReady');
  },
  //Get Door Information
  'DoorIntent': function () {
    var doorNumber = this.event.request.intent.slots.doorNumber.value;
    const randomCarrier =  cookbook.getRandomItem(carriers);
    if(doorNumber <= 10){
      this.response.speak('Door number '+ doorNumber + ' is receiving packages from '+ randomCarrier+ ' '+ FOLLOW_UP).listen(FOLLOW_UP);
      this.emit(':responseReady');
    } else {
      this.response.speak('Door number '+ doorNumber + ' is being loaded for shipping via '+ randomCarrier + ' and is scheduled to leave at 3:00 PM. '+FOLLOW_UP ).listen(FOLLOW_UP);
      this.emit(':responseReady');
    }
  },
  
  //Truck schedule
  'TruckScheduleIntent': function () {
    const randomtruckCountArriving =  cookbook.getRandomItem(truckCount);
    const randomtruckCountLeaving = cookbook.getRandomItem(truckCount);
    if(this.attributes['warehouseCity']){
      this.response.speak('Today at '+ this.attributes['warehouseCity'] + 
      ' warehouse, ' +' you can expect '+ randomtruckCountArriving + ' trucks to arrive and '+ 
      randomtruckCountLeaving +' trucks to leave. '+ FOLLOW_UP).listen(FOLLOW_UP);
      this.emit(':responseReady');
    } else {
      this.response.speak('Today you can expect '+ randomtruckCountArriving + ' trucks to arrive and '+ 
      randomtruckCountLeaving +' trucks to leave. '+ FOLLOW_UP ).listen(FOLLOW_UP);
      this.emit(':responseReady');
    }
  },
  
  'WfJokeIntent': function () {
    this.response.speak('I like Amazon, They can help you buy baby diapers while I can help you buy baby cribs. Hmmm, Does that make me superior?');
    this.emit(':responseReady');
  },
  
  'ReleaseOrderIntent': function () {
      const unreleaseOrderCount =  cookbook.getRandomItem(ordersToBeReleased);
      if(unreleaseOrderCount< 50){
         this.response.speak('Currently you have '+ unreleaseOrderCount +' orders to be released. I recommend you can wait for more orders to accumulate. '+ FOLLOW_UP).listen(FOLLOW_UP);
      } else if (unreleaseOrderCount > 50 && unreleaseOrderCount <500){
        this.response.speak('Yes, you have '+ unreleaseOrderCount + ' orders waiting to be released '+ FOLLOW_UP).listen(FOLLOW_UP);
      } else {
        this.response.speak('Yes, you have '+ unreleaseOrderCount + ' orders waiting to be released. I recommend you release it immediately. '+ FOLLOW_UP ).listen(FOLLOW_UP);
      }
      this.emit(':responseReady');

  },
  
  //Operation Intent
  'OperationIntent': function () {
    var operation = this.event.request.intent.slots.operation.value;
    if (operation === 'picking' || operation === 'loading'|| operation === 'receiving'){
      const transactionCount =  cookbook.getRandomItem(operationCount);
      if(transactionCount <= 10){
        this.response.speak(operation + ' operation has only '+ transactionCount +' successful transactions in the last 15 min, It is lower than usual. I suggest you look into it. '+FOLLOW_UP).listen(FOLLOW_UP);
      } else {
         this.response.speak(operation + ' operation has '+ transactionCount +' successful transactions in the last 15 min, The operation is healthy right now. '+ FOLLOW_UP).listen(FOLLOW_UP);
      }
    } else {
        this.response.speak('I can only help with picking, receiving or loading operations currently. Please try again').listen(FOLLOW_UP);
    }
    this.emit(':responseReady');
  },
  
   // Stop
  'AMAZON.StopIntent': function() {
    this.response.speak('Ok, I will be here when you need me');
    this.emit(':responseReady');
  },

  // Cancel
  'AMAZON.CancelIntent': function() {
    this.response.speak('Ok, I will be here when you need me');
    this.emit(':responseReady');
  },
  // Help
  'AMAZON.HelpIntent': function() {
    this.response.speak('I can help you with quick information about warehouse operations. You can ask me How is picking operation health? or Can I release orders? or What is happening at door 5?').listen("How can I help you today?");
    this.emit(':responseReady');
  },
  // Fallback
  'AMAZON.FallbackIntent': function() {
    this.response.speak('Sorry, something went wrong, I cannot help at the moment.');
    this.emit(':responseReady');
  },
};

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};