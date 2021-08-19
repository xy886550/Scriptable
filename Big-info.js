// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: window-maximize;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: calendar-alt;
// 大组件显示问候语、时间、电量、日历事件和天气


/* -- PREVIEW YOUR WIDGET -- */
// 修改为你所在城市
const City = '于都'
const CityTQ = await getTQ()
const dx = await getDX()
const wnl = await getWNL()

// 获取天气
async function getTQ() {
    const CityURI = encodeURI(`${City}`);
    const url = `https://wttr.in/${CityURI}?format=3`;
    const request = new Request(url)
    const res = await request.loadString()
    return res
}

// 获取丁香日历
async function getDX() {
	const url = "https://dxy.com/app/i/ask/discover/todayfeed/healthcalendar"
	const req = new Request(url)
	const res = await req.loadJSON()
	const i = new Request(res.data.items[0].pic_url)
	const img = await i.loadImage()
	const title = res.data.items[0].title
	return {'img':img, 'title':title}
}

// 获取万年历
async function getWNL() {
	const url = "https://api.error.work/api/util/calendar"
	const req = new Request(url)
	const res = await req.loadJSON()
	return res
}

// 更改为true 查看小部件的预览。
const testMode = true

// 指定窗口小部件预览的大小。
const widgetPreview = "large"

/* -- 问候和日期 -- */

// 根据一天中的时间显示问候语。
const showGreeting = true

// 选择日期样式。 “iOS”与默认日历应用匹配（例如：THURSDAY 29）
// 或者使用docs.scriptable.app/dateformatter编写自己的格式。
const dateDisplay = "EEEE, M月d日"//MMMM dd

/* -- 日历活动 -- */

// 更改为false以隐藏日历事件。
const showEvents = true

// 选择是否显示全天活动。
const showAllDay = true

// 指定要显示的事件数。
const numberOfEvents = 4

// （可选）显示明天的事件。
const showTomorrow = true

// 没有事件时写一条消息，或改成“”为空白。
const noEventMessage = "🎉 Enjoy the rest of your day."

/* -- 间距 -- */

// 可选 top, middle, or bottom.
const verticalAlignment = "top"

// 可选 left, center, or right.
const horizontalAlignment = "left"

// 每个元素之间的间距。
const elementSpacing = 12

/* -- 字体和文字 -- */

// 使用 iosfonts.com，或将系统字体更改为“”。
const fontName = "Futura-Medium"

// 字体颜色
const fontColor = new Color("#ffffff")

// 更改每个元素的字体大小。
const greetingSize = 18
const dateSize = 34
const dayOfWeekSize = 13
const eventTitleSize = 14
const eventTimeSize = 12
const noEventMessageSize = 13

/* -- 初始化小组件 -- */

/*
 * 此注释下方的代码是小部件逻辑-稍微复杂一点。
 * =====================================================================
 */

// 存储其他全局值。
const date = new Date()
let widget = new ListWidget()

// 如果我们在窗口小部件中或正在测试中，先构建窗口小部件。
if (config.runsInWidget || testMode) {

  widget.backgroundImage = await shadowImage(dx.img)

  if (verticalAlignment == "middle" || verticalAlignment == "bottom") {
    widget.addSpacer()
  }

  // 格式化问候语。
  if (showGreeting) {
    let greetingText = makeGreeting()
    let greeting = widget.addText(greetingText)
    formatText(greeting, greetingSize)
    widget.addSpacer(elementSpacing)
  }

  // 格式化日期。
  let df = new DateFormatter()
  if (dateDisplay.toLowerCase() == "ios") {
    df.dateFormat = "EEEE"
    let dayOfWeek = widget.addText(df.string(date).toUpperCase())
    let dateNumber = widget.addText(date.getDate().toString())

    formatText(dayOfWeek, dayOfWeekSize)
    formatText(dateNumber, dateSize)
  } else {
    df.dateFormat = dateDisplay
    let dateText = widget.addText(df.string(date))
    formatText(dateText, dateSize)
  }
  
  // 格式化万年历
  widget.addSpacer(elementSpacing)
  let wnlEvents = widget.addText(`农历${wnl.data.nongli} ${wnl.data.jieri}`)
  formatText(wnlEvents, eventTitleSize)
  
  // 格式化天气
  widget.addSpacer(elementSpacing)
  let TqEvents = widget.addText(`今天${wnl.data.work_tag} | ${CityTQ}`)
  formatText(TqEvents, noEventMessageSize)
  
  // 格式化电量信息
  let batteryinfo = getBatteryInfo()
  let batEvents = widget.addText(batteryinfo)
  formatText(batEvents, 10)

  // 添加日历事件。
  if (showEvents) {

    // 确定要显示哪些事件以及多少。
    const todayEvents = await CalendarEvent.today([])
    let shownEvents = 0
    
    for (const event of todayEvents) {
      if (shownEvents == numberOfEvents) {
        break
      }
      if (shouldShowEvent(event)) {
        displayEvent(widget, event)
        shownEvents++
      }
    }

    // 如果需要的话，请显示明天的活动。
    let multipleTomorrowEvents = false
    if (showTomorrow && shownEvents < numberOfEvents) {

      const tomorrowEvents = await CalendarEvent.tomorrow([])

      for (const event of tomorrowEvents) {
        if (shownEvents == numberOfEvents) {
          break
        }
        if (shouldShowEvent(event)) {
          // 在第一个明天活动之前添加明天标签。
          if (!multipleTomorrowEvents) {
            widget.addSpacer(elementSpacing)
            let tomorrowText = widget.addText("Tomorrow")
            formatText(tomorrowText, eventTitleSize)
            multipleTomorrowEvents = true
          }
          // 显示明天事件并增加计数器。
          displayEvent(widget, event)
          shownEvents++
        }
      }

    }

    // 如果没有事件，并且设置了无日历消息，则显示消息。
    if (shownEvents == 0 && noEventMessage != "" && noEventMessage != null) {

      widget.addSpacer(elementSpacing)

      let noEvents = widget.addText(noEventMessage)
      formatText(noEvents, noEventMessageSize)
    }

  }
  
  // 格式化健康日历
  widget.addSpacer(elementSpacing)
  let rlEvents = widget.addText(`💁🏻‍♀️ “ ${dx.title} ”`)
  formatText(rlEvents, noEventMessageSize)

  if (verticalAlignment == "top" || verticalAlignment == "middle") {
    widget.addSpacer()
  }

  Script.setWidget(widget)
  if (testMode) {
    let widgetSizeFormat = widgetPreview.toLowerCase()
    if (widgetSizeFormat == "small")  { widget.presentSmall()  }
    if (widgetSizeFormat == "medium") { widget.presentMedium() }
    if (widgetSizeFormat == "large")  { widget.presentLarge()  }
  }
  Script.complete()

// 如果正常运行，请转到日历。
} else if (!resetWidget) {

  const appleDate = new Date('2001/01/01')
  const timestamp = (date.getTime() - appleDate.getTime()) / 1000
  const callback = new CallbackURL("calshow:" + timestamp)
  callback.open()
  Script.complete()

// 如果是第一次运行，请设置日历权限。
} else {
  message = "如果您尚未授予“日历”访问权限，则下一步将弹出。"
  await generateAlert(message, ["OK"])

  // 确保我们具有日历访问权限。
  await CalendarEvent.today([])

  Script.complete()
}

/*
 * 辅助功能
 * ================
 */

// 根据一天中的时间返回问候语。 
function makeGreeting() {
  let greeting = "Good "
  if (date.getHours() < 6) {
    greeting = greeting + "night."
  } else if (date.getHours() < 12) {
    greeting = greeting + "morning."
  } else if (date.getHours() < 17) {
    greeting = greeting + "afternoon."
  } else if (date.getHours() < 21) {
    greeting = greeting + "evening."
  } else {
    greeting = greeting + "night."
  }
  return greeting
}

// 确定是否应显示事件。
function shouldShowEvent(event) {

  // 删除已取消的Office 365事件。
  if (event.title.startsWith("Canceled:")) {
    return false
  }

  // 如果是全天活动，则仅在设置处于活动状态时显示。
  if (event.isAllDay) {
    return showAllDay
  }

  // 否则，如果将来会返回该事件。
  return (event.startDate.getTime() > date.getTime())
}

// 提供指定的字体。
function provideFont(fontName, fontSize) {
  if (fontName == "" || fontName == null) {
    return Font.regularSystemFont(fontSize)
  } else {
    return new Font(fontName, fontSize)
  }
}

// 向小部件添加事件。
function displayEvent(widget, event) {
  widget.addSpacer(elementSpacing)

  let title = widget.addText(event.title)
  formatText(title, eventTitleSize)

  // 如果这是全天活动，我们不需要时间。
  if (event.isAllDay) { return }

  widget.addSpacer(7)

  let time = widget.addText(formatTime(event.startDate))
  formatText(time, eventTimeSize)
}

// 格式化每个事件下的时间。
function formatTime(date) {
  let df = new DateFormatter()
  df.useNoDateStyle()
  df.useShortTimeStyle()
  return df.string(date)
}

// 根据设置格式化文本。
function formatText(textItem, fontSize) {
  textItem.font = provideFont(fontName, fontSize)
  textItem.textColor = fontColor
  if (horizontalAlignment == "right") {
    textItem.rightAlignText()
  } else if (horizontalAlignment == "center") {
    textItem.centerAlignText()
  } else {
    textItem.leftAlignText()
  }
}

// 确定两个日期是否在同一天
function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
}

// 使用提供的选项数组生成警报。
async function generateAlert(message, options) {

  let alert = new Alert()
  alert.message = message

  for (const option of options) {
    alert.addAction(option)
  }

  let response = await alert.presentAlert()
  return response
}

/**
 * 判断是否在区域里
 * @param {*} area 
 * @param {*} value 
 */
function utilIsInArea(area, value) {
  const matched = Object.keys(area).find(key => {
    const [strat, end] = key.split('~')
    return value > strat && value <= end
  })
  return area[matched]
}

/**
 * 获取电池信息
 */
function getBatteryInfo() {
  let batteryText = '🔋 '
  // 是否在充电
  const isCharging = Device.isCharging()
  // 充电等级
  const batteryLevel = Math.round(Device.batteryLevel() * 100)
  
  // 显示电量进度
  const juice = "▓".repeat(Math.floor(batteryLevel / 10)); 
  const used = "░".repeat(10 - juice.length);
  batteryText += `${juice}${used} `

  // 显示电量值
  batteryText += `${batteryLevel}% `
  
  // 电量状态提示语枚举
  const batteryTextMap = {
    '0~10': "电量将耗尽,再不充电我就关机了!", //当电量少于10%
    '10~20': "电量就剩不到20%了,尽快充电!", //当电量在10-20%
    '20~30': "电量就快用完,赶紧充电!", //当电量在20-30%
    '30~40': "电量用了大半了,尽快充电啦!", //当电量在30-40%
    '40~50': "电量用了一半,有时间就充电啦!", //当电量在40-50%
    '50~70': "电量还有大半呢,不用着急充电!", //当电量在50-70%
    '70~80': "电量充足,不出远门没有问题!", //当电量在70-80%
    '80~100': "电量充足,很有安全感!!!" //当电量在80-100%
  }
  if (isCharging) {
    batteryText += batteryLevel < 100 ? "正在充电中⚡️⚡️⚡️" : "已充满电!请拔下电源!⚡️"
  } else {
    batteryText += utilIsInArea(batteryTextMap, batteryLevel)
  }

  return batteryText
}

/**
   * 给图片加上半透明遮罩
   * @param img 要处理的图片对象
   * @return image
   */
async function shadowImage (img) {
    let ctx = new DrawContext()
    ctx.size = img.size
    ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
    // 图片遮罩颜色、透明度设置
    ctx.setFillColor(new Color("#000000", 0.5))
    ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
    let res = await ctx.getImage()
    return res
  }