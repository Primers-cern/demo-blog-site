//解决ie下背景画面在滚动是抖动问题。
if (!!window.ActiveXObject ||
	"ActiveXObject" in window ||
	navigator.userAgent.indexOf("Edge") > -1) { 
	// 判定是否为ie浏览器或Edge浏览器
	document.body.addEventListener && 
	document.body.addEventListener("mousewheel", function() {
		// 监听滚轮，去除默认动作，添加scrollTo代替。
		if(document.all){ // 识别ie10以下。
			window.event.returnValue = false;
		}else{
			event.preventDefault();
		}
	    var wheelD = event.wheelDelta;
	    var winScroll = window.pageYOffset;
	    window.scrollTo(0, winScroll - wheelD);
 	});
}


window.onload = function() {
	// 执行封面动画
	$("#banner").removeClass("loading");
	
	
    // 顶栏显示
	showTopBar();  // 初始化，防止页中刷新重置
	$(window).on("scroll",function() {
		showTopBar();    
	});


	// 自动翻过封面
	$(".rollmore").on("click" , function() {

		$("html, body").animate({scrollTop: $(window).height() -50},600);
		// Chrome和FF在这个动画上有冲突。需要html和body同时加上。
	});


	// 菜单弹出收回
	$(".menu-btn, #menu").click(function() {
		menuToggle();
	});


	// 去除广告
	$(".get-out").on("click", function() {
		$("#ad").slideUp(800);
	});

}

	// 顶栏显示状态函数

function showTopBar() {
	var windowH = $(window).height() -80;
	var scrollH = $(document).scrollTop();   
	if (windowH > scrollH > 0) {
		var heightP = ((windowH - scrollH) / windowH).toFixed(2);
		var setOpa  = 0.96 - (0.96 * heightP).toFixed(2);
		$(".logo-bar").css("opacity" , setOpa);
	}
	else if (scrollH = 0) {
		$(".logo-bar").css("opacity" , 0);
	}
	else{
		$(".logo-bar").css("opacity" , 0.96);
	};
}

	// 菜单弹出收回函数

function menuToggle() {
	var dis = $("#menu").css("display");
	if( dis == "none"){
		$("#menu").fadeIn(200);
		$(".menu-box").animate({marginRight: "0"},250);
	}
	else {
		$(".menu-box").animate({marginRight: "-14%"},250);
		$("#menu").fadeOut(250);
	};
}






