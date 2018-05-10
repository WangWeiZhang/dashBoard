/*
 * 
 * 交互过来的字段放入标记中,由于标记的宽度限制显示的位数
 * 
 * 需要判断字数然后 调整字体
 * 
 * */

var fonts = (function(){
	return {
		register : register,
	}
	
	function register(){
		var solvedNum_length =  $("#solvedNum").text().length;
		if(solvedNum_length > 7){
			$("#solvedNum").css("fontSize" , "2.5rem");
			$("#solvedNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#unsolvedNum").css("fontSize" , "2.5rem")
			$("#unsolvedNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#solvingNum").css("fontSize" , "2.5rem");
			$("#solvingNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#usingNum").css("fontSize" , "2.5rem")
			$("#usingNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#averageNum").css("fontSize" , "2.5rem")
			$("#averageNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
		}
		
		var unsolvedNum_length = $("#unsolvedNum").text().length; 
		if(unsolvedNum_length > 7){
			$("#solvedNum").css("fontSize" , "2.5rem");
			$("#solvedNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#unsolvedNum").css("fontSize" , "2.5rem")
			$("#unsolvedNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#solvingNum").css("fontSize" , "2.5rem");
			$("#solvingNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#usingNum").css("fontSize" , "2.5rem")
			$("#usingNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#averageNum").css("fontSize" , "2.5rem")
			$("#averageNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
		}
		
		var usingNum_length =  $("#usingNum").text().length;
		if(usingNum_length > 7){
			$("#solvedNum").css("fontSize" , "2.5rem");
			$("#solvedNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#unsolvedNum").css("fontSize" , "2.5rem")
			$("#unsolvedNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#solvingNum").css("fontSize" , "2.5rem");
			$("#solvingNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#usingNum").css("fontSize" , "2.5rem")
			$("#usingNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#averageNum").css("fontSize" , "2.5rem")
			$("#averageNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
		}
		
		var shang_number_length =  $("#shang_number").text().length;
		if(shang_number_length > 7){
			$("#solvedNum").css("fontSize" , "2.5rem");
			$("#solvedNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#unsolvedNum").css("fontSize" , "2.5rem")
			$("#unsolvedNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#solvingNum").css("fontSize" , "2.5rem");
			$("#solvingNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#usingNum").css("fontSize" , "2.5rem")
			$("#usingNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#averageNum").css("fontSize" , "2.5rem")
			$("#averageNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
		}
		
		var shang_number_second_length =  $("#shang_number_second").text().length;
		if(shang_number_second_length > 7){
			$("#solvedNum").css("fontSize" , "2.5rem");
			$("#solvedNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#unsolvedNum").css("fontSize" , "2.5rem")
			$("#unsolvedNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#solvingNum").css("fontSize" , "2.5rem");
			$("#solvingNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#usingNum").css("fontSize" , "2.5rem")
			$("#usingNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
			$("#averageNum").css("fontSize" , "2.5rem")
			$("#averageNum").siblings("span").css({"fontSize" : "0.8rem" , "paddingTop" : "0.1rem"})
		}
		
		var using_total = $("#using_total").text().length;
		if(using_total > 4){
			$("#using_total").css("fontSize" , "2.386rem");
		}
		
	}
})()