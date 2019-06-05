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
  const name = $("#name-input")
    .val()
    .trim();
  const destination = $("#destination-input")
    .val()
    .trim();
  const firstTrain = moment(
    $("#first-train-input")
      .val()
      .trim(),
    "HH:mm"
  )
    .subtract(10, "years")
    .format("X");
  const frequency = $("#frequency-input")
    .val()
    .trim();

  console.log(firstTrain);

  // Create train object to push to Firebase
  const newTrain = {
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
  console.log(snapshot.key);
  // Store everything into a variable.
  const tName = snapshot.val().name;
  const tDestination = snapshot.val().destination;
  const tFirstTrain = snapshot.val().firstTrain;
  const tFrequency = snapshot.val().frequency;

  //Using moment.js to log times
  const remainder =
    moment().diff(moment.unix(tFirstTrain), "minutes") % tFrequency;
  const minutes = tFrequency - remainder;
  const arrival = moment()
    .add(minutes, "m")
    .format("hh:mm A");

  console.log(remainder);
  console.log(minutes);
  console.log(arrival);

  const id = snapshot.key;
  console.log("ID: " + id);

  $("#trainTable > tBody").append(
    `<tr data-id='${id}'>
  <td>${tName}</td>
  <td>${tDestination}</td>
  <td>${tFrequency}</td>
  <td>${arrival}</td>
  <td>${minutes}</td>
  <td><button id='remove'>Remove</button></td>
  </tr>`
  );
});

// Bonus:  Add functionality to remove train from Firebase and table
$(document).on("click", "#remove", function() {
  const trainId = $(this)
    .parent()
    .parent()
    .attr("data-id");

  console.log(trainId);

  database
    .ref()
    .child(trainId)
    .remove()
    .then(() => {
      alert("Train removed!");
    }).then(() => {
      location.reload();
    });
});
