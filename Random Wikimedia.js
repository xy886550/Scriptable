// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: images;
const url = `https://randomincategory.toolforge.org/Featured_pictures_on_Wikimedia_Commons?server=commons.wikimedia.org&type=file&debug=1`
const req = new Request(url)
const res = await req.loadString()
let titleRegExp = new RegExp("Location: https://commons.wikimedia.org/wiki/(.*)")
let titleMatch = res.match(titleRegExp)
let title = titleMatch[1].replace("<br>", "");
let titleEncoded = encodeURI(title)
let url2 = `https://commons.wikimedia.org/w/api.php?action=query&titles=${titleEncoded}&prop=pageimages&format=json&pithumbsize=500`
const req2 = new Request(url2)
const result = await req2.loadJSON()
var key = Object.keys(result.query.pages)[0]
var imageURL = result.query.pages[key].thumbnail.source
const i = new Request(imageURL);
const img = await i.loadImage();
var imgUrl = "https://commons.wikimedia.org/wiki/"+titleEncoded
let widget = createWidget("", img, imgUrl)
if (config.runsInWidget) {
  Script.setWidget(widget)
  Script.complete()
}
else {
  widget.presentLarge()
}

function createWidget(title, img, widgeturl) {
  let w = new ListWidget()
  w.setPadding(0, 0, 0, 0)
  w.backgroundColor = new Color("#1A1A1A")
  w.url = widgeturl
  w.backgroundImage = img
  return w
}