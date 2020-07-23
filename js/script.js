$(document).ready(init);

function init() {
  var currentMonth = moment("01-2018", "MM-YYYY");
  console.log("month", currentMonth.month());
  console.log("year", currentMonth.year());

  printDayOfMonth(currentMonth);

}

function printDayOfMonth(month) {

  var numOfDays = month.daysInMonth();
  var template = $("#li-template").html();
  var compiled = Handlebars.compile(template)
  var target = $("#days-of-month>ul");


  for (var i = 1; i <= numOfDays; i++) {

    var dataComplete = moment({year: month.year(), month: month.month(), day: i})

    var newLi = compiled({
      "data-day": dataComplete.format("DD-MM-YYYY"),
      "n-day": dataComplete.format("D"),
      "dow": dataComplete.format("dddd")
    });

    target.append(newLi);
  }
}
