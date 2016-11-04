/*$(function() {
	var oAudio = document.getElementById('audio'),
		isPlay = false,
		volumeRange = 0.5,
		isVolume = true;
	
	//静音切换
	$('#volumeRange').val(volumeRange);
	$('#volume').on('click', function() {
		if (isVolume) {
			$(this).attr('src', '/src/img/novol.png');
			oAudio.volume = 0;
		} else {
			$(this).attr('src', '/src/img/vol.png');
			oAudio.volume = volumeRange;
		}
		isVolume = !isVolume;
	});
	
	//加减声音
	$('#volumeRange').on('input', function() {
		volumeRange = Number($(this).val());
		if(volumeRange === 0) {
			$('#volume').attr('src', '/src/img/novol.png');
		} else {
			$('#volume').attr('src', '/src/img/vol.png');
		}
		oAudio.volume = volumeRange;
	});	

});*/



window.onload = function() {
	new Player().initialList();
}

var Player = function() {
	this.audio = document.getElementById('audio');
	this.lyricContainer = document.getElementById('lyricContainer');
	this.currentIndex = 0;
	this.songName = document.getElementById('songName');
	this.lyric = null;
    this.lyricStyle = 0;
    this.isPlay = true;
    this.isVolume = true;
    this.volumeVal = 0.5;
    this.volumeRange = document.getElementById('volumeRange');
    this.volumePic = document.getElementById('volume');
    this.allSongs = null;
}

Player.prototype.init = function(songs) {	
	var that = this;
	this.allSongs = songs;
	songs.forEach(function(v, i, a) {
		var songName = '/src/content/songs/' + v.lrc_name + '.mp3';
		that.audio.src = songName;
		that.lyricContainer.style.top = '0px';
		that.lyric = null;
		that.lyricContainer.innerHTML = 'loading...';
		that.lyricStyle = Math.floor(Math.random() * 4);
	});
	
	
	this.play();
	
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
	
	document.getElementById('next').addEventListener('click', function() {
		that.currentIndex++;
		that.audio.src = '/src/content/songs/' + that.allSongs[that.currentIndex].lrc_name + '.mp3';
		that.play();
	});
};

Player.prototype.initialList = function() {
	var that = this;
	var xhttp = new XMLHttpRequest();		
	xhttp.open('get', '/src/js/content.json', true);
	
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


Player.prototype.play = function() {
	var that = this;
	this.audio.addEventListener('canplay',function() {
			that.getLyric(that.audio.src.replace('.mp3', '.lrc'));
			that.getAllTime();
	        that.play();
	        that.songName.innerHTML = that.allSongs[that.currentIndex].song_name + '-' + that.allSongs[that.currentIndex].artist;
		});
		
	this.audio.addEventListener('timeupdate', function() {
		if (!that.lyric) {
			return;
		}
		that.getCurrentTime();
		for (var i = 0, l = that.lyric.length; i < l; i++) {
			if (this.currentTime > that.lyric[i][0] - 0.50) {
				var line = document.getElementById('line-' + i),
					prevLine = document.getElementById('line-'+(i>0?i-1:i));
				prevLine.className = '';
				line.className = 'current-line-' + that.lyricStyle;
                that.lyricContainer.style.top = 130 - line.offsetTop + 'px';
			}
		}		
	});		
	
};


Player.prototype.getAllTime = function() {
	var allTime = Math.ceil(this.audio.duration);
	var min = parseInt(allTime / 60),
		sec = allTime % 60;
	min = min.toString().length > 1 ? min : '0' + min;
	sec = sec.toString().length >1 ? sec : '0' + sec;
				
	document.getElementById('allTime').innerHTML = min + ':' + sec;
	document.getElementById('playRange').max = allTime;
}


Player.prototype.getCurrentTime = function() {
	var that = this;
	var currTime = Math.ceil(this.audio.currentTime);
	var min = parseInt(currTime / 60),
		sec = currTime % 60;
	min = min.toString().length > 1 ? min : '0' + min;
	sec = sec.toString().length > 1 ? sec : '0' + sec;
	
	document.getElementById('currTime').innerHTML = min + ':' + sec;
	document.getElementById('playRange').value = currTime;
	
	//判断当前音乐是否播放完成
	/*var isEnded = this.audio.ended;
	if (isEnded) {
		//顺序播放
		if (pattern === 0) {
			$('#next').trigger('click');
		} else if (pattern === 1) { //单曲循环
			index--;
			$('#next').trigger('click');
		} else {
			index = parseInt(Math.random() * len);
			$('#next').trigger('click');
		}
	}*/	
};


Player.prototype.playNext = function() {
	
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


Player.prototype.parseLyric = function(text) {
	var lines = text.split('\n');
	var pattern = /\[\d{2}:\d{2}.\d{2}\]/g;
	var result = [];
	var offset = this.getOffset(text);
	
	while (!pattern.test(lines[0])) {
        lines = lines.slice(1);
    };
    
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

Player.prototype.appendLyric = function(lyric) {
	var that = this;
    var fragment = document.createDocumentFragment();
    
    this.lyricContainer.innerHTML = '';
    lyric.forEach(function(v, i, a) {
    	var line = document.createElement('p');
    	line.id = 'line-' + i;
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



