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
            simulation.evolveFor(5000);
            const elapsedTime = new Date(new Date()-startTime);
            console.log(`Elapsed time ${elapsedTime.getSeconds()}.${elapsedTime.getMilliseconds()}s`);
            resolve(simulation.sumPotNumbers());
        })
    })
}

function two() {
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
            resolve(simulation.sumPotNumbers());
        })
    })
}

class Simulation {
    constructor(state) {
        this.pots = new Pots();
        this.pots.init(state);
        this.rules = []
    }

    addRule(rule) {
        this.rules.push(rule)
    }

    evolveFor(iterations) {
        for (let i = 0; i < iterations; i++) {
            this.evolve();
            // if(i % (iterations/100) === 0) {
            //     console.log(`Completed ${i / (iterations/100)}%`)
            // }
        }
    }

    evolve() {
        let newPots = new Pots();
        let current = this.pots.head;

        let matching = this.rules.find(rule => rule.matches(current.getNeighbourPlants())),
        firstPot = matching ? new Pot(matching.action) : new Pot('.');
        newPots.addFirstPot(current.number, firstPot);
        current = current.next;

        while(current.next) {
            let matching = this.rules.find(rule => rule.matches(current.getNeighbourPlants())),
                pot = matching ? new Pot(matching.action) : new Pot('.');
            newPots.addPotToEnd(pot);
            current = current.next;
        }
        newPots.addPotToEnd(new Pot(current.plant));
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
    constructor() {
        this.head = null;
        this.tail = null;
    }

    init(state) {
        let initialPots = state.split('');

        this.addFirstPot(0,  new Pot(initialPots.shift()));

        initialPots.forEach(plant => {
            this.addPotToEnd(new Pot(plant))
        });

        for(let i = 0; i < 2; i++) {
            this.addPotToStart(new Pot('.'));
            this.addPotToEnd(new Pot('.'));
        }
    }

    addFirstPot(number, pot) {
        pot.number = number;
        this.head = pot;
        this.tail = pot;
    }

    addPotToEnd(pot) {
        this.tail.next = pot;
        pot.previous = this.tail;
        pot.number = this.tail.number+1;
        this.tail = pot;
    }

    addPotToStart(pot) {
        this.head.previous = pot;
        pot.next = this.head;
        pot.number = this.head.number-1;
        this.head = pot;
    }

    pad() {
        let padHead = [this.head, this.head.next].filter(pot => pot.plant === '#').length,
            padTail = [this.tail, this.tail.previous].filter(pot => pot.plant === '#').length;

        for(let i = 0; i < padHead; i++) {
            this.addPotToStart(new Pot('.'))
        }

        for(let i = 0; i < padTail; i++) {
            this.addPotToEnd(new Pot('.'))
        }
    }

    sumPotNumbers() {
        let current = this.head,
            total = 0;
        while(current.next) {
            total += current.plant === '#' ? current.number : 0;
            current = current.next;
        }
        total += current.plant === '#' ? current.number : 0;
        return total
    }

    print() {
        let current = this.head,
            line = '';
        while(current.next) {
            line += current.plant;
            current = current.next;
        }
        line += current.plant;
        console.log(line);
    }
}

class Pot {
    constructor(plant) {
        this.number = -1;
        this.plant = plant;
        this.next = null;
        this.previous = null;
    }

    getNeighbourPlants() {
        let emptyPot = new Pot('.'),
        left = this.previous || emptyPot,
            leftTwo = left.previous || emptyPot,
            right = this.next || emptyPot,
            rightTwo = right.next || emptyPot;

        return [leftTwo, left, this, right, rightTwo].reduce((row, pot) => row + pot.plant, '');
    }
}

module.exports = {
    one,
    two
};