const {readAndParse} = require('./distanceUtilities');
const dijkstra = require('./dijkstra.js');

readAndParse('newDistances.txt').then(([cities, distances]) => {
    // MAIN ENTRYPOINT

    /*const testRoute = ['Kuldiga', 'Tukums', 'Riga', 'Salaspils', 'Aizkraukle', 'Jekabpils', 'Daugavpils'];
    testCity(cities, distances, testRoute);*/

    findCity(cities, distances, 'Kuldiga', 'Daugavpils');

    const [ku, tu] = findCityIndex(cities, ['Kuldiga', 'Tukums']);
    distances[ku][tu] = -1;
    /*distances[tu][ku] = -1;*/

    findCity(cities, distances, 'Kuldiga', 'Daugavpils');

}).catch(err => console.log(err));

function findCity(cities, distances, start, end) {
    const startIndex = findCityIndex(cities, start);
    const endIndex = findCityIndex(cities, end);

    const [route, distance] = dijkstra(distances, startIndex, endIndex,
        iNodeDistance => iNodeDistance === -1 || iNodeDistance > 100);

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

