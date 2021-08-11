// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: gift;
//iOS14限免应用实时展示小组件
//作者：kzddck
//微信公众号：kzddck（康庄科技站）
//更新时间2020.10.09
//开放接口：api.kzddck.com/script/free.json（5分钟检测一次，仅展示一条数据）

let data = await getData()
let widget = await createWidget(data)
if (!config.runsInWidget) {
  await widget.presentLarge()
}
Script.setWidget(widget)
Script.complete()
async function createWidget(data) {
  let appIcon = await loadAppIcon()
  let title = "iOS限免"
  let w = new ListWidget()
  w.url = data["url"]
  w.backgroundColor = new Color("#b00a0fb3")
// 显示图标和标题
  w.addSpacer(2)
  let titleStack = w.addStack()
  let appIconElement = titleStack.addImage(appIcon)
  appIconElement.imageSize = new Size(15, 15)
  appIconElement.cornerRadius = 4
  titleStack.addSpacer(4)
  let titleElement = titleStack.addText(title)
  titleElement.textColor = Color.white()
  titleElement.textOpacity = 0.7
  titleElement.font = Font.mediumSystemFont(12)
  w.addSpacer(5)
// 标题
  var dates =  data["name"]
  let date1 = w.addText(dates)
  date1.font = Font.semiboldSystemFont(15)
  date1.centerAlignText()
  date1.textColor = Color.white()
  w.addSpacer(5)
// 类型
  let date2 = w.addText(data["class"])
  date2.font = Font.heavySystemFont(10)
  date2.centerAlignText()
  date2.textColor =Color.white()
  w.addSpacer(2)
// 价格
  let date3 = w.addText(data["price"])
  date3.font = Font.heavySystemFont(10)
  date3.centerAlignText()
  date3.textColor =Color.white()
  w.addSpacer(2)
// 介绍
  let body = w.addText(data["content"])
  body.font = Font.mediumRoundedSystemFont(8)
  body.textColor = Color.white()
  body.textOpacity = 0.7
  w.addSpacer(20)
// 图片
  let bg =await getImage(data["img"])
  w.backgroundImage = await shadowImage(bg)
// 底部更多
if (!config.runsWithSiri) {
  w.addSpacer(2)
  // Add button to open documentation
  let linkSymbol = SFSymbol.named("arrow.up.forward")
  let footerStack = w.addStack()
  let linkStack = footerStack.addStack()
  linkStack.centerAlignContent()
  linkStack.url = "http://xianmian.kzddck.com"
  let linkElement = linkStack.addText("查看历史")
  linkElement.font = Font.mediumSystemFont(8)
  linkElement.textColor = Color.white()
  linkElement.textOpacity = 0.7
  linkStack.addSpacer(1)
  let linkSymbolElement = linkStack.addImage(linkSymbol.image)
  linkSymbolElement.imageSize = new Size(8, 8)
  linkSymbolElement.tintColor = Color.white()
  linkSymbolElement.textOpacity = 0.7
  footerStack.addSpacer()
  // Add link to documentation
  let docsSymbol = SFSymbol.named("square.and.arrow.down.on.square.fill")
  let docsElement = footerStack.addImage(docsSymbol.image)
  docsElement.imageSize = new Size(8, 8)
  docsElement.tintColor = Color.white()
  docsElement.textOpacity = 0.7
  docsElement.url = data["url"]
}
  return w
}
async function getData() {
  var url = "https://api.kzddck.com/script/free.json";
  var req = new Request(url)
  var data = await req.loadJSON()
  return data
}
async function getImage (url) {
  let r =await new Request(url)
  return await r.loadImage()
}
async function shadowImage (img) {
  let ctx = new DrawContext()
  ctx.size = img.size
  ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
  ctx.setFillColor(new Color("#646464", 0.5))
  ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
  let res = await ctx.getImage()
  return res
}

async function loadAppIcon() {
  let url = "https://api.kzddck.com/script/freeapp.png"
  let req = new Request(url)
  return req.loadImage()
}