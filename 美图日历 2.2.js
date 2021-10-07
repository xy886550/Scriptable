// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: images;
/**
* 版本: 2.2
* 更新时间：2021.10.07
* 更新内容：修复了左右对齐、iPhone12下透明背景错位问题、把1.2的农历获取模块也整进来了备用。
*/
//############## 参数配置模块 ##############

const filename = `${Script.name()}.jpg`
const files = FileManager.local()
const path = files.joinPath(files.documentsDirectory(), filename)
const changePicBg = false //是否使用透明背景
const ImageMode = true    //是否使用壁纸
const previewSize =  (config.runsInWidget ? config.widgetFamily : "medium");//预览大小 medium、small、large
const colorMode = false   //是否使用纯色背景
const COLOR_LIGHT_GRAY = new Color('#E5E7EB', 1);
const COLOR_DARK_GRAY = new Color('#374151', 1);
const COLOR_BAR_BACKGROUND = Color.dynamic(COLOR_LIGHT_GRAY, COLOR_DARK_GRAY);

const verticalAlignment = "bottom"  //垂直对齐/top  middle  bottom
const horizontalAlignment = "right"  //水平对齐/left  center  right
const elementSpacing = 3  //元素行间距
const showDlTq = true     //是否显示电量/天气

// 时间字体显示设置
const NowFont = "AvenirNext-Regular"
const NowSize = 32 //时间字体大小
const NowColor = new Color("FFD700")
const NowtextOpacity = 1 //文本不透明度
const NowshadowColor = new Color("000000")
const NowshadowRadius = 1
const NowshadowOffset = new Point(0, 0)
// 日历字体显示设置
const GlNlFont = "" //为空则为默认
const GlNlSize = 13
const GlNlColor = new Color("ffffff")
const GlNltextOpacity = 1
const GlNlshadowColor = new Color("000000")
const GlNlshadowRadius = 2
const GlNlshadowOffset = new Point(0, 0)
// 电量天气字体显示设置
const DlTqFont = ""
const DlTqSize = 10
const DlTqColor = new Color("ffffff")
const DlTqtextOpacity = 0.9
const DlTqshadowColor = new Color("000000")
const DlTqshadowRadius = 2
const DlTqshadowOffset = new Point(0, 0)

//细AvenirNext-UltraLight HelveticaNeue-UltraLight CourierNewPSMT KohinoorTelugu-Light
//中AvenirNext-Regular Avenir-Light Arial-BoldMT Verdana ChalkboardSE-Light Cochin Courier DBLCDTempBlack EuphemiaUCAS Futura-Medium GeezaPro KohinoorBangla-Regular
//粗ChalkboardSE-Regular GillSans-UltraBold AvenirNext-Heavy Futura-CondensedExtraBold

//黄色FFFF00 金黄FFD700 荧黄F0FF21 卡其F0E68C
//橙色FFA500 珊瑚FF7F50 橙红FF4500 深粉FF1493
//海绿20B2AA 浅绿90EE90 宝石66CDAA 黄绿9ACD32
//水青00FFFF 粉蓝B0E0E6 淡蓝B8F3FF 菊蓝6495ED
//薰衣E6E6FA 浅紫C4B8FF 板蓝7B68EE 巧克力D2691E

//############## 参数配置模块 ##############

// 获取公历信息
let date = new Date()
var weekInfo = date.getDay()
var weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
let week = weekArr[weekInfo]
const str = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日" + " " + week

// 获取农历信息
const WNL = await getWNL()
async function getWNL() {
  const url = "https://api.error.work/api/util/calendar"
  const req = new Request(url)
  const res = await req.loadJSON()
  return res
}
// 获取农历信息v2
// const lunarInfo = await getLunar(date.getDate() - 1)
// let lunarJoinInfo = lunarInfo.lunarYearText+ " " + lunarInfo.infoLunarText + " " + lunarInfo.holidayText

// 获取天气
const City = 'yudu'
const CityTQ = await getTQ()
async function getTQ() {
  const CityURI = encodeURI(`${City}`);
  const url = `https://wttr.in/${CityURI}?format=%25c+%25t+%25m`;
  const request = new Request(url)
  const res = await request.loadString()
  return res
}

const padding = {
  top: 12,
  left: 12,
  bottom: 12,
  right: 12
}
let widget = await createWidget()

//################ 透明背景模块 ################

if (!colorMode && !ImageMode && !config.runsInWidget && changePicBg) {
  const okTips = "您的小部件背景已准备就绪"
  let message = "图片模式支持相册照片&背景透明"
  let options = ["图片选择", "透明背景"]
  let isTransparentMode = await generateAlert(message, options)
  if (!isTransparentMode) {
    let img = await Photos.fromLibrary()
    message = okTips
    const resultOptions = ["好的"]
    await generateAlert(message, resultOptions)
    files.writeImage(path, img)
  } else {
    message = "以下是【透明背景】生成步骤，如果你没有屏幕截图请退出，并返回主屏幕长按进入编辑模式。滑动到最右边的空白页截图。然后重新运行！"
    let exitOptions = ["继续(已有截图)", "退出(没有截图)"]

    let shouldExit = await generateAlert(message, exitOptions)
    if (shouldExit) return

    // 获取屏幕截图并确定手机尺寸
    let img = await Photos.fromLibrary()
    let height = img.size.height
    let phone = phoneSizes()[height]
    if (!phone) {
      message = "您似乎选择了非iPhone屏幕截图的图像，或者不支持您的iPhone。请使用其他图像再试一次!"
      await generateAlert(message, ["好的！我现在去截图"])
      return
    }

    // 小部件大小和位置提示
    message = "您想要创建什么尺寸的小部件？"
    let sizes = ["小号", "中号", "大号"]
    let size = await generateAlert(message, sizes)
    let widgetSize = sizes[size]

    message = "您想它在什么位置？"
    message += (height == 1136 ? " (请注意，您的设备仅支持两行小部件，因此中间和底部选项相同。)" : "")

    // 根据手机大小确定图像裁剪
    let crop = { w: "", h: "", x: "", y: "" }
    if (widgetSize == "小号") {
      crop.w = phone.小号
      crop.h = phone.小号
      let positions = ["顶部 左边", "顶部 右边", "中间 左边", "中间 右边", "底部 左边", "底部 右边"]
      let position = await generateAlert(message, positions)

      // 将这两个单词转换为手机大小字典的两个键
      let keys = positions[position].split(' ')
      crop.y = phone[keys[0]]
      crop.x = phone[keys[1]]

    } else if (widgetSize == "中号") {
      crop.w = phone.中号
      crop.h = phone.小号

      // 中号、大号部件有一个固定的x值
      crop.x = phone.左边
      let positions = ["顶部", "中间", "底部"]
      let position = await generateAlert(message, positions)
      let key = positions[position].toLowerCase()
      crop.y = phone[key]

    } else if (widgetSize == "大号") {
      crop.w = phone.中号
      crop.h = phone.大号
      crop.x = phone.左边
      let positions = ["顶部", "底部"]
      let position = await generateAlert(message, positions)

      // 大号部件在底部时有"中间"值
      crop.y = position ? phone.中间 : phone.顶部
    }

    // 裁剪图像并最终确定小部件
    let imgCrop = cropImage(img, new Rect(crop.x, crop.y, crop.w, crop.h))

    message = "您的小部件背景已准备就绪，退出到桌面预览。"
    const resultOptions = ["好的"]
    await generateAlert(message, resultOptions)
    files.writeImage(path, imgCrop)
  }

}

//############## 设置小组件的背景 ##############

if (colorMode) {
  widget.backgroundColor = COLOR_BAR_BACKGROUND
} else if (ImageMode) {
  let img_url_arr = [
  // ✨博天·API  mobile:竖屏 pc:横屏
  "https://api.btstu.cn/sjbz/api.php",
  "https://api.btstu.cn/sjbz/api.php?method=pc&lx=meizi",
  "https://api.btstu.cn/sjbz/api.php?method=pc&lx=dongman",
  "https://api.btstu.cn/sjbz/api.php?method=pc&lx=fengjing",
  // ✨Uomg·API  img1:横屏 img2:竖屏 avatar:头像
  "https://api.uomg.com/api/rand.img1",//随机
  "https://api.uomg.com/api/rand.img1?sort=%E7%BE%8E%E5%A5%B3&format=images",//美女
  "https://api.uomg.com/api/rand.img1?sort=%E6%B1%BD%E8%BD%A6&format=images",//汽车
  "https://api.uomg.com/api/rand.img1?sort=%E4%BA%8C%E6%AC%A1%E5%85%83&format=images",//ACG
  "https://api.uomg.com/api/rand.img1?sort=%E5%8A%A8%E6%BC%AB&format=images",//动漫

  //"https://api.uomg.com/api/rand.img2",//随机
  //"https://api.uomg.com/api/rand.img2?sort=%E7%BE%8E%E5%A5%B3&format=images",//美女
  //"https://api.uomg.com/api/rand.img2?sort=%E4%BA%8C%E6%AC%A1%E5%85%83&format=images",//ACG
  //"https://api.uomg.com/api/rand.img2?sort=%E8%85%BF%E6%8E%A7&format=images",//腿控

  "https://api.uomg.com/api/rand.avatar?sort=%E5%A5%B3&format=images",//头像
  // ✨小歪·API  横屏 风景
  "https://api.ixiaowai.cn/gqapi/gqapi.php",
  // ✨动漫星空·API  横屏 ACG
  //"https://api.dongmanxingkong.com/suijitupian/acg/1080p/index.php?",//失效
  // ✨Loli·API  横屏 ACG
  "https://api.loli.bj/api",
  // ✨接口互联·API  横竖屏
  "https://api88.net/api/img/rand/",
  "https://api88.net/api/img/rand/?rand_type=rand_mz",//含动图
  "https://img.tjit.net/bing/rand/"
  // ✨MUZI API  横屏
  //"https://api.womc.cn/api/znbz/znbz.php",
  //"https://api.womc.cn/api/meinv/meinv.php",
  //"https://api.womc.cn/api/ACG/api.php",
  //"https://api.shaoyuu.com/duola/mu.php",
  // ✨Bing API
  //"https://area.sinaapp.com/bingImg/"
  ]
  const index = parseInt(Math.random() * img_url_arr.length)
  let img_url = img_url_arr[index]
  const img = await getImageByUrl(img_url, `x.xiāo`, false)
  widget.backgroundImage = await shadowImage(img)
  }
  else {
   widget.backgroundImage = files.readImage(path)
}
// 设置边距(上，左，下，右)
widget.setPadding(padding.top, padding.left, padding.bottom, padding.right)
// 设置组件
if (!config.runsInWidget) {
  switch (previewSize) {
    case "small":
      await widget.presentSmall();
      break;
    case "medium":
      await widget.presentMedium();
      break;
    case "large":
      await widget.presentLarge();
      break;
  }
}
Script.setWidget(widget)// 完成脚本
Script.complete()// 预览

//############### 创建小组件内容 ###############

async function createWidget() {
  let widget = new ListWidget()

  if (verticalAlignment == "middle" || verticalAlignment == "bottom") {
    widget.addSpacer()
  }
  // 时间 🕐
  let Now = widget.addDate(new Date())
  Now.date = new Date(new Date(new Date().toLocaleDateString()).getTime())
  Now.applyTimerStyle()
  if (NowFont == "" || NowFont == null) {
   Now.font = Font.lightSystemFont(NowSize)
    //light regular medium bold
   } else {
   Now.font = new Font(NowFont,NowSize)
  }
  Now.textColor = NowColor
  if (horizontalAlignment == "center") {
    Now.centerAlignText()
   } else {
   if (horizontalAlignment == "right") {
      Now.rightAlignText()
    }
  }
  Now.textOpacity = NowtextOpacity
  Now.shadowColor = NowshadowColor
  Now.shadowRadius = NowshadowRadius
  Now.shadowOffset = NowshadowOffset
  widget.addSpacer(elementSpacing)
  
  // 公历+农历/节日 📅
  let GlNl = widget.addText(str + '·' + `${WNL.data.nongli} ${WNL.data.jieri}`)
  //let GlNl = widget.addText(str + '·' + `${lunarJoinInfo}`)
  if (GlNlFont == "" || GlNlFont == null) {
   GlNl.font = Font.lightSystemFont(GlNlSize)
   } else {
   GlNl.font = new Font(GlNlFont,GlNlSize)
  }
  GlNl.textColor = GlNlColor
  if (horizontalAlignment == "center") {
    GlNl.centerAlignText()
   } else {
   if (horizontalAlignment == "right") {
      GlNl.rightAlignText()
    }
  }
  GlNl.textOpacity = GlNltextOpacity
  GlNl.shadowColor = GlNlshadowColor
  GlNl.shadowRadius = GlNlshadowRadius
  GlNl.shadowOffset = GlNlshadowOffset
  
  // 电池/天气 🔋+☁️
  if (showDlTq) {
  widget.addSpacer(elementSpacing)
  let batteryinfo = getBatteryInfo()
  let DlTq = widget.addText(batteryinfo + ' ｜ ' + `${CityTQ}`)
   if (DlTqFont == "" || DlTqFont == null) {
   DlTq.font = Font.lightSystemFont(DlTqSize)
    } else {
   DlTq.font = new Font(DlTqFont,DlTqSize)
   }
  DlTq.textColor = DlTqColor
   if (horizontalAlignment == "center") {
    DlTq.centerAlignText()
    } else {
    if (horizontalAlignment == "right") {
      DlTq.rightAlignText()
    }
   }
  DlTq.textOpacity = DlTqtextOpacity
  DlTq.shadowColor = DlTqshadowColor
  DlTq.shadowRadius = DlTqshadowRadius
  DlTq.shadowOffset = DlTqshadowOffset
  }

  if (verticalAlignment == "top" || verticalAlignment == "middle") {
  widget.addSpacer()
  }
  
  return widget
}

//############ 获取农历时间v2 ############

// async function getLunarData() {
//   const url = 'https://api.xlongwei.com/service/datetime/convert.json'
//   const request = new Request(url)
//   const res = await request.loadJSON()
//   return `${res.ganzhi}${res.shengxiao}年 农历${res.chinese.replace(/.*年/, '')}`
// }
// 
// async function getLunar(day) {
  // 缓存key
//   const cacheKey = "NK-lunar-cache"
  // 万年历数据
//   let response = undefined
//   try {
//     const request = new Request("https://wannianrili.51240.com/")
//     const defaultHeaders = {
//       "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36"
//     }
//     request.method = 'GET'
//     request.headers = defaultHeaders
//     const html = await request.loadString()
//     let webview = new WebView()
//     await webview.loadHTML(html)
//     var getData = `
//               function getData() {
//                   try {
//                       infoLunarText = document.querySelector('div#wnrl_k_you_id_${day}.wnrl_k_you .wnrl_k_you_id_wnrl_nongli').innerText
//                       holidayText = document.querySelectorAll('div.wnrl_k_zuo div.wnrl_riqi')[${day}].querySelector('.wnrl_td_bzl').innerText
//                       lunarYearText = document.querySelector('div.wnrl_k_you_id_wnrl_nongli_ganzhi').innerText
//                       lunarYearText = lunarYearText.slice(0, lunarYearText.indexOf('年')+1)
//                       if(infoLunarText.search(holidayText) != -1) {
//                           holidayText = ''
//                       }
//                   } catch {
//                       holidayText = ''
//                   }
//                   return {infoLunarText: infoLunarText,  lunarYearText: lunarYearText,  holidayText: holidayText }
//               }
//               
//               getData()`
// 
    // 节日数据  
//     response = await webview.evaluateJavaScript(getData, false)
//     Keychain.set(cacheKey, JSON.stringify(response))
//     console.log(`[+]农历输出：${JSON.stringify(response)}`);
//   } catch (e) {
//     console.error(`[+]农历请求出错：${e}`)
//     if (Keychain.contains(cacheKey)) {
//       const cache = Keychain.get(cacheKey)
//       response = JSON.parse(cache)
//     }
//   }
// 
//   return response
// }

//############ 获取电量信息部分 ############

// 判断是否在区域里
function utilIsInArea(area, value) {
  const matched = Object.keys(area).find(key => {
    const [strat, end] = key.split('~')
    return value > strat && value <= end
  })
  return area[matched]
}

// 获取电池信息
function getBatteryInfo() {
  let batteryText = '🔋 '
  // 是否在充电
  const isCharging = Device.isCharging()
  // 充电等级
  const batteryLevel = Math.round(Device.batteryLevel() * 100)
  // 显示电量值
  batteryText += `${batteryLevel}% `
  // 电量状态提示语枚举
  const batteryTextMap = {
    '0~20': "😵‍💫", 
    '20~40': "🥺", 
    '40~80': "😋", 
    '80~100': "🥰"
  }
  if (isCharging) {
    batteryText += batteryLevel < 95 ? "⚡️" : "🥵"
  } else {
    batteryText += utilIsInArea(batteryTextMap, batteryLevel)
  }
  return batteryText
}

//############ 背景模块-逻辑处理部分 ############

async function shadowImage(img) {
  let ctx = new DrawContext()
  // 把画布的尺寸设置成图片的尺寸
  ctx.size = img.size
  // 把图片绘制到画布中
  ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
  // 设置绘制的图层颜色，为半透明的黑色
  ctx.setFillColor(new Color('#000000', 0.1))//0.5
  // 绘制图层
  ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))

  // 导出最终图片
  return await ctx.getImage()
}

async function generateAlert(message, options) {
  let alert = new Alert()
  alert.message = message

  for (const option of options) {
    alert.addAction(option)
  }

  let response = await alert.presentAlert()
  return response
}

// 将图像裁剪到指定的矩形中
function cropImage(img, rect) {
  let draw = new DrawContext()
  draw.size = new Size(rect.width, rect.height)
  draw.drawImageAtPoint(img, new Point(-rect.x, -rect.y))
  return draw.getImage()
}

async function getImageByUrl(url, cacheKey, useCache = true) {
  const cacheFile = FileManager.local().joinPath(FileManager.local().temporaryDirectory(), cacheKey)
  const exists = FileManager.local().fileExists(cacheFile)
  // 判断是否有缓存
  if (useCache && exists) {
    return Image.fromFile(cacheFile)
  }
  try {
    const req = new Request(url)
    const img = await req.loadImage()
    // 存储到缓存
    FileManager.local().writeImage(cacheFile, img)
    return img
  } catch (e) {
    console.error(`图片加载失败：${e}`)
    if (exists) {
      return Image.fromFile(cacheFile)
    }
    // 没有缓存+失败情况下，返回黑色背景
    let ctx = new DrawContext()
    ctx.size = new Size(100, 100)
    ctx.setFillColor(Color.black())
    ctx.fillRect(new Rect(0, 0, 100, 100))
    return await ctx.getImage()
  }
}

// 受支持手机上小部件的像素大小和位置/用于透明背景
function phoneSizes() {
  let phones = {
    "2340": { // 12mini
      "小号": 465,
      "中号": 987,
      "大号": 1035,
      "左边": 69,
      "右边": 591,
      "顶部": 231,
      "中间": 801,
      "底部": 1371,
    },

    "2532": { // 12/12 Pro
      "小号": 474,
      "中号": 1014,
      "大号": 1062,
      "左边": 78,
      "右边": 618,
      "顶部": 231,
      "中间": 819,
      "底部": 1407,
    },

    "2778": { // 12 Pro Max
      "小号": 510,
      "中号": 1092,
      "大号": 1146,
      "左边": 96,
      "右边": 678,
      "顶部": 246,
      "中间": 882,
      "底部": 1518,
    },

    "2688": { // 11 Pro Max, XS Max
      "小号": 507,
      "中号": 1080,
      "大号": 1137,
      "左边": 81,
      "右边": 654,
      "顶部": 228,
      "中间": 858,
      "底部": 1488
    },

    "1792": { // 11, XR
      "小号": 338,
      "中号": 720,
      "大号": 758,
      "左边": 54,
      "右边": 436,
      "顶部": 160,
      "中间": 580,
      "底部": 1000
    },

    "2436": { // 11 Pro, XS, X
      "小号": 465,
      "中号": 987,
      "大号": 1035,
      "左边": 69,
      "右边": 591,
      "顶部": 213,
      "中间": 783,
      "底部": 1353
    },

    "2208": { // Plus phones
      "小号": 471,
      "中号": 1044,
      "大号": 1071,
      "左边": 99,
      "右边": 672,
      "顶部": 114,
      "中间": 696,
      "底部": 1278
    },

    "1334": { // SE2 and 6/6S/7/8
      "小号": 296,
      "中号": 642,
      "大号": 648,
      "左边": 54,
      "右边": 400,
      "顶部": 60,
      "中间": 412,
      "底部": 764
    },

    "1136": { //SE1
      "小号": 282,
      "中号": 584,
      "大号": 622,
      "左边": 30,
      "右边": 332,
      "顶部": 59,
      "中间": 399,
      "底部": 399
    }
  }
  return phones
}
