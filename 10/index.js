const input = require('../utils/input');

function one () {
    return new Promise(resolve => {
        const reader = input.reader('ten.txt');

        let sky = new Sky();

        reader.on('line', line => {
            let starRegex = /position=<([- ]?\d+), ([- ]?\d+)> velocity=<([- ]?\d+), ([- ]?\d+)>/,
                star = line.match(starRegex);
                sky.addStar(new Star(parseInt(star[1]), parseInt(star[2]), parseInt(star[3]), parseInt(star[4])))
        });

        reader.on('close', () => {
            while(!sky.possibleMessage()) {
                sky.moveAll();
            }

            sky.print();
            resolve('Done')
        })
    })
}

function two() {
    return new Promise(resolve => {
        const reader = input.reader('ten.txt');

        let sky = new Sky();

        reader.on('line', line => {
            let starRegex = /position=<([- ]?\d+), ([- ]?\d+)> velocity=<([- ]?\d+), ([- ]?\d+)>/,
                star = line.match(starRegex);
            sky.addStar(new Star(parseInt(star[1]), parseInt(star[2]), parseInt(star[3]), parseInt(star[4])))
        });

        reader.on('close', () => {
            let i = 0;
            while(!sky.possibleMessage()) {
                sky.moveAll();
                i++;
            }

            resolve(i)
        })
    })
}

class Star {
    constructor(x, y, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    nextTo(star) {
        return Math.abs((this.x - star.x) + (this.y - star.y)) < 2
    }
}

class Sky {
    constructor() {
        this.stars = []
    }

    addStar(star) {
        this.stars.push(star)
    }

    moveAll() {
        for(let star of this.stars) {
            star.move()
        }
    }

    possibleMessage() {
        return this.stars.every(star => {
            return this.stars.some(other => {
                return other !== star && other.nextTo(star)
            });
        })
    }

    print() {
        let minX = this.stars.reduce((min, star) => star.x < min ? star.x : min, this.stars[0].x),
        maxX = this.stars.reduce((max, star) => star.x > max ? star.x : max, this.stars[0].x),
        minY = this.stars.reduce((min, star) => star.y < min ? star.y : min, this.stars[0].y),
        maxY = this.stars.reduce((max, star) => star.y > max ? star.y : max, this.stars[0].y);

        console.log();
        for(let y = minY; y <= maxY; y++) {
            let row = '';
            for(let x = minX; x <= maxX; x++) {
                row += this.stars.some(star => star.x === x && star.y === y) ? '#' : '.'
            }
            console.log(row)
        }
        console.log()
    }
}

module.exports = {
    one,
    two
};