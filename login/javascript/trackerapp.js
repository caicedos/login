// Initialize Firebase
var config = {
  apiKey: "AIzaSyC0fV7aGHpPQW652dB7Gz2L3T8axhF2c8U",
  authDomain: "personal-hobbies.firebaseapp.com",
  databaseURL: "https://personal-hobbies.firebaseio.com",
  projectId: "personal-hobbies",
  storageBucket: "personal-hobbies.appspot.com",
  messagingSenderId: "1122835426"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#submit-btn").on("click", function (event) {
  event.preventDefault();

  var name = $("#name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var time = $("#time-input").val().trim();
  var frequency = $("#frequency-input").val().trim()

  var newTrain = {
    name: name,
    destination: destination,
    time: time,
    frequency: frequency
  };

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

      var uid = user.uid;
      console.log(uid);
      var userRef = database.ref("/users/" + uid);

      userRef.child("app").push(newTrain);

    }
  });

  console.log(time);

  $("#name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");
});

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {

    var uid = user.uid;
    console.log(uid);
    var userRef = database.ref("/users/" + uid);

    userRef.child("app").on("child_added", function (childSnapshot) {

      var trainName = childSnapshot.val().name;
      var trainDestination = childSnapshot.val().destination;
      var trainTime = childSnapshot.val().time;
      var trainFrequency = childSnapshot.val().frequency;

      console.log(trainTime);
      console.log(trainFrequency);

      var trainTimeConverted = moment(trainTime, "HH:mm");
      console.log(trainTimeConverted);

      var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);

      var timeRemainder = diffTime % trainFrequency;
      console.log(timeRemainder);

      var minutesAway = trainFrequency - timeRemainder;
      var nextArrival = moment().add(minutesAway, "minutes");
      var nextTrainDisplay = moment(nextArrival).format("hh:mm");

      var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(nextTrainDisplay),
        $("<td>").text(minutesAway),
      );

      $("#schedule-table > tbody").append(newRow);
    });


    $("#sign-in-form").hide();
    $("#loged-in").show();

  } else {
    $("#sign-in-form").show();
    window.location = 'login.html';

  }

});

$("#log-out").on("click", function () {
  firebase.auth().signOut().then(function () {
    // Sign-out successful.
  }).catch(function (error) {
    // An error happened.
  });

});