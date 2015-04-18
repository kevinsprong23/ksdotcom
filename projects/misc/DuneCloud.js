var fill = d3.scale.category20();
var w = Math.min(screen.width - 20, 540);
var h = Math.min(screen.height - 10, 400);

  d3.csv("http://kevinsprong.com/projects/misc/DuneCount.csv", function(data){
    d3.layout.cloud().size([w, h])
      .words(data.map(function(d){return {text: d.text, size: Math.sqrt(d.size)}; }))
      .padding(2)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();
  });
  function draw(words) {
        d3.select("#canvas").append("svg")
          .attr("width", w)
          .attr("height", h)
        .append("g")
          .attr("transform", "translate(" + w/2 + "," + h/2 + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .style("font-family", "Impact")
          .style("fill", function(d, i) { return fill(i); })
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
    }
