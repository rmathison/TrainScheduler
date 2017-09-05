// Initialize Firebase
var config = {
    apiKey: "AIzaSyCB3AQYhwUi0ztkNnySoAO6mMVYr7yxRbg",
    authDomain: "trainscheduler-6b89c.firebaseapp.com",
    databaseURL: "https://trainscheduler-6b89c.firebaseio.com",
    projectId: "trainscheduler-6b89c",
    storageBucket: "trainscheduler-6b89c.appspot.com",
    messagingSenderId: "1034684708928"
};
firebase.initializeApp(config);

var trainName, destination, freq;

// Button for adding train data
$("#addTrainBtn").on("click", function() {
    // Grab user input
    trainName = $("#trainNameInput").val().trim();
    trainDestination = $("#destinationInput").val().trim();
    firstTime = $("#firstTimeInput").val().trim();
    freq = $("#freqInput").val().trim();

    // Create local object to hold train data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        firstTime: firstTime,
        freq: freq,
        created: firebase.database.ServerValue.TIMESTAMP
    };

    console.log(newTrain.name);

    // Upload train data to database
    firebase.database().ref().push(newTrain);

    // Clear input fields
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstTimeInput").val("");
    $("#freqInput").val("");
});

firebase.database().ref().on("child_added", function(childSnapshot, prevChildKey) {

    // Create local variables from child object
    trainName = childSnapshot.val().name;
    destination = childSnapshot.val().destination;
    firstTime = childSnapshot.val().firstTime;
    freq = childSnapshot.val().freq;

    // Convert train's first time back 1 year to make sure it comes before current time
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    // Get current time
    var currentTime = moment();
    console.log(currentTime);
    // Difference between first time and current time
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log(diffTime);
    // Remainder of difference and frequency
    var tRemainder = diffTime % freq;
    console.log(tRemainder)
    // Minutes until train
    var minutesTill = freq - tRemainder;
    console.log(minutesTill);
    // Next train's time
    var nextTrainTime = moment().add(minutesTill, "minutes").format("LT");
    console.log(nextTrainTime);

    // Add data to trainTable
    $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + freq + "</td><td>" + nextTrainTime + "</td><td>" + minutesTill + "</td></tr>");

})