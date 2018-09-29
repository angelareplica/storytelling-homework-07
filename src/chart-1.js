import * as d3 from 'd3'

// Set up margin/height/width

var margin = { top: 30, left: 30, right: 100, bottom: 30 }

var height = 600 - margin.top - margin.bottom

var width = 450 - margin.left - margin.right

// Add your svg

var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

// Create a time parser (see hints)

let parseTime = d3.timeParse('%B-%y')

// Create your scales

var xPositionScale = d3
  .scaleLinear()
  // .domain(['January-2016', 'December-2017'])
  .range([0, width])

var yPositionScale = d3
  .scaleLinear()
  // .domain([0, 400])
  .range([height, 0])

var colorScale = d3
  .scaleOrdinal()
  .range([
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#F9F871'
  ])

// Create a d3.line function that uses your scales

var line = d3
  .line()
  .x(d => {
    return xPositionScale(d.datetime)
  })
  .y(d => {
    return yPositionScale(d.price)
  })

// Read in your housing price data

d3.csv(require('./housing-prices.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

// Write your ready function

function ready(datapoints) {
  console.log(datapoints)

  // Convert your months to dates

  datapoints.forEach(d => {
    d.datetime = parseTime(d.month)
  })

  // Get a list of dates and a list of prices

  let dates = datapoints.map(d => +d.datetime)

  let prices = datapoints.map(d => +d.price)

  xPositionScale.domain(d3.extent(dates))

  yPositionScale.domain(d3.extent(prices))

  // Group your data together

  var nested = d3
    .nest()
    .key(d => d.region)
    .entries(datapoints)

  console.log('nested data looks like', nested)

  svg
    .selectAll('.region-line')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'region-line')
    .attr('d', d => {
      return line(d.values)
    })
    .attr('stroke', d => {
      return colorScale(d.key)
    })
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .lower()

  svg
    .selectAll('.region-circle')
    .data(nested)
    .attr('class', 'region-circle')
    .enter()
    .append('circle')
    .attr('cx', d => {
      return xPositionScale(d.values[0].datetime)
    })
    .attr('cy', d => {
      return yPositionScale(d.values[0].price)
    })
    .attr('r', 3)
    .attr('fill', d => colorScale(d.key))

  svg
    .selectAll('.region-label')
    .data(nested)
    .enter()
    .append('text')
    .attr('class', 'region-label')
    .attr('x', d => xPositionScale(d.values[0].datetime))
    .attr('y', d => yPositionScale(d.values[0].price))
    .text(d => d.key)
    .attr('font-size', 11)
    .attr('dx', 5)
    .attr('alignment-baseline', 'middle')

  svg
    .append('text')
    .text('U.S. housing prices fall in winter')
    .attr('x', width / 2)
    .attr('y', 0)
    .attr('font-size', 20)
    .attr('text-anchor', 'middle')
    .attr('dy', -15)

  svg
    .append('rect')
    .data(nested)
    .attr(
      'width',
      d =>
        xPositionScale(d.values[5].datetime) -
        xPositionScale(d.values[7].datetime)
    )
    .attr('height', height)
    // .attr('x', 190)
    .attr('x', d => xPositionScale(d.values[7].datetime))
    .attr('y', 0)
    .attr('fill', 'lightgray')
    .lower()

  // Add your text on the right-hand side

  // Add your title

  // Add the shaded rectangle

  // Add your axes

  var xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat('%b-%y'))

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  var yAxis = d3.axisLeft(yPositionScale)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
