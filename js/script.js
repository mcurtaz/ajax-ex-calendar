// Descrizione:
// Creiamo un calendario dinamico con le festività.
// Il calendario partirà da gennaio 2018 e si concluderà a dicembre 2018 (unici dati disponibili sull'API).
// Milestone 1
// Creiamo il mese di Gennaio, e con la chiamata all'API inseriamo le festività.
// Milestone 2
// Diamo la possibilità di cambiare mese, gestendo il caso in cui l'API non possa ritornare festività.
// Attenzione!
// Ogni volta che cambio mese dovrò:
// Controllare se il mese è valido (per ovviare al problema che l'API non carichi holiday non del 2018)
// Controllare quanti giorni ha il mese scelto formando così una lista
// Chiedere all'api quali sono le festività per il mese scelto
// Evidenziare le festività nella lista
// Consigli e domande del giorno:
// Abbiamo visto assieme una libereria che serve per gestire le date... quale sarà?
// Una chiamata ajax può anche non andare a buon fine, che si fa in quel caso? Lasciamo l'utente ad attendere? ;)


$(document).ready(init);

function init() {
    // mese di partenza
  var currentMonth = moment("01-2018", "MM-YYYY"); // passandogli la stringa mese e anno e dicendogli cosa rappresenta quella stringa salvo nella variabile il mese corrente. diventa un oggetto moment con le info mese e anno e tutte le altre info che posso ricavarci


  printDayOfMonth(currentMonth); // funzione che stampa nell'html i li che rappresentano le caselle del calendario. gli passo i dati del mese che deve stampare

  ajaxHoliday(currentMonth); // funzione che chiede al server le date e i nomi delle festività del mese corrente (mese selezionato)

  // Listeners eventi bottoni
  addButtonsListener();
}

// FUNZIONI DI STAMPA MESI E festività

// funzione che stampa i li nell'html che saranno le caselle del CALENDARIO


function printDayOfMonth(currentMonth) {

  var numOfDays = currentMonth.daysInMonth(); // il metodo daysInMonth() mi dice quanti giorni ci sono in un mese

  var template = $("#li-template").html(); // questo è il template che gestirò con handlebars. contiene l'html di un li con dentro due span e un h1 per comporre la casella del calendario
  var compiled = Handlebars.compile(template) // salvo nella variabile la funzione di handlebar che compila il template del li (casella del calendario)
  var target = $("#days-of-month>ul"); // target la lista contenente i li nell'html che comporranno il calendario

  target.html(""); // svuoto il target così se dovessi stampare un altro mese non si aggiunge al precedente ma lo sovrascrive

  for (var i = 1; i <= numOfDays; i++) { // ciclo per il numero di giorni del mese in modo da stampare il numero giusto di giorni

    var dataComplete = moment({year: currentMonth.year(), month: currentMonth.month(), day: i}); // un oggetto moment si può creare anche passandogli i dati con un oggetto. in questo caso gli passo l'anno e il mese estratti dall'oggetto currentMonth. il numero di giorno invece è la i. quindi incrementa ad ogni ciclo

    var newLi = compiled({ // compilo il template
      "data-day": dataComplete.format("YYYY-MM-DD"), // nel data-day assegno la data stampata come me la ritornerà il server. quindi nel formato anno mese giorno. in questo modo sarà più semplice trovare la corrispondenza tra la data della festività mandata dal server e la data da modificare sul calendario
      "n-day": dataComplete.format("D"), // stampo il numero del giorno. Potrei usare anche la i. oppure potrei usare il format("DD") se volessi 01-02-03 invece di 1-2-3
      "dow": dataComplete.format("dddd") // stampo il nome del giorno ("dddd") stampa monday tuesday ecc ("ddd") stampa mon tue wen ecc
    });

    target.append(newLi); // appendo il li compilato al target.
  }
}


// funzione della api che riceve dal server le festività

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
        if (currentMonth.year() != "2018") { // se si esce dall'anno 2018 l'api non ci manderà le date delle festività. quindi se l'errore è lì stampo "date feste disponibili solo per il 2018" se l'errore è altrove comunque segnalo che c'è stato un errore
          $(".errors").text("Attenzione: le date delle festività sono disponibili solo per l'anno 2018!");
        } else{

          $(".errors").text("Attenzione: le date delle festività sono disponibili solo per l'anno 2018!");
        }
      }
    } ,
    error: function (err) { // in questo caso l'errore è dell'ajax cioè quello che non ha funzionato è proprio la comunicazione client-server. magari non ha trovato la pagina che cercavo o timeout della comunicazione quelle robe lì.
      $(".errors").text("Attenzione: le date delle festività sono disponibili solo per l'anno 2018!");
    }

  });
}


// funzione che stampa sul calendario le festività ricevute dall API

function printHoliday(arrayHoliday) { // funzione che stampa le festività. riceve l'array di oggetti delle festività del mese corrente. ogni oggetto dell'array contiene "date" con la data nella forma YYYY-MM-DD e "name" con il nome della festività

  for (var i = 0; i < arrayHoliday.length; i++) {// ciclo su tutti gli elementi dell'array

    var dateHoliday = arrayHoliday[i]["date"]; // estraggo la data della festività

    var nameHoliday = arrayHoliday[i]["name"]; // estraggo il nome della festività

    var target = $("#days-of-month li[data-day=\"" + dateHoliday + "\"]"); // come target seleziono quel li figlio di #days-of-month che ha come atrributo data-day="+ data della festività estratta dall'arrayHoliday+"

    target.addClass("festivity"); // do classe festivity che cambia dei colori ecc nel css

    target.find(".f-name").text(nameHoliday); // nello span con classe f-name copio il nome della festività

  }
}

// --------  LISTENERS  EVENTI ----

function addButtonsListener() {
  $("#month-next").click(function(){
    changeMonth("next");
  });
  $("#month-prev").click(function(){
    changeMonth("prev")
  });
}


// funzione che cambia il mese. argomento to per determinare se andare avanti o indietro

function changeMonth(to) {

  $(".errors").text(""); // pulisco il div che segnala eventuali errori

  var grabMonth = $("#current-month").data("current"); // per sapere il mese corrente lo salvo nell'html nel div #current-month in un attributo data-current e nel formato MM-YYYY. seleziono il div e salvo il contenuto dell'attributo data-current

  // ATTENZIONE SE FACCIO IL LOG DI grabMonth CHE NON è ALTRO CHE IL VALORE DELL'ATTRIBUTO data-current DEL DIV #current-month MI DA DI VOLTA IN VOLTA IL VALORE CORRETTO. PARTE DA 01-2018 POI SE VADO AVANTI COL MESE DEL CALENDARIO 02-2018 03-2018 E COSì VIA. SE GUARDO CON L'INSPECTOR DI CHROME (ANCHE CON FIREFOX UGUALE) PERò L'ELEMENTO HA SEME ATTRIBUTO data-current="01-2018". COMUNQUE JS LEGGE IL VALORE GIUSTO.

  console.log(grabMonth);

  var currentMonth = moment(grabMonth, "MM-YYYY"); //trasfomo la data presa prima in un oggetto moment

  if (to == "next"){ // se la funzione la chiama il tasto next uso il metodo di moment .add() come argomenti gli do 1 (il numero da aggiungere) e "M" che sta per mesi. quindi prende la data contenuta in currentMonth aggiunge un mese e salva la nuova data in newCurrentMonth.
    var newCurrentMonth = currentMonth.add(1,"M");

  } else if (to == "prev"){ // potevo lasciare anche solo else ma per avere un controllo in più..

    var newCurrentMonth = currentMonth.subtract(1,"M"); // se la funzione è chiamata dal tasto prev invece che aggiungere con .add() sottraggo con .subtract(). il principio resta lo stesso
  }


    // ATTENZIONE: SI SCOPRì CHE LA FUNZIONE .ADD() E .SUBTRACT() MODIFICANO L'OGGETTO. QUINDI ANCHE SE IO LO SALVO NELLA VARIABILE newCurrentMonth ANCHE currentMonth è STATO MODIFICATO. SE FACCIO IL LOG LO VEDO. QUINDI SE MI SERVISSE MANTENERE LA VARIABILE currentMonth DOVREI PRIMA SALVARMELA IN UN ALTRA VARIABILE oldCurrentMonth
    console.log(currentMonth.month());
    console.log(newCurrentMonth.month());

  $("#current-month").data("current", newCurrentMonth.format("MM-YYYY")); // prendo il div current-month e gli cambio il valore di data-current. Il metodo data con un solo argomento legge. con due argomenti il primo sta per data-"x", il secondo per il valore da assegnare all'attributo. in questo caso il valore da assegnare all'attributo data-current è newCurrentMonth.format("MM-YYYY") cioè dall'oggetto di moment newCurrentMonth estraggo la stringa della data nel formato "MM-YYYY". al prossimo giro di next o prev da questa stringa creerò un oggetto moment con il mese corrente. In pratica nessuna variabile in JS mi dice che mese sto visualizzando. questa info la salvo nell'attributo data-current del div con id="current-month"

  var title = newCurrentMonth.format("MMMM") + " " + newCurrentMonth.format("YYYY"); // creo una stringa estraendo la data dal nuovo mese ottenuto con add o subtract. dall'oggetto prendo il mese in formato "MMMM" che per moment è il mese scritto a parole : january february ecc + uno spazio + l'anno estratto dall'oggetto nel formato "YYYY" che è l'anno scritto con 4 cifre.

  $("#current-month-name").text(title); // stampo la stringa nel h1 che è il titolo. il nome del mese visualizzato

  // rilancio le due funzioni passandogli il nuovo mese da visualizzare. una stampa i li(caselle del calendario) del nuovo mese. l'altra fa la chiamata ajax per farsi mandare dal server le festività del mese e le stampa nel calendario.

  printDayOfMonth(newCurrentMonth); // funzione che stampa nell'html i li che rappresentano le caselle del calendario. gli passo i dati del mese che deve stampare

  ajaxHoliday(newCurrentMonth); // funzione che chiede al server le date e i nomi delle festività del mese corrente (mese selezionato)


}
