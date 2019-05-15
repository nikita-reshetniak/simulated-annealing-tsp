var canvas_cities = document.getElementById("canvas_cities");
var ctx_cities = canvas_cities.getContext("2d");
var canvas_route = document.getElementById("canvas_route");
var ctx_route = canvas_route.getContext("2d");
var citiesInput = document.getElementById("cities");
var tmpInput = document.getElementById("temperature");
var abszInput = document.getElementById("abs_zero");
var coolrInput = document.getElementById("cool_rate");
var solveBtn = document.getElementById("solve");
var temperature = 0.1;
var ABSOLUTE_ZERO = 0.0001;
var COOLING_RATE = 0.999999;
var cities = [];
var best = [];
var best_cost = 0;
var startInterval;

citiesInput.addEventListener("input", drawCities);
solveBtn.addEventListener("click", init);

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRndInt(n) {
    return Math.floor(Math.random()*(n));
}

function deep_copy(array, to) {
    var i = array.length;
    while (i--) {
        to[i] = [array[i][0], array[i][1]];
    }
}

function acceptanceProbability(current_cost, neighbor_cost) {
    if (neighbor_cost < current_cost)
        return 1;
    return Math.exp((current_cost - neighbor_cost) / temperature);
}

function init() {
    citiesNumber = parseInt(citiesInput.value);
    temperature = parseFloat(tmpInput.value);
    ABSOLUTE_ZERO = parseFloat(abszInput.value);
    COOLING_RATE = parseFloat(coolrInput.value);

    // for (var i = 0; i < citiesNumber; i++) {
    //     cities[i] = [getRndInteger(10, canvas_cities.width - 10), getRndInteger(10, canvas_cities.height - 10)];
    // }

    deep_copy(cities, best);
    best_cost = getCost(best);
    startInterval = setInterval(solve, 10);
}

function getCost(route){
    var cost = 0;
    for(var i = 0; i < citiesNumber - 1; i++){
        cost += getDistance(route[i], route[i + 1]);
    }
    return cost += getDistance(route[0], route[citiesNumber - 1]);
}

function solve() {
    if (temperature > ABSOLUTE_ZERO) {
        var current_cost = getCost(cities);
        var k = getRndInt(citiesNumber);
        var l = (k+1 + getRndInt(citiesNumber-2)) % citiesNumber;
        if (k > l) {
            var tmp = k;
            k = l;
            l = tmp;
        }
        var neighbor = mutate2Opt(cities, k, l);
        var neighbor_cost = getCost(neighbor);
        if (Math.random() < acceptanceProbability(current_cost, neighbor_cost)) {
            deep_copy(neighbor, cities);
            current_cost = getCost(cities);
        }
        if (current_cost < best_cost) {
            deep_copy(cities, best);
            best_cost = current_cost;
            drawRoute();
        }
        temperature *= COOLING_RATE;
    } else {
        clearInterval(startInterval);
        console.log("Solved")
    }
}

function mutate2Opt(route, i, j) {
    var neighbor = [];
    deep_copy(route, neighbor);
    while (i != j) {
        var t = neighbor[j];
        neighbor[j] = neighbor[i];
        neighbor[i] = t;

        i = (i + 1) % citiesNumber;
        if (i == j)
            break;
        j = (j - 1 + citiesNumber) % citiesNumber;
    }
    return neighbor;
}