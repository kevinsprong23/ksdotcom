var transLength = 600; // ms

var ptRad = 4; // px?    
    
var margin = {top: 60, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.format("d"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    
var xVal = function(d) { return x(d.Year); };
    
var yValIncMs = function(d) { return y(d.IncomeMS); };
var yValMorMs = function(d) { return y(d.MortgageMS); };
var yValRentMs = function(d) { return y(d.RentMS); };
    
var yValIncSu = function(d) { return y(d.IncomeSU); };
var yValMorSu = function(d) { return y(d.MortgageSU); };
var yValRentSu = function(d) { return y(d.RentSU); };
    
var yValIncEs = function(d) { return y(d.IncomeES); };
var yValMorEs = function(d) { return y(d.MortgageES); };
var yValRentEs = function(d) { return y(d.RentES); };
    
var yValIncNo = function(d) { return y(d.IncomeNO); };
var yValMorNo = function(d) { return y(d.MortgageNO); };
var yValRentNo = function(d) { return y(d.RentNO); };
    
var yValIncPl = function(d) { return y(d.IncomePL); };
var yValMorPl = function(d) { return y(d.MortgagePL); };
var yValRentPl = function(d) { return y(d.RentPL); };
    
var lineIncMs = d3.svg.line()
    .x(xVal)
    .y(yValIncMs);
var lineMorMs = d3.svg.line()
    .x(xVal)
    .y(yValMorMs);
var lineRentMs = d3.svg.line()
    .x(xVal)
    .y(yValRentMs);
var lineIncSu = d3.svg.line()
    .x(xVal)
    .y(yValIncSu);
var lineMorSu = d3.svg.line()
    .x(xVal)
    .y(yValMorSu);
var lineRentSu = d3.svg.line()
    .x(xVal)
    .y(yValRentSu);
var lineIncEs = d3.svg.line()
    .x(xVal)
    .y(yValIncEs);
var lineMorEs = d3.svg.line()
    .x(xVal)
    .y(yValMorEs);
var lineRentEs = d3.svg.line()
    .x(xVal)
    .y(yValRentEs);
var lineIncNo = d3.svg.line()
    .x(xVal)
    .y(yValIncNo);
var lineMorNo = d3.svg.line()
    .x(xVal)
    .y(yValMorNo);
var lineRentNo = d3.svg.line()
    .x(xVal)
    .y(yValRentNo);
var lineIncPl = d3.svg.line()
    .x(xVal)
    .y(yValIncPl);
var lineMorPl = d3.svg.line()
    .x(xVal)
    .y(yValMorPl);
var lineRentPl = d3.svg.line()
    .x(xVal)
    .y(yValRentPl);

    
    
    
var svg = d3.select("#canvas").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("http://kevinsprong.com/projects/bostonhousing/acs_data_adjust.csv", function(error, data) {
  data.forEach(function(d) {
    d.Year = +d.Year
    
    d.IncomeMS = +d.IncomeMS;
    d.MortgageMS = +d.MortgageMS;
    d.RentMS = +d.RentMS;
      
    d.IncomeSU = +d.IncomeSU;
    d.MortgageSU = +d.MortgageSU;
    d.RentSU = +d.RentSU;
      
    d.IncomeNO = +d.IncomeNO;
    d.MortgageNO = +d.MortgageNO;
    d.RentNO = +d.RentNO;
      
    d.IncomeES = +d.IncomeES;
    d.MortgageES = +d.MortgageES;
    d.RentES = +d.RentES;
      
    d.IncomePL = +d.IncomePL;
    d.MortgagePL = +d.MortgagePL;
    d.RentPL = +d.RentPL;
      
  });

  x.domain([2002, 2012]);
  y.domain([0, 9500]);
    
  // ADD THE AXES
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Dollars (2014 inflation-adjusted)");

  // ADD THE LINES
  var line1group = svg.append("g")
      .attr("class", "income");
  var line2group = svg.append("g")
      .attr("class", "mortgage");
  var line3group = svg.append("g")
      .attr("class", "rent");
  
  line1group.append("path")
      .attr("class", "line1")
      .datum(data)
      .attr("d", lineIncMs);   
  
  line2group.append("path")
      .attr("class", "line2")
      .datum(data)
      .attr("d", lineMorMs);
    
  line3group.append("path")
      .attr("class", "line3")
      .datum(data)
      .attr("d", lineRentMs);

  // ADD THE CIRCLES
  svg.selectAll(".incdots")
      .data(data)
    .enter().append("circle")
      .attr("class", "incdots income")
      .attr("r", ptRad)
      .attr("cx", xVal)
      .attr("cy", yValIncMs)
    .append("svg:title")
      .attr("class", "inctitle")
      .text(function(d) { return "Median Gross Income: $" + Math.round(d.IncomeMS) + " / mo."; });
    
  svg.selectAll(".mortdots")
      .data(data)
    .enter().append("circle")
      .attr("class", "mortdots mortgage")
      .attr("r", ptRad)
      .attr("cx", xVal)
      .attr("cy", yValMorMs)
    .append("svg:title")
      .attr("class", "morttitle")
      .text(function(d) { return "Median Mortgage: $" + Math.round(d.MortgageMS) + " / mo.\n" +  Math.round(100 * d.MortgageMS / d.IncomeMS) + " percent of median gross income."; });
    
  svg.selectAll(".rentdots")
      .data(data)
    .enter().append("circle")
      .attr("class", "rentdots rent")
      .attr("r", ptRad)
      .attr("cx", xVal)
      .attr("cy", yValRentMs)
    .append("svg:title")
      .attr("class", "renttitle")
      .text(function(d) { return "Median Rent: $" + Math.round(d.RentMS) + " / mo.\n" +  Math.round(100 * d.RentMS / d.MortgageMS) + " percent of median mortgage."; });
    
  // ADD THE TEXT 
  svg.append("text")
     .attr("x", x(2006))
     .attr("y", y(6000))
     .attr("class", "incometxt")
     .text("Gross Income");
  svg.append("text")
     .attr("x", x(2006))
     .attr("y", y(3100))
     .attr("class", "mortgagetxt")
     .text("Mortgage");
  svg.append("text")
     .attr("x", x(2006))
     .attr("y", y(700))
     .attr("class", "renttxt")
     .text("Rent");  
    
  svg.append("text")
     .attr("x", x(2002.5))
     .attr("y", y(9100))
     .attr("class", "county")
     .text("Middlesex County");  
    
  d3.select("#MS")
     .style("background", "#167bb2");
    
  
});

function transitionMI() {
    d3.selectAll(".line1") 
    .transition()
      .duration(transLength)
      .attr("d", lineIncMs);
    d3.selectAll(".incdots") 
    .transition()
      .duration(1.05 * transLength)
     .attr("cy", yValIncMs);

    d3.selectAll(".line2") 
    .transition()
      .duration(transLength)
      .attr("d", lineMorMs);
    d3.selectAll(".mortdots") 
    .transition()
      .duration(1.05 * transLength)
     .attr("cy", yValMorMs);
    
    d3.selectAll(".line3")
    .transition()
      .duration(transLength)
      .attr("d", lineRentMs);
    d3.selectAll(".rentdots") 
    .transition()
      .duration(1.05 * transLength)
     .attr("cy", yValRentMs);
    
    d3.selectAll(".county") 
    .transition()
      .duration(1.05 * transLength)
     .text("Middlesex County");
    
    d3.selectAll(".inctitle") 
      .text(function(d) { return "Median Gross Income: $" + Math.round(d.IncomeMS) + " / mo."; });
    d3.selectAll(".morttitle") 
      .text(function(d) { return "Median Mortgage: $" + Math.round(d.MortgageMS) + " / mo.\n" +  Math.round(100 * d.MortgageMS / d.IncomeMS) + " percent of median gross income."; });
    d3.selectAll(".renttitle") 
      .text(function(d) { return "Median Rent: $" + Math.round(d.RentMS) + " / mo.\n" +  Math.round(100 * d.RentMS / d.MortgageMS) + " percent of median mortgage."; });
    
    // style the buttons
    d3.select("#MS")
      .style("background", "#167bb2");
    d3.select("#SU")
      .style("background", "#444");
    d3.select("#ES")
      .style("background", "#444");
    d3.select("#NO")
      .style("background", "#444");
    d3.select("#PL")
      .style("background", "#444");
}

function transitionSU() {
    d3.selectAll(".line1") 
    .transition()
      .duration(transLength)
      .attr("d", lineIncSu);
    d3.selectAll(".incdots") 
    .transition()
      .duration(1.05 * transLength)
     .attr("cy", yValIncSu);
    
    d3.selectAll(".line2") 
    .transition()
      .duration(transLength)
      .attr("d", lineMorSu);
    d3.selectAll(".mortdots") 
    .transition()
      .duration(1.05 * transLength)
     .attr("cy", yValMorSu);
    
    d3.selectAll(".line3")
    .transition()
      .duration(transLength)
      .attr("d", lineRentSu);
    d3.selectAll(".rentdots") 
    .transition()
      .duration(1.05 * transLength)
     .attr("cy", yValRentSu);
    
    d3.selectAll(".county") 
    .transition()
      .duration(1.05 * transLength)
     .text("Suffolk County");
    
    d3.selectAll(".inctitle") 
      .text(function(d) { return "Median Gross Income: $" + Math.round(d.IncomeSU) + " / mo."; });
    d3.selectAll(".morttitle") 
      .text(function(d) { return "Median Mortgage: $" + Math.round(d.MortgageSU) + " / mo.\n" +  Math.round(100 * d.MortgageSU / d.IncomeSU) + " percent of median gross income."; });
    d3.selectAll(".renttitle") 
      .text(function(d) { return "Median Rent: $" + Math.round(d.RentSU) + " / mo.\n" +  Math.round(100 * d.RentSU / d.MortgageSU) + " percent of median mortgage."; });
    
    // style the buttons
    d3.select("#MS")
      .style("background", "#444");
    d3.select("#SU")
      .style("background", "#167bb2");
    d3.select("#ES")
      .style("background", "#444");
    d3.select("#NO")
      .style("background", "#444");
    d3.select("#PL")
      .style("background", "#444");
}

function transitionNO() {
    d3.selectAll(".line1") 
    .transition()
      .duration(transLength)
      .attr("d", lineIncNo);
    d3.selectAll(".incdots") 
    .transition()
      .duration(1.05 * transLength)
     .attr("cy", yValIncNo);
    
    d3.selectAll(".line2") 
    .transition()
      .duration(transLength)
      .attr("d", lineMorNo);
    d3.selectAll(".mortdots") 
    .transition()
      .duration(1.05 * transLength)
     .attr("cy", yValMorNo);
    
    d3.selectAll(".line3")
    .transition()
      .duration(transLength)
      .attr("d", lineRentNo);
    d3.selectAll(".rentdots") 
    .transition()
      .duration(1.05 * transLength)
     .attr("cy", yValRentNo);
    
    d3.selectAll(".county") 
    .transition()
      .duration(1.05 * transLength)
     .text("Norfolk County");
    
    d3.selectAll(".inctitle") 
      .text(function(d) { return "Median Gross Income: $" + Math.round(d.IncomeNO) + " / mo."; });
    d3.selectAll(".morttitle") 
      .text(function(d) { return "Median Mortgage: $" + Math.round(d.MortgageNO) + " / mo.\n" +  Math.round(100 * d.MortgageNO / d.IncomeNO) + " percent of median gross income."; });
    d3.selectAll(".renttitle") 
      .text(function(d) { return "Median Rent: $" + Math.round(d.RentNO) + " / mo.\n" +  Math.round(100 * d.RentNO / d.MortgageNO) + " percent of median mortgage."; });
    
    // style the buttons
    d3.select("#MS")
      .style("background", "#444");
    d3.select("#SU")
      .style("background", "#444");
    d3.select("#ES")
      .style("background", "#444");
    d3.select("#NO")
      .style("background", "#167bb2");
    d3.select("#PL")
      .style("background", "#444");
}
    
function transitionES() {
    d3.selectAll(".line1") 
    .transition()
      .duration(transLength)
      .attr("d", lineIncEs);
    d3.selectAll(".incdots") 
    .transition()
      .duration(1.05 * transLength)
     .attr("cy", yValIncEs);
    
    d3.selectAll(".line2") 
    .transition()
      .duration(transLength)
      .attr("d", lineMorEs);
    d3.selectAll(".mortdots") 
    .transition()
      .duration(1.05 * transLength)
     .attr("cy", yValMorEs);
    
    d3.selectAll(".line3")
    .transition()
      .duration(transLength)
      .attr("d", lineRentEs);
    d3.selectAll(".rentdots") 
    .transition()
      .duration(1.05 * transLength)
     .attr("cy", yValRentEs);
    
    d3.selectAll(".county") 
    .transition()
      .duration(1.05 * transLength)
     .text("Essex County");
    
    d3.selectAll(".inctitle") 
      .text(function(d) { return "Median Gross Income: $" + Math.round(d.IncomeES) + " / mo."; });
    d3.selectAll(".morttitle") 
      .text(function(d) { return "Median Mortgage: $" + Math.round(d.MortgageES) + " / mo.\n" +  Math.round(100 * d.MortgageES / d.IncomeES) + " percent of median gross income."; });
    d3.selectAll(".renttitle") 
      .text(function(d) { return "Median Rent: $" + Math.round(d.RentES) + " / mo.\n" +  Math.round(100 * d.RentES / d.MortgageES) + " percent of median mortgage."; });
    
    // style the buttons
    d3.select("#MS")
      .style("background", "#444");
    d3.select("#SU")
      .style("background", "#444");
    d3.select("#ES")
      .style("background", "#167bb2");
    d3.select("#NO")
      .style("background", "#444");
    d3.select("#PL")
      .style("background", "#444");
}
    
function transitionPL() {
    // move the data
    d3.selectAll(".line1") 
    .transition()
      .duration(transLength)
      .attr("d", lineIncPl);
    d3.selectAll(".incdots") 
    .transition()
      .duration(1.05 * transLength)
     .attr("cy", yValIncPl);
    
    d3.selectAll(".line2") 
    .transition()
      .duration(transLength)
      .attr("d", lineMorPl);
    d3.selectAll(".mortdots") 
    .transition()
      .duration(1.05 * transLength)
     .attr("cy", yValMorPl);
    
    d3.selectAll(".line3")
    .transition()
      .duration(transLength)
      .attr("d", lineRentPl);
    d3.selectAll(".rentdots") 
    .transition()
      .duration(1.05 * transLength)
     .attr("cy", yValRentPl);
    
    // chart title
    d3.selectAll(".county") 
    .transition()
      .duration(1.05 * transLength)
     .text("Plymouth County");
    
    // style the mouseovers
    d3.selectAll(".inctitle") 
      .text(function(d) { return "Median Gross Income: $" + Math.round(d.IncomePL) + " / mo."; });
    d3.selectAll(".morttitle") 
      .text(function(d) { return "Median Mortgage: $" + Math.round(d.MortgagePL) + " / mo.\n" +  Math.round(100 * d.MortgagePL / d.IncomePL) + " percent of median gross income."; });
    d3.selectAll(".renttitle") 
      .text(function(d) { return "Median Rent: $" + Math.round(d.RentPL) + " / mo.\n" +  Math.round(100 * d.RentPL / d.MortgagePL) + " percent of median mortgage."; });
    
    // style the buttons
    d3.select("#MS")
      .style("background", "#444");
    d3.select("#SU")
      .style("background", "#444");
    d3.select("#ES")
      .style("background", "#444");
    d3.select("#NO")
      .style("background", "#444");
    d3.select("#PL")
      .style("background", "#167bb2");
}
