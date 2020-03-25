var assert = require('assert');
let invoices = require( './invoices.json');
let theater = require ('./theater.js');
let expected = `Statement for BigCo\n  Hamlet: $290.00 (55 seats)\n  \
As You Like It: $220.00 (35 seats)\n  Othello: $140.00 (40 seats)\n\
Amount owed is $650.00\nYou earned 47 credits\n`
let result = theater.statement(invoices[0]);
try {
    assert.equal(expected, result);
    console.log('Passed');
} catch (error) {
    console.error('Failed');
    console.error(error);
};
let expected_html = `<h1>Statement for BigCo</h1>\
    <table>\
    <tr><th>play</th><th>seats</th><th>cost</th></tr>\
    <tr><td>Hamlet</td><td>55</td><td>$290.00</td></tr>\
    <tr><td>As You Like It</td><td>35</td><td>$220.00</td></tr>\
    <tr><td>Othello</td><td>40</td><td>$140.00</td></tr>\
    </table>\
    <p>Amount owed is <em>$650.00</em></p>\
    <p>You earned <em>47</em> credits</p>`
let result_html = theater.htmlStatement(invoices[0]);
try {
    assert.equal(expected_html.replace(/\s+/g, "").replace(/\/n/g, ""),
        result_html.replace(/\s+/g, "").replace(/\/n/g, ""));
    console.log('Passed');
} catch (error) {
    console.error('Failed');
    console.error(error);
};
