$(document).ready(init);

function init() {

  var currentMonth = moment("01-2018", "MM-YYYY"); // passandogli la stringa mese e anno e dicendogli cosa rappresenta quella stringa salvo nella variabile il mese corrente. diventa un oggetto moment con le info mese e anno e tutte le altre info che posso ricavarci


  printDayOfMonth(currentMonth); // funzione che stampa nell'html i li che rappresentano le caselle del calendario. gli passo i dati del mese che deve stampare

  ajaxHoliday(currentMonth); // funzione che chiede al server le date e i nomi delle festività del mese corrente (mese selezionato)

}

function printDayOfMonth(currentMonth) {

  var numOfDays = currentMonth.daysInMonth(); // il metodo daysInMonth() mi dice quanti giorni ci sono in un mese

  var template = $("#li-template").html(); // questo è il template che gestirò con handlebars. contiene l'html di un li con dentro due span e un h1 per comporre la casella del calendario
  var compiled = Handlebars.compile(template) // salvo nella variabile la funzione di handlebar che compila il template del li (casella del calendario)
  var target = $("#days-of-month>ul"); // target la lista contenente i li nell'html che comporranno il calendario

  target.html(""); // svuoto il target così se dovessi stampare un altro mese non si aggiunge al precedente ma lo sovrascrive

  for (var i = 1; i <= numOfDays; i++) { // ciclo per il numero di giorni del mese in modo da stampare il numero giusto di giorni

    var dataComplete = moment({year: currentMonth.year(), month: currentMonth.month(), day: i}); // un oggetto moment si può creare anche passandogli i dati con un array. in questo caso gli passo l'anno e il mese estratti dall'oggetto currentMonth. il numero di giorno invece è la i. quindi incrementa ad ogni ciclo

    var newLi = compiled({ // compilo il template
      "data-day": dataComplete.format("YYYY-MM-DD"), // nel data-day assegno la data stampata come me la ritornerà il server. quindi nel formato anno mese giorno. in questo modo sarà più semplice trovare la corrispondenza tra la data della festività mandata dal server e la data da modificare sul calendario
      "n-day": dataComplete.format("D"), // stampo il numero del giorno. Potrei usare anche la i. oppure potrei usare il format("DD") se volessi 01-02-03 invece di 1-2-3
      "dow": dataComplete.format("dddd") // stampo il nome del giorno ("dddd") stampa monday tuesday ecc ("ddd") stampa mon tue wen ecc
    });

    target.append(newLi); // appendo il li compilato al target.
  }
}

function ajaxHoliday(currentMonth) { // questa funzione fa una chiamata al server boolean che gli restituisce un array con un array di oggetti. questi oggetti contengono date e nomi delle festività del 2018.

  $.ajax({ // chiamata ajax
    url: "https://flynn.boolean.careers/exercises/api/holidays", // url "pulito". i dati glieli passo dopo
    method: "GET",
    data: { // con data passo un oggetto che va a dare dei parametri alla chiamata. sarebbe come scrivere nell'url in fondo ?year=currentmonth.year()&month=currentMonth.month(). così però risulta più pulito ed ordinato
      "year": currentMonth.year(), // estraggo da currentMonth() l'anno
      "month": currentMonth.month() // estraggo da currentMonth() il mese. Con questi paramentri il server sa cosa mandarmi come response
    },
    success: function (data) { // in caso di successo la variabile data che mi arriva dal server sarà un oggetto con due elementi. alla chiave success mi dice se la chiamata è andata a buon fine. alla chiave response mi da un array di oggetti con date e nomi delle festività del mese che gli ho chiesto
      if(data["success"]){ // se la variabile success è true eseguo la funzione print holiday

        printHoliday(data["response"]);
      } else { // la funzione success è false quando la comunicazione tra il client (io) e il server (loro) è andata a buon fine quindi il server mi risponde. però mi risponde picche. la risposta arriva, però qualcosa non va. Tipo che gli ho chiesto un mese e un anno che non ha.
        alert("Impossibile trovare dati festività per questo mese!");
      }
    } ,
    error: function (err) { // in questo caso l'errore è dell'ajax cioè quello che non ha funzionato è proprio la comunicazione client-server. magari non ha trovato la pagina che cercavo o timeout della comunicazione quelle robe lì.
      console.log("err", err);
    }

  });
}

function printHoliday(arrayHoliday) { // funzione che stampa le festività. riceve l'array di oggetti delle festività del mese corrente. ogni oggetto dell'array contiene "date" con la data nella forma YYYY-MM-DD e "name" con il nome della festività

  for (var i = 0; i < arrayHoliday.length; i++) {// ciclo su tutti gli elementi dell'array

    var dateHoliday = arrayHoliday[i]["date"]; // estraggo la data della festività

    var nameHoliday = arrayHoliday[i]["name"]; // estraggo il nome della festività

    var target = $("#days-of-month li[data-day=\"" + dateHoliday + "\"]"); // come target seleziono quel li figlio di #days-of-month che ha come atrributo data-day="+ data della festività estratta dall'arrayHoliday+"

    target.addClass("festivity"); // do classe festivity che cambia dei colori ecc nel css

    target.find(".f-name").text(nameHoliday); // nello span con classe f-name copio il nome della festività

  }
}
