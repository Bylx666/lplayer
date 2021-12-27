# Love Player
Love Player使用灵活简单！简称LPlayer.支持网易云api！由原生js构建,使用es6语法。

Love Player is the music player that is easy and flexible to use. LPlayer is the shortname of it. Uses ES6 codes.

## Features
- Dark mode avalable.
- 黑夜模式
- NeteaseApi parser available
- 可以解析网易云api的歌词
- APIs easy to use.
- 外部可以调用播放器内部api，内部逻辑也依赖api编写，使用方便。
- Custom styles by using your css file.
- 可以轻松自定义styles

## Get Started
- See how the player work in `/demo/demo.html`
- 看看`demo.html`怎么运用Lplayer
- Or see the document below.
- 或者看看下面的文档

### 1. import <https://cdn.jsdelivr.net/gh/Bylx666/lplayer@main/dist/lplayer.min.js>

You can import it in your html document with `<script src="https://cdn.jsdelivr.net/gh/Bylx666/lplayer@main/dist/lplayer.min.js"></script>`

在html里面添加`<script src="https://cdn.jsdelivr.net/gh/Bylx666/lplayer@main/dist/lplayer.min.js"></script>`标签。

### 2. Use global variables (全局变量) from `lpl`(Love Player's Prefix): they are

    1. lplCssFile 
    2. lplHTMLFile 
    3. lplSongList 
    4. lplIconPath

The default values are:

默认值如下：

``` javascript
lplCssFile = 'https://cdn.jsdelivr.net/gh/Bylx666/lplayer@main/lplayer.css';
lplHTMLFile = 'https://cdn.jsdelivr.net/gh/Bylx666/lplayer@main/index.html';
lplSongList = 'https://cdn.jsdelivr.net/gh/Bylx666/lplayer@main/demo/songs.json';
lplIconPath = 'https://cdn.jsdelivr.net/gh/Bylx666/lplayer@main/asset/icons/';
```
You at least change the `lplSongList` to import your song list. The required json file formats is:

你起码把歌单改了，就是`lplSongList`全局变量的链接字符串，改成你自己的json.格式如下：

``` json
{"songs":[
    {
        "title":"START:DASH!!",
        "artist":"μ's",
        "album":"No brand girls / START:DASH!!",
        "url":"https://music.163.com/song/media/outer/url?id=26218091",
        "cover":"http://p1.music.126.net/Dd9k4Ia7KbWrOJ56DyZH-g==/109951163230305154.jpg?param=130y130",
        "lyric":"https://sukmusicapi.vercel.app/lyric?id=26218091"
    },
    {
        "title":"No brand girls",
        "artist":"μ's",
        "album":"No brand girls / START:DASH!!",
        "url":"https://music.163.com/song/media/outer/url?id=26218090",
        "cover":"http://p1.music.126.net/Dd9k4Ia7KbWrOJ56DyZH-g==/109951163230305154.jpg?param=130y130",
        "lyric":"https://sukmusicapi.vercel.app/lyric?id=26218090"
    },
    ...
]}
```

They are the same as their name. Set correct value for them.

`title`,`artist`,`album`就是标题，歌手，专辑。
`url`,`cover`,`lyric`就是音乐流的链接，封面图片地址，歌词地址。
尽量都填上，毕竟一首歌一般都有这些。注：歌词链接可以解析[网易云api](https://github.com/Binaryify/NeteaseCloudMusicApi)的歌词！

The other values, including `lplCssFile`, `lplHTMLFile` and `lplIconPath`, are optional to set. 

剩下3个可选设置。

If you wonder better layout and styles, clone [css file](https://cdn.jsdelivr.net/gh/Bylx666/lplayer@main/lplayer.css) and edit it. Upload your edited css file online, and 

不满意样式布局？复制原仓库的css文件，修改完上传到你自己的服务器，把绝对路径写到全局变量`lplCssFile`里：

```javascript
lplCssFile = 'your css file'
```

If you cannot connect the [html file](https://raw.githubusercontent.com/Bylx666/lplayer/main/index.html) (nothing loaded in your `<lplayer>`), think about using another url by 

html文件出问题了？把原仓库的html复制到你服务器，然后绝对路径写到：

```javascript
lplHTMLFile = 'your html file'
```

If you want another set of icons, learn from my path settings and 

想换图标吗？看看我图标路径的设置方法，自己上传一套，然后路径写到：

```javascript
lplIconPath = 'your path of icons/'
```

remember to prepare two color for one icon, and put them in `white/` and `black/` folders. It is meaningful to the dark mode.

svg文件准备两套，一套放进`white`文件夹当白色版，一套`black`黑色版。这两个文件夹必须有。white白色版是给黑暗模式准备的。

### 3. Active the player 激活播放器

There are two tags for LPlayer, they are `<lplayer>` and `<llyric>`. Simply put one `<lplayer>` in your `<div>` for the player, and the `<div>` for lyric to set their layout and size.

LPlayer使用两个标签:`<lplayer>`和`<llyric>`。直接丢div里，然后js就会getElementsByTagName来找到它们。`<llyric>`里面显示歌词，不要和播放器放一个div里；尺寸完全不是一回事。

### 4. Advanced use and development 高级用法和开发
Read `APIDocument.md`