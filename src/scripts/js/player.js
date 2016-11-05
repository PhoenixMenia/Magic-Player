/*================工具函数===================*/
function getStyle(obj,attr) {
	if (obj.currentStyle) {
		return obj.currentStyle[attr];
	} else {
		return getComputedStyle(obj, false)[attr];
	}
}

/*===================================*/


/*window.onload = function() {
	new Player().initialList();
}*/

//修改body的className添加背景图片
document.body.className = 'picbg';


var bgSide = 'rgba(0,0,0,.7)';
var bgCenter = 'rgba(0,0,0,0)';
var bg = 'linear-gradient('+ bgSide + ',' + bgCenter + ','+ bgCenter + ',' + bgSide + ')';


//执行主函数
setTimeout(function() {
	new Player().initialList();
	
	var conter = document.getElementById('container');
	conter.style.background = bg;
}, 1000);



//构造函数
var Player = function() {
	this.audio = document.getElementById('audio');
	this.lyricContainer = document.getElementById('lyricContainer');
	this.lyricContainerHeight = parseInt(getStyle(this.lyricContainer,'height'));
	this.currentIndex = 0;
	this.songName = document.getElementById('songName');
	this.lyric = null;
    this.isPlay = true;
    this.isVolume = true;
    this.volumeVal = 1;
    this.volumeRange = document.getElementById('volumeRange');
    this.volumePic = document.getElementById('volume');
    this.allSongs = null;
    this.next = document.getElementById('next');
    this.prev = document.getElementById('prev');
    this.controller = document.getElementById('pauseOrPlay');
    this.modeCtrl = document.getElementById('loopModel');
    this.loopMode = 0;
    this.playRange = document.getElementById('playRange');
    this.menu = document.getElementById('menu');
    this.playList = document.getElementById('playList');
    this.playList.show = false;
}

//初始化  添加事件处理程序
Player.prototype.init = function(songs) {
	var that = this;
	this.allSongs = songs;
	var index = this.currentIndex;
	var songName = '/src/content/songs/' + this.allSongs[index].lrc_name + '.mp3';
	
	that.addPlayList(songs);
	this.play(index);
	this.lyric = null;
	this.lyricContainer.innerHTML = 'loading...';		
	this.progress();
		
	function aaa(obj) {
		if (!obj.isVolume) {
			obj.volumePic.src = '/src/img/novol.png';
			obj.audio.volume = 0;
		} else {
			obj.volumePic.src = '/src/img/vol.png';
			obj.audio.volume = obj.volumeVal;
		}
	}
	
	this.volumePic.addEventListener('click', function() {
		that.isVolume = !that.isVolume;
		aaa(that);		
	}, false);
	
	this.volumeRange.addEventListener('input', function() {
		var _volume = Number(this.value);
		if(_volume === 0) {
			that.volumeRange.src =  '/src/img/novol.png';
			that.isVolume = false;
		} else {
			that.volumeRange.src = '/src/img/vol.png';
			that.isVolume = true;
		}
		that.audio.volume = _volume;
		aaa(that);
	});
	
	//播放下一曲
	this.next.addEventListener('click', function() {
		that.playNext();
	});
	
	//播放上一曲
	this.prev.addEventListener('click', function() {
		that.currentIndex--;
		that.currentIndex = that.currentIndex === -1
							? that.allSongs.length - 1 
							: that.currentIndex;

		that.play(that.currentIndex);
	});
	
	//播放、暂停
	this.controller.addEventListener('click', function() {
		that.isPlay = !that.isPlay;
		
		if (!that.isPlay) {
			that.audio.pause();
			this.innerHTML = '&#xe7c3;'
		} else {
			that.audio.play();
			this.innerHTML = '&#xe602;'
		}
	});
	
	//切换循环模式
	this.modeCtrl.addEventListener('click', function() {
		that.loopMode++;
		that.loopMode = that.loopMode === 3 ? 0 : that.loopMode;
		that.changeMode();
	});
	
	function playyy() {
		that.progress();
	}
	
	//更新
	this.audio.addEventListener('timeupdate', playyy);
		
	this.playRange.addEventListener('touchstart', function() {
		that.audio.removeEventListener('timeupdate', playyy);
		
		that.playRange.addEventListener('touchend', function() {
			that.audio.currentTime = that.playRange.value;
			that.audio.addEventListener('timeupdate', playyy);
		});
		
	});
	
	
	this.menu.addEventListener('click', function() {
		that.getMenu();
	});
	
	/*document.addEventListener('click', function(event) {
		var target = event.srcElement || event.target;
		if (target.id !== 'playList') {
			if (that.playList.show) {
				that.getMenu();
			}		
		}
		
	}, false);*/
	
	
	
};



Player.prototype.initialList = function() {
	var that = this;
	var xhttp = new XMLHttpRequest();		
	xhttp.open('get', '/src/scripts/js/content.json', true);
	
	xhttp.onreadystatechange = function() {
		if ((xhttp.status == 200 ||xhttp.status == 304) && xhttp.readyState == 4) {
			var txt = xhttp.responseText;
			var songs = JSON.parse(txt).data;
			//在回调函数中处理过程
			that.init(songs);
		}
	}
	xhttp.send();
};


//播放歌曲
Player.prototype.play = function(index) {
	var that = this;
	this.audio.src = '/src/content/songs/' + this.allSongs[index].lrc_name + '.mp3';
	
	this.audio.addEventListener('canplay',function() {
			that.getLyric(that.audio.src.replace('.mp3', '.lrc'));
			that.getAllTime();
	        that.songName.innerHTML = that.allSongs[index].song_name 
	        							+ '-' 
	        							+ that.allSongs[index].artist;
	});	
	
	var len = this.allSongs.length;
	for (var i = 0; i < len; i++) {
		this.playList.children[1].children[i].style.backgroundColor = '';
	}
	this.playList.children[1].children[index + 1].style.backgroundColor = '#888';
	
};


//播放下一曲
Player.prototype.playNext = function() {
	this.currentIndex++;
	this.currentIndex = this.currentIndex === this.allSongs.length 
						? 0 
						: this.currentIndex;
	this.play(this.currentIndex);
};


Player.prototype.getAllTime = function() {
	var allTime = Math.ceil(this.audio.duration);   //获取总时间
	var min = parseInt(allTime / 60),     //获取分钟数
		sec = allTime % 60;               //获取秒数
	min = min.toString().length > 1 ? min : '0' + min;
	sec = sec.toString().length >1 ? sec : '0' + sec;
				
	document.getElementById('allTime').innerHTML = min + ':' + sec;
	this.playRange.max = allTime;
}



Player.prototype.getCurrentTime = function() {
	var that = this;
	var currTime = Math.ceil(this.audio.currentTime);
	var min = parseInt(currTime / 60),
		sec = currTime % 60;
	min = min.toString().length > 1 ? min : '0' + min;
	sec = sec.toString().length > 1 ? sec : '0' + sec;
	
	document.getElementById('currTime').innerHTML = min + ':' + sec;
	this.playRange.value = currTime;
	
};



Player.prototype.getLyric = function(url) {
	var that = this;
	var xhttp = new XMLHttpRequest();
	xhttp.open('get', url, true);
	xhttp.responseType = 'text';
	xhttp.onload = function() {
		that.lyric = that.parseLyric(xhttp.response);
		that.appendLyric(that.lyric);
	};
	xhttp.onerror = xhttp.onabort = function(e) {
		that.lyricContainer.textContent = '!failed to load the lyric...';
	};
	this.lyricContainer.textContent = 'loading lyric...';
	xhttp.send();
};


//解析歌词
Player.prototype.parseLyric = function(text) {
	var lines = text.split('\n');      //将歌词字符串从换行符的地方开始分割成数组
	var pattern = /\[\d{2}:\d{2}.\d{2}\]/g;   //事件匹配模式
	var result = [];
	var offset = this.getOffset(text);
	
	//删除没有时间的非歌词元素
	while (!pattern.test(lines[0])) {
        lines = lines.slice(1);
    };
    
    //删除最后的空白行
    lines[lines.length - 1].length === 0 && lines.pop();
    
    lines.forEach(function(v, i, a) {
    	 var time = v.match(pattern);
    	 var value = v.replace(pattern, '');
    	 time.forEach(function(v1, i1, a1) {
    	 	var t = v1.slice(1, -1).split(':');
    	 	result.push([parseInt(t[0], 10)*60+parseFloat(t[1])+parseInt(offset)/1000,value]);
    	 });
    });
    
    result.sort(function(a, b) {
        return a[0] - b[0];
    });
    return result;
};


//将歌词显示到页面
Player.prototype.appendLyric = function(lyric) {
	var that = this;
    var fragment = document.createDocumentFragment();
    
    this.lyricContainer.innerHTML = '';
    lyric.forEach(function(v, i, a) {
    	var line = document.createElement('p');
    	line.id = 'line-' + i;
    	line.className = 'text-middle';
    	line.textContent = v[1];
    	fragment.appendChild(line);
    });
    this.lyricContainer.appendChild(fragment);
    
};



Player.prototype.getOffset = function(text) {
	var offset = 0;	 
	try {
        var offsetPattern = /\[offset:\-?\+?\d+\]/g,
            offset_line = text.match(offsetPattern)[0],
            offset_str = offset_line.split(':')[1];
        offset = parseInt(offset_str);
   } catch (err) {
        offset = 0;
    }
    return offset;
};


//修改循环模式
Player.prototype.changeMode = function() {
	if (this.loopMode === 0) {  //顺序播放
		this.modeCtrl.innerHTML = '&#xe63b;';
	} else if (this.loopMode === 1) {  //单曲循环
		this.modeCtrl.innerHTML = '&#xe62f;';
	} else {    //随机播放
		this.modeCtrl.innerHTML = '&#xe6f1;';
	}
}

//当前歌曲播放完之后继续播放
Player.prototype.continuePlaying = function() {
	if (this.loopMode === 0) {  //顺序播放
		this.playNext();
	} else if (this.loopMode === 1) {    //单曲循环
		this.currentIndex = this.currentIndex;
		this.play(this.currentIndex);
	} else {             //随机播放
		this.currentIndex = parseInt(Math.random() * this.allSongs.length);
		this.play(this.currentIndex);
	}
}



Player.prototype.progress = function() {	
	this.getCurrentTime();
	
	if (!this.lyric) {
		return;
	}
	
	for (var i = 0, l = this.lyric.length; i < l; i++) {		
		if (this.audio.currentTime > this.lyric[i][0] - 0.50) {
			var line = document.getElementById('line-' + i),
				prevLine = document.getElementById('line-'+(i>0?i-1:i));
			prevLine.className = 'text-middle';
			line.className = 'text-middle current';	  //高亮显示当前正在播放的歌词
			
			//当播放的歌词超过container的一半时开始滚动
			if (line.offsetTop >= this.lyricContainerHeight/2) {
				this.lyricContainer.scrollTop = line.offsetTop 
				- this.lyricContainerHeight/2;
			}
		}
	}
	
	//判断当前音乐是否播放完成
	this.audio.ended && this.continuePlaying();
}


//点击menu的时候toggle歌曲列表
Player.prototype.getMenu = function() {
	if (!this.playList.show) {
		this.playList.style.display = 'block';
	} else {
		this.playList.style.display = 'none';
	}
	this.playList.show = !this.playList.show;
}


//在播放列表中显示所有的歌曲信息
Player.prototype.addPlayList = function(arr) {
	
	var that = this;
	var template = this.playList.children[1].children[0];   //获取li的模板
	var fragement = document.createDocumentFragment();
	
	arr.forEach(function(element, index, arr) {
		var num = index + 1;
		var songname = element.song_name;
		var artist = element.artist;		
		var oLi = template.cloneNode(true);
		oLi.id = '';
		oLi.children[0].innerHTML = num;
		oLi.children[1].children[0].innerHTML = songname;
		oLi.children[1].children[1].innerHTML = artist;	
		
		oLi.addEventListener('touchstart', function() {
			this.style.backgroundColor = '#888';
		});
			
		oLi.addEventListener('touchend', function() {
			this.style.backgroundColor = '';
			that.currentIndex = index;
			that.play(that.currentIndex);
		});
		
		//取消的时候怎么阻止播放选中的歌曲？？？
		/*oLi.addEventListener('touchcancel', function() {
			this.ontouchend = null;
		});*/
		
		fragement.appendChild(oLi);
	});
	
	that.playList.children[1].appendChild(fragement);
	
	//显示所有歌曲总数
	document.getElementById('ttlSongsCount').innerHTML = arr.length;
}

