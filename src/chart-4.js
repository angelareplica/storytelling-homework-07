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
    // console.log('d looks like', d)
    return xPositionScale(d.key)
  })
  .y0(function(d) {
    return yPositionScale(0)
  })
  .y1(function(d) {
    return yPositionScale(d.value)
  })

// Read in your data, then call ready

d3.tsv(require('./climate-data.tsv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Write your ready function

function ready(datapoints) {
  // Filtering for groups of years
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

  // Start of SVG 1 (1951)

  var nested1951 = d3
    .nest()
    .key(d => d.diff)
    .rollup(values => d3.mean(values, v => v.freq))
    .entries(filtered1951)

  var maxFreq = d3.max(datapoints, function(d) {
    return +d.freq
  })

  yPositionScale.domain([0, maxFreq])

  console.log('nested1951 looks like', nested1951)

  var svg1951 = container
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('class', 'svg-1951')

  var hot1951 = nested1951.filter(function(d) {
    return +d.key >= 0.9 && +d.key <= 3
  })

  var normal1951 = nested1951.filter(function(d) {
    return +d.key >= -0.9 && +d.key <= 0.9
  })

  var cold1951 = nested1951.filter(function(d) {
    return +d.key >= -3 && +d.key <= -0.9
  })

  var veryhot1951 = nested1951.filter(function(d) {
    return +d.key >= 3
  })

  var verycold1951 = nested1951.filter(function(d) {
    return +d.key <= -3
  })

  // Adding the hot section to the 1951 chart
  // d3.selectAll('.svg-1951')
  svg1951
    .append('path')
    .datum(hot1951)
    // .datum(nested1951)
    .attr('fill', '#ee9f71')
    .attr('d', area)

  // Adding the normal section to the 1951 chart
  svg1951
    .append('path')
    .datum(normal1951)
    .attr('fill', '#cac7c7')
    .attr('d', area)

  // Adding the cold section to the 1951 chart
  svg1951
    .append('path')
    .datum(cold1951)
    .attr('fill', '#96bccf')
    .attr('d', area)

  // Adding the extremely hot/cold areas to the 1951 chart
  svg1951
    .append('path')
    .datum(veryhot1951)
    .attr('fill', '#c9604b')
    .attr('d', area)

  svg1951
    .append('path')
    .datum(verycold1951)
    .attr('fill', '#236085')
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
    .lower()

  svg1951
    .selectAll('.x-axis line')
    .attr('stroke-dasharray', '2 2')
    .attr('line-linecap', 'round')
  // svg1951.select('.x-axis .domain').remove()

  // Start of SVG 2 (1983)

  var nested1983 = d3
    .nest()
    .key(d => d.diff)
    .rollup(values => d3.mean(values, v => v.freq))
    .entries(filtered1983)

  var maxFreq = d3.max(datapoints, function(d) {
    return +d.freq
  })

  yPositionScale.domain([0, maxFreq])

  var svg1983 = container
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('class', 'svg-1983')

  svg1983
    .append('path')
    .datum(nested1983)
    .attr('fill', 'purple')
    .attr('stroke', 'purple')
    .attr('d', area)

  // appending the 1951 area underneath
  svg1983
    .append('path')
    .datum(nested1951)
    .attr('fill', 'lightgrey')
    .attr('stroke', 'lightgrey')
    .attr('d', area)
    .lower()

  var xAxis = d3
    .axisBottom(xPositionScale)
    .tickSize(-height)
    .ticks(4)

  svg1983
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .lower()

  svg1983
    .selectAll('.x-axis line')
    .attr('stroke-dasharray', '2 2')
    .attr('line-linecap', 'round')

  // Start of SVG 3

  var nested1994 = d3
    .nest()
    .key(d => d.diff)
    .rollup(values => d3.mean(values, v => v.freq))
    .entries(filtered1994)

  var maxFreq = d3.max(datapoints, function(d) {
    return +d.freq
  })

  yPositionScale.domain([0, maxFreq])

  var svg1994 = container
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('class', 'svg-1994')

  svg1994
    .append('path')
    .datum(nested1994)
    .attr('fill', 'blue')
    .attr('stroke', 'blue')
    .attr('d', area)

  // appending the 1951 area underneath
  svg1994
    .append('path')
    .datum(nested1951)
    .attr('fill', 'lightgrey')
    .attr('stroke', 'lightgrey')
    .attr('d', area)
    .lower()

  var xAxis = d3
    .axisBottom(xPositionScale)
    .tickSize(-height)
    .ticks(4)

  svg1994
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .lower()

  svg1994
    .selectAll('.x-axis line')
    .attr('stroke-dasharray', '2 2')
    .attr('line-linecap', 'round')

  // Start of SVG 4 (2005)

  var nested2005 = d3
    .nest()
    .key(d => d.diff)
    .rollup(values => d3.mean(values, v => v.freq))
    .entries(filtered2005)

  var maxFreq = d3.max(datapoints, function(d) {
    return +d.freq
  })

  yPositionScale.domain([0, maxFreq])

  var svg2005 = container
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('class', 'svg-2005')

  svg2005
    .append('path')
    .datum(nested2005)
    .attr('fill', 'orange')
    .attr('stroke', 'orange')
    .attr('d', area)

  // appending the 1951 area underneath
  svg2005
    .append('path')
    .datum(nested1951)
    .attr('fill', 'lightgrey')
    .attr('stroke', 'lightgrey')
    .attr('d', area)
    .lower()

  var xAxis = d3
    .axisBottom(xPositionScale)
    .tickSize(-height)
    .ticks(4)

  svg2005
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .lower()

  svg2005
    .selectAll('.x-axis line')
    .attr('stroke-dasharray', '2 2')
    .attr('line-linecap', 'round')
}
