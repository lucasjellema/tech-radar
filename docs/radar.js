// The MIT License (MIT)

// Copyright (c) 2017 Zalando SE

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

export { radar_visualization, getSectorForCoordinates }
import { drawBlips, translate, showBubble, hideBubble } from './modules/radar_blips.js'
// radial_min / radial_max are multiples of PI
const quadrants = [
  { radial_min: 0, radial_max: 0.5, factor_x: 1, factor_y: 1 },
  { radial_min: 0.5, radial_max: 1, factor_x: -1, factor_y: 1 },
  { radial_min: -1, radial_max: -0.5, factor_x: -1, factor_y: -1 },
  { radial_min: -0.5, radial_max: 0, factor_x: 1, factor_y: -1 }
];

const rings = [
  { radius: 130 },
  { radius: 220 },
  { radius: 310 },
  { radius: 400 },
  { radius: 490 }
];

const title_offset =
  { x: -675, y: -420 };

const footer_offset =
  { x: -675, y: 420 };

const legend_offset = [
  { x: 450, y: 90 },
  { x: -675, y: 90 },
  { x: -675, y: -310 },
  { x: 450, y: -310 }
];

// where to position the images representing the quadrants (if they are there)
const legend_image_offset = [
  { x: 280, y: 300 },
  { x: -400, y: 300 },
  { x: -400, y: -400 },
  { x: 280, y: -400 }
];

let configuration;

const getSectorForCoordinates = function (x, y) { // determine from the X and Y the associated ring and quadrant
  const polarCoords = polar({ x: x - 720, y: y - 500 }) // r relates to ring, t to sector
  // take polarCoord.t, divide by PI and find the quadrant whose radial_min and max surround it
  polarCoords.piNormalizedAngle = polarCoords.t / Math.PI
  const sector = {}
  for (let i = 0; i < quadrants.length; i++) {
    if (quadrants[i].radial_min <= polarCoords.piNormalizedAngle && quadrants[i].radial_max >= polarCoords.piNormalizedAngle)
      sector.quadrant = i
  }
  for (let i = 0; i < rings.length; i++) {
    if (polarCoords.r < rings[i].radius) {
      sector.ring = i
      break
    }
  }
  return sector;
}

function polar(cartesian) {
  var x = cartesian.x;
  var y = cartesian.y;
  return {
    t: Math.atan2(y, x),
    r: Math.sqrt(x * x + y * y)
  }
}


function radar_visualization(config) {
  configuration = config
  // custom random number generator, to make random sequence reproducible
  // source: https://stackoverflow.com/questions/521295
  var seed = 42;
  function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  function random_between(min, max) {
    return min + random() * (max - min);
  }

  function normal_between(min, max) {
    return min + (random() + random()) * 0.5 * (max - min);
  }



  function cartesian(polar) {
    return {
      x: polar.r * Math.cos(polar.t),
      y: polar.r * Math.sin(polar.t)
    }
  }

  function bounded_interval(value, min, max) {
    var low = Math.min(min, max);
    var high = Math.max(min, max);
    return Math.min(Math.max(value, low), high);
  }

  function bounded_ring(polar, r_min, r_max) {
    return {
      t: polar.t,
      r: bounded_interval(polar.r, r_min, r_max)
    }
  }

  function bounded_box(point, min, max) {
    return {
      x: bounded_interval(point.x, min.x, max.x),
      y: bounded_interval(point.y, min.y, max.y)
    }
  }

  function segment(quadrant, ring) {
    var polar_min = {
      t: quadrants[quadrant].radial_min * Math.PI,
      r: ring === 0 ? 30 : rings[ring - 1].radius
    };
    var polar_max = {
      t: quadrants[quadrant].radial_max * Math.PI,
      r: rings[ring].radius
    };
    var cartesian_min = {
      x: 15 * quadrants[quadrant].factor_x,
      y: 15 * quadrants[quadrant].factor_y
    };
    var cartesian_max = {
      x: rings[3].radius * quadrants[quadrant].factor_x,
      y: rings[3].radius * quadrants[quadrant].factor_y
    };
    return {
      clipx: function (d) {
        var c = bounded_box(d, cartesian_min, cartesian_max);
        var p = bounded_ring(polar(c), polar_min.r + 15, polar_max.r - 15);
        d.x = cartesian(p).x; // adjust data too!
        return d.x;
      },
      clipy: function (d) {
        var c = bounded_box(d, cartesian_min, cartesian_max);
        var p = bounded_ring(polar(c), polar_min.r + 15, polar_max.r - 15);
        d.y = cartesian(p).y; // adjust data too!
        return d.y;
      },
      random: function () {
        return cartesian({
          t: random_between(polar_min.t, polar_max.t),
          r: normal_between(polar_min.r, polar_max.r)
        });
      }
    }
  }

  // position each entry randomly in its segment
  for (var i = 0; i < config.getEntries().length; i++) {
    var entry = config.getEntries()[i];
    entry.segment = segment(config.getQuadrant(entry), config.getRing(entry));
    var point = entry.segment.random();
    entry.x = point.x;
    entry.y = point.y;
    entry.color = entry.active || config.print_layout ?
      config.rings[config.getRing(entry)].color : config.colors.inactive;
  }

  // partition entries according to segments
  var segmented = new Array(4);
  for (var quadrant = 0; quadrant < 4; quadrant++) {
    segmented[quadrant] = new Array(4);
    for (var ring = 0; ring < 4; ring++) {
      segmented[quadrant][ring] = [];
    }
  }
  for (var i = 0; i < config.getEntries().length; i++) {
    var entry = config.getEntries()[i];
    segmented[config.getQuadrant(entry)][config.getRing(entry)].push(entry);
  }

  // assign unique sequential id to each entry
  var id = 1;
  for (var quadrant of [2, 3, 1, 0]) {
    for (var ring = 0; ring < 4; ring++) {
      var entries = segmented[quadrant][ring];
      entries.sort(function (a, b) { return a.label.localeCompare(b.label); })
      for (var i = 0; i < entries.length; i++) {
        entries[i].id = "" + id++;
      }
    }
  }


  function viewbox(quadrant) {
    return [
      Math.max(0, quadrants[quadrant].factor_x * 400) - 420,
      Math.max(0, quadrants[quadrant].factor_y * 400) - 420,
      440,
      440
    ].join(" ");
  }

  // remove any existing content in the SVG element 
  // this allow for a clean refresh - when controls governing the visualization have changed 
  const currentSVG = document.getElementById(config.svg_id);
  if (currentSVG.firstChild) {
    currentSVG.removeChild(currentSVG.firstChild)
  }

  // draw the radar and its contents
  var svg = d3.select("svg#" + config.svg_id)
    .style("background-color", config.colors.background)
    .attr("width", config.width)
    .attr("height", config.height);

  var radar = svg.append("g");
  if ("zoomed_quadrant" in config) {
    svg.attr("viewBox", viewbox(config.zoomed_quadrant));
  } else {
    radar.attr("transform", translate(config.width / 2, config.height / 2));
  }

// add the new blip button
//      <a id="plusButton" href="#" onclick="addBlip()">
/* n<g transform="
translate(1350 20) scale(0.8)
">
<Circle id="addBlipButton" cx="30" cy="30" r="25" stroke="black" fill="green" stroke-width="3" />
<line x1="14" y1="30" x2="46" y2="30" stroke-width="5" stroke="white"></line>
<line x1="30" y1="14" x2="30" y2="46" stroke-width="5" stroke="white"></line>
</g>
</a>*/
const addButton = radar.append("g")
             .attr("id","plusBlipButton")
             .attr("transform", `translate(${config.width / 2 -100 } ${-1 * config.height / 2}) scale(0.8)`)
             .on("click", addBlip);
 addButton.append("circle")
      .attr("r", 25)
      .attr("cx", 30)            
      .attr("cy", 30)         
      .attr("stroke","black")   
      .attr("stroke-width",3)   
      .attr("fill","green")
      addButton.append("line")
      .attr("x1", 14)
      .attr("y1", 30)            
      .attr("x2", 46)         
      .attr("y2", 30)            
      .attr("stroke","white")   
      .attr("stroke-width",5)   
      addButton.append("line")
      .attr("x1", 30)
      .attr("y1", 14)            
      .attr("x2", 30)         
      .attr("y2", 46)            
      .attr("stroke","white")   
      .attr("stroke-width",5)   
            
  var grid = drawRadarGrid(radar, config);
  drawRings(rings, grid, config);
  if (config.print_layout) {
    drawLegend(radar, translate, title_offset, config, footer_offset, legend_offset, ring, segmented, showBubble, highlightLegendItem, hideBubble, unhighlightLegendItem);
  }

  // layer for entries
  var rink = radar.append("g")
    .attr("id", "rink");

  initializeTextBalloon(radar);
  let blips = drawBlips(config, rink, segmented, legend_offset)

  // make sure that blips stay inside their segment
  function ticked() {
    blips.attr("transform", function (d) {
      return translate(d.segment.clipx(d), d.segment.clipy(d));
    })
  }

  // distribute blips, while avoiding collisions
  d3.forceSimulation()
    .nodes(config.getEntries())
    .velocityDecay(0.19) // magic number (found by experimentation)
    .force("collision", d3.forceCollide().radius(12).strength(0.85))
    .on("tick", ticked);
} //end of function radar_visualization




// here the font color, font family and font size for the bubble or balloon is defined
function initializeTextBalloon(radar) {
  var bubble = radar.append("g")
    .attr("id", "bubble")
    .attr("x", 0)
    .attr("y", 0)
    .style("opacity", 0)
    .style("pointer-events", "none")
    .style("user-select", "none");
  bubble.append("rect")
    .attr("rx", 4)
    .attr("ry", 4)
    .style("fill", "#333") // color of balloon
    ;
  bubble.append("text")
    .attr("id", "b1-text")
    .style("font-family", "sans-serif")
    .style("font-size", "10px")
    .style("fill", "#fff");
  bubble.append("text")
    .attr("id", "b2-text")
    .style("font-family", "sans-serif")
    .style("font-size", "10px")
    .style("fill", "#fff");
  bubble.append("path") // add the little pointer from the text balloon to the blip
    .attr("d", "M 0,0 10,0 5,8 z")
    .style("fill", "#333");
}

function drawLegend(radar, translate, title_offset, config, footer_offset, legend_offset, ring, segmented, showBubble, highlightLegendItem, hideBubble, unhighlightLegendItem) {
  radar.append("text")
    .attr("transform", translate(title_offset.x, title_offset.y))
    .text(config.title)
    .style("font-family", "Arial, Helvetica")
    .style("font-size", "34px");

  // footer
  radar.append("text")
    .attr("transform", translate(footer_offset.x, footer_offset.y))
    .text("▲ moved up     ▼ moved down")
    .attr("xml:space", "preserve")
    .style("font-family", "Arial, Helvetica")
    .style("font-size", "10px");

  // legend
  var legend = radar.append("g");
  for (var quadrant = 0; quadrant < 4; quadrant++) {
    legend.append("text")
      .attr("transform", translate(
        legend_offset[quadrant].x,
        legend_offset[quadrant].y - 45
      ))
      .text(config.quadrants[quadrant].name)
      .style("font-family", "Arial, Helvetica")
      .style("font-size", "18px");
    if (config.quadrants[quadrant].image) { // if there is an image associated with the quadrant, display it
      legend.
        append('image')
        .attr('xlink:href', config.quadrants[quadrant].image)
        .attr('width', 100)
        .attr("transform", translate(
          legend_image_offset[quadrant].x,
          legend_image_offset[quadrant].y
        ))
    }

    for (var ring = 0; ring < 4; ring++) {
      legend.append("text")
        .attr("transform", legend_transform(quadrant, ring, segmented))
        .text(config.rings[ring].name)
        .style("font-family", "Arial, Helvetica")
        .style("font-size", "12px")
        .style("font-weight", "bold");
      legend.selectAll(".legend" + quadrant + ring)
        .data(segmented[quadrant][ring])
        .enter()
        .append("a")
        .attr("href", function (d, i) {
          return d.link ? d.link : "#"; // stay on same page if no link was provided
        })
        .append("text")
        .attr("transform", function (d, i) { return legend_transform(quadrant, ring, segmented, i); })
        .attr("class", "legend" + quadrant + ring)
        .attr("id", function (d, i) { return "legendItem" + d.id; })
        .text(function (d, i) { return d.id + ". " + d.label; })
        .style("font-family", "Arial, Helvetica")
        .style("font-size", "11px")
        .on("mouseover", function (d) { showBubble(d); highlightLegendItem(d); })
        .on("mouseout", function (d) { hideBubble(d); unhighlightLegendItem(d); });
    }
  }

}

function drawRings(rings, grid, config) {
  for (let i = 0; i < rings.length; i++) {
    grid.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", rings[i].radius)
      .style("fill", "none")
      .style("stroke", config.colors.grid)
      .style("stroke-width", 1);
    if (config.print_layout) {
      grid.append("text")
        .text(config.rings[i].name)
        .attr("y", -rings[i].radius + 62)
        .attr("text-anchor", "middle")
        .style("fill", "#e5e5e5")
        .style("font-family", "Arial, Helvetica")
        .style("font-size", "42px")
        .style("font-weight", "bold")
        .style("pointer-events", "none")
        .style("user-select", "none");
    }
  }
}

function drawRadarGrid(radar, config) {
  var grid = radar.append("g");

  // draw grid lines
  grid.append("line")
    .attr("x1", 0).attr("y1", -400)
    .attr("x2", 0).attr("y2", 400)
    .style("stroke", config.colors.grid)
    .style("stroke-width", 1);
  grid.append("line")
    .attr("x1", -400).attr("y1", 0)
    .attr("x2", 400).attr("y2", 0)
    .style("stroke", config.colors.grid)
    .style("stroke-width", 1);

  // background color. Usage `.attr("filter", "url(#solid)")`
  // SOURCE: https://stackoverflow.com/a/31013492/2609980
  var defs = grid.append("defs");
  var filter = defs.append("filter")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 1)
    .attr("height", 1)
    .attr("id", "solid");
  filter.append("feFlood")
    .attr("flood-color", "rgb(0, 0, 0, 0.8)");
  filter.append("feComposite")
    .attr("in", "SourceGraphic");
  return grid;
}



function legend_transform(quadrant, ring, segmented, index = null) {
  var dx = ring < 2 ? 0 : 120;
  var dy = (index == null ? -16 : index * 12);
  if (ring % 2 === 1) {
    dy = dy + 36 + segmented[quadrant][ring - 1].length * 12;
  }
  return translate(
    legend_offset[quadrant].x + dx,
    legend_offset[quadrant].y + dy
  );
}




function highlightLegendItem(d) {
  var legendItem = document.getElementById("legendItem" + d.id);
  legendItem.setAttribute("filter", "url(#solid)");
  legendItem.setAttribute("fill", "white");
}

function unhighlightLegendItem(d) {
  var legendItem = document.getElementById("legendItem" + d.id);
  legendItem.removeAttribute("filter");
  legendItem.removeAttribute("fill");
}

