const firstName = "Andrus";
const lastName = "Rinde";
const dateValue = require("./date_et");
const timeValue = require("./time_et");
console.log("Programmi autor on: " + firstName + " " + lastName);

//let dateETNow = dateValue.dateETformatted();

//console.log("Täna on: " + dateETNow);
console.log("Täna on " + dateValue.dateETformatted());
console.log("Kell on " + timeValue.timeETformatted());