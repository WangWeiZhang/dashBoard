var senRntAjax = (function() {
	return {
		register : register,
		change_type:change_type,
		num_fanzhuan_opacity:num_fanzhuan_opacity
	}
	
	/*全局定义一个 configpath 的基本路径 用啦在特定的方法中使用   
	 *
	 *configpath 的Object 的对应关系 隶属于 windows*/
	var configpath;
	
	/*s2注册方法
	 * 1、动态的统一四个维度的标题
	 * 2、调用页面所有数据的接口方法（register是一个主方法-入口方法）
	 * */
    function register(config){
//    	setInterval(function() {
//			change_page()
//		}, 1000 * 30);
    	var type = $("#dataType").val();//获取隐藏域中的value值（用来确定4个不同的纬度请求不同的参数）
    	$(".active").removeClass("active").addClass("inactive");
    	var firstChildren = $(".header_nav").children(':first');
    	var lastChildren =  $(".header_nav").children(':last');
    	var title = "";
    	//判断点击页面中的哪个a标签 从而将页面中需要定位的 导航底部的border 定位 
    	//并且改变了title的状态，用来统一页面上的纬度 标题
    	if(type==2){
    		firstChildren.addClass("active").removeClass("inactive");
    		title += "24 Hours";
    	}else if(type==0){
    		firstChildren.next().addClass("active").removeClass("inactive");
    		title += "7 Days";
    	}else if(type==1){
    		lastChildren.prev().addClass("active").removeClass("inactive");
    		title += "13 Weeks";
    	}else{
    		lastChildren.addClass("active").removeClass("inactive");
    		title += "12 Months";
    	}
    	//页面中九宫格右上部分开始部分的标题   动态的添加（四个维度的title是不同的 相同的是Using Counts Last 和 New KG Last）
    	$("#knowladge_date").html("Using Counts Last "+title);
    	$("#shang_title").html("New KG Last "+title);
    	
    	num_fanzhuan_opacity();
    	konwledge_graph(config);
    	custome_ermotion(config);
		useing_counts(config);
		problemAnalysis(config);
		knowladgeAnalysis(config);
		multiMediaChat(config);
		getTitleData(config);
		analysis(config);
		configpath = config;
	};
	
	
	//change_type
	function change_type(index,data){
		window.location.href = configpath.basePath+"/rnt?dataType="+data+"";
    }
	
	// 页面跳转功能
	function change_page() {
		// 0 7day
		// 1 13weeks
		// 2 24hours
		// 3 12months
		var dataMap = {
			0 : 1,
			1 : 3,
			2 : 0,
			3 : 2
		};
		var nowurl = window.location.href;
		urldataList = nowurl.split("/");
		var paramdata = urldataList[urldataList.length - 1]
		if (paramdata.indexOf("?") > 0) {
			pageData = paramdata.split("=");
			window.location.href = configpath.basePath + "/first?dataType=" + dataMap[pageData[1]] + "";
		} else {
			window.location.href = configpath.basePath + "/first?dataType=2";
		}

	}
	
	// custome ermotion模块
	/*
	 * 1、s2左下部分 气泡图的数据接口调用
	 * */
	function custome_ermotion(config) {
		var param = {
			"dataType" : $("#dataType").val()
		}
		var options = {
			url : config.basePath + "/second/customerEmotion",
			type : 'post',
			data : param,
			async: true,
			dataType : "json",
			success : function(data) {
				$("#rise_rate").html(data.data.riseRate+"%");
				if(data.data.time.length>2){
				 $("#circleTime").html(data.data.time[0]+"-"+data.data.time[2]);
				}else{
				  $("#circleTime").html(data.data.time[0]+"-"+data.data.time[1]);
				}
				
				var html="";
				var idIndex;
				$.each(data.data.option, function(index,val) {
						html+="<div class='circle_out circle_out_"+ index +"' style=\"flex:1;\">",
						html+="<p>"+val.name+"</p>";
						idIndex = index;
						//拼接的时候没有加浮动
						$.each(val.data, function(index,value) {
							html+="<div class='circle_inner circle_inner_"+ index +" circle_bg"+idIndex+"'>";
							html+="<div class='timer circle_inner_text color_div color_div"+idIndex+"' data-to=\""+value+"\" data-speed=\"1000\" style=' width:0%; height:0%;'>";
							html+="</div></div>";
						});
						
						html+="</div>";
						
				});
				html+="<div class='date_box'><p>123332</p><div class='usually_date one_date'>"+data.data.time[0]+"</div> <div class='usually_date two_date'>"+data.data.time[1]+"</div>  <div class='usually_date three_date'>"+data.data.time[2]+"</div></div>";
				$("#circle_div").html(html);
				if($(".circle_inner").length > 6){
					$(".circle_inner").css({"width":"5rem" , "height":"5rem"});
					$(".circle_out").children("p").height( $(".circle_out").height() +"px").css("line-height" , $(".circle_out").height()+"px");
//					$(".circle_inner_1").css("left","24%");
//					$(".circle_inner_2").css("left","23%");
					$(".circle_inner_0").css("left","23%");
					$(".circle_inner_1").css("left","24%");
					$(".circle_inner_2").css("left","25%");
					$(".one_date").css("left","23%");
					$(".two_date").css("left","24.3%");
					$(".three_date").css("left","25.4%");
				}else{
					var circle_div_hei = $("#circle_div").height();
					$(".circle_inner").css({"width": circle_div_hei*0.32 + "px" , "height": circle_div_hei*0.32 + "px"});
					$(".usually_date").css({"width" : circle_div_hei*0.32 + "px"})
					$(".three_date").remove();
				}
				
				$(".circle_out").children("p").height( $(".circle_out").height() +"px").css("line-height" , $(".circle_out").height()+"px");
				var change = $(".timer");
				$.each(change, function(index,value) {
					var val = $(this).data("to");
					$(this).delay(2000+(index*200)).animate({"width":val+"%","height":val+"%"} , 1500);
				});
				
				setTimeout(function(){
					$(".circle_inner").css({'webkitTransform':'scale(1)' , 'opacity':1})
				} , 1000)	
				
				setTimeout(function(){$(".timer").countTo()},3000);
		    },
		}    
		$.ajax(options);
	}
	// konwledge graph 波形图数据接口的 function 
	function konwledge_graph(config) {
		//组装dataType：0/1/2/3 的格式 已ajax的方式请求后台数据接口需要传递的参数
		var param = {
			"dataType" : $("#dataType").val()
		}
		var options = {
			url : config.basePath + "/second/konwledgeGraph",
			type : 'post',
			data : param,
			async: true,
			dataType : "json",
			success : function(data) {
				//调用组装波形图数据的function  data.data是请求成功传递过去的对象
				knowledgeGraphData(data.data); 
		    },
		}    
		$.ajax(options);
	}
	
	/*初始化波形图所用的变量数据
	 * Math.max.apply(null,data.countOption) 获取一组数据中的最大值
	 * Math.round() 对一个数值进行上取整
	 * parseInt() 将一个字符串或者其他类型的变量 转换成数值类型
	 * json = {}  创建一组json对象，用来存储波形图所需属性的值
	 * senRntCharts.drawAll（）调用second_charts.js文件中的  senRntCharts对象下的drawAll方法 并且将 存储起来的json对象传递过去
	 * */
	function knowledgeGraphData(data){
		var mx = Math.round(Math.max.apply(null,data.countOption)/4)+"";
    	var new_max = parseInt(mx.substr(0, 1))+1;
    	for(var i=0;i<mx.length-1;i++){
    		new_max = new_max+"0";
    	}
    	new_max = parseInt(new_max);
    	
		var max =Math.max.apply(null,data.countOption);
		var json ={
				"width":$("#wave_div").width(),
				"height":$("#wave_div").height(),
				"maxIndex":data.countOption.indexOf(max),
				"maxData":Math.max.apply(null,data.countOption),
				"lengths":data.timeOption.length,
				"x_data":data.timeOption,
				"y_data":data.countOption,
				"maxZuo":new_max
			};
			$("#wave_div").html("");
			senRntCharts.drawAll(json, "wave_div","#fff","time");
	}
	function getCircleData(nums,jsonData,midu){
		
		$.getJSON("json/second/circle.json", function(data) {
			var nodeArr=[];
			if(nums.length>0){
				nodeArr = nodeArr.concat(data.first.slice(0,nums[0]));
			}
			if(nums.length>1){
				nodeArr = nodeArr.concat(data.second.slice(0,nums[1]));
			}
			if(nums.length>2){
				nodeArr = nodeArr.concat(data.three.slice(0,nums[2]));
			}
			if(nums.length>3){
				nodeArr = nodeArr.concat(data.four.slice(0,nums[3]));
			}
			if(nums.length>4){
				nodeArr = nodeArr.concat(data.five.slice(0,nums[4]));
			}
			jsonData["nodes"] =nodeArr;
			senRntCharts.usingChart(jsonData , midu);
		});
	}
	
	// useing counts
	function useing_counts(config) {
		var param = {
			"dataType" : $("#dataType").val()
		}
		var options = {
			url : config.basePath + "/second/useingCounts",
			type : 'post',
			data : param,
			async: true,
			dataType : "json",
			success : function(data) {
					//散点图右侧 部分接口标记拼接
					var colors = ["#D3CB2A","#3DA0C8","#D4A9DD","#75A52A","#9FE7D3"];
					var html="";
					$.each(data.data.useingCountsDataDto, function(index,val) {
						if(index < 5){
							html +="<div class=\"legend_row\">";
							html +="<span class=\"legend_circle\" style=\"background:"+colors[index]+";\"></span>";
							html +="<span class=\"legend_text\">"+val.name+"</span>";
							html +="<p class=\"legend_number\">"+(val.num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')+"</p>";
							html +="</div>";
						}
					});
					$("#using_legend_div").html(html);
					
					/* 兼容返回数量为8位 散点图右侧部分 数值长度限制
					 * 如果小于等于6位，正常显示数值，每隔三位加一个“ ， ” 
					 * 如果小于等于7位， 截取数值的前三位，并且每隔2位加一个“ . ” 在最后加一个“M”单位百万
					 * 如果小于等于8位， 截取数值的前四位，并且每隔2位加一个“ . ” 在最后加一个“M”单位百万
					 * */
					var count_str = data.data.count.toString();
					if(count_str.length <= 6){
						$("#using_total").html((data.data.count || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
					}else if(count_str.length <= 7){
						$("#using_total").html((count_str.substr(0 , 3) || 0).replace(/(\d)(?=(?:\d{2})+$)/g, '$1.') + "M");
					}else if(count_str.length <= 8){
						$("#using_total").html((count_str.substr(0 , 4) || 0).replace(/(\d)(?=(?:\d{2})+$)/g, '$1.') + "M");
					}
					
					/*
					 * 散点图右侧图例部分的特效，右侧渐入特效
					 * 为了实现每一个图例渐入的时间不同，达到顺序的效果，利用其 索引 让每一个 渐入的时间都不同 和 初始的 margin-left不同
					 * */
					var option = $("#using_legend_div div");
					$.each(option, function(index,val) {
						$(this).css({"margin-left":((index+1)*8)+"%"}).animate({"opacity": 1,"margin-left":"0%"} , index*400);
					});
				
					var categories=[];
					var numArr = [];
					$.each(data.data.useingCountsDataDto, function(index,val) {
						var option = {};
						var itemStyle = {};
						var normal = {};
						normal.brushType = "both";
						normal.color = colors[index];
						itemStyle.normal = normal;
						option.name = val.name;
						option.base = "HTMLElement";
						option.itemStyle = itemStyle;
						categories[categories.length] = option;
						numArr[numArr.length] = val.num;
					});
			var jsonData =  {
				"type": "force",
				"categories": categories,
				"links":[{"source":0,"target":0},{"source":1,"target":1},{"source":2,"target":2},{"source":3,"target":3},{"source":4,"target":4}]
				};
				var minLength = Math.min.apply(null,numArr)+"";
				var maxLength = Math.max.apply(null,numArr)+"";
				var yushu = 1;
				var dian_midu;//散点图
				var dian_num; //点的不同分辨率数量
				if(window.screen.availWidth <= 1366){
					dian_midu = 0.3;
					dian_num = 30;
		        }else if(window.screen.availWidth <= 1920){
		        	dian_midu = 0.3;
		        	dian_num = 30;
		        }else if(window.screen.availWidth <= 3840){
		        	dian_midu = 0.2;
		        	dian_num = 50;
		        }
				if(minLength.length == maxLength.length){
					for(var i = 0;i<minLength.length-2;i++){
						yushu = yushu+"0";
					}
				}else{
					for(var j = 0;i<minLength.length-1;j++){
						yushu = yushu+"0";
					}
				}
				yushu = parseInt(yushu);
				var nums = [];
				$.each(numArr, function(index,val) {
					nums[nums.length] = val/yushu;
				});
				getCircleData(nums,jsonData,dian_midu);
				//自调函数  添加散点图旋转缩放特效的 class类
				(function(){
			    	$(".img3").addClass("addImg3");
			    })();
		    }
		    
		}    
		$.ajax(options);
	}
	
	//problemAnalysis
	/*
	 * s2柱形图下面的翻页特效 接口调用
	 * s2柱形图下面的翻页特效 的数据拼接
	 * if条件判断的是 奇数和偶数  
	 * */
	function problemAnalysis(config) {
		var param = {
			"dataType" : $("#dataType").val()
		}
		var options = {
			url : config.basePath + "/second/problemAnalysis",
			type : 'post',
			data : param,
			async: true,
			dataType : "json",
			success : function(data) {
					var center_bottom = $("#center_bottom");
					var html_even="";
					var html_odd="";
					var uu = 0;
						$.each(data.data, function(index,val) {
							if(uu == 4){ uu = 0; }
							
							if(index%2 == 0){
								html_even +=	"<div class='center_bottom_content'>";
								html_even +=	"<div class='scale_spspsp'>";
								html_even += "<div class='center_bottom_inner center_bottom_inner"+(uu+1)+" center_bottom_inner"+index+" animate_even'>";
							}
							if(index%2 != 0){
								html_even += "<div class='center_bottom_inner center_bottom_inner"+uu+" center_bottom_inner"+index+" animate_odd'>";
							}
								
								html_even += "<p class='c_b_c_bg'>"+val.name+"</p>";
								html_even += "<div class='c_b_c_div'>";
								html_even += "<h3>"+val.rate+"%</h3>";
								html_even += "<ul>";
//								html_even += "<li class='scale_li'>case-prone country</li>";
								$.each( val.topCountry , function(index,val) {
										html_even += "<li class='place_li'> "+val.countyName+" "+val.countyRate+"%</li>";
								});
								html_even += "</ul>";
								html_even += "</div>";
								html_even += "</div>";
								
							if(index%2 != 0){
								html_even += "</div>";
								html_even +=	"</div>";
								
							}
							
							uu++;
						});
						
						center_bottom.html(html_even);
						
						//翻页特效部分的 缩放特效（class scale_spspsp的初始样式是 scale缩放0.8 刷新页面 延迟10毫秒 执行缩放到1的原始大小）
						setTimeout(function(){
							$(".scale_spspsp").css({'webkitTransform':'scale(1)' , 'opacity':1})
						} , 10)
						//翻页特效部分的 翻页特效
						var i=0;
						function animate_odd_even(){
								$(".animate_even").animate({"margin-left" : "100%" , "opacity" : 0 , "z-index" : i } , 1000).animate({"margin-left":0 , "opacity":1},1);
								$(".animate_odd").delay(8000).animate({"margin-left" : "100%" , "opacity" : 0 , "z-index" : --i} , 1000).animate({"margin-left":0 , "opacity":1},1);
								i=i-2;
					    }
						j=setInterval(animate_odd_even , 1000*17);
		    }
		}    
		$.ajax(options);
	}
//	knowladgeAnalysis
	/*
	 * 1、右下部分的 上下数量部分的 长度判断 超过6位加单位“M”
	 *   右下部分的 上下数量部分的  渐入特效的实现
	 * 
	 * 
	 * */
	function knowladgeAnalysis(config) {
		var param = {
			"dataType" : $("#dataType").val()
		}
		var options = {
			url : config.basePath + "/second/knowladgeAnalysis",
			type : 'post',
			data : param,
			async: true,
			dataType : "json",
			success : function(data) {
					var shang_number = $("#shang_number");
					var shang_number_second = $("#shang_number_second");
					var right_bottom_right_list = $("#right_bottom_right_list");
					
					//对显示位数做限制，如果数值达到等于百万或者大于百万进行 家单位 “M”
					var data_data_totalNum = data.data.totalNum.toString();
					if(data.data.totalNum.length <= 6){
						shang_number.html((data.data.totalNum || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
					}else if(data.data.totalNum.length <= 7){
						//console.log();
						shang_number.html((data_data_totalNum.substr(0 , 3) || 0).toString().replace(/(\d)(?=(?:\d{2})+$)/g, '$1.')+"M");
					}else if(data.data.totalNum.length <= 8){
						//console.log();
						shang_number.html((data_data_totalNum.substr(0 , 4) || 0).toString().replace(/(\d)(?=(?:\d{2})+$)/g, '$1.')+"M");
					}
					
					var data_data_unNum = data.data.unNum.toString();
					if(data.data.unNum.length <= 6){
						shang_number_second.html((data.data.unNum || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
					}else if(data.data.unNum.length <= 7){
						//console.log();
						shang_number_second.html((data_data_unNum.substr(0 , 3) || 0).toString().replace(/(\d)(?=(?:\d{2})+$)/g, '$1.')+"M");
					}else if(data.data.unNum.length <= 8){
						//console.log();
						shang_number_second.html((data_data_unNum.substr(0 , 4) || 0).toString().replace(/(\d)(?=(?:\d{2})+$)/g, '$1.')+"M");
					}
					
					$(".shang1").css("left","2rem").animate({"left":"0.3rem","opacity": 1} , 1000);
					$(".shang").children("div").css("left","2rem").animate({"left":"0rem","opacity": 1} , 1000);
					$(".xia").children("div").css("left","2rem").delay(500).animate({"left":"0rem","opacity": 1} , 1000);
					
					//右下侧列表部分的 超出部分截取， 加省略号。 （注意 如果单词显示不下 删除整个单词加省略号）
					var i = 0;
					replace();
					setInterval(replace,8000);//ajax请求一次 8秒调用一次这个函数 
					function replace(){
						var html="";
                        $.each(data.data.option, function(index,val) {
							val=val.substring(0, 1).toUpperCase()+val.substring(1);
							var text=(index+1)+". "+val;
							
							if(text.length>=38){
								text=text.substring(0,38);
								
								var arr=text.trim().split(" ");
								//console.log(arr);
								arr.pop();
								
								text=arr.join(" ")+" ...";
							}
							
							if(i%2==0 && index<5){
								//html += "<li title = "+val+">"+(index+1)+". "+val+"</li>";
								html += "<li title = "+val+">"+text+"</li>";
							}else if(i%2 != 0 && index>=5){
								//html += "<li title = "+val+">"+(index+1)+". "+val+"</li>";
								html += "<li title = "+val+">"+text+"</li>";
							}
						});
						right_bottom_right_list.html(html);
						
						//右下侧 评价列表 上下显示特效和 左右顺序渐入特效
						var option = $("#right_bottom_right_list li");
						$.each(option, function(index,val) {
							if(i%2==0){
								$(this).css({"top":(0.3+index)*20+"%"}).delay((index+1)*200).animate({"opacity": 1,"top":index*20+"%"} , 100).delay(6000).animate({"opacity": 1},2000);
							}else{
								$(this).css({"top":index*20+"%","left":(index*1.5)+20+"%"}).delay((index+1)*200).animate({"opacity": 1,"left":"6%"} , 800).delay(7000).animate({"opacity": 0},6000);
							}
						});
						i++;
				}
		    }
		}    
		$.ajax(options);
	}
	
//	multiMediaChat
	/*
	 * 总占比部分
	 * 多媒体展示部分
	 * input和output的部分
	 * */
	function multiMediaChat(config){
		var param = {
			"dataType" : $("#dataType").val()
		}
		var options = {
				url : config.basePath + "/second/multiMediaChat",
				type : "POST",
				data : param ,
				async: true,
				dataType : "json",
				success : function(data){
					//var NumWidth = [];
					//var NumWidth_input = [];
					//var NumWidth_output = [];
					//$.each(data.data.option , function(index , value){
//						NumWidth_input.push(value.input);
//						NumWidth_output.push(value.output);
						//NumWidth.push(value.input + value.output);
					//})
					//var MaxWidth = Math.max.apply(null , NumWidth)/100;
//					var MaxWidth_input = Math.max.apply(null , NumWidth_input)/100;
//					var MaxWidth_output = Math.max.apply(null , NumWidth_output)/100;
					var json = data;					
					//总占比部分
					$("#totalRate").html(json.data.totalRate+"%");
					$(".left_top_center").css({"padding-left":"20.6%","opacity": 0}).delay(300).animate({"padding-left":"8.6%","opacity": 1} , 500);
					//标题后面的月份
					$("#month").html(json.data.month);
					//input 和 output 部分的特效 动态的设置宽度 达到条形图类似于进度条的特效
					$("#text_span_one").css("width","0%").animate({"width":json.data.option[0].input + "%"},800);// /MaxWidth_input
					$("#text_span_two").css("width","0%").delay(500).animate({"width" : json.data.option[0].output + "%"},500);// /MaxWidth_output
					$("#voice_span_one").css("width","0%").delay(400).animate({"width":json.data.option[1].input + "%"},500);// /MaxWidth_input
					$("#voice_span_two").css("width","0%").delay(900).animate({"width":json.data.option[1].output + "%"},500);// /MaxWidth_output
					$("#image_span_one").css("width","0%").delay(600).animate({"width" : json.data.option[2].input + "%"},500);// /MaxWidth_input
					$("#image_span_two").css("width","0%").delay(1100).animate({"width" : json.data.option[2].output + "%"},500);// /MaxWidth_output
					$("#video_span_one").css("width","0%").delay(800).animate({"width" : json.data.option[3].input + "%"},500);// /MaxWidth_input
					$("#video_span_two").css("width","0%").delay(1300).animate({"width" : json.data.option[3].output + "%"},500);// /MaxWidth_output
					//多媒体部分  拼接Text Vioce Image Video 四部分并且替换
					var playList_li = "";
					var playList = $("#playList");
					playList_li += "<li><div>"+json.data.option[0].rate+"%</div><div class='div_1'><span class='circle circle_first'></span><span class='small' >"+json.data.option[0].name+"</span></div></li>";
					playList_li += "<li><div>"+json.data.option[1].rate+"%</div><div class='div_1'><span class='circle circle_second'></span><span class='small' >"+json.data.option[1].name+"</span></div></li>";
					playList_li += "<li><div>"+json.data.option[2].rate+"%</div><div class='div_1'><span class='circle circle_third'></span><span class='small' >"+json.data.option[2].name+"</span></div></li>";
					playList_li += "<li><div>"+json.data.option[3].rate+"%</div><div class='div_1'><span class='circle circle_four'></span><span class='small' >"+json.data.option[3].name+"</span></div></li>";
					playList.html(playList_li);
					$("#playList").css({"padding-left":"20.6%","opacity": 0}).delay(500).animate({"padding-left":"9.6%","opacity": 1} , 500);
					$(".line_img_one").animate({"backgroundSize":"10px 10px"},500);
				}
				
		}
		$.ajax(options);
		//console.log(multiMediaChat_json);
	}
	
//	getTitleData
	function getTitleData(config) {
		var param = {
			"dataType" : $("#dataType").val()
		}
		var options = {
			url : config.basePath + "/second/newGetTitleData",
			type : 'post',
			data : param,
			async: true,
			dataType : "json",
			success : function(data) {
                //$("#usingNum").html((data.data.usingNum || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
				var usingNum=data.data.usingNum.toString();
				if(usingNum.length <= 6){
					$("#usingNum").html((data.data.usingNum || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
				}else if(usingNum.length <= 7){
					$("#usingNum").html((usingNum.substr(0 , 3) || 0).replace(/(\d)(?=(?:\d{2})+$)/g, '$1.') + "M");
				}else if(usingNum.length <= 8){
					$("#usingNum").html((usingNum.substr(0 , 4) || 0).replace(/(\d)(?=(?:\d{2})+$)/g, '$1.') + "M");
				}else{
					var usingNum_str=usingNum.substr(0 , usingNum.length-4);
					$("#usingNum").html(usingNum_str.substr(0 , usingNum_str.length-2)+"."+usingNum_str.substr(usingNum_str.length-2)+"M");
				}
				
				//$("#usingWave").html((Math.abs(data.data.usingWave) || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
				//$("#usingWave").html((data.data.usingWave || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
				var usingWave=data.data.usingWave.toString();
				if(usingWave.length <= 6){
					$("#usingWave").html((data.data.usingWave || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
				}else if(usingWave.length <= 7){
					$("#usingWave").html((usingWave.substr(0 , 3) || 0).replace(/(\d)(?=(?:\d{2})+$)/g, '$1.') + "M");
				}else if(usingWave.length <= 8){
					$("#usingWave").html((usingWave.substr(0 , 4) || 0).replace(/(\d)(?=(?:\d{2})+$)/g, '$1.') + "M");
				}else{
					var usingWave_str=usingWave.substr(0 , usingWave.length-4);
					$("#usingWave").html(usingWave_str.substr(0 , usingWave_str.length-2)+"."+usingWave_str.substr(usingWave_str.length-2)+"M");
				}
				$("#averageNum").html(data.data.averageNum);
				
				//$("#averageWave").html(Math.abs(data.data.averageWave));
				$("#averageWave").html(data.data.averageWave);
				var solvedNum=data.data.solvedNum.toString();
				if(solvedNum.length <= 6){
					$("#solvedNum").html((data.data.solvedNum || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
				}else if(solvedNum.length <= 7){
					$("#solvedNum").html((solvedNum.substr(0 , 3) || 0).replace(/(\d)(?=(?:\d{2})+$)/g, '$1.') + "M");
				}else if(solvedNum.length <= 8){
					$("#solvedNum").html((solvedNum.substr(0 , 4) || 0).replace(/(\d)(?=(?:\d{2})+$)/g, '$1.') + "M");
				}else{
					var solvedNum_str=solvedNum.substr(0 , solvedNum.length-4);
					$("#solvedNum").html(solvedNum_str.substr(0 , solvedNum_str.length-2)+"."+solvedNum_str.substr(solvedNum_str.length-2)+"M");
				}
				
				//$("#solvedNum").html((data.data.solvedNum || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
				
				//$("#soledWave").html((Math.abs(data.data.soledWave) || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
				var soledWave=data.data.soledWave.toString();
				if(soledWave.length <= 6){
					$("#soledWave").html((data.data.soledWave || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
				}else if(soledWave.length <= 7){
					$("#soledWave").html((soledWave.substr(0 , 3) || 0).replace(/(\d)(?=(?:\d{2})+$)/g, '$1.') + "M");
				}else if(soledWave.length <= 8){
					$("#soledWave").html((soledWave.substr(0 , 4) || 0).replace(/(\d)(?=(?:\d{2})+$)/g, '$1.') + "M");
				}else{
					var soledWave_str=soledWave.substr(0 , soledWave.length-4);
					$("#soledWave").html(soledWave_str.substr(0 , soledWave_str.length-2)+"."+soledWave_str.substr(soledWave_str.length-2)+"M");
				}
				//$("#soledWave").html((data.data.soledWave || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
				var unsolvedNum=data.data.unsolvedNum.toString();
				if(unsolvedNum.length <= 6){
					$("#unsolvedNum").html((data.data.unsolvedNum || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
				}else if(unsolvedNum.length <= 7){
					$("#unsolvedNum").html((unsolvedNum.substr(0 , 3) || 0).replace(/(\d)(?=(?:\d{2})+$)/g, '$1.') + "M");
				}else if(unsolvedNum.length <= 8){
					$("#unsolvedNum").html((unsolvedNum.substr(0 , 4) || 0).replace(/(\d)(?=(?:\d{2})+$)/g, '$1.') + "M");
				}else{
					var unsolvedNum_str=unsolvedNum.substr(0 , unsolvedNum.length-4);
					$("#unsolvedNum").html(unsolvedNum_str.substr(0 , unsolvedNume_str.length-2)+"."+unsolvedNum.substr(unsolvedNum_str.length-2)+"M");
				}
				//$("#unsolvedNum").html((data.data.unsolvedNum || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
				
				//$("#unsolvedWave").html((Math.abs(data.data.unsolvedWave) || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
				var unsolvedWave=data.data.unsolvedWave.toString();
				if(unsolvedWave.length <= 6){
					$("#unsolvedWave").html((data.data.unsolvedWave || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
				}else if(unsolvedWave.length <= 7){
					$("#unsolvedWave").html((unsolvedWave.substr(0 , 3) || 0).replace(/(\d)(?=(?:\d{2})+$)/g, '$1.') + "M");
				}else if(unsolvedWave.length <= 8){
					$("#unsolvedWave").html((unsolvedWave.substr(0 , 4) || 0).replace(/(\d)(?=(?:\d{2})+$)/g, '$1.') + "M");
				}else{
					var unsolvedWave_str=unsolvedWave.substr(0 , unsolvedWave.length-4);
					$("#unsolvedWave").html(unsolvedWave_str.substr(0 , unsolvedWave_str.length-2)+"."+unsolvedWave.substr(unsolvedWave_str.length-2)+"M");
				}
				//$("#unsolvedWave").html((data.data.unsolvedWave || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
				$("#solvingNum").html(data.data.solvingNum+"%");
				
				//$("#solvingWave").html(Math.abs(data.data.solvingWave)+"%");
				$("#solvingWave").html(data.data.solvingWave+"%");
				
				//判断请求的数据的正负数 来给不同的 箭头背景
				if(data.data.soledWave < 0){
					$("#soledWave").css({"backgroundImage":"url(images/arrow_down_red.png)" , "backgroundRepeat":"no-repeat" , "backgroundSize":"0.269rem 0.8rem" ,  "color" : "#F44B60"})
				}else{
					$("#soledWave").css({"backgroundImage":"url(images/arrow_up_green.png)" , "backgroundRepeat":"no-repeat" , "backgroundSize":"0.269rem 0.8rem" , "color" : "#50E3C2"})
				}
				
				if(data.data.solvingWave < 0){
					$("#solvingWave").css({"backgroundImage":"url(images/arrow_down_red.png)" , "backgroundRepeat":"no-repeat" , "backgroundSize":"0.269rem 0.8rem" ,  "color" : "#F44B60"})
				}else{
					$("#solvingWave").css({"backgroundImage":"url(images/arrow_up_green.png)" , "backgroundRepeat":"no-repeat" , "backgroundSize":"0.269rem 0.8rem" , "color" : "#50E3C2"})
				}
				
				if(data.data.unsolvedWave <= 0){
			
					$("#unsolvedWave").css({"backgroundImage":"url(images/arrow_down_green.png)" , "backgroundRepeat":"no-repeat" , "backgroundSize":"0.269rem 0.8rem" , "color" : "#50E3C2"})
				}else{
					$("#unsolvedWave").css({"backgroundImage":"url(images/arrow_up_red.png)" , "backgroundRepeat":"no-repeat" , "backgroundSize":"0.269rem 0.8rem" ,  "color" : "#F44B60"})
				}
				
				if(data.data.usingWave < 0){
					$("#usingWave").css({"backgroundImage":"url(images/arrow_down_red.png)" , "backgroundRepeat":"no-repeat" , "backgroundSize":"0.269rem 0.8rem" ,  "color" : "#F44B60"})
				}else{
					$("#usingWave").css({"backgroundImage":"url(images/arrow_up_green.png)" , "backgroundRepeat":"no-repeat" , "backgroundSize":"0.269rem 0.8rem" , "color" : "#50E3C2"})
				}
				
				if(data.data.averageWave < 0){
					$("#averageWave").css({"backgroundImage":"url(images/arrow_down_red.png)" , "backgroundRepeat":"no-repeat" , "backgroundSize":"0.269rem 0.8rem" ,  "color" : "#F44B60"})
				}else{
					$("#averageWave").css({"backgroundImage":"url(images/arrow_up_green.png)" , "backgroundRepeat":"no-repeat" , "backgroundSize":"0.269rem 0.8rem" , "color" : "#50E3C2"})
				}
				
				//标题中的开始结束日期
				$("#startTime").html(data.data.startTime+"-"+data.data.endTime);
				$("#fanye_titkle").html(data.data.startTime+"-"+data.data.endTime);
				$("#endTime").html(data.data.startTime+"-"+data.data.endTime);
				
				$(".right_top_content").css({"padding-left":"5%","opacity":0}).delay(300).animate({"padding-left":"0%" , "opacity":1} , 1000);
        		$(".left_top_content").children("ul").children("li").css("opacity" , 0).delay(300).animate({"opacity" : 1} , 1000);
        		
        		//调用判断数据长度 从而设置字体大小来适应屏幕 在second_font_setting.js模块中
        	    //fonts.register();
			}
		}    
		$.ajax(options);
	}
	/*
	 * 调用s2柱形条形图所用数据
	 * 调用second_chart下的lineChart函数渲染条形柱形图
	 * 定时调用s2 second_chart下的lineChart柱形条形图函数 实现特效循环
	 * 
	*/
	function analysis(config) {
		var param = {
			"dataType" : $("#dataType").val()
		}
		var echarts_data = [];
		var options = {
			url : config.basePath + "/second/rntAdopted",
			type : 'post',
			data : param,
			async: true,
			dataType : "json",
			success : function(data) {
				senRntCharts.lineChart(data);
				setInterval(function (){senRntCharts.lineChart(data)},30*1000);
		    }
		}    
		$.ajax(options);
	
	}
	
	//页面渐入效果函数
	function num_fanzhuan_opacity(){
		$(".left_bottom_top").css("opacity" , 0).animate({"opacity" : 1} , 1000);
		$(".left_bottom_circle").css("opacity" , 0).animate({"opacity" : 1} , 1000);
		$(".using_echart_title").css("opacity" , 0).animate({"opacity" : 1} , 1000);
		$(".using_legend_title").css("opacity" , 0).animate({"opacity" : 1} , 1000);
		$("#right_bottom_right_list").css("opacity" , 0).animate({"opacity" : 1} , 3000);
		$(".input_output").css("opacity" , 0).animate({"opacity" : 1} , 1000);
	}
})();