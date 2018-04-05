//Initial Variables
var name = "";
var destination = "";
var tFrequency = "";
var firstTime = "";
var firstTimeConverted = "";
var currentTime = "";
var diffTime = "";
var tRemainder = "";
var tMinutesTillTrain = "";
var nextTrain = "";

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
    $("#add-train").on("click", function (event) {
        //prevent page from reloading
        event.preventDefault();

        //Grab values from text boxes
        name = $("#name-input").val()
            .trim();
        destination = $("#destination-input").val().trim();
        firstTime = moment($("#first-train-input").val().trim(), "HH:mm").format("X");
        console.log(firstTime);

        tFrequency = $("#frequency-input").val().trim();

        var newTrain = {
            name: name,
            destination: destination,
            firstTime: firstTime,
            tFrequency: tFrequency
        };

        // Uploads employee data to the database
        database.ref().push(newTrain);

        // Logs everything to console
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.firstTime);
        console.log(newTrain.tFrequency);

        // Alert
        alert("Train successfully added");

        //clear text boxes
        $("#name-input").val("");
        $("#destination-input").val("");
        $("#first-train-input").val("");
        $("#frequency-input").val("");
    });
    // Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function (childSnapshot, prevChildKey) {
        

        // Store everything into a variable.
        var trainName = childSnapshot.val().name;
        var trainDest = childSnapshot.val().destination;
        var trainFirstTime = childSnapshot.val().trainFirstTime;
        var trainTfrequency = childSnapshot.val().tFrequency;

        // Employee Info
        console.log(trainName);
        console.log(trainDest);
        console.log(trainFirstTime);
        console.log(trainTfrequency);


        //Using moment.js to log times
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

        //formats the next arrival time in HH"mm
        var formattedNextTrain = nextTrain.format("H:mm");

    $("#trainTable > tbody").append(
        "<tr><td>" +
        trainName +
        "</td><td>" +
        trainDest +
        "</td><td>" +
        trainTfrequency +
        "</td><td>" +
        moment(nextTrain).format("HH:mm") +
        "</td><td>" +
        tMinutesTillTrain +
        "</td></tr>"
    );

});


