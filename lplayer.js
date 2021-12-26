
function LPlayerInit() { 
 var p = document.getElementsByTagName('lplayer')[0]
 var songData
 var xhrReadyState = 0

// stop 'online' function while local html developing
// For security, we prevent javascript while using iframe to test the layout in index.html.
// Please upload your 'index.html' file online and use XMLHttpRequest method to test scripts for new html file.
// Notice: css file is not in effect scope. It can be active at once.

 online()

 function whenXhrReady() { 
    lplayerSongListInit()
    buttonsInit()
    firstSongInit()
 }


 function online(){
    getPlayerContent()
    getSongData()
    function getPlayerContent() { 
        var xhr = new XMLHttpRequest()
        xhr.open('get','https://cdn.jsdelivr.net/gh/Bylx666/lplayer@main/index.html')
        xhr.send()
        xhr.onreadystatechange = function (){
            if(xhr.status == 200 && xhr.readyState == 4){
                p.innerHTML = xhr.responseText
                xhrReadyState ++
                if(xhrReadyState == 2) whenXhrReady()
            }
        }
     }
    function getSongData() { 
        var xhr = new XMLHttpRequest()
        xhr.open('get','https://raw.githubusercontent.com/Bylx666/lplayer/main/demo/songs.json')
        xhr.send()
        xhr.onreadystatechange = function (){
            if(xhr.status == 200 && xhr.readyState == 4){
                songData = LPlayerAPI.songData = JSON.parse(xhr.responseText)
                xhrReadyState ++
                if(xhrReadyState == 2) whenXhrReady()
            }
        }
     }
}
function firstSongInit() { 
    var sd = LPlayerAPI.songData.songs[0]
    LPlayerAPI.songMedia.setAttribute('src',sd.url)
    document.getElementById('lpl-cover').style.backgroundImage = "url("+sd.cover+")"
    document.getElementById('lpl-title').innerHTML = sd.title
    document.getElementById('lpl-artist').innerHTML = sd.artist
    document.getElementById('lpl-album').innerHTML = sd.album
 }
 function lplayerSongListInit() { 
    var list = document.getElementById('lpl-list')
    list.innerHTML = ''
    for(var i = 0;i < songData.songs.length;i++){
        var num = i + 1
        list.innerHTML += 
        "<div class='lpl-list-item'>"+
            "<div class='lpl-list-item-num'>"+num+"</div>"+
            "<div class='lpl-list-item-title'>"+songData.songs[i].title+"</div>"+
            "<div class='lpl-list-item-artist'>"+songData.songs[i].artist+"</div>"+
        "</div>"
    }
    for (let i = 0;i < songData.songs.length;i++) { 
        document.getElementsByClassName('lpl-list-item')[i].addEventListener('click',function () { 
            LPlayerAPI.changeSong(i)
         })
     }
 }
 function buttonsInit() { 
    var qs = function (className) { 
        return document.querySelector("."+className)
     } 
    qs('lpl-control-play').addEventListener('click',function () { LPlayerAPI.play() })
    qs('lpl-control-order').addEventListener('click',function () { LPlayerAPI.changePlayMode() })
    qs('lpl-control-next').addEventListener('click',function () { LPlayerAPI.next() })
    qs('lpl-control-previous').addEventListener('click',function () { LPlayerAPI.previous() })
 }
}
LPlayerInit()

var LPlayerAPI = {
    songMedia:new Audio(),
    isPlaying:false,
    currentSong:0,
    songData:'',
    playMode:'repeat',
    iconColor:'black',

    changeSong:function (i) { 
        var sd = this.songData.songs[i]
        document.getElementById('lpl-cover').style.backgroundImage = "url("+sd.cover+")"
        this.songMedia.setAttribute('src',sd.url)
        document.getElementById('lpl-title').innerHTML = sd.title
        document.getElementById('lpl-artist').innerHTML = sd.artist
        document.getElementById('lpl-album').innerHTML = sd.album
        this.currentSong = i
        this.isPlaying = false
        this.play()
     },

    play:function () { 
        if(!this.isPlaying){
            this.songMedia.play()
            document.querySelector('.lpl-control-play').style.backgroundImage = 'url(asset/icons/'+this.iconColor+'/pause.svg)'
            this.isPlaying = true
        } else{
            this.songMedia.pause()
            document.querySelector('.lpl-control-play').style.backgroundImage = 'url(asset/icons/'+this.iconColor+'/play.svg)'
            this.isPlaying = false
        }
     },
    
    next:function () { 
        var nextSong
        if(this.playMode=='repeat'){ 
            nextSong = this.currentSong + 1
         }
        else if(this.playMode=='repeat1'){
            nextSong = this.currentSong
        }
        else{
            var max = this.songData.songs.length - 1
            var min = 0
            nextSong = Math.floor(Math.random()*(max-min+1)+min);
            if(nextSong==this.currentSong) 
                nextSong = Math.floor(Math.random()*(max-min+1)+min); // prevent repeated random song
        }
        if(nextSong>this.songData.songs.length-1){nextSong=0}
        if(nextSong<0){nextSong=this.songData.songs.length-1}
        this.changeSong(nextSong)
     },
    previous:function () { 
        if(this.playMode=='repeat'){ 
            var nextSong = this.currentSong - 1
            if(nextSong<0){nextSong=this.songData.songs.length-1}
            this.changeSong(nextSong)
         }
        else this.next()
     },
    changePlayMode:function () { 
        var button = document.querySelector('.lpl-control-order').style
        if(this.playMode=='repeat'){
            button.backgroundImage = 'url(asset/icons/'+this.iconColor+'/repeat1.svg)'
            this.playMode = 'repeat1'
        }
        else if(this.playMode=='repeat1'){
            button.backgroundImage = 'url(asset/icons/'+this.iconColor+'/shuffle.svg)'
            this.playMode = 'shuffle'
        }
        else{
            button.backgroundImage = 'url(asset/icons/'+this.iconColor+'/repeat.svg)'
            this.playMode = 'repeat'
        }
     }
}
