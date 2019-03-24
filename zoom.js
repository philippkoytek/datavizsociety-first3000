const zoom = (function(){
    const z = {};
    let origT;
    let origS;
    let updateCallback;

    function zoomed(){
        const newScale = d3.event.transform.k;
        const newTranslate = [newScale*origT[0] + d3.event.transform.x, newScale*origT[1] + d3.event.transform.y];
        map.projection
            .scale(origS*newScale)
            .translate(newTranslate);
        updateCallback();
    }
      
    z.init = function(container, callback){
        updateCallback = callback;
        origT = map.projection.translate();
        origS = map.projection.scale();
        const zoom = d3.zoom()
            .translateExtent([[0,0],[container.attr('width'), container.attr('height')]])
            .scaleExtent([1, 90])
            .on("zoom", zoomed); 
        container.on("zoom", null).call(zoom);
    };

    return z;  
})();