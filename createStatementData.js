class PerformanceCalculator {
    constructor (aPerformance, play) {
        this.performance = aPerformance;
        this.play = play;
    }
    
    get amount () {
        let result = 0;

        switch (this.play.type) {
        case "tragedy":
            result = 4000;
            if (this.performance.audience > 30) {
                result += 1000 * (this.performance.audience - 30);
            }
            break;
        case "comedy":
            result = 3000;
            if (this.performance.audience > 20) {
                result += 1000 + 500 * (this.performance.audience - 20);
            }
            result += 300 * this.performance.audience;
            break;
        default:
            throw new Error(`unknown type: ${this.play.type}`);
        }
        return result;
    };

    get volumeCredits() {
        let result = 0;
        result += Math.max(this.performance.audience - 30, 0);
        if ("comedy" === this.play.type) result += Math.floor(this.performance.audience / 5);
        return result;
    };
};

module.exports = function (invoice) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData.performances);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData.performances);
    return statementData;
};

let enrichPerformance = function(aPerformance) {
    const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance)
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
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

let totalVolumeCredits = function(performances) {
    return performances
      .reduce((total, p) => total + p.volumeCredits, 0);
};

