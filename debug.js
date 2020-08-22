
// const IP = "(?<IP>^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$)";
// console.log('DEBUG: ', new RegExp(IP).exec('111.1.1111.123 - - '));


const {logAnalyser} = require('./log-analyser');
logAnalyser.processArray([
    '111.1.111.123 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"',
]).then((results) => {
    console.log('Results: ', results);
}).catch((error) => {
    console.log('Error: ', error);
});

// const {processLine} = require('./log-analyser');
//
// const results = { errors: [], count: {ip: {}, url: {} } };
// processLine(
//     '177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"',
//     results
// );
// console.log('Results: ', results);