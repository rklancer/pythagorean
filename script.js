const width = 800;
const height = 600;
const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const points = {
    A: [400, 200],
    B: [250, 350],
    C: [550, 350],
    D: [250, 550],
    E: [550, 550],
    F: [100, 450],
    G: [100, 150],
    H: [600, 50],
    K: [750, 250],
    L: [400, 550]
};

svg.append("polygon")
    .attr("class", "triangle")
    .attr("points", [points.A, points.B, points.C].map(p => p.join(",")).join(" "));

// Function to draw a line between two points
function drawLine(p1, p2) {
    svg.append("line")
        .attr("class", "line")
        .attr("x1", p1[0])
        .attr("y1", p1[1])
        .attr("x2", p2[0])
        .attr("y2", p2[1]);
}

// Draw the squares
drawLine(points.A, points.G);
drawLine(points.G, points.F);
drawLine(points.F, points.B);

drawLine(points.B, points.D);
drawLine(points.D, points.E);
drawLine(points.E, points.C);

drawLine(points.C, points.K);
drawLine(points.K, points.H);
drawLine(points.H, points.A);

// Draw the altitude and remaining lines
drawLine(points.A, points.L); 
drawLine(points.A, points.D); 
drawLine(points.A, points.E); 
drawLine(points.C, points.F); 
drawLine(points.B, points.K); 

// Function to draw a point
function drawPoint(p, label, radius = 3) {
    const offset = 10; // Adjust this value to control label position
    svg.append("text")
        .attr("class", "text")
        .attr("x", p[0] + offset)
        .attr("y", p[1] - offset)
        .text(label);

    svg.append("circle")
        .attr("class", "point")
        .attr("cx", p[0])
        .attr("cy", p[1])
        .attr("r", radius);
}

// Draw all the points using a loop
for (const point in points) {
    drawPoint(points[point], point);
}