// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: sticky-note;
/* #################################
simple sticky note widget
-config:
---background color
------green, red, yellow, blue, #hex
---text size
------small, medium, large

-sparate config and note by: "."

-text note:
---if you want to add more than one poin
---use ", " to sparate each poin

usage: (config).(note)
e.g : medium green. note1, note2, ...
or just note: note1, note2, ...

made by @morinagapltynm
################################# */

let placeholder = "green. Please type your note on the widget parameter"
let input = (args.widgetParameter == null) ? placeholder : args.widgetParameter
let define = input.split(/\.\s(.*)|\.(.*)/)
console.log(define)
let conf = define[0]

let noteColor = Color.black()

// fontSize
if (conf.match(/small/i)){
	fontSize = 16
}else if (conf.match(/medium/i)){
	fontSize = 32
}else if (conf.match(/large/i)){
	fontSize = 45
}else{
	//default
	fontSize = 16
}

// bgColor default is random
color = {
	"green": "C5EA9C",
	"yellow": "FFFFA1",
	"blue": "B1DAE4",
	"red": "FFC2E4",
	"white": "F6F6F7",
	"black": "191919"
}

if (conf.match(/green/i)){
	bgColor = new Color(color.green)
}else if (conf.match(/yellow/i)){
	bgColor = new Color(color.yellow)
}else if (conf.match(/blue/i)){
	bgColor = new Color(color.blue)
}else if (conf.match(/red/i)){
	bgColor = new Color(color.red)
}else if (conf.match(/#/)){
	//custom color
	let prefix = conf.indexOf("#")
	let ctmClr = conf.slice(prefix + 1, prefix + 7)
	bgColor = new Color(ctmClr)
}else if (conf.match(/acent/i)){
	//iOS acent(not working yet due scriptable bug) vote this at automators.fm or dm simon :))
	if(Device.isUsingDarkAppearance()){
		bgColor = new Color(color.black)
		noteColor = new Color(color.white)
	}else{
		bgColor = new Color(color.white)
		noteColor = new Color(color.black)
	}
}else{
	//random as default
	let hex = Object.values(color)
	bgColor = new Color(hex[Math.floor(Math.random() * 4)])
}

// note
if (define.length == 1){
	note = define[0].replace(/, |,/g, "\n• ")
}else{
	note = define[1].replace(/, |,/g, "\n• ")
}

// draw widget
let w = new ListWidget()
w.refreshAfterDate = new Date(Date.now()+1000*60*60*24*30*12)
let text = (note.match("\n") === null) ? w.addText(note) : w.addText("• " + note)
text.font = Font.mediumMonospacedSystemFont(fontSize)
text.textColor = noteColor
w.backgroundColor = bgColor

// run widget
if(!config.runsInWidget){
	w.presentMedium()
}

Script.setWidget(w)
Script.complete()