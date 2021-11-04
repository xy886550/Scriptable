// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: apple-alt;

var countDownDate = new Date("Nov 6, 2020 0:00:00").getTime();
var now = new Date().getTime();
var distance = countDownDate - now;
var days = Math.ceil(distance / (1000 * 60 * 60 * 24));

if (config.runsInWidget) {
  let widget = createWidget(days)
  Script.setWidget(widget)
  Script.complete()
}

function createWidget(days) {
  let widget = new ListWidget()
 
  let logo = widget.addText("")
  logo.centerAlignText()
  logo.font = Font.systemFont(40)

  let title = widget.addText("iPhone Day")
  title.font = Font.semiboldSystemFont(20);
  title.centerAlignText()
  
  let daysText = widget.addText(days.toString(10))
  daysText.font = Font.semiboldSystemFont(35);
  
  let daysText2 = widget.addText("days")
  daysText2.font = Font.semiboldSystemFont(20);
  
  title.centerAlignText()
  daysText.centerAlignText()
  daysText2.centerAlignText()
  
  //make a gradient
  let startColor = new Color("#3050cc")
  let endColor = new Color("#050530")
  let gradient = new LinearGradient()
  gradient.colors = [startColor, endColor]
  gradient.locations = [0.0, 1]
  widget.backgroundGradient = gradient
  widget.backgroundColor = new Color("#ff5401")

  return widget
}