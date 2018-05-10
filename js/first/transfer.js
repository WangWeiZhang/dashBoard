var transfer = (function() {
	return {
		register : register,
		query_service_transfer:query_service_transfer
	}
    function register(config){
    	query_service_transfer(config);
    };
    // service transfer数据加载
	function query_service_transfer(config) {
		var param = {
			"dataType" : $("#dataType").val()
		}
		
		var options = {
			url : config.basePath + "/first/ServiceTransfer",
			type : 'post',
			data : param,
			dataType : "json",
			success : function(data) {
				$(".trans_col2_h_new1").css("opacity",0).delay(1800).animate({"opacity":1} , 1000);
				var datas = data.data;
				drawChart(datas);
				var arr =[];
				$.each(datas.date, function(index,val) {
			        arr[arr.length]=data.data.aTansfer[index]+data.data.mTansfer[index];
				});
				var count = (Math.max.apply(null,arr) || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
				var rate = Math.max.apply(null,data.data.rate);
				$("#count").html(count);
				$("#rate").html(rate+"%");
				$("#left_num").html((datas.transferCase || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
				var left_rate=datas.transferCaseIncrease;
				if(left_rate<=0){
					/*left_rate=Math.abs(left_rate);*/
					$("#left_rate").css({"backgroundImage":"url(images/arrow_down_green.png)" ,"color" : "#50E3C2"})
				}else{
					$("#left_rate").css({"backgroundImage":"url(images/arrow_up_red.png)" ,"color" : "#F44B60"})
				}
				$("#left_rate").html((left_rate || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
				$("#right_num").html(datas.transferRate+"%");
				$("#transfer_span").html(datas.start_time+"-"+datas.end_time);
				var right_rate=datas.transferRateIncrease;
				if(right_rate<=0){
					/*right_rate=Math.abs(right_rate);*/
					$("#right_rate").css({"backgroundImage":"url(images/arrow_down_green.png)" ,"color" : "#50E3C2"})
				}else{
					$("#right_rate").css({"backgroundImage":"url(images/arrow_up_red.png)" ,"color" : "#F44B60"})
				}
				$("#right_rate").html(right_rate+"%");
				
				//判断id  left_num 和 left_rate  的返回的数据长度  50%的情况下能放下的都进行一次判断 ， 不在这个区间的， 设置 宽度为auto 让其自适应
				var left_rate = $("#left_rate").text().length;//箭头的数据长度
				var left_num = $("#left_num").text().length;  //箭头左面的数据长度
				
				if(left_num <= 9 && left_rate <= 2){
					$(".trans_col2").css("width","50%");
				}else if(left_num <= 7 && left_rate <= 5){
					$(".trans_col2").css("width","50%");
				}else if(left_num <= 6 && left_rate <= 8){
					$(".trans_col2").css("width","50%");
				}else if(left_num <= 5 && left_rate <= 10){
					$(".trans_col2").css("width","50%");
				}else if(left_num <= 3 && left_rate <= 13){
					$(".trans_col2").css("width","50%");
				}else if(left_num <= 2 && left_rate <= 16){
					$(".trans_col2").css("width","50%");
				}else{
					$(".trans_col2").css("width","auto");
				}	
				
		    },
		}    
		$.ajax(options);
	}
	function drawChart(data){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echart.init(document.getElementById('serviceTransfer'));
        var echarts_inner_div_width= $("#serviceTransfer").children("div").width();
        
        var legend_width = echarts_inner_div_width / 22;
        var circle_width = echarts_inner_div_width / 45;
        //判断显示那个纬度的图表，如果是13week的  让其 x轴 类目 隔一个显示一个
        var interval = 0;
        if($("#dataType").val() == 0){
        	
        }else if($("#dataType").val() == 2){
        	interval = 1;
        }else if($("#dataType").val() == 1){
        	interval = 1;
        }else if($("#dataType").val() == 3){
        	interval = 1;
        }
        
 		var length_text;//响应坐标轴文字标签的适配大小
        var itemGap;//图例间距的 分辨率适配
        if(window.screen.availWidth <= 1366){
        	length_text = 12;
        	itemGap = 40;
        }else if(window.screen.availWidth <= 1600){
        	length_text = 12;
        	itemGap = 40;
        }else if(window.screen.availWidth <= 1920){
        	length_text = 12;
        	itemGap = 85;
        }else if(window.screen.availWidth <= 2048){
        	length_text = 12.5;
        	itemGap = 80;
        }else if(window.screen.availWidth <= 3840){
        	length_text = 22;
        	itemGap = 200;
        }        
        var option = {
            xAxis: [{
                type: 'category',
                axisLine:{
                    show:true,
                    lineStyle:{
                    	color:"#343340"
                    }
                },
                axisTick:{
                    show:false
                },
                axisLabel:{
                    interval:interval,
                    textStyle:{
                    	fontSize:length_text,
                        color: function(){
                            return 'rgba(255,255,255,0.4)';
                        }
                    }
                },
                data: data.date
            }],
            legend: {
                data:[
                    {name:'Manual',
                        icon:'circle',
                        textStyle:{
                        	 interval:interval,
                            fontSize:length_text,
                            color:'rgba(255,255,255,0.5)'
                        }},
                    {name:'Automatical',icon:'circle',
                        textStyle:{
                        	 interval:interval,
                            fontSize:length_text,
                            color:'rgba(255,255,255,0.5)'
                        }},
                    {name:'Transfer Rate',icon:'circle',
                        textStyle:{
                        	 interval:interval,
                            fontSize:length_text,
                            color:'rgba(255,255,255,0.5)'
                        }}
                ],
                bottom:"4%",
                
                align:"left",//控制图例图标在文字的位置
				itemGap:itemGap,//legend_padding
                itemWidth:circle_width,//_width
                itemHeight:circle_width,//_width//                icon:"image://./images/echarts_circle.png",

            },
            yAxis: [ {
                type: 'value',
                min: 0,

                splitLine:{
                    show:false
                },
                axisTick:{
                    show:false
                },
                axisLine:{
                    show:true,
                    lineStyle:{
                    	color:"#343340"
                    }
                },
                axisLabel:{
                    show:true,
                    textStyle:{
                        color:'#565560',
                        fontSize:length_text
                    },
                    formatter: function (value, index) {
                    	if(index%2!=0){
                    		return "";
                    	}
                        if(value>=1000&&value<1000000){
                        	value = value/1000+"k";
                        }else if(value>=1000000){
                        	value = value/1000000+"m";
                        }
                        return value;
                    }
                },
                nameTextStyle:{
                    color:"#fff"
                }

            },
                {
                    type: 'value',

                    min: 0,
                    max:100,
                    interval: 100,
                    splitLine:{
                        show:false
                    },
                    axisLine:{
                        show:true,
                        lineStyle:{
                        	color:"#343340"
                        }
                    },
                    axisTick:{
                        show:false
                    },
                    axisLabel:{
                        show:true,
                        textStyle:{
                        	 color:'#565560',
                        	 fontSize:length_text
                        },
                        formatter: function (value, index) {
                        	
                            return value+"%";                        }
                    },
                    nameTextStyle:{
                        color:"#fff"
                    }
                }],
            grid: {
                top: "4%",
                left: 0,
                right: 0,
                bottom: '20%',
                containLabel: true,

            },
            series: [ {
                name: 'Manual',
                type: 'bar',
                stack: 'transfer',
                data: data.mTansfer,
                barWidth: 6,
                itemStyle:{
                    normal:{
                        color:"#328cd5",
                        barBorderRadius:[0,0,5,5]
                    },
                    emphasis: {
                        barBorderRadius: 7
                    }
                }
            }
             ,{
                name: 'Automatical',
                type: 'bar',
                stack: 'transfer',
                data: data.aTansfer,
                barWidth:6,
                itemStyle:{
                    normal:{
                        color:"#d2914d",
                        barBorderRadius:[7,7,0,0]
                    }
                }
            },
                {
                    name:'Transfer Rate',
                    type:'line',
                    yAxisIndex: 1,
                    data:data.rate,
                    itemStyle:{
                        normal:{
                            color:"#FFFFFF",
                            barBorderRadius:[7,7,0,0]
                        },
                        emphasis: {
                            barBorderRadius: 3
                        }
                    }
                }]
        };
        
        $(window).resize(function(){
        	myChart.resize();    
         }); 
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        
        };

})();