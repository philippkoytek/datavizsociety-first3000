const util = (function (){
    // UTILITY
    let u = {};
    u.stringToLongLat = str => str.split(',');
    u.longLatToString = loc => loc.join(',');

    u.mapLandColor = "#e8eae5";
    u.mapWaterColor = 'aliceblue';
    u.timelineBgColor = 'rgba(230, 237, 244, 1)';
    u.axisColor = '#666';
    u.timelineAreaHeight = 150;

    u.clickTolerance = 20;

    const selectedOpacity = 0.9;
    const defaultOpacity = 0.4;
    const unselectedColor = "rgba(206, 209, 205, 0.5)";
    u.color = function(member){
        // data rgb(45, 178, 165) hsv(174°, 75%, 70%) hsl(174°, 60%, 44%)
        // visualization rgb(221, 179, 43) hsv(46°, 81%, 87%) hsl(46°, 72%, 52%)
        // society rgb(160, 94, 156) hsv(304°, 41%, 63%) hsl(304°, 26%, 50%)
        let myOpacity = defaultOpacity;
        const selectedMembers = interaction.getSelectedMembers();
        if(selectedMembers.length > 0){
            if(selectedMembers.indexOf(member) !== -1){
                myOpacity = selectedOpacity;
            } else {
                return unselectedColor;
            }
        }
        
        
        const descendingValues = ['data', 'visualization', 'society'].sort((v1,v2) => member[v2] - member[v1]);
        const colorMap = {
            data:'rgba(45, 178, 165, '+myOpacity+')',
            visualization:'rgba(221, 179, 43, '+myOpacity+')',
            society:'rgba(160, 94, 156, '+myOpacity+')'
        };
        return colorMap[descendingValues[0]];
    }

    u.pixelDistance = function(p1, p2){
        return Math.sqrt(Math.pow((p1[0] - p2[0]),2) + Math.pow((p1[1] - p2[1]), 2));
    }

    return u;
})();