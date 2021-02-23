export { drawBlips, translate, hideBubble, showBubble }


// this function shows the text balloon with contents and determines its size
// here we can add content to the text balloon, such as rationale, logo, description, 
const showBubble = function (d) {
    if (d.active || getCurrentConfiguration().print_layout) {
        const bubbleText = getCurrentConfiguration().getBubbleText ? getCurrentConfiguration().getBubbleText(d) : d.label
        var tooltip = d3.select("#bubble text")
            .text(bubbleText)
            ;
        var bbox = tooltip.node().getBBox();
        d3.select("#bubble")
            .attr("transform", translate(d.x - bbox.width / 2, d.y - 22))
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

const originalBlipRadius = 9

let legend_offset

const drawBlips = function (config, rink, segmented, the_legend_offset) {
    legend_offset = the_legend_offset
    var blips = rink.selectAll(".blip")
        .data(config.getEntries())
        .enter()
        .append("g")
        .attr("class", "blip")
        .attr("transform", function (d, i) { return legend_transform(config.getQuadrant(d), config.getRing(d), segmented, i); })
        .on("dblclick", function (d) { showModal(d); })
        .on("mouseover", function (d) { showBubble(d); highlightLegendItem(d); })
        .on("mouseout", function (d) { hideBubble(d); unhighlightLegendItem(d); })

        .on('contextmenu', function (d) {
            d3.event.preventDefault();
            menu(d3.event.pageX, d3.event.pageY, d, this);
        })

    // configure each blip
    blips.each(function (d) {
        var blip = d3.select(this);
        blip = drawBlip(blip, d, config);

    });
    return blips
}


function drawBlip(blip, d, config) {
    blip.attr("class", "draggable-group");
    blip.attr("id", d.label); // make blip SVG element refer to the entry; can also (better) be done through a meaningless but unique identifer added to all entries

    // blip link
    if (!config.print_layout && d.active && d.hasOwnProperty("link")) {
        blip = blip.append("a")
            .attr("xlink:href", d.link);
    }


    if (config.blip_displayStyle == "logos" && d.logo) {
        let image = blip.append('image')
            .attr('xlink:href', d.logo)
            .attr('width', 80)
            .attr('height', 40)
            .attr("x", "-40") // if on left side, then move to the left, if on the right side then move to the right
            .attr("y", "-15");
            // scale logo with factor derived from size
            if (getCurrentConfiguration().getSize != null) {
                let scaleFactor = 1;
                if (getCurrentConfiguration().getSize(d) == 0)
                    scaleFactor = 0.6;
                if (getCurrentConfiguration().getSize(d) > 1)
                    scaleFactor = 1 + (getCurrentConfiguration().getSize(d) - 1) / 5;
                scaleFactor = scaleFactor * 1.3;
                image.attr("transform", `scale(${scaleFactor} ${scaleFactor})`); // derive scale based on SIZE of entryAmbition
            }
    }

    // svg text properties: https://vanseodesign.com/web-design/svg-text-font-properties/ 
    else if (config.blip_displayStyle == "text" || (!d.logo && config.blip_displayStyle == "logos")) {
        let fontSize = 15
        if (getCurrentConfiguration().getSize != null) {
            let scaleFactor = 1;
            if (getCurrentConfiguration().getSize(d) == 0)
                scaleFactor = 0.6;
            if (getCurrentConfiguration().getSize(d) > 1)
                scaleFactor = 1 + (getCurrentConfiguration().getSize(d) - 1) / 2;
            
            fontSize = Math.round(fontSize * scaleFactor)
        }
        blip.append("text")
            .text(d.label.length > 10 ? d.label.split(" ")[0] : d.label)
            .attr("x", 0) // if on left side, then move to the left, if on the right side then move to the right
            .attr("y", -5) // if on upper side, then move up, if on the down side then move down
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "before-edge")
            .style("fill", "#000")
            .style("font-family", "Arial, Helvetica")
            .style("font-stretch", "extra-condensed")
            .style("font-size", function (d) { return d.label.length > 2 ? `${fontSize}px` : "17px"; })
            .style("user-select", "none");
        if (d.label.length > 10)
            blip.append("text")
                .text(d.label.split(" ")[1]) //  break at space and write second line
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "before-edge")
                .style("font-size", function (d) { return d.label.length > 2 ? `${fontSize}px` : "17px"; })
                .attr("x", 0) // if on left side, then move to the left, if on the right side then move to the right
                .attr("y", -14 + fontSize); // if on upper side, then move up, if on the down side then move down
    }

    else { // blip_displayStyle == "shapes" is assumed here
        // here the shape to be drawn is determined, including its size
        // todo: stop sign for entries no longer used?
        // blip shape
        let requiredShape = "circle";
        let shape
        if (getCurrentConfiguration().getShape) {
            requiredShape = getCurrentConfiguration().getShape(d);
        }
        // square, diamond, triangleRight, triangleLeft, rectUp, star 
        if (requiredShape == "triangleUp") {
            shape = blip.append("path")
                .attr("d", "M -11,5 11,5 0,-13 z"); // triangle pointing up
        } else if (requiredShape == "triangleDown") {
            shape = blip.append("path")
                .attr("d", "M -11,-5 11,-5 0,13 z"); // triangle pointing down
        }
        else if (requiredShape == "star") {
            const star = d3.symbol().type(d3.symbolStar).size(350);
            shape = blip.append("path")
                .attr("d", star)
        }
        else if (requiredShape == "rectUp") {
            shape = blip.append('rect')
                .attr('width', 8)
                .attr('height', 26)
                .attr('x', -4)
                .attr('y', -13)
        }
        else if (requiredShape == "diamond") {
            const diamond = d3.symbol().type(d3.symbolDiamond).size(350);
            shape = blip.append("path")
                .attr("d", diamond)
        }
        else if (requiredShape == "square") {
            const square = d3.symbol().type(d3.symbolSquare).size(350);
            shape = blip.append("path")
                .attr("d", square)
        }  else if (requiredShape == "triangleRight") {
            const triangleRight = d3.symbol().type(d3.symbolTriangle).size(350);
            shape = blip.append("path")
                .attr("d", triangleRight) //TODO make right pointing
        }

        else {
            shape = blip.append("circle")
                .attr("r", originalBlipRadius);
        }



        if (getCurrentConfiguration().getColor)
            shape.attr("fill", getCurrentConfiguration().getColor(d));
        else
            shape.attr("fill", d.color);

        if (getCurrentConfiguration().getSize != null) {
            let scaleFactor = 1;
            if (getCurrentConfiguration().getSize(d) == 0)
                scaleFactor = 0.7;
            if (getCurrentConfiguration().getSize(d) > 1)
                scaleFactor = 1 + (getCurrentConfiguration().getSize(d) - 1) / 2;
            scaleFactor = scaleFactor * 1.3;
            shape.attr("transform", `scale(${scaleFactor} ${scaleFactor})`); // derive scale based on SIZE of entryAmbition
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
    }
    return blip;
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

function contextMenu() {


    function menu(x, y, entry, blip) {
        const config = getCurrentConfiguration()
        d3.select('.context-menu').remove();
        //   scaleItems();

        // Draw the menu
        const contextMenu = d3.select("svg#radar")
            .append('g').attr('class', 'context-menu')
            .attr('x', x)
            .attr('y', y)

        contextMenu.append('rect')
            .attr('x', x)
            .attr('y', y - 50)
            .attr('width', 200)
            .attr('height', 160)
            .attr('class', 'rect')
            .attr("style", "fill:silver;")

        if (config.blipColors != null) {
            contextMenu.append('text')
                .text(config.blipColors.colorTitle)
                .style("fill", "black")
                .attr('x', x + 5)
                .attr('y', y - 30)
            const colorBox = contextMenu.append('g').attr('class', 'context-menu')
                .attr('x', x)
                .attr('y', y - 10)

            let i = 0
            for (const colorOption in config.blipColors.colorOptions) {
                colorBox.append('circle')
                    .attr("r", 15)
                    .attr("fill", config.blipColors.colorOptions[colorOption])
                    .attr("cx", x + 25 + i * 38)
                    .attr("cy", y - 10)
                    .attr("class", "clickableProperty")
                    .on("click", () => {
                        if (config.handleColorPick) {
                            config.handleColorPick(entry, config.blipColors.colorOptions[colorOption])
                            refreshRadar()
                        }
                    })
                // now add bubble text based on colorOption

                i++
            }
        }
        contextMenu.append('text')
            .text(config.blipSizes.sizeTitle)
            .style("fill", "black")
            .attr('x', x + 5)
            .attr('y', y + 20)

        const sizeBox = contextMenu.append('g').attr('class', 'context-menu')
            .attr('x', x)
            .attr('y', y + 35)

        const sizes = [0, 1, 2, 3]
        for (let i = 0; i < sizes.length; i++) {
            if (i == 0) {
                sizeBox.append('circle') // invisible circle to make it easier for user to click on small disc
                    .attr("r", 6)
                    .attr("fill", "silver")
                    .attr("cx", x + 15)
                    .attr("cy", y + 35)
                    .attr("class", "clickableProperty")
                    .on("click", () => {
                        console.log(`clicked small for ${entry.label}`)
                        if (getCurrentConfiguration().handleSizePick) {
                            getCurrentConfiguration().handleSizePick(entry, 0)
                            refreshRadar()
                        }
                    })
            }
            sizeBox.append('circle')
                .attr("r", 4 * (i + 1))
                .attr("fill", "black")
                .attr("cx", x + 15 + i * 35)
                .attr("cy", y + 35)
                .attr("class", "clickableProperty")
                .on("click", () => {
                    console.log(`clicked ${i} for ${entry.label}`)
                    if (getCurrentConfiguration().handleSizePick) {
                        getCurrentConfiguration().handleSizePick(entry, i)
                        refreshRadar()
                    }
                })
        }

        contextMenu.append('text')
            .text(config.blipShapes.shapeTitle)
            .style("fill", "black")
            .attr('x', x + 5)
            .attr('y', y + 65)

        const shapeBox = contextMenu.append('g').attr('class', 'context-menu')
            .attr('x', x)
            .attr('y', y + 65)
        let i = 0

        for (const shapeOption in config.blipShapes.shapeOptions) {
            let shape = null
            let desiredShape = config.blipShapes.shapeOptions[shapeOption]
            let transform = ""
            let posX = x + (i + 1) * 45 - 20
            let posY = y + 90
            const triangle = d3.symbol().type(d3.symbolTriangle).size(350);

            if (desiredShape == "triangleUp") {
                shape = shapeBox.append("path")
                    .attr("d", triangle)
                    ;
            }

            // cater for circle, square, diamond, .. 
            if (desiredShape == "circle") {
                shape = shapeBox.append('circle')
                    .attr("r", 13)
                    .attr("cx", posX) // TODO proper value
                    .attr("cy", posY)
            }

            if (desiredShape == "square") {
                shape = shapeBox.append('rect')
                   .attr('x', -13) // TODO correct
                   .attr('y', -15)
                    .attr('width', 26)
                    .attr('height', 26)
            }

            if (desiredShape == "triangleRight") {
                shape = shapeBox.append("path")
                    .attr("d", triangle)
                    ;
                transform = `rotate(90 ${posX} ${posY - 2}) `
            }
            if (desiredShape == "triangleDown") {
                shape = shapeBox.append("path")
                    .attr("d", triangle)
                transform = `rotate(-180 ${posX} ${posY - 4})`

            }
            if (desiredShape == "diamond") {
                shape = shapeBox.append('rect')
                    .attr('width', 20)
                    .attr('height', 20)

                transform = `rotate(45 ${posX + 15} ${posY - 13})`
            }
            if (desiredShape == "star") {
                const star = d3.symbol().type(d3.symbolStar).size(350);
                shape = shapeBox.append("path")
                    .attr("d", star)
                    ;

            }
            if (desiredShape == "triangleLeft") {
                shape = shapeBox.append("path")
                    .attr("d", triangle)
                transform = `rotate(-90 ${posX} ${posY}) `
            }
            if (desiredShape == "rectUp") {
                shape = shapeBox.append('rect')
                    //            .attr('x', x + 120)
                    //          .attr('y', y + 108)
                    .attr('width', 8)
                    .attr('height', 26)
            }
            // fill it up and move it to the right place
            if (shape != null) {
                shape.attr("style", "fill:white")
                    .attr("transform", `${transform} translate(${posX},${posY})`)
                decorateShape(shape, entry, desiredShape);
            }
            i++
        }
       
        // built in D3 symbols http://using-d3js.com/05_10_symbols.html
        // d3.symbolCross - A cross or plus
        // d3.symbolDiamond - A diamond
        // d3.symbolSquare - A square
        // d3.symbolStar - A 5 point star
        // d3.symbolTriangle - An equilateral triangle
        // d3.symbolWye - A wye or Latin Y

        // Other interactions
        d3.select('body')
            .on('click', function () {
                d3.select('.context-menu').remove();
            });


        function decorateShape(shape, entry, shapeLabel) {
            shape.attr("class", "clickableProperty")
                .on("click", () => {
                    console.log(`clicked ${shapeLabel} for ${entry.label}`);
                    if (getCurrentConfiguration().handleShapePick) {
                        getCurrentConfiguration().handleShapePick(entry, shapeLabel);
                        refreshRadar();
                    }
                });
        }
    }

    return menu;
}
var menu = contextMenu();