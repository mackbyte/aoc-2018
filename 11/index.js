const input = require('../utils/input');

function one() {
    return new Promise(resolve => {
        input.readString('eleven.txt').then(num => {
            let serialNumber = parseInt(num),
                grid = initGrid(300, serialNumber),
                coords = findMaxPowerCoords(grid,3, 3);

            resolve(`${coords.x},${coords.y}`)
        });
    })
}

function two() {
    return new Promise(resolve => {
        input.readString('eleven.txt').then(num => {
            let serialNumber = parseInt(num),
                grid = initGrid(300, serialNumber),
                coords = findMaxPowerCoords(grid, 1, 300);

            resolve(`${coords.x},${coords.y},${coords.size}`)
        });
    })
}

function initGrid(size, serialNumber) {
    let grid = [];
    for (let x = 1; x <= size; x++) {
        grid[x] = [];
        for (let y = 1; y <= size; y++) {
            grid[x][y] = Math.floor(((((x + 10) * y) + serialNumber) * (x + 10) % 1000) / 100) - 5;
        }
    }
    return grid;
}

function findMaxPowerCoords(grid, minSize, maxSize) {
    let max = 0,
        pX = 0,
        pY = 0,
        bestSize = 0;

    for(let size = minSize; size <= maxSize; size++) {
        for (let x = 1; x <= grid.length - (size+1); x++) {
            for (let y = 1; y <= grid[x].length - (size+1); y++) {
                let power = 0;
                for (let i = x; i <= x + size; i++) {
                    for (let j = y; j <= y + size; j++) {
                        power += grid[i][j]
                    }
                }

                if (power > max) {
                    max = power;
                    pX = x;
                    pY = y;
                    bestSize = size+1;
                }
            }
        }
    }

    return { x: pX, y: pY, size: bestSize }
}

module.exports = {
    one,
    two
};