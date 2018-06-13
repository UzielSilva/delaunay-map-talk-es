var delaunayLoaded = false;
document.addEventListener("delaunay", function() {
    if(!delaunayLoaded){

        var svg = d3.select("#canvas-delaunay").on("touchmove mousemove", moved),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        var sites = d3.range(100)
            .map(function(d) { return [Math.random() * width, Math.random() * height]; });

        var voronoi = d3.voronoi();

        var triangle = svg.append("g")
            .attr("class", "triangles")
        .selectAll("path")
        .data(voronoi.triangles(sites))
        .enter().append("path")
            .call(redrawTriangle);

        var link = svg.append("g")
            .attr("class", "links")
        .selectAll("line")
        .data(voronoi.links(sites))
        .enter().append("line")
            .call(redrawLink);

        var site = svg.append("g")
            .attr("class", "sites")
        .selectAll("circle")
        .data(sites)
        .enter().append("circle")
            .attr("r", 2.5)
            .call(redrawSite);

        function moved() {
        sites[0] = d3.mouse(this);
        redraw();
        }

        function redraw() {
        var diagram = voronoi(sites);
        triangle = triangle.data(diagram.triangles()), triangle.exit().remove();
        triangle = triangle.enter().append("path").merge(triangle).call(redrawTriangle);
        link = link.data(diagram.links()), link.exit().remove();
        link = link.enter().append("line").merge(link).call(redrawLink);
        site = site.data(sites).call(redrawSite);
        }

        function redrawTriangle(triangle) {
        triangle
            .classed("primary", function(d) { return d[0] === sites[0] || d[1] === sites[0] || d[2] === sites[0]; })
            .attr("d", function(d) { return "M" + d.join("L") + "Z"; });
        }

        function redrawLink(link) {
        link
            .classed("primary", function(d) { return d.source === sites[0] || d.target === sites[0]; })
            .attr("x1", function(d) { return d.source[0]; })
            .attr("y1", function(d) { return d.source[1]; })
            .attr("x2", function(d) { return d.target[0]; })
            .attr("y2", function(d) { return d.target[1]; });
        }

        function redrawSite(site) {
        site
            .attr("cx", function(d) { return d[0]; })
            .attr("cy", function(d) { return d[1]; });
        }
        delaunayLoaded = true;
    }
});