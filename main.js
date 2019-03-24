(function (){
    
    const div = d3.select('div#canvas');
    const interactionSvg = d3.select('svg#interaction');
    const mapInteractionArea = interactionSvg.select('.map');
    const timelineInteractionArea = interactionSvg.select('.timeline');
    const mapCanvas = d3.select('canvas#map').node();
    const timeLineCanvas = d3.select('canvas#time-line').node();

    let land;
    let nonNullMembers;
    
    d3.json("data/50m.json")
        .then(function(world){
            land = topojson.feature(world, world.objects.countries);
            return d3.csv("data/dvs_challenge_1_membership_time_space.csv");
        })
        .then(function(membersRaw){
            nonNullMembers = membersRaw.filter(d=> d.lat);
            window.addEventListener('resize', resizeCanvas, false);
            div.style('background', util.mapWaterColor);
            resizeCanvas();
        });

    function resizeCanvas() {
        const bounds = d3.select('body').node().getBoundingClientRect();
        const width = bounds.width;
        const height = bounds.height;
        mapCanvas.width = width;
        mapCanvas.height = height;
        timeLineCanvas.width = width;
        timeLineCanvas.height = height;
        div.attr('width', width).attr('height', height);
        interactionSvg.attr('width', width).attr('height', height);
        mapInteractionArea.select('rect')
            .attr('width', width)
            .attr('height', height - util.timelineAreaHeight);
        timelineInteractionArea.attr('transform', 'translate(0, ' + (height - util.timelineAreaHeight) + ')')
            .select('rect')
            .attr('width', width)
            .attr('height', util.timelineAreaHeight);

        map.init(mapCanvas, nonNullMembers, land);
        timeline.init(timeLineCanvas, nonNullMembers);
        
        interaction.init(interactionSvg, mapInteractionArea, timelineInteractionArea, nonNullMembers, render, renderMap);

        render();
    }

    function render(){
        renderMap();
        renderTimeLine();
    }

    function renderMap(){
        map.draw();
    }

    function renderTimeLine(){
        timeline.draw();
    }
})();