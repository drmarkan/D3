// @TODO: YOUR CODE HERE!
// Step 1: Set up our chart
const svgWidth = 960;
const svgHeight = 500;
const margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;
// Step 2: Create an SVG wrapper
const svg = d3
  .select("div")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Step 3: Import .csv
d3.csv("../data/data.csv").then(function(healthData){
    console.log(healthData)

    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
    })

  
//Step 5: Create Scales
const xLinearScale = d3.scaleLinear()
    .domain(d3.extent(healthData, d => d.poverty))
    .range([0, width]);
const yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.obesity)])
    .range([height, 0]);
//Step 6: Create Axes
const xAxis = d3.axisBottom(xLinearScale);
const yAxis = d3.axisLeft(yLinearScale);
//Step 7: Append to Chart
chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)
chartGroup.append("g")
    .call(yAxis)
//Step 8: Create Circles
let circleGroups = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "15")
    .attr("fill", "blue")
    //.attr("opacity", ".5")
//Step 9: Initialize Tool Tip
let toolTip = d3.tip()
    .attr("class", "toolTip")
    .offset([80, -60])
    .html(function(healthData){
        return `${healthData.state}<br />Poverty Rate: ${healthData.poverty}<br />Obesity Rate: ${healthData.obesity}`
    });
//Step 10: Add Tool Tip to Chart
chartGroup.call(toolTip)
//Step 11: Event Listeners
circleGroups.on("mouseover", function(healthData){
    toolTip.show(healthData, this);
})
.on("mouseout", function(healthData){
    toolTip.hide(healthData);
})
//Step 12: Chart Labels
chartGroup.append("text")
    .attr("transform", "rotate (-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obesity (%)")
chartGroup.append("text")
    .attr("class", "axisText")
    .attr("x", 450)
    .attr("y", 460)
    .text("Poverty Rate (%)")
});
