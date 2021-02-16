export {drawBlips, translate, hideBubble, showBubble}


// this function shows the text balloon with contents and determines its size
// here we can add content to the text balloon, such as rationale, logo, description, 
const showBubble = function (d) {
    if (d.active || getCurrentConfiguration().print_layout) {
      var tooltip = d3.select("#bubble text")
        .text(d.label)
        ;
      var bbox = tooltip.node().getBBox();
      d3.select("#bubble")
        .attr("transform", translate(d.x - bbox.width / 2, d.y - 16))
        .style("opacity", 0.8);
      d3.select("#bubble rect")
        .attr("x", -5)
        .attr("y", -bbox.height)
        .attr("width", bbox.width + 10)
        .attr("height", bbox.height + 4);
      d3.select("#bubble path")
        .attr("transform", translate(bbox.width / 2 - 5, 3));
    }
  }
  
// this function determines what the radius should be for the circle to be drawn for this entry
// note: the original value for all blips was 9
const originalBlipRadius = 9
const getCircleRadiusForBlip = function (entry) {
  // here we can use properties of the entry to increase or decrease the size of the blip
  let radius = originalBlipRadius
  if (entry.importance) {
    radius = radius * entry.importance
  }
  return radius
}

let legend_offset

const drawBlips = function (config, rink, segmented, the_legend_offset) {
    legend_offset = the_legend_offset
  var blips = rink.selectAll(".blip")
    .data(config.getEntries())
    .enter()
    .append("g")
    .attr("class", "blip")
    .attr("transform", function (d, i) { return legend_transform(d.quadrant, d.ring, segmented, i); })
    .on("click", function (d) { showModal(d); })
    .on("mouseover", function (d) { showBubble(d); highlightLegendItem(d); })
    .on("mouseout", function (d) { hideBubble(d); unhighlightLegendItem(d); });

  // configure each blip
  blips.each(function (d) {
    var blip = d3.select(this);

    // blip link
    if (!config.print_layout && d.active && d.hasOwnProperty("link")) {
      blip = blip.append("a")
        .attr("xlink:href", d.link);
    }


    if (config.blip_displayStyle == "logos" && d.logo) {
        blip.append('image')
          .attr('xlink:href', d.logo)
          .attr('width', 80)
          .attr('height', 40)
          .attr("x", "-40")   // if on left side, then move to the left, if on the right side then move to the right
          .attr("y", "-15")
      }
    else if (config.blip_displayStyle == "text" || (!d.logo && config.blip_displayStyle == "logos" ) ) {  
        blip.append("text")
          .text(d.label)
          .attr("x", -30)  // if on left side, then move to the left, if on the right side then move to the right
          .attr("y", -5)  // if on upper side, then move up, if on the down side then move down
          .attr("text-anchor", "middle")
          .style("fill", "#000")
          .style("font-family", "Arial, Helvetica")
          .style("font-size", function (d) { return d.label.length > 2 ? "15px" : "17px"; })
          .style("pointer-events", "none")
          .style("user-select", "none")
      }
    
    else { // blip_displayStyle == "shapes" is assumed here
      // here the shape to be drawn is determined, including its size
      // todo: stop sign for entries no longer used?
      // blip shape
      if (d.moved > 0) {
        blip.append("path")
          .attr("d", "M -11,5 11,5 0,-13 z") // triangle pointing up
          .style("fill", d.color);
      } else if (d.moved < 0) {
        blip.append("path")
          .attr("d", "M -11,-5 11,-5 0,13 z") // triangle pointing down
          .style("fill", d.color);
      } else {
        blip.append("circle")
          .attr("r", getCircleRadiusForBlip(d)) // here we can determine the size of the circle - based on the properties of the entry
          .attr("fill", d.color)
      }
    }

    // blip text to be printed inside the shape - currently the randomly assigned sequence number
    if (d.active || config.print_layout) {
      var blip_text = config.print_layout ? d.id : d.label.match(/[a-z]/i);
      blip.append("text")
        .text(blip_text)
        .attr("y", 3)
        .attr("text-anchor", "middle")
        .style("fill", "#fff")
        .style("font-family", "Arial, Helvetica")
        .style("font-size", function (d) { return blip_text.length > 2 ? "8px" : "9px"; })
        .style("pointer-events", "none")
        .style("user-select", "none");
    }
  });
  return blips
}


function hideBubble(d) {
  var bubble = d3.select("#bubble")
    .attr("transform", translate(0, 0))
    .style("opacity", 0);
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
  

  
function translate(x, y) {
    return "translate(" + x + "," + y + ")";
  }
  