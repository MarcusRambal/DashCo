import * as d3 from "d3";


const datos = [30, 86, 168, 281, 303, 365];

  d3.select("body")
    .selectAll("div")
    .data(datos)
    .enter()
    .append("div")
    .style("width", d => d + "px")
    .style("background", "steelblue")
    .style("margin", "5px")
    .style("color", "white")
    .text(d => d);