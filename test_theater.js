var assert = require('assert');
let invoices = require( './invoices.json');
let theater = require ('./theater.js');
let expected = `Statement for BigCo\n  Hamlet: $290.00 (55 seats)\n  As You Like It: $220.00 (35 seats)\n  Othello: $140.00 (40 seats)\nAmount owed is $650.00\nYou earned 47 credits\n`
let result = theater.statement(invoices[0]);
try {
    assert.equal(expected, result);
    console.log('Passed');
} catch (error) {
    console.error('Failed');
    console.error(error);
}

