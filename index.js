import dataset from "./dataset.json" assert { type: "json" };

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const padding = 50;
const w = 1000;
const h = 500;

// create tooltip
const tooltip = d3.select("#container").append("div").attr("id", "tooltip");

const xScale = d3
  .scaleTime()
  .domain([
    d3.min(dataset.data, (d) => new Date(d[0])),
    d3.max(dataset.data, (d) => new Date(d[0])),
  ])
  .range([padding, w - 2 * padding]);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(dataset.data, (d) => d[1])])
  .range([h - padding, padding]);
// create svg
const svg = d3
  .select("#container")
  .append("svg")
  .attr("viewBox", `0 0 1000 500`)
  .style("background-color", "lightblue");

// create chart Title
svg
  .append("text")
  .attr("x", w / 2)
  .attr("y", 30)
  .attr("text-anchor", "middle")
  .attr("id", "title")
  .style("font-size", "20px")
  .text(dataset.source_name);

// create xScale
svg
  .append("g")
  .attr("id", "x-axis")
  .attr("transform", `translate(0, ${h - padding})`)
  .call(d3.axisBottom(xScale));

// create yScale
svg
  .append("g")
  .attr("id", "y-axis")
  .attr("transform", `translate(${padding}, 0)`)
  .call(d3.axisLeft(yScale));

// create bars
svg
  .selectAll("rect")
  .data(dataset.data)
  .enter()
  .append("rect")
  .attr("x", (d, i) => xScale(new Date(d[0])))
  .attr("y", (d) => yScale(d[1]))
  .attr("width", w / dataset.data.length)
  .attr("height", (d) => h - padding - yScale(d[1]))
  .attr("class", "bar")
  .attr("data-date", (d) => d[0])
  .attr("data-gdp", (d) => d[1])
  .attr("fill", "purple")
  .on("mouseover", (e) => {
    const dataDate = e.target.getAttribute("data-date");
    tooltip
      .style("opacity", 0.9)
      .attr("data-date", dataDate)
      .style("left", `${e.x}px`)
      .style("top", `${e.y}px`)
      .html(e.target.getAttribute("data-gdp"));
  })
  .on("mouseout", (e) => {
    tooltip.style("opacity", 0);
  });
