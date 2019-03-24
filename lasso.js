// from: https://bl.ocks.org/pbeshai/8008075f9ce771ee8be39e8c38907570
function lasso() {
    const dispatch = d3.dispatch('start', 'end');

    const polyLine = d3.line();
    
    // distance last point has to be to first point before it auto closes when mouse is released
    let closeDistance = 75;
    
    function lasso(root, filter) {
        // append a <g> with a rect
        const g = root;//.append('g').attr('class', 'lasso-group');
        const bbox = root.node().getBoundingClientRect();
        const area = g.append('rect')
            .attr('width', bbox.width)
            .attr('height', bbox.height)
            .attr('fill', 'tomato')
            .attr('opacity', 0);
    
        const drag = d3.drag()
            .on('start', handleDragStart)
            .on('drag', handleDrag)
            .on('end', handleDragEnd)
            .filter(filter);
    
        area.call(drag);
    
        let lassoPolygon;
        let lassoPath;
        let closePath;
    
        function handleDragStart() {
            lassoPolygon = [d3.mouse(this)];
            if (lassoPath) {
                lassoPath.remove();
            }
        
            lassoPath = g
                .append('path')
                .attr('fill', '#0bb')
                .attr('fill-opacity', 0.1)
                .attr('stroke', '#0bb')
                .attr('stroke-dasharray', '3, 3');
        
            closePath = g
                .append('line')
                .attr('x2', lassoPolygon[0][0])
                .attr('y2', lassoPolygon[0][1])
                .attr('stroke', '#0bb')
                .attr('stroke-dasharray', '3, 3')
                .attr('opacity', 0);
        
            dispatch.call('start', lasso, lassoPolygon);
        }
    
        function handleDrag() {
            const point = d3.mouse(this);
            lassoPolygon.push(point);
            lassoPath.attr('d', polyLine(lassoPolygon));
        
            // indicate if we are within closing distance
            if (util.pixelDistance(lassoPolygon[0], lassoPolygon[lassoPolygon.length - 1]) < closeDistance) {
                closePath
                .attr('x1', point[0])
                .attr('y1', point[1])
                .attr('opacity', 1);
            } else {
                closePath.attr('opacity', 0);
            }
        }
    
        function handleDragEnd() {
            // remove the close path
            closePath.remove();
            closePath = null;
        
            // succesfully closed
            if (util.pixelDistance(lassoPolygon[0], lassoPolygon[lassoPolygon.length - 1]) < closeDistance) {
                lassoPath.attr('d', polyLine(lassoPolygon) + 'Z');
                dispatch.call('end', lasso, lassoPolygon);
        
                // otherwise cancel
            } else {
                lassoPath.remove();
                lassoPath = null;
                lassoPolygon = null;
            }
        }
    
        lasso.reset = () => {
            if (lassoPath) {
                lassoPath.remove();
                lassoPath = null;
            }
        
            lassoPolygon = null;
            if (closePath) {
                closePath.remove();
                closePath = null;
            }
        };
    }
    
    lasso.on = (type, callback) => {
        dispatch.on(type, callback);
        return lasso;
    };
    
    return lasso;
}