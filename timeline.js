const timeline = (function(){
    const t = {};
    
    
    const timeLineMargin = {left:10, right:10, bottom:20, top:10};
    const timeLineHeight = 10;
    const timeScale = d3.scaleTime().nice(d3.timeDay, 1);
    const axisColor = util.axisColor;
    const pointRadius = 2;
    const pointsPadding = pointRadius*0.2;

    const hourFormat = d3.timeFormat("%m/%d/%Y %H");

    let memberTimestamps;
    let membersByHour;

    let context;
    let canvas;
    let height;
    let interactionHeight = util.timelineAreaHeight;
    let bgGradient;

    t.init = function(_canvas, _members){
        canvas = _canvas;
        height = canvas.height;
        context = canvas.getContext('2d');

        memberTimestamps = _members.map(m => new Date(m.date_with_hour + ':00'));
        membersByHour = d3.group(_members, m => hourFormat(new Date(m.date_with_hour + ':00')));

        bgGradient = context.createLinearGradient(0, canvas.height-interactionHeight, 0, canvas.height);
        bgGradient.addColorStop(0, "rgba(255,255,255,0)");
        bgGradient.addColorStop(0.3, util.timelineBgColor);

        const dateExtent = d3.extent(memberTimestamps);
        timeScale
            .domain([d3.timeDay.floor(dateExtent[0]), dateExtent[1]]) //[d3.timeDay.floor(dateExtent[0]), dateExtent[1]]
            .range([timeLineMargin.left, canvas.width-timeLineMargin.right]);
    }

    t.draw = function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawAxis();
        drawDistribution();
    }

    t.getMembersAtXY = function(x,y){
        const time = timeScale.invert(x);
        return membersByHour.get(hourFormat(time));
    }

    t.getMembersBetween = function(xRange){
        const time1 = timeScale.invert(xRange[0]);
        const time2 = timeScale.invert(xRange[1]);
        const selectedHours = Array.from(membersByHour.keys()).filter((hour) => {
            const date = new Date(hour + ':00');
            return date >= time1 && date <= time2;
        });
        return selectedHours.map(hour => {return membersByHour.get(hour)}).flat();
    }

    function drawAxis (){
        const ticks = timeScale.ticks(d3.timeDay.every(1));
        const formatDate = d3.timeFormat("%b %d");
        context.save();
        context.fillStyle = bgGradient;
        context.fillRect(0, canvas.height-interactionHeight, canvas.width, interactionHeight);
        context.restore();
        context.strokeStyle = axisColor;
        context.fillStyle = axisColor;
        ticks.forEach(date => {
          strokeStraightLine(context, [timeScale(date), height - timeLineMargin.bottom], [timeScale(date), height - timeLineMargin.bottom - timeLineHeight]);
          context.fillText(formatDate(date), timeScale(date) + 2, height - timeLineMargin.bottom);
        });
      }

    function drawDistribution (){
        let selectedMembers = interaction.getSelectedMembers();
        let drawLast = [];
        membersByHour.forEach((members, hour) => {
            const timestamp = new Date(hour + ':00');
            members.forEach((member, i) => {
                if(selectedMembers.indexOf(member) !== -1){
                    drawLast.push({member:member, position:i, timestamp:timestamp});
                } else {
                    drawMember(member, i, timestamp);
                }
            });
        });
        drawLast.forEach((drawObj) => drawMember(drawObj.member, drawObj.position, drawObj.timestamp));
    }

    function drawMember(member, i, timestamp) {
        context.beginPath();
        context.fillStyle = util.color(member);
        const yBottom = height - timeLineMargin.bottom - timeLineHeight - 2*pointRadius - pointsPadding;
        const y = yBottom - i*(pointRadius*2+pointsPadding);
        context.arc(timeScale(timestamp), y, pointRadius, 0, Math.PI * 2);
        context.fill();
    }

    function strokeStraightLine(context, p1, p2){
        context.beginPath();
        context.moveTo(p1[0], p1[1]);
        context.lineTo(p2[0], p2[1]);
        context.stroke();
    }

    return t;
})();