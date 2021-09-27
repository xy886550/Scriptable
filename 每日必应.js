// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: image;
/**
* 版本: 1.0.0
* 更新时间：2021.09.27
*/
const url = "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN"
const req = new Request(url)
const res = await req.loadJSON()
const i = await new Request("https://cn.bing.com" + res.images[0].url)
const img = await i.loadImage()

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
  w.addSpacer()
  let titleTxt = w.addText(title)
  titleTxt.textColor = new Color("ffffff")
  titleTxt.font = Font.lightSystemFont(12)
  titleTxt.rightAlignText()
  titleTxt.shadowColor = new Color("000000")
  titleTxt.shadowRadius = 2
  titleTxt.shadowOffset = new Point(0, 0)
  w.setPadding(12, 12, 12, 12)//上左下右
  return w
}