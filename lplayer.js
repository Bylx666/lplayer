
function LPlayer() { 
var p = document.getElementsByTagName('lplayer')[0]
var songData
var songMedia = new Audio()
var xhrReadyState = 0
var isPlaying = false
var currentSong = 0

// stop 'online' function while local UI developing
// For security, we prevent javascript while using iframe to test the UI in index.html.
// Please upload your file online and use XMLHttpRequest method to test scripts for new UI.

online()

function whenXhrReady() { 
    lplayerSongList()
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
        xhr.open('get','https://cdn.jsdelivr.net/gh/Bylx666/lplayer@main/demo/songs.json')
        xhr.send()
        xhr.onreadystatechange = function (){
            if(xhr.status == 200 && xhr.readyState == 4){
                songData = JSON.parse(xhr.responseText)
                xhrReadyState ++
                if(xhrReadyState == 2) whenXhrReady()
            }
        }
     }
}
function lplayerSongList() { 
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
        console.log(i)
        document.getElementsByClassName('lpl-list-item')[i].addEventListener('click',function () { currentSong = i-1;changeSong() })
    }
    function changeSong() { 
        document.getElementById('lpl-cover').style.backgroundImage = "url("+songData.songs[currentSong].cover+")"
        songMedia.setAttribute('src',songData.songs[currentSong].url)
        document.getElementById('lpl-title').innerHTML = songData.songs[currentSong].title
        document.getElementById('lpl-artist').innerHTML = songData.songs[currentSong].artist
        document.getElementById('lpl-album').innerHTML = songData.songs[currentSong].album
        
        console.log(currentSong)
     }
 }
function play() {  }

}


LPlayer()
