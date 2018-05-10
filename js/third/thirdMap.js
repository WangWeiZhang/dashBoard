var thirdMap = (function() {
	return {
		register : register,  //注册方法
		drawMap:drawMap,      //生成地图
		query_map:query_map   //查询地图数据
	}
    function register(config){
		$("#map_chart").html("");  //清空地图svg
    	var svg = d3.select('#map_chart').append('svg');  //画地图svg
    	var legendArr;  //图例值的分布,7个阶段
    	colors=["#374d6a","#4075a4","#18aeff","#45d4e5","#1eb092","#6efc68","#f7c8a7"];  //开始时颜色
    	changes=["#4580C5","#54a2e8","#2ECAFF","#74FAFF","#03FFCA","#A5FF9A","#FFE3CE"]; //改变时颜色
    	stroageData = {};
    	firstOrAfterConst = 0;
		var dataArr ={};  //地图首都经纬度信息
    	query_map(config,svg,"/first/showUserHeat");
//    	query_map(config,svg,"/json/thirdModule/showHeat.json");
	}
    
    function eachMessage(config , svg , url){
    	setTimeout(function(){query_map(config,svg,url)},1000*5);
    }
    
    // map数据加载
	function query_map(config,svg,url) {
		var options = {
			url : config.basePath + url,
			type : 'get',
			data : {},
			dataType : "json",
			success : function(data) {
				/* 1、判断请求过来的接口 是否有国家 和 对话
				 * 2、有的话 将本次的记录存起来。
				 * 3、没有的话将已经存起来的记录在赋值给data  保证请求不到数据的时候，显示上一次对话内容和国家
				 * */
				if(data.status == "success"){
					if(data.data.userHeat.length != 0){
						stroageData = data;
					}else{
						if(stroageData.flag=="first"){
							setTimeout(function(){eachMessage(config , svg , "/third/realTimeOfMap")},1000*5);
							return false;
							//setTimeout(function(){eachMessage(config , svg , "/json/thirdModule/realTimeOfMap.json")},1000*5);
						}else{
							data = stroageData;
						}
					}
				}else{
					
					if(stroageData.flag=="first"){ //存储的是 分布国家list
						setTimeout(function(){eachMessage(config , svg , "/third/realTimeOfMap")},1000*5);
						//setTimeout(function(){eachMessage(config,svg,"/json/thirdModule/realTimeOfMap.json")},1000*5);
						return false;
					}else{							//存储的是 实时对话 list
						data = stroageData;
					}
					
				}
				
//				console.log("存储给stroageData的数据");
//				console.log(stroageData);
				
				
				
				//获取图例说明：中间值，最大值和最小值
				var min = Math.floor(data.data.min/100 )*100;  //获取最小值
				var max = Math.ceil(data.data.max/100)*100;   //获取最大值
				var minus = max -min;  //取得中间的差值
				var minHtml = min;
				var maxHtml = max;
				var middleHtml = (min+max)/2;
				
				
				/*999  =  999
				 *1234 =  1k
				 *12345 = 12k
				 *123456 = 123k
				 *999456 = 999k
				 *999546 = 1000k  = 1.M 
				 * */
				//min
				if(min.toString().length >=3 && min.toString().length <=6){
					minHtml = (minHtml  || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1.');
					minHtml = Math.round(minHtml);
					if(minHtml == 1000){
						minHtml = minHtml/1000
						minHtml = minHtml.toFixed(1)+"M";
					}else{
						minHtml = minHtml+"K";
					}
				}else if(min.toString().length >= 6 && min.toString().length <= 9){
					minHtml = (minHtml  || 0).toString().replace(/(\d)(?=(?:\d{5})+$)/g, '$1.');
					minHtml = Math.round(minHtml);
					minHtml = minHtml/10+"M";
				}
				
				if(max.toString().length >=3 && max.toString().length <=6){
					maxHtml = (maxHtml  || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1.');
					maxHtml = Math.round(maxHtml);
					if(maxHtml == 1000){
						maxHtml = maxHtml/1000
						maxHtml = maxHtml.toFixed(1)+"M";
					}else{
						maxHtml = maxHtml+"K";
					}
				}else if(max.toString().length >=6 && max.toString().length <= 9){
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
				}else if(max.toString().length >=6 && max.toString().length <= 9){
					middleHtml = (middleHtml  || 0).toString().replace(/(\d)(?=(?:\d{5})+$)/g, '$1.');
					middleHtml = Math.round(middleHtml);
					middleHtml = middleHtml/10+"M";
				}
				
				$("#legend_first").html(minHtml);   //替换第一个
				$("#legend_center").html(middleHtml);   //替换中间的
				$("#legend_last").html(maxHtml);   //替换最后一个
				
				legendArr =[min,min+0.15*minus,min+0.3*minus,min+0.45*minus,min+0.6*minus,min+0.8*minus,max];  //图例分为7个阶段
				
				var dataJson = {};  //json对象   {"china":{"num":400,"countryCode":"333"}}
				$.each(data.data.userHeat, function(index,val) {
					var valJson = {};
					valJson["countryCode"] = val.countryCode;
					valJson["num"] = val.userNum;
					dataJson[val.country]=valJson;
				});
				
				initMapData(dataJson, config,legendArr,svg, data);  //生成地图
		    },
		}    
		$.ajax(options);
	}
	/*
	 * 参数一：返回地图数据
	 * 参数二：config跟路径
	 * 参数三：颜色等级
	 * 参数四：svg容器
	 */
	function initMapData(dataJson,config,legendArr,svg,data) {
		var returnData = data;
		 $.getJSON("json/world-countries.json", function(data) {
			/* 1、将所有国家列表的json中  除了 “Antarctica” (南极洲)的所有地方全部返回。
			 * 2、目的是为了不然d3地图画出南极洲 
			 * 3、如想自行扩展，可以在进行其他筛选
			 * 4、以下features对象，就是我们经过处理筛选获得的 没有南极洲的剩余所有国家。
			 *  */
            var features = _.filter(data.features, function(value, key) {
                return value.properties.name != 'Antarctica';
            });
            //features ：除了南极洲的其他所有地域。
            for(var i = 0; i < features.length; i++){
                var feature = features[i]; //每次循环按索引赋值的一组对象(全球json)
                var name = feature.properties.name; //每次循环的一组对象中的 国家或地域名称（全球json）
				//对比 请求过来的国家 和 本地全球国家的地域国家名称 
                if(dataJson.hasOwnProperty(name)){
                	feature.fillter ="url(#Gaussian_Blur)";
                    // 包含数据信息  // 
                	var dataObject = dataJson[name]; 
                    var heat = dataObject.num;
                    feature.heat = heat;  //将全球json中的 heat 值 设置为 请求过来的。 从而统一色域
                    if(heat<=legendArr[0]){
                        feature.color  =colors[0];
                        feature.change  =changes[0];
                    }else if(heat<=legendArr[1]){
                        feature.color  =colors[1];
                        feature.change  =changes[1];
                    }else if(heat<=legendArr[2]){
                        feature.color  =colors[2];
                        feature.change  =changes[2];
                    }
                    else if(heat<=legendArr[3]){
                        feature.color  =colors[3];
                        feature.change  =changes[3];
                    }
                    else if(heat<=legendArr[4]){
                        feature.color  =colors[4];
                        feature.change  =changes[4];
                    }
                    else if(heat<=legendArr[5]){
                        feature.color  =colors[5];
                        feature.change  =changes[5];
                    }
                    else{
                        feature.color  =colors[6];
                        feature.change  =changes[6];
                    }
                    feature.opacity = 1;
                    feature.properties.countryCode=dataObject.countryCode; //在本地的json中创建一个对象countryCode 然后将国家简码赋值给他
                }else{
                	//对比两个对象， 没有重复的时候，地图处于初始状态
                    feature.color  = "#4E4C5B";
                    feature.change = "#4E4C5B";
                    feature.heat = 0;
                    feature.opacity = 1;
                    feature.fillter ="none";
                }
            }
            drawMap(features,config,svg,dataJson,returnData);
        });
	};
	
	/*
	 * 参数一：地图信息
	 * 参数二：config跟路径
	 * 参数三：svg容器
	 */
	
    function drawMap(features,config,svg,dataJson,returnData){
    	if(firstOrAfterConst>1){
    		$('.mapMessageInner').html("");
    		$(".maplineFille").css("opacity",0);
	    	$(".dialog-text-box").css("padding","0px 0px 0px 0px");
	    	$(".dialog-text-box").attr("class","dialog-text-box animated myselfUp");
			setTimeout(function(){
				$(".dialog-box-title").attr("class","dialog-box-title animated fadeOut");
			} , 800)
	    	setTimeout(function(){
	    		$("#map_chart").children("svg").transition({ translate: "0px,0px", scale: 1 }, 1000, 'linear');
	    	} , 1300)
    	}
    	firstOrAfterConst++;
        var height = $("#map_chart").height();  //定义高度
        var width = $("#map_chart").width(); //定义宽度
        
        var projection = d3.geo.equirectangular();//d3.geo.mercator();
        var oldScala = projection.scale();
        var oldTranslate = projection.translate();
        xy = projection.scale(oldScala * (width / oldTranslate[0] ) * 0.5).translate([width / 2.1, height*0.55]);
        path = d3.geo.path().projection(xy);
        svg.attr('width', width).attr('height', height);
        
		var chinaColor; 
		var filter = svg.append("defs").append("filter")
		.attr("id","Gaussian_Blur");
		filter.append("feGaussianBlur")
			  .attr("in","SourceGraphic")
			  .attr("stdDeviation",1);
		svg.selectAll('path').remove();
		var highColor = svg.selectAll('path')
           .data(features).enter()
           .append('svg:path')
           .attr('d', path)
           .attr("stroke-width","1")
           .attr("stroke" , "#22212F")
           .attr("fill", function(d, i) {
			if("China" == d.properties.name ){
				chinaColor =d.color;
			}
			return d.color;
            })
        
        //地图高亮显示
		function highColorFn(){
			
			highColor.transition().delay(2400).duration(200)  
            .attr("fill", function(d, i) {
                return d.color;
            }).transition().duration(200)
            .attr("fill",function(d,i){
            	return d.change;
            })
            .attr("filter",function(d,i){
            	return d.fillter
            })
            .transition().duration(200)
            .attr("fill", function(d, i) {
                return d.color;
            })
            .transition().duration(200)
            .attr("fill",function(d,i){
            	return d.change;
            })
            .attr("filter",function(d,i){
            	return d.fillter
            })
            .attr("fill", function(d, i) {
                return d.color;
            })
            .transition().duration(200)
            .attr("fill",function(d,i){
            	return d.change;
            })
            .attr("filter",function(d,i){
            	return d.fillter
            })
            .transition().duration(200)
            .attr("fill", function(d, i) {
                return d.color;
            })
            .attr("filter",function(d,i){
            	return "none"
            })
		}
		
           
        	//读取json首都经纬度信息
        	$.getJSON("json/data.json", function(data) {
	        	dataArr=data;
	        	if(returnData.data.userHeat.length == 1){
		        	$.each(dataJson , function(name,value){
		        			if(data[name] != undefined){
			        			var countryX = data[name][0];
			        			var countryY = data[name][1];
			        			var newCssXy = xy([countryX,countryY]);
			        			    countryX = newCssXy[0];
			        			    countryY = newCssXy[1];	
			        			var CenterWidth = $("#map_chart").width();
			        			var CenterHeight = $("#map_chart").height();
			        			var newX = (CenterWidth/2 - countryX)+CenterWidth/8;
			        			var newY = (CenterHeight/2 - countryY);
			        			setTimeout(function(){
			        				/*現在的*/
			        				
			        				$("#map_chart").children("svg").css("transform-origin",""+countryX+"px "+countryY+"px").delay(600).transition({ translate: ""+newX+","+newY+"" , scale: 1.2}, 1000, 'linear');
			        				highColorFn();
			        				setTimeout(function(){
			        					$(".dialog-box-title").attr("class","dialog-box-title animated fadeIn");
				        				$(".dialog-text-box").attr("class","dialog-text-box animatedd myself");
				        				setTimeout(function(){
				        					$(".dialog-text-box").css("padding","0.96rem 1.227rem 1.227rem 1.39rem");
				        					$(".maplineFille").css("opacity",1);
				        				} , 800)
			        				} , 3600);
			        	    		setTimeout(function(){
			        	    			appendMesage(returnData , config , svg );
			        	    		},4500);
			        			} , 5000);
		        			}else{
		        				setTimeout(function(){
		        					eachMessage(config , svg , "/third/realTimeOfMap");
//		        					eachMessage(config , svg , "/json/thirdModule/realTimeOfMap.json");
		        				},5*1000);
		        			}
		        		
		        	});
	        	}else{
	        		setTimeout(function(){
//	        			eachMessage(config , svg , "/json/thirdModule/realTimeOfMap.json");
	        			eachMessage(config , svg , "/third/realTimeOfMap");
    				},5*1000);
	        	}
	        });
	        
	        var mapArr = [xy([114.22,10.23]),xy([112.83,9.35]),xy([112.50,8.51]),xy([115.32,9.54]),xy([116.32,21.00]),xy([117.51,15.07]),xy([112.21,16.51]),xy([123.47,25.75])];
            svg.selectAll(".chinaMap").data(mapArr)  //绑定数组
				.enter()
				.append("circle")
            	.attr("transform", function(d){return "translate("+d+")"})
            	.attr("r", 0.5)
            	.attr("fill", chinaColor);
            
            $("#map_chart").addClass('animated fadeIn');
            $(".legendTitle").animate({"opacity":1},1000);
            $.each( $(".boxboxbox div") , function (i, item) {
                setTimeout(function(){
                   $(".boxboxbox div").eq(i).animate({"opacity":1} , 800);
                } , i * 50);
            });
    }   
    
    //隔秒 append message 到实时对话框
    function appendMesage(returnData , config , svg){
    	var config = config;
    	var svg = svg;
    	var a = 0;
    	
    	$('.mapMessageInner').html("");
    	$("#dialogCountry").html(returnData.data.userHeat[0].countryCode);
    	$("#dialogChannel").html(returnData.data.accessChannel);
    	
		$.each(returnData.data.message , function(index , value){
			if(value.type == "user"){
				var type=value.type;
				$.each(value.content , function(index , value){
					var message_type = value.message_type;
					var textValue = value.payload.text;
					if(value.message_type == "text"){
						var str = "";
						str += "<div class='people-firev'><div class='people-inner '><div class='messageDiv'><p class='userSpText'><span class='rabotSpan'>"+value.payload.text+"</span><span class='masBg1'></span></p></div><p class='userChatIcon animated bounceIn'></p></div></div>";
							setInterValMessageAppend(str , returnData , type , message_type , textValue);
					}else if(value.message_type == "radio"){
						var str = "";
						str += "<div class='people-firev'><div class='people-inner '><div class='messageDiv'><p class='userSpText' id='chatUserRadioMessage'><span class='rabotSpan' id='userRadioSpan'>&nbsp;&nbsp;&nbsp;................</span><span class='masBg1'></span></p></div><p class='userChatIcon animated bounceIn'></p></div></div>";
							setInterValMessageAppend(str , returnData , type , message_type , textValue);
					}else{
						var str = "";
							setInterValMessageAppend(str , returnData , type , message_type , textValue);
					}
				})
			}else if(value.type == "chatbot"){
				var type=value.type;
				$.each(value.content , function(index , value){
					var message_type = value.message_type;
					var textValue = value.payload.text;
					if(value.message_type == "text"){
						var str = "";
						str +=	"<div class='robot-firev'>";
						str +=	"<div class='robot-inner '><p class='chatIcon animated bounceIn'></p><div class='messageDiv'><p class='spText'><span class='userTextSpan'>"+value.payload.text+"</span> <span class='masBg'></span></p></div></div>";
						str +=	"</div>";
							setInterValMessageAppend(str , returnData ,  type , message_type , textValue);
					}else if(value.message_type == "selection"){
						var message_type = value.message_type;
						var textValue = value.payload.text;
						var str = "";
						str +=	"<div class='robot-firev'>";
						str +=  "<div class='robot-inner'><p class='chatIcon'></P>";
						str +=  "<div class='messageDiv'><p class='masBg masBgSelect'></p><div class='selectTab'>"
						$.each(value.payload.selections , function(index , value){
							str +=  "<h6>"+value.text+"</h6>";
						});
						str +=	"</div></div></div></div>";
							setInterValMessageAppend(str , returnData ,  type , message_type , textValue);
					}else if(value.message_type == "evaluation"){
						var message_type = value.message_type;
						var textValue = value.payload.text;
						var str = "";
						str+="<div class='robot-firev'>";
					    str+="<div class='robot-inner'>";
					    str+="<p class='chatIcon animated bounceIn'></p>";
					    str+="<div class='messageDiv'>";
					    str+="<div class='commentTextMap'><div><p class='commentTitle'><span>Your feedback is very important for us.</p></span>";       
					    str+="<ul id='starOrstarBlue'><li><img src='images/thirdimg/star.png'></li><li><img src='images/thirdimg/star.png'></li><li><img src='images/thirdimg/star.png'></li><li><img src='images/thirdimg/star.png'></li><li><img src='images/thirdimg/star.png'></li></ul>";      	
					    str+="<div class='inputModule'>" ;
					    str+="<div class='commentSelect'>";
					    str+="<p style='background:#1d6096;' >Please select a rating tag</p>";
					    str+="</div>";
					    str+="</div>"; 
					    str+="<p class='user-text'>More suggestions …</p>";    			
					    str+="</div>";
					    str+="<span class='masBg'></span>";       	
					    str+="</div></div></div></div>" ;
							setInterValMessageAppend(str , returnData ,  type , message_type , textValue);
					}else if(value.message_type == "video"){
						var message_type = value.message_type;
						var textValue = value.payload.text;
						var str = "";
						str +=	"<div class='robot-firev'>";
						str +=	"<div class='robot-inner '><p class='chatIcon animated bounceIn'></p><div class='messageDiv'><p class='spText'><video class='video' loop='loop' autoplay='' name='media'><source src='"+value.payload.url+"' type='video/mp4'></video> <span class='masBg'></span></p></div></div>";
						str +=	"</div>";
						setInterValMessageAppend(str , returnData ,  type , message_type , textValue);
					}
				});
			}
			
		})
		
		//实时请求
		var b=0;
		function setInterValMessageAppend(str , data , type , message_type , textValue){
			setTimeout(function(){
				$('.mapMessageInner').append(str);
				if(data.data.accessChannel == "Facebook"){
					$(".robot-inner p.chatIcon").css({"backgroundImage":"url(images/thirdimg/facebookBig.png)", "backgroundRepeat":"no-repeat" , "backgroundSize":"100% auto" , "backgroundPosition":"top center"});
					$(".robot-firev + .robot-firev .robot-inner p.chatIcon").css({"backgroundImage":"url()"});
					
				}else{
					$(".robot-inner p.chatIcon").css({"backgroundImage":"url(images/thirdimg/channel1.png)", "backgroundRepeat":"no-repeat" , "backgroundSize":"100% auto" , "backgroundPosition":"top center"})
					$(".robot-firev + .robot-firev .robot-inner p.chatIcon").css({"backgroundImage":"url()"})
				}
				setTimeout(function(){
					if(type == "user"){
						if(message_type == "text"){
							$(".people-inner .messageDiv").show(400).children("p")
														  .delay(1000).addClass("animated pulse111")
														  .parent()
														  .find($(".userSpText"))
														  .children("span").delay(300).animate({"opacity":1} ,400);
						}else if(message_type == "evaluate-score"){
							switch(textValue)
							{
								case "20":
									$(".commentTextMap:last").find("li").eq(0)
									  				 .children("img").attr("src" , "images/thirdimg/star_blue.png")
									  				 .parent("li").prevAll("li").children("img")
									  				 .attr("src" , "images/thirdimg/star_blue.png");
								break;
								
								case "40":
									$(".commentTextMap:last").find("li").eq(1)
									  				 .children("img").attr("src" , "images/thirdimg/star_blue.png")
									  				 .parent("li").prevAll("li").children("img")
									  				 .attr("src" , "images/thirdimg/star_blue.png");
								break;
								
								case "60":
									$(".commentTextMap:last").find("li").eq(2)
													 .children("img").attr("src" , "images/thirdimg/star_blue.png")
													 .parent("li").prevAll("li").children("img")
													 .attr("src" , "images/thirdimg/star_blue.png");
								break;
								
								case "80":
									$(".commentTextMap:last").find("li").eq(3)
													 .children("img").attr("src" , "images/thirdimg/star_blue.png")
													 .parent("li").prevAll("li").children("img")
													 .attr("src" , "images/thirdimg/star_blue.png");
								break;
								
								case "100":
									$(".commentTextMap:last").find("li").eq(4)
														.children("img").attr("src" , "images/thirdimg/star_blue.png")
														.parent("li").prevAll("li").children("img")
														.attr("src" , "images/thirdimg/star_blue.png");
								break;
								
								default:break;
							}
						}else if(message_type == "evaluate-words"){
							$(".commentTextMap:last").find($(".commentSelect")).append("<p class='fadeIn'>"+textValue+"</p>");
						}else if(message_type == "evaluate-input"){
							$(".commentTextMap:last").find($(".user-text")).html("").append("<span style='color:#fff'>"+textValue+"</span>");
						}else if(message_type == "radio"){
							$(".people-inner .messageDiv").show(400).children("p")
							  .delay(1000).addClass("animated pulse111");
						}
						
					}else if(type == "chatbot"){
						
						if(message_type == "text" || message_type == "selection"){
							$(".robot-inner .messageDiv").show(400).children("p")
														 .delay(1000).addClass("animated pulse111")
														 .parent()
														 .find($(".spText"))
														 .children("span")
														 .delay(300).animate({"opacity":1} , 400);
							$(".robot-inner .selectTab").addClass("animated pulse111");
						}else if(message_type == "evaluation"){
							$(".robot-inner .messageDiv").show(400)
													     .delay(1000).addClass("animated pulse111")
													     .find($(".commentTitle")).children("span")
													     .delay(300).animate({"opacity":1} , 400)
													     .parent("p").next("ul").children("li")
													     .delay(300).animate({"opacity":1} , 400)
													     .parent("ul").next("div")
													     .delay(300).animate({"opacity":1} , 400)
													     .next("p")
													     .delay(300).animate({"opacity":1} , 400);
						}else if(message_type == "video"){
							$(".robot-inner .messageDiv").show(400).children("p")
														 .delay(1000).addClass("animated pulse111")
														 .parent()
														 .find($(".spText"))
														 .children("video")
														 .delay(300).animate({"opacity":1} , 400);
						}
						
					}
					
				} , 400)
				
				$(".dialog-text-box").delay(700).animate({ scrollTop:($(".mapMessageInner").height()*1.3)}, 1000);
				
				$(".people-inner").addClass("fadein");
				$(".robot-inner ").addClass("fadein");
				b++;
				console.log("我是第"+b+"条消息");
				if(b == a){	
						//eachMessage(config , svg , "/json/thirdModule/realTimeOfMap.json");
						eachMessage(config , svg , "/third/realTimeOfMap");
				}
				
				
			}, a * 5000);
			a++; 
			console.log("一共有"+a+"条消息")
			
			
		}
		
    }
})();