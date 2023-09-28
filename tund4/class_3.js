const firstName = "Andrus";
const lastName = "Rinde";
const datetimeValue = require("./datetime_et");
const fs = require("fs");
//let folkWisdom = "";

fs.readFile("txtfiles/vanasonad.txt", "utf8", (err, data)=>{
	if(err){
		console.log(err);
	}
	else {
		//console.log(data);
		//folkWisdom = data;
		onScreen(data);
	}
});//readFile lõppeb

const onScreen = function(folkWisdom){
	console.log("Programmi autor on: " + firstName + " " + lastName);
	console.log("Täna on " + datetimeValue.dateETformatted());
	//console.log(folkWisdom);
	let folkWisdoms = folkWisdom.split(";");
	//console.log(folkWisdoms);
	//console.log(folkWisdoms.length);
	//console.log("Tänane tarkus: " + folkWisdoms[Math.floor(Math.random() * folkWisdoms.length)]);
	//kõige tavalisem for tsükkel (loop)
	for (let i = 0; i < folkWisdoms.length; i ++){
		console.log("Vanasõna nr " + (i + 1) + ': "' + folkWisdoms[i] + '"');
	}
	console.log("Kell on " + datetimeValue.timeETformatted());
	console.log("Praegu on " + datetimeValue.timeOfDayET() + ".");
	//console.log(datetimeValue.monthsET);
}


//let dateETNow = dateValue.dateETformatted();
//console.log("Täna on: " + dateETNow);

