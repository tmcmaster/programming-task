const { logAnalyser, finaAll, findTop, }  = require('./log-analyser');

if (process.argv.length > 2) {
    const fileName = process.argv[2];
    logAnalyser.processFile(fileName)
        .then((results) => {
            if (results.errors.length > 0) {
                console.warn('Some line could not be processed: ', results.errors);
            }
            console.log('Unique IP List: ', finaAll(results.count.ip).join(', '));
            console.log('     Top 3 IPs: ', findTop(results.count.ip, 3).join(', '));
            console.log('    Top 3 URLs: ', findTop(results.count.url, 3).join(', '));
        })
        .catch((error) => console.error('There was an issue processing file: ', error));
} else {
    console.log('node main.js [FILENAME]');
}

// TODO: support reading data stream from STDIN if no file is supplied.