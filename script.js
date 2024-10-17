const width = 800;
const height = 600;
const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Function to draw a triangle
function drawTriangle(x, y, side) {
    const points = [
        [x, y],
        [x + side, y],
        [x, y + side]
    ];
    svg.append("polygon")
        .attr("class", "triangle")
        .attr("points", points.map(p => p.join(",")).join(" "));
}

// Function to draw a square
function drawSquare(x, y, side) {
    svg.append("rect")
        .attr("class", "square")
        .attr("x", x)
        .attr("y", y)
        .attr("width", side)
        .attr("height", side);
}

// Initial triangle side lengths
let a = 150;
let b = 200;

// Function to update the visualization
function updateVisualization() {
    svg.selectAll("*").remove(); // Clear previous elements

    const c = Math.sqrt(a * a + b * b);

    // Draw triangles
    drawTriangle(50, 50, a);
    drawTriangle(50 + a, 50, b);
    drawTriangle(50, 50 + a, c);

    // Draw squares
    drawSquare(50, 50 + a, c);
    drawSquare(50 + a, 50, b);
    drawSquare(50, 50, a);

    // Add labels (a, b, c)
    svg.append("text")
        .attr("class", "text")
        .attr("x", 50 + a / 2)
        .attr("y", 50 + 20)
        .text("a");
    svg.append("text")
        .attr("class", "text")
        .attr("x", 50 + a + b / 2)
        .attr("y", 50 + 20)
        .text("b");
    svg.append("text")
        .attr("class", "text")
        .attr("x", 50 + 20)
        .attr("y", 50 + a + c / 2)
        .text("c");
}

// Initial visualization
updateVisualization();

// Add interactive sliders for 'a' and 'b'
d3.select("#visualization").append("input")
    .attr("type", "range")
    .attr("min", 50)
    .attr("max", 300)
    .attr("value", a)
    .on("input", function() {
        a = +this.value;
        updateVisualization();
    });

d3.select("#visualization").append("input")
    .attr("type", "range")
    .attr("min", 50)
    .attr("max", 300)
    .attr("value", b)
    .on("input", function() {
        b = +this.value;
        updateVisualization();
    });