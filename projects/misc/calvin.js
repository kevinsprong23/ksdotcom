/* Set the diagrams Height & Width */
var w = Math.min(screen.width - 20, 540);
var h = Math.min(screen.height - 10, 400);

/* Set the color scale we want to use */
var color = d3.scale.category10();
/* Establish/instantiate an SVG container object */
var svg = d3.select("#canvas")
                .append("svg")
                .attr("height",h)
                .attr("width",w);

/* Pre-Load the json data using the queue library */
queue()
    .defer(d3.json, "http://kevinsprong.com/projects/misc/chNodes.json")
    .defer(d3.json, "http://kevinsprong.com/projects/misc/chEdges.json")
    .await(makeDiag); 
/* Define the main worker or execution function */
function makeDiag(error, nodesIn, linksIn, table) {

    /* Establish the dynamic force behavor of the nodes */
    var force = d3.layout.force()
                    .nodes(nodesIn)
                    .links(linksIn)
                    .size([w,h])
                    .linkDistance([120])
                    .charge([-400])
                    .start();


    /* Draw the edges/links between the nodes */
    var edges = svg.selectAll("line")
                    .data(linksIn)
                    .enter()
                .append("line")
                    .style("stroke", "#ccc")
                    .style("stroke-width", function(d){return 2*Math.sqrt(d.weight);});

    edges.append("title")
      .text(function(d) { return d.weight + " panels with " + d.source.name + " and " + d.target.name;});

    /* Draw the nodes themselves */                
    var nodes = svg.selectAll("circle")
                    .data(nodesIn)
                    .enter()
                  .append("circle")
                    .attr("r", function(d){return Math.max(2*Math.sqrt(d.words), 7);})
                    .attr("opacity", 1)
                    .style("fill", function(d,i) { return color(i); })
                    .call(force.drag);

    var texts = svg.selectAll("text")
                    .data(nodesIn)
                    .enter()
                .append("text")
                    .attr("fill", "#252525")
                    .attr("font-family", "Impact")
                    .attr("font-size", function(d) {return Math.max(Math.sqrt(d.words),18) + "px";})
                    .text(function(d) { return d.name; }); 

    nodes.append("title")
      .text(function(d) { return d.name + ", " + d.words + " words spoken"; });

    /* Run the Force effect */
    force.on("tick", function() {
               edges.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });
               nodes.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
               texts.attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")";});
               }); // End tick func
}; // End makeDiag worker func