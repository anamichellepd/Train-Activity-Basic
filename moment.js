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
  //Firebase

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAw6jk8rBMC0lwxAVOWYKY8tEJUmBuhZZw",
    authDomain: "train-station-3a2bf.firebaseapp.com",
    databaseURL: "https://train-station-3a2bf.firebaseio.com",
    projectId: "train-station-3a2bf",
    storageBucket: "train-station-3a2bf.appspot.com",
    messagingSenderId: "891986214586",
    appId: "1:891986214586:web:e7d5fdce4470ff8cbb0c83",
    measurementId: "G-XGKGWP6WXQ"
  };
  firebase.initializeApp(config);

  //Variable to reference to database
  var database = firebase.database();

  //Initial Values
  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = "";
});

//Capture Button Click
$("#submit").on("click", function(event) {
  event.preventDefault();

  //Grab values from text-boxes
  trainName = $("#trainName")
    .val()
    .trim();
  destination = $("#destination")
    .val()
    .trim();
  firstTrainTime = $("#firstTrainTime")
    .val()
    .trim();
  frequency = $("#frequency")
    .val()
    .trim();

  //Code to set values in the database
  database.ref().set({
    train_name: trainName,
    destination: destination,
    first_train_time: firstTrainTime,
    frequency: frequency
  });
});

//Firebase listens to any changes in the app
firebase
  .database()
  .ref()
  .on("value", function(snapshot) {
    console.log(snapshot.val());
  });
