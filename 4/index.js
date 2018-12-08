const input = require('../utils/input');

function one() {
    return new Promise(resolve => {
        parseGuardTimings().then(guardTimings => {
            let selectedGuard = -1,
                max = -1;
            for (let guardTiming of guardTimings) {
                let minutesSlept = guardTiming[1].reduce((a, b) => a + b, 0);
                if (minutesSlept > max) {
                    max = minutesSlept;
                    selectedGuard = guardTiming[0];
                }
            }

            let sleptMinutes = guardTimings.get(selectedGuard);
            resolve(selectedGuard * sleptMinutes.indexOf(Math.max(...sleptMinutes)))
        })
    })
}

function two() {
    return new Promise(resolve => {
        parseGuardTimings().then(guardTimings => {
            let selectedGuard = -1,
                max = -1;
            for (let guardTiming of guardTimings) {
                let mostSlept = Math.max(...guardTiming[1]);
                if (mostSlept > max) {
                    max = mostSlept;
                    selectedGuard = guardTiming[0];
                }
            }

            let sleptMinutes = guardTimings.get(selectedGuard);
            resolve(selectedGuard * sleptMinutes.indexOf(Math.max(...sleptMinutes)))
        })
    })
}

function initGuardTimings() {
    let timings = [];
    for (let i = 0; i < 60; i++) {
        timings.push(0)
    }
    return timings;
}

function parseGuardTimings() {
    return new Promise(resolve => {
        const reader = input.reader('four.txt'),
            logRegex = /\[(.+)] (.+)/,
            logs = [];

        reader.on('line', (line) => {
            let log = line.match(logRegex);
            logs.push(new Log(new Date(log[1]), new Action(log[2])));
        });

        reader.on('close', () => {
            logs.sort((a, b) => a.date - b.date);

            let guardTimings = new Map(),
                guardId = -1,
                startTime = -1;

            logs.forEach(log => {
                switch (log.action.actionType) {
                    case ActionTypes.BEGIN:
                        guardId = log.action.parseId();
                        startTime = log.date.getHours() !== 0 ? 0 : log.date.getMinutes();
                        if (!guardTimings.has(guardId)) {
                            guardTimings.set(guardId, initGuardTimings());
                        }
                        break;
                    case ActionTypes.SLEEP:
                        startTime = log.date.getMinutes();
                        break;
                    case ActionTypes.WAKE:
                        for (let i = startTime; i < log.date.getMinutes(); i++) {
                            guardTimings.get(guardId)[i] = guardTimings.get(guardId)[i] + 1
                        }
                        break;
                }
            });
            resolve(guardTimings);
        })
    })
}

const ActionTypes = Object.freeze({ "WAKE": 0, "SLEEP": 1, "BEGIN": 2 });

class Action {
    constructor(action) {
        this.action = action;
        this.actionType = this.parseType(action);
    }

    parseType(action) {
        if (action.startsWith('w')) {
            return ActionTypes.WAKE
        } else if (action.startsWith('f')) {
            return ActionTypes.SLEEP
        } else if (action.startsWith('G')) {
            return ActionTypes.BEGIN
        }
    }

    parseId() {
        if (this.actionType === ActionTypes.BEGIN) {
            return this.action.match(/Guard #(\d+)/)[1];
        }
    }
}

class Log {
    constructor(date, action) {
        this.date = date;
        this.action = action;
    }
}

module.exports = {
    one,
    two
};