// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: cannabis;
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

let str3=json.data.origin.author
let str4=json.data.origin.title


console.log(json.data.origin)

let widget = new ListWidget()

let lineColor=new LinearGradient()
// 自定义背景颜色
// widget.backgroundColor=new Color("#DC143C")

// 背景图片
let bgImg="https://d2w9rnfcy7mm78.cloudfront.net/8867234/original_63cd43c88048a9ff6279c0340faea9db.jpg?1601084036?bc=0"
const i = await new Request(bgImg);
const img = await i.loadImage();
widget.backgroundImage=img

log(str1.length)

  let first=widget.addText(str1+dot[0])
// 第一行自定义字体大小
  first.font=new Font("KaiTi", 14)
  first.textColor=new Color("#ffffff")

  let second=widget.addText(str2+dot[1])
//  第二行自定义字体大小 
  second.font=new Font("KaiTi", 14)
  second.textColor=new Color("#ffffff")
  second.rightAlignText()
  
  widget.spacing=20
//   作者信息
  let author=widget.addText("-"+str3+"《"+str4+"》")
  author.textColor=new Color("#ffffff")
  author.font=new Font("KaiTi", 9)
  author.rightAlignText()
  
  widget.presentSmall()//Small Medium


Script.setWidget(widget)
Script.complete()