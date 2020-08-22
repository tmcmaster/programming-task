const fs = require('fs');
const readline = require('readline');

// used https://regex101.com/ to test regular expressions while writing them.
const IP = "(?<IP>[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3})";
const DASH = "(?<DASH>[A-z]*[-]?)";
const USER = "(?<USER>[A-z]*[-]?)";
const DATE = "\\[(?<DATE>.*)\\]";
const URL = '"[A-Z]* (?<SITE>http[s]?://[A-z.-]*)?(?<URL>.*) HTTP\/.*';

// TODO: need to review if RegExp is thread safe, and can be reused.
const REG_EX = new RegExp(`${IP} ${DASH} ${USER} ${DATE} ${URL} .*` , "i");

const finaAll = (counterMap) => Object.keys(counterMap);

const findTop = (counterMap, numberToFind) => Object.entries(counterMap)
    .filter((entry) => entry.length == 2 && entry[0] && entry[1])
    .sort(([aUrl,aCount],[bUrl,bCount]) => (aCount > bCount ? -1 : (aCount >  bCount ? 1 : 0)))
    .filter((entry, index) => index < numberToFind)
    .map((entry) => entry[0]);

const processLine = (line, results) => {
  try {
    const match = REG_EX.exec(line);
    if (match && match.groups) {
      const ip = match.groups.IP;
      const url = match.groups.URL;
      if (!ip) {
        results.errors.push({error: 'IP missing', line: line});
      } else if (!url) {
        results.errors.push({error: 'URL missing', line: line});
      } else {
        results.count.ip[ip] = (ip in results.count.ip ? results.count.ip[ip] + 1 : 1);
        results.count.url[url] = (url in results.count.url ? results.count.url[url] + 1 : 1);
      }
    } else {
      results.errors.push({error: 'no match', line: line});
    }
  } catch (error) {
    results.errors.push({error: error, line: line});
  }
};

const createInitialResults = () => {
  return {
    errors: [],
    count: {
      ip: {},
      url: {}
    }
  }
};

class LogAnalyser {
  processArray(array) {
    return new Promise((resolve, reject) => {
      const results = createInitialResults();
      if (array) {
        array.forEach((line) => {
          processLine(line, results);
        });
        resolve(results);
      } else {
        reject('Valid array was not supplied.');
      }
    });
  }

  processFile(fileName) {
    return new Promise((resolve, reject) => {
      const results = createInitialResults();

      try {
        const logStream = fs.createReadStream(fileName);
        const rl = readline.createInterface(logStream);

        rl.on('line', (line) => processLine(line, results));

        rl.on('close', () => {
          try {
            logStream.close();
          } catch(error) {
            console.warn('Could not close stream: ', error);
          }

          resolve(results)
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // TODO: add class function for reading data from a stream.
}

const logAnalyser = new LogAnalyser();

module.exports = {
  logAnalyser,
  IP, DASH, USER, DATE, URL,
  finaAll, findTop, processLine
};
