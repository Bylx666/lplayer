
function LPlayer() { 
if(document.getElementsByTagName('lplayer').length = 1) 
    var p = document.getElementsByTagName('lplayer')[0]
var songData

// stop 'online' function while local UI developing
// For security, we prevent javascript while using iframe to test the UI in index.html.
// Please upload your file online and use XMLHttpRequest method to test scripts for new UI.

online()

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
                console.log(songData)
            }
        }
     }
    
}
function d() {  }


}


LPlayer()
