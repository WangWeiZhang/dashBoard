/* 第三屏主方法 */

var third = (function(){
	return {
		register:register
	}
	
	function register(config){
		UserVisitCurentNum(config);  //用户访问 在线人数 时间
		timeComment(config);   // 时间评论
		dynamicChart(config);  // 时间轴 echarts
		selectedConversation(config) //还原经典对话
		
		//隔三秒 实时请求 UserVisitCurentNum
		setInterval(function(){
			UserVisitCurentNum(config)
		} , 10 * 1000);

		firstOrSecond = 0;
		flipSingal = 1717262;//区别评论是否更新的唯一标识
		setInterval(function(){
			timeComment(config)
		} , 20 * 1000 );			
	}
	
	function UserVisitCurentNum(config){
		var options = {
			url : config.basePath + "/third/UserVisitCurentNum",
			type : 'get',
			dataType : "json",
			success : function(data) {
				$("#usersToday").show();
				$("#visitsToday").show();
				$("#curentVisits").show();
			
				$("#todayData").html(data.data.todayData);
				$("#usersToday").html(data.data.usersToday);
				$("#visitsToday").html(data.data.visitsToday);
				$("#curentVisits").html(data.data.curentVisits);
				$(".user-visit-curent-nums-list").animate({"opacity":1} , 2000);
			}
		}    
		$.ajax(options);
	}
	
	function timeComment(config){
			var options = {
				url : config.basePath + "/third/timeComment",
//				url : config.basePath + "/json/thirdModule/timeComment.json",
				type : 'get',
				dataType : "json",
				success : function(data) {
						if(firstOrSecond>0){
							$.each( $(".commentList-inner ul") , function (i, item) {
					            setTimeout(function(){
					            	$(".commentList-inner ul").eq(i).attr("class","animated fadeOutLeft");
					            } , i * 200);
						    });
							setTimeout(function(){
								$(".commentList-inner").html("");
								appendMessageInner();
							} , 1.2*1000)
							
							
						}else{
							appendMessageInner();
						}
						flipSingal = data.flipSingal;
					
					function appendMessageInner(){
						var screenHeight = $(window).height();
						var coust = 0;
						var subStrLen = 166;
						var bigSubStrLen = 395;
						
						
						if(window.screen.availWidth <= 1366 && screenHeight >=768){
							subStrLen = 166;
							bigSubStrLen = 323;
				        }else if(window.screen.availWidth <= 1366 && screenHeight <=768){
							subStrLen = 133;
							bigSubStrLen = 272;
				        }else if(window.screen.availWidth <= 1920 && screenHeight >=1080){
				        	subStrLen = 166;
				        	bigSubStrLen = 395;
				        }else if(window.screen.availWidth <= 1920 && screenHeight <=1080){
				        	subStrLen = 166;
				        	bigSubStrLen = 336;
				        }else if(window.screen.availWidth <= 3840){
				        	
				        }
						

						if(data.data.length==0 || data.error_code=="111111" || data.status == "failed"){
							console.error("请检查timeComment接口，可能存在数据为空的现象！");
						}

						$.each(data.data, function(index , value){
							var str = "";
							if(index+1<=4){
								str += "<div class='outAnimateBox'><ul>"//zoomIn
								if(value.type == "1"){
									str += "<li class=' animated fadeInRight'>"
									str += "<div class='topRow one-row animated fadeIn'>"
									str += "<div class='username'>"
									str += "<p class='img-box'><img class='userIcon' src='images/thirdimg/BitmapCopy6.png'><img class='channelIcon' src='images/thirdimg/"+value.data[0].channelAddress+"'></p>";
									str += "<span>"+value.data[0].userName+"</span>"
									str += "</div>"
									str += "<div class='timeComment' style='justify-content: flex-end;'>"
									str += "<span>"+value.data[0].commentData+","+value.data[0].userCountry+"</span>"
									str += "</div>"
									str += "</div>"
									str += "<div class='botRow one-bot-row animated fadeIn'>"
									str += "<p>"+cutstr(value.data[0].textComment , bigSubStrLen)+"</p>"
									str += "</div>"//cutstr(value.data[0].textComment , bigSubStrLen)
									str += "</li>"
								}else {
									$.each(value.data , function(index , value){
										str += "<li class=' animated fadeInRight'>";
										str += "<div class='topRow'>";
										str += "<div class='username'>";
										str += "<p class='img-box'><img class='userIcon' src='images/thirdimg/BitmapCopy6.png'><img class='channelIcon' src='images/thirdimg/"+value.channelAddress+"'></p>";
										str += "<span>"+value.userName+"</span>";
										str += "</div>"; 
										str += "<div class='timeComment' style='justify-content: flex-end;'>";
										str += "<span  >"+value.commentData+", "+value.userCountry+"</span>";
										str += "</div>";
										str += "</div>";
										str += "<div class='botRow'>";
										str += "<p>"+cutstr(value.textComment , subStrLen)+"</p>";
										str += "</div>";
										str += "</li>";
								})
								}
								str += "</ul></div>"
							}
							appendAnimate(str);
						})
						
						function appendAnimate(str){
							setTimeout(function(){
								$(".commentList-inner").append(str);
								$(".topRow").delay(600).animate({"opacity":"1"} , 1000);
								$(".botRow").delay(600).animate({"opacity":"1"} , 1000);
							} , coust*200);
							coust++;	
						}
						
						firstOrSecond++;
					}
				}
			}    
			$.ajax(options);
	}
	
	function dynamicChart(config){
			var options = {
				url : config.basePath + "/third/dynamicChart",
				type : 'get',
				dataType : "json",
				success : function(data) {
					$("#echarts-bar").html("");
					$(".echarts-bar").addClass("animated fadeIn");
					thirdcharts.register(data , config);
					var str = "";
					str += "<div class='boxChartsName'><span class='Timeline'>Visits</span><div><span class='hei0bg'></span></div><span class='Visits'>Timeline</span></div>";
					$("#echarts-bar").append(str)
				}
			}    
			$.ajax(options);
	}
	
	function selectedConversation(config){
		$.each( $(".content-right").children() , function (i, item) {
            setTimeout(function(){
            	$(".content-right").children().eq(i).addClass("animated fadeIn");
            } , i * 300);
        });
		var options = {
			url : config.basePath + "/third/selectedConversation",
//			url : config.basePath + "/json/thirdModule/selectedConversation.json",
			type : 'get',
			dataType : "json",
			success : function(data) {
				if(data.error_code=="999999" || data.status == "error"){
					console.error("请检查selectedConversation接口，可能存在数据为空的现象！");
					setTimeout(function(){
						selectedConversation(config)
					} , 5000);
					return false;
				}
				$("#selectMessageCountry").html(data.data[0].country);
				$("#selectMessageDate").html(data.data[0].nowDate);
				$("#selectMessageChannel").html(data.data[0].accessChannel);
				SelectMessageAppend();
				
				function SelectMessageAppend(){
					var a = 0;
					var messageIndex = 0;
					$('.messageInner').html("");
					$.each(data.data[0].message , function(index , value){
						messageIndex = index;
						if(value.type == "user"){
							var type=value.type;
							$.each(value.content , function(index , value){
								var message_type = value.message_type;
								var textValue = value.payload.text;
									if(value.message_type == "text"){
										var str = "";
										str += "<div class='people-firev-selected'>"
										str += "<div class='people-inner-selected '><div class='messageDiv'><p class='userSpText'><span id='message"+messageIndex+"' class='peoTextSpan'>"+value.payload.text+"</span><span class='masBg1'></span></p></div><p class='userChatIcon animated bounceIn'></p></div>"
										str += "</div>"
										setInterValMessageAppend(str , type , message_type , textValue);//bounceInRight
									}else if(value.message_type == "radio"){
										var str = "";
										str += "<div class='people-firev-selected'>"
										str += "<div class='people-inner-selected '><div class='messageDiv'><p class='userSpText' id='userRadioMessage'><span id='radioSpan' class='peoTextSpan'>&nbsp;&nbsp;&nbsp;................</span><span class='masBg1'></span></p></div><p class='userChatIcon animated bounceIn'></p></div>"
										str += "</div>"
										setInterValMessageAppend(str , type , message_type , textValue);//bounceInRight
									}else{
										var str = "";
										setInterValMessageAppend(str , type , message_type , textValue);
									}
										
							})
							
						}else if(value.type == "chatbot"){
							var type=value.type;
								$.each(value.content , function(index , value){
									if(value.message_type == "text"){
										var message_type = value.message_type;
										var textValue = value.payload.text;
										var str = "";
										str +=	"<div class='robot-firev-selected' >";
										str +=	"<div class='robot-inner-selected'><p class='chatIcon animated bounceIn'></p><div class='messageDiv'><p class='spText'><span id='message"+messageIndex+"' class='textSpan'>"+value.payload.text+"</span><span class='masBg'></span></p></div></div>";
										str +=	"</div>";
										setInterValMessageAppend(str , type , message_type , textValue);
									}else if(value.message_type == "selection"){
										var message_type = value.message_type;
										var textValue = value.payload.text;
										var str = "";
										str +=	"<div class='robot-firev-selected'>";
										str +=  "<div class='robot-inner-selected'><p class='chatIcon animated bounceIn'></p>";
										str +=  "<div class='messageDiv'><p class='masBg masBgSelectRight'></p><div class='selectTab'>"
										$.each(value.payload.selections , function(index , value){
											str +=  "<h6 animated fadeIn>"+value.text+"</h6>";
										});
										str +=	"</div></div></div></div>";
										setInterValMessageAppend(str , type , message_type , textValue);
									}else if(value.message_type == "evaluation"){
										var message_type = value.message_type;
										var textValue = value.payload.text;
										var str = "";
										str+="<div class='robot-firev-selected'>";
									    str+="<div class='robot-inner-selected'>";
									    str+="<p class='chatIcon animated bounceIn'></p>";
									    str+="<div class='messageDiv'>";
									    str+="<div class='commentText'><div><p class='commentTitle'><span>Your feedback is very important for us.</p></span>";       
									    str+="<ul id='starOrstarBlue'><li><img src='images/thirdimg/star.png'></li><li><img src='images/thirdimg/star.png'></li><li><img src='images/thirdimg/star.png'></li><li><img src='images/thirdimg/star.png'></li><li><img src='images/thirdimg/star.png'></li></ul>";      	
									    str+="<div class='inputModule'>" ;
									    str+="<div class='commentSelect'>";
									    str+="<p style='background:#1d6096;'>Please select a rating tag</p>";
									    str+="</div>";
									    str+="</div>"; 
									    str+="<p class='user-text'>More suggestions …</p>";    			
									    str+="</div>"
									    str+="<span class='masBg'></span>"       	
									    str+="</div></div></div></div>"        	
									    setInterValMessageAppend(str , type , message_type , textValue);          
									}else if(value.message_type == "video"){
										var message_type = value.message_type;
										var textValue = value.payload.text;
										var str = "";
										str +=	"<div class='robot-firev-selected' >";
										str +=	"<div class='robot-inner-selected'><p class='chatIcon animated bounceIn'></p><div class='messageDiv' ><p class='spText'><video class='video' loop='loop' autoplay='' name='media'><source src='"+value.payload.url+"' type='video/mp4'></video><span class='masBg'></span></p></div></div>";
										str +=	"</div>";
										setInterValMessageAppend(str , type , message_type , textValue);
									}  
								});
						}
					})
					
					var b=0;
					var getIndexMessage = 0;
					function setInterValMessageAppend(str ,type,message_type , textValue){
						
						setTimeout(function(){
							$('.messageInner').append(str);
							if(data.data[0].accessChannel == "Facebook"){
								$(".robot-inner-selected p.chatIcon").css({"backgroundImage":"url(images/thirdimg/facebookBig.png)", "backgroundRepeat":"no-repeat" , "backgroundSize":"100% auto" , "backgroundPosition":"top center"});
								$(".robot-firev-selected + .robot-firev-selected .robot-inner-selected p.chatIcon").css({"backgroundImage":"url()"})
							}else{
								$(".robot-inner-selected p.chatIcon").css({"backgroundImage":"url(images/thirdimg/channel1.png)", "backgroundRepeat":"no-repeat" , "backgroundSize":"100% auto" , "backgroundPosition":"top center"});
								$(".robot-firev-selected + .robot-firev-selected .robot-inner-selected p.chatIcon").css({"backgroundImage":"url()"})
							}
							
							setTimeout(function(){
								if(type == "user"){
									if(message_type == "text"){
										$(".people-inner-selected .messageDiv").show(400)
																			   .delay(1000).addClass("animated pulse111")
																			   .find($(".userSpText")).children("span")
																			   .delay(300).animate({"opacity":1} ,400);
									}else if(message_type == "evaluate-score"){
										switch(textValue)
										{
											case "20":
												$(".commentText:last").find("li").eq(0)
												  				 .children("img").attr("src" , "images/thirdimg/star_blue.png")
												  				 .parent("li").prevAll("li").children("img")
												  				 .attr("src" , "images/thirdimg/star_blue.png");
											break;
											
											case "40":
												$(".commentText:last").find("li").eq(1)
												  				 .children("img").attr("src" , "images/thirdimg/star_blue.png")
												  				 .parent("li").prevAll("li").children("img")
												  				 .attr("src" , "images/thirdimg/star_blue.png");
											break;
											
											case "60":
												$(".commentText:last").find("li").eq(2)
																 .children("img").attr("src" , "images/thirdimg/star_blue.png")
																 .parent("li").prevAll("li").children("img")
																 .attr("src" , "images/thirdimg/star_blue.png");
											break;
											
											case "80":
												$(".commentText:last").find("li").eq(3)
																 .children("img").attr("src" , "images/thirdimg/star_blue.png")
																 .parent("li").prevAll("li").children("img")
																 .attr("src" , "images/thirdimg/star_blue.png");
											break;
											
											case "100":
												$(".commentText:last").find("li").eq(4)
																	.children("img").attr("src" , "images/thirdimg/star_blue.png")
																	.parent("li").prevAll("li").children("img")
																	.attr("src" , "images/thirdimg/star_blue.png");
											break;
											
											default:break;
										}
									}else if(message_type == "evaluate-words"){
										$(".commentText:last").find($(".commentSelect")).append("<p class='fadeIn'>"+textValue+"</p>");
									}else if(message_type == "evaluate-input"){
										$(".commentText:last").find($(".user-text")).html("").append("<span style='color:#fff'>"+textValue+"</span>");
									}else if(message_type == "radio"){
										$(".people-inner-selected .messageDiv").show(400)
																			   .delay(1000).addClass("animated pulse111");
									}
									
								}else if(type = "chatbot"){
									if(message_type == "text"  || message_type == "selection"){
										$(".robot-inner-selected .messageDiv").show(400)
																			  .delay(1000).addClass("animated pulse111")
																			  .find($(".spText")).children($("span"))
																			  .delay(300).animate({"opacity":1} , 400);
									}else if(message_type == "evaluation"){
										$(".robot-inner-selected .messageDiv").show(400)
										  									  .delay(1000).addClass("animated pulse111")
										  									  .find($(".commentTitle")).children("span")
										  									  .delay(300).animate({"opacity":1} , 400)
										  									  .parent("p").next("ul").children("li")
										  									  .delay(300).animate({"opacity":1} , 400)
										  									  .parent("ul").next("div")
										  									  .delay(300).animate({"opacity":1} , 400)
										  									  .next("p")
										  									  .delay(300).animate({"opacity":1} , 400)
									}else if(message_type == "video"){
										$(".robot-inner-selected .messageDiv").show(400)
																			  .delay(1000).addClass("animated pulse111")
																			  .find($(".spText")).children($(".video"))
																			  .delay(300).animate({"opacity":1} , 400);
									}	
								}
								
								
							} , 400); 
							
							$(".dialog-text-box-selected").delay(700).animate({ scrollTop:($(".messageInner").height()*1.3)}, 1000);
							$(".people-inner-selected").addClass("fadeinOfSelected");
							$(".robot-inner-selected ").addClass("fadeinOfSelected");
							$("#radioSpan").css("opacity",0);
							b++;
							
							if(b == a){
								b = 0;
								setTimeout(function(){
									selectedConversation(config)
								} , 10000);
							}
						}, a * 5000);
						getIndexMessage++;
						a++;			
					}
				}
				
			},
			error:function(){
				setTimeout(function(){
					selectedConversation(config)
				} , 10000);
			}
		}    
		$.ajax(options);
	}
	
	/* myself tool is substr string
	 * 字符串超出限定的部分 截取 添加省略号。
	 * */
	function GetLength(str) {
        ///<summary>获得字符串实际长度，中文2，英文1</summary>
        ///<param name="str">要获得长度的字符串</param>
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
        }
        return realLength;
    };

    //js截取字符串，中英文都能用  
    //如果给定的字符串大于指定长度，截取指定长度返回，否者返回源字符串。  
    //字符串，长度  

    /** 
     * js截取字符串，中英文都能用 
     * @param str：需要截取的字符串 
     * @param len: 需要截取的长度 
     */
    function cutstr(str, len) {
        var str_length = 0;
        var str_len = 0;
        str_cut = new String();
        str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4  
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length >= len) {
                str_cut = str_cut.concat("......");
                return str_cut;
            }
        }
        //如果给定字符串小于指定长度，则返回源字符串；  
        if (str_length < len) {
            return str;
        }
    }
	
})();
