(function (){
    
    const div = d3.select('div#canvas');
    const mapCanvas = d3.select('canvas#map').node()
    const mapContext = mapCanvas.getContext('2d');
    const timeLineCanvas = d3.select('canvas#time-line').node();
    const timeLineContext = timeLineCanvas.getContext('2d');

    let land;
    let nonNullMembers;
    let membersByHour;
    let membersByLocation;
    let memberLocations;
    
    d3.json("data/50m.json")
        .then(function(world){
            land = topojson.feature(world, world.objects.land);
            return d3.csv("data/dvs_challenge_1_membership_time_space.csv");
        })
        .then(function(membersRaw){
            nonNullMembers = membersRaw.filter(d=> d.lat);
            membersByLocation = d3.group(nonNullMembers, m => util.longLatToString([m.long, m.lat]));
            memberLocations = Array.from(membersByLocation.keys()).map(util.stringToLongLat);
            
            // resize the canvas to fill browser window dynamically
            window.addEventListener('resize', resizeCanvas, false);
            resizeCanvas();
        });

    function resizeCanvas() {

        const width = d3.select('body').node().offsetWidth;
        const height = d3.select('body').node().offsetHeight;

        mapCanvas.width = width;
        mapCanvas.height = height;

        timeLineCanvas.width = width;
        timeLineCanvas.height = height;

        map.init(nonNullMembers, land, width, height);
        zoom.init(div, width, height, renderMap);
        timeline.init(nonNullMembers, width, height);
        renderMap();
        renderTimeLine();
    }

    function renderMap(){
        mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
        map.drawWorld(mapContext);
        map.drawTriangles(mapContext);
    }

    function renderTimeLine(){
        timeLineContext.clearRect(0, 0, timeLineCanvas.width, timeLineCanvas.height);
        timeline.drawAxis(timeLineContext);
        timeline.drawDistribution(timeLineContext);
    }
})();