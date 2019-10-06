module.exports = function dijkstra(graphArr, start, end, additionalCheck) {
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
            if (iNode !== pos && graphArr[iNode][pos] !== Infinity) {
                if (additionalCheck && additionalCheck(graphArr[iNode][pos])) continue;
                if (sumDist[pos] - graphArr[iNode][pos] === sumDist[iNode]) {
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

