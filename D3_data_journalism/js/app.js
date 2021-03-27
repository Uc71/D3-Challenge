var wide=parseInt(d3.select("#scatter").style("width"));
var high=wide-wide/3.9;
var edge=20;
var label=110;
var bottom=40;
var left=40;
var svg=d3
  .select("#scatter")
  .append("svg")
  .attr("width",wide)
  .attr("height",high)
  .attr("class","chart");
var r;
function crGet(){
  if (wide<=530){
    r=5;
  }
  else{
    r=10;
  }
}
crGet();
svg.append("g").attr("class","xText");
var xtext=d3.select(".xText");
function xTextRefresh(){
  xtext.attr(
    "transform",
    "translate("+((wide-label)/2+label)+", "+(high-edge-bottom)+")"   
  );
}
xTextRefresh();
xtext
  .append("text")
  .attr("y",-26)
  .attr("data-name","poverty")
  .attr("data-axis","x")
  .attr("class","aText active x")
  .text("% in Poverty");
xtext
  .append("text")
  .attr("y",0)
  .attr("data-name","age")
  .attr("data-axis","x")
  .attr("class","aText inactive x")
  .text("Median Age");
xtext
  .append("text")
  .attr("y",26)
  .attr("data-name","income")
  .attr("data-axis","x")
  .attr("class","aText inactive x")
  .text("Median Household Income");
var leftxtext=edge+left;
var leftytext=(high+label)/2-label;
svg.append("g").attr("class","yText");
var ytext=d3.select(".yText");
function yTextRefresh(){
  ytext.attr(
    "transform",
    "translate("+leftxtext+", "+leftytext+")rotate(-90)"
  );
}
yTextRefresh();
ytext
  .append("text")
  .attr("y",-26)
  .attr("data-name","obesity")
  .attr("data-axis","y")
  .attr("class","aText active y")
  .text("% Obese");
ytext
  .append("text")
  .attr("x",0)
  .attr("data-name","smokes")
  .attr("data-axis","y")
  .attr("class","aText inactive y")
  .text("% Smokes");
ytext
  .append("text")
  .attr("y",26)
  .attr("data-name","healthcare")
  .attr("data-axis","y")
  .attr("class","aText inactive y")
  .text("% Lacking Healthcare");
d3.csv("data/data.csv").then(function(data) {
  visualize(data);
});
function visualize(theData) {
  var curx="poverty";
  var cury="obesity";
  var xmin;
  var xmax;
  var ymin;
  var ymax;
  var tool=d3
    .tip()
    .attr("class","d3-tip")
//    .style("fill","#F4FF00")
    .offset([40,-60])
    .html(function(d){
      var x;
      var state="<div>"+d.state+"</div>";
      var y="<div>"+cury+": "+d[cury]+"%</div>";
      if (curx==="poverty"){
        x ="<div>"+curx+": "+d[curx]+"%</div>";
      }
      else{
        x="<div>"+curx+": "+parseFloat(d[curx]).toLocaleString("en")+"</div>";
      }
      return state+x+y;
    });
  svg.call(tool);
  function xMinMax(){
    xmin=d3.min(theData,function(d){
      return parseFloat(d[curx])*.9;
    });
    xmax=d3.max(theData,function(d){
      return parseFloat(d[curx])*1.1;
    });
  }
  function yMinMax(){
    ymin=d3.min(theData,function(d){
      return parseFloat(d[cury])*.9;
    });
    ymax=d3.max(theData,function(d){
      return parseFloat(d[cury])*1.1;
    });
  }
  function labelChange(axis,clickedText){
    d3
      .selectAll(".aText")
      .filter("."+axis)
      .filter(".active")
      .classed("active",false)
      .classed("inactive",true);
    clickedText.classed("inactive",false).classed("active",true);
  }
  xMinMax();
  yMinMax();
  var xscale=d3
    .scaleLinear()
    .domain([xmin,xmax])
    .range([edge+label,wide-edge]);
  var yscale=d3
    .scaleLinear()
    .domain([ymin,ymax])
    .range([high-edge-label,edge]);
  var xaxis=d3.axisBottom(xscale);
  var yaxis=d3.axisLeft(yscale);
  function tickCount(){
    if (wide<=500){
      xaxis.ticks(5);
      yaxis.ticks(5);
    }
    else {
      xaxis.ticks(10);
      yaxis.ticks(10);
    }
  }
  tickCount();
  svg
    .append("g")
    .call(xaxis)
    .attr("class","xAxis")
    .attr("transform","translate(0,"+(high-edge-label)+")");
  svg
    .append("g")
    .call(yaxis)
    .attr("class","yAxis")
    .attr("transform","translate("+(edge+label)+", 0)");
  var circles=svg.selectAll("g theCircles").data(theData).enter();
  circles
    .append("circle")
    .style("fill","#D100FF")
    .attr("cx",function(d){
      return xscale(d[curx]);
    })
    .attr("cy",function(d){
      return yscale(d[cury]);
    })
    .attr("r",r)
    .attr("class",function(d){
      return "stateCircle "+ d.abbr;
    })
    .on("mouseover",function(d){
      tool.show(d,this);
      d3.select(this).style("stroke","#323232");
    })
    .on("mouseout",function(d){
      tool.hide(d);
      d3.select(this).style("stroke","#e3e3e3");
    });
  circles
    .append("text")
    .text(function(d){
      return d.abbr;
    })
    .attr("dx",function(d){
      return xscale(d[curx]);
    })
    .attr("dy",function(d){
      return yscale(d[cury])+r/2.5;
    })
    .attr("font-size",r)
    .attr("class","stateText")
    .on("mouseover",function(d){
      tool.show(d);
      d3.select("."+d.abbr).style("stroke","#323232");
    })
    .on("mouseout",function(d){
      tool.hide(d);
      d3.select("."+d.abbr).style("stroke","#e3e3e3");
    });
  d3.selectAll(".aText").on("click",function(){
    var clicked=d3.select(this);
    if (clicked.classed("inactive")){
      var axis=clicked.attr("data-axis");
      var name=clicked.attr("data-name");
      if (axis==="x"){
        curx=name;
        xMinMax();
        xscale.domain([xmin,xmax]);
        svg.select(".xAxis").transition().duration(300).call(xaxis);
        d3.selectAll("circle").each(function(){
          d3
            .select(this)
            .transition()
            .attr("cx",function(d){
              return xscale(d[curx]);
            })
            .duration(300);
        });
        d3.selectAll(".stateText").each(function(){
          d3
            .select(this)
            .transition()
            .attr("dx",function(d){
              return xscale(d[curx]);
            })
            .duration(300);
        });
        labelChange(axis,clicked);
      }
      else{
        cury=name;
        yMinMax();
        yscale.domain([ymin,ymax]);
        svg.select(".yAxis").transition().duration(300).call(yaxis);
        d3.selectAll("circle").each(function(){
          d3
            .select(this)
            .transition()
            .attr("cy",function(d){
              return yscale(d[cury]);
            })
            .duration(300);
        });
        d3.selectAll(".stateText").each(function(){
          d3
            .select(this)
            .transition()
            .attr("dy",function(d){
              return yscale(d[cury])+r/3;
            })
            .duration(300);
        });
        labelChange(axis,clicked);
      }
    }
  });
  d3.select(window).on("resize",resize);
  function resize(){
    wide=parseInt(d3.select("#scatter").style("width"));
    high=wide-wide/3.9;
    leftytext=(high+label)/2-label;
    svg.attr("width",wide).attr("height",high);
    xscale.range([edge+label,wide-edge]);
    yscale.range([high-edge-label,edge]);
    svg
      .select(".xAxis")
      .call(xaxis)
      .attr("transform","translate(0,"+(high-edge-label)+")");
    svg.select(".yAxis").call(yaxis);
    tickCount();
    xTextRefresh();
    yTextRefresh();
    crGet();
    d3
      .selectAll("circle")
      .attr("cy",function(d){
        return yscale(d[cury]);
      })
      .attr("cx",function(d){
        return xscale(d[curx]);
      })
      .attr("r",function(){
        return r;
      });
    d3
      .selectAll(".stateText")
      .attr("dy",function(d){
        return yscale(d[cury])+r/3;
      })
      .attr("dx",function(d){
        return xscale(d[curx]);
      })
      .attr("r",r/3);
  }
}