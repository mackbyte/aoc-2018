const readline = require('readline'),
    path = require("path"),
    fs = require('fs');

function reader(file) {
    return readline.createInterface({
        input: fs.createReadStream(path.resolve(__dirname, '../inputs', file)),
        crlfDelay: Infinity
    });
}

function readAll(file) {
    return new Promise(resolve => {
        const lines = [],
            rdr = reader(file);

        rdr.on('line', line => {
            lines.push(line)
        });

        rdr.on('close', () => {
            resolve(lines);
        })
    })
}

function readString(file) {
    return new Promise(resolve => {
        const lines = [],
            rdr = reader(file);

        rdr.on('line', line => {
            lines.push(line)
        });

        rdr.on('close', () => {
            resolve(lines.join(''));
        })
    })
}

module.exports = {
    reader,
    readAll,
    readString
};