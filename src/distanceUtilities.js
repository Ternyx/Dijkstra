const fs = require('fs');

function readFile(fileName) {
    return new Promise ((resolve, reject) => {
        fs.readFile(fileName, 'utf-8', (err, data) => {
            if (err) reject(err);
            resolve(data)
        });
    })
}

function parseData(data) {
    const cities = [];
    const lines = data.split('\r\n');
    const distances = [];

    lines.forEach((line, lineIndex) => {
        const words = line.split('\t');
        const currDistance = [];

        words.forEach((word, wordIndex) => {
            if (!word) return;
            if (lineIndex === 0) {
                if (wordIndex !== 0) {
                    cities.push(word);
                }
            }
            else {
                if (wordIndex !== 0) {
                    currDistance.push(parseInt(word, 10));
                }
            }
        });
        if (currDistance.length !== 0) distances.push(currDistance);
    });
    return [cities, distances];
}

async function readAndParse(fileName) {
    const fileData = await readFile(fileName);
    return parseData(fileData);
}

function stringify(_cities, _distances) {
    const FIRST_WORD = 'FROM-TO'
    let cities = _cities.slice();
    let distances = _distances.slice();

    // append city name to each line
    for (let i = 0; i < distances.length; ++i) { 
        distances[i].unshift(cities[i]);
    }
    cities.unshift(FIRST_WORD);

    const target = [cities, ...distances];

    // todo: go in a triangular pattern, reducing the for loop almost by half
    for (let i = 0; i < target.length; ++i) {
        for (let j = 0; j < target[0].length; ++j) {
            const tmp = target [i][j];
            if (j === target[0].length - 1) {
                target[i][j] =  tmp + '\r\n';
            }
            else {
                target[i][j] = tmp + '\t';
            }
        }
    }

    const target2 = target.map(item => item.join(''));
    return target2.join('');
}

function writeFile(path, payload) {
    fs.writeFile(path, payload, err => {if (err) throw err});
}

function stringifyAndWrite(cities, distances, path) {
    const payload = stringify(cities, distances);
    writeFile(path, payload);
}

module.exports = {
    parseData: parseData, 
    readAndParse: readAndParse,
    stringify: stringify,
    stringifyAndWrite: stringifyAndWrite
}

