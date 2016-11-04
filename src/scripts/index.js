
var index_con = require('./templates/index.string');
var guide = require('./templates/guide.string');
//var js = require('./js/player.string');


require('./libs/swiper-3.4.0.min.js');
var iscroll = require('./libs/iscroll-probe.js');

//document.body.innerHTML = index_con + document.body.innerHTML;



window.onload = function() {
	document.body.innerHTML = guide + document.body.innerHTML;
	var mySwiper = new Swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		paginationClickable: true
	});	
	document.getElementById('touch').onclick = function() {

		var old = document.body.children[0];
		document.body.removeChild(old);
		document.body.innerHTML = index_con + document.body.innerHTML;
		
		var sc = document.createElement('script');
		sc.src = '/src/scripts/js/player.js';
		document.body.appendChild(sc);
		
		/*setTimeout(function() {
			var myScroll = new iscroll('#lyricContainer', {
				mouseWheel: true,
				hScrollbar: false,
				vScrollbar: false
			});
		}, 3000);*/
				
	}
}
