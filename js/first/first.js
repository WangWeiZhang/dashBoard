var first = (function() {
	return {
		register : register,
		query_satisfication:query_satisfication,
		query_channel:query_channel,
		query_average:query_average,
		query_comments:query_comments,
		query_realTimeData:query_realTimeData,
		change_type:change_type,
		query_new_user:query_new_user,
		num_fanzhuan_opacity:num_fanzhuan_opacity
		
	}
	var configpath;
    function register(config){
		setInterval(function(){query_realTimeData(config)},1000*5);
		setInterval(function(){query_realTimeData_one(config)},1000*5);
		$(".header_nav li").click(function(){
			$(this).attr("class","active").siblings("li").attr("class","inactive")
		})
		configpath = config;
		change_type(0);
	}
    
    function change_type(data){
    	$("#dataType").val(data);
    	var title = "";
    	if(data==2){
    		title += "24 Hours";
    	}else if(data==0){
    		title += "7 Days";
    	}else if(data==1){
    		title += "13 Weeks";
    	}else{
    		title += "12 Months";
    	}
    	console.log(title)
    	$("#visits_title").html("Visits Last "+title);
		$("#new_user_title").html("New Users Last "+title);
    	query_satisfication(configpath);
		query_channel(configpath);
		query_average(configpath);
		query_realTimeData(configpath);
		query_new_user(configpath);
		query_comments(configpath);
		num_fanzhuan_opacity();
		query_realTimeData_one(configpath);
		transfer.query_service_transfer(configpath);
    }
    
    //检查翻转数字的长度 根据长度设置字体大小
    function checkDigit(){
		var $quote = $(".odometer-digit");
	    var $numWords = $quote.length;
	    if (($numWords >= 3) && ($numWords < 4)) {
	        $(".odometer").css("font-size", "3vw");
	    }
	    else if (($numWords >= 4) && ($numWords < 5)) {
	        $(".odometer").css("font-size", "2.5vw");
	    } else{
	    	 $(".odometer").css("font-size", "2.6vw");
	    } 
	    
	    $("#visits_total").children($("#odometer3")).css("font-size", "3vw");
	    $("#total_users").children($("#odometer4")).css("font-size", "3vw");
	    
	    var len5= $("#odometer5").children($(".odometer-inside")).children($(".odometer-digit")).length;
	    if(len5>7){
	      $("#odometer5").css("transform", "scale(0.8)");
	      $("#odometer5").css("transform-origin", "left top");
	    }
	  
	}
   
    // Real time data数据加载
	function query_realTimeData(config) {
		var param = {
			"dataType" : $("#dataType").val()
		}
		var options = {
			url : config.basePath + "/first/realTimeData",
			type : 'get',
			data : param,
			dataType : "json",
			success : function(data) {
				
				var json = data.data;
				var num1=json.visits.visits_current;
				var num2=json.visits.visits_week;
				var num3=json.visits.total_visits;
				var num4=json.visits.total_users;
				$("#odometer1").show();
				$("#odometer2").show();
				$("#odometer3").show();
				$("#odometer4").show();
			    document.getElementById("odometer1").innerHTML=num1;
			    document.getElementById("odometer2").innerHTML=num2;
			    document.getElementById("odometer3").innerHTML=num3;
			    document.getElementById("odometer4").innerHTML=num4;
			    if($("#num_fanzhuan").val() > 1){
			    	//A并没有这个动画序列 所以当第二次定时请求的时候不会再加上B的模糊效果
					$(".odometer-ribbon-inner").css("animationName" , "A");
				}else{
					//B 是设置好的动画序列
					$(".odometer-ribbon-inner").css({"animationName" : "B" , "animationDuration" : "2s"});
				}
			    
			    var aaa = $("#odometer2").children("div").children($(".odometer-digit")).length;
			    if(aaa>8){
			    	$(".zuoshang_child").css("width" , "auto");
			    	$("#left_lashen").css("paddingRight" , "4.12rem")
			    }else if(aaa>10){
			    	$(".zuoshang_child").css("width" , "auto");
			    	$("#left_lashen").css("paddingRight" , "3.12rem")
			    }
			    checkDigit();
			    $("#num_fanzhuan").val(2);
		    },
		}    
		$.ajax(options);
	}
	function query_realTimeData_one(config) {
		var param = {
			"dataType" : $("#dataType").val()
		}
		var options = {
			url : config.basePath + "/first/realTimeData",
			type : 'post',
			data : param,
			dataType : "json",
			success : function(data) {
				var html ="";
				var json = data.data;
				var maxLength = data.data.countries[0].total_num.toString().length;
				$.each(json.countries, function(index,val) {
					html+="<ul class='s1_list_table'>";
					html+="<li class='first'><span>"+val.short_name+"</span></li>";
					html+="<li class='num'><span>"+(val.total_num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')+"</span></li>";
					html+="<li class='flag'><span>"+(val.change_num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')+"</span></li>";
					html+="</ul>";
				});
				$("#tbody").html(html);
				if($("#Tbody_list_hidden").val() == 1){
					var option1 = $(".first span");
					$.each(option1, function(index,val) {
						$(this).css({"opacity":0 , "top":10+"%"}).delay(0).animate({"top":"0" , "opacity":1 , "left":"0px"} , index*400);
					});	
					
					//根据 字符长度 动态计算 表格内元素的 初始位置 和 动效移动位置
					var option2 = $(".num span");
					$.each(option2, function(index) {
						if(maxLength <= 3){
							$(this).css({"opacity":0 , "left":-2+"%" }).delay(500).animate({"left":"34%" , "opacity":1} , index*400);
						}else if(maxLength <= 4){
							$(this).css({"opacity":0 , "left":-2+"%" }).delay(500).animate({"left":"26%" , "opacity":1} , index*400);
						}else if(maxLength <= 5){
							$(this).css({"opacity":0 , "left":-2+"%" }).delay(500).animate({"left":"25%" , "opacity":1} , index*400);
						}else if(maxLength <= 6){
							$(this).css({"opacity":0 , "left":-2+"%" }).delay(500).animate({"left":"16%" , "opacity":1} , index*400);
						}else if(maxLength <= 7){
							$(this).css({"opacity":0 , "left":-2+"%" }).delay(500).animate({"left":"11%" , "opacity":1} , index*400);
						}else if(maxLength <= 8){
							$(this).css({"opacity":0 , "left":-2+"%" }).delay(500).animate({"left":"7%" , "opacity":1} , index*400);
						}							
					});	
					
					var option3 = $(".flag span");
					$.each(option3, function(index) {
						$(this).css({"opacity":0 , "left":-4+"%" }).delay(500).animate({"left":"11%" , "opacity":1 ,"backgroundPosition":"10% 30%"} , index*400);
					});
					
				}else{
					
					$(".first span").css({"top" : "0px" , "left" : "0px" , "opacity" : 1});
					var option2 = $(".num span");
					$.each(option2, function() {
						if(maxLength <= 3){
							$(this).css({"opacity":1 , "left":"34%" });
						}else if(maxLength <= 4){
							$(this).css({"opacity":1 , "left":"26%" });
						}else if(maxLength <= 5){
							$(this).css({"opacity":1 , "left":"25%" });
						}else if(maxLength <= 6){
							$(this).css({"opacity":1 , "left": "16%" });
						}else if(maxLength <= 7){
							$(this).css({"opacity":1 , "left":"11%" });
						}else if(maxLength <= 8){
							$(this).css({"opacity":1 , "left": "7%" });
						}							
					});	
					$(".flag span").css({"left":"11%" , "opacity":1 });
				}
				
				$("#Tbody_list_hidden").val(2);
				
				
		    },
		}    
		$.ajax(options);
	}
    // key comments数据加载
	function query_comments(config) {
		var param = {
			"dataType" : $("#dataType").val()
		}
		var options = {
			url : config.basePath + "/first/keyComments",
			type : 'post',
			data : param,
			dataType : "json",
			success : function(data) {
				var data_option = data.data.data_option;
				$("#comments_span").html(data.data.startTime+"-"+data.data.endTime);
				var html = "";
				$.each(data_option, function(index,val) {
					if(val.keyComment != ""){
						if(index%5==0){
							html +=" <span class=\"tag\" style='color:#7D7AA9; '>"+val.keyComment+"</span>";
						}else if(index%4==0){
							html +=" <span class=\"tag\" style='color:#4E9EB1; '>"+val.keyComment+"</span>";
						}else if(index%3==0){
							html +=" <span class=\"tag\"style='color:#4990E2; '>"+val.keyComment+"</span>";
						}else if(index%2){
							html +=" <span class=\"tag\" style='color:#997964; '>"+val.keyComment+"</span>";
						}else{
							html +=" <span class=\"tag\" style='color:#717171; '>"+val.keyComment+"</span>";
						}
					}
				});
				
				$("#div1").html(html);
				var height = $("#div1").height();
				$("#div1").css("opacity" , 0).animate({"opacity":1} , 2000);
				//注册旋转标签云 fanzhuan.js
				$('#div1').cloudTag({ballSize : height/2.5} , data_option.length);
		    },
		}    
		$.ajax(options);
	}
    // customer satisfication数据加载
	function query_satisfication(config) {
		var param = {
			"dataType" : $("#dataType").val()
		}
		console.log(param);
		var options = {
			url : config.basePath + "/first/customerSatisfication",
			type : 'post',
			data : param,
			cache : false,
			dataType : "json",
			success : function(data) {
				dchart.pie_chart(data.data);  //生成饼状图
				showStar(data.data); //动态添加星星
		    },
		}    
		$.ajax(options);
	}
	// use channel数据加载
	function query_channel(config) {
		var param = {
			"dataType" : $("#dataType").val(),
		}
		console.log();
		var options = {
			url : config.basePath + "/first/userChannel",
			type : 'post',
			data : param,
			cache : false,
			dataType : "json",
			success : function(data) {
				drawChart(data.data);  //组装波形图
				var html = "";
				if(param.dataType==2){
					html += "<p>Visits By Access Channel Last 24 Hours</p>"
		    	}else if(param.dataType==0){
		    		html += "<p>Visits By Access Channel Last 7 Days</p>"
		    	}else if(param.dataType==1){
		    		html += "<p>Visits By Access Channel Last 13 Weeks</p>"
		    	}else{
		    		html += "<p>Visits By Access Channel Last 12 Months</p>"
		    	}
				html += "<ul>"
			    html += "<li><div id='li_one_div1'>"+data.data.data_option[0].rate+"%</div><div id='li_two_div1'><span class='circle circle_first'></span><span class='small' >"+data.data.data_option[0].name+"</span></div></li>"
			    html += "<li><div id='li_one_div2'>"+data.data.data_option[1].rate+"%</div><div id='li_two_div2'><span class='circle circle_second'></span><span class='small'>"+data.data.data_option[1].name+"</span></div></li>"
			    html += "<li><div id='li_one_div3'>"+data.data.data_option[2].rate+"%</div><div id='li_two_div3'><span class='circle circle_third'></span><span class='small' >"+data.data.data_option[2].name+"</span></div></li>"
			    html += "</ul>"
			    $("#sp_div").html(html);
				
		    },
		}    
		$.ajax(options);
	}
	// average 数据加载
	function query_average(config) {
		var param = {
			"dataType" : $("#dataType").val()
		}
		var options = {
			url : config.basePath + "/first/average",
			type : 'post',
			data : param,
			dataType : "json",
			success : function(data) {
				var json =  data.data;
				$(".average_handing_trend").css("opacity",0).delay(1600).animate({"opacity":1} , 1000);
				$(".average_round_trend").css("opacity",0).delay(1600).animate({"opacity":1} , 1000);
				$("#average_span").html(json.startTime+"-"+json.endTime);
				drawWaveChart(json);  //组装波形图
		    },
		}    
		$.ajax(options);
	}
	
	// ShowNewUserCount 数据加载
	function query_new_user(config) {
		var param = {
			"dataType" : $("#dataType").val()
		}
		var options = {
			url : config.basePath + "/first/ShowNewUserCount",
			type : 'post',
			data : param,
			dataType : "json",
			success : function(data) {
				var html ="";
				var json = data.data;
				var max = Math.ceil(json.maxV/100);
				var totalNum = 0;
				var JinDutiao = [];
				var greenLength;  
				var max_tip_index;
				var tip_text_max;
				$.each(json.data_option, function(index,val) {
					greenLength = index;
					JinDutiao.push(val.value/max);
					totalNum = totalNum + parseInt(val.value);
					
					if(param.dataType==0){
						//7day
						html +="<div class=\"progress_box_7day\">";
						html +="<div class=\"progress_name_7day\">";
						html +="<span>"+val.date+"</span>";
						html +="</div>";
						html +="<div class=\"progress_main_7day\">";
						html +="<div class=\"progress_7day\">";
						html +="<span class='green green"+index+"'_7day style='"+val.value/max+"%'></span>";
						html +="</div>";
						html +="</div>";
						html+="</div>";
					}else{
						html +="<div class=\"progress_box_7day\">";
						html +="<div class=\"progress_name_7day\">";
						if(index%2 == 0){
							html +="<span>"+val.date+"</span>";
						}else{
							html +="<span></span>";
						}
						
						html +="</div>";
						html +="<div class=\"progress_main_7day\">";
						html +="<div class=\"progress_7day\">";
						html +="<span class='green green"+index+"'_7day style='"+val.value/max+"%'></span>";
						html +="</div>";
						html +="</div>";
						html+="</div>";
					}
					
					if(json.maxV == val.value){
						max_tip_index = index;
						tip_text_max = json.maxV;
					}
					
				});
				
				$(".padding_ap1").html(html);
				$(".progress_box:eq("+max_tip_index+")").append("<div class='line_tip'><span>"+tip_text_max+"</span></div>");
			    $(".line_tip").css("opacity" , 0).animate({"opacity" : 1} , 1000);
			    
			    //tip框不同字数的缩放比
			    if($(".line_tip span").text().length > 4){
			    	$(".line_tip span").css({"display":"block" , "webkitTransform":"scale(0.75)" , "transform":"scale(0.75)"})
			    }else if($(".line_tip span").text().length >= 7){
			    	$(".line_tip span").css({"display":"block" , "webkitTransform":"scale(0.6)" , "transform":"scale(0.6)"})
			    }
			    
			    //数字翻转
			    $("#odometer5").show();
				document.getElementById("odometer5").innerHTML=totalNum;
				checkDigit();
				
				for(var i=0; i<=greenLength; i++){
					$(".green"+i).animate({"width":JinDutiao[i] + "%"} , 1000);
				}
		    },
		}    
		$.ajax(options);
	}
	function drawWaveChart(data){
		//每次请求新数据清空html dom文本
		$("#contentDiv1").html("");
		$("#contentDiv").html("");
		
		//Average 部分标题框-右面日期交互代码
		$(".average_chart_datasource").html(data.startTime+"-"+data.endTime);
		//Average 部分左上-分钟区域的交互代码
		$(".average_handing_score").html(data.data_option[0].averageData);
		//Average 部分左上- 箭头区域判断的代码
		var changeNum=data.data_option[0].changeNum;
		if(changeNum.substr(0,1)=="-"||changeNum=="0"){
		   $("#handing_trend").css({"backgroundImage":"url(images/arrow_down_green.png)" ,"backgroundRepeat":"no-repeat" , "backgroundSize":"0.269rem 0.8rem" ,"color" : "#50E3C2"})
		}else{
		   $("#handing_trend").css({"backgroundImage":"url(images/arrow_up_red.png)" ,"backgroundRepeat":"no-repeat" , "backgroundSize":"0.269rem 0.8rem" ,"color" : "#F44B60"})
		}
		$("#handing_trend").html(changeNum);
		
		//Average 部分左下- 滚动文字的代码
		$("#odometer7").show();
		document.getElementById("odometer7").innerHTML=data.data_option[1].averageData;
		checkDigit();
		//Average 部分左下- 箭头区域判断的部分
		var changeNum1=data.data_option[1].changeNum;
		if(changeNum1<=0){
		   $("#round_trend").css({"backgroundImage":"url(images/arrow_down_green.png)" ,"backgroundRepeat":"no-repeat" , "backgroundSize":"0.269rem 0.8rem" ,"color" : "#50E3C2"})
		}else{
		   $("#round_trend").css({"backgroundImage":"url(images/arrow_up_red.png)" ,"backgroundRepeat":"no-repeat" , "backgroundSize":"0.269rem 0.8rem" ,"color" : "#F44B60"})
		}
		$("#round_trend").html(changeNum1);
		
		//右面第一个波形图部分 - 遮挡的div 模拟特效的作用
		$("#contentDiv").append("<div id='shadow_third'></div>");
		$("#shadow_third").css("left","0px").delay(300).animate({"left":"100%"} , 2000);
		//生成右上部分的波形图
		dchart.drawAll(data.data_option[0], "contentDiv","#328DD6","mins"); 
		
		//右面第二个波形图部分 - 遮挡的div 模拟特效的作用
		$("#contentDiv1").append("<div id='shadow_four'></div>");
		$("#shadow_four").css("left","0px").delay(300).animate({"left":"100%"} , 2000);
		//生成右下部分的波形图
		dchart.drawAll(data.data_option[1], "contentDiv1","#B6E786","rounds");	
	}
	
	//组装use channel模块数据
    function drawChart(jsonData) {
    	//三组数据中取得最大值
    	var json = [];  
    	$.each(jsonData.data_option[0].show_data, function(index) {
    		json[json.length]=jsonData.data_option[0].show_data[index]+jsonData.data_option[1].show_data[index]+jsonData.data_option[2].show_data[index];
		});
    	var mx = Math.round(Math.max.apply(null,json)/4)+"";
    	var level = 0;
    	if(mx<1000000&&mx>=1000){
    		mx = mx.substr(0,mx.length-3);
    		level = 3;
    		$.each(jsonData.data_option, function(index,val) {
    			var arr = [];
				$.each(val.show_data, function(index1,value1) {
					arr[arr.length] = value1/1000;
	    		});	
				(jsonData.data_option)[index].show_data = arr;
    		});
    	}else if(mx>1000000){
    		level = 6;
    		mx = mx.substr(0,mx.length-6);
    		$.each(jsonData.data_option, function(index,val) {
    			var arr = [];
				$.each(val.show_data, function(index1,value1) {
					arr[arr.length] = value1/1000000;
	    		});	
				jsonData.data_option[index] = arr;
    		});
    	}
    	var new_max = parseInt(mx.substr(0, 1))+1;
    	for(var i=0;i<mx.length-1;i++){
    		new_max = new_max+"0";
    	}
    	new_max = parseInt(new_max)*4;
		var area_option = {
			pid : "report_area",
			type : "area",
			legend : {
				data : jsonData.data_option,
				cancle : [ 1, 1, 1 ]
			},
			colors : [ "#fff", "#37A7FF", "#B8E986" ],
			chart : {
				xAxis : {
					data : jsonData.time,
					type : "ordinal"
				},
				yAxis : {
					type : 'value',
					maxValue:new_max,
					level:level,
					series : [ {
						name : (jsonData.data_option)[0].name,
						type : 'line',
						smooth : true,
						itemStyle : {},
						data : (jsonData.data_option)[0].show_data	
						
					}, {
						name : (jsonData.data_option)[1].name,
						type : 'line',
						smooth : true,
						itemStyle : {
							normal : {
								areaStyle : {
									type : 'default'
								}
							}
						},
						data : (jsonData.data_option)[1].show_data
					}, {
						name : (jsonData.data_option)[2].name,
						type : 'line',
						smooth : true,
						itemStyle : {
							normal : {
								areaStyle : {
									type : 'default'
								}
							}
						},
						data : (jsonData.data_option)[2].show_data
					} ]
				},
				style : {
					"width" : "100%",
					"height" : "100%",
					"margin":0,
					"overflow" : "hidden"
				},
				attrs : {
					"xAxisWidth" : 0,
					"yAxisHeight" : 30
				}
			}
		}
		dchart.area(area_option);  //生成波形图
	}
	
	//星星移动的特效
	function showStar(data){
		var n = data.score.toFixed(1);
		var month=data.month;
		$("#satisfication_span").html(month);
		$("#star_score").html(n);
        var con_wid=document.getElementById("star_con").offsetWidth;
        var del_star=$("#del_star");
        //透明星星移动的像素
        var del_move=(n*con_wid)/5;
        del_star.animate({"left" : del_move+"px" } , 1500);
    }
    
    function num_fanzhuan_opacity(){
    	$(".bor_not").css("opacity" , 0).delay(200).animate({"opacity" : 1} , 2000);
    	$(".pub_h3").css("opacity" , 0).delay(200).animate({"opacity" : 1} , 2000);
    	$(".average_handing_score").css("opacity" , 0).delay(200).animate({"opacity" : 1} , 2000);
    	$(".average_round_num_box").css("opacity" , 0).delay(200).animate({"opacity" : 1} , 2000)
    }
})();