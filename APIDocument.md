# LANG = [zh-CN,en-US]
### Get started
First `node LocalFileServer.js` to start localhost file server.

`node LocalFileServer.js` 启动本地文件转发服务。如果没有该命令就去安装nodejs。

Then open `dev.html` in your browser, click `F12` button to show the dev tools. Input `LPlayerAPI` in the console, and see a list of the api.

浏览器打开`dev.html`，按`F12`打开控制台，输入`LPlayAPI`就能看到api的列表。

### `changePlayMode()`

Full function path: `LPlayAPI.changePlayMode()`

It can change play mode in `shuffle`, `repeat` and `repeat1`.

该api更改循环模式：随机，循环和单曲循环。

### `changeSong(i)`

Full function path: `LPlayAPI.changeSong(i)`

It can change another song to play. `i` is the song's order {number}. It is scoped between `0` and `LPlayAPI.songData.songs.length`(song's amount - 1)

该api可以换歌播放。传入`i`是数字，为要更改的歌曲序号，从`0`开始，最大为`LPlayAPI.songData.songs.length`(歌单的歌曲数量-1)

### `currentSong`

{Number} full path: `LPlayAPI.currentSong`

current song order

当前歌曲的序号

### `darkMode()`

Full function path: `LPlayAPI.darkMode()`

alter whether in dark mode or not.

切换黑暗和白色模式。

### `foldList()`

Full function path: `LPlayAPI.foldList()`

alter whether fold the list of songs

切换是否折叠列表

### `hideController()`

Full function path: `LPlayAPI.hideController()`

alter whether hide the controller

切换是否隐藏控制按钮

### `iconColor`

{String} full path: `LPlayAPI.iconColor`

`white` and `black`

### `isControllerHidden`

{Boolean} full path: `LPlayAPI.isControllerHidden`

### `isListFold`

{Boolean} full path: `LPlayAPI.isListFold`

### `isLyricAvailable`

{Boolean} full path: `LPlayAPI.isLyricAvailable`

### `isMuted`

{Boolean} full path: `LPlayAPI.isMuted`

### `isPlaying`

{Boolean} full path: `LPlayAPI.isPlaying`

### `lyricParser()`

Full function path: `LPlayAPI.lyricParser()`

parse current song's lyric and display in `<llyric>`

解析当前播放歌曲的歌词并在`<llyric>`显示

### `lyricScroller()`

Full function path: `LPlayAPI.lyricScroller()`

detect the position of the current lyric and scroll it.

检测歌词位置并滚动

### `lyricTimeArray`

{Array} full path: `LPlayAPI.lyricTimeArray`

### `memoryVolume`

{Number} full path: `LPlayAPI.memoryVolume`

scoped from `0` to `1`

when using mute function, this is the memory of the volume before mute.

静音前会把音量保存这个量里。取消静音会读取这个量。

### `next()`

Full function path: `LPlayAPI.next()`

play next song according to the play mode

根据播放顺序播放下一首歌

### `play()`

Full function path: `LPlayAPI.play()`

play or pause current song

播放/暂停

### `playMode`

{String} full path `LPlayAPI.playMode`

scoped: `repeat` `repeat1` `shuffle`

### `previous()`

Full function path: `LPlayAPI.previous()`

play last song according to the play mode

根据播放顺序播放上一首歌

### `progressDrag`

includes functions and variables :

#### `before`

{Number} full path: `LPlayAPI.progressDrag.before`

#### `dirCli(e)`

Full function path: `LPlayAPI.progressDrag.dirCli(e)`

`e` is the `click` event's parameter

directly click to jump

点击进度条跳转

#### `dragEnd()`

Full function path: `LPlayAPI.progressDrag.dragEnd()`

#### `dragMove(e)`

Full function path: `LPlayAPI.progressDrag.dragMove(e)`

#### `dragStart(e)`

Full function path: `LPlayAPI.progressDrag.dragStart(e)`

#### `isDragging`

{Boolean} full path: `LPlayAPI.progressDrag.isDragging`

#### `proportion`

{Number} full path: `LPlayAPI.progressDrag.proportion`

#### `startPosition`

{Number} full path: `LPlayAPI.progressDrag.startPosition`

### `readCookie()`

Full function path: `LPlayAPI.readCookie()`

read cookies and apply to player

读取cookie并应用

### `songData`

{Array} full path: `LPlayAPI.songData`

your song list

歌单内容

### `songMedia`

{DOM} full path: `LPlayAPI.songMedia`

a created song stream

歌曲文件流

### `syncSongProgress()`

Full function path: `LPlayAPI.syncSongProgress()`

sync progress bar with playing time

根据播放时间同步进度条

### `volumeDrag`

Reference [progressDrag](#progressDrag)

### `volumeMute()`

Full function path: `LPlayAPI.volumeMute()`

mute the media or not

静音/取消静音