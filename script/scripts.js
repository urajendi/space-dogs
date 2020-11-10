var config = {
    "avatar_size": 100//define the size of teh circle radius
  }
  
var body = d3.select("#circle");

var svg = body.append("svg")
              .attr("width", 500)
              .attr("height", 500);

var defs = svg.append('svg:defs');

data = [{
    posx: 10,
    posy: 10,
    img: "img/paw.png",
  
    }, {
    posx: 200,
    posy: 200,
  
    img: "img/paw.png"
  }, {
    posx: 300,
    posy: 300,
  
    img: "img/paw.png"
  }, {
    posx: 400,
    posy: 400,
  
    img: "img/paw.png"
  }, {
    posx: 500,
    posy: 500,

    img: "img/paw.png"
  }, {
    posx: 600,
    posy: 600,

    img: "img/paw.png"
}]

data.forEach(function(d, i) {
    defs.append("svg:pattern")
        .attr("id", "grump_avatar" + i)
        .attr("width", config.avatar_size)
        .attr("height", config.avatar_size)
        .attr("patternUnits", "userSpaceOnUse")
        .append("svg:image")
        .attr("xlink:href", d.img)
        .attr("width", config.avatar_size)
        .attr("height", config.avatar_size)
        .attr("x", 0)
        .attr("y", 0);
    
    var circle = svg.append("circle")
        .attr("transform", "translate(" + d.posx + "," + d.posy + ")")
        .attr("cx", config.avatar_size / 2)
        .attr("cy", config.avatar_size / 2)
        .attr("r", config.avatar_size / 2)
        .attr('stroke', 'black')
        .style("fill", "#fff");
    
    })
               

