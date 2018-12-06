const one = require('./1');

const puzzles = new Map([
    ["1-1", one.one],
    ["1-2", one.two],
]);

if (process.argv.length !== 3) {
    console.error("Incorrect arguments");
    process.exit(1);
}

let puzzle = process.argv[2];

let selected = Array.from(puzzles.keys())
    .filter(code => code.startsWith(puzzle))
    .map(code => wrap(code, puzzles.get(code)()));

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
            resolve({code, value})
        });
    }))
}