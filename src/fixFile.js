const readLineSync = require('readline-sync');
const {readAndParse, stringifyAndWrite} = require('./distanceUtilities');

//argv[2] = source txt file
//argv[3] = target txt file

function validateData(cities, distances) {
    let allValid = true;

    // todo: go in a triangular pattern, reducing the for loop almost by half
    for (let i = 0; i < distances.length; ++i) {
        for (let j = 0; j < distances[0].length; ++j) {

            if (distances[i][j] !== distances[j][i]) {
                allValid = false;
                console.log(`City: ${cities[i]}, ${cities[j]}`);
                console.log(distances[i][j], distances[j][i]);
                const userInput = readLineSync.question('New distance:\n');
                const newDistance = parseInt(userInput, 10);
                distances[i][j] = newDistance;
                distances[j][i] = newDistance;
            }
        }
    }
    return allValid;
}

readAndParse(process.argv[2]).then(([cities, distances]) => {
    let isValid = false;

    while (!isValid) {
        isValid = validateData(cities, distances); // mutates
    }
    stringifyAndWrite(cities, distances, process.argv[3]);
}).catch(err => console.log(err));
