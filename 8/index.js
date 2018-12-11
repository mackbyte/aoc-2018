const input = require('../utils/input');

function one() {
    return new Promise(resolve => {
        input.readString('eight.txt').then(file => {
            let tree = parseNodes(file.split(' '));
            resolve(tree.sumMetadata());
        })
    })
}

function two() {
    return new Promise(resolve => {
        input.readString('eight.txt').then(file => {
            let tree = parseNodes(file.split(' '));
            resolve(tree.value());
        });
    })
}

function parseNodes(data) {
    let numChildren = parseInt(data.shift()),
        numMeta = parseInt(data.shift());

    let node = new Node();

    if (numChildren > 0) {
        for(let i = 0; i < numChildren; i++) {
            node.addLeaf(parseNodes(data))
        }
    }

    for(let i = 0; i < numMeta; i++) {
        node.addMetadata(parseInt(data.shift()))
    }

    return node
}

class Node {
    constructor() {
        this.metadata = [];
        this.leaves = [];
    }

    addLeaf(node) {
        this.leaves.push(node);
    }

    addMetadata(metadata) {
        this.metadata.push(metadata);
    }

    sumMetadata() {
        return this.metadata.reduce((total, data) => total + data, 0) + this.leaves.reduce((total, leaf) => total + leaf.sumMetadata(), 0)
    }

    value() {
        if(this.leaves.length > 0) {
            let total = 0;
            for(let num of this.metadata) {
                total += this.leaves[num-1] ? this.leaves[num-1].value() : 0
            }
            return total
        }

        return this.metadata.reduce((total, data) => total + data, 0)
    }
}

module.exports = {
    one,
    two
};