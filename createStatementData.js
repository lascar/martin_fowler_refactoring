class PerformanceCalculator {
    constructor (aPerformance, play) {
        this.performance = aPerformance;
        this.play = play;
    }
    
    get amount () {
        throw new Error(`subclass responsability`);
    };

    get volumeCredits() {
        let result = 0;
        result += Math.max(this.performance.audience - 30, 0);
        if ("comedy" === this.play.type) result += Math.floor(this.performance.audience / 5);
        return result;
    };
};

class TragedyCalculator extends PerformanceCalculator {
    get amount () {
        let result = 4000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
};

class ComedyCalculator extends PerformanceCalculator {
    get amount () {
        let result = 3000;

        if (this.performance.audience > 20) {
            result += 1000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    };
};

let createPerformanceCalculator = function (aPerformance, aPlay) {
    switch(aPlay.type) {
        case "tragedy":
            return new TragedyCalculator(aPerformance, aPlay);
            break;
        case "comedy":
            return new ComedyCalculator(aPerformance, aPlay);
            break;
        default:
            throw new Error(`unknown type: ${aPlay.type}`);
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
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
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

