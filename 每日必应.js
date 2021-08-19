// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: image;
const url = "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN"
const req = new Request(url)
const res = await req.loadJSON()

//let iurl = new Request(res.images[0].url)
//const imgurl = "`https://cn.bing.com${iurl}`"

//const img = await getImage(`https://cn.bing.com${iurl}`)

let imgurl = "https://img.tjit.net/bing/"
const i = new Request(imgurl)
const img =  await i.loadImage()

let widget = createWidget(res.images[0].copyright, img)
if (config.runsInWidget) {
  Script.setWidget(widget)
  Script.complete()
}
else {
  widget.presentMedium()//Small Medium Large
}

function createWidget(title, img) {
  let w = new ListWidget()
  w.backgroundImage = img
  let titleTxt = w.addText(title)
  titleTxt.textColor = new Color("ffffff")
  titleTxt.font = Font.lightSystemFont(12)
  titleTxt.rightAlignText()
  titleTxt.shadowColor = new Color("000000")
  titleTxt.shadowRadius = 1
  titleTxt.shadowOffset = new Point(0, 0)
  w.setPadding(110, 10, 10, 10)//上左下右
  return w
}