var margin = {top: 50, right: 50, bottom: 50, left: 50},
width = 800 - margin.left - margin.right,
height = 800 - margin.top - margin.bottom;

d3.csv("http://kevinsprong.com/projects/statemetrics/statemetrics.csv", function(error, data) {

    // process data
    data.forEach(function(d) {
        d.obamamargin = Math.round(+d.obamamargin / 0.01) * 0.01;
        d.pctdegree = +d.pctdegree;
        d.population = +d.population;
        d.taxed = Math.round(+d.taxed / 0.1) * 0.1;
        d.spent = Math.round(+d.spent / 0.1) * 0.1;
    });


    // plot variables
    var x = d3.scale.log().range([0, width]);
    var y = d3.scale.log().range([height, 0]);
    x.domain(d3.extent(data, function(d) { return d.spent; })).nice();
    y.domain(d3.extent(data, function(d) { return d.taxed; })).nice();
    var r = d3.scale.linear()
        .domain([0, 20])
        .range([2, 30]);
    var c = d3.scale.linear()
        .domain([-0.4, 0, 0.4])
        .range(["#dc322f", "#f7f7f7", "#268bd2"]);


    // axes
    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left");


    // d3-tip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 70])
        .html(function(d) {
            return "<span class='statename'>" + d.name + "</span><br>Population: " + d.population.toLocaleString() + 
                "<br>2013 federal spending: $" + d.spent.toFixed(1) + " Billion" + 
                "<br>2013 federal tax revenue: $" + d.taxed.toFixed(1) + " Billion" +
                "<br>Obama 2012 margin of victory: " + Math.round(100 * d.obamamargin) + "%";
        });

    // insert the svg
    var svg = d3.select("#datacanvas")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(tip);


    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .attr("fill", "#c9c8b8")
        .style("text-anchor", "end")
        .text("Federal spending allocated to state ($B)");


    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("fill", "#c9c8b8")
        .style("text-anchor", "end")             
        .text("Federal taxes collected from state ($B)");    

    svg.append("line")
        .attr("x1", function(d){ return x(1); })
        .attr("x2", function(d){ return x(1000); })
        .attr("y1", function(d){ return y(1); })
        .attr("y2", function(d){ return y(1000); })
        .attr("stroke", "#999");

    // data
    svg.selectAll(".datapoint")
        .data(data)
      .enter().append("circle")
        .attr("class", "datapoint")
        .attr("r", function(d){ return r(Math.sqrt(d.population/100000)); })
        .attr("cx", function(d){ return x(d.spent); })
        .attr("cy", function(d){ return y(d.taxed); })
        .style("fill", function(d){ return c(d.obamamargin); })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide); 



});