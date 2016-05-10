function drawBarChart(target, type, data, labels, verticalAxis) //types: "baseline", "capped", "overlapping", "quadratic", "rounded", "triangle", "zero"
{
    var height = 200,
        barWidth = 60,
        axisWidth = 2,
        blockHeight = 30,
        xPaddingSVG = 120,
        yPaddingSVG = 100,
        barSpacing = 20,
        radius = (barWidth - barSpacing) / 2;

    var y = d3.scale.linear()
        .domain([0, 100])
        .range([height, 0]);

    var canvas = d3.select(target)
        .attr("width", barWidth * data.length + xPaddingSVG)
        .attr("height", height + yPaddingSVG);

    var defs = canvas.append("defs").attr("id", "clip");

    var chart = canvas.append("g")
        .attr("id", "chart")
        .attr("transform", "translate(0," + yPaddingSVG / 2 + ")");

    var bar = chart.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d, i) {
            return "translate(" + ((i * barWidth) + ((xPaddingSVG / 3) * 2)) + ", 0)";
        });

    // Baseline Bars
    if (type == "baseline") {
        bar.append("rect")
            .attr("y", function(d) {
                return y(d)
            })
            .attr("width", barWidth - barSpacing)
            .attr("height", function(d) {
                return height - y(d)
            })
            .attr("fill", "#000000");
    }

    // Capped Bars
    if (type == "capped") {
        bar.append("rect")
            .attr("y", function(d) {
                return y(d)
            })
            .attr("width", barWidth - barSpacing)
            .attr("height", function(d) {
                return height - y(d)
            })
            .attr("fill", "#000000");

        bar.append("rect")
            .attr("y", function(d) {
                return y(d)
            })
            .attr("x", (barSpacing / -2) + 1)
            .attr("width", barWidth - 2)
            .attr("height", function(d) {
                if (height - y(d) < barWidth - barSpacing) {
                    return height - y(d);
                }
                return barWidth - barSpacing;
            })
            .attr("fill", "#000000");
    }

    //Quadratic Bars
    if (type == "quadratic") {
        bar.append("polygon")
            .attr("points", function(d) {
                return "-0.5,1 0.5,1 0,0"
            })
            .attr("transform", function(d) {
                return "translate(" + (barSpacing) + "," + (y(d)) + ") scale(" + ((height - y(d)) * 0.25) + "," + (height - y(d)) + ")"
            })
            .attr("fill", "#0000");
    }

    //Overlapping Bars
    if (type == "overlapping") {
        bar.append("polygon")
            .attr("points", function(d) {
                return "-0.5,1 0.5,1 0,0"
            })
            .attr("transform", function(d) {
                return "translate(" + (barSpacing) + "," + (y(d)) + ") scale(" + (barWidth + barSpacing) + "," + (height - y(d)) + ")"
            })
            .attr("fill", "#0000")
            .attr("fill-opacity", 0.5);
    }

    //Triangular Bars
    if (type == "triangle") {
        bar.append("polygon")
            .attr("points", function(d) {
                return "-0.5,1 0.5,1 0,0"
            })
            .attr("transform", function(d) {
                return "translate(" + (barSpacing) + "," + (y(d)) + ") scale(" + (barWidth - barSpacing) + "," + (height - y(d)) + ")"
            })
            .attr("fill", "#0000");
    }

    //Below Axis Blocks
    if (type == "zero") {
        bar.append("rect")
            .attr("y", function(d) {
                return y(d)
            })
            .attr("width", barWidth - barSpacing)
            .attr("height", function(d) {
                return height - y(d)
            })
            .attr("fill", "#000000");

        bar.append("rect")
            .attr("y", height)
            .attr("width", barWidth - barSpacing)
            .attr("fill", "#505050")
            .attr("height", blockHeight)
            .attr("fill-opacity", 0.5);
    }
    //Rounded Tops
    if (type == "rounded") {
        var slice = defs.selectAll("clipPath")
            .data(data)
            .enter().append("clipPath");

        slice.attr("id", function(d, i) {
            return "slice" + labels[i]
        });

        slice.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", radius * 2)
            .attr("height", function(d) {
                if (height - y(d) < radius) {
                    return height - y(d);
                }
                return radius + 1;
            })
            .attr("fill", "#000000");

        bar.append("circle")
            .attr("cx", radius)
            .attr("cy", radius)
            .attr("r", radius)
            .attr("fill", "#000000")
            .attr("transform", function(d) {
                return "translate(0," + (y(d)) + ")"
            })
            .attr("clip-path", function(d, i) {
                return "url(#slice" + labels[i] + ")"
            });

        bar.append("rect")
            .attr("y", function(d) {
                return y(d) + radius
            })
            .attr("width", barWidth - barSpacing)
            .attr("height", function(d) {
                if ((height - y(d) - radius) > 0)
                    return height - y(d) - radius;
                else
                    return 0;
            })
            .attr("fill", "#000000");
    }

    // Axes
    // Bar Labels
    bar.append("text")
        .attr("x", (barWidth - barSpacing) / 2)
        .attr("y", height + 15)
        .attr("dx", ".35em")
        .attr("fill", "#000000")
        .attr("text-anchor", "end")
        .text(function(d, i) {
            //return labels[i] + data[i];
            return labels[i];
        });

    // bar.append("circle")
    //     .attr("cx", (barWidth - barSpacing) / 2)
    //     .attr("cy", height + 15)
    //     .attr("r", 5)
    //     .attr("fill", "#FF0000");

    // X Axis
    chart.append("line")
        .attr("class", "x axis")
        .attr("x1", (axisWidth + xPaddingSVG) / 3)
        .attr("y1", height)
        .attr("x2", barWidth * data.length + xPaddingSVG - barSpacing)
        .attr("y2", height)
        .attr("stroke-width", axisWidth)
        .attr("stroke", "#000000");

    //Y Axis
    if (verticalAxis) {
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(1);

        chart.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (axisWidth + xPaddingSVG) / 3 + ", 0)")
            .attr("stroke-width", axisWidth)
            .call(yAxis);
    }
}

function chooseType(counter, offset, contig) {
    var types = ["baseline", "capped", "overlapping", "quadratic", "rounded", "triangle", "zero"];
    // console.log("counter" + counter);
    // console.log("contig" + contig);
    // console.log("(counter / contig)" + (counter / contig));
    // console.log("((counter / contig) % 1)" + ((counter / contig) % 1));
    // console.log("((counter / contig) % 1 == 0)" + ((counter / contig) % 1 == 0));
    // console.log("position = " + position)
    if (Math.floor(counter / contig) == 0) {
        done[offset % 7] = true;
        return types[offset % 7];
    } else if ((counter / contig) % 1 == 0) {
        position = offset % 7;
        while (done[position] == true) {
            position = Math.round(Math.random() * 6);
        }
        done[position] = true;
        return types[position];
    } else {
        return types[position];
    }
    //    return types[(Math.floor(counter / contig) + offset) % 7];
}

function makeData() {
    return [Math.floor(Math.random() * 95) + 3, Math.floor(Math.random() * 95) + 3, Math.floor(Math.random() * 95) + 3];
}

function padAxis(data) {
    var dataMax = d3.max(data);
    var places = 0;
    var counter = dataMax;
    while (counter > 1) {
        counter = counter / 10;
        places++;
    }
    var multiplier = Math.pow(10, (places - 1));
    return Math.ceil(dataMax / multiplier) * multiplier;
}