const timeline = (function(){
    const t = {};
    
    
    const timeLineMargin = {left:10, right:10, bottom:20, top:10};
    const timeScale = d3.scaleTime().nice(d3.timeDay, 1);
    const axisColor = '#666';
    const timeLineHeight = 10;
    const pointRadius = 2;
    const pointsPadding = pointRadius*0.2;

    let members;
    let memberTimestamps;
    let membersByHour;

    let height;

    t.init = function(_members, width, _height){
        memberTimestamps = _members.map(m => new Date(m.date_with_hour + ':00'));
        membersByHour = d3.group(_members, m => m.date_with_hour);
        members = _members;

        const dateExtent = d3.extent(memberTimestamps);
        height = _height;
        timeScale
        .domain([d3.timeDay.floor(dateExtent[0]), dateExtent[1]]) //[d3.timeDay.floor(dateExtent[0]), dateExtent[1]]
        .range([timeLineMargin.left, width-timeLineMargin.right]);
    }

    t.drawAxis = function(context){
        const ticks = timeScale.ticks(d3.timeDay.every(1));
        const formatDate = d3.timeFormat("%b %d");
        context.strokeStyle = axisColor;
        context.fillStyle = axisColor;
        ticks.forEach(date => {
          context.beginPath();
          context.moveTo(timeScale(date), height - timeLineMargin.bottom);
          context.lineTo(timeScale(date), height - timeLineMargin.bottom - timeLineHeight);
          context.stroke();
          context.fillText(formatDate(date), timeScale(date) + 2, height - timeLineMargin.bottom);
        });
      }

    t.drawDistribution = function(context){
        membersByHour.forEach((members, hour) => {
            const timestamp = new Date(hour + ':00');
            members.forEach((member, i) => {
                context.beginPath();
                context.fillStyle = util.color(member);
                const yBottom = height - timeLineMargin.bottom - timeLineHeight - 2*pointRadius - pointsPadding;
                const y = yBottom - i*(pointRadius*2+pointsPadding);
                context.arc(timeScale(timestamp), y, pointRadius, 0, Math.PI * 2);
                context.fill();
            });
        });
    }

      return t;
})();