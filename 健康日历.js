// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: dumbbell;
// 健康日历，适用于最小尺寸的桌面小组件，数据来自丁香园
const url = "https://dxy.com/app/i/ask/discover/todayfeed/healthcalendar"
const req = new Request(url)
const res = await req.loadJSON()
const i = new Request(res.data.items[0].pic_url)
const img = await i.loadImage()

let widget = createWidget(res.data.items[0].title, img)
if (config.runsInWidget) {
  Script.setWidget(widget)
  Script.complete()
}
else {
  widget.presentSmall()
}

function createWidget(title, img) {
  let w = new ListWidget()
  w.backgroundImage = img
  let titleTxt = w.addText("“" + title + "”")
  titleTxt.textColor = new Color("#1A1A1A")
  titleTxt.font = Font.boldSystemFont(18)
  titleTxt.centerAlignText()
  w.setPadding(0, 0, 75, 0)
  return w
}