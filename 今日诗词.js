// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: sun;
// https://www.cnblogs.com/johu/p/13787882.html

let url = "https://v2.jinrishici.com/one.json"
let req = new Request(url);
let json = await req.loadJSON();

// log(json)

let poem=json.data.origin.content[0]

let dotflag = /。|，|！|？/g
let dot=poem.match(dotflag)

poem=(poem.split(dotflag))
log(poem)

let str1=poem[0]
let str2=poem[1]

let str3=json.data.origin.title
let str4=json.data.origin.dynasty
let str5=json.data.origin.author

console.log(json.data.origin)

let widget = new ListWidget()

let lineColor=new LinearGradient()
// 自定义背景颜色
// widget.backgroundColor=new Color("#DC143C")

// 背景图
  let img_url_arr = [
  // ✨博天·API  mobile:竖屏 pc:横屏
  //"https://api.btstu.cn/sjbz/api.php?method=mobile&lx=fengjing",
  // ✨接口互联·API  横竖屏
  "https://img.tjit.net/bing/rand/",
  // ✨小歪·API  横屏 风景
  //"https://api.ixiaowai.cn/gqapi/gqapi.php"
    ]
    const index = parseInt(Math.random() * img_url_arr.length)
    let img_url = img_url_arr[index]
    const i = await new Request(img_url)
    const img = await i.loadImage()
    widget.backgroundImage = img

log(str1.length)
// 第一行
  widget.addSpacer()
  let first=widget.addText(str1+dot[0])
  first.font=new Font("PingFangSC-Semibol", 14)
  first.textColor=new Color("#ffffff")
  first.shadowColor = new Color("000000")
  first.shadowRadius = 5
  first.shadowOffset = new Point(0, 0)
  widget.addSpacer(10)
//第二行
  let second=widget.addText(str2+dot[1])
  second.font=new Font("PingFangSC-Semibol", 14)
  second.textColor=new Color("#ffffff")
  second.shadowColor = new Color("000000")
  second.shadowRadius = 5
  second.shadowOffset = new Point(0, 0)
  second.rightAlignText()
  widget.addSpacer(22)
  //widget.spacing=30
//诗词
let title=widget.addText("《"+str3+"》")
  title.textColor=new Color("#ffffff")
  title.font=new Font("PingFangSC-Light", 9)
  title.shadowColor = new Color("000000")
  title.shadowRadius = 3
  title.shadowOffset = new Point(0, 0)
  title.rightAlignText()
//朝代·作者
let author=widget.addText("「"+str4+"·"+str5+"」")
  author.textColor=new Color("#ffffff")
  author.font=new Font("PingFangSC-Light", 9)
  author.shadowColor = new Color("000000")
  author.shadowRadius = 3
  author.shadowOffset = new Point(0, 0)
  author.rightAlignText()
  
  widget.setPadding(20, 10, 10, 5)//上左下右
  widget.presentSmall()//Small Medium

Script.setWidget(widget)
Script.complete()
