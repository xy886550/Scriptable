// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: calendar-check;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: calendar-alt;
let fm = FileManager.iCloud()
let scriptPath = fm.documentsDirectory()+'/UpcomingIndicator/'
let settingsPath = scriptPath+'settings.json'
const reRun = URLScheme.forRunningScript()
if(!fm.fileExists(scriptPath))fm.createDirectory(scriptPath, false)
let needUpdated = await updateCheck(1.8)
//log(needUpdated)
/*--------------------------
|------version notes------
1.8
- removed (commented out) size restriction in the code for the left and right widget stack (main level)
- add optional line separator between calendar day name and the rest of the calendar
- slight adjustment of color dot size and spacing
- add option for heatmap style
- modified the heat map to be based on completed reminders for a soecific list as defined in the widget parameter (i.e. "|Reminders") or if you just want to see the right side (e.g. "right|Reminders")
- update the reminder URL to be x-apple-reminderkit:// instead of x-apple-reminder:// (this was a recent change Apple made)
- needed to make adjustments for the calendar date alignment dus to some unforeseen differences in monday vs sunday start of the week
--------------------------*/
/*
####################
####################
begin building user
pref file
####################
####################
*/
let a,settings = {}

if(fm.fileExists(settingsPath)){
  settings = JSON.parse(fm.readString(settingsPath))

}
let set = await setup()

if(!config.runsInWidget && fm.fileExists(settingsPath) && !JSON.parse(fm.readString(settingsPath)).quickReset){
    let resetQ = new Alert()
    resetQ.title='Want to reset?'
    resetQ.message='If you tap "Yes" below, the settings for this widget will be reset and setup will run again'  
    resetQ.addAction('Yes')
    resetQ.addAction('No')
    a = await resetQ.presentSheet()
    if(a==0){
      fm.remove(settingsPath)
      Safari.open(reRun)
      throw new Error('running again now')
    }
}

settings = JSON.parse(fm.readString(settingsPath))
if(settings.quickReset)
{  
  settings.quickReset=false  
  log(settings)
  fm.writeString(settingsPath, JSON.stringify(settings))
}



/*
####################
####################
end building user
pref file
####################
####################
*/


/*
####################
####################
start of user definition - no longer needed as manuak entry as it is handled in setup questions
####################
####################
*/

//calendar names are included in thr cal variable belowto display them in the list of calendar events and the indicators on the month view. These must be enclosed in single or double quotes. (this is handled by the setup questions)

const cal = settings.cals

//set the flag for allowDynamicSpacing to true if you want extra soacing between the events in the left side event list if there are less than 5. If you don't want the dynamic spacing, set to false. 

const allowDynamicSpacing = settings.dynamicSpacing

//set the flag for monWeekStart to true if you want Monday to be the start of the week in the month view. If  you rather Sunday be the start of the week, then set to false.

const monWeekStart = settings.monStart

//set the useBackgroundColor flag to true to utilize the backgroundColor variable below. This can be set per your liking.

const useBackgroundColor = settings.useBackgroundColor

//backgroundColor below is setup as darkGray ny default but can be changed to hex as well

if(settings.useBackgroundColor){const backgroundColor = new Color(settings.backgroundColor)}

//useTransparency is setup during initialization questions. This determines if the transparency setting should be used or not
const useTransparency = settings.useTransparency

//useEventShadow is setup during initialization questions. This determines if the event name should have a shadow behind it to help with readability in some situations
const useEventShadow = settings.useEventShadow
let shadowColorLight,shadowColorDark
if (useEventShadow)
{
  shadowColorLight = '#'+settings.shadowColorLight
  shadowColorDark = '#'+settings.shadowColorDark
}
//eventFontSize sets the size of the event title to be displayed in the left side view. Default is 11.
const eventFontSize = settings.eventFontSize

//showCurrentAllDayEvents enables the ability to show an event that is happening today and is set as all day
const showCurrentAllDayEvents = settings.showCurrentAllDayEvents

//showReminders is the determining factor to show reminders in the event list or not
const showReminders = settings.showReminders

//showCalendarColorEventList is to display the event name in the calendar color
const showCalendarColorEventList = settings.showCalendarColorEventList

//useBaseTextColor is setup during initialization questions. This determines if the base text should have a different color than the default (black in light mode and white in dark mode) to help for rendering depending on your setup (mainly if you use transparency and have a photo that causes the text to not be readable)
const useBaseTextColor = settings.useBaseTextColor
let baseTextColorLight,baseTextColorDark
if (useBaseTextColor)
{
  baseTextColorLight = '#'+settings.baseTextColorLight
  baseTextColorDark = '#'+settings.baseTextColorDark
}

//use24hrTime is a setup question which allows the user to display the event times in a 24hr format instead of 12hr format
const use24hrTime = settings.use24hrTime

//useSundayColor is a setup question which allows a user definable color to be used for the sunday date in the month view
const useSundayColor = settings.useSundayColor
let sundayColor
if(useSundayColor)sundayColor= '#'+settings.sundayColor

//useSaturdayColor is a setup question which allows a user definable color to be used for the saturday date in the month view
const useSaturdayColor = settings.useSaturdayColor
let saturdayColor
if(useSaturdayColor)saturdayColor= '#'+settings.saturdayColor

//useLineSeparator is a setup question which allows the user to choose whether or not to display a line separating the day names with the rest of the calendar
const useLineSeparator = settings.useLineSeparator

//heatMapEnabled is a bit self explanitory, but this flag enables the heat map feature
let heatMapEnabled = settings.heatMapEnabled

//heatMapColor determines the base comor to use as the heat map color
let heatMapColor = settings.heatMapColor

//heatMapMax determines the number of events in a given day to show as the full color
let heatMapMax = settings.heatMapMax

//For more info see the github page.
/*
####################
####################
end of user definition
####################
####################
*/
let widg,l,r,remList,widg1,h = 5

if(args.widgetParameter){
  widg1=args.widgetParameter
  //widg1='|Reminders'
  let reg = /(right|left)/
  if(reg.test(widg1)) {
    widg = widg1.match(reg)[1]
  }else{
    r=true
    l=true
  }
  reg = /\|(.*)/
  if(reg.test(widg1))remList = widg1.match(reg)[1]
}else{
  r=true
  l=true
}
let indexed = 0

var widgFam = config.widgetFamily

var eventCounter=0
let w = new ListWidget()
const currentDayColor = "#000000";
let textColor = "#ffffff";
const textRed = "#ec534b";
  
let dF = new DateFormatter()

dF.dateFormat='ZZ'
let tZOffsetSec = (dF.string(new Date())/100)*60*60
let dHolder,later

let main = w.addStack()
if (widg=='right')r=true
if (widg=='left')l=true
if(l){
  var left = main.addStack()
  //if(widgFam!='large')left.size=new Size(0, 135) 
  left.layoutVertically()  
}
if(r && l)main.addSpacer()
if(r)
{  
  var right = main.addStack()   
  //if(widgFam!='large')right.size=new Size(0, 135)
  right.layoutVertically()
  var mthStack = right.addStack()
  mthStack.layoutVertically()
}
if (l)  await CalendarEvent.thisWeek().then(successCallback, failureCallback)
if (r) await createWidget();
if(useBackgroundColor)w.backgroundColor=new Color(settings.backgroundColor)

if(useTransparency && widgFam!='large'){
const RESET_BACKGROUND = !config.runsInWidget
const { transparent } = importModule('no-background')
w.backgroundImage = await transparent(Script.name(), RESET_BACKGROUND)
}

Script.setWidget(w)
Script.complete()
if(widgFam=='large'){
  w.presentLarge()
}else{
  w.presentMedium()
}


/*
####################
####################
begin function section
####################
####################
*/

async function setup(full){
  
  let quests = [{'key':'dynamicSpacing','q':'Do you want to enable dynamic spacing of the events in the left events view? 您要启用左侧事件视图中事件的动态间距吗?'},{'key':'monStart','q':'Do you want the week to start on Monday in the right month view?你想在每周从周一开始吗？'},{'key':'useBackgroundColor','q':'Do you want to use a backgroundColor different than the default white / black based on iOS appearance?您想使用与基于 iOS 外观的默认白色/黑色不同的背景颜色吗？'},{'key':'useTransparency','q':'Do you want to use the no-background.js transparency module?你想使用无背景.js 透明度模块吗？'},{'key':'showCurrentAllDayEvents','q':'Do you want to show "All Day" events that are happening today?你想展示今天发生的“全天”事件吗？'},{'key':'showReminders','q':'Do you want to display reminders with the events in the left side event list?你想在左侧事件列表中显示事件的提醒吗？'},{'key':'use24hrTime','q':'Do you want to show the time in a 24hr format instead of 12hr?你想以 24 小时而不是 12 小时的形式显示时间吗？'},{'key':'showCalendarColorEventList','q':'Do you want to display the event name in the color of the calendar for which it belongs?你想在它所属的日历颜色中显示事件名称吗？'},{'key':'useLineSeparator','q':'Do you want to display a line separator between the day name and the rest of the calendar dates?你想在月份与日期之间显示行分隔线吗？'},{'key':'useBaseTextColor','q':'Do you want to change the base text color (text color used for the event times and the calendar month view)?你想更改基本文本颜色（用于事件时间和日历月视图的文本颜色）吗？'},{'key':'useSundayColor','q':'Do you want to change the text color for Sunday in the month view?你想在月视图中更改周日的文本颜色吗？'},{'key':'useSaturdayColor','q':'Do you want to change the text color for Saturday in the month view?你想在月视图中更改周六的文本颜色吗？'},{'key':'useEventShadow','q':'Do you want to show a shadow under the event name in the event list on the left of the widget (this helps for readability)?您想在小部件左侧的事件列表中显示事件名称下的阴影（这有助于可读性）吗？'},{'key':'heatMapEnabled','q':'Do you want to enable the heat map feature?你想启用热图功能吗？'}]

  await quests.reduce(async (memo,i)=>{
    await memo
    //log(`${i.key} is in settings? ${i.key in settings}`)

    if(!(i.key in settings)){
      let q = new Alert()
      q.message=String(i.q)
      q.title='Setup'
      q.addAction('Yes')
      q.addAction('No')
      a=await q.presentSheet()
      settings[i.key]=(a==0)?true:false
    }
  },undefined)  
    if (settings.useEventShadow)
    {
      if (!('shadowColorLight' in settings)){
        let shadowColorLight = new Alert()
        shadowColorLight.title = 'shadowColor Setup'
        shadowColorLight.message = 'What color shadow would you like to utilize behind the text in the event list while in light mode?'
        shadowColorLight.addAction('White')
        shadowColorLight.addAction('Black')
        shadowColorLight.addAction('Green')
        shadowColorLight.addAction('Red')
        shadowColorLight.addAction('Blue')
        let sColorLight = await shadowColorLight.presentSheet()
        switch (sColorLight){
          case 0:
            settings.shadowColorLight=Color.white().hex
            break
          case 1:
            settings.shadowColorLight=Color.black().hex
            break
          case 2:
            settings.shadowColorLight=Color.green().hex
            break
          case 3:
            settings.shadowColorLight=Color.red().hex
            break
          case 4:
            settings.shadowColorLight=Color.blue().hex
            break
          default:
            settings.shadowColorLight=Color.black().hex
            break
        }
      
      
        let shadowColorDark = new Alert()
        shadowColorDark.title = 'shadowColor Setup'
        shadowColorDark.message = 'What color shadow would you like to utilize behind the text in the event list while in dark mode?在黑暗模式下，您希望在事件列表中使用什么颜色阴影？'
        shadowColorDark.addAction('White')
        shadowColorDark.addAction('Black')
        shadowColorDark.addAction('Green')
        shadowColorDark.addAction('Red')
        shadowColorDark.addAction('Blue')
        let sColorDark = await shadowColorDark.presentSheet()
        switch (sColorDark){
            case 0:
              settings.shadowColorDark=Color.white().hex
              break
            case 1:
              settings.shadowColorDark=Color.black().hex
              break
            case 2:
              settings.shadowColorDark=Color.green().hex
              break
            case 3:
              settings.shadowColorDark=Color.red().hex
              break
            case 4:
              settings.shadowColorDark=Color.blue().hex
              break
            default:
              settings.shadowColorDark=Color.black().hex
              break
        }
      }
    }
    
    if (settings.useBaseTextColor)
    {
      if (!('baseTextColorLight' in settings)){
        let baseTextColorLight = new Alert()
        baseTextColorLight.title = 'baseTextColor Setup'
        baseTextColorLight.message = 'What color baseText would you like to use while in light mode?您希望在光模式下使用什么文字底色？'
        baseTextColorLight.addAction('White')
        baseTextColorLight.addAction('Black')
        baseTextColorLight.addAction('Green')
        baseTextColorLight.addAction('Red')
        baseTextColorLight.addAction('Blue')
        let fColorLight = await baseTextColorLight.presentSheet()
        switch (fColorLight){
          case 0:
            settings.baseTextColorLight=Color.white().hex
            break
          case 1:
            settings.baseTextColorLight=Color.black().hex
            break
          case 2:
            settings.baseTextColorLight=Color.green().hex
            break
          case 3:
            settings.baseTextColorLight=Color.red().hex
            break
          case 4:
            settings.baseTextColorLight=Color.blue().hex
            break
          default:
            settings.baseTextColorLight=Color.black().hex
            break
        }
        
        let baseTextColorDark = new Alert()
        baseTextColorDark.title = 'baseTextColor Setup'
        baseTextColorDark.message = 'What color baseText would you like to use while in dark mode?您希望在黑暗模式下使用什么文字底色？'
        baseTextColorDark.addAction('White')
        baseTextColorDark.addAction('Black')
        baseTextColorDark.addAction('Green')
        baseTextColorDark.addAction('Red')
        baseTextColorDark.addAction('Blue')
        let fColorDark = await baseTextColorDark.presentSheet()
        switch (fColorDark){
            case 0:
              settings.baseTextColorDark=Color.white().hex
              break
            case 1:
              settings.baseTextColorDark=Color.black().hex
              break
            case 2:
              settings.baseTextColorDark=Color.green().hex
              break
            case 3:
              settings.baseTextColorDark=Color.red().hex
              break
            case 4:
              settings.baseTextColorDark=Color.blue().hex
              break
            default:
              settings.baseTextColorDark=Color.black().hex
              break
        }
      }
    }
    
    if(settings.useBackgroundColor)
    {
      if (!('backgroundColor' in settings)){
        let q = new Alert()
        q.title='What color?'
        q.message='Please enter the hex color value to use as the background color of the widget (e.g. #FFFFFF)请输入十六进制颜色值，用作小部件的背景颜色'   
        q.addTextField('hex color', '#')
        q.addAction("Done")
        await q.present()
        settings.backgroundColor = q.textFieldValue(0)
        //write the settings to iCloud Drive  
        fm.writeString(settingsPath, JSON.stringify(settings))    
      }
    }
    
    if (!('eventFontSize' in settings)){
      let eventFontS = new Alert()
      eventFontS.title='eventFontSize Setup'
      eventFontS.message='What font size should the event list be shown as?事件列表应显示为什么字体大小？'
      eventFontS.addAction('Small')
      eventFontS.addAction('Normal')
      eventFontS.addAction('Large')
      
      let aa = await eventFontS.presentSheet()
      switch(aa){
        case 0:
          settings.eventFontSize=82/100
          break
        case 1:
          settings.eventFontSize=1
          break
        case 2:
          settings.eventFontSize=118/100
          break
      }
    }
    //log(settings)
    
      if (settings.useSundayColor)
    {
      if (!('sundayColor' in settings)){
        let sundayCol = new Alert()
        sundayCol.title = 'sundayColor Setup'
        sundayCol.message = 'What color would you like to show for Sunday in the month view?你想在月历中周日用什么颜色？'
        sundayCol.addAction('White')
        sundayCol.addAction('Black')
        sundayCol.addAction('Green')
        sundayCol.addAction('Red')
        sundayCol.addAction('Blue')
        let sunCol = await sundayCol.presentSheet()
        switch (sunCol){
          case 0:
            settings.sundayColor=Color.white().hex
            break
          case 1:
            settings.sundayColor=Color.black().hex
            break
          case 2:
            settings.sundayColor=Color.green().hex
            break
          case 3:
            settings.sundayColor=Color.red().hex
            break
          case 4:
            settings.sundayColor=Color.blue().hex
            break
          default:
            settings.sundayColor=Color.black().hex
            break
        }
      }
    }
    
        if (settings.useSaturdayColor)
    {
      if (!('saturdayColor' in settings)){
        let saturdayCol = new Alert()
        saturdayCol.title = 'saturdayColor Setup'
        saturdayCol.message = 'What color would you like to show for Saturday in the month view?你想在月历中周六用什么颜色？'
        saturdayCol.addAction('White')
        saturdayCol.addAction('Black')
        saturdayCol.addAction('Green')
        saturdayCol.addAction('Red')
        saturdayCol.addAction('Blue')
        let satCol = await saturdayCol.presentSheet()
        switch (satCol){
          case 0:
            settings.saturdayColor=Color.white().hex
            break
          case 1:
            settings.saturdayColor=Color.black().hex
            break
          case 2:
            settings.saturdayColor=Color.green().hex
            break
          case 3:
            settings.saturdayColor=Color.red().hex
            break
          case 4:
            settings.saturdayColor=Color.blue().hex
            break
          default:
            settings.saturdayColor=Color.black().hex
            break
        }
      }
    }
    
    
        if (settings.heatMapEnabled)
    {
      if (!('heatMapColor' in settings)){
        let heatMapCol = new Alert()
        heatMapCol.title = 'heatMapColor Setup'
        heatMapCol.message = 'What color would you like to use for the heat map in the month view?您想在月视图中的热图中使用什么颜色？'
        heatMapCol.addAction('White')
        heatMapCol.addAction('Black')
        heatMapCol.addAction('Green')
        heatMapCol.addAction('Red')
        heatMapCol.addAction('Blue')
        let heatCol = await heatMapCol.presentSheet()
        switch (heatCol){
          case 0:
            settings.heatMapColor=Color.white().hex
            break
          case 1:
            settings.heatMapColor=Color.black().hex
            break
          case 2:
            settings.heatMapColor=Color.green().hex
            break
          case 3:
            settings.heatMapColor=Color.red().hex
            break
          case 4:
            settings.heatMapColor=Color.blue().hex
            break
          default:
            settings.heatMapColor=Color.black().hex
            break
        }
      }
      
      if (!('heatMapMax' in settings)){
        let heatMax = new Alert()
        heatMax.title = 'heatMapColor Setup'
        heatMax.message = 'What color would you like to use for the heat map in the month view?您想在月视图中的热图中使用几种颜色？'
        heatMax.addAction('1')
        heatMax.addAction('2')
        heatMax.addAction('3')
        heatMax.addAction('4')
        heatMax.addAction('5')
        heatMax.addAction('6')
        heatMax.addAction('7')
        heatMax.addAction('8')
        heatMax.addAction('9')
        heatMax.addAction('10')
        let heatM = await heatMax.presentSheet()
        settings.heatMapMax = heatM+1
      }
    }
    
    //settings['cal']=[]
    //log('settings is now:\n'+settings)
    //write the settings to iCloud Drive
    fm.writeString(settingsPath, JSON.stringify(settings))
    
    //log(settings)
    
    if (!('cals' in settings)){
      let cal = []
      calP=new Alert()
      calP.message='In the next screen, please select the calendars to display in the widget在下一屏，请选择要显示在小部件中的日历'
      calP.addAction('OK')
      await calP.present()
      await Calendar.presentPicker(true).then((cals)=>{
          
        cals.forEach((f)=>{
          cal.push(f.title)
        })
      })
      
      settings['cals'] = cal
    
      settings['quickReset']=true
      fm.writeString(settingsPath, JSON.stringify(settings))  
    }
  
//   Safari.open(reRun)
//   throw new Error('running again')    
  return true
}




async function createWidget() {  
  // opacity value for weekends and times
  const opacity = 6/10;  
  const oDate = new Date(2001,00,01).getTime(),date = new Date();   
//   if(useTransparency) {
//      let diff = ((new Date(date.getFullYear(),date.getMonth(),date.getDate())-oDate)/1000)
//      diff=Number(diff)-tZOffsetSec
//      right.url='calshow:'+diff
//   }
  dF.dateFormat = "MMMM";
  // Current month line
  const monthLine = mthStack.addStack();
//   monthLine.borderColor=Color.black()
//   monthLine.borderWidth=1
//   mthStack.borderColor=Color.black()
//   mthStack.borderWidth=1
  monthLine.addSpacer(5);//2
  addWidgetTextLine(monthLine, dF.string(date).toUpperCase() + (needUpdated? ' Update' : ''), {
    color:'#ec534b', //textRed,月份颜色 空
    textSize: 12,
    font: Font.boldSystemFont(13),//12
  });

  const calendarStack = mthStack.addStack();
  calendarStack.spacing = -1;//日期间距 -1

  const month = buildMonthVertical();
//   log(month)
  for (let i = 0; i < month.length; i += 1) {
    let weekdayStack = calendarStack.addStack();
    weekdayStack.layoutVertically();

    for (let j = 0; j < month[i].length; j += 1) {
      //log(`j val is ${j} and i val is ${i}, current value is ${month[i][j]}`)
      let dateStack = weekdayStack.addStack();   
      let dateStackUp = dateStack.addStack()
      dateStackUp.size = new Size(22,14);
      //✨✨✨日子显示大小/选中大小 //22,15
      dateStackUp.centerAlignContent();   
      dateStack.size = new Size(21.5,18);
      //🌟🌟🌟日期间距:左右间距/上下间距 //22,21
      if (month[i][j] === date.getDate().toString()) {
        const highlightedDate = getHighlightedDate(
          date.getDate().toString(),
          currentDayColor
        );
        dateStackUp.addImage(highlightedDate);
      }else{
        let sat,sun
        if (monWeekStart){
          sat = 5
          sun = 6
        }else{
          sat = 6
          sun = 0
        }
        textColor=""
        if(i==sat)textColor=saturdayColor
        if(i==sun)textColor=sundayColor
        addWidgetTextLine(dateStackUp, `${month[i][j]}`,
        {
          color: '',//textColor,
          opacity: (i == sat || i == sun) ? opacity : 1,
          font: Font.mediumSystemFont(10),
          align: "center",
        });
      }
      
      //if (!useTransparency && !isNaN(month[i][j])){   
      if (!isNaN(month[i][j])){   
          const nDate = new Date(date.getFullYear(),date.getMonth(),month[i][j])
        let diff = ((nDate-oDate)/1000)
        diff=Number(diff)-tZOffsetSec
        dateStack.url='calshow:'+diff
      }
      let colorDotStack = dateStack.addStack()
      colorDotStack.size=new Size(22.5,4)
      //🌟🌟🌟热图小圆点位置 //22,5
      dateStack.layoutVertically()
      colorDotStack.layoutHorizontally() 
      let yr = date.getFullYear()
      let mth = date.getMonth()
      let dots = [],colors=[]
      if(j==0 && useLineSeparator){
        let lineImg = colorDotStack.addImage(lineSep())
        lineImg.size = new Size(22, 1)
        let tColor=Color.dynamic(Color.black(), Color.white())
if(useBaseTextColor)tColor=Color.dynamic(new Color(baseTextColorLight), new Color(baseTextColorDark))
        lineImg.tintColor=tColor
      }
      if (Number(month[i][j])) {
        let st = new Date(yr,mth,month[i][j],0,0)
        let fn = new Date(yr,mth,month[i][j],23,59)

        let events = await CalendarEvent.between(st, fn)
        //start reminder list check开始提醒列表检查

        if (remList){
          let list = await Calendar.forRemindersByTitle(remList)
          let rem = await Reminder.completedBetween(st, fn, [list])
          let ratio = rem.length/heatMapMax
          if (ratio > 1)ratio=1
          dateStackUp.backgroundColor= new Color(heatMapColor, ratio)
        }
        //end reminder list check结束提醒列表检查

        if (events.length>0){       
//           if (heatMapEnabled){
//             let ratio = events.length/heatMapMax
//             if (ratio > 1)ratio=1
//             dateStackUp.backgroundColor= new Color(heatMapColor, ratio)
//           }
          events.forEach((kk,index)=>{ 
           if(cal.includes(kk.calendar.title)){
            if(index<=5){
              if(!colors.includes(kk.calendar.color.hex)){
               colors.push(kk.calendar.color.hex)
              }
            }
           }
          })
          if(colors.length>0){
            let colorDotsImg=colorDots(colors)
            colorDotStack.addSpacer()  
            let colDotsImg = colorDotStack.addImage(colorDotsImg)  
            colDotsImg.resizable=true
            colDotsImg.imageSize=new Size(22,2)
            //🌟🌟🌟热图小圆点占用面积/大小 //22,3
            colDotsImg.centerAlignImage()
            colorDotStack.addSpacer()
          }
        }
      }
    }
  }
}

/**
 * Creates an array of arrays, where the inner arrays include the same weekdays创建一个数组，其中内部数组包含相同的工作日
 * along with an identifier in 0 position
 * [
 *   [ 'M', ' ', '7', '14', '21', '28' ],
 *   [ 'T', '1', '8', '15', '22', '29' ],
 *   [ 'W', '2', '9', '16', '23', '30' ],
 *   ...
 * ]
 *
 * @returns {Array<Array<string>>}
 */
function buildMonthVertical() {
  const date = new Date();  
  const firstDayStack = new Date(date.getFullYear(), date.getMonth(), 1)//monWeekStart?1:2);
  const lastDayStack = new Date(date.getFullYear(), date.getMonth() + 1, 0);  
  let month,forLoopFirstDay
  if(!monWeekStart){
    month = [["日"],["一"], ["二"], ["三"], ["四"], ["五"], ["六"]];

    forLoopFirstDay=firstDayStack.getDay()  
    
  }else{
    month = [["一"], ["二"], ["三"], ["四"], ["五"], ["六"],["日"]];

    forLoopFirstDay=firstDayStack.getDay()-1
    
  }
  let dayStackCounter = 0;

  for (let i = 1; i <= forLoopFirstDay; i += 1) {
    month[i - 1].push(" ");
    dayStackCounter = (dayStackCounter +1) % 7;
  }

  for (let date = 1; date <= lastDayStack.getDate(); date += 1) {
    month[dayStackCounter].push(`${date}`);
    dayStackCounter = (dayStackCounter + 1) % 7;
  }

  const length = month.reduce(
    (acc, dayStacks) => (dayStacks.length > acc ? dayStacks.length : acc),
    0
  );
  month.forEach((dayStacks, index) => {
    while (dayStacks.length < length) {
      month[index].push(" ");
    }
  });  

  return month;
}

/**
 * Draws a circle with a date on it for highlighting in calendar view在日历视图中画一个带有日期的圆圈进行高亮显示
 *
 * @param  {string} date to draw into the circle
 *
 * @returns {Image} a circle with the date
 */

function getHighlightedDate(date) {
  const drawing = new DrawContext();
  drawing.respectScreenScale = true;
  const size = 50;
  drawing.size = new Size(size, size);
  drawing.opaque = false;
  drawing.setFillColor(new Color('#ec534b'));
  drawing.fillEllipse(new Rect(1, 1, size - 2, size - 2));
  drawing.setFont(Font.boldSystemFont(30));
  drawing.setTextAlignedCenter();
  drawing.setTextColor(new Color("#ffffff"));
  drawing.drawTextInRect(date, new Rect(0, 5, size, size));
  const currentDayImg = drawing.getImage();
  return currentDayImg;
}

/*
 * Adds a event name along with start and end times to widget stack将事件名称以及开始和结束时间添加到小部件堆叠
 * @param  {WidgetStack} stack - onto which the event is added
 * @param  {CalendarEvent} event - an event to add on the stack
 * @param  {number} opacity - text opacity
 */

function addWidgetTextLine(
  widget,
  text,
  {
    color,
    textSize = 12,
    opacity = 1,
    align,
    font = "",
    lineLimit = 0,
  }
) {
  let textLine = widget.addText(text);
  if (typeof font === "string") {
    textLine.font = new Font(font, textSize);
  } else {
    textLine.font = font;
  }
  textLine.textOpacity = opacity;
  if(color)textLine.textColor=new Color(color)
if(useBaseTextColor)textLine.textColor=Color.dynamic(new Color(baseTextColorLight), new Color(baseTextColorDark))

}

async function successCallback(result) {
  calcal=result
  await CalendarEvent.nextWeek().then((res) => {
    newCalArray = res
  })
  if(showReminders){
    remin = await Reminder.allDueThisWeek()
    reminNext=await Reminder.allDueNextWeek()
    newCalArray = mergeArrays(calcal,newCalArray,remin,reminNext)
  }else{
    newCalArray = mergeArrays(calcal,newCalArray)
  }
  newCalArray=JSON.stringify(newCalArray).replace(/dueDate/g, 'startDate')
  
  newCalArray=JSON.parse(newCalArray)
// Sort array by date in ASCENDING order
  newCalArray.sort(function (a, b) {
    if (a.startDate > b.startDate) return 1;
    if (a.startDate < b.startDate) return -1;
    return 0;
  });
  newCalArray.forEach(eventCount)

  newCalArray.forEach(f)
}


function mergeArrays(...arrays) { 
  let mergedArray = []; 
  arrays.forEach(array => { 
    mergedArray.push(...array) 
  }); 
  return mergedArray; 
} 
    
async function failureCallback(error) {
  console.error("Error generating calendar data: " + error);
}

function eventCount(item){
  let now = new Date()
  if (item.startDate > 0){
    if (item.startDate.getTime() > now.getTime() || (showCurrentAllDayEvents?(item.startDate.getDate()==now.getDate() &&  item.isAllDay):false))  
    {
      if(cal.includes(item.calendar.title)){
        eventCounter +=1
      }      
    }  
  }else if (item.dueDate > 0){
    if (item.dueDate.getTime() > now.getTime())  
    {
      if(cal.includes(item.calendar.title))
      {
        eventCounter +=1
      }      
    }  
  }
}


function f(item){
  eventDisplay = (eventFontSize>1)?3 : 5
  if(widgFam=='large')eventDisplay=eventDisplay*3
  const date = new Date(); 
  let isCalEvent
  if('endDate' in item){
    isCalEvent=true
  }else{
    isCalEvent=false
  }  
//   log(item.startDate)
  dF.dateFormat='yyyy-MM-dd HH:mm:ss.SSSZ'
  let dateString = item.startDate.toString()
  dateString=dateString.replace('T', ' ')
//   log(dateString)
  item.startDate = dF.date(dateString)
  if(isCalEvent){
    dateString=item.endDate.toString()
    dateString=dateString.replace('T',' ')
    item.endDate = dF.date(dateString)
  }
//   log(item.startDate+'\n'+isCalEvent?item.endDate:'')
//   log(item)
  if(item.startDate > 0)
  {
  if (item.startDate.getTime() > date.getTime() || (isCalEvent && showCurrentAllDayEvents?(item.startDate.getDate()==date.getDate() &&  item.isAllDay):false))
    {
      if(cal.includes(item.calendar.title) || !isCalEvent)
      {
        indexed+=1  
        if(!allowDynamicSpacing)eventCounter=null
        switch (eventCounter) {
          case 1:
          case 2:
          case 3:
            spacer = null
            break;
          case 4:
            spacer = 3
            break;
          default:
            spacer = 0
            break;
        }
        if(indexed <= eventDisplay)
        {      
          const oDate = new Date(2001,00,01).getTime()
          dF.dateFormat='MM月dd日'
          let dd = item.startDate
          let ddd=dF.string(dd)
        if((widgFam=='large' && indexed<=(eventDisplay*(2/3)))|| widgFam!='large'){
          if(!dHolder && dF.string(date)==ddd)         
          {
            let when = left.addText(' TODAY ')
           when.font=Font.heavyMonospacedSystemFont(8*eventFontSize)
if(useBaseTextColor)when.textColor=Color.dynamic(new Color(baseTextColorLight), new Color(baseTextColorDark))

          }else if(ddd!=dHolder && !later){
            left.addSpacer(2)//提醒上边距2
            let when = left.addText(' LATER ')
            when.font = Font.heavyMonospacedSystemFont(8*eventFontSize)
if(useBaseTextColor)when.textColor=Color.dynamic(new Color(baseTextColorLight), new Color(baseTextColorDark))

            later = true
          }
          var stack = left
        }else{
          var stack = right
        }
          //let s = stack.addStack()
          
          dHolder = ddd
          let tx = stack.addText((isCalEvent?'':item.isCompleted?'☑':'☐')+item.title)
          tx.font= Font.boldMonospacedSystemFont(11*eventFontSize)
          tx.lineLimit=2
          if(showCalendarColorEventList)tx.textColor= new Color(item.calendar.color.hex)
          if(useEventShadow){
            //add a shadow
            tx.shadowRadius=4
            //shadow color for the calendar event title
            tx.shadowColor=Color.dynamic(new Color(shadowColorLight), new Color(shadowColorDark))  
          }
          dF.dateFormat='EEE'
          let eee = dF.string(dd)        
          let dt = eee+' '+ddd+' '
          if(!item.isAllDay){
            dF.dateFormat=use24hrTime?'HH:mm':'h:mma'
            let sAndFTimes = isCalEvent?dF.string(item.startDate)+'-'+dF.string(item.endDate):dF.string(item.startDate)
            dt = dt + sAndFTimes
          }
          dt = stack.addText(dt)
          dt.font=Font.systemFont(8*eventFontSize)
          if(useBaseTextColor)dt.textColor=Color.dynamic(new Color(baseTextColorLight), new Color(baseTextColorDark))

          const nDate = item.startDate.getTime()
          var diff = ((nDate-oDate)/1000)
          diff=Number(diff)-tZOffsetSec
          tx.url=isCalEvent?"calshow:"+diff:"x-apple-reminderkit://"+item.identifier
//if (!isCalEvent)log(item.calendar.identifier)
        }
      }    
    }
  }
}

function colorDots(colors){
//   let colors = ['ffffff','f17c37','3e9cbf','ffffff','f17c37','3e9cbf']  
  let numE = colors.length  
  let img = colDot(numE)
  return img
  
  function colDot(numE){  
    const context =new DrawContext()
    context.size=new Size(10*numE+5,10)
    context.opaque=false
    context.respectScreenScale=true
    const path = new Path()
    
    for (let i = 0;i<numE;i++){
    context.setFillColor(new Color('#'+colors[i]))
    i2=0
    if (i>0)i2=2
    context.fillEllipse(new Rect((10*i)+i2, 0, 10,10))
    }
    context.addPath(path)    
    context.fillPath()
    return context.getImage()  
  } 
}

async function updateCheck(version){
  /*
  #####
  Update Check
  #####
  */   
  let uC   
  try{let updateCheck = new Request('https://raw.githubusercontent.com/mvan231/Scriptable/main/Upcoming%20Calendar%20Indicator/Upcoming%20Calendar%20Indicator.json')
  uC = await updateCheck.loadJSON()
  }catch(e){return log(e)}
  log(uC)
  log(uC.version)
  let needUpdate = false
  if (uC.version != version){
    needUpdate = true
    log("Server version available")
    if (!config.runsInWidget)
    {
    log("running standalone")
    let upd = new Alert()
    upd.title="Server Version Available"
    upd.addAction("OK")
    upd.addDestructiveAction("Later")
    upd.add
    upd.message="Changes:\n"+uC.notes+"\n\nPress OK to get the update from GitHub"
      if (await upd.present()==0){
      Safari.open("https://raw.githubusercontent.com/mvan231/Scriptable/main/Upcoming%20Calendar%20Indicator/Upcoming%20Calendar%20Indicator.js")
      throw new Error("Update Time!")
      }
    } 
  }else{
    log("up to date")
  }
  
  return needUpdate
  /*
  #####
  End Update Check
  #####g
  */
}

function lineSep(){
  //generate more line separator
  const context =new DrawContext()
  let width = 22,h=1
  context.size=new Size(width, h)
  context.opaque=false
  context.respectScreenScale=true
  const path = new Path()
  path.move(new Point(1,h))
  path.addLine(new Point(width,h))
  context.addPath(path)
  
  context.setStrokeColor( Color.white())
  context.strokePath()
  return context.getImage()
}