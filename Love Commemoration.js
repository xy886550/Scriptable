// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: heart;
var countDownDate = new Date("Mar 7, 2018 0:00:00").getTime();
var now = new Date().getTime();
var distance = now - countDownDate;
var days = Math.ceil(distance / (1000 * 60 * 60 * 24));

let widget = createWidget(days)
if (config.runsInWidget) {
  Script.setWidget(widget)
  Script.complete()
}
else {
  widget.presentSmall()
}

function createWidget(days) {
  let widget = new ListWidget()
 
  let logo = widget.addText("👩🏻‍❤️‍💋‍👨🏻")
  logo.centerAlignText()
  logo.font = Font.systemFont(40)

  let title = widget.addText("相守已经")
  title.font = Font.regularSystemFont(20);
  title.centerAlignText()
   //light regular medium bold
  let daysText = widget.addText(days.toString(10))
  daysText.font = Font.regularSystemFont(35);
  
 let daysText2 = widget.addText("Days")
 daysText2.font = Font.regularSystemFont(20);
  
  title.centerAlignText()
  daysText.centerAlignText()
  daysText2.centerAlignText()
  
  //make a gradient
  let startColor = new Color("#FFC0CB")
  let endColor = new Color("#FF69B4")
  let gradient = new LinearGradient()
  gradient.colors = [startColor, endColor]
  gradient.locations = [0.0, 1]
  widget.backgroundGradient = gradient
  widget.backgroundColor = new Color("#ff5401")

  return widget
}