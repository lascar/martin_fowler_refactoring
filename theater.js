let createStatementData = require('./createStatementData.js');

let usd = function(aNumber) {
    return new Intl.NumberFormat("en-US",
    {style: "currency", currency: "USD",
        minimumFractionDigits: 2 }).format(aNumber/100);
};

let renderPlainText = function(data) {
    let result = `Statement for ${data.customer}\n`;
    for (let perf of data.performances) {
        // print line for this order
        result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${usd(data.totalAmount)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;
    return result;
};

exports.statement = function(invoice) {
    return renderPlainText(createStatementData(invoice));
};
