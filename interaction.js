const interaction = (function(){
    const i = {};
    let onSelect;
    let mapContainer;

    let selectedMembers = [];
    let members;

    const lassoSelection = lasso()
            .on('start', () => {
                timeContainer.call(brushSelection.move, null);
                i.select([]);
            })
            .on('end', lassoSelect);

    const brushSelection = d3.brushX().on("brush", brushTimeLine);

    i.init = function(_divContainer, _mapContainer, _timeContainer, _members, _onSelect, _onZoom){
        onSelect = _onSelect;
        mapContainer = _mapContainer;
        timeContainer = _timeContainer;
        members = _members;
        mapContainer.on('click', clickMap);
        timeContainer.on('click', clickTimeLine);

        mapContainer.call(lassoSelection, () => {
            return d3.event.shiftKey;
        });

        timeContainer.call(brushSelection);

        zoom.init(_divContainer, function(){
            lassoSelection.reset();
            _onZoom(arguments);
        });

        window.addEventListener('keydown', function(event){
            if(event.key === 'Shift'){
                mapContainer.style('cursor', 'crosshair');
            }
        });
        window.addEventListener('keyup', function(event){
            if(event.key === 'Shift'){
                mapContainer.style('cursor', null);
            }
        });
    }

    i.select = function(members){
        selectedMembers = members || [];
        onSelect();
    }

    i.getSelectedMembers = function(){
        return selectedMembers;
    }

    function clickMap(){
        lassoSelection.reset();
        timeContainer.call(brushSelection.move, null);
        i.select(map.getMembersAtXY(d3.event.x, d3.event.y));
    }

    function clickTimeLine() {
        lassoSelection.reset();
        i.select(timeline.getMembersAtXY(d3.event.x, d3.event.y));
    }
    
    function brushTimeLine(){
        if(d3.event.selection === null){return;}
        lassoSelection.reset();
        i.select(timeline.getMembersBetween(d3.event.selection));
    }

    function lassoSelect(lassoPolygon){
        i.select(map.getMembersInPolygon(lassoPolygon));
    }

    return i;
})();