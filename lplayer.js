
function LPlayer() { 
if(document.getElementsByTagName('lplayer').length = 1) 
    var p = document.getElementsByTagName('lplayer')[0]
p.innerHTML = ''
var xhr = new XMLHttpRequest()
    xhr.open('get','/index.html')
    xhr.send()
    xhr.onreadystatechange = function (){
        if(xhr.status == 200 && xhr.readyState == 4)
        console.log(xhr.responseText)
    }

}

LPlayer()
