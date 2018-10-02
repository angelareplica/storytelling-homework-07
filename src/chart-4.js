import * as d3 from 'd3'

// I'll give you margins/height/width
var margin = { top: 100, left: 10, right: 10, bottom: 30 }
var height = 500 - margin.top - margin.bottom
var width = 400 - margin.left - margin.right

// And grabbing your container
var container = d3.select('#chart-4')

// Create your scales

var xPositionScale = d3
  .scaleLinear()
  .domain([-6, 6])
  .range([0, width])

var yPositionScale = d3.scaleLinear().range([height, 0])

// Create your area generator
var area = d3
  .area()
  .x(function(d) {
    return xPositionScale(d.diff)
  })
  .y1(function(d) {
    return yPositionScale(d.freq)
  })

// Read in your data, then call ready

d3.tsv(require('./climate-data.tsv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Write your ready function

function ready(datapoints) {
  var nested = d3
    .nest()
    .key(d => d.year)
    .rollup(values => d3.mean(values, v => v.freq))
    .entries(datapoints)

  var filtered1951 = datapoints.filter(function(d) {
    return +d.year >= 1951 && +d.year <= 1980
  })

  console.log('1951-1980 filtered data looks like', filtered1951)

  var filtered1983 = datapoints.filter(function(d) {
    return +d.year >= 1983 && +d.year <= 1993
  })

  var filtered1994 = datapoints.filter(function(d) {
    return +d.year >= 1994 && +d.year <= 2004
  })

  var filtered2005 = datapoints.filter(function(d) {
    return +d.year >= 2005 && +d.year <= 2015
  })

  var svg1951 = container
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    // .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  svg1951
    .datum(filtered1951)
    .attr('fill', 'red')
    .attr('d', area)

  var xAxis = d3
    .axisBottom(xPositionScale)
    .tickSize(-height)
    .ticks(4)

  svg1951
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  svg1951
    .selectAll('.x-axis line')
    .attr('stroke-dasharray', '2 2')
    .attr('line-linecap', 'round')
  // svg1951.select('.x-axis .domain').remove()
}
