// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: images;
/**
* 版本: 1.2.0
* 更新时间：2021.09.20
*/
//############## 公共参数配置模块 ############## 
const filename = `${Script.name()}.jpg`
const files = FileManager.local()
const path = files.joinPath(files.documentsDirectory(), filename)
const changePicBg = false  //选择true时，使用透明背景
const ImageMode = true   //选择true时，使用壁纸
const previewSize =  (config.runsInWidget ? config.widgetFamily : "medium");// medium、small、large 预览大小
const colorMode = false // 是否是纯色背景
const COLOR_LIGHT_GRAY = new Color('#E5E7EB', 1);
const COLOR_DARK_GRAY = new Color('#374151', 1);
const COLOR_BAR_BACKGROUND = Color.dynamic(COLOR_LIGHT_GRAY, COLOR_DARK_GRAY);

// 获取农历信息
let date = new Date()
const lunarInfo = await getLunar(date.getDate() - 1)
let lunarJoinInfo = lunarInfo.lunarYearText+ " " + lunarInfo.infoLunarText + " " + lunarInfo.holidayText

// 获取星期
var weekInfo = date.getDay()
var weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
let week = weekArr[weekInfo]
// 获取公历信息
const str = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日" + " " + week

const padding = {
  top: 12,
  left: 12,
  bottom: 12,
  right: 12
}
let widget = await createWidget()

//################ 透明背景模块 #################

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

    // Get screenshot and determine phone size.
    let img = await Photos.fromLibrary()
    let height = img.size.height
    let phone = phoneSizes()[height]
    if (!phone) {
      message = "您似乎选择了非iPhone屏幕截图的图像，或者不支持您的iPhone。请使用其他图像再试一次!"
      await generateAlert(message, ["好的！我现在去截图"])
      return
    }

    // Prompt for widget size and position.
    message = "您想要创建什么尺寸的小部件？"
    let sizes = ["小号", "中号", "大号"]
    let size = await generateAlert(message, sizes)
    let widgetSize = sizes[size]

    message = "您想它在什么位置？"
    message += (height == 1136 ? " (请注意，您的设备仅支持两行小部件，因此中间和底部选项相同。)" : "")

    // Determine image crop based on phone size.
    let crop = { w: "", h: "", x: "", y: "" }
    if (widgetSize == "小号") {
      crop.w = phone.小号
      crop.h = phone.小号
      let positions = ["顶部 左边", "顶部 右边", "中间 左边", "中间 右边", "底部 左边", "底部 右边"]
      let position = await generateAlert(message, positions)

      // Convert the two words into two keys for the phone size dictionary.
      let keys = positions[position].split(' ')
      crop.y = phone[keys[0]]
      crop.x = phone[keys[1]]

    } else if (widgetSize == "中号") {
      crop.w = phone.中号
      crop.h = phone.小号

      // 中号 and 大号 widgets have a fixed x-value.
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

      // 大号 widgets at the 底部 have the "中间" y-value.
      crop.y = position ? phone.中间 : phone.顶部
    }

    // Crop image and finalize the widget.
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
  // 背景图
  let img_url_arr = [
  // ✨博天·API  mobile:竖屏 pc:横屏
  "https://api.btstu.cn/sjbz/api.php",
  "https://api.btstu.cn/sjbz/api.php?method=pc&lx=meizi",
  "https://api.btstu.cn/sjbz/api.php?method=pc&lx=dongman",
  "https://api.btstu.cn/sjbz/api.php?method=pc&lx=fengjing",
  // ✨Uomg·API img1:横屏  随机/美女/汽车/二次元/动漫
  "https://api.uomg.com/api/rand.img1",
  "https://api.uomg.com/api/rand.img1?sort=%E7%BE%8E%E5%A5%B3&format=images",
  "https://api.uomg.com/api/rand.img1?sort=%E6%B1%BD%E8%BD%A6&format=images",
  "https://api.uomg.com/api/rand.img1?sort=%E4%BA%8C%E6%AC%A1%E5%85%83&format=images",
  "https://api.uomg.com/api/rand.img1?sort=%E5%8A%A8%E6%BC%AB&format=images",
  // img2:竖屏  随机/美女/二次元/腿控
  //"https://api.uomg.com/api/rand.img2",
  //"https://api.uomg.com/api/rand.img2?sort=%E7%BE%8E%E5%A5%B3&format=images",
  //"https://api.uomg.com/api/rand.img2?sort=%E4%BA%8C%E6%AC%A1%E5%85%83&format=images",
  //"https://api.uomg.com/api/rand.img2?sort=%E8%85%BF%E6%8E%A7&format=images",
  // avatar:头像  方形 女/男
  "https://api.uomg.com/api/rand.avatar?sort=%E5%A5%B3&format=images",
  // ✨小歪·API  横屏 风景
  //"https://api.ixiaowai.cn/gqapi/gqapi.php",
  // ✨动漫星空·API  横屏 ACG
  //"https://api.dongmanxingkong.com/suijitupian/acg/1080p/index.php?",//失效
  // ✨Loli·API  横屏 ACG
  //"https://api.loli.bj/api",
  // ✨接口互联·API  横竖屏
  "https://api88.net/api/img/rand/",
  //"https://api88.net/api/img/rand/?rand_type=rand_mz",//含动图
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
Script.setWidget(widget)
// 完成脚本
Script.complete()
// 预览

//############### 创建小组件内容 ###############

async function createWidget() {
  let widget = new ListWidget()

//写入当前时间
  widget.addSpacer()
  let Now = widget.addDate(new Date())
  Now.date = new Date(new Date(new Date().toLocaleDateString()).getTime())
  Now.applyTimerStyle()
  Now.font = new Font('AvenirNext-Heavy',30)
//细AvenirNext-UltraLight HelveticaNeue-UltraLight
//中Avenir-Light AvenirNext-Regular Arial-BoldMT Verdana ChalkboardSE-Light DBLCDTempBlack 
//粗GillSans-UltraBold AvenirNext-Heavy Futura-CondensedExtraBold
  Now.textColor = new Color("ffffff")
//白ffffff 黄ffcd00 荧绿f0ff21 淡蓝B8F3FF 浅紫C4B8FF
  Now.textOpacity = 1 //文本不透明度
  Now.leftAlignText() //center right
  Now.shadowColor = new Color("000000") //阴影颜色
  Now.shadowRadius = 1  //阴影半径
  Now.shadowOffset = new Point(0, 0) //阴影偏移
  //widget.addSpacer()
  
//写入公历/农历/节日
  //widget.addSpacer()
  let full = widget.addText(str + '·' + `${lunarJoinInfo}`)
  full.font = Font.lightSystemFont(14)//light  medium
  //full.font = new Font('Avenir-Light',14)
  full.textColor = new Color("ffffff")
  full.textOpacity = 1 //文本不透明度
  full.leftAlignText()
  full.shadowColor = new Color("000000") //阴影颜色
  full.shadowRadius = 2  //阴影半径
  full.shadowOffset = new Point(0, 0) //阴影偏移
  //widget.addSpacer()
        
  return widget
 }

//获取农历时间
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

// Crop an image into the specified rect.
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

// Pixel sizes and positions for widgets on all supported phones.
function phoneSizes() {
  let phones = {
    "2340": { // 12mini
      "小号": 436,
      "中号": 936,
      "大号": 980,
      "左边": 72,
      "右边": 570,
      "顶部": 212,
      "中间": 756,
      "底部": 1300,
    },

    "2532": { // 12/12 Pro
      "小号": 472,
      "中号": 1012,
      "大号": 1058,
      "左边": 78,
      "右边": 618,
      "顶部": 230,
      "中间": 818,
      "底部": 1408,
    },

    "2778": { // 12 Pro Max
      "小号": 518,
      "中号": 1114,
      "大号": 1162,
      "左边": 86,
      "右边": 678,
      "顶部": 252,
      "中间": 898,
      "底部": 1544,
    },

    "2688": {
      "小号": 507,
      "中号": 1080,
      "大号": 1137,
      "左边": 81,
      "右边": 654,
      "顶部": 228,
      "中间": 858,
      "底部": 1488
    },

    "1792": {
      "小号": 338,
      "中号": 720,
      "大号": 758,
      "左边": 54,
      "右边": 436,
      "顶部": 160,
      "中间": 580,
      "底部": 1000
    },

    "2436": {
      "小号": 465,
      "中号": 987,
      "大号": 1035,
      "左边": 69,
      "右边": 591,
      "顶部": 213,
      "中间": 783,
      "底部": 1353
    },

    "2208": {
      "小号": 471,
      "中号": 1044,
      "大号": 1071,
      "左边": 99,
      "右边": 672,
      "顶部": 114,
      "中间": 696,
      "底部": 1278
    },

    "1334": {
      "小号": 296,
      "中号": 642,
      "大号": 648,
      "左边": 54,
      "右边": 400,
      "顶部": 60,
      "中间": 412,
      "底部": 764
    },

    "1136": {
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
