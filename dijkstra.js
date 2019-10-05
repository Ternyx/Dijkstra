function dijkstra(graphArr, start, end) {
    let unvisited = new Set([...Array(graphArr.length)].map((temp, index) => index));
    let sumDist = Array(graphArr.length).fill(Infinity);
    sumDist[start] = 0;
    let currentNode = start;

    for (let i = 0; i < sumDist.length; ++i) {
        for (let iNode = 0; iNode < sumDist.length; ++iNode) {
            if (currentNode === iNode || graphArr[currentNode][iNode] === Infinity || 
                !unvisited.has(currentNode)) {
                continue;
            };

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

    // trace back
    let route = [end];
    let pos = end;

    while (pos !== start) {
        for (let iNode = 0; iNode < graphArr[pos].length; ++iNode) {
            if (iNode !== pos && graphArr[pos][iNode] !== Infinity && sumDist[pos] - graphArr[pos][iNode] === sumDist[iNode]) {
                // don't compare with itself && check if the nodes are even connected && 
                // check if the difference between the current node and a nearby node == the sumDist for that specific node

                route.push(iNode); // for start -> end, reverse the array afterwards or just do route.unshift(iNode) (fine for short routes)

                pos = iNode;
                break;
            }
        }
    }
    route.reverse();

    console.log(route);
}

const graphArr = [
    [0, 7, 9, Infinity, Infinity, 14],
    [7, 0, 10, 15, Infinity, Infinity],
    [9, 10, 0, 11, Infinity, 2],
    [Infinity, 15, 11, 0, 6, Infinity],
    [Infinity, Infinity, Infinity, 6, 0, 9],
    [14, Infinity, 2, Infinity, 9, 0]
];

dijkstra(graphArr, 0, 4); // graphArr, start, end
// example output - [ 0, 2, 5, 4 ] 
