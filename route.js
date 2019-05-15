
function getCost(route){
    var cost = 0;
    for(var i = 0; i < citiesNumber - 1; i++){
        cost += getDistance(route[i], route[i + 1]);
    }
    return cost += getDistance(route[0], route[citiesNumber - 1]);
}

function getDistance(point1, point2) {
    var del_x = point1[0] - point2[0];
    var del_y = point1[1] - point2[1];

    return Math.sqrt((del_x * del_x) + (del_y * del_y));
}

function drawRoute() {
    ctx_route.clearRect(0, 0, canvas_route.width, canvas_route.height);
    ctx_route.beginPath();
    ctx_route.moveTo(best[0][0], best[0][1]);
    for(var i = 0; i < citiesNumber-1; i++){
        ctx_route.lineTo(best[i+1][0], best[i+1][1]);
        ctx_route.stroke();
    }
    ctx_route.lineTo(best[0][0], best[0][1]);
    ctx_route.stroke();
    ctx_route.closePath();
}