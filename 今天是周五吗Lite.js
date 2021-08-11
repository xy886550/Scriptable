// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: calendar-alt;
function isFriday(){
  let day=new Date().getDay()
  if(day===5){
    return true
  }else{
    return false
  }
}
const q="今天是周五吗？"

let widget = new ListWidget()
// 以下注释为增加背景图片为bing每日一图，需要背景图片的可以去掉注释
// const url = "https://area.sinaapp.com/bingImg/"
// const i = await new Request(url);
// const img = await i.loadImage();
// widget.backgroundImage=img

let question=widget.addText(q)
// 问题字体大小，可修改
question.font=Font.boldSystemFont(15)
if(isFriday()){
  let answer=widget.addText('是😎')
  // 回答字体大小，可修改
  answer.font=Font.boldSystemFont(60)
  // 回答字体颜色，可修改
  answer.textColor=new Color("#F79709")
}else{
  let answer=widget.addText('不是😶')
  // 回答字体大小，可修改
  answer.font=Font.boldSystemFont(35)
}

Script.setWidget(widget)
Script.complete()