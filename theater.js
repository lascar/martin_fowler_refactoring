let plays = require( './plays.json');

let playFor = function (aPerformance) {
    return plays[aPerformance.playID];
};

let amountFor = function (aPerformance) {
    let result = 0;

    switch (playFor(aPerformance).type) {
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
    if ("comedy" === playFor(aPerformance).type) volumeCredits += Math.floor(aPerformance.audience / 5);
    return volumeCredits;
};

let usd = function(aNumber) {
    return new Intl.NumberFormat("en-US",
    {style: "currency", currency: "USD",
        minimumFractionDigits: 2 }).format(aNumber/100);
};

let totalVolumeCredits = function(invoice) {
    let result = 0;
    for (let perf of invoice.performances) {
        result += volumeCreditsFor(perf);
    }
    return result;
};

let totalAmount = function(invoice) {
    let totalAmount = 0;
    for (let perf of invoice.performances) {
        totalAmount += amountFor(perf);
    }
    return totalAmount;
};

exports.statement = function(invoice, plays) {
    let result = `Statement for ${invoice.customer}\n`;
    for (let perf of invoice.performances) {
        // print line for this order
        result += `  ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${usd(totalAmount(invoice))}\n`;
    result += `You earned ${totalVolumeCredits(invoice)} credits\n`;
    return result;
};
