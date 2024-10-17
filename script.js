const width = 800;
const height = 600;
const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const points = {
    A: [350, 200],  // Moved A slightly to the left
    B: [250, 350],
    C: [550, 350],
    D: [250, 550],
    E: [550, 550],
    F: [150, 450],
    G: [150, 150],
    H: [650, 100],
    K: [750, 200],
    L: [350, 550]  // Update L to match A's x-coordinate
};

function slope(p1, p2) {
    return (p2[1] - p1[1]) / (p2[0] - p1[0]);
}

function calculateC(A, B) {
    // 1. Find the slope of line AB
    const slopeAB = slope(A, B);

    // 2. Find the slope of line AC (perpendicular to AB)
    const slopeAC = -1 / slopeAB;

    // 3. Use point-slope form to find equation of line AC
    // y - y1 = m(x - x1), where (x1, y1) is point A and m is slopeAC

    // 4. Find the equation of line BC (horizontal line)
    // y = B[1] 

    // 5. Solve the system of equations from step 3 and 4 to find the 
    // intersection point (C). This involves some algebra to find x and y.

    // Here's the solution after solving the equations:
    const x = (B[1] - A[1] + slopeAC * A[0]) / slopeAC;
    const y = B[1];

    return [x, y];
}

points.C = calculateC(points.A, points.B);

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