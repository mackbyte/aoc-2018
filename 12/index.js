const input = require('../utils/input');

function one() {
    const startTime = new Date();
    return new Promise(resolve => {
        const reader = input.reader('twelve.txt');
        let simulation;

        reader.on('line', line => {
            if (!simulation) {
                simulation = new Simulation(line.substring(15));
                return;
            }

            simulation.addRule(new Rule(line))
        });

        reader.on('close', () => {
            simulation.evolveFor(20);
            const elapsedTime = new Date(new Date() - startTime);
            console.log(`Elapsed time ${ elapsedTime.getSeconds() }.${ elapsedTime.getMilliseconds() }s`);
            resolve(simulation.sumPotNumbers());
        })
    })
}

function two() {
    const startTime = new Date();
    return new Promise(resolve => {
        const reader = input.reader('twelve.txt');
        let simulation;

        reader.on('line', line => {
            if (!simulation) {
                simulation = new Simulation(line.substring(15));
                return;
            }

            simulation.addRule(new Rule(line))
        });

        reader.on('close', () => {
            simulation.evolveFor(50000000000);
            const elapsedTime = new Date(new Date() - startTime);
            console.log(`Elapsed time ${ elapsedTime.getSeconds() }.${ elapsedTime.getMilliseconds() }s`);
            resolve(simulation.sumPotNumbers());
        })
    })
}

class Simulation {
    constructor(state) {
        this.pots = new Pots(0);
        this.pots.init(state);
        this.rules = []
    }

    addRule(rule) {
        this.rules.push(rule)
    }

    evolveFor(iterations) {
        let percent = iterations / 100;

        for (let i = 0; i < iterations; i++) {
            this.evolve();
            if (i % percent === 0) {
                console.log(`Completed ${ i / percent }%`)
            }
        }
    }

    evolve() {
        let newPots = new Pots(this.pots.firstNumber);
        newPots.pots = '..';

        let selection, matched;
        for (let i = 2; i < this.pots.pots.length - 3; i++) {
            selection = this.pots.pots.slice(i-2, i+3);
            matched = this.rules.find(rule => rule.matches(selection));
            newPots.pots += matched ? matched.action : '.';
        }

        newPots.pots += '..';
        newPots.pad();
        this.pots = newPots;
    }

    sumPotNumbers() {
        return this.pots.sumPotNumbers();
    }

    print() {
        this.pots.print();
    }
}

class Rule {
    constructor(text) {
        const ruleRegex = /(.{5}) => (.)/,
            rule = text.match(ruleRegex);

        this.toMatch = rule[1];
        this.action = rule[2];
    }

    matches(pots) {
        return this.toMatch === pots
    }
}


class Pots {
    constructor(firstNumber) {
        this.pots = "";
        this.firstNumber = firstNumber;
    }

    init(state) {
        this.pots = `....${ state }....`;
        this.firstNumber = -4;
    }

    pad() {
        let padStartWith = '',
            padEndWith = '';

        for (let i = 2; i <= 4; i++) {
            padStartWith += this.pots.charAt(i) === '#' ? '.' : ''
        }

        for (let i = this.pots.length - 3; i >= this.pots.length - 5; i--) {
            padEndWith += this.pots.charAt(i) === '#' ? '.' : ''
        }

        this.pots = padStartWith + this.pots;
        this.pots += padEndWith;
        this.firstNumber -= padStartWith.length;
    }

    sumPotNumbers() {
        let current = this.firstNumber,
            total = 0;

        for (let i = 0; i < this.pots.length; i++) {
            total += this.pots.charAt(i) === '#' ? current : 0;
            current++;
        }

        return total
    }

    print() {
        console.log(this.pots);
    }
}

module.exports = {
    one,
    two
};