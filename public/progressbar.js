function drawProgBar(target, current, total) {
    var height = 20,
        width = 200;

    var progBar = d3.select(target)
        .attr("width", width)
        .attr("height", height);

    progBar.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("stroke-width", 2)
        .attr("fill", "#DDDDDD");

    progBar.append("rect")
        .attr("width", (current / (total - 1)) * width)
        .attr("height", height)
        .attr("fill", "#888888");
}