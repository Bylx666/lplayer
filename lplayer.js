var lplSongList;
var lplHTMLFile;
var lplCssFile;
var lplIconPath;

function LPlayerInit() { 
 var p = document.getElementsByTagName('lplayer')[0];
 var songData;
 var xhrReadyState = 0;

 if(lplSongList!=undefined) console.log('input: '+lplSongList);
 else lplSongList = 'https://cdn.jsdelivr.net/gh/Bylx666/lplayer@main/demo/songs.json';

 if(lplHTMLFile!=undefined) console.log('input: '+lplHTMLFile);
 else lplHTMLFile = 'https://cdn.jsdelivr.net/gh/Bylx666/lplayer@main/index.html';

 if(lplCssFile!=undefined) console.log('input: '+lplCssFile);
 else lplCssFile = 'https://cdn.jsdelivr.net/gh/Bylx666/lplayer@main/lplayer.css';

 if(lplIconPath!=undefined) console.log('input: '+lplIconPath);
 else lplIconPath = 'https://cdn.jsdelivr.net/gh/Bylx666/lplayer@main/asset/icons/';
// stop 'online' function while local html developing
// For security, we prevent javascript while using iframe to test the layout in index.html.
// Please upload your 'index.html' file online and use XMLHttpRequest method to test scripts for new html file.
// Notice: css file is not in effect scope. It can be active at once.

 online();

 function whenXhrReady() { 
    lyricSystemInit();
    lplayerSongListInit();
    buttonsInit();
    if(lplGetCookie('lplCookie-isListFold') == '') LPlayerAPI.changeSong(0); // init first song
    readCookie();
 }


 function online(){
    getPlayerContent();
    getSongData();
    function getPlayerContent() { 
        var xhr = new XMLHttpRequest();
        xhr.open('get',lplHTMLFile);
        xhr.send();
        xhr.onreadystatechange = function (){
            if(xhr.status == 200 && xhr.readyState == 4){
                p.innerHTML = xhr.responseText;
                p.innerHTML += "<link rel='stylesheet' type='text/css' href='"+lplCssFile+"'>";
                xhrReadyState ++;
                if(xhrReadyState == 2) whenXhrReady();
            }
        }
     };
    function getSongData() { 
        var xhr = new XMLHttpRequest();
        xhr.open('get',lplSongList);
        xhr.send();
        xhr.onreadystatechange = function (){
            if(xhr.status == 200 && xhr.readyState == 4){
                songData = LPlayerAPI.songData = JSON.parse(xhr.responseText);
                xhrReadyState ++;
                if(xhrReadyState == 2) whenXhrReady();
            }
        }
     };
}

 function lplayerSongListInit() { 
    var list = document.getElementById('lpl-list');
    list.innerHTML = '';
    for(var i = 0;i < songData.songs.length;i++){
        var num = i + 1;
        list.innerHTML += 
        "<div class='lpl-list-item'>"+
            "<div class='lpl-list-item-num'>"+num+"</div>"+
            "<div class='lpl-list-item-title'>"+songData.songs[i].title+"</div>"+
            "<div class='lpl-list-item-artist'>"+songData.songs[i].artist+"</div>"+
        "</div>"
    }
    for (let i = 0;i < songData.songs.length;i++) { 
        document.getElementsByClassName('lpl-list-item')[i].addEventListener('click',function () { 
            LPlayerAPI.changeSong(i);LPlayerAPI.play();
         });
     };
 }
 function buttonsInit() { 
    var qs = function (className) { 
        return document.querySelector("."+className);
     } ;
     // Sync the progressbar and lyric in period
    setInterval(function () {
        if(LPlayerAPI.progressDrag.isDragging) return;
        if(LPlayerAPI.isLyricAvailable) LPlayerAPI.lyricScroller();
        LPlayerAPI.syncSongProgress() ;
        if(LPlayerAPI.songMedia.currentTime==LPlayerAPI.songMedia.duration) 
            LPlayerAPI.next();
        },200);
    // active buttons
    qs('lpl-control-play').addEventListener('click',function () { LPlayerAPI.play() });
    qs('lpl-control-order').addEventListener('click',function () { LPlayerAPI.changePlayMode() });
    qs('lpl-control-next').addEventListener('click',function () { LPlayerAPI.next() });
    qs('lpl-control-previous').addEventListener('click',function () { LPlayerAPI.previous() });
    qs('lpl-control-list').addEventListener('click',function () { LPlayerAPI.foldList() });
    qs('lpl-control-volume').addEventListener('click',function () { LPlayerAPI.volumeMute() });
    // progressbar
    qs('lpl-control-progressBar-progressThumb').addEventListener('mousedown',function (e) { LPlayerAPI.progressDrag.dragStart(e) });
    document.addEventListener('mousemove',function (e) { LPlayerAPI.progressDrag.dragMove(e) });
    document.addEventListener('mouseup',function () { LPlayerAPI.progressDrag.dragEnd() });
    document.getElementById('lpl-control-progressBar').addEventListener('click',function (e) { LPlayerAPI.progressDrag.dirCli(e) });
    // volumebar
    qs('lpl-control-volumeController-progressThumb').addEventListener('mousedown',function (e) { LPlayerAPI.volumeDrag.dragStart(e) });
    document.addEventListener('mousemove',function (e) { LPlayerAPI.volumeDrag.dragMove(e) });
    document.addEventListener('mouseup',function () { LPlayerAPI.volumeDrag.dragEnd() });
    document.getElementById('lpl-control-volumeController').addEventListener('click',function (e) { LPlayerAPI.volumeDrag.dirCli(e) });

    document.getElementById('lpl-body').oncontextmenu = function (e) { e.preventDefault() };
    document.getElementById('lpl-body').addEventListener('mousedown',function (e) { 
        if(e.button==2) LPlayerAPI.hideController();
    })
 };

 function lyricSystemInit() { 
    if(document.getElementsByTagName('llyric')[0]==undefined) return;
    LPlayerAPI.isLyricAvailable = true;
    document.getElementsByTagName('llyric')[0].innerHTML = "<div id='llyricList'></div>";
  };

 function readCookie() { 
    if(lplGetCookie('lplCookie-isListFold') != ''){
        var isListFold = JSON.parse(lplGetCookie('lplCookie-isListFold'));
        LPlayerAPI.isListFold = isListFold;
        if(isListFold){
            document.getElementById('lpl-list').style.height = '0';
        }
    };
    
    if(lplGetCookie('lplCookie-currentSong') != ''){
        var currentSong = parseInt(lplGetCookie('lplCookie-currentSong'));
        LPlayerAPI.currentSong = currentSong;
        LPlayerAPI.changeSong(currentSong);
    }
    
    if(lplGetCookie('lplCookie-playMode') != ''){
        var playMode = lplGetCookie('lplCookie-playMode');
        LPlayerAPI.playMode = playMode;
        var button = document.querySelector('.lpl-control-order').style;
        if(playMode=='repeat1'){
            button.backgroundImage = 'url('+lplIconPath+LPlayerAPI.iconColor+'/repeat1.svg)';
        }
        else if(playMode=='shuffle'){
            button.backgroundImage = 'url('+lplIconPath+LPlayerAPI.iconColor+'/shuffle.svg)';
        }
        else{
            button.backgroundImage = 'url('+lplIconPath+LPlayerAPI.iconColor+'/repeat.svg)';
        }
    };
    
    if(lplGetCookie('lplCookie-volume') != ''){
        var volume = parseFloat(lplGetCookie('lplCookie-volume'));
        var button = document.querySelector('.lpl-control-volume').style;
        LPlayerAPI.memoryVolume = volume;
        LPlayerAPI.songMedia.volume = volume;
        if(LPlayerAPI.songMedia.volume==1) {
            button.backgroundImage = 'url('+lplIconPath+LPlayerAPI.iconColor+'/volume.svg)';
        } else if(LPlayerAPI.songMedia.volume==0) {
            button.backgroundImage = 'url('+lplIconPath+LPlayerAPI.iconColor+'/volume-mute.svg)';
        } else{
            button.backgroundImage = 'url('+lplIconPath+LPlayerAPI.iconColor+'/volume-half.svg)';
        };
        document.querySelector('.lpl-control-volumeController-progressThumb').style.left = 
            document.querySelector('.lpl-control-volumeController-progress').style.width = 
            volume * 100 + "%";
    };
    if(lplGetCookie('lplCookie-isMuted') != ''){
        var isMuted = JSON.parse(lplGetCookie('lplCookie-isMuted'));
        LPlayerAPI.isMuted = isMuted;
        if(isMuted){
            console.log('233');
            LPlayerAPI.songMedia.volume = 0;
            document.querySelector('.lpl-control-volumeController-progress').style.opacity = '0.5';
            document.querySelector('.lpl-control-volume').style.opacity = '0.5';
            document.querySelector('.lpl-control-volume').style.backgroundImage = 'url('+lplIconPath+LPlayerAPI.iconColor+'/volume-mute.svg)';
        }
    };
 };
};
LPlayerInit();

var LPlayerAPI = {
    songMedia:new Audio(),
    isListFold:false,
    currentSong:0,
    songData:'',
    lyricTimeArray:[],
    playMode:'repeat',
    iconColor:'black',
    memoryVolume:1,
    isMuted:false,
    isControllerHidden:false,
    isLyricAvailable:false,

    changeSong:function (i) { 
        var sd = this.songData.songs[i];
        document.getElementById('lpl-cover').style.backgroundImage = "url("+sd.cover+")";
        this.songMedia.setAttribute('src',sd.url);
        document.getElementById('lpl-title').innerHTML = sd.title;
        document.getElementById('lpl-artist').innerHTML = sd.artist;
        document.getElementById('lpl-album').innerHTML = sd.album;
        this.currentSong = i;
        LPlayerAPI.lyricParser();
        this.isPlaying = false;
        document.cookie = "lplCookie-currentSong="+this.currentSong+";SameSite=Lax";
     },

    play:function () { 
        if(!this.isPlaying){
            this.songMedia.play();
            document.querySelector('.lpl-control-play').style.backgroundImage = 'url('+lplIconPath+this.iconColor+'/pause.svg)';
            this.isPlaying = true;
        } else{
            this.songMedia.pause();
            document.querySelector('.lpl-control-play').style.backgroundImage = 'url('+lplIconPath+this.iconColor+'/play.svg)';
            this.isPlaying = false;
        }
     },
    
    next:function () { 
        var nextSong;
        if(this.playMode=='repeat'){ 
            nextSong = this.currentSong + 1;
         }
        else if(this.playMode=='repeat1'){
            nextSong = this.currentSong;
        }
        else{
            var max = this.songData.songs.length - 1;
            var min = 0;
            nextSong = Math.floor(Math.random()*(max-min+1)+min);
            if(nextSong==this.currentSong) 
                nextSong = Math.floor(Math.random()*(max-min+1)+min); // prevent repeated random song
        };
        if(nextSong>this.songData.songs.length-1){nextSong=0};
        if(nextSong<0){nextSong=this.songData.songs.length-1};
        this.changeSong(nextSong);this.play();
     },
    previous:function () { 
        if(this.playMode=='repeat'){ 
            var nextSong = this.currentSong - 1;
            if(nextSong<0){nextSong=this.songData.songs.length-1};
            this.changeSong(nextSong);this.play();
         }
        else this.next();
     },
    changePlayMode:function () { 
        var button = document.querySelector('.lpl-control-order').style;
        if(this.playMode=='repeat'){
            button.backgroundImage = 'url('+lplIconPath+this.iconColor+'/repeat1.svg)';
            this.playMode = 'repeat1';
        }
        else if(this.playMode=='repeat1'){
            button.backgroundImage = 'url('+lplIconPath+this.iconColor+'/shuffle.svg)';
            this.playMode = 'shuffle';
        }
        else{
            button.backgroundImage = 'url('+lplIconPath+this.iconColor+'/repeat.svg)';
            this.playMode = 'repeat';
        }
        document.cookie = "lplCookie-playMode="+this.playMode+";SameSite=Lax";
     },

    syncSongProgress:function (proportion){
        var duration = LPlayerAPI.songMedia.duration;
        var currentTime = LPlayerAPI.songMedia.currentTime;
        if(proportion==undefined)proportion = currentTime / duration;
        document.querySelector('.lpl-control-progressBar-progress').style.width = proportion * 100 + "%";
        document.querySelector('.lpl-control-progressBar-progressThumb').style.left = proportion * 100 + "%";
        document.getElementById('lpl-duration').innerHTML = lplMinuteParser('stm',currentTime)+" / "+lplMinuteParser('stm',duration);
    },
    progressDrag:{
        isDragging:false,
        startPosition:0,
        before:0,
        proportion:0,
        dragStart:function (e) { 
            this.isDragging=true;
            this.startPosition=e.pageX;
            this.before = document.querySelector('.lpl-control-progressBar-progressThumb').offsetLeft;
         },
        dragMove:function (e) { 
            if(!this.isDragging) return;
            var total = document.getElementById('lpl-control-progressBar').offsetWidth;
            var now = this.before - this.startPosition + e.pageX;
            if(now<0) now = 0;
            if(now>total) now = total;
            this.proportion = now / total;
            LPlayerAPI.syncSongProgress(this.proportion);
            if(getSelection) document.getSelection().removeAllRanges(); // Prevent selecting
         },
        dragEnd:function () { 
            if(!this.isDragging) return;
            this.isDragging=false;
            LPlayerAPI.songMedia.currentTime = this.proportion * LPlayerAPI.songMedia.duration;
         },
         // directly click
        dirCli:function (e) { 
            if(this.isDragging) return;
            var o = document.getElementById('lpl-control-progressBar').getBoundingClientRect().left;
            var e = e.pageX;
            var total = document.getElementById('lpl-control-progressBar').offsetWidth;
            this.proportion = (e - o) / total;
            document.querySelector('.lpl-control-progressBar-progressThumb').style.left = 
                document.querySelector('.lpl-control-progressBar-progress').style.width = 
                this.proportion * 100 + "%";
            LPlayerAPI.songMedia.currentTime = this.proportion * LPlayerAPI.songMedia.duration;
         }
     },
    volumeDrag:{
        isDragging:false,
        startPosition:0,
        before:0,
        proportion:0,
        dragStart:function (e) { 
            if(LPlayerAPI.isMuted) return;
            this.isDragging=true;
            this.startPosition=e.pageX;
            this.before = document.querySelector('.lpl-control-volumeController-progressThumb').offsetLeft;
         },
        dragMove:function (e) { 
            if(!this.isDragging) return;
            var total = document.getElementById('lpl-control-volumeController').offsetWidth;
            var now = this.before - this.startPosition + e.pageX;
            var button = document.querySelector('.lpl-control-volume').style;
            if(now<0) {
                now = 0;
                button.backgroundImage='url('+lplIconPath+LPlayerAPI.iconColor+'/volume-mute.svg)';
            }
            else if(now>total) {
                now = total;
                button.backgroundImage='url('+lplIconPath+LPlayerAPI.iconColor+'/volume.svg)';
            }
            else{
                button.backgroundImage='url('+lplIconPath+LPlayerAPI.iconColor+'/volume-half.svg)';
            };
            this.proportion = now / total;
            document.querySelector('.lpl-control-volumeController-progressThumb').style.left = 
                document.querySelector('.lpl-control-volumeController-progress').style.width = 
                this.proportion * 100 + "%";
            LPlayerAPI.songMedia.volume = this.proportion;
            if(getSelection) document.getSelection().removeAllRanges(); // Prevent selecting
         },
        dragEnd:function () { 
            if(!this.isDragging) return;
            this.isDragging=false;
            document.cookie = "lplCookie-volume="+this.proportion+";SameSite=Lax";
         },

        dirCli:function (e) { 
            if(LPlayerAPI.isMuted) return;
            if(this.isDragging) return;
            var o = document.getElementById('lpl-control-volumeController').getBoundingClientRect().left;
            var e = e.pageX;
            var total = document.getElementById('lpl-control-volumeController').offsetWidth;
            this.proportion = (e - o) / total;
            document.querySelector('.lpl-control-volumeController-progressThumb').style.left = 
                document.querySelector('.lpl-control-volumeController-progress').style.width = 
                this.proportion * 100 + "%";
            LPlayerAPI.songMedia.volume = this.proportion;
            document.cookie = "lplCookie-volume="+this.proportion+";SameSite=Lax";
         }
     },
    volumeMute:function () { 
        var pb = document.querySelector('.lpl-control-volumeController-progress').style;
        var button = document.querySelector('.lpl-control-volume').style;
        if(!this.isMuted){
            this.memoryVolume = this.songMedia.volume;
            this.songMedia.volume = 0;
            pb.opacity = button.opacity = '0.5';
            button.backgroundImage = 'url('+lplIconPath+LPlayerAPI.iconColor+'/volume-mute.svg)';
            this.isMuted = true;
        } else{
            this.songMedia.volume = this.memoryVolume;
            pb.opacity = button.opacity = '';
            if(this.songMedia.volume==1) {
                button.backgroundImage = 'url('+lplIconPath+LPlayerAPI.iconColor+'/volume.svg)';
            } else if(this.songMedia.volume==0) {
                button.backgroundImage = 'url('+lplIconPath+LPlayerAPI.iconColor+'/volume-mute.svg)';
            } else{
                button.backgroundImage = 'url('+lplIconPath+LPlayerAPI.iconColor+'/volume-half.svg)';
            }
            this.isMuted = false;
        }
        document.cookie = "lplCookie-isMuted="+this.isMuted+";SameSite=Lax";
     },

    foldList:function () { 
        var list = document.getElementById('lpl-list').style;
        if(!this.isListFold){
            list.height = '0';
            this.isListFold=true;
        }
        else{
            list.height = 'calc(100% - 100px)';
            this.isListFold=false;
        }
        document.cookie = "lplCookie-isListFold="+this.isListFold+";SameSite=Lax";
     },

    hideController:function () { 
        if(!this.isControllerHidden){
            document.getElementById('lpl-control').style.display = 'none';
            this.isControllerHidden = true;
        }else {
            document.getElementById('lpl-control').style.display = '';
            this.isControllerHidden = false;
        }
     },

    lyricParser:function () { 
        if(!this.isLyricAvailable) return;
        var lyric = this.songData.songs[this.currentSong].lyric;
        var xhr = new XMLHttpRequest();
        xhr.open('get',lyric);
        xhr.send();
        xhr.onreadystatechange = function () { 
            if(xhr.readyState==4&&xhr.status==200){
                if(lyric.includes('/lyric?id=')){
                    lyric = JSON.parse(xhr.responseText).lrc.lyric; // 网易云API专用
                }else {
                    lyric = xhr.responseText;
                }
                setLyric(lyric);
            }
         };

        function setLyric(lyric) { 
            document.getElementById('llyricList').innerHTML = '';
            LPlayerAPI.lyricTimeArray = [];
            var lyricArray = lyric.split('\n');
            for(var i = 0; i < lyricArray.length; i++) {
                var time = lyricArray[i].substring(1,9);
                time = lplMinuteParser('mts',time);
                if(isNaN(time)) continue;

                LPlayerAPI.lyricTimeArray = LPlayerAPI.lyricTimeArray.concat([time]);
                
                var content = lyricArray[i].substring(lyricArray[i].indexOf(']') + 1);
                document.getElementById('llyricList').innerHTML += "<div class='llyricText'>"+content+"</div>";
            }
        }
     },
    lyricScroller:function () { 
        var now = LPlayerAPI.songMedia.currentTime;
        var txe = document.getElementsByClassName('llyricText');
        var lcs = document.getElementsByTagName('llyric')[0].offsetHeight;
        var preTop = lcs / 50 - 1;
        for(var i = 0; i < txe.length; i++){
            document.getElementsByClassName('llyricText')[i].className = "llyricText";
            if(now > LPlayerAPI.lyricTimeArray[i] && now < LPlayerAPI.lyricTimeArray[i+1]){
                document.getElementsByClassName('llyricText')[i].className = "llyricText selected";
                document.getElementById('llyricList').style.top = - 50 * i + 20 * preTop + "px";
                return
            }
        }
     }
};

// global utils
/**
 * 
 * @param {string} direction Input 'stm' to reverse second to minute; so does 'mts'
 * @param {string} value Input value here
 * @returns output
 */
function lplMinuteParser(direction,value) { 
    if(direction=='stm'){
        var input = parseFloat(value);
        var minute = parseInt(input / 60);
        var second = (input % 60).toFixed();
        if(second<10) second = "0"+second;
        var output = minute+":"+second;
        return output
    }
    else if(direction=='mts'){
        var input = value.split(':');
        var minute = parseInt(input[0]);
        var second = parseFloat(input[1]);
        var output = minute * 60 + second;
        return output
    }
    else{
        return NaN
    }
 }
 
/**
 * 
 * @param {string} cname Input the cookie name to read
 * @returns a string of your cookie.
 */
 function lplGetCookie(cname) {
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length;i++) {
        if(ca[i].includes(cname)) {
            return ca[i].substring(
                ca[i].indexOf('=') + 1
            )
        }
    };
    return ""
}