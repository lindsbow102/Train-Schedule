// Initialize Firebase
var config = {
  apiKey: "AIzaSyCOwZqKB97NcIPpSgj6D6SXbwz4WvfK38Y",
  authDomain: "train-schedule-334df.firebaseapp.com",
  databaseURL: "https://train-schedule-334df.firebaseio.com",
  projectId: "train-schedule-334df",
  storageBucket: "",
  messagingSenderId: "754680936361"
};
firebase.initializeApp(config);

var database = firebase.database();

//Capture Button Click
$("#add-train").on("click", function(event) {
  //prevent page from reloading
  event.preventDefault();

  //Grab values from text boxes
  var name = $("#name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = moment($("#first-train-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
  var frequency = $("#frequency-input").val().trim();

  console.log(firstTrain);

// Create train object to push to Firebase
  var newTrain = {
    name: name,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);

  // Alert
  alert("Train successfully added");

  //clear text boxes
  $("#name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});
// Create Firebase event for adding moment.js info to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(snapshot) {
  // Store everything into a variable.
  var tName = snapshot.val().name;
  var tDestination = snapshot.val().destination;
  var tFirstTrain = snapshot.val().firstTrain;
  var tFrequency = snapshot.val().frequency;

  //Using moment.js to log times
  var remainder = moment().diff(moment.unix(tFirstTrain), "minutes") % tFrequency;
  var minutes = tFrequency - remainder;
  var arrival = moment().add(minutes, "m").format("hh:mm A");

  console.log(remainder);
  console.log(minutes);
  console.log(arrival);

  $("#trainTable > tBody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" + tFrequency + "</td><td>" + arrival + "</td><td>" + minutes + "</td></tr>");
});
