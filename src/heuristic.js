const distances = require('./data/distances.json');

let pheromones, shortestTour, shortestDistance, exploitation, exploration, capitals

const resetGlobals = (exploi, explor, numberOfCapitals) => {
    exploitation = exploi
    exploration = explor
    capitals = parseFloat(numberOfCapitals)
    pheromones = Array(capitals).fill().map(() => Array(capitals).fill(1))
    shortestDistance = Infinity
}

const probabilityNumerator = (from, to) => distances[from][to] ** -exploitation * pheromones[from][to] ** exploration

const probabilityDenominator = (from, adjacents) => {
    let sum = 0
    for (let i = 0; i < adjacents.length; i++) {
        const to = adjacents[i]
        sum += distances[from][to] ** -exploitation * pheromones[from][to] ** exploration
    }
    return sum
}

const probability = (numerator, denominator) => numerator / denominator

const tourDistance = (tour) => tour.reduce((sum, city, i) => sum + distances[city][tour[(i + 1) % capitals]], 0)

const updatePheromones = (tour, distance) => {
    const reciprocal = 1 / distance
    tour.forEach((city, i) => {
        pheromones[city][tour[(i + 1) % capitals]] += reciprocal
        pheromones[tour[(i + 1) % capitals]][city] += reciprocal
})}

const pick = (probabilities) => {
    let commulative = Math.random()
    for (let i = 0; i < probabilities.length; i++) {
        commulative -= probabilities[i]
        if (commulative <= 0) return i
    }
}

const performTour = () => {
    let from = 0, tour = [ 0 ]
    let adjacents = [ ...Array(capitals).keys() ].splice(1)
    
    while (adjacents.length > 0) { // O(n)
        const denominator = probabilityDenominator(from, adjacents) // O(n)
        const probabilities = adjacents.map((to) => probability(probabilityNumerator(from, to), denominator)) // O(n)

        const picked = pick(probabilities) // O(n)
        from = adjacents[picked]
        tour.push(from)
        adjacents.splice(picked, 1) // O(n)
    }
    const distance = tourDistance(tour) // O(n)
    if (capitals === 10) console.log(tour)
    updatePheromones(tour, distance) // O(n)

    if (distance < shortestDistance) {
        shortestDistance = distance
        shortestTour = tour
}}

const getShortestTour = () => shortestTour
const getShortestDistance = () => shortestDistance

module.exports = { performTour, getShortestTour, getShortestDistance, resetGlobals }
