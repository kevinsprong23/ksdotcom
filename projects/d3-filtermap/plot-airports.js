// variables to hold button/slider status
var circlesDynamicallySized = false;
var enplanementFilterVal = 0;

// function to handle button click
function toggleEnplanementAirportSize() {
    circlesDynamicallySized = !circlesDynamicallySized;
    updateAirportRadius(enplanementFilterVal, circlesDynamicallySized);  
}

// listener for when our slider is changed
d3.select("#enplanements").on("input", function() {
  updateEnplanementFilter(+this.value);
});

function capWords(sentence) {
    return sentence.replace(/[^\w](\w)/g, 
        function(w){return w.toUpperCase();});
}

// function to handle enplanement slider movement
function updateEnplanementFilter(newEnplaneVal) { 
  // update the text slider
  d3.select("#sliderlabel").text(newEnplaneVal.toLocaleString());  
   
  // update the global var and the slider value
  enplanementFilterVal = newEnplaneVal;
  d3.select("#enplanements").property("value", newEnplaneVal);
    
  // update all the circles
  updateAirportRadius(enplanementFilterVal, circlesDynamicallySized);
}

// function to resize circles
function updateAirportRadius(enplanementFilter, circlesSized) {
    var minRadius = 2.5;
    var enplanementRadius = 0;
    
    d3.selectAll(".airport")
        .select("circle")
        .transition(400)
        .attr("r", function(d){ 
            // should use () ? : syntax here, but line width for blog!
            if (circlesSized) {
                enplanementRadius = Math.sqrt(d.enplanements) / 300.0;
            } else {
                enplanementRadius = minRadius;
            }
            
            if (d.enplanements >= enplanementFilter) {
                return Math.max(enplanementRadius, minRadius); 
            } else {
                return 0;
            }
        });   
}

function anAirportChart() {

    var width = 1100,
    height = 600;

    // functions to translate lat/lon to the svg coordinate space 
    var projection = d3.geo.albersUsa()  
        .translate([width / 2, height / 2])
        .scale(1100);
    var path = d3.geo.path()
        .projection(projection);

    // insert a master svg element into our div
    var svg = d3.select("#airportcanvas").append("svg")
        .attr("width", width)
        .attr("height", height);

    // create a d3-tip object for better mouseover effects
    var tip = d3.tip()
      .attr('class', 'd3-tip')  
      .offset([-10, 0])
      .html(function(d) {
        return "<span style='color:#268bd2'>" + 
            d.apt + "</span>" + " - " + "<span style='color:#ccc'>" + 
            d.name.charAt(0) + capWords(d.name.slice(1).toLowerCase()) + 
            "</span><br>" +
            "<span style='color:#268bd2'>2013 Enplanements: </span>" +
            d.enplanements.toLocaleString();
      });
    svg.call(tip);


    // asynchronous load of multiple datasets
    queue()
        .defer(d3.json, "http://kevinsprong.com/projects/d3-filtermap/us.json")
        .defer(d3.csv, "http://kevinsprong.com/projects/d3-filtermap/airport-data.csv")
        .await(makePlot);  // makePlot will wait until both loaded

    function makePlot(error, us, airports) {

        // d3 csv's are untyped:  need to coerce elements into numerics
        airports.forEach(function(d) {
            var aptPos = [+d.lon, +d.lat];
            var position = projection(aptPos);
            if (position == null) {
                d.x = -10;  // essentially saying don't plot these
                d.y = -10;
            } else {
                d.x = position[0];
                d.y = position[1];
            }
            
            d.enplanements = +d.enplanements;
        });

        // topojson
        svg.append("path")
          .datum(topojson.feature(us, us.objects.land))
          .attr("class", "land")
          .attr("d", path);
        svg.append("path")
          .datum(topojson.mesh(us, us.objects.states, 
                function(a, b) { return a !== b; }))
          .attr("class", "states")
          .attr("d", path);

        // use d3 to insert airports
        var airport = svg.append("g")
          .attr("class", "airportGroup")
        .selectAll("g")
          .data(airports)
        .enter().append("g")
          .attr("class", "airport")
        .append("circle")
          .attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")";})
          .attr("fill", "#268bd2") 
          .style("opacity", 0.8)
          .on('mouseover', tip.show) 
          .on('mouseout', tip.hide);

        // use d3 to set circle radius based on page variables
        updateEnplanementFilter(enplanementFilterVal); // this calls updateAirportRadius

    }
    
}

anAirportChart();