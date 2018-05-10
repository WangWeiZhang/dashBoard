var dchart=(function(){
	return{
		renderXAxis:renderXAxis,
		renderYAxis:renderYAxis,
		getOption:getOption,
		drawTips:drawTips,
		pie_chart:pie_chart,  //饼状图
		area:area, //波形图
		drawAll:drawAll //波形渐变图
	}
	function area(option){
		var layoutId = option.pid;
		var layout = d3.select("#"+layoutId).property("option",option);
		$("#report_area").append("<div id='shodow'></div>");
		$("#shodow").css("left","0px").delay(300).animate({"left":"100%"} , 2000);
		$("#sp_div").css({"left":"-40px" , "opacity":0}).delay(300).animate({"left":"0px" , "opacity":1} , 800);
		var graph=layout.append("div").classed({"graph":true}).attr("dataId",layoutId) ;
		var chart=graph.append("div").classed({"chart":true}).attr("dataId",layoutId);
	
		var _svg = chart.append("svg").style(option.chart.style);
		var svg_box=_svg.node().getBoundingClientRect();
		var x_width = svg_box.width;
		var y_h = svg_box.height;
		
		var v_xw = x_width;
		var v_yh=y_h;
		if(window.screen.availWidth <= 1366){
			_svg.attr("viewBox","-25 20 "+v_xw+" "+y_h+"")
			.attr("preserveAspectRatio","none");
        }else if(window.screen.availWidth <= 1920){
        	_svg.attr("viewBox","-25 20 "+v_xw+" "+y_h+"")
    		.attr("preserveAspectRatio","none");
        }else if(window.screen.availWidth <= 3840){
        	_svg.attr("viewBox","-35 20 "+v_xw+" "+y_h+"")
    		.attr("preserveAspectRatio","none");
        }
		
		var widths = _svg.node().getBoundingClientRect().width;
		var change;
		var change_position;
		var change_x;
		var xaxi;
		 if(window.screen.availWidth <= 1366){
	        	change = {ticks:0,translate:""+widths/50+","+(y_h+2)};
	        	change_position = 4;
	        	change_x = 0;
	        	xaxi = 50;
	        }else if(window.screen.availWidth <= 1920){
	        	change = {ticks:0,translate:""+widths/50+","+(y_h+2)};
	        	change_position = 4;
	        	change_x = 0;
	        	xaxi = 50;
	        }else if(window.screen.availWidth <= 3840){
	        	change = {ticks:0,translate:""+widths/50+","+(y_h-10)};
	        	change_position = -12;
	        	change_x = -16;
	        	xaxi = 80;
	        }
		 
		var xscale = dchart.renderXAxis(_svg,dealAxis,change,change_position,change_x,xaxi);
		var yscale = dchart.renderYAxis(_svg,dealAxis,change,change_position,change_x);
		var max = [];
		createArea(_svg,xscale,yscale,max,change,change_position,change_x);
		drawTips(_svg,xscale,yscale,max,change,change_position,change_x);
		
	}
	function dealAxis(gAxis){
		gAxis.selectAll("text")
		.attr("transform", "translate(0,7)")
		.attr("class","total")
		.style("fill","#A1A3A0")
		.style("opacity",0.9)
		.style("font-size","0.48rem")
		.attr("class","total");
		
	}
	
	function createArea(_svg,xscale,yscale,maxArr,change,change_position,change_x){
		var widths = _svg.node().getBoundingClientRect().width;
		var option=dchart.getOption(_svg.node().parentNode);
		var j = 0;
		var xarr = option.chart.xAxis.data;
		var series = [];
		var colors = [];
		var color_area = ["#fff","#00aaff","#7ed321"];
		var op_area=[0.1,0.39,0.2];
		for(var i=0;i<option.chart.yAxis.series.length;i++){
				series[series.length]=option.chart.yAxis.series[i];
				colors[colors.length]=option.colors[i];
		}
		var dataArr = [];
		for(var c=0;c<series.length;c++){
			var serie = series[c];
			var varr = serie.data;
			var arr = [];
			for(var i = 0; i < xarr.length; i++){
				var json = {};
		         json["date"] = xarr[i];
		         json["rate"] = varr[i];
		         arr[arr.length]=json;
		    }
			dataArr[dataArr.length]=arr;
		}	
		for(var c=0;c<series.length;c++){
			var serie = series[c];
			var varr = serie.data;
			var arr = [];
			for(var i = 0; i < xarr.length; i++){
				var json = {};
		         json["date"] = xarr[i];
		         json["rate"] = varr[i];
		         arr[arr.length]=json;
		    }
			var area;
			var area1;
			if(c==2){
			 area = d3.svg.area()
			  .x(function(d,i) { return xscale(d.date); })  // 获取或设置x坐标的访问器.
			  .y0(yscale(0)) //获取或设置y0坐标(基线)的访问器.
			  .y1(function(d,i) { return yscale(dataArr[c][i].rate); })  //获取或设置y1坐标(背线)的访问器.
			  .interpolate("monotone");
			 
			 area1 = d3.svg.line()
			  .x(function(d) { return xscale(d.date); })  // 获取或设置x坐标的访问器.
			  .y(function(d,i) { return yscale(dataArr[c][i].rate); })
			   .interpolate("monotone");

			}else if(c==1){
				area = d3.svg.area()
				.x(function(d,i) { return xscale(d.date); })  // 获取或设置x坐标的访问器.
				  .y0(yscale(0)) //获取或设置y0坐标(基线)的访问器.
				  .y1(function(d,i) { return yscale(dataArr[c][i].rate+dataArr[c+1][i].rate); })  //获取或设置y1坐标(背线)的访问器.
				  .interpolate("monotone");
				
				area1 = d3.svg.line()
				  .x(function(d) { return xscale(d.date); })  // 获取或设置x坐标的访问器.
				  .y(function(d,i) { return yscale(dataArr[c][i].rate+dataArr[c+1][i].rate); })
				   .interpolate("monotone");
			}else{
				var mdata;
				area = d3.svg.area()
				.x(function(d,i) { return xscale(d.date); })  // 获取或设置x坐标的访问器.
				  .y0(yscale(0)) //获取或设置y0坐标(基线)的访问器.
				  .y1(function(d,i) { return yscale(dataArr[c][i].rate+dataArr[c+1][i].rate+dataArr[c+2][i].rate); })  //获取或设置y1坐标(背线)的访问器.
				  .interpolate("monotone");
				
				area1 = d3.svg.line()
				  .x(function(d) { return xscale(d.date); })  // 获取或设置x坐标的访问器.
				  .y(function(d,i) { maxArr[maxArr.length] = dataArr[c][i].rate+dataArr[c+1][i].rate+dataArr[c+2][i].rate; return yscale(dataArr[c][i].rate+dataArr[c+1][i].rate+dataArr[c+2][i].rate); })
				   .interpolate("monotone"); //获取或设置y1坐标(背线)的访问器.
				
			}	
			
			var gs = _svg.append("g").append("path")
			.datum(arr)
			.style("opacity", 0)
			.transition()
			.duration(1000)
			.delay('1000')
			.attr("d", area)
			.attr("fill",color_area[c])
			.style("opacity", op_area[c])
			.attr("transform", "translate("+widths/50+","+change_position+")");
			
			
			var gs = _svg.append("g").append("path")
			.datum(arr)
			.attr("d", area1)
			.attr("fill", "none")
			.attr("stroke-linejoin", "round")
			.attr("stroke-linecap", "round")
			.attr("class","wave_slice")
			.attr("stroke-width",2)
			.attr("transform", "translate("+widths/50+","+change_position+")")
			.attr("stroke",colors[c]);
		}
		
	}
	function renderXAxis(_svg,dealAxis,change,change_position,change_x,xaxi) {//var x_option = {ticks:10,range:[0,640],translate:"20,214"};
		var widths = _svg.node().getBoundingClientRect().width;
		var option=getOption(_svg.node().parentNode);
		var yAxisHeight = option.chart.attrs.yAxisHeight;
		var svg_box=_svg.node().getBoundingClientRect();
		var x_width = svg_box.width-xaxi;
		var y_h = svg_box.height;
		var x_option = {ticks:0,translate:""+widths/50+","+(y_h+2)};
		var xdata =  option.chart.xAxis.data;
		var xAxis;
		var xscale;
		
		//初始化步长间隔 根据不同纬度 赋值 不同的 显示个数
		var stepJiange = 24;
		var dataTypeValue = $("#dataType").val();
		if(dataTypeValue==2){
			stepJiange = 12; //24小时
    	}else if(dataTypeValue==0){
    		stepJiange = 7;//7天
    	}else if(dataTypeValue==1){
    		stepJiange = 6;//13周
    	}else{
    		stepJiange = 12; //12个月
    	}
		
		if("ordinal"==option.chart.xAxis.type){
			if("bar"==option.type){
				xscale = d3.scale.ordinal()
                .domain(xdata)
                .rangeRoundBands([0,x_width], 0.1);
				  xAxis = d3.svg.axis()
				  .scale(xscale)
				  .orient("bottom")
				   .tickSize(0)
		           .outerTickSize(0);
			}else if("line"==option.type||"area"==option.type){
                  xscale = d3.scale.ordinal()
                .domain(xdata)
                .rangePoints([0,x_width], 0);
				  var values = [];
				  var size = xdata.length;
				  var step = size/stepJiange;
				  for(var i=0;i<size;){
					  values[values.length]=xdata[ Math.floor(i)];
					  i+=step;
				  }
			  xAxis = d3.svg.axis()
			  .scale(xscale)
			  .orient("bottom")
			  .ticks(15)
			  .tickValues(values)
			  .tickSize(0)
		      .outerTickSize(0);
			}
		}
		//创建X轴，并定义刻度方向
	   _svg.append("g")
	      .attr("class", "axis")
	      .attr("transform", "translate("+(change.translate)+")")
	      .call(xAxis)
	      .call(dealAxis);
        return xscale;
	}
	
 
	function renderYAxis(_svg,dealAxis,change,change_position,change_x) {//var y_option = {ticks:0,range:[210, 0],translate:"20,4"};
		var option=getOption(_svg.node().parentNode);
		var yAxisHeight = option.chart.attrs.yAxisHeight;
		var ma = option.chart.yAxis.maxValue;
		var svg_box=_svg.node().getBoundingClientRect();
		var y_h = svg_box.height;
		var y_option = {ticks:0,range:[y_h,0],translate:"0,0"};
		//创建一个线性定量变换，set变换的值域
		var yscale = d3.scale.linear().domain([0,1.25*ma]).range(y_option.range);
		//创建y轴，并指定刻度方向
		var yAxis = d3.svg.axis()
		  .scale(yscale)
		  .orient("left")
		  .ticks(y_option.ticks)
		  .tickSize(0)
		  .outerTickSize(0);
		  return yscale;;
	}
	function getOption(node){
		var pchart=d3.select(node).attr("dataId");
		var option=d3.select("#"+pchart).property("option");
		return option;
	}
	function drawTips(_svg,xscale,yscale,max,change,change_position,change_x){
		var widths = _svg.node().getBoundingClientRect().width;
		var option=dchart.getOption(_svg.node().parentNode);
		var xarr = option.chart.xAxis.data;
		var series = [];
		for(var i=0;i<option.chart.yAxis.series.length;i++){
			if(option.legend.cancle[i]==1){
				series[series.length]=option.chart.yAxis.series[i];
			}
		}	 
		
			var tipArr = [];
			var maxvalues;
			var comparevalue = -2;
			for(var i = 0; i < 4; i++){
				var json = {};
				var values = [];
				var tips = [];
			
				json.key=xarr[i];
				for(var c=0;c<series.length;c++){
					var serie = series[c];
					var varr = serie.data;
					values[values.length]=varr[i];
				}
				json.value=values;
				maxvalues = Math.max.apply(null,values);
				if(comparevalue<maxvalues){
					comparevalue=maxvalues;
				}
				json.tips=tips;
				tipArr[i]=json;
		}
		
		for(var i = 0; i < 4; i++){
			var yss;
			tipArr[i].yss = (option.chart.yAxis.maxValue/4)*(i+1);
		
		}
		var len = xarr.length;
			var gs = _svg.selectAll().data(tipArr).enter().append("g");
		     gs.append("line").attr("class","mark")
             .attr("x1", function(d){return xscale(xarr[0])})
			    .attr("y1",function(d,i){
					return yscale(d.yss*1.02);})
			    .attr("x2",  function(d){return xscale(xarr[xarr.length-1])})
             .attr("y2", function(d,i){return yscale(d.yss*1.02);})
             .attr("stroke-width", 1)
             .attr("stroke", "#fff")
             .attr("opacity",0.1)
             .attr("transform", "translate("+widths/50+","+change_position+")");
			 gs.append("text").text(function(d,i){
				 if(option.chart.yAxis.level==3){
					 return Math.round(d.yss)+"k";
				 }else if(option.chart.yAxis.level==6){
					 return Math.round(d.yss)+"m";
				 }else{
					 return Math.round(d.yss);
				 }
				 })
				.style("fill","#fff")
				.style("opacity",0.4)
				.style("text-anchor","end")
				.style("font-size","0.48rem")
				.attr("class","total")
				.attr("x",-5)
				.attr("y",function(d,i){return (yscale(d.yss)+4);})
				.attr("transform", "translate("+widths/50+","+change_x+")");
	}
	function uuid(len, radix) {
	    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	    var uuid = [], i;
	    radix = radix || chars.length;
	 
	    if (len) {
	      // Compact form
	      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
	    } else {
	      // rfc4122, version 4 form
	      var r;
	 
	      // rfc4122 requires these characters
	      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '_';
	      uuid[14] = '4';
	 
	      // Fill in random data.  At i==19 set the high bits of clock sequence as
	      // per rfc4122, sec. 4.1.5
	      for (i = 0; i < 36; i++) {
	        if (!uuid[i]) {
	          r = 0 | Math.random()*16;
	          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
	        }
	      }
	    }
	 
	    return 's'+uuid.join('');
	}
	function pie_chart(data){
		//初始化动效
		$(".second_row_one_child3").html("");
		$(".second_row_one_child3 svg").remove();
		var shadow_second = "<div id='shadow_second'><video src='images/pie_video_one.mov' autoplay='true'; style='position:absolute; top:0; left:0; right:0; bottom:0; margin:auto; width:100%; height: 100%;'></video></div>"
		$(".second_row_one_child3").append(shadow_second);
		$("#shadow_second").css("opacity" , "1").delay(2000).animate({"opacity":0});
		
		//定义宽，高，半径
		var width = $(".second_row_one_child3").width();
		var height = $(".second_row_one_child3").height();
		var	radius = height*0.37;
		//创建一个svg的group元素，将该组与div的宽高建立联系
		var svg = d3.select(".second_row_one_child3").append("svg").append("g").attr("width",width)
					.attr("transform", "translate(" + width/2 + "," + height /2.05 + ")");
		//创建三个group元素，添加相应的类
		svg.append("g").attr("class", "slices");  //圆环
	    svg.append("g").attr("class", "labels");  //提示的标签
		svg.append("g").attr("class", "lines");   //提示的折线
		
		var changes;  //TODO:total 文字的高度的偏移值
		var change_position;  //图片星星的宽度
		var change_x;  //图片星星的高度
		 if(window.screen.availWidth <= 1366){
	        	changes = 20;
	        	change_position = 50;
	        	change_x = 30;
	        }else if(window.screen.availWidth <= 1920){
	        	changes = 20;
	        	change_position = 50;
	        	change_x = 30;
	        }else if(window.screen.availWidth <= 3840){
	        	changes = 40;
	        	change_position = 100;
	        	change_x = 60;
	        }
			
		//定义饼状图布局
		var pie = d3.layout.pie().sort(null)  //控制饼状图顺时针方向的顺序
					    .value(function(d) {
							return d.value;
						});
		//新建一个弧度生成器
		var arc = d3.svg.arc()  
					.outerRadius(radius * 1)  //外半径
					.innerRadius(radius * 0.74); //内半径
		
		//新建一个弧度生成器，效果图中的阴影部分
		var arc1 = d3.svg.arc()  
					.outerRadius(radius * 0.77)  //外半径
					.innerRadius(radius * 0.72); //内半径
		//新建一个弧度生成器，使外边提示内容可以以圆心进行发散
		var outerArc = d3.svg.arc()
						 .innerRadius(radius * 1)  //外半径
						 .outerRadius(radius * 1);  //内半径


		//一个函数，返回值为data中的lable
		var key = function(d){ return d.data.label; };   
		var color = d3.scale.ordinal()  //定义一个比例尺
				      .domain(data.data)					 
					  .range(["#BED7A4", "#4CC5AA", "#6FB0E4", "#F7B64C", "#E9AFAB"]);
						  
		//TODO：创建一个新的map，用来绑定数据
		function randomData (){
			var labels = data.data;
			return labels.map(function(label,i){
				return { label: label+i, value: label }
			});
		}

		change(randomData(),data,changes);
			function change(data,datas,changes) {
				//设置字体大小
				var font;
				if (datas.total>10000) {
			        font = "1.2vw";
			    }else{
			    	font = "1.5vw";
			    }  
			//添加访问量，并且格式化。
			var dd = svg.select(".slices").append("text").text((datas.total || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'))
						.attr("text-anchor", "middle")
						.style("fill","#fff")
						.attr("class","num")
						.style("font-family",".DINNextW1G-Light")
						.style("font-size",font);
			//添加total文字
			var ee = svg.select(".slices").append("text").text("Total")
						.attr("text-anchor", "middle")
						.attr("class","total")
						.style("font-family",".HelveticaNeueLTStd-Light")
						.style("fill","#fff")
						.style("font-size","0.753rem")
						.attr("transform", "translate(0,"+changes+")");
			//添加path,添加slice类，绑定数据
			var slice = svg.select(".slices").selectAll("path.slice").data(pie(data), key);
	  
			/* ------- 饼状图 -------*/
			slice.enter().insert("path").style("fill", function(d) { return color(d.data.label); }).attr("class", "slice");
			slice.transition().duration(500).delay('1000').attr("transform","translate(0,0) rotate(-180,0,0)")
			.transition().duration(500).attr("transform","translate(0,0) rotate(0,0,0)")
			.attrTween("d", function(d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					return arc(interpolate(t));
				};
			});
			/* ------- 饼状图 -------*/
			slice.enter().insert("path").style("fill", function(d) { return color(d.data.label); }).attr("class", "slice1");
			slice.transition().duration(500).delay('1000').attr("transform","translate(0,0) rotate(-180,0,0)")
			.transition().duration(500).attr("transform","translate(0,0) rotate(0,0,0)").attr("opacity","0.6")
			.attrTween("d", function(d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					return arc1(interpolate(t));
				};
			});
			
			
			/* ------- 文本标签 -------*/
			
			var text = svg.select(".labels").selectAll("text").data(pie(data), key);
				text.enter().append("text").attr("dy", ".35em").style("font-family",".DINNextW1G-Light").style("font-size","1.291rem");

				function midAngle(d){
					return d.startAngle + (d.endAngle - d.startAngle)/2;
				}

			text.style("opacity" , 0).style("fill", function(d) { return color(d.data.label); })
				.text(function(d,i) {
					return d.data.value+"%";
			    })
			    .transition().delay(function(d,i){return 2500+i*3000}).duration(1000).style("opacity" , 1)
			    .attrTween("transform", function(d,i) {
					this._current = this._current || d;
					var interpolate = d3.interpolate(this._current, d);
					this._current = interpolate(0);
					return function(t) {
						var d2 = interpolate(t);
						var pos = outerArc.centroid(d2);
						pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
						if(pos[0]>0){
							pos[0] = pos[0]+width*0.11+5;
						}else{
							pos[0] = pos[0]-width*0.11-5;
						}
						return "translate("+ pos +")";
					};
			    })
			.styleTween("text-anchor", function(d){
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					return midAngle(d2) < Math.PI ? "start":"end";
				};
			})
			.transition()
			.duration(4000)
		    .style("opacity",0);


			/* ------- 文本折线 -------*/
			var polyline = svg.select(".lines").selectAll("polyline").data(pie(data), key).attr("fill","none");
				polyline.enter().append("polyline");

				polyline.style("opacity" , 0).style("stroke", function(d) { return color(d.data.label); }).transition().delay(function(d,i){return 2000+i*3000}).duration(1000).style("opacity" , 1)
						.attrTween("points", function(d,i){
							this._current = this._current || d;
							var interpolate = d3.interpolate(this._current, d);
							this._current = interpolate(0);
							return function(t) {
								var d2 = interpolate(t);
								var pos = outerArc.centroid(d2);
								var distance;
								pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
								if(pos[0]>0){
									distance = pos[0]+width*0.11+1;
								}else{
									distance = pos[0]-width*0.11-1;
								}
								var poi = outerArc.centroid(d2);
								return [arc.centroid(d2), poi, distance,pos[1]];
							};			
				}).transition()
				.duration(4000)
			    .style("opacity",0);
				
				/* ------- 小圆点 -------*/
				var circle = svg.select(".lines").selectAll("circle").data(pie(data), key);
				circle.enter().append("circle")
				.style("opacity" , 0).transition().delay(function(d,i){return 2000+i*3000}).duration(1000).style("opacity" , 1)
				.attrTween("transform", function(d,i) {
					this._current = this._current || d;
					var interpolate = d3.interpolate(this._current, d);
					this._current = interpolate(0);
					return function(t) {
						var d2 = interpolate(t);
						var pos = outerArc.centroid(d2);
						pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
						if(pos[0]>0){
							pos[0] = pos[0]+width*0.11;
						}else{
							pos[0] = pos[0]-width*0.11;
						}
						return "translate("+ pos +")";
					};
		       })
		       .attr("r", 2)
		       .style("fill", function(d) { return color(d.data.label); })
		       .transition()
				.duration(4000)
			    .style("opacity",0);;
			    /* ------- 图片-------*/
				var image = svg.select(".lines").selectAll("image").data(pie(data), key);   
				var length = document.getElementsByTagName("text")[4].getComputedTextLength();
				image.enter().append("image");
				image.style("opacity" , 0).attr("width",change_position)
					.attr("height",change_x)
					.attr("xlink:href",function(d,i){return "images/star"+i+".jpg"})
					 .transition().delay(function(d,i){return 2000+i*3000}).duration(1000).style("opacity" , 1)
					 .attrTween("transform", function(d,i) {
							this._current = this._current || d;
							var interpolate = d3.interpolate(this._current, d);
							this._current = interpolate(0);
							return function(t) {
								var d2 = interpolate(t);
								var pos = outerArc.centroid(d2);
								pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
								pos[1] = pos[1]+2;
								if(pos[0]>0){
									pos[0] = pos[0]+width*0.11+5;
								}else{
									pos[0] = pos[0]-width*0.11-5-length;
								}
								if(window.screen.availWidth <= 1366){
									pos[1] = pos[1];
						        }else if(window.screen.availWidth <= 1920){
						        	pos[1] = pos[1];
						        }else if(window.screen.availWidth <= 3840){
						        	pos[1] = pos[1]+9;
						        }
								return "translate("+ pos +")";
							};
			}).transition()
			.duration(4000)
		    .style("opacity",0);
			
		   //提示轮播动态效果
			function keepPlay(){
				image.style("opacity" , 0)
				.transition().delay(function(d,i){return i*4000}).duration(1000)
				.style("opacity" , 1).transition()
				.duration(4000)
			    .style("opacity",0);
				text.style("opacity" , 0)
				.transition().delay(function(d,i){return i*4000}).duration(1000)
				.style("opacity" , 1).transition()
				.duration(4000)
			    .style("opacity",0);
				circle.style("opacity" , 0)
				.transition().delay(function(d,i){return i*4000}).duration(1000)
				.style("opacity" , 1).transition()
				.duration(4000)
			    .style("opacity",0);
				polyline.style("opacity" , 0)
				.transition().delay(function(d,i){return i*4000}).duration(1000)
				.style("opacity" , 1).transition()
				.duration(4000)
			    .style("opacity",0);
			}
			
			setInterval(function(){
				keepPlay();
			},20000);
		};
	}
	
	

function drawAll(data, id,color,xExplain){
	//在对应的id中设置画布，设置画布的宽，高
	var width=$(".average_handing_chart").width();
	var height=$(".average_handing_chart").height();
	var tra;   //svg横向偏移量
	var position; //x坐标说明的纵向位置
	var tra_y; //svg纵向偏移量
	var cont; //count字符串的位置
	var xaxi_x;  //横坐标的纵向偏移量
	var tip_y;  //提示点的纵坐标
	//添加画布
	if(window.screen.availWidth <= 1366){
		tra = 25;
		position = 10;
		tra_y = 30;
		cont = 20;
		xaxi_x = -10;
		tip_y =  0;
    }else if(window.screen.availWidth <= 1920){
    	tra = 25;
		position = 10;
		tra_y = 30;
		cont = 20;
		xaxi_x = -10;
		tip_y =  0;
    }else if(window.screen.availWidth <= 3840){
    	tra = 45;
		position = 25;
		tra_y = 45;
		cont = 30;
		xaxi_x = 0;
		tip_y =  8;
    }
	//添加一个svg，并且添加一个组
	var g = d3.select("#"+id).append("svg").attr("width",width)
		.attr("height",height).append("g").attr("transform", "translate("+tra+","+tra_y+")");
	
	//获取数据中的最大值
	var maxT;  
	var mx = Math.round(Math.max.apply(null,data.y_data)/2)+"";
	var maxT = parseInt(mx.substr(0, 1))+1;
	for(var i=0;i<mx.length-1;i++){
		maxT = maxT+"0";
	}
	maxT = parseInt(maxT)*2;
	//获取x坐标中的最大值和最小值
	var maxX = Math.max.apply(null,data.x_data);
	var minX = Math.min.apply(null,data.x_data);
	
	//宽高根据屏幕不同设置不同的值
	if(window.screen.availWidth <= 1366){
		width = width-45;
		height = height-40;
    }else if(window.screen.availWidth <= 1920){
    	width = width-45;
    	height = height-40;
    }else if(window.screen.availWidth <= 3840){
    	width = width-65;
    	height = height-75;
    }
	
	//定义x坐标和y坐标的比例尺
	var x = d3.scale.linear().domain([minX, maxX]).range([0,width]);
	var y = d3.scale.linear().domain([0, maxT]).range([height, 0]);
	
	//定义波形阴影图
	var area = d3.svg.line().x(function(d) { return x(d.time); })
		.y(function(d) { return y(d.data); })
		.interpolate("monotone");
	
	//定义波形阴影图的描边
	var area1 = d3.svg.area().x(function(d) { return x(d.time);})
		.y0(function(d,i) { return y(0); })
		.y1(function(d,i) { return y(d.data); })
		.interpolate("monotone");
   //组装数据
	var dataArr = [];
	var xArr = [minX,Math.ceil(maxX/3),Math.ceil(maxX/3)*2,maxX]; //x坐标提示
	var yArr = [maxT/2,maxT];  //y坐标提示
	var times = data.x_data;
	var datas = data.y_data;
	var index = times.indexOf(data.maxXNum+"");
	for(var i=0;i<times.length;i++){
		var json = {};
		json["time"] = times[i];
		json["data"] = datas[i];
		dataArr[dataArr.length]=json;
	}	

	//定义波形阴影图的渐变的效果
	var linearGradient = g.append("defs").append("linearGradient")
					.attr("id","orange_red"+id)
					.attr("x1","0%")
					.attr("y1","0%")
					.attr("x2","0%")
					.attr("y2","100%");
	    linearGradient.append("stop").attr("offset","0%")
			.style("stop-color",color)
			.style("stop-opacity",1);
		linearGradient.append("stop").attr("offset","100%")
			.style("stop-color",color)
			.style("stop-opacity",0);
	//定义中间横线的渐变效果
	var line_color = g.append("defs").append("linearGradient")
					.attr("id","line_color")
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

	//添加波形阴影图，绑定数据，生成波形图
	var are = g.append("g").attr("transform", "translate(10,-10)");
	are.append("path").datum(dataArr)
		.attr("d", area)
		.attr("fill", "none")
		.style("stroke", color)
		.style("stroke-width",2);
	//添加波形阴影图描边
	are.append("path").datum(dataArr)
		.style("opacity", 0)
		.transition()
		.duration(1000)
		.delay('1000')
		.attr("d", area1)
		.style("opacity", 1)
		.attr("fill", 'url(#orange_red'+id+')');
	//添加提示横线
	var line = are.append("line").attr("x1",0)
				     .attr("x2",0)
					 .attr("y1",y(0))
					 .attr("y2",function(){return y(data.y_data[0])})
					  .attr("stroke-width","2")
				.attr("stroke","url(#line_color)")
				.attr("opacity",1);
	for(var i=1;i<=index;i++){
		line.transition()
		.duration(1000)
		.delay('500')
		.attr("x1",function(){return x(data.x_data[i])+5 })
		     .attr("x2",function(){return x(data.x_data[i])+5 })
			 .attr("y1",y(0))
			 .attr("y2",function(){return y(data.y_data[i]) })
	}
	//添加提示横线的圆圈
	var circle = are.append("circle")
			.attr("cx",function(){return x(data.x_data[0])})
			.attr("cy",function(){return y(data.y_data[0])} )
			.attr("r", 4)
			.style("fill", "#4da1ff")
			.attr("stroke-width","3")
		    .attr("stroke","#fff");
	for(var i=1;i<=index;i++){
		circle.transition()
		.duration(1000)
		.delay('500')
		.attr("cx",function(){return x(data.x_data[i])+5})
		.attr("cy",function(){return y(data.y_data[i])} )
	}
	//添加提示文本
	are.append("g").append("text").text(data.maxXNum)
			.style("fill","#fff")
			.style("font-size","0.48rem")
			.attr("class","total")
			.attr("text-anchor","end")
			.attr("x",function(d){return (x(data.maxXNum)+5)})
			.attr("y",function(){return y(0)+10+tip_y});

	
	//添加横坐标提示
	g.append("g").attr("transform", "translate(10,"+xaxi_x+")").selectAll("text").data(xArr)  //绑定数组
			.enter()        //指定选择集的enter部分
			.append("text")
			.text(function(d){return d})
		    .style("fill","#fff")
			.style("font-size","0.48rem")
			.attr("class","total")
			.attr("text-anchor","end")
			.style("opacity",0.4)
			.attr("x",function(d,i){return (x(d)+5)})
			.attr("y",function(){return y(0)+10});
//添加x坐标和y坐标的说明
	var g1 = g.append("g");
		g1.append("text")
			.text(xExplain)
		    .style("fill","#fff")
			.style("font-size","0.48rem")
			.attr("class","total")
			.attr("text-anchor","end")
			.style("opacity",0.4)
			.attr("x",function(d){return (x(maxX)+15)})
			.attr("y",function(){return y(0)+position});
		g1.append("text")
			.text("count")
		    .style("fill","#fff")
			.style("opacity",0.4)
			.style("font-size","0.48rem")
			.attr("text-anchor", "end")
			.attr("class","total")
			.attr("x",function(d) {return x(minX)})
			.attr("y",function(d){return y(maxT)-cont});
	//添加纵坐标提示
	g.append("g").selectAll("text").data(yArr)  //绑定数组
			.enter()        //指定选择集的enter部分
			.append("text")
			.attr("transform", "translate(0,-10)")
			.text(function(d){
				if(1000000>d && d>=1000){
					return d/1000 +"k";
				}else if(d>=1000000){
					return d/1000 +"m";
				}else{
					return d;
				}})
		    .style("fill","#fff")
			.style("font-size","0.48rem")
			.attr("class","total")
			.style("opacity",0.4)
			.attr("text-anchor", "end")
			.attr("y",function(d){return (y(d))})
			.attr("x",function(d) {return x(minX)});
	
}
	
	
})();
		
		
