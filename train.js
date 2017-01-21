
// Initialize Firebase
var config = {
	apiKey: "AIzaSyBA8LqksK3-WFZMh7GniIjpCmHshAD00bs",
	authDomain: "trainschedule-bfd8f.firebaseapp.com",
	databaseURL: "https://trainschedule-bfd8f.firebaseio.com",
	storageBucket: "trainschedule-bfd8f.appspot.com",
	messagingSenderId: "905825897810"
	};
firebase.initializeApp(config);

// variable to store the database..
var database = firebase.database();

// button for adding train..
$("#add-train").on("click", function(event) {
	event.preventDefault();

	// grabbing user inputs..
	var trainName = $("#trainName").val().trim();
	var destination = $("#destination").val().trim();
	var firstTrainTime = $("#firstTrainTime").val().trim();
	var frequency = $("#frequency").val().trim();

	//creating a local object to hold the user inputs..
	var newTrainInfo = {
		trainName: trainName,
		destination: destination,
		firstTrainTime: firstTrainTime,
		frequency: frequency
	};

	//uploading the train info to the database..
	database.ref().push(newTrainInfo);

	//logging everything to the console..
	console.log(newTrainInfo);

	alert("Train info successfully added!");

	//cleaning up the text-boxes..
	$("#trainName").val("");
	$("#destination").val("");
	$("#firstTrainTime").val("");
	$("#frequency").val("");

});

// creating a firebase event for adding train to the database and a row
// in the HTML when a user adds an entry..
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

	console.log(childSnapshot.val());

	//storing everything to the varaiable..
	var trainName = childSnapshot.val().trainName;
	var destination = childSnapshot.val().destination;
	var firstTrainTime = childSnapshot.val().firstTrainTime;
	var frequency = childSnapshot.val().frequency;

	console.log(trainName);
	console.log(destination);
	console.log(firstTrainTime);
	console.log(frequency);

	// First Time (pushed back 1 year to make sure it comes before current time)
	var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
	console.log(firstTimeConverted);

	var currentTime = moment();
	console.log("Current time: " + moment(currentTime).format("hh:mm"));

	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	console.log("Difference in time: " + diffTime);

	var tRemainder = diffTime % frequency;
	console.log(tRemainder);

	var tMinutesTillTrain = frequency - tRemainder;
	console.log("Minutes till train: " + tMinutesTillTrain);

	var nextTrain = moment().add(tMinutesTillTrain, "minutes");
	console.log("Arrival Time: " + moment(nextTrain).format("hh:mm A"));
	var nextTrainTime = moment(nextTrain).format("hh:mm A");

	//adding each train's data to the table..
	$("#train-table >tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
		frequency + "</td><td>" + nextTrainTime + "</td><td>" + tMinutesTillTrain + "</td></tr>");
	

});

