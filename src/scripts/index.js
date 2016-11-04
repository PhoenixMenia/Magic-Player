
var index_con = require('./templates/index.string');
var guide = require('./templates/guide.string');
var js = require('./js/player.string');


require('./libs/swiper-3.4.0.min.js');
//require('./libs/zepto.min.js');
//var iScroll = require('./libs/iscroll-probe.js');

//$(function() {
//	$('body').prepend(guide);
//	
//	var mySwiper = new Swiper('.swiper-container'/*, {
//		//pagination: '.swiper-pagination',   //小圆点
//		//paginationClickable: true,
//		//prevButton: '.swiper-button-prev',  //前进后退button
//		//nextButton: '.swiper-button-next',
//		//direction: 'horizontal'
//	}*/);
//	
//	$('#touch').on('click', function() {
//		$('body').html(index_con);
//		//require('/prd/js/player.js');
//		
//		//去掉浏览器滚动条 并且有上下弹动的效果
//		/*$(window).on('load', function() {
//			var myScroll = new iScroll('#lyricContainer', {
//				mouseWheel: false,
//				hScrollbar: false,
//				vScrollbar: false
//			});
//		});*/
//	});
//});

document.body.innerHTML = index_con + document.body.innerHTML;



/*window.onload = function() {
	document.body.innerHTML = guide + document.body.innerHTML;
	var mySwiper = new Swiper('.swiper-container', {
		direction: 'horizontal'
	});	
	document.getElementById('touch').onclick = function() {
		var old = document.body.children[0];
		document.body.removeChild(old);
		document.body.innerHTML = document.body.innerHTML + index_con;
		
//		var sc = document.createElement('script');
//		sc.src = '/src/scripts/js/player.js';
//		document.body.appendChild(sc);
	}
}
*/