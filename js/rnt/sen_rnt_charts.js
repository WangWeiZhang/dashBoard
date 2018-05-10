var senRntCharts=(function(){
	return{
		drawAll:drawAll, //波形渐变图
		usingChart:usingChart, //散点图
		lineChart:lineChart  //柱状折线图
	}
	
	function lineChart(data){
		$("#line").html("");  //清空svg
		//定义一个svg中的g，宽度，高度
		var width = $("#line").width();  //svg的宽度
		var height = $("#line").height();  //svg的高度
		var svg = d3.select("#line").append("svg")    //添加svg
			        .attr("width", width)
			        .attr("height", height);
		
		
		//获取柱状图数据
		var barArr = data.data.solvedOption;
		var barArr1 = data.data.unsolvedOption;
		
		
		//定义随着分辨率改变的数值
		var xScaleWidth;  //横坐标比例尺
		var xTransfer;  //横轴偏移量
		var tra_x;
		var tra_y;
		var tip_y1
		var tip_y2;
		var tip_y3;
		var xaxi_y;
		var fontSize;
		
		if(window.screen.availWidth <= 1366){
			xScaleWidth = width;
			xTransfer = 30;
			xaxi_y = 10;
			tip_y1 = 8;
			tip_y3 = 0;
			tip_y2 = 0;
			fontSize = "0.6rem";
        }else if(window.screen.availWidth <= 1920){
        	xScaleWidth = width;
        	xTransfer = 30;
        	xaxi_y = 10;
        	tip_y1 = 8;
        	tip_y2 = 0;
        	tip_y3 = 0;
        	fontSize = "0.6rem";
        }else if(window.screen.availWidth <= 3840){
        	xScaleWidth = width -110;
        	xTransfer = 62;
        	xaxi_y = 25;
        	tip_y2 = 5;
        	tip_y1 = 15;
        	tip_y3 = 6;
        	fontSize = "0.5rem";
        }
		//定义比例尺
		var size = barArr.length;  //数据的条数
		//var xScaleWidth;  //横坐标比例尺
		if(size==7){
			xScaleWidth = xScaleWidth-120;
		}else{
			xScaleWidth = xScaleWidth-101;
		}
		
		var g = svg.append("g").attr("transform","translate("+xTransfer+","+height/6+")");  //添加g
		//获取折线图数据
		var lineArr = data.data.solvingOption;
		var lineArr1 = data.data.repeatOption;
		
		//获取x轴上的柱状图的最大值
		var mx1 = Math.round(Math.max.apply(null,barArr)/2)+"";
		var y1Max = parseInt(mx1.substr(0, 1))+1;
		for(var i=0;i<mx1.length-1;i++){
			y1Max = y1Max+"0";
		}
		y1Max = parseInt(y1Max)*2;
		
		//获取x轴下的柱状图的最大值
		var mx2 = Math.round(Math.max.apply(null,barArr1)/2)+"";
		var y2Max = parseInt(mx2.substr(0, 1))+1;
		for(var i=0;i<mx2.length-1;i++){
			y2Max = y2Max+"0";
		}
		y2Max = parseInt(y2Max)*2;
		//坐标轴提示数据
		var xExp = data.data.timeOption;
		var y1Exp = [y1Max,y1Max/2,0,y2Max];
		var y2Exp = [100,50];
		
		//x轴的比例尺
		var xScale = d3.scale.ordinal()
			.domain(d3.range(barArr.length))
			.rangeRoundBands([0,xScaleWidth]);

		//y轴左边的比例尺
		var yScale = d3.scale.linear()
			.domain([0,y1Max])
			.range([height/2, 0]);
		
		//y右边轴的比例尺
		var yScale1 = d3.scale.linear()
			.domain([0,100])
			.range([height/2, 0]);
		
		//y轴下遍的比例尺
		var yScale2 = d3.scale.linear()
			.domain([0,y2Max])
			.range([height/4, 0]);
		
		//定义一些变量
		var rectPadding = width/(size*2);  //矩形之间的空白
		var rectWidth = xScale.rangeBand() - rectPadding;  //矩形的宽度
		var tipWidth; //tip的宽度
		if(size==7){
			tipWidth = rectPadding;
		}else{
			//tipWidth = (xScale(1)-xScale(0));
			tipWidth = rectPadding*1.5;
		}
		
		//添加渐变效果
		var defs = g.append("g");
		//定义中间横线的渐变效果
		var line_color = defs.append("defs").append("linearGradient")
						.attr("id","line_color")
						.attr("x1","0%")
						.attr("y1","0%")
						.attr("x2","0%")
						.attr("y2","100%")
						.attr("gradientUnits","userSpaceOnUse");

			line_color.append("stop").attr("offset","0%")
				.style("stop-color","#136CB4")
				.style("stop-opacity",1);
			line_color.append("stop").attr("offset","100%")
				.style("stop-color","#136CB4")
				.style("stop-opacity",0);
			
		//定义中间横线的渐变效果
		var line_color1 = defs.append("defs").append("linearGradient")
						.attr("id","line_color1")
						.attr("x1","0%")
						.attr("y1","0%")
						.attr("x2","0%")
						.attr("y2","100%")
						.attr("gradientUnits","userSpaceOnUse");

			line_color1.append("stop").attr("offset","0%")
				.style("stop-color","#D49247")
				.style("stop-opacity",0);
			line_color1.append("stop").attr("offset","100%")
				.style("stop-color","#D49247")
				.style("stop-opacity",1);
			
			//添加横坐标提示
			var textExp = g.append("g");
			//添加横坐标提示
			textExp.selectAll(".xtext").data(xExp)  //绑定数组
						.enter()        //指定选择集的enter部分
						.append("text")
						.text(function(d){return d})
					    .style("fill","#fff")
						.style("font-size","0.48rem")
						.attr("text-anchor","end")
						.style("font-family",".HelveticaNeueLTStd-Light")
						.style("opacity",0.6)
						.attr("x",function(d,i){return xScale(i)+rectPadding-3})
						.attr("y",function(d,i){return yScale(0)+xaxi_y});
			//添加纵坐标左上提示
			textExp.selectAll(".y1text").data(y1Exp)  //绑定数组
			.enter()        //指定选择集的enter部分
			.append("text")
			.text(function(d){
				if(d>=1000&&d<1000000){
					return d/1000 + "k";
				}else if(d>= 1000000){
					return d/1000000 + "m";
				}else{
					return d;
				}
			})
		    .style("fill","#fff")
			.style("font-size","0.48rem")
			.attr("text-anchor","end")
			.style("font-family",".HelveticaNeueLTStd-Light")
			.style("opacity",0.6)
			.attr("x",function(d,i){return xScale(0)-5;})
			.attr("y",function(d,i){
				if(i==3){
					return yScale(0)+yScale2(0)
				}else{
					return yScale(d)
				}
			});
			//添加纵坐标右边提示
			textExp.selectAll(".y2text").data(y2Exp)  //绑定数组
			.enter()        //指定选择集的enter部分
			.append("text")
			.text(function(d){return d+"%"})
		    .style("fill","#fff")
			.style("font-size","0.48rem")
			.style("font-family",".HelveticaNeueLTStd-Light")
			.style("opacity",0.6)
			.attr("text-anchor","start")
			.attr("x",function(d,i){return xScale(size-1)+xScale.rangeBand()+rectPadding+5;})
			.attr("y",function(d,i){return yScale1(d);});
			
			//添加坐标轴标注信息
			var tipExp = g.append("g");
			tipExp.append("text")
			.text("case")
		    .style("fill","#fff")
			.style("font-size","0.48rem")
			.attr("class","total")
			.style("opacity",0.6)
			.attr("text-anchor","end")
			.attr("x",function (){ return xScale(0)-5})
			.attr("y",function(d,i){
					return (yScale(y1Max)-0.2*yScale(0)-tip_y1);
			}); 
			tipExp.append("text")
			.text("counts")
		    .style("fill","#fff")
			.style("font-size","0.48rem")
			.style("opacity",0.6)
			.attr("class","total")
			.attr("text-anchor","end")
			.attr("x",function (){ return xScale(0)-5})
			.attr("y",function(d,i){
					return (yScale(y1Max)-0.2*yScale(0));
			});
			tipExp.append("text")
			.text("Resolution Rate")
		    .style("fill","#fff")
			.style("font-size","0.48rem")
			.style("font-family",".HelveticaNeueLTStd-Light")
			.style("opacity",0.6)
			.attr("class","total")
			.attr("text-anchor","middle")
			.attr("x",function (){ return xScale(size-1)+xScale.rangeBand()+rectPadding})
			.attr("y",function(d,i){
					return yScale(y1Max)-0.2*yScale(0)-5;
			});
			
			tipExp.append("text")
			.text("time")
		    .style("fill","#fff")
			.style("font-size","0.48rem")
			.style("font-family",".HelveticaNeueLTStd-Light")
			.style("opacity",0.6)
			.attr("text-anchor","start")
			.attr("class","total")
			.attr("x",function (){ return xScale(size-1)+xScale.rangeBand()+rectPadding+5})
			.attr("y",function(d,i){
					return yScale(0);
			});
			
			//添加矩形元素
			var rect = g.append("g");
			rect.selectAll(".solved")
		        .data(barArr)
		        .enter()
		        .append("rect")
		        .attr("width", rectWidth)
		        .attr("height", function(d){ return 0;})
				.attr("fill", 'url(#line_color)')
				.attr("stroke","#136CB4")
				.attr("opacity","1")
				.attr("stroke-width",2)
				.attr("x", function(d,i){return xScale(i) + rectPadding;})
				.attr("y",function(d){return yScale(0);})
				.transition()
				.duration(1000)
				.attr("y",function(d){return yScale(d);})
				.attr("height", function(d){return height/2 - yScale(d);})
				.transition()
				.duration(8000)
				.attr("opacity","1")
				.transition()
				.duration(500)
				.attr("opacity","0.5")
				.transition()
				.duration(500)
				.attr("opacity","1")
				.transition()
				.duration(500)
				.attr("opacity","0.5")
				.transition()
				.duration(500)
				.attr("opacity","1")
				.transition()
				.duration(4500)
				.attr("opacity","1")
				.transition()
				.duration(500)
				.attr("opacity","0.5");
		        
			
			//添加矩形元素
			rect.selectAll(".unsolved")
		        .data(barArr1)
		        .enter()
		        .append("rect")
		        .attr("x", function(d,i){return xScale(i) + rectPadding;})
		        .attr("y",function(d){return height/2;})
		        .attr("stroke","#D49247")
				.attr("stroke-width",2)
				.attr("opacity","1")
				.attr("fill", 'url(#line_color1)')
				.attr("width", rectWidth)
				.attr("height", function(d){return 0;})
				.transition()
				.duration(1000)
		        .attr("height", function(d){return height/4 - yScale2(d);})
		        .transition()
				.duration(8000)
				.attr("opacity","1")
				.transition()
				.duration(500)
				.attr("opacity","0.5")
				.transition()
				.duration(6500)
				.attr("opacity","0.5")
				.transition()
				.duration(500)
				.attr("opacity","1")
				.transition()
				.duration(500)
				.attr("opacity","0.5")
				.transition()
				.duration(500)
				.attr("opacity","1")
				.transition()
				.duration(5000)
				.attr("opacity","1")
				.transition()
				.duration(500)
				.attr("opacity","0.5");
		
			//添加横纵坐标
			var line = g.append("g");
			line.append("line")
						.attr("x1",function(){return xScale(0)})
						.attr("x2",function(){return xScale(size-1)+xScale.rangeBand()+rectPadding;})
						.attr("y1",function(d,i){return yScale(0)})
						.attr("y2",function(d,i){return yScale(0) })
						.attr("stroke-width","2")
						.attr("stroke","#fff")
						.attr("opacity",1);
			//添加纵坐标左边
			line.append("line")
			.attr("x1",function(){return xScale(0)})
			.attr("x2",function(){return xScale(0)})
			.attr("y1",function(d,i){return (yScale(y1Max)-0.2*yScale(0))})
			.attr("y2",function(d,i){return yScale(0)+yScale2(0) })
			.attr("stroke-width","1")
			.attr("stroke","#D4D4D4")
			.attr("opacity",1)
			.transition()
			.duration(500)
			.delay(8000)
			.attr("stroke","#fff")
			.attr("stroke-width","2")
			.transition()
			.duration(14000)
			.attr("stroke","#fff")
			.attr("stroke-width","2")
			.transition()
			.duration(500)
			.attr("stroke","#D4D4D4")
			.attr("stroke-width","1");
			
			//添加纵坐标右边
			line.append("line")
			.attr("x1",function(){return xScale(size-1)+xScale.rangeBand()+rectPadding})
			.attr("x2",function(){return xScale(size-1)+xScale.rangeBand()+rectPadding})
			.attr("y1",function(d,i){return yScale1(100)-0.2*yScale1(0)})
			.attr("y2",function(d,i){return yScale(0)+yScale2(0) })
			.attr("stroke-width","1")
			.attr("stroke","#D4D4D4")
			.attr("opacity",1)
			.transition()
			.duration(500)
			.delay(23000)
			.attr("stroke","#fff")
			.attr("stroke-width","2");
			
			
			   
		   //添加折线
		   var path  = d3.svg.line()
			  .x(function(d,i){ return xScale(i)+rectPadding+rectWidth/2;})
			  .y(function(d){return yScale1(d);})

		  var line_path = g.append("g");
		   		line_path.append("path")
						.datum(lineArr)
						.attr("d", path)
						.attr("fill", "none")
						.attr("stroke-width",1.5)
						.attr("stroke","#fff")
						.attr("opacity","0")
						.transition()
						.duration(1000)
						.delay(2000)
						.attr("opacity","1")
						.transition()
						.duration(5000)
						.attr("opacity","1")
						.transition()
						.duration(500)
						.attr("opacity","0.3")
						.transition()
						.duration(14000)
						.attr("opacity","0.3")
						.transition()
						.duration(500)
						.attr("opacity","1")
						.attr("stroke-width",2.5)
						.transition()
						.duration(6000)
						.attr("opacity","1")
						.attr("stroke-width",2.5)
						.transition()
						.duration(500)
						.attr("opacity","0.3")
						.attr("stroke-width",1.5);
				
//		   		line_path.append("path")
//				.datum(lineArr1)
//				.attr("d", path)
//				.attr("fill", "none")
//				.attr("stroke-width",1.5)
//				.attr("stroke","#FFF351")
//				.attr("opacity","0")
//				.transition()
//				.duration(1000)
//				.delay(2000)
//				.attr("opacity","1")
//				.transition()
//				.duration(5000)
//				.attr("opacity","1")
//				.transition()
//				.duration(500)
//				.attr("opacity","0.3")
//				.transition()
//				.duration(21500)
//				.attr("opacity","0.3")
//				.transition()
//				.duration(500)
//				.attr("opacity","1")
//				.attr("stroke-width",2.5);
		   		
		   	//添加圆圈
				var circle = g.append("g");
					circle.selectAll("circle").data(lineArr)  //绑定数组
							.enter()        //指定选择集的enter部分
							.append("circle")
							.attr("cx",function(d,i){ return xScale(i)+rectPadding+rectWidth/2;})
							.attr("cy",function(d){return yScale1(d);} )
							.attr("r", 3)
							.attr("opacity","0")
							.attr("fill", "#FFF")
							.transition()
							.duration(1000)
							.delay(function(d,i){return 1000+i*60})
							.attr("opacity","1")
							.transition()
							.duration(5000)
							.attr("opacity","1")
							.transition()
							.duration(500)
							.attr("opacity","0.5")
							.transition()
							.duration(14500)
							.attr("opacity","0.5")
							.transition()
							.duration(500)
							.attr("opacity","1")
							.attr("r", 3.5)
							.transition()
							.duration(5500)
							.attr("opacity","1")
							.attr("r", 3.5)
							.transition()
							.duration(500)
							.attr("opacity","0.5")
							.attr("r", 3);
				
//				   circle.selectAll("circle1").data(lineArr1)  //绑定数组
//							.enter()        //指定选择集的enter部分
//							.append("circle")
//							.attr("cx",function(d,i){ return xScale(i)+rectPadding+rectWidth/2;})
//							.attr("cy",function(d){return yScale1(d);} )
//							.attr("fill", "#FFF351")
//							.attr("opacity","0")
//							.attr("r", 3)
//							.transition()
//							.duration(1000)
//							.delay(function(d,i){return 1000+i*60})
//							.attr("opacity","1")
//							.transition()
//							.duration(5000)
//							.attr("opacity","1")
//							.transition()
//							.duration(500)
//							.attr("opacity","0.5")
//							.transition()
//							.duration(22000)
//							.attr("opacity","0.5")
//							.transition()
//							.duration(500)
//							.attr("r",3.5)
//							.attr("opacity",1);
		   		
		  var image = g.append("g");
		  
			  image.selectAll("image1")
			  .data(barArr)  //绑定数组
			  .enter()        //指定选择集的enter部分
			  .append("image")
			  .attr("opacity","0")
			  .attr("width",function(d,i){return tipWidth;})
			  .attr("height",tipWidth*0.5)
			  .attr("xlink:href",function(d,i){return "images/tip.png"})
			  .attr("transform",function(d,i){ return "translate("+(xScale(i)+rectPadding+rectWidth/2-tipWidth/2)+","+(yScale(d)-tipWidth*0.5-15) +")"})
			  .transition()
			  .duration(500)
			  .delay(function(d,i){return 9000+i*60})
			  .attr("transform",function(d,i){ return "translate("+(xScale(i)+rectPadding+rectWidth/2-tipWidth/2)+","+(yScale(d)-tipWidth*0.5-5) +")"})
			  .attr("opacity","1")
			  .transition()
			  .duration(5000)
			  .attr("opacity","1")
			  .transition()
			  .duration(500)
			  .attr("opacity","0");
		
			  image.selectAll("image2")
			  .data(barArr1)  //绑定数组
			  .enter()        //指定选择集的enter部分
			  .append("image")
			  .attr("opacity","0")
			  .attr("width",function(d,i){return tipWidth;})
			  .attr("height",tipWidth*0.5)
			  .attr("xlink:href",function(d,i){return "images/zong_tip.png"})
			  .attr("transform",function(d,i){ return "translate("+(xScale(i)+rectPadding+rectWidth/2-tipWidth/2)+","+(height/2-yScale2(d)+yScale2(0)+15) +")"})
			  .transition()
			  .duration(500)
			  .delay(function(d,i){return 16000+i*60})
			  .attr("transform",function(d,i){ return "translate("+(xScale(i)+rectPadding+rectWidth/2-tipWidth/2)+","+(height/2-yScale2(d)+yScale2(0)+5) +")"})
			  .attr("opacity","1")
			  .transition()
			  .duration(5000)
			  .attr("opacity","1")
			  .transition()
			  .duration(500)
			  .attr("opacity","0");
		
			  image.selectAll("image3")
			  .data(lineArr)  //绑定数组
			  .enter()        //指定选择集的enter部分
			  .append("image")
			  .attr("opacity","0")
			  .attr("width",function(d,i){ return tipWidth;})
			  .attr("height",tipWidth*0.5)
			  .attr("xlink:href",function(d,i){return "images/white_tip.png"})
			  .attr("transform",function(d,i){ return "translate("+(xScale(i)+rectPadding+rectWidth/2-tipWidth/2)+","+(yScale1(d)-tipWidth*0.5-15)+")"})
			  .transition()
			  .duration(500)
			  .delay(function(d,i){return 23000+i*60})
			  .attr("transform",function(d,i){ return "translate("+(xScale(i)+rectPadding+rectWidth/2-tipWidth/2)+","+(yScale1(d)-tipWidth*0.5-5)+")"})
			  .attr("opacity","1")
			  .transition()
			  .duration(5000)
			  .attr("opacity","1")
			  .transition()
			  .duration(500)
			  .attr("opacity","0");
		
//			  image.selectAll("image4")
//			  .data(lineArr1)  //绑定数组
//			  .enter()        //指定选择集的enter部分
//			  .append("image")
//			  .attr("opacity","0")
//			  .attr("width",function(d,i){return tipWidth;})
//			  .attr("height",tipWidth*0.5)
//			  .attr("xlink:href",function(d,i){return "images/yellow_tip.png"})
//			  .attr("transform",function(d,i){ return "translate("+(xScale(i)+rectPadding+rectWidth/2-tipWidth/2)+","+(yScale1(d)-tipWidth*0.5-15) +")"})
//			  .transition()
//			  .duration(500)
//			  .delay(function(d,i){return 31000+i*60})
//			  .attr("transform",function(d,i){ return "translate("+(xScale(i)+rectPadding+rectWidth/2-tipWidth/2)+","+(yScale1(d)-tipWidth*0.5-5) +")"})
//			  .attr("opacity","1");
			  
			  //添加提示信息
				var tip = g.append("g");
				
				tip.selectAll("text1")
				  .data(barArr)  //绑定数组
				  .enter()        //指定选择集的enter部分
				  .append("text")
				  .text(function(d){return d})
				  .style("font-size",fontSize)
				  .attr("class","total")
				  .attr("opacity","0")
				  .attr("text-anchor","middle")
				  .attr("x",function(d,i){return (xScale(i)+rectPadding+rectWidth/2)})
				  .attr("y",function(d,i){return yScale(d)-tipWidth*0.3-10})
				  .transition()
				  .duration(500)
				  .delay(function(d,i){return 9000+i*60})
				  .attr("y",function(d,i){return yScale(d)-tipWidth*0.3+tip_y2})
				  .attr("opacity","1")
				  .transition()
				  .duration(5000)
				  .attr("opacity","1")
				  .transition()
				  .duration(500)
				  .attr("opacity","0");
				
				tip.selectAll("text2")
				  .data(barArr1)  //绑定数组
				  .enter()        //指定选择集的enter部分
				  .append("text")
				  .text(function(d){return d})
				  .style("font-size",fontSize)
				  .style("font-family",".HelveticaNeueLTStd-Light")
				  .attr("opacity","0")
				  .attr("text-anchor","middle")
				  .attr("x",function(d,i){return (xScale(i)+rectPadding+rectWidth/2)})
				  .attr("y",function(d,i){return (height/2 - yScale2(d)+yScale2(0)+tipWidth*0.45+10)})
				  .transition()
				  .duration(500)
				  .delay(function(d,i){return 16000+i*60})
				  .attr("y",function(d,i){return (height/2 - yScale2(d)+yScale2(0)+tipWidth*0.5-tip_y3)})
				  .attr("opacity","1")
				  .transition()
				  .duration(5000)
				  .attr("opacity","1")
				  .transition()
			      .duration(500)
			      .attr("opacity","0");
				
				tip.selectAll("text3")
				  .data(lineArr)  //绑定数组
				  .enter()        //指定选择集的enter部分
				  .append("text")
				  .text(function(d){return d+"%"})
				  .style("font-size",fontSize)
				  .style("font-family",".HelveticaNeueLTStd-Light")
				  .attr("opacity","0")
				  .attr("text-anchor","middle")
				  .attr("x",function(d,i){return (xScale(i)+rectPadding+rectWidth/2)})
				  .attr("y",function(d,i){return yScale1(d)-tipWidth*0.3-10})
				  .transition()
				  .duration(500)
				  .delay(function(d,i){return 23000+i*60})
				  .attr("y",function(d,i){return yScale1(d)-tipWidth*0.3+tip_y2})
				  .attr("opacity","1")
				  .transition()
				  .duration(5000)
				  .attr("opacity","1")
				  .transition()
				  .duration(500)
				  .attr("opacity","0");
				
//				tip.selectAll("text4")
//				  .data(lineArr1)  //绑定数组
//				  .enter()        //指定选择集的enter部分
//				  .append("text")
//				  .text(function(d){return d+"%"})
//				  .style("font-size",fontSize)
//				  .style("font-family",".HelveticaNeueLTStd-Light")
//				  .attr("opacity","0")
//				  .attr("text-anchor","middle")
//				  .attr("x",function(d,i){return (xScale(i)+rectPadding+rectWidth/2)})
//				  .attr("y",function(d,i){return yScale1(d)-tipWidth*0.3-10})
//				  .transition()
//				  .duration(500)
//				  .delay(function(d,i){return 31000+i*60})
//				  .attr("y",function(d,i){return yScale1(d)-tipWidth*0.3+tip_y2})
//				  .attr("opacity","1");
    }
	
	function usingChart(jsonData , dian_midu){
		
		var width_out_box = $(".right_middle").height() * 0.6272;
		$("#using_echart_div").width(width_out_box+"px");
		$("#using_echart_div").height(width_out_box+"px");
		var width = $(".using_echart_title").width();
		var myChart = echart.init(document.getElementById('using_echart_div'));
		$("#using_echart_div div").css({"width":"100%","height":"100%"});
		option = {
		backgroundColor:"#383744",
        series: [{
            type: 'graph',
            layout: 'force',
            animation: false,
            draggable: true,
            data:jsonData.nodes.map(function (node, idx) {
                node.id = idx;
                return node;
            }),
            categories: jsonData.categories,
            force: {
                initLayout: 'circular',
                repulsion: width/30,
                gravity: dian_midu
            },
            lineStyle : { //==========关系边的公用线条样式。
                normal : {
                    color : 'rgba(255,0,0,1)',
                    width : '0',
                    type : 'dotted', //线的类型 'solid'（实线）'dashed'（虚线）'dotted'（点线）
                    curveness : 0.3, //线条的曲线程度，从0到1
                    opacity : 1
                // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。默认0.5
                },
            },
            edges: jsonData.links
        }]
    };

		myChart.setOption(option);
		window.onresize=function() {
    	myChart.resize();
		}
		$("#using_echart_div canvas").css({"width":width_out_box+"px","height":width_out_box+"px"});
	}
	function drawAll(data, id,color,xExplain){
		//在对应的id中设置画布，设置画布的宽，高
		var width=data.width;
		var height=data.height;
		
		$("#"+id).append("<div id='shodow_wave'></div>");
		$("#shodow_wave").css({"left":"20px" , "z-index" : 2 , "top":0}).delay(300).animate({"left":"100%"} , 3000);
//		$("#"+id).append("<div id='shodow_wave1'></div>");
//		$("#shodow_wave1").css({"left":"20px" , "z-index" : 1}).delay(600).animate({"left":"100%"} , 3000);
		
		var xaxi_x;
		var yaxi_y;
		var tra_y;
		var posi_y;
		var posi_x;
		var tra_x;
		if(window.screen.availWidth <= 1366){
			xaxi_x = 45;
			tra_x = 35;
		    yaxi_y = 45;
		    tra_y = 20;
		    posi_y = 23;
		    posi_x = 14;
        }else if(window.screen.availWidth <= 1920){
        	xaxi_x = 45;
        	tra_x = 35;
		    yaxi_y = 45;
		    tra_y = 20;
		    posi_y = 23;
		    posi_x = 14;
        }else if(window.screen.availWidth <= 3840){
        	xaxi_x = 80;
		    yaxi_y = 80;
		    tra_x = 65;
		    tra_y = 35;
		    posi_y = 40;
		    posi_x = 20;
        }
		
		//添加画布
		var g = d3.select("#"+id).append("svg").attr("width",width)
			.attr("height",height).append("g").attr("transform", "translate("+tra_x+","+tra_y+")");
		var maxT = data.maxZuo;  //获取数据中的最大值
		//定义x坐标和y坐标的比例尺
		var x = d3.scale.linear().domain([0, data.x_data.length-1]).range([0, width-xaxi_x]);
		var y = d3.scale.linear().domain([0, maxT*4]).range([height-yaxi_y, 0]);
		//定义波形阴影图	
		var area = d3.svg.area().x(function(d,i) { return x(i); })
			.y0(function(d) { return y(d.data); })
			.y1(function(d,i) { return y(d.data); })
			.interpolate("cardinal");
		//定义波形阴影图的描边
		var area1 = d3.svg.area().x(function(d,i) { return x(i);})
			.y0(function(d,i) { return y(0); })
			.y1(function(d,i) { return y(d.data); })
			.interpolate("cardinal");

		var dataArr = [];
		var xArr = data.x_data;
		var yArr = [maxT,maxT*2,maxT*3,maxT*4];
		var times = data.x_data;
		var datas = data.y_data;
		for(var i=0;i<times.length;i++){
			var json = {};
			json["time"] = times[i];
			json["data"] = datas[i];
			dataArr[dataArr.length]=json;
		}	

		
		//定义中间横线的渐变效果
		var line_color = g.append("defs").append("linearGradient")
						.attr("id","line_color3")
						.attr("x1","0%")
						.attr("y1","0%")
						.attr("x2","0%")
						.attr("y2","100%")
						.attr("gradientUnits","userSpaceOnUse");

			line_color.append("stop").attr("offset","0%")
				.style("stop-color","#F7C45C")
				.style("stop-opacity",1);
			line_color.append("stop").attr("offset","100%")
				.style("stop-color","#F7C45C")
				.style("stop-opacity",0);

		//添加波形阴影图
		g.append("path").datum(dataArr).attr("d", area)
			.style("stroke-width", 2)
			.style("stroke", color);
		//添加波形阴影图描边
		g.append("path").datum(dataArr)
			.attr("d", area1)
			.attr("fill", color)
			.attr("opacity",0.1);

		g.append("g").selectAll("line").data(yArr)  //绑定数组
				.enter()        //指定选择集的enter部分
				.append("line")
				.attr("x1",function(){return x(0)})
				.attr("x2",function(){return x(data.lengths-1) })
				.attr("y1",function(d,i){return y(d)})
				.attr("y2",function(d,i){return y(d) })
				.attr("stroke-width","1")
				.attr("stroke","#fff")
				.attr("opacity",0.1);

		//添加提示横线
		g.append("line").attr("x1",function(d,i){return x(data.maxIndex) })
					     .attr("x2",function(d,i){return x(data.maxIndex) })
						 .attr("y1",y(0))
						 .attr("y2",function(){return y(0) })
						  .attr("stroke-width","2")
						  .attr("stroke","url(#line_color3)")
						  .attr("opacity",1)
						  .transition().delay('1000').duration(1000).attr("y2",function(){return y(data.maxData) });
		//添加提示横线的圆圈
		g.append("circle")
			    .transition().delay('2000').duration(0)
			    .attr("cx",function(){return x(data.maxIndex)})
				.attr("cy",function(){return y(data.maxData)} )
				.attr("r", 4)
				.style("fill", "#4da1ff").attr("stroke","#fff")
				.attr("stroke-width","3");

		$("#"+id).append("<div id='squareness' class=\"s2_line_tip\"><div><span id='squarenss_span'></span></div><span class='sanjiao'></span></div>");
		var he = $("#squareness").height()/2;
		var pad = parseInt($("#wave_div").css('paddingLeft').replace("px",""));
		$("#squarenss_span").html((data.maxData  || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
		var wi = $("#squareness").width()/2;
		$("#squareness").css({"left" : (x(data.maxIndex)+tra_x+pad-wi)+"px" , "top":(y(data.maxData)+tra_y-10)+"px" , "z-index" : 1,"opacity":0}).delay(2000).animate({"opacity":1} , 1500);
		
		//添加横坐标提示
		g.append("g").selectAll("text").data(xArr)  //绑定数组
				.enter()        //指定选择集的enter部分
				.append("text")
				.text(function(d){return d})
			    .style("fill","#fff")
				.style("font-size","0.48rem")
				.attr("text-anchor","end")
				.style("font-family",".HelveticaNeueLTStd-Light")
				.style("opacity",0.4)
				.attr("x",function(d,i){return (x(i)+5)})
				.attr("y",y(0)+posi_x);

		var g1 = g.append("g");
			g1.append("text")
				.text(xExplain)
			    .style("fill","#fff")
				.style("opacity",0.4)
				.style("font-size","0.48rem")
				.attr("text-anchor","end")
				.style("font-family",".HelveticaNeueLTStd-Light")
				.attr("x",function(d){return x(data.lengths-1)+5})
				.attr("y",y(0)+posi_y);
			g1.append("text")
				.text("counts")
			    .style("fill","#fff")
				.style("opacity",0.4)
				.style("font-size","0.48rem")
				.style("font-family",".HelveticaNeueLTStd-Light")
				.attr("text-anchor","end")
				.attr("x",function(d){return (x(0)-5)})
				.attr("y",function(d){return y(maxT*4)-posi_x});
		//添加纵坐标提示
		g.append("g").selectAll("text").data(yArr)  //绑定数组
				.enter()        //指定选择集的enter部分
				.append("text")
				.text(function(d){
					if(d>=1000 && d<1000000 ){
						return d/1000 + "k";
					}else if(d>=1000000){
						return d/1000000 + "m";
					}else{
						return d;
					}
					})
					
			    .style("fill","#fff")
				.style("font-size","0.48rem")
				.style("font-family",".HelveticaNeueLTStd-Light")
				.style("opacity",0.4)
				.attr("text-anchor","end")
				.attr("y",function(d){return (y(d))})
				.attr("x",function(d){return (x(0)-5)});
		
	}
		
		
})();