$(document).ready(init);

function init() {
  var currentMonth = moment("01-2018", "MM-YYYY");
  console.log("month", currentMonth.month());
  console.log("year", currentMonth.year());

  printDayOfMonth(currentMonth);

  ajaxHoliday(currentMonth);

  
}

function printDayOfMonth(currentMonth) {

  var numOfDays = currentMonth.daysInMonth();
  var template = $("#li-template").html();
  var compiled = Handlebars.compile(template)
  var target = $("#days-of-month>ul");


  for (var i = 1; i <= numOfDays; i++) {

    var dataComplete = moment({year: currentMonth.year(), month: currentMonth.month(), day: i})

    var newLi = compiled({
      "data-day": dataComplete.format("YYYY-MM-DD"),
      "n-day": dataComplete.format("D"),
      "dow": dataComplete.format("dddd")
    });

    target.append(newLi);
  }
}

function ajaxHoliday(currentMonth) {
  $.ajax({
    url: "https://flynn.boolean.careers/exercises/api/holidays",
    method: "GET",
    data: {
      "year": currentMonth.year(),
      "month": currentMonth.month()
    },
    success: function (data) {
      if(data["success"]){

        printHoliday(data["response"]);
      } else {
        alert("Impossibile trovare dati festività per questo mese!");
      }
    } ,
    error: function (err) {
      console.log("err", err);
    }

  });
}

function printHoliday(arrayHoliday) {

  for (var i = 0; i < arrayHoliday.length; i++) {
    var dateHoliday = arrayHoliday[i]["date"];
    var nameHoliday = arrayHoliday[i]["name"];
    var target = $("#days-of-month [data-day=\"" + dateHoliday + "\"]");
    target.addClass("festivity");
    target.find(".f-name").text(nameHoliday);

  }
}
