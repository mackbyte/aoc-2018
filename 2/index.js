const input = require('../utils/input');

function one() {
    return new Promise(resolve => {
        const reader = input.reader('two.txt');

        let twos = 0,
            threes = 0;

        reader.on('line', (line) => {
            let curTwo = twos,
                curThrees = threes,
                letterCount = new Map();

            line.split("").forEach(letter => {
                letterCount.set(letter, letterCount.get(letter) + 1 || 1)
            });

            for (let lc of letterCount.entries()) {
                if (lc[1] === 2 && curTwo === twos) {
                    twos++
                } else if (lc[1] === 3 && curThrees === threes) {
                    threes++
                }
            }
        });

        reader.on('close', () => {
            resolve(twos * threes)
        });
    })
}

function two() {
    return new Promise(resolve => {
        input.readAll('two.txt').then(lines => {
            resolve(findMatch(lines))
        })
    })
}

function findMatch(codes) {
    for (let i = 0; i < codes.length; i++) {
        for (let j = i + 1; j < codes.length; j++) {
            let idx = findIndexOfDifferentChar(codes[i], codes[j]);
            if (idx >= 0) {
                return codes[i].slice(0, idx) + codes[i].slice(idx+1, codes[i].length);
            }
        }
    }
}

function findIndexOfDifferentChar(first, second) {
    let firstLetters = first.split(''),
        secondLetters = second.split(''),
        diff = 0,
        idx = -1;

    for (let i = 0; i < firstLetters.length; i++) {
        if(firstLetters[i] !== secondLetters[i]) {
            diff++;
            idx = i;
        }
    }

    if (diff === 1) {
        return idx
    }

    return -1;
}

module.exports = {
    one,
    two
};