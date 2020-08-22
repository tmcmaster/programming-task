const {
    logAnalyser, finaAll, findTop,
    IP, DASH, USER, DATE, URL
}  = require('./log-analyser');

const assert = require('assert');

// test a given set of success and failure sets, and make sure they succeed and fail.
// TODO: this really should be testing that the match values are correct also.
const testRegEx = (group, regEx, success, failure) => {
    const regularExpression = new RegExp(regEx)
    describe(group, () => {
        failure.forEach((test) => {
            it(`should not find a match in "${test}"`, () => {
                const match = regularExpression.exec(test);
                assert(match === null || match.groups[group] === '');
            });
        });
        success.forEach((test) => {
            it(`should find a match in "${test}"`, () => {
                const match = regularExpression.exec(test);
                assert(match !== null && match.groups[group] !== '');
            });
        });
    });
};

// TODO: build out a more complete list of test data
describe("Regular Expressions", () => {
    testRegEx("IP", IP,
        ['1.1.1.1', '0.0.0.0', '20.20.20.20', '111.111.111.111'],
        ['','a.a.a.a','1.1.1.a', '1.1.1', '111.1.1111.123']);

    testRegEx("DASH", DASH,
        ['-', 'a', '-a', 'A-A', 'aaa'],
        [' -', ' a', ' - ', ' a ']);

    testRegEx("USER", USER,
        ['-', 'a', '-a', 'A-A', 'aaa'],
        [' -', ' a', ' - ', ' a ']);

    // Not currently doing anything with date, only that it is surrounded by []
    testRegEx("DATE", DATE,
        ['[aaa]'],
        ['', 'aaa']);

    // Not currently doing anything with date, only that it is surrounded by []
    testRegEx("URL", URL,
        [
            '"GET https://example.com/a/a/a  HTTP/',
            '"GET http://example.com/a/a/a  HTTP/',
            '"GET http://localhost:8080/a/a/a  HTTP/',
            '"GET /a/a/a  HTTP/',
            '"POST https://example.com/a/a/a  HTTP/'
        ],
        ['',
            '"http://example.com'
        ]);
});

describe("LogAnalyser", () => {
    describe("Sample Array", () => {
        it('should not have any errors', (done) => {
            logAnalyser.processArray([
                '177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"',
            ]).then((results) => {
                assert(results.errors.length == 0);
                done();
            }).catch((error) => done(error));
        });
    });

    describe("Sample Log File", () => {
        it('should not have any errors', (done) => {
            logAnalyser.processFile('programming-task-example-data.log').then((results) => {
                assert(results.errors.length == 0);
                done();
            }).catch((error) => done(error));
        });
    });
});

// TODO: Should have some test for the findAll and findTop functions in the LogAnalyser library.
