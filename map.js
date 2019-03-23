const map = (function(){
    let map = {};

    const triangleStrokeWidth = 2;
    const triangleSize = 8;
    const triangleScale = d3.scaleLinear().range([1,triangleSize]).domain([0, 5]);

    let members;
    let withoutAntarctica;
    let voronoi;

    function trianglePoints(member){
        let points = [
            {x:0, y:-triangleScale(member.data)},
            {x:triangleScale(member.visualization) * Math.sin(Math.PI / 3), y:0.5*triangleScale(member.visualization)},
            {x:-triangleScale(member.society) * Math.sin(Math.PI / 3), y:0.5*triangleScale(member.society)}
        ];
        return points;
    }

    map.projection = d3.geoFahey();

    map.init = function(_members, land, width, height){
        members = _members;
        withoutAntarctica = land;
        withoutAntarctica.features[0].geometry.coordinates = 
          withoutAntarctica.features[0].geometry.coordinates.filter(d => {return d[0].length !== 2539});
        map.projection.fitSize([width, height], withoutAntarctica);
        //voronoi = d3.geoVoronoi(memberLocations);
    };

    map.drawWorld = function(context){
        const geoPath = d3.geoPath(map.projection, context);
        context.beginPath();
        geoPath(withoutAntarctica);
        context.fillStyle = "#e8eae5";
        context.fill();
    }

    map.drawTriangles = function(context){
        members.forEach(member => {
            const centerPosition = map.projection([member.long, member.lat]);
            const points = trianglePoints(member).map(trianglePoint => {
                return {
                    x:trianglePoint.x + centerPosition[0],
                    y:trianglePoint.y + centerPosition[1]
                };
            });
        
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            context.lineTo(points[1].x, points[1].y);
            context.lineTo(points[2].x, points[2].y);
            context.closePath();
        
            context.strokeStyle = util.color(member);
            context.lineWidth = triangleStrokeWidth;
            context.stroke();
        });
    }

    return map;
})();