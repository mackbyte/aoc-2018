const input = require('../utils/input');

function one() {
    return new Promise(resolve => {
        createFabric().then(fabric => {
            let count = 0;
            fabric.forEach(row => {
                row.forEach(cell => {
                    if(cell.length > 1) {
                        count++;
                    }
                });
            });
            resolve(count)
        });
    })
}

function two() {
    return new Promise(resolve => {
        createFabric().then(fabric => {
            let possibles = new Set(),
                eliminated = new Set();

            fabric.forEach(row => {
                row.forEach(cell => {
                    if(cell.length > 1) {
                        cell.forEach(id => {
                            eliminated.add(id);
                        });
                    } else if(cell.length === 1) {
                        possibles.add(cell[0]);
                    }
                });
            });

            resolve([...possibles].filter(id => !eliminated.has(id))[0]);
        })
    })
}

function initFabric(width, height) {
    let fabric = [];

    for(let i = 0; i < width; i++) {
        fabric[i] = [];
        for(let j = 0; j < height; j++) {
            fabric[i][j] = []
        }
    }

    return fabric;
}

function createFabric() {
    return new Promise(resolve => {
        const reader = input.reader('three.txt'),
            fabric = initFabric(1000, 1000),
            claimRegex = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/;

        reader.on('line', (line) => {
            let claim = line.match(claimRegex),
                id = parseInt(claim[1]),
                x = parseInt(claim[2]),
                y = parseInt(claim[3]),
                width = parseInt(claim[4]),
                height = parseInt(claim[5]);

            for(let j = y; j < y + height; j++) {
                for(let i = x; i < x + width; i++) {
                    fabric[i][j].push(id);
                }
            }
        });

        reader.on('close', () => {
            resolve(fabric)
        });
    })
}

module.exports = {
    one,
    two
};