const util = (function (){
    // UTILITY
    let u = {};
    u.stringToLongLat = str => str.split(',');
    u.longLatToString = loc => loc.join(',');

    const opacity = 0.5;
    u.color = function(member){
        // data rgb(45, 178, 165) hsv(174°, 75%, 70%) hsl(174°, 60%, 44%)
        // visualization rgb(221, 179, 43) hsv(46°, 81%, 87%) hsl(46°, 72%, 52%)
        // society rgb(160, 94, 156) hsv(304°, 41%, 63%) hsl(304°, 26%, 50%)
        let myOpacity = opacity;
        
        //if(selectedMembers.indexOf(member) !== -1){
        //    myOpacity = 1;
        //}
        
        const descValues = ['data', 'visualization', 'society'].sort((v1,v2) => member[v2] - member[v1]);
        const colorMap = {
            data:'rgba(45, 178, 165, '+myOpacity+')',
            visualization:'rgba(221, 179, 43, '+myOpacity+')',
            society:'rgba(160, 94, 156, '+myOpacity+')'
        };
        return colorMap[descValues[0]];
    }
    return u;
})();