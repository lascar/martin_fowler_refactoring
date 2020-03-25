module.exports = function (invoice) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData.performances);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData.performances);
    return statementData;
};

let enrichPerformance = function(aPerformance) {
    const result = Object.assign({}, aPerformance)
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
};

let totalAmount = function(performances) {
    return performances
      .reduce((total, p) => total + p.amount, 0);
};

let plays = require( './plays.json');

let playFor = function (aPerformance) {
    return plays[aPerformance.playID];
};

let amountFor = function (aPerformance) {
    let result = 0;

    switch (aPerformance.play.type) {
    case "tragedy":
        result = 4000;
        if (aPerformance.audience > 30) {
            result += 1000 * (aPerformance.audience - 30);
        }
        break;
    case "comedy":
        result = 3000;
        if (aPerformance.audience > 20) {
            result += 1000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
    default:
        throw new Error(`unknown type: ${play.type}`);
    }
    return result;
};

let volumeCreditsFor = function (aPerformance) {
    let volumeCredits = 0;
    volumeCredits += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === aPerformance.play.type) volumeCredits += Math.floor(aPerformance.audience / 5);
    return volumeCredits;
};

let totalVolumeCredits = function(performances) {
    return performances
      .reduce((total, p) => total + p.volumeCredits, 0);
};

