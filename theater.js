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

let usd = function(aNumber) {
    return new Intl.NumberFormat("en-US",
    {style: "currency", currency: "USD",
        minimumFractionDigits: 2 }).format(aNumber/100);
};

let totalVolumeCredits = function(performances) {
    let result = 0;
    for (let perf of performances) {
        result += volumeCreditsFor(perf);
    }
    return result;
};

let totalAmount = function(performances) {
    let totalAmount = 0;
    for (let perf of performances) {
        totalAmount += perf.amount;
    }
    return totalAmount;
};

let renderPlainText = function(data, plays) {
    let result = `Statement for ${data.customer}\n`;
    for (let perf of data.performances) {
        // print line for this order
        result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${usd(totalAmount(data.performances))}\n`;
    result += `You earned ${totalVolumeCredits(data.performances)} credits\n`;
    return result;
};

let enrichPerformance = function(aPerformance) {
    const result = Object.assign({}, aPerformance)
    result.play = playFor(result);
    result.amount = amountFor(result);
    return result;
};

exports.statement = function(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    return renderPlainText(statementData, plays);
};
