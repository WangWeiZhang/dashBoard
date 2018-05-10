var map = (function() {
	return {
		register : register,  //注册方法
		drawMap:drawMap,      //生成地图
		query_map:query_map   //查询地图数据
	}
    function register(config){
		$("#map_chart").html("");  //清空地图svg
    	var svg = d3.select('#map_chart').append('svg');  //画地图svg
    	var fea; //全局变量，存放加载的世界地图json数据
    	var ass; //存放7个阶段对应的数字
    	var coloArr; //存放7个阶段对应的颜色
    	var changeArr; //存放7个阶段对应的颜色的高亮时候的颜色
    	query_map(config,svg);  //查询地图数据
    	
    	//执行提示动效
    	setTimeout(function(){showTip(config,svg,1)},1000*2);
    	setInterval(function(){showTip(config,svg,2)},1000*15);
	}
    // map数据加载
	function query_map(config,svg) {
		var param = {
			"dataType" : $("#dataType").val()
		}
		var options = {
			url : config.basePath + "/first/showUserHeat",
			type : 'post',
			data : param,
			dataType : "json",
			success : function(data) {
				
				//生成图例对应的提示信息，并格式化
				//min
				var min = Math.floor(data.data.min/100 )*100;  //获取最小值
				var max = Math.ceil(data.data.max/100)*100;    //获取最大值
				var minus = max -min;  //取得中间的差值
				var minHtml = min;
				var maxHtml = max;
				var middleHtml = (min+max)/2;
				if(min.toString().length >=3 && min.toString().length <=6){
					minHtml = (minHtml  || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1.');
					minHtml = Math.round(minHtml);
					if(minHtml == 1000){
						minHtml = minHtml/1000
						minHtml = minHtml.toFixed(1)+"M";
					}else{
						minHtml = minHtml+"K";
					}
				}else if(min.toString().length >=6 && min.toString().length <= 9){
					minHtml = (minHtml  || 0).toString().replace(/(\d)(?=(?:\d{5})+$)/g, '$1.');
					minHtml = Math.round(minHtml);
					minHtml = minHtml/10+"M";
				}
				
				//max
				if(max.toString().length >=3 && max.toString().length <=6){
					
					maxHtml = (maxHtml  || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1.');
					maxHtml = Math.round(maxHtml);
					if(maxHtml == 1000){
						maxHtml = maxHtml/1000
						maxHtml = maxHtml.toFixed(1)+"M";
					}else{
						maxHtml = maxHtml+"K";
					}
				}else if( max.toString().length >=6 && max.toString().length <= 9){
					maxHtml = (maxHtml  || 0).toString().replace(/(\d)(?=(?:\d{5})+$)/g, '$1.');
					maxHtml = Math.round(maxHtml);
					maxHtml = maxHtml/10+"M";
				}
				
				//middleHtml
				if(middleHtml.toString().length >=3 && max.toString().length <=6){
					
					middleHtml = (middleHtml  || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1.');
					middleHtml = Math.round(middleHtml);
					if(middleHtml == 1000){
						middleHtml = middleHtml/1000
						middleHtml = middleHtml.toFixed(1)+"M";
					}else{
						middleHtml = middleHtml+"K";
					}
				}else if( max.toString().length >=6 && max.toString().length <= 9){
					middleHtml = (middleHtml  || 0).toString().replace(/(\d)(?=(?:\d{5})+$)/g, '$1.');
					middleHtml = Math.round(middleHtml);
					middleHtml = middleHtml/10+"M";
				}
				//图例提示
				$("#legend_first").html(minHtml);   //替换第一个
				$("#legend_center").html(middleHtml);   //替换中间的
				$("#legend_last").html(maxHtml);   //替换最后一个
				
				var arr =[min,min+0.15*minus,min+0.3*minus,min+0.45*minus,min+0.6*minus,min+0.8*minus,max];  //分为7个阶段
				var dataJson = {};  //json对象   {"china":{"num":400,"countryCode":"333"}}，生成地图所需数据
				$.each(data.data.userHeat, function(index,val) {
					var valJson = {};
					valJson["countryCode"] = val.countryCode;
					valJson["num"] = val.userNum;
					dataJson[val.country]=valJson;
				});
				initMapData(dataJson,config,arr,svg);  //生成地图
				ass = arr;
		    },
		}    
		$.ajax(options);
	}
	/*
	 * 参数一：地图数据
	 * 参数二：config跟路径
	 * 参数三：颜色等级
	 * 参数四：svg容器
	 */
	function initMapData(map_data,config,arr,svg) {
		//颜色和高亮颜色
		 var colors=["#374d6a","#4075a4","#18aeff","#45d4e5","#1eb092","#6efc68","#f7c8a7"];
		 var changes=["#4580C5","#3C94E3","#2ECAFF","#74FAFF","#03FFCA","#A5FF9A","#FFE3CE"];
		 coloArr = colors;
		 changeArr = changes;
		 //加载json数据并过滤南极洲
		 $.getJSON("json/world-countries.json", function(data) {
            var features = _.filter(data.features, function(value, key) {
                return value.properties.name != 'Antarctica';
            });
            var country_data = map_data; //组装的json数据
            //组装的json数据和世界地图数据进行对比，生成相应的颜色和透明度和绑定对应的数据。
            for(var i = 0; i < features.length; i++){
                var feature = features[i];
                var name = feature.properties.name;
                if(country_data.hasOwnProperty(name)){
                    // 包含数据信息
                	var dataObject = country_data[name];
                    var heat = country_data[name].num;
                    feature.heat = heat;
                    if(heat<=arr[0]){
                        feature.color  =colors[0];
                        feature.change  =changes[0];
                    }else if(heat<=arr[1]){
                        feature.color  =colors[1];
                        feature.change  =changes[1];
                    }else if(heat<=arr[2]){
                        feature.color  =colors[2];
                        feature.change  =changes[2];
                    }
                    else if(heat<=arr[3]){
                        feature.color  =colors[3];
                        feature.change  =changes[3];
                    }
                    else if(heat<=arr[4]){
                        feature.color  =colors[4];
                        feature.change  =changes[4];
                    }
                    else if(heat<=arr[5]){
                        feature.color  =colors[5];
                        feature.change  =changes[5];
                    }
                    else{
                        feature.color  =colors[6];
                        feature.change  =changes[6];
                    }
                    feature.opacity = 1;
                    feature.properties.countryCode=dataObject.countryCode;
                }else{
                    feature.color  = "#FFFFFF";
                    feature.heat = 0;
                    feature.opacity = 0.1;
                }
            }
            fea = features;
            drawMap(features,config,svg); //画图
        })
	};
	var dataArr ={};  //地图经纬度信息
	/*
	 * 参数一：地图信息
	 * 参数二：config跟路径
	 * 参数三：svg容器
	 */
    function drawMap(features,config,svg){
        var tooltip = $(".tip");  //获取提示的div
        var height = $("#map_chart").height();  //定义高度
        var width = $("#map_chart").width(); //定义宽度
        //生成地图所需要的模型
        var projection = d3.geo.equirectangular();
        var oldScala = projection.scale();
        var oldTranslate = projection.translate();
        xy = projection.scale(oldScala * (width / oldTranslate[0] ) * 0.6)
            .translate([width / 2.2, height*0.7]); //是一个函数，根据经纬度返回对应的点的坐标
        path = d3.geo.path().projection(xy);
        //定义svg的高度和宽度
        svg.attr('width', width)
           .attr('height', height);
        //定义高斯滤镜，用于小圆点的模糊效果
        var filter = svg.append("defs").append("filter").attr("id","Gaussian_Blur");
		filter.append("feGaussianBlur")
			  .attr("in","SourceGraphic")
			  .attr("stdDeviation",1);
		//获取中国的颜色，为了将虚拟的南沙给对应的颜色
		var china;
		//绑定数据，生成地图
        svg.selectAll('path')
        	.data(features).enter()
        	.append('svg:path')
            .attr('d', path)
            .attr("fill", function(d, i) {
            	if("China" == d.properties.name ){
            		china =d.color;
            	}
                return d.color;
            })
            .attr("opacity",function(d,i){
            	if(d.opacity==0.1){
            		return d.opacity;
            	}else{
            		return 0.7;
            	}
            })
            .transition().duration(500)
            .attr("opacity", function(d, i) {
                return d.opacity;
            }).transition().duration(500)
            .attr("opacity",function(d,i){
            	if(d.opacity==0.1){
            		return d.opacity;
            	}else{
            		return 0.7;
            	}
            })
            .transition().duration(500)
            .attr("opacity", function(d, i) {
                return d.opacity;
            });
        	//读取json经纬度信息，获取国家对应的首都的信息
	        $.getJSON("json/data.json", function(data) {
	        	dataArr=data;
	        });
	        //虚拟的南沙群岛
	        var mapArr = [xy([114.22,10.23]),xy([112.83,9.35]),xy([112.50,8.51]),xy([115.32,9.54]),xy([116.32,21.00]),xy([117.51,15.07]),xy([112.21,16.51]),xy([123.47,25.75])];
            //生成南沙群岛的地图
	        svg.selectAll(".chinaMap").data(mapArr)  //绑定数组
				.enter()
				.append("circle")
            	.attr("transform", function(d){return "translate("+d+")"})
            	.attr("r", 0.5)
            	.attr("fill", china);
    }   
    function showCUV(country,config){
    	var country_data;
    	$.ajax({
            type:"post",
            url:config.basePath + "/first/showCountryUserVisits",
            dataType:"json",
            cache: false,
            async: false,
            data:{
            	"dataType" : $("#dataType").val(),
                "Country":country
            },
            success:function(data){
            	country_data=data.data;	
            }
        })
        return country_data;
    }
    
 // 取得ccountry截止到前一天的用户数量和访问量
    function showTip(config,svg,type){
   	 var tooltip = $(".tip");
   	$.ajax({
           type:"post",
           url:config.basePath + "/first/MapShow",
           dataType:"json",
           cache: false,
           async: false,
           success:function(data){
				var myLocation = xy(dataArr[data.data.country]);
				//格式化用户量
				var map_users_length = data.data.users.toString().length;
				if(map_users_length <= 5){
					data.data.users = (data.data.users  || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
				}else if(map_users_length <= 6){
					data.data.users = (data.data.users  || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1.');
					data.data.users = parseFloat(data.data.users).toFixed(1)+"K";
				}else if(map_users_length <= 7){
					data.data.users = (data.data.users  || 0).toString().replace(/(\d)(?=(?:\d{6})+$)/g, '$1.');
					data.data.users = parseFloat(data.data.users).toFixed(3)+"M";
				}else if(map_users_length <= 8){
					data.data.users = (data.data.users  || 0).toString().replace(/(\d)(?=(?:\d{6})+$)/g, '$1.');
					data.data.users = parseFloat(data.data.users).toFixed(2)+"M";
				}
				//格式化用户访问量
				var map_visits_length = data.data.users.toString().length;
				if(map_visits_length <= 5){
					data.data.visits = (data.data.visits  || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
				}else if(map_visits_length <= 6){
					data.data.visits = (data.data.visits  || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1.');
					data.data.visits = parseFloat(data.data.visits).toFixed(1)+"K";
				}else if(map_visits_length <= 7){
					data.data.visits = (data.data.visits  || 0).toString().replace(/(\d)(?=(?:\d{6})+$)/g, '$1.');
					data.data.visits = parseFloat(data.data.visits).toFixed(3)+"M";
				}else if(map_visits_length <= 8){
					data.data.visits = (data.data.visits  || 0).toString().replace(/(\d)(?=(?:\d{6})+$)/g, '$1.');
					data.data.visits = parseFloat(data.data.visits).toFixed(2)+"M";
				}
               
                //判断地图tip框返回中间部分的数据长度 大于 6  fontSize设置为1rem(变小)
                var m_users = $("#m_users").text().length;
                var m_visits = $("#m_visits").text().length;
                //对当前返回的国家进行单独和世界地图对比，生成相应的数据，颜色，透明度
                for(var i = 0; i < fea.length; i++){
                    var feature = fea[i];
                    var name = feature.properties.name;

                    
                    if(name==data.data.country){
                        // 包含数据信息
                   	 var heat = data.data.visits
                        feature.heat = heat;
                        if(heat<=ass[0]){
                            feature.color  =coloArr[0];
                            feature.change  =changeArr[0];
                        }else if(heat<=ass[1]){
                            feature.color  =coloArr[1];
                            feature.change  =changeArr[1];
                        }else if(heat<=ass[2]){
                            feature.color  =coloArr[2];
                            feature.change  =changeArr[2];
                        }
                        else if(heat<=ass[3]){
                            feature.color  =coloArr[3];
                            feature.change  =changeArr[3];
                        }
                        else if(heat<=ass[4]){
                            feature.color  =coloArr[4];
                            feature.change  =changeArr[4];
                        }
                        else if(heat<=ass[5]){
                            feature.color  =coloArr[5];
                            feature.change  =changeArr[5];
                        }
                        else{
                            feature.color  =coloArr[6];
                            feature.change  =changeArr[6];
                        }
                        feature.opacity = 1;
                    }
                }
                //提示框提示信息
                $("#contry_name").html(data.data.country);
                $("#m_users").html(data.data.users);
                $("#m_visits").html((data.data.visits|| 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
                $("#m_users").append("<p style='font-size:0.6rem;'>Users</p>");
                $("#m_visits").append("<p style='font-size:0.6rem;'>Visits</p>");
                //中国的颜色，为了处理南沙
                var chinaColor; 
                //将之前的地图数据进行移除
                svg.selectAll('path').remove();
                svg.selectAll('circle').remove();
                //重新生成新的数据
                svg.selectAll('path')
            	.data(fea).enter()
            	.append('svg:path')
                .attr('d', path)
                .attr("opacity",function(d,i){
                		return d.opacity;
                })
                .attr("fill", function(d, i) {
	                return d.color;
	            })
	            .attr("stroke-width","1")
				.attr("stroke","#22212F")
                .transition().duration(1000).delay(function(d,i){
                	if(data.data.country == d.properties.name ){
                		return 3500;
                	}else{
                		return 0;
                	}
                })
               .attr("fill", function(d, i) {
                	if(data.data.country == d.properties.name ){
                		return d.change;
                	}else{
                		return d.color;
                	}
                })
                .attr("opcity",function(d,i){
                	if(data.data.country == d.properties.name ){
                		return 1;
                	}else{
                		return d.opacity;
                	}
                })
                .transition().duration(function (d,i){
                	if(data.data.country == d.properties.name ){
                		return 1000;
                	}else{
                		return 0;
                	}
                })
	            .attr("fill", function(d, i) {
	            	if("China" == d.properties.name ){
                		chinaColor =d.color;
                	}
	                return d.color;
	            })
	            .attr("opcity",function(d,i){
	            	return d.opcity;
	            });
                var mapArr = [xy([114.22,10.23]),xy([112.83,9.35]),xy([112.50,8.51]),xy([115.32,9.54]),xy([116.32,21.00]),xy([117.51,15.07]),xy([112.21,16.51]),xy([123.47,25.75])];
                svg.selectAll(".chinaMap").data(mapArr)  //绑定数组
					.enter()
					.append("circle")
                	.attr("transform", function(d){return "translate("+d+")"})
                	.attr("r", 0.5)
                	.attr("fill", chinaColor);
               //生成小圆点并且加动效
                var circleTime;
                var tipTime;
                if(type==1){
                	circleTime = 130000;
                	tipTime = 8000;
                }else{
                	circleTime = 150000;
                    tipTime = 10000;
                }
                svg.append("circle")
                 .attr("transform", function(d){return "translate("+myLocation+")"})
                 .attr("opcity",0)
                 .attr("fill", "#fff")
                 .attr("r", 0)
                 .transition().delay('1000').duration(1000)
                 .attr("r", 6)
                 .attr("opcity",1)
                 .attr("filter","url(#Gaussian_Blur)")
                 .transition().duration(circleTime)
                 .attr("r", 0)
                 .attr("opcity",0);
                 tooltip
                   .css("left",myLocation[0]+"px")
                   .css("top",myLocation[1]+"px");
                 timer = setTimeout(function(){  
                	 tooltip.stop().show(500).delay(tipTime).hide(500); //.delay(tipTime).hide(500); 
                 },4000);    
           	}
           })
   }

})();