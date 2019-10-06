const {readAndParse} = require('./distanceUtilities');

readAndParse('newDistances.txt').then(([cities, distances]) => {
    // MAIN ENTRYPOINT
    const testRoute = ['Kuldiga', 'Tukums', 'Riga', 'Salaspils', 'Aizkraukle', 'Jekabpils', 'Daugavpils'];
    testCity(cities, distances, testRoute);

    findCity(cities, distances, 'Kuldiga', 'Daugavpils');

    const [vi, ki] = findCityIndex(cities, ['Kuldiga', 'Tukums']);
    distances[vi][ki] = -1;
    distances[ki][vi] = -1;
    // path is blocked

    findCity(cities, distances, 'Kuldiga', 'Daugavpils');

}).catch(err => console.log(err));


function findCity(cities, distances, start, end) {
    const startIndex = findCityIndex(cities, start);
    const endIndex = findCityIndex(cities, end);

    const [route, distance] = dijkstra(distances, startIndex, endIndex, iNodeDistance => {
        return iNodeDistance === -1 || iNodeDistance > 100;
    });

    if (route) {
        const routeToCityNames = route.map(cityIndex => cities[cityIndex]);
        console.log(`${routeToCityNames.join(' => ')} with a total distance of ${distance}`);
    }
    else console.log(`You didn't reach your destination ;( `);
}

function testCity(cities, distances, route) {
    const indexRoute = route.map(item => findCityIndex(cities, item));

    let sum = 0;
    for (let i = 0; i < indexRoute.length - 1; ++i) {
        let temp = distances[indexRoute[i]][indexRoute[i+1]];
        sum+= temp;
        console.log(temp);
    }
    console.log(`Sum: ${sum}`);
}

function findCityIndex(cities, cityName) {
    if (Array.isArray(cityName)) {
        return cityName.map(cityN => cities.findIndex(city => city.toLowerCase() === cityN.toLowerCase()));
    }
    return cities.findIndex(city => city.toLowerCase() === cityName.toLowerCase());
}

function dijkstra(graphArr, start, end, additionalCheck) {
    let unvisited = new Set([...Array(graphArr.length)].map((temp, index) => index));
    let sumDist = Array(graphArr.length).fill(Infinity);
    sumDist[start] = 0;
    let currentNode = start;

    for (let i = 0; i < sumDist.length; ++i) {
        for (let iNode = 0; iNode < sumDist.length; ++iNode) {
            if (currentNode === iNode || graphArr[currentNode][iNode] === Infinity || 
                !unvisited.has(currentNode)) {
                continue;
            }

            if (additionalCheck && additionalCheck(graphArr[currentNode][iNode])) continue;

            if (sumDist[currentNode] + graphArr[currentNode][iNode] < sumDist[iNode]) {
                sumDist[iNode] = sumDist[currentNode] + graphArr[currentNode][iNode];
            }
        }
        unvisited.delete(currentNode);

        let temp = Infinity;
        let minIndex = 0;

        for (let iNode = 0; iNode < sumDist.length; ++iNode) {
            if (sumDist[iNode] < temp && unvisited.has(iNode)) {
                temp = sumDist[iNode];
                minIndex = iNode;
            }
        }
        currentNode = minIndex;
        
        if (!unvisited.has(end)) break;
    }

    if (unvisited.has(end)) return [null, 0]; // you ain't goin anywhere 

    // trace back
    let route = [end];
    let pos = end;

    while (pos !== start) {
        for (let iNode = 0; iNode < graphArr[pos].length; ++iNode) {
            if (iNode !== pos && graphArr[pos][iNode] !== Infinity) {
                if (additionalCheck && additionalCheck(graphArr[pos][iNode])) continue;
                if (sumDist[pos] - graphArr[pos][iNode] === sumDist[iNode]) {
                    route.push(iNode); 
                    pos = iNode;
                    break;
                }
            }
        }
    }
    route.reverse();
    return [route, sumDist[end]];
}

/*
const graphArr = [
    [0, 7, 9, Infinity, Infinity, 14],
    [7, 0, 10, 15, Infinity, Infinity],
    [9, 10, 0, 11, Infinity, 2],
    [Infinity, 15, 11, 0, 6, Infinity],
    [Infinity, Infinity, Infinity, 6, 0, 9],
    [14, Infinity, 2, Infinity, 9, 0]
];*/

/*dijkstra(distances, 0, 4); // graphArr, start, end*/
// example output - [ 0, 2, 5, 4 ] 

