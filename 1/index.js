const input = require('../utils/input');

function one() {
    return new Promise(resolve => {
        const reader = input.reader('one.txt');

        let total = 0;

        reader.on('line', (line) => {
            total += eval(line);
        });

        reader.on('close', () => {
            resolve(total)
        });
    });
}

function two() {
    return new Promise(resolve => {
        let freqs = new Set();

        input.readAll('one.txt').then(lines => {
            resolve(findFreq(freqs, lines))
        });
    });
}

function findFreq(freqs, lines, total = 0) {
    let found = false;

    for (let line of lines) {
        total += eval(line);

        if (freqs.has(total)) {
            found = true;
            break
        }

        freqs.add(total);
    }

    if (!found) {
        return findFreq(freqs, lines, total)
    }

    return total
}

module.exports = {
    one,
    two
};