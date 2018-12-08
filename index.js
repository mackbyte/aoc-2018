const one = require('./1'),
    two = require('./2'),
    three = require('./3'),
    four = require('./4'),
    five = require('./5');

const puzzles = new Map([
    ["1-1", one.one],
    ["1-2", one.two],
    ["2-1", two.one],
    ["2-2", two.two],
    ["3-1", three.one],
    ["3-2", three.two],
    ["4-1", four.one],
    ["4-2", four.two],
    ["5-1", five.one],
    ["5-2", five.two]
]);

if (process.argv.length !== 3) {
    console.error("Incorrect arguments");
    process.exit(1);
}

let puzzle = process.argv[2];

let selected = Array.from(puzzles.keys())
    .filter(code => code.startsWith(puzzle))
    .map(code => wrap(code, puzzles.get(code)()));

if(selected.length === 0) {
    console.log(`Did not match any puzzles starting with '${puzzle}'`);
    process.exit(2)
}

Promise.all(selected).then(results => {
    results.forEach(result => {
        console.log(`Running ${result.code} returned ${result.value}`);
    });
    console.log('Completed');
    process.exit(0);
});

function wrap(code, puzzle) {
    return new Promise((resolve => {
        puzzle.then(value => {
            resolve({ code, value })
        });
    }))
}