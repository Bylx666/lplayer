
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
        xhr.open('get','https://raw.githubusercontent.com/Bylx666/lplayer/main/index.html')
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
     // Sync the progressbar in period
    setInterval(function () {
        if(LPlayerAPI.progressDrag.isDragging) return;
        
        LPlayerAPI.syncSongProgress() 
        if(LPlayerAPI.songMedia.currentTime==LPlayerAPI.songMedia.duration) 
            LPlayerAPI.next()
        },200)
    // active buttons
    qs('lpl-control-play').addEventListener('click',function () { LPlayerAPI.play() })
    qs('lpl-control-order').addEventListener('click',function () { LPlayerAPI.changePlayMode() })
    qs('lpl-control-next').addEventListener('click',function () { LPlayerAPI.next() })
    qs('lpl-control-previous').addEventListener('click',function () { LPlayerAPI.previous() })
    qs('lpl-control-list').addEventListener('click',function () { LPlayerAPI.foldList() })
    qs('lpl-control-volume').addEventListener('click',function () { LPlayerAPI.volumeMute() })
    // progressbar
    qs('lpl-control-progressBar-progressThumb').addEventListener('mousedown',function (e) { LPlayerAPI.progressDrag.dragStart(e) })
    document.addEventListener('mousemove',function (e) { LPlayerAPI.progressDrag.dragMove(e) })
    document.addEventListener('mouseup',function () { LPlayerAPI.progressDrag.dragEnd() })
    document.getElementById('lpl-control-progressBar').addEventListener('click',function (e) { LPlayerAPI.progressDrag.dirCli(e) })
    // volumebar
    qs('lpl-control-volumeController-progressThumb').addEventListener('mousedown',function (e) { LPlayerAPI.volumeDrag.dragStart(e) })
    document.addEventListener('mousemove',function (e) { LPlayerAPI.volumeDrag.dragMove(e) })
    document.addEventListener('mouseup',function () { LPlayerAPI.volumeDrag.dragEnd() })
    document.getElementById('lpl-control-volumeController').addEventListener('click',function (e) { LPlayerAPI.volumeDrag.dirCli(e) })

    document.getElementById('lpl-control').addEventListener('click',function () { 
        if(getSelection) document.getSelection().removeAllRanges() // prevent selecting
    })
 }
}
LPlayerInit()

var LPlayerAPI = {
    songMedia:new Audio(),
    isPlaying:false,
    isListFold:false,
    currentSong:0,
    songData:'',
    playMode:'repeat',
    iconColor:'black',
    memoryVolume:1,
    isMuted:false,

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
     },

    syncSongProgress:function (proportion){
        var duration = LPlayerAPI.songMedia.duration
        var currentTime = LPlayerAPI.songMedia.currentTime
        if(proportion==undefined)proportion = currentTime / duration
        document.querySelector('.lpl-control-progressBar-progress').style.width = proportion * 100 + "%"
        document.querySelector('.lpl-control-progressBar-progressThumb').style.left = proportion * 100 + "%"
        document.getElementById('lpl-duration').innerHTML = lplMinuteParser('stm',currentTime)+" / "+lplMinuteParser('stm',duration)
    },
    progressDrag:{
        isDragging:false,
        startPosition:0,
        before:0,
        proportion:0,
        dragStart:function (e) { 
            this.isDragging=true
            this.startPosition=e.pageX
            this.before = document.querySelector('.lpl-control-progressBar-progressThumb').offsetLeft
         },
        dragMove:function (e) { 
            if(!this.isDragging) return
            var total = document.getElementById('lpl-control-progressBar').offsetWidth
            var now = this.before - this.startPosition + e.pageX
            if(now<0) now = 0
            if(now>total) now = total
            this.proportion = now / total
            LPlayerAPI.syncSongProgress(this.proportion)
            if(getSelection) document.getSelection().removeAllRanges() // Prevent selecting
         },
        dragEnd:function () { 
            if(!this.isDragging) return
            this.isDragging=false
            LPlayerAPI.songMedia.currentTime = this.proportion * LPlayerAPI.songMedia.duration
         },
         // directly click
        dirCli:function (e) { 
            if(this.isDragging) return
            var o = document.getElementById('lpl-control-progressBar').getBoundingClientRect().left
            var e = e.pageX
            var total = document.getElementById('lpl-control-progressBar').offsetWidth
            this.proportion = (e - o) / total
            document.querySelector('.lpl-control-progressBar-progressThumb').style.left = 
                document.querySelector('.lpl-control-progressBar-progress').style.width = 
                this.proportion * 100 + "%"
            LPlayerAPI.songMedia.currentTime = this.proportion * LPlayerAPI.songMedia.duration
         }
     },
    volumeDrag:{
        isDragging:false,
        startPosition:0,
        before:0,
        proportion:0,
        dragStart:function (e) { 
            if(LPlayerAPI.isMuted) return
            this.isDragging=true
            this.startPosition=e.pageX
            this.before = document.querySelector('.lpl-control-volumeController-progressThumb').offsetLeft
         },
        dragMove:function (e) { 
            if(!this.isDragging) return
            var total = document.getElementById('lpl-control-volumeController').offsetWidth
            var now = this.before - this.startPosition + e.pageX
            var button = document.querySelector('.lpl-control-volume').style
            if(now<0) {
                now = 0;
                button.backgroundImage='url(asset/icons/'+LPlayerAPI.iconColor+'/volume-mute.svg)'
            }
            else if(now>total) {
                now = total;
                button.backgroundImage='url(asset/icons/'+LPlayerAPI.iconColor+'/volume.svg)'
            }
            else{
                button.backgroundImage='url(asset/icons/'+LPlayerAPI.iconColor+'/volume-half.svg)'
            }
            this.proportion = now / total
            document.querySelector('.lpl-control-volumeController-progressThumb').style.left = 
                document.querySelector('.lpl-control-volumeController-progress').style.width = 
                this.proportion * 100 + "%"
            LPlayerAPI.songMedia.volume = this.proportion
            if(getSelection) document.getSelection().removeAllRanges() // Prevent selecting
         },
        dragEnd:function () { 
            if(!this.isDragging) return
            this.isDragging=false
         },

        dirCli:function (e) { 
            if(LPlayerAPI.isMuted) return
            if(this.isDragging) return
            var o = document.getElementById('lpl-control-volumeController').getBoundingClientRect().left
            var e = e.pageX
            var total = document.getElementById('lpl-control-volumeController').offsetWidth
            this.proportion = (e - o) / total
            document.querySelector('.lpl-control-volumeController-progressThumb').style.left = 
                document.querySelector('.lpl-control-volumeController-progress').style.width = 
                this.proportion * 100 + "%"
            LPlayerAPI.songMedia.volume = this.proportion
         }
     },
    volumeMute:function () { 
        var pb = document.querySelector('.lpl-control-volumeController-progress').style
        var button = document.querySelector('.lpl-control-volume').style
        if(!this.isMuted){
            this.memoryVolume = this.songMedia.volume
            this.songMedia.volume = 0
            pb.opacity = '0.5'
            button.backgroundImage = 'url(asset/icons/'+LPlayerAPI.iconColor+'/volume-mute.svg)'
            this.isMuted = true
        } else{
            this.songMedia.volume = this.memoryVolume
            pb.opacity = ''
            if(this.songMedia.volume==1) {
                button.backgroundImage = 'url(asset/icons/'+LPlayerAPI.iconColor+'/volume.svg)'
            } else if(this.songMedia.volume==0) {
                button.backgroundImage = 'url(asset/icons/'+LPlayerAPI.iconColor+'/volume-mute.svg)'
            } else{
                button.backgroundImage = 'url(asset/icons/'+LPlayerAPI.iconColor+'/volume-half.svg)'
            }
            this.isMuted = false
        }
        if(getSelection) document.getSelection().removeAllRanges()
     },

    foldList:function () { 
        var list = document.getElementById('lpl-list').style
        if(!this.isListFold){
            list.height = '0'
            this.isListFold=true
        }
        else{
            list.height = 'calc(100% - 100px)'
            this.isListFold=false
        }
        if(getSelection) document.getSelection().removeAllRanges()
     }
}

// global utils
/**
 * 
 * @param {string} direction Input 'stm' to reverse second to minute; so does 'mts'
 * @param {string} value Input value here
 * @returns output
 */
function lplMinuteParser(direction,value) { 
    if(direction=='stm'){
        var input = parseFloat(value)
        var minute = parseInt(input / 60)
        var second = (input % 60).toFixed()
        if(second<10) second = "0"+second
        var output = minute+":"+second
        return output
    }
    else if(direction=='mts'){
    }
    else{
        return ''
    }
 }