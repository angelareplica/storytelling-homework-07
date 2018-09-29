import * as d3 from 'd3'

// Set up margin/height/width

var margin = { top: 10, left: 25, right: 10, bottom: 20 }

var height = 100 - margin.top - margin.bottom

var width = 100 - margin.left - margin.right

// I'll give you the container
var container = d3.select('#chart-2')

// Create your scales

var xPositionScale = d3
  .scaleLinear()
  .domain([0, 60])
  .range([0, width])

var yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])

// Create a d3.line function that uses your scales

var line_jp = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y(function(d) {
    return yPositionScale(d.ASFR_jp)
  })

var line_us = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y(function(d) {
    return yPositionScale(d.ASFR_us)
  })

// Read in your data

d3.csv(require('./fertility.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Build your ready function that draws lines, axes, etc

function ready(datapoints) {
  var nested = d3
    .nest()
    .key(d => d.Year)
    .entries(datapoints)

  console.log('nested data looks like', nested)

  // Adding svgs for every yr

  container
    .selectAll('.year-svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'year-svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      let svg = d3.select(this)
      let datapoints = d.values

      svg
        .append('path')
        .datum(datapoints)
        .attr('d', line_jp)
        .attr('stroke', 'red')
        .attr('fill', 'red')
        .attr('opacity', 0.5)

      svg
        .append('path')
        .datum(datapoints)
        .attr('d', line_us)
        .attr('stroke', '00FFFE')
        .attr('fill', '#00FFFE')
        .attr('opacity', 0.5)
        .lower()

      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')

      // console.log(d.values)

      let list_jp = datapoints.map(d => +d.ASFR_jp)

      let list_us = datapoints.map(d => +d.ASFR_us)

      svg
        .append('text')
        .datum(d.values)
        .text(d => {
          return d3.sum(list_jp).toFixed(2)
        })
        .attr('x', width / 2)
        .attr('y', height - 35)
        .attr('font-size', 7)
        .attr('text-anchor', 'right')
        .attr('fill', 'red')
        .attr('dx', 10)

      svg
        .append('text')
        .datum(d.values)
        .text(d => {
          return d3.sum(list_us).toFixed(2)
        })
        .attr('x', width / 2)
        .attr('y', height - 45)
        .attr('font-size', 7)
        .attr('text-anchor', 'right')
        .attr('fill', '#00FFFE')
        .attr('dx', 10)

      var xAxis = d3.axisBottom(xPositionScale).tickValues([15, 30, 45])
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      var yAxis = d3.axisLeft(yPositionScale).ticks(4)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
    })
}
