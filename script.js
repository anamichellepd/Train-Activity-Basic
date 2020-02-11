$(document).ready(function() {
  //Flipper
  $.fn.ticker = function(options) {
    options = $.extend(
      {
        uppercase: true,
        extra: ",.:+=/()",
        speed: 30
      },
      options
    );

    var alph = "ABCDEFGHIJKLMNOPQRSTUVXYZ";

    if (!options.uppercase) {
      alph = alph + alph.toLowerCase();
    }
    alph = "01234567890" + alph + options.extra + " ";

    return this.each(function() {
      var k = 1,
        elems = $(this).children(),
        arr = alph.split(""),
        len = 0,
        fill = function(a) {
          while (a.length < len) {
            a.push(" ");
          }
          return a;
        },
        texts = $.map(elems, function(elem) {
          var text = $(elem).text();
          len = Math.max(len, text.length);
          return options.uppercase ? text.toUpperCase() : text;
        }),
        target = $("<div>"),
        render = function(print) {
          target.data("prev", print.join(""));
          fill(print);
          print = $.map(print, function(p) {
            return p == " " ? "&#160;" : p;
          });
          return target.html(
            "<span>" + print.join("</span><span>") + "</span>"
          );
        },
        attr = {};

      $.each(this.attributes, function(i, item) {
        target.attr(item.name, item.value);
      });

      $(this).replaceWith(render(texts[0].split("")));

      target.click(function(e) {
        var next = fill(texts[k].split("")),
          prev = fill(target.data("prev").split("")),
          print = prev;

        $.each(next, function(i) {
          if (next[i] == prev[i]) {
            return;
          }
          var index = alph.indexOf(prev[i]),
            j = 0,
            tid = window.setInterval(function() {
              if (next[i] != arr[index]) {
                index = index == alph.length - 1 ? 0 : index + 1;
              } else {
                window.clearInterval(tid);
              }
              print[i] = alph[index];
              render(print);
            }, options.speed);
        });
        k = k == texts.length - 1 ? 0 : k + 1;
      });
    });
  };

  $("#text").ticker();

  // FIREBASE

  var firebaseConfig = {
    apiKey: "AIzaSyAw6jk8rBMC0lwxAVOWYKY8tEJUmBuhZZw",
    authDomain: "train-station-3a2bf.firebaseapp.com",
    databaseURL: "https://train-station-3a2bf.firebaseio.com",
    projectId: "train-station-3a2bf",
    storageBucket: "train-station-3a2bf.appspot.com",
    messagingSenderId: "891986214586",
    appId: "1:891986214586:web:e7d5fdce4470ff8cbb0c83",
    measurementId: "G-XGKGWP6WXQ"
  };

  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

  // When Submit is clicked
  $("#submit-btn").on("click", function(event) {
    event.preventDefault();

    // Read the input
    var trainName = $("#train-name-input")
      .val()
      .trim();
    var destination = $("#destination-input")
      .val()
      .trim();
    var firstTrainTime = $("#first-train-time-input")
      .val()
      .trim();
    //"HH:mm"
    var frequency = $("#frequency-input")
      .val()
      .trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
      train_name: trainName,
      destination: destination,
      first_train: firstTrainTime,
      frequency: frequency
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    // console.log(newTrain.train_name);
    // console.log(newTrain.destination);
    // console.log(newTrain.firstTrainTime);
    // console.log(newTrain.frequency);

    // alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#frequency-input").val("");
  });
  // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().train_name;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().first_train;
    var frequency = childSnapshot.val().frequency;

    // Train Info
    // console.log(trainName);
    // console.log(destination);
    // console.log(firstTrainTime);
    // console.log(frequency);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(
      1,
      "years"
    );
    // console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    // Calculate NEXT ARRIVAL

    var convertedTime = moment(firstTrainTime, "HH:mm");
    var currentTime = moment();
    var diffTime = moment().diff(moment(convertedTime), "minutes");
    var tRemainder = diffTime % frequency;
    var minutesAway = frequency - tRemainder;
    var nextArrival = moment()
      .add(minutesAway, "minutes")
      .format("HH:mm");
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(frequency),
      $("<td>").text(nextArrival),
      $("<td>").text(minutesAway)
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });
});
