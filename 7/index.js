const input = require('../utils/input');

function one() {
    return new Promise(resolve => {
        const reader = input.reader('seven.txt'),
            stepRegex = /Step (.+) must be finished before step (.+) can begin/,
            graph = new Graph();

        reader.on('line', line => {
            let step = line.match(stepRegex),
                first = new Node(step[1]),
                second = new Node(step[2]);


            if (!graph.hasNode(first)) {
                graph.addNode(first)
            }

            if (!graph.hasNode(second)) {
                graph.addNode(second)
            }

            graph.addLink(second, first)
        });

        reader.on('close', () => {
            let order = [];

            while ( graph.size() > 0 ) {
                let toRemove = graph.getNodesWithNoLinks()[0];
                order.push(toRemove.name);
                graph.removeNode(toRemove)
            }

            resolve(order.join(''))
        })
    })
}

function two() {
    return new Promise(resolve => {
        const reader = input.reader('seven.txt'),
            stepRegex = /Step (.+) must be finished before step (.+) can begin/,
            graph = new Graph();

        reader.on('line', line => {
            let step = line.match(stepRegex),
                first = new Node(step[1]),
                second = new Node(step[2]);


            if (!graph.hasNode(first)) {
                graph.addNode(first)
            }

            if (!graph.hasNode(second)) {
                graph.addNode(second)
            }

            graph.addLink(second, first)
        });

        reader.on('close', () => {
            let numWorkers = 6;
            let workers = [],
                timeTaken = 0;
            for(let i = 0; i < numWorkers; i++) {
                workers.push(new Worker())
            }

            let assigned = new Set();
            while ( graph.size() > 0 ) {
                let toRemove = graph.getNodesWithNoLinks();

                workers.filter(worker => worker.isFree())
                    .forEach((worker, idx) => {
                        if (idx < toRemove.length && !assigned.has(toRemove[idx].name)) {
                            let taskLength = toRemove[idx].name.charCodeAt(0) - 64 + 60;
                            worker.setTask(toRemove[idx].name, taskLength);
                            assigned.add(toRemove[idx].name);
                        }
                    });

                workers.forEach(worker => worker.doWork((task) => {
                    graph.removeNode(graph.nodes.get(task))
                }));

                timeTaken++;
            }

            resolve(timeTaken);
        })
    })
}

class Node {
    constructor(name) {
        this.name = name;
        this.links = [];
    }

    addLink(node) {
        this.links.push(node)
    }

    removeLink(node) {
        this.links = this.links.filter(link => link.name !== node.name)
    }
}

class Graph {
    constructor() {
        this.nodes = new Map()
    }

    addNode(node) {
        this.nodes.set(node.name, node)
    }

    addLink(from, to) {
        this.nodes.get(from.name).addLink(this.nodes.get(to.name))
    }

    hasNode(node) {
        return this.nodes.has(node.name);
    }

    getNodesWithNoLinks() {
        return Array.from(this.nodes.values())
            .filter(node => node.links.length === 0)
            .sort((a, b) => a.name.localeCompare(b.name))
    }

    removeNode(toRemove) {
        for (let node of this.nodes.values()) {
            for (let link of node.links) {
                if (link.name === toRemove.name) {
                    node.removeLink(toRemove)
                }
            }
        }

        this.nodes.delete(toRemove.name)
    }

    size() {
        return this.nodes.size
    }

    print() {
        for (let node of this.nodes) {
            console.log(`Node ${node[0]} has links ${node[1].links.map(n => n.name).join(',')}`)
        }
    }
}

class Worker {
    constructor() {
        this.task = null;
        this.timeLeft = 0;
    }

    setTask(task, length) {
        this.task = task;
        this.timeLeft = length
    }

    doWork(done) {
        if(this.task != null) {
            this.timeLeft--;

            if(this.timeLeft === 0) {
                done(this.task);
                this.task = null;
            }
        }
    }

    isFree() {
        return this.task == null;
    }
}

module.exports = {
    one,
    two
};