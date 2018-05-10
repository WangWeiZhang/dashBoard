var thirdcharts = (function(){
	return {
		register:register
	}
	
	function register(data,config){
		echartsBar(data,config);
	}
	
	//获得指定元素在一个数组中的所有下标    参数：需要查询的元素 ， 被查询的数组
	function searchKeys(needle, haystack){
	    var result = [];
	    for (var i in haystack){
			if (haystack[i] == needle){
	   			result.push(i);
			}
		}
	    return result;
	}
	
	function echartsBar(data,config){
		
		//柱形图与x坐标轴的显示间隔   新增加一个柱形透明度为0 故而看不见 模拟 间隔效果
		var maxHeight = Math.max.apply(null , data.data.chartsCount);
		var maxCount = maxHeight/16;
		var bottomMaxHeight = [];
		$.each(data.data.chartsCount , function(){
			bottomMaxHeight.push(maxCount);
		})
		
		//兼容各个 分辨率 的 初始化参数和 再具体屏幕下的参数
		var girdBottom = "55%";
		var girdLeft = "4.5%";
		var fontSize = 12;
		var symbolSize = [40,30];
		var symbolOffset = [0, -20];
		var labelPosition = [7,2];
		var padding = [0,0,4,0];
		
		if(window.screen.availWidth <= 1366){
			girdBottom = "30%";
			girdLeft = "3.5%";
			fontSize = 11;
			symbolSize = [25,16];
			symbolOffset = [0, -8];
			padding = [8,0,10,0];
        }else if(window.screen.availWidth <= 1920){
        	girdBottom = "20%";
        	girdLeft = "2.5%";
        	fontSize = 12;
        	symbolSize = [35,20];
        	symbolOffset = [0, -14];
        	padding = [0,0,4,0];
        }
		
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echarts-bar'));
        var option = {
        	    legend: {
        	        show:false,
        	        data:['直接访问']
        	    },
        	    grid: {
        	        top:"55%",
        	        left: girdLeft,//1%
        	        right: '0%',
        	        bottom: girdBottom,//44
        	        containLabel: false
        	    },
        	    xAxis : [
        	        {
        	            type : 'category',
        	            nameLocation :"start",
        	            data : data.data.chartsTime,
        	            splitLine:{ show:false },
        	            axisTick:{ show:false },
        	            axisLabel:{
        	            	fontSize:fontSize,
        	                color:"#b2b1b7",
        	                margin:4,
        	                interval:0,
        	                fontFamily:'Arial'
        	            },
        	            axisLine: {
        		        	onZero: true ,
        		        	lineStyle:{color:"#B7B3D4" , width:1}
        		        }
        		        
        	        }
        	    ],
        	    yAxis : [
        	        {
        	            type : 'value',
        	            splitLine:{ show:false },
        	            show:false,
        	        }
        	    ],
        	    series : [
					{
					    name:'',
					    type:'bar',
					    stack:  '总量',
					    data:bottomMaxHeight,
					    itemStyle: {
					        normal: {
					          color:'rgba(0,0,0,0)'
					        }
					    },
					    barWidth:"95%"
					    
					},
        	        {
        	            name:'',
        	            type:'bar',
        	            stack:  '总量',
        	            data:data.data.chartsCount,
        	            barWidth:"95%",
					    maxHeight:20
        	        }
        	    ]
        	};
        $(window).resize(function(){
          myChart.resize();    
         }); 

        //昨天 今天的 地址
        var todayAddress = 'image://images/thirdimg/today.png';
	    var yesterdayAddress = 'image://images/thirdimg/yesterday.png';
	    
	    //首次调用的 最大值最小值
	    var barMax = Math.max.apply(null,data.data.chartsCount);
	    var barMin = Math.min.apply(null,data.data.chartsCount);
	    
	    //获得最大值在数组中的 索引的集合
	    var maxKeys = searchKeys(barMax , data.data.chartsCount);
	    var minKeys = searchKeys(barMin , data.data.chartsCount);
	    var checkInitIndexOne = maxKeys;
	    var checkInitIndexTwo = minKeys;
	    
	    //存储 最大值最小值 的 所有索引
	    var tipAll = [];
	    var twelveAmIndex = option.xAxis[0].data.indexOf("12am");
	    for(var i=0; i<checkInitIndexOne.length;i++){
	    	 var tipMax = {name : 'Max'+i,  xAxis:parseInt(checkInitIndexOne[i]), yAxis:barMax ,symbol:checkInitIndexOne[i]<twelveAmIndex ? yesterdayAddress : todayAddress};
	    	 tipAll.push(tipMax);
	    }
	    
	    for(var j=0; j<checkInitIndexTwo.length; j++){
	    	 var tipMin = {name : 'Min'+j,  xAxis:parseInt(checkInitIndexTwo[j]), yAxis:barMin ,symbol:checkInitIndexTwo[j]<twelveAmIndex ? yesterdayAddress : todayAddress};
	    	 tipAll.push(tipMin);
	    }
	    
      //柱形图上的提示框
        option.series[1].markPoint =  {  
        	symbolSize :symbolSize,
        	symbolOffset:symbolOffset,
            data :tipAll,
            label:{
            	normal:{
            		show:true,
            		color:"#000",
            		fontFamily:'Arial',
            		padding :padding,
            		formatter:function(parme){
            			var value = parme.data.yAxis;
            			var strValue = value.toString();
            			if(strValue.length == 4){
            				var floatStr = strValue/1000;
            				var floatFirstStr = floatStr.toFixed(1);
            				var MathRoundStr = Math.round(floatFirstStr);
            				return MathRoundStr +"k";
            			}else if(strValue.length == 5){
            				var floatStr = strValue/1000;
            				var floatFirstStr = floatStr.toFixed(1);
            				var MathRoundStr = Math.round(floatFirstStr);
            				return MathRoundStr +"k";
            			}
            		}
            	}
            }
	    };
        
        //区分昨天和今天的颜色  以12am为分界点
        option.series[1].itemStyle = {
        	normal: {
	            color: function(params) {
	          	var twelveAmIndex = data.data.chartsTime.indexOf("12am");
	          	var nowIndex = data.data.chartsTime.indexOf(params.name);
	          	if(nowIndex < twelveAmIndex){	
	          		return "#349983";
	          	}else{
	          		return "#3672A8";
	          	}
            }
          }
        };
        
        
        var indexCount = 1;      // 测试接口 计数使用  
        //整点执行函数
        IntegerData();
        function IntegerData(){
        	var date = new Date();//现在时刻
			
			var setDataInteger = new Date();//用户登录时刻的下一个整点，也可以设置成某一个固定时刻
			
			setDataInteger.setHours(date.getHours()+1);//小时数增加1
			
			setDataInteger.setMinutes(0);
			
			setDataInteger.setSeconds(0);
			
			setTimeout(function(){ nextIntegralPointAfterLogin(config) },setDataInteger-date);//用户登录后的下一个整点执行。
			
			function nextIntegralPointAfterLogin(cinfig){
				dynamicChart(config);//在整点执行的函数，在每个整点都调用该函数

				setInterval(function(){ dynamicChart(config) },60*60*1000);//一个小时执行一次，那么下一个整点，下下一个整点都会执行
			}
        }
        
        
        
      //动态加载echarts数据
        function dynamicChart(config){
			var options = {
				//url : config.basePath + "/json/thirdModule/echartsGroups/dynamicChart"+indexCount+".json",
				url : config.basePath + "/third/dynamicChartFirst",
				type : 'get',
				dataType : "json",
				success : function(data) {
					
					//删除数组第一个值      将新请求的数值  添加到 series.data的最后一个
					var data1 = option.series[1].data;
					data1.shift();
					var dataRound = data.data.chartsCount[0];
				    data1.push(dataRound);
				    
				    //删除x轴类目第一个值     将删除的类目放到 xAxis[0].data的最后一个
				    last1 =  option.xAxis[0].data.shift();
				    option.xAxis[0].data.push(data.data.chartsTime[0]);
				    
				    var barMax = Math.max.apply(null,data1);
				    var barMin = Math.min.apply(null,data1);
				    var maxKeys = searchKeys(barMax , data1);
				    var minKeys = searchKeys(barMin , data1);
				    var checkInitIndexOne = maxKeys;
				    var checkInitIndexTwo = minKeys;
				    var tipAll = [];
				    var twelveAmIndex = option.xAxis[0].data.indexOf("12am");
				    for(var i=0; i<checkInitIndexOne.length;i++){
				    	 var tip = {name : 'Max'+i,  xAxis:parseInt(checkInitIndexOne[i]), yAxis:barMax ,symbol:checkInitIndexOne[i]<twelveAmIndex ? yesterdayAddress : todayAddress};
				    	 tipAll.push(tip);
				    }
				    
				    for(var j=0; j<checkInitIndexTwo.length; j++){
				    	 var tip = {name : 'Min'+j,  xAxis:parseInt(checkInitIndexTwo[j]), yAxis:barMin ,symbol:checkInitIndexTwo[j]<twelveAmIndex ? yesterdayAddress : todayAddress};
				    	 tipAll.push(tip);
				    }
				    
				    option.series[1].markPoint.data = tipAll
				    //重新执行myChart
				    myChart.setOption(option);

				}
			}    
			$.ajax(options);
        }
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        
    }
})();