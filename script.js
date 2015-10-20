console.log("Assignment 3");

//Set up drawing environment with margin conventions
var margin = {t:20,r:20,b:50,l:50};
var width = document.getElementById('plot').clientWidth - margin.l - margin.r,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var plot = d3.select('#plot')
    .append('svg')
    .attr('width',width + margin.l + margin.r)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','plot-area')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//Initialize axes
//Consult documentation here https://github.com/mbostock/d3/wiki/SVG-Axes
var scaleX,scaleY;

var axisX = d3.svg.axis()
    .orient('bottom')
    .tickSize(-height)
    /*tickValues()*/;
var axisY = d3.svg.axis()
    .orient('left')
    .tickSize(-width)
    .tickValues([0,25,50,75,100]);


//Start importing data
d3.csv('data/world_bank_2012.csv', parse, dataLoaded);

function parse(d){


    //Eliminate records for which gdp per capita isn't available
    if(d['GDP per capita, PPP (constant 2011 international $)']=='..'){
        return;
    }

    //Check "primary completion" and "urban population" columns
    //if figure is unavailable and denoted as "..", replace it with undefined
    return{
        ctrName: d['Country Name'],
        ctrCode: d['Country Code'],
        gdpPerCap: +d['GDP per capita, PPP (constant 2011 international $)'],
        primComp: d['Primary completion rate, total (% of relevant age group)']!='..'?+d['Primary completion rate, total (% of relevant age group)']:undefined,
        urbanPop: d['Urban population (% of total)']!='..'?+d['Urban population (% of total)']:undefined

    }

    //otherwise, parse the figure into numbers

}

function dataLoaded(error, rows){
    //with data loaded, we can now mine the data
console.log(rows)

    var gdpPerCapMin = d3.min(rows, function(d){return d.gdpPerCap}),
        gdpPerCapMax = d3.max(rows, function(d){return d.gdpPerCap});

    console.log(gdpPerCapMin, gdpPerCapMax)

    //with mined information, set up domain and range for x and y scales
    //Log scale for x, linear scale for y
    //scaleX = d3.scale.log()...
    scaleX = d3.scale.log().domain([gdpPerCapMin,gdpPerCapMax]).range([0,width]),
    scaleY = d3.scale.linear().domain([0,100]).range([height,0]);

    //Draw axisX and axisY
    axisX.scale(scaleX);
    axisY.scale(scaleY);

    plot
        .append('g')
        .attr('class','axis axis-x')
        .attr('transform','translate(0,'+height+')')
        .call(axisX);

    plot
        .append('g')
        .attr('class','axis axis-y')
        .call(axisY);

    //draw <line> elements to represent countries
    //each country should have two <line> elements, nested under a common <g> element
    plot.selectAll('line')
        .data(rows)
        .enter()
        .append('line')
        .attr('x1', rows.gdpPerCap)
        .attr('y1', rows.primComp)
        .attr('x2', rows.gdpPerCap)
        .attr('y2', rows.urbanPop)
        .style('stroke','rgb(80,80,80)')
        .style('stroke-width','2px');

}

