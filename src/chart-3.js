import * as d3 from 'd3'

// Create your margins and height/width

var margin = { top: 20, left: 45, right: 15, bottom: 20 }

var height = 220 - margin.top - margin.bottom

var width = 170 - margin.left - margin.right

// I'll give you this part!
var container = d3.select('#chart-3')

// Create your scales

var xPositionScale = d3
  .scaleLinear()
  .domain([1980, 2010])
  .range([0, width])

var yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([height, 0])

// Create your line generator

var line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.year)
  })
  .y(function(d) {
    return yPositionScale(d.income)
  })

var lineUSA = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.year)
  })
  .y(function(d) {
    return yPositionScale(d.income)
  })

// Read in your data

Promise.all([
  d3.csv(require('./middle-class-income.csv')),
  d3.csv(require('./middle-class-income-usa.csv'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Create your ready function

function ready([datapoints, datapointsUSA]) {
  var nested = d3
    .nest()
    .key(d => d.country)
    .entries(datapoints)

  // var nested_usa = d3 // don't need to nest this since it's just one country
  //   .nest()
  //   .key(d => d.country)
  //   .entries(datapointsUSA)

  console.log('nested data looks like', nested)

  console.log('datapointsUSA looks like', datapointsUSA)

  // Adding svgs for every country

  container
    .selectAll('.country-svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'country-svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      let svg = d3.select(this)
      // let countries_data = d.values
      console.log(d.values)

      svg
        .append('path')
        .datum(d.values)
        .attr('d', line)
        .attr('stroke', '#9e4b6c')
        .attr('stroke-width', 2)
        .attr('fill', 'none')

      svg
        .append('path')
        .datum(datapointsUSA)
        .attr('d', lineUSA)
        .attr('stroke', 'grey')
        .attr('stroke-width', 2)
        .attr('fill', 'none')

      svg
        .append('text')
        .datum(datapointsUSA)
        .text('USA')
        .attr('x', width - 110)
        .attr('y', height - 155)
        .attr('font-size', 10)
        .attr('text-anchor', 'left')
        .attr('fill', 'grey')
        .attr('dx', 10)

      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('fill', '#9e4b6c')
        .attr('font-weight', 'bold')
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .attr('dy', -8)

      var xAxis = d3
        .axisBottom(xPositionScale)
        .ticks(4)
        .tickSize(-height)
        .tickFormat(d3.format('d'))
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
      svg
        .selectAll('.x-axis line')
        .attr('stroke-dasharray', '2 2')
        .attr('line-linecap', 'round')
      svg.select('.x-axis .domain').remove()

      var yAxis = d3
        .axisLeft(yPositionScale)
        .tickValues([5000, 10000, 15000, 20000])
        .tickFormat(d3.format('$,d'))
        // .tickFormat(d => '$' + d)
        .tickSize(-width)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
      svg
        .selectAll('.y-axis line')
        .attr('stroke-dasharray', '2 2')
        .attr('line-linecap', 'round')
      svg.select('.y-axis .domain').remove()
    })
}

export { xPositionScale, yPositionScale, line, lineUSA, width, height }
