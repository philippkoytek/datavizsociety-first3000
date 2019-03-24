const map = (function(){
    let map = {};

    const triangleStrokeWidth = 2;
    const triangleSize = 8;
    const triangleScale = d3.scaleLinear().range([1,triangleSize]).domain([0, 5]);

    let members;
    let memberLocations;
    let membersByLocation;

    let withoutAntarctica;

    let voronoi;

    let context;
    let canvas;

    function trianglePoints(member){
        let points = [
            {x:0, y:-triangleScale(member.data)},
            {x:triangleScale(member.visualization) * Math.sin(Math.PI / 3), y:0.5*triangleScale(member.visualization)},
            {x:-triangleScale(member.society) * Math.sin(Math.PI / 3), y:0.5*triangleScale(member.society)}
        ];
        return points;
    }

    map.projection = d3.geoFahey();

    map.init = function(_canvas, _members, land){
        canvas = _canvas;
        context = canvas.getContext('2d');
        members = _members;
        membersByLocation = d3.group(members, m => util.longLatToString([m.long, m.lat]));
        memberLocations = Array.from(membersByLocation.keys()).map(util.stringToLongLat);
        voronoi = d3.geoVoronoi(memberLocations);
        withoutAntarctica = land;
        withoutAntarctica.features[0].geometry.coordinates = 
          withoutAntarctica.features[0].geometry.coordinates.filter(d => {return d[0].length !== 2539});
        map.projection.fitSize([canvas.width, canvas.height], withoutAntarctica);
    };

    map.draw = function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawWorld();
        drawTriangles();
    }

    map.getMembersAtXY = function(x, y){
        const longLat = map.projection.invert([x, y]);
        const closestMember = memberLocations[voronoi.find(longLat[0], longLat[1])];
        if(util.pixelDistance([x, y], map.projection(closestMember)) < util.clickTolerance){
            return membersByLocation.get(util.longLatToString(closestMember));
        } else {
            return [];
        }
    };

    map.getMembersInPolygon = function(polygon){
        return members.filter(member => {
            const point = map.projection([member.long, member.lat]);                
            return d3.polygonContains(polygon, point);
        });
    }

    function drawWorld(){
        context.save();
        const geoPath = d3.geoPath(map.projection, context);
        context.beginPath();
        geoPath(withoutAntarctica);
        context.fillStyle = util.mapLandColor;
        context.fill();
        context.strokeStyle = util.mapWaterColor;
        context.lineWidth = 0.5;
        context.stroke();
        context.restore();
    }

    function drawTriangles(){
        let selectedMembers = interaction.getSelectedMembers();
        let drawLast = [];
        members.forEach(member => {
            if(selectedMembers.indexOf(member) !== -1){
                drawLast.push(member);
            } else {
                drawMember(member);
            }
        });
        drawLast.forEach(drawMember);
    };

    function drawMember(member){
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
    }

    return map;
})();