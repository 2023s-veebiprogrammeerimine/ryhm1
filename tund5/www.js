const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const querystring = require('querystring');
const datetimeValue = require("./datetime_et");

const pageHead = '<!DOCTYPE html>\n<html>\n<head>\n\t<meta charset="utf-8">\n\t<title>Andrus Rinde, veebiprogrammeerimine 2023</title>\n</head>\n<body>';
const pageBanner = '\n\t<img src="banner.png" alt="Kursuse bänner">';
const pageBody = '\n\t<h1>Andrus Rinde</h1>\n\t<p>See veebileht on valminud <a href="https://www.tlu.ee" target="_blank">TLÜ</a> Digitehnoloogiate instituudi informaatia eriala õppetöö raames.</p>';
const pageFoot = '\n\t<hr>\n</body>\n</html>';

http.createServer(function(req, res){
	let currentURL = url.parse(req.url, true);
	//console.log(currentURL);
	if(req.method === 'POST'){
		
		collectRequestData(req, result => {
            console.log(result);
			//kirjutame andmeid tekstifaili
			fs.open('public/log.txt', 'a', (err, file)=>{
				if(err){
					throw err;
				}
				else {
					fs.appendFile('public/log.txt', result.firstNameInput + ';', (err)=>{
						if(err){
							throw err;
						}
						else {
							console.log('faili kirjutati!');
						}
					});
				}
				/* fs.close(file, (err)=>{
					if(err){
						throw err;
					}
				}); */
			});
			
			res.end(result.firstNameInput);
			//res.end('Tuligi POST!');
		});
	}
	else if (currentURL.pathname === "/"){
		res.writeHead(200, {"Content-type": "text/html"});
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		res.write('\n\t <p>Lehe avamise hetkel oli:' + datetimeValue.dateETformatted() + ' kell ' + datetimeValue.timeETformatted() + '</p>');
		res.write('\n\t<hr>\n\t<p><a href="addname">Lisa oma nimi</a>!</p>');
		res.write('\n\t <p>Semestri <a href="semesterprogress">edenemine</a>.</p>');
		res.write('\n\t <p>TLÜ <a href="tluphoto">foto</a>.</p>');
		res.write(pageFoot);
		//console.log("Keegi vaatab!");
		return res.end();
	}
	
	else if (currentURL.pathname === "/addname"){
		res.writeHead(200, {"Content-type": "text/html"});
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		res.write('\n\t<hr>\n\t<h2>Lisa palun oma nimi</h2>');
		res.write('\n\t<form method="POST">\n\t\t<label for="firstNameInput">Eesnimi: </label>\n\t\t<input type="text" name="firstNameInput" id="firstNameInput" placeholder="Sinu eesnimi ...">\n\t\t<br>\n\t\t<label for="lastNameInput">Perekonnanimi: </label>\n\t\t<input type="text" name="lastNameInput" id="lastNameInput" placeholder="Sinu perekonnanimi ...">\n\t\t<br>\n\t\t<input type="submit" name="nameSubmit" value="Salvesta">\n\t</form>');
		res.write('\n\t <p><a href="/">Tagasi avalehele</a>!</p>');
		res.write(pageFoot);
		return res.end();
	}
	
	else if (currentURL.pathname === "/semesterprogress"){ 
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		res.write('\n\t<hr>');
		res.write(semesterInfo());
		res.write('\n\t <p><a href="/">Tagasi avalehele</a>!</p>');
		res.write(pageFoot);
		//et see kõik valmiks ja ära saadetaks
		return res.end();
	}

	else if (currentURL.pathname === "/tluphoto"){
		//loeme kataloogist fotode nimekirja ja loosime ühe pildi
		let htmlOutput = '\n\t<p>Pilti ei saa näidata!</p>';
		let listOutput = '';
		fs.readdir('public/tluphotos', (err, fileList)=>{
			if(err) {
				throw err;
				tluPhotoPage(res, htmlOutput, listOutput);
			}
			else {
				//console.log(fileList);
				let photoNum = Math.floor(Math.random() * fileList.length);
				htmlOutput = '\n\t<img src="' + fileList[photoNum] + '" alt="TLÜ pilt">';
				//console.log(htmlOutput);
				listOutput = '\n\t<ul>';
				for (fileName of fileList){
					listOutput += '\n\t\t<li>' + fileName + '</li>';
				}
				listOutput += '\n\t</ul>';
				//console.log(listOutput);
				tluPhotoPage(res, htmlOutput, listOutput);
			}
		});
	}

	else if (currentURL.pathname === "/banner.png"){
		console.log("Tahame pilti!");
		let bannerPath = path.join(__dirname, "public", "banner");
		//console.log(bannerPath + currentURL.pathname);
		fs.readFile(bannerPath + currentURL.pathname, (err, data)=>{
			if (err) {
				throw err;
			}
			else {
				console.log("Tuli ära!");
				res.writeHead(200, {"Content-type": "image/png"});
				res.end(data);
			}
		});
	}

	//else if (currentURL.pathname === "/tlu_42.jpg"){
	else if (path.extname(currentURL.pathname) === ".jpg"){
		console.log(path.extname(currentURL.pathname));
		//let filePath = path.join(__dirname, "public", "tluphotos/tlu_42.jpg");
		let filePath = path.join(__dirname, "public", "tluphotos");
		fs.readFile(filePath + currentURL.pathname, (err, data)=>{
			if(err){
				throw err;
			}
			else {
				res.writeHead(200, {"Content-Type": "image/jpeg"});
				res.end(data);
			}
		});
	} 

	else {
		res.end("ERROR 404");
	}
	//valmis, saada ära
}).listen(5100);

function semesterInfo(){
	let htmlOutput = '<p>Info puudub!</p>';
	const semesterBegin = new Date("08/28/2023");
	//const semesterBegin = new Date("10/05/2023");
	const semesterEnd = new Date("01/28/2024");
	//const semesterEnd = new Date("10/01/2023");
	const today = new Date();
	if(today < semesterBegin){
		htmlOutput = '<p>2023/2024 õppeaasta sügissemester pole veel alanud!</p>';
	}
	else if (today > semesterEnd){
		htmlOutput = '<p>2023/2024 õppeaasta sügissemester on juba möödas!</p>';
	}
	else {
		const semesterDuration = Math.floor((semesterEnd.getTime() - semesterBegin.getTime()) / (1000 * 60 * 60 * 24));
		const semesterLastedFor = Math.floor((today.getTime() - semesterBegin.getTime()) / (1000 * 60 * 60 * 24));
		htmlOutput = '<p>2023/2024 õppeaasta sügissemester on kestnud juba ' + semesterLastedFor + ' päeva!</p>';
		htmlOutput += '\n\t <meter min="0" max="' + semesterDuration + '" value="' + semesterLastedFor + '"></meter>';
	}
	return '\n\t' + htmlOutput;
}

function tluPhotoPage(res, htmlOut, listOutput){
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(pageHead);
	res.write(pageBanner);
	res.write(pageBody);
	res.write('\n\t<hr>');
	res.write(htmlOut);
	if(listOutput != ''){
		res.write(listOutput);
	}
	//res.write('\n\t<img src="tlu_42.jpg" alt="TLÜ foto">');
	res.write('\n\t <p><a href="/">Tagasi avalehele</a>!</p>');
	res.write(pageFoot);
	//et see kõik valmiks ja ära saadetaks
	return res.end();
}

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let receivedData = '';
        request.on('data', chunk => {
            receivedData += chunk.toString();
        });
        request.on('end', () => {
            callback(querystring.decode(receivedData));
        });
    }
    else {
        callback(null);
    }
}
//rinde    5100

