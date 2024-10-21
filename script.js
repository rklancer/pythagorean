const width = 800;
const height = 600;
const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const points = {
    A: [325, 250],  // Moved A slightly to the left
    B: [250, 350],
};

function slope(p1, p2) {
    return (p2[1] - p1[1]) / (p2[0] - p1[0]);
}

function distance(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}

// Third point or a right triangle BAC, where BC is horizontal
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

// The endpoint of the line segment with endpoint p1, of the same distance
// as the line segment p1p2, 90 degrees counterclockwise (+1) or clockwise(-1)
// from directed line segment p1p2.
function calculateNormalPoint(p1, p2, direction) {
    // 3. Calculate the angle of the line p1p2
    const angleP1P2 = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);

    // 4. Calculate the angle of the normal line 
    //    (add or subtract 90 degrees based on direction)
    const angleNormal = angleP1P2 + direction * Math.PI / 2;

    // 5. Calculate the distance between p1 and p2
    const distanceP1P2 = distance(p1, p2);

    // 6. Calculate the x and y offsets from p1 to p3
    const xOffset = distanceP1P2 * Math.cos(angleNormal);
    const yOffset = distanceP1P2 * Math.sin(angleNormal);

    // 7. Calculate the coordinates of p3
    const x = p1[0] + xOffset;
    const y = p1[1] + yOffset;

    return [x, y];
}

// Function to draw a line between two points
function drawLine(p1, p2) {
    svg.append("line")
        .attr("class", "line")
        .attr("x1", p1[0])
        .attr("y1", p1[1])
        .attr("x2", p2[0])
        .attr("y2", p2[1]);
}

function drawTriangle(A, B) {
    // Calculate point C
    const C = calculateC(A, B);

    // Draw the triangle using points A, B, and the calculated C
    svg.append("polygon")
        .attr("class", "triangle")
        .attr("points", [A, B, C].map(p => p.join(",")).join(" "));

    // Return point C so it can be used for other calculations
    return C;
}

function drawSquare(p1, p2) {
    // Calculate the third and fourth points of the square
    const p3 = calculateNormalPoint(p1, p2, +1); // Counterclockwise
    const p4 = calculateNormalPoint(p2, p1, -1); // Clockwise 
    drawLine(p1, p3);
    drawLine(p3, p4);
    drawLine(p4, p2);

    return [p3, p4];
}

// Function to draw a point
function drawPoint(p, label, radius = 3) {
    const offset = 10; // Adjust this value to control label position
    svg.append("text")
        .attr("class", "label")
        .attr("x", p[0] + offset)
        .attr("y", p[1] - offset)
        .text(label);

    svg.append("circle")
        .attr("class", "point")
        .attr("cx", p[0])
        .attr("cy", p[1])
        .attr("r", radius);
}
// ... (your existing code)

// Make point A draggable
svg.call(
    d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
);

function dragstarted() {
    d3.select(this).raise(); // Bring the dragged element to the front
}

function dragged(event) {
    // Update the coordinates of point A
    points.A = [event.x, event.y];

    // Redraw the visualization
    redraw();
}

function dragended() {
    // (Optional: Any actions to perform after dragging ends)
}

function redraw() {
    // Clear the SVG
    svg.selectAll("*").remove();

    // Recalculate point C
    points.C = drawTriangle(points.A, points.B);

    // Redraw the squares 
    const [G, F] = drawSquare(points.A, points.B);
    points.G = G;
    points.F = F;

    const [D, E] = drawSquare(points.B, points.C);
    points.D = D;
    points.E = E;

    const [K, H] = drawSquare(points.C, points.A);
    points.H = H;
    points.K = K;

    // Calculate point L (same x as A, same y as D or E)
    points.L = [points.A[0], points.D[1]];

    // Draw the altitude and remaining lines
    drawLine(points.A, points.L);
    drawLine(points.A, points.D);
    drawLine(points.A, points.E);
    drawLine(points.C, points.F);
    drawLine(points.B, points.K);
    // Redraw the points and labels
    for (const point in points) {
        drawPoint(points[point], point);
    }
}

// Initial drawing
redraw();
// Add the HTML proof text
const proofTextDiv = document.getElementById("proof-text");
proofTextDiv.innerHTML = `
    <p><b>Proposition 47.</b> In right-angled triangles the square on the side subtending the right angle is equal to the squares on the sides containing the right angle.</p>

    <p>Let <span class="highlight-element" data-highlight="triABC">[ABC be a right-angled triangle]</span> having the <span class="highlight-element" data-highlight="angleBAC">[angle BAC right]</span>.</p>

    <p>I say that <span class="highlight-element" data-highlight="sqBC">[the square on BC]</span> is equal to the squares on <span class="highlight-element" data-highlight="BA">[BA]</span> and <span class="highlight-element" data-highlight="AC">[AC]</span>.</p>

    <p>Describe <span class="highlight-element" data-highlight="sqBDEC">[the square BDEC on BC]</span>, and the squares <span class="highlight-element" data-highlight="sqGB">[GB]</span> and <span class="highlight-element" data-highlight="sqHC">[HC]</span> on BA and AC. <span class="highlight-element" data-highlight="AL">[Draw AL through A parallel to either BD or CE]</span>, and <span class="highlight-element" data-highlight="ADFC">[join AD and FC]</span>.</p>

    <p>Since <span class="highlight-element" data-highlight="angleBACandBAG">[each of the angles BAC and BAG is right]</span>, it follows that <span class="highlight-element" data-highlight="lineBAG">[with a straight line BA, and at the point A on it, the two straight lines AC and AG not lying on the same side]</span> make the <span class="highlight-element" data-highlight="adjAngles">[adjacent angles equal to two right angles]</span>, therefore <span class="highlight-element" data-highlight="CAG">[CA is in a straight line with AG]</span>.</p>

    <p>(<a href="https://mathcs.clarku.edu/~djoyce/elements/bookI/propI14.html">Proposition 14</a>) For the same reason <span class="highlight-element" data-highlight="BAH">[BA is also in a straight line with AH]</span>.</p>

    <p>Since <span class="highlight-element" data-highlight="angleDBCAndFBA">[the angle DBC is equal to the angle FBA, for each is right]</span>, <span class="highlight-element" data-highlight="addABC">[add the angle ABC to each]</span>, therefore <span class="highlight-element" data-highlight="angleDBAandFBC">[the whole angle DBA is equal to the whole angle FBC]</span>.</p>

    <p>(<a href="https://mathcs.clarku.edu/~djoyce/elements/bookI/propI4.html">Proposition 4</a>) Since DB is equal to BC, and FB to BA, the two sides AB and BD are equal to the two sides FB and BC respectively, and the angle ABD is equal to the angle FBC, therefore the base AD is equal to the base FC, and the triangle ABD is equal to the triangle FBC. Now the parallelogram BL is double the triangle ABD, for they have the same base BD and are in the same parallels BD and AL. And the square GB is double the triangle FBC, for they again have the same base FB and are in the same parallels FB and GC. [Proposition 41] But the doubles of equals are equal to one another, therefore the parallelogram BL is also equal to the square GB. Similarly, if AE and BK are joined, the parallelogram CL can also be proved equal to the square HC; therefore the whole square BDEC is equal to the two squares GB and HC. [Common notion 2] And the square BDEC is described on BC, and the squares GB and HC on BA and AC. Therefore the square on the side BC is equal to the squares on the sides BA and AC. Therefore in right-angled triangles the square on the side subtending the right angle is equal to the squares on the sides containing the right angle. Q.E.D.</p>
`;


// Add event listeners for hover/click interactions
d3.selectAll(".highlight-element").on("mouseover", highlightElement);
d3.selectAll(".highlight-element").on("mouseout", unhighlightElement);

// Function to highlight the corresponding element
function highlightElement() {
    const elementToHighlight = d3.select(this).attr("data-highlight");
    // Add logic here to highlight the element in the SVG
    // For example, you can change the fill color or stroke width
    // of the corresponding shape in the SVG.
    console.log("Highlight:", elementToHighlight); // Placeholder for now
}

// Function to unhighlight the element
function unhighlightElement() {
    const elementToUnhighlight = d3.select(this).attr("data-highlight");
    // Add logic here to unhighlight the element in the SVG
    console.log("Unhighlight:", elementToUnhighlight); // Placeholder for now
}