// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: snowflake;
/**
* 版本: 1.1
* 更新时间：2021.10.23
* 更新内容：增加一个农历模块v2，修复左右对齐
*/
/* ------------- 设置项目 ------------- */
//功能对齐间距
let widget = new ListWidget()
widget.setPadding(12, 12, 12, 12) //上左下右
const testMode = true  //是否预览 true false
const widgetPreview = "Medium" //Small  Medium  large
const showDlTq = true  //是否显示电量/天气
const verticalAlignment = "bottom"  // 垂直对齐/top  middle  bottom
const horizontalAlignment = "right"  // 水平对齐/left  center  right
const elementSpacing = 2 //元素行间距
refreshInterval = 10

//时间字体显示设置
const NowFont = "AvenirNext-Regular"
const NowSize = 35 //时间字体大小
const NowColor = new Color("FFD700")
const NowtextOpacity = 1 //文本不透明度
const NowshadowColor = new Color("000000")
const NowshadowRadius = 1
const NowshadowOffset = new Point(0, 0)
//日历字体显示设置
const GlNlFont = ""
const GlNlSize = 13.5
const GlNlColor = new Color("ffffff")
const GlNltextOpacity = 1
const GlNlshadowColor = new Color("000000")
const GlNlshadowRadius = 2
const GlNlshadowOffset = new Point(0, 0)
//电量天气字体显示设置
const DlTqFont = ""
const DlTqSize = 12
const DlTqColor = new Color("ffffff")
const DlTqtextOpacity = 1
const DlTqshadowColor = new Color("000000")
const DlTqshadowRadius = 2
const DlTqshadowOffset = new Point(0, 0)

//细AvenirNext-UltraLight HelveticaNeue-UltraLight
//中AvenirNext-Regular Avenir-Light Arial-BoldMT Verdana ChalkboardSE-Light DBLCDTempBlack 
//粗GillSans-UltraBold AvenirNext-Heavy Futura-CondensedExtraBold

//黄色FFFF00 金黄FFD700 荧黄F0FF21 卡其F0E68C
//橙色FFA500 珊瑚FF7F50 橙红FF4500 深粉FF1493
//海绿20B2AA 浅绿90EE90 宝石66CDAA 黄绿9ACD32
//水青00FFFF 粉蓝B0E0E6 淡蓝B8F3FF 菊蓝6495ED
//薰衣E6E6FA 浅紫C4B8FF 板蓝7B68EE 巧克力D2691E

/* ------------- 获取信息 ------------- */
// 获取天气
const City = 'Yudu'
const CityTQ = await getTQ()
async function getTQ() {
  const CityURI = encodeURI(`${City}`);
  const url = `https://wttr.in/${CityURI}?format=%25c+%25f+%25m`;
  const request = new Request(url)
  const res = await request.loadString()
  return res
}

// 获取背景图片
const TP = await getTP()
async function getTP() {
  let img_url_arr = [
  // ✨Uomg·API  img1:横屏 img2:竖屏 avatar:头像
  "https://api.uomg.com/api/rand.img1",//随机
  "https://api.uomg.com/api/rand.img1?sort=%E7%BE%8E%E5%A5%B3&format=images",//美女
  "https://api.uomg.com/api/rand.img1?sort=%E6%B1%BD%E8%BD%A6&format=images",//汽车
  "https://api.uomg.com/api/rand.img1?sort=%E4%BA%8C%E6%AC%A1%E5%85%83&format=images",//ACG
  "https://api.uomg.com/api/rand.img1?sort=%E5%8A%A8%E6%BC%AB&format=images",//动漫

  "https://api.uomg.com/api/rand.img2",//随机
  "https://api.uomg.com/api/rand.img2?sort=%E7%BE%8E%E5%A5%B3&format=images",//美女
  "https://api.uomg.com/api/rand.img2?sort=%E4%BA%8C%E6%AC%A1%E5%85%83&format=images",//ACG
  "https://api.uomg.com/api/rand.img2?sort=%E8%85%BF%E6%8E%A7&format=images",//腿控

  "https://api.uomg.com/api/rand.avatar?sort=%E5%A5%B3&format=images",//头像
  
  // ✨ Ushio·API
  "https://api.yimian.xyz/img?type=moe&size=1920x1080",//ACG
  "https://api.yimian.xyz/img?type=wallpaper",//随机Bing

  // ✨樱道·API
  "https://api.r10086.com/%E9%A3%8E%E6%99%AF%E7%B3%BB%E5%88%974.php",//风景4
  "https://api.r10086.com/%E5%B0%91%E5%A5%B3%E5%86%99%E7%9C%9F5.php",//写真5
  
  // ✨樱花·API  横屏 ACG
  "https://www.dmoe.cc/random.php",
  
  // ✨Loli·API  横屏 ACG
  "https://api.loli.bj/api",
  
  // ✨墨天逸·API  横屏 ACG
  "https://api.mtyqx.cn/api/random.php",
  
  // ✨岁月小筑·API
  "https://img.xjh.me/random_img.php?type=bg&ctype=acg&return=302",//ACG
  "https://img.xjh.me/random_img.php?type=bg&ctype=nature&return=302",//背景
    
  // ✨MUZI API  横屏
  "https://api.womc.cn/api/znbz/znbz.php",
  "https://api.womc.cn/api/meinv/meinv.php",
  "https://api.womc.cn/api/ACG/api.php",
  //"https://api.shaoyuu.com/duola/mu.php",

  // ✨保罗·API
  "https://api.paugram.com/wallpaper/?source=sina&category=us",//白底ACG gt/jp/cn/us
  "https://api.paugram.com/bing/",//每日bing
  
  // ✨小歪·API  横屏
  "https://api.ixiaowai.cn/gqapi/gqapi.php",//风景
  "https://api.ixiaowai.cn/api/api.php",//ACG  
  
  // ✨博天·API  mobile:竖屏 pc:横屏
  //"https://api.btstu.cn/sjbz/api.php",
  //"https://api.btstu.cn/sjbz/api.php?method=mobile&lx=meizi",
  //"https://api.btstu.cn/sjbz/api.php?method=mobile&lx=dongman",
  //"https://api.btstu.cn/sjbz/api.php?method=mobile&lx=fengjing",

  //"https://api.btstu.cn/sjbz/api.php?method=pc&lx=meizi",
  //"https://api.btstu.cn/sjbz/api.php?method=pc&lx=dongman",
  //"https://api.btstu.cn/sjbz/api.php?method=pc&lx=fengjing",

  // ✨接口互联·API  横竖屏
  //"https://api88.net/api/img/rand/",
  //"https://api88.net/api/img/rand/?rand_type=rand_mz",//含动图
  //"https://img.tjit.net/bing/rand/",

  // ✨Unsplash
  "https://source.unsplash.com/random",
  "https://source.unsplash.com/1600x900/?nature",
  "https://source.unsplash.com/1600x900/?scenery",
  "https://source.unsplash.com/1600x900/?china",
  "https://unsplash.it/1600/900?random"
  ]
  const index = parseInt(Math.random() * img_url_arr.length)
  let img_url = img_url_arr[index]
  const req = new Request(img_url)
  const img = await req.loadImage()
  return {'img':img}
}

// 获取公历信息
const date = new Date()
var weekInfo = date.getDay()
var weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
let week = weekArr[weekInfo]
const str = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日" + " " + week

// 获取农历信息
// const WNL = await getWNL()
// async function getWNL() {
//   const url = "https://api.error.work/api/util/calendar"
//   const req = new Request(url)
//   const res = await req.loadJSON()
//   return res
// }

// 获取农历信息v2
const lunarInfo = await getLunar(date.getDate() - 1)
let lunarJoinInfo = lunarInfo.lunarYearText+ " " + lunarInfo.infoLunarText + " " + lunarInfo.holidayText

/* ------------ 初始化小组件 ------------ */

// 先构建窗口小部件
if (config.runsInWidget || testMode) {
  widget.backgroundImage = await shadowImage(TP.img)

if (verticalAlignment == "middle" || verticalAlignment == "bottom") {
    widget.addSpacer()
  }

//时间 🕐
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
//let GlNl = widget.addText(str + '·' + `${WNL.data.nongli} ${WNL.data.jieri}`)
let GlNl = widget.addText(str + '·' + `${lunarJoinInfo}`)  
if (GlNlFont == "" || GlNlFont == null) {
  GlNl.font = Font.regularSystemFont(GlNlSize)
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
 
//电池/天气 🔋+☁️
if (showDlTq) {
  widget.addSpacer(elementSpacing)
  let batteryinfo = getBatteryInfo()
  let DlTq = widget.addText(batteryinfo + ' ｜ ' + `${CityTQ}`)
  if (DlTqFont == "" || DlTqFont == null) {
  DlTq.font = Font.regularSystemFont(DlTqSize)
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

Script.setWidget(widget)
  if (testMode) {
    let widgetSizeFormat = widgetPreview.toLowerCase()
    if (widgetSizeFormat == "small")  { widget.presentSmall()  }
    if (widgetSizeFormat == "medium") { widget.presentMedium() }
    if (widgetSizeFormat == "large")  { widget.presentLarge()  }
  }
  Script.complete()
}
/* ------------- 获取农历v2 ------------- */

// async function getLunarData() {
//   const url = 'https://api.xlongwei.com/service/datetime/convert.json'
//   const request = new Request(url)
//   const res = await request.loadJSON()
//   return `${res.ganzhi}${res.shengxiao}年 农历${res.chinese.replace(/.*年/, '')}`
// }

async function getLunar(day) {
// 缓存key
  const cacheKey = "NK-lunar-cache"
// 万年历数据
  let response = undefined
  try {
    const request = new Request("https://wannianrili.51240.com/")
    const defaultHeaders = {
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36"
    }
    request.method = 'GET'
    request.headers = defaultHeaders
    const html = await request.loadString()
    let webview = new WebView()
    await webview.loadHTML(html)
    var getData = `
              function getData() {
                  try {
                      infoLunarText = document.querySelector('div#wnrl_k_you_id_${day}.wnrl_k_you .wnrl_k_you_id_wnrl_nongli').innerText
                      holidayText = document.querySelectorAll('div.wnrl_k_zuo div.wnrl_riqi')[${day}].querySelector('.wnrl_td_bzl').innerText
                      lunarYearText = document.querySelector('div.wnrl_k_you_id_wnrl_nongli_ganzhi').innerText
                      lunarYearText = lunarYearText.slice(0, lunarYearText.indexOf('年')+1)
                      if(infoLunarText.search(holidayText) != -1) {
                          holidayText = ''
                      }
                  } catch {
                      holidayText = ''
                  }
                  return {infoLunarText: infoLunarText,  lunarYearText: lunarYearText,  holidayText: holidayText }
              }
              
              getData()`

  // 节日数据  
    response = await webview.evaluateJavaScript(getData, false)
    Keychain.set(cacheKey, JSON.stringify(response))
    console.log(`[+]农历输出：${JSON.stringify(response)}`);
  } catch (e) {
    console.error(`[+]农历请求出错：${e}`)
    if (Keychain.contains(cacheKey)) {
      const cache = Keychain.get(cacheKey)
      response = JSON.parse(cache)
    }
  }

  return response
}

/* ------------- 辅助功能 ------------- */
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

// 显示电量值
  batteryText += `${batteryLevel}% `
  
// 电量状态提示语枚举
  const batteryTextMap = {
    '0~20': "🥶", 
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

/**
   * 给图片加上半透明遮罩
   * @param img 要处理的图片对象
   * @return image
   */
async function shadowImage(img) {
    let ctx = new DrawContext()
    ctx.size = img.size
    ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
    // 图片遮罩颜色、透明度设置
    ctx.setFillColor(new Color("#000000", 0.1))
    ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
    let res = await ctx.getImage()
    return res
  }
