const input = require('../utils/input');

function one() {
    return new Promise(resolve => {
        const reader = input.reader('six.txt'),
            pointRegex = /(\d+), (\d+)/,
            points = [];

        reader.on('line', line => {
            let point = line.match(pointRegex);
            points.push(new Point(parseInt(point[1]), parseInt(point[2])));
        });

        reader.on('close', () => {
            let minX = Math.min(...points.map(point => point.x)),
                maxX = Math.max(...points.map(point => point.x)),
                minY = Math.min(...points.map(point => point.y)),
                maxY = Math.max(...points.map(point => point.y));

            let grid = new Grid(new Point(minX, minY), new Point(maxX, maxY), points);

            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    let distances = points.map((point, idx) => {
                        return {
                            id: idx,
                            distance: point.distance(new Point(x, y))
                        }
                    });

                    let min = distances.reduce((min, point) => min.distance < point.distance ? min : point).distance,
                        closestPoints = distances.filter(point => point.distance === min);

                    grid.setCell(x, y, closestPoints.length === 1 ? closestPoints[0].id : -1);
                }
            }

            resolve(grid.findGreatestArea())
        });
    })
}

function two() {
    return new Promise(resolve => {
        const reader = input.reader('six.txt'),
            pointRegex = /(\d+), (\d+)/,
            points = [];

        reader.on('line', line => {
            let point = line.match(pointRegex);
            points.push(new Point(parseInt(point[1]), parseInt(point[2])));
        });

        reader.on('close', () => {
            let minX = Math.min(...points.map(point => point.x)),
                maxX = Math.max(...points.map(point => point.x)),
                minY = Math.min(...points.map(point => point.y)),
                maxY = Math.max(...points.map(point => point.y));

            let grid = new Grid(new Point(minX, minY), new Point(maxX, maxY), points);

            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    let distances = points.map((point, idx) => {
                        return {
                            id: idx,
                            distance: point.distance(new Point(x, y))
                        }
                    });

                    let total = distances.reduce((total, point) => total + point.distance, 0);

                    grid.setCell(x, y, total);
                }
            }

            resolve(grid.getBelowThreshold(10000));
        })
    })
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distance(point) {
        return Math.abs(this.x - point.x) + Math.abs(this.y - point.y)
    }

    hash() {
        return `${this.x}${this.y}`
    }
}

class Grid {
    constructor(min, max, points) {
        this.min = min;
        this.max = max;
        this.points = points;
        this.cells = new Map();
        for (let x = min.x; x <= max.x; x++) {
            for (let y = min.y; y <= max.y; y++) {
                this.cells.set(new Point(x, y).hash(), this.basePointIndex(x,y))
            }
        }
    }

    setCell(x, y, id) {
        this.cells.set(new Point(x, y).hash(), id);
    }

    print() {
        for (let y = this.min.y; y <= this.max.y; y++) {
            let row = '';
            for (let x = this.min.x; x <= this.max.x; x++) {
                row += this.getCellCode(x, y)
            }
            console.log(row);
        }
    }

    getCellCode(x, y) {
        if(this.basePointIndex(x,y) > -1) {
            return String.fromCharCode(65 + this.cells.get(new Point(x, y).hash()))
        }

        let code = this.cells.get(new Point(x, y).hash());
        return code > -1 ? `${code}` : '.'
    }

    basePointIndex(x, y) {
        return this.points.findIndex(point => point.x === x && point.y === y)
    }

    getExtremes() {
        let extremes = new Set();

        for(let x = this.min.x; x < this.max.x; x++) {
            extremes.add(this.cells.get(new Point(x, this.min.y).hash()))
        }

        for(let x = this.min.x; x < this.max.x; x++) {
            extremes.add(this.cells.get(new Point(x, this.max.y).hash()))
        }

        for(let y = this.min.y; y < this.max.y; y++) {
            extremes.add(this.cells.get(new Point(this.min.x, y).hash()))
        }

        for(let y = this.min.y; y < this.max.y; y++) {
            extremes.add(this.cells.get(new Point(this.max.x, y).hash()))
        }

        extremes.delete(-1);

        return extremes;
    }

    getTotals() {
        let totals = new Map();
        for (let y = this.min.y; y <= this.max.y; y++) {
            for (let x = this.min.x; x <= this.max.x; x++) {
                let id = this.cells.get(new Point(x, y).hash());
                if( id > -1) {
                    totals.set(id, totals.get(id) + 1 || 1)
                }
            }
        }
        return totals;
    }

    findGreatestArea() {
        let extremes = this.getExtremes(),
            totals = this.getTotals();

        let maxId = Array.from(this.getTotals().keys())
            .filter(id => !extremes.has(id))
            .reduce((max, id) => totals.get(id) > totals.get(max) ? id : max);

        return totals.get(maxId);
    }

    getBelowThreshold(threshold) {
        let regionSize = 0;
        for (let y = this.min.y; y <= this.max.y; y++) {
            for (let x = this.min.x; x <= this.max.x; x++) {
                let totalDistance = this.cells.get(new Point(x, y).hash());
                if( totalDistance < threshold) {
                    regionSize++
                }
            }
        }
        return regionSize
    }
}

module.exports = {
    one,
    two
};