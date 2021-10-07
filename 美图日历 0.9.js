// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: images;

/**
* 版本: 0.9
* 更新时间：忘了 修改自Nicolas-kings的 ONE-Today.js（1.4）
*/

//############## 公共参数配置模块 ############## 
const filename = `${Script.name()}.jpg`
const files = FileManager.local()
const path = files.joinPath(files.documentsDirectory(), filename)
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
  top: 2,
  left: 2,
  bottom: 12,
  right: 2
}
let widget = await createWidget()

//############## 设置小组件的背景 ##############

if (colorMode) {
  widget.backgroundColor = COLOR_BAR_BACKGROUND
} else if (ImageMode) {

  // 背景图
  let img_url_arr = [
  // ✨ 博天api 竖屏=mobile 横屏=pc
  "https://api.btstu.cn/sjbz/api.php",
  "https://api.btstu.cn/sjbz/api.php?method=pc&lx=meizi",
  "https://api.btstu.cn/sjbz/api.php?method=pc&lx=dongman",
  "https://api.btstu.cn/sjbz/api.php?method=pc&lx=fengjing",
  // ✨ UomgAPI img1:横屏 随机/美女/汽车/二次元/动漫
  "https://api.uomg.com/api/rand.img1",
  "https://api.uomg.com/api/rand.img1?sort=%E7%BE%8E%E5%A5%B3&format=images",
  "https://api.uomg.com/api/rand.img1?sort=%E6%B1%BD%E8%BD%A6&format=images",
  // img2:竖屏 随机/美女/二次元/腿控
  //"https://api.uomg.com/api/rand.img2",
  //"https://api.uomg.com/api/rand.img2?sort=%E7%BE%8E%E5%A5%B3&format=images",
  //"https://api.uomg.com/api/rand.img2?sort=%E4%BA%8C%E6%AC%A1%E5%85%83&format=images",
  // avatar:头像 女/男
  //"https://api.uomg.com/api/rand.avatar?sort=%E5%A5%B3&format=images",
  // ✨接口互联 mm(横竖屏均有)
  "https://api88.net/api/img/rand/",
  //"https://api88.net/api/img/rand/?rand_type=rand_mz",//含动图
  "https://api88.net/api/bing/rand",
  // ✨ 小歪API·风景横屏
  "https://api.ixiaowai.cn/gqapi/gqapi.php",
  // ✨ 动漫星空 ACG横
  "https://api.dongmanxingkong.com/suijitupian/acg/1080p/index.php?",
  // ✨ LoliAPI ACG横
  //"https://api.loli.bj/api",
  // ✨ MUZI api 横屏
  //"https://api.womc.cn/api/znbz/znbz.php",
  //"https://api.womc.cn/api/meinv/meinv.php",
  //"https://api.womc.cn/api/ACG/api.php",
  //"https://api.shaoyuu.com/duola/mu.php",
  // ✨ Bing
  //"https://area.sinaapp.com/bingImg/"
    ]
    const index = parseInt(Math.random() * img_url_arr.length)
    let img_url = img_url_arr[index]
    const req = new Request(img_url)
    let image = await req.loadImage()
   widget.backgroundImage = await shadowImage(image)
  
  // const url = "https://area.sinaapp.com/bingImg/"   //使用必应壁纸作为背景时，请注释下面
  // // const url = "http://p1.music.126.net/uarVFKgUlrI9Z1nr-50cAw==/109951162843608471.jpg"     //固定一张图片,这里我选用城南花已开的封面,图片不能太大，容易崩溃
  // const i = await new Request(url);
  //bing
  //   const img = await getImageByUrl('https://area.sinaapp.com/bingImg/','https://api.loli.bj/api',  `ONE-Today-bg`, false)
//   widget.backgroundImage = await shadowImage(img)
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
  //widget.addSpacer()
  let Now = widget.addDate(new Date())
  Now.date = new Date(new Date(new Date().toLocaleDateString()).getTime())
  Now.applyTimerStyle()
  Now.font = new Font('AvenirNext-UltraLight',40)
//细AvenirNext-UltraLight HelveticaNeue-UltraLight
//中Avenir-Light
//粗GillSans-UltraBold AvenirNext-Heavy
  Now.textColor = new Color("#ffcd00")//#ffffff
  Now.textOpacity = 0.9 //文本不透明度
  Now.centerAlignText()
  Now.shadowColor = new Color("000000") //阴影颜色
  Now.shadowRadius = 1  //阴影半径
  Now.shadowOffset = new Point(0, 0) //阴影偏移
  widget.addSpacer()
  
//写入公历/农历/节日
  widget.addSpacer()
  let full = widget.addText(str + '·' + `${lunarJoinInfo}`)
  full.font = Font.lightSystemFont(14)
  full.textColor = new Color("#ffffff")
  full.textOpacity = 1 //文本不透明度
  full.centerAlignText()
  full.shadowColor = new Color("000000") //阴影颜色
  full.shadowRadius = 1  //阴影半径
  full.shadowOffset = new Point(0, 0) //阴影偏移
  //widget.addSpacer()
        
  return widget
 }

//############## 事务逻辑处理模块 ################
 
// function addDate(name, size, r) {
//   let stack = r.addStack()
//   stack.layoutVertically()
// 
//   let wname = stack.addText(name)
//   wname.font = Font.semiboldRoundedSystemFont(size)
//   wname.font = new Font('Cabin Sketch', size)
//   wname.textColor = new Color("#ffffff")
// 
//   stack.backgroundColor=new Color("#ccc")
// 
//   if (size === smallsize) {
//     let size = new Size(100, 100)
//     stack.size = size
//     stack.setPadding(0, 0, 0, 0)
//     wname.textColor = new Color("#999", 0.6)
//   }
// }

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

//############## 背景模块-逻辑处理部分 ##############

async function shadowImage(img) {
  let ctx = new DrawContext()
  // 把画布的尺寸设置成图片的尺寸
  ctx.size = img.size
  // 把图片绘制到画布中
  ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
  // 设置绘制的图层颜色，为半透明的黑色
  ctx.setFillColor(new Color('#000000', 0))//0.5
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
