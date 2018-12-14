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
        this.pots = new Pots(state);
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
        let newPots = this.pots.copy();

        this.rules.forEach(rule => {
            this.pots.locations(rule.pattern)
                .forEach(location => {
                    newPots.setPot(location + 2, rule.action)
                });
        });

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

        this.pattern = rule[1];
        this.action = rule[2]
    }
}

class Pots {
    constructor(state) {
        this.pots = state;
        this.firstNumber = 0;
        this.pad();
    }

    copy() {
        let pots = new Pots('.'.repeat(this.pots.length));
        pots.firstNumber = this.firstNumber;
        return pots;
    }

    setPot(index, value) {
        this.pots = this.pots.substring(0, index) + value + this.pots.substring(index + 1);
    }

    locations(rule) {
        let locations = [],
            i = -1;

        while ( (i = this.pots.indexOf(rule, i + 1)) >= 0 ) {
            locations.push(i)
        }

        return locations;
    }

    pad() {
        let firstPlant = this.pots.indexOf('#');
        if(firstPlant !== -1 && firstPlant < 4) {
            this.pots = '.'.repeat(4-firstPlant) + this.pots;
            this.firstNumber -= 4-firstPlant;
        }

        let lastPlant = this.pots.lastIndexOf('#');
        if(lastPlant !== -1 && lastPlant > this.pots.length-5) {
            this.pots += '.'.repeat(5-(this.pots.length-lastPlant))
        }
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