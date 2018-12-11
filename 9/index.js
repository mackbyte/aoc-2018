const input = require('../utils/input');

function one() {
    return new Promise(resolve => {
        input.readString('nine.txt').then(file => {
            let gameRegex = /(\d+) players; last marble is worth (\d+) points/,
                game = file.match(gameRegex),
                numPlayers = parseInt(game[1]),
                numMarbles = parseInt(game[2]);

            let board = new Board(new Marble(0)),
                scores = new Array(numPlayers).fill(0);

            for (let i = 1; i < numMarbles; i++) {
                scores[i % numPlayers] += board.addMarble(new Marble(i));
            }

            resolve(Math.max(...scores))
        });
    })
}

function two() {
    return new Promise(resolve => {
        input.readString('nine.txt').then(file => {
            let gameRegex = /(\d+) players; last marble is worth (\d+) points/,
                game = file.match(gameRegex),
                numPlayers = parseInt(game[1]),
                numMarbles = parseInt(game[2]);

            let board = new Board(new Marble(0)),
                scores = new Array(numPlayers).fill(0);

            for (let i = 1; i < numMarbles*100; i++) {
                scores[i % numPlayers] += board.addMarble(new Marble(i));
            }

            resolve(Math.max(...scores))
        });
    })
}

class Board {
    constructor(start) {
        this.current = start;
        this.current.clockwise = start;
        this.current.anticlockwise = start;
    }

    addMarble(marble) {
        if (marble.value % 23 === 0) {
            let marbleToRemove = this.current;

            for (let i = 0; i < 7; i++) {
                marbleToRemove = marbleToRemove.anticlockwise;
            }

            marbleToRemove.anticlockwise.clockwise = marbleToRemove.clockwise;
            marbleToRemove.clockwise.anticlockwise = marbleToRemove.anticlockwise;

            this.current = marbleToRemove.clockwise;

            return marble.value + marbleToRemove.value;
        }

        let oneClockwise = this.current.clockwise;
        let twoClockwise = this.current.clockwise.clockwise;

        marble.anticlockwise = oneClockwise;
        marble.clockwise = twoClockwise;

        oneClockwise.clockwise = marble;
        twoClockwise.anticlockwise = marble;

        this.current = marble;
        return 0;
    }
}

class Marble {
    constructor(value) {
        this.value = value;
        this.clockwise = null;
        this.anticlockwise = null;
    }
}

module.exports = {
    one,
    two
};