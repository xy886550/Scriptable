// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: user-astronaut;
/**
 * Author：LSP
 * Date：2020-12-04
 */

//------------------------------------------------
// 脚本名字
const name = Script.name()
// 文件
const fm = FileManager.local()
//------------------------------------------------
// 选定热榜
let hotNameArr = [
    { name: "微博" },
    { name: "知乎" },
    { name: "36氪" },
    { name: "少数派" },
    { name: "虎嗅网" },
    { name: "IT之家" },
    { name: "V2EX" },
    { name: "爱范儿AppSolution" },
    { name: "微信读书" },
]

//------------------------------------------------

// 配置
const widgetConfigs = {
    // 内容上边距
    contentTopPadding: 10,
    // 内容左边距
    contentLeftPadding: 14,
    // 内容下边距
    contentBottomPadding: 10,
    // 内容右边距
    contentRightPadding: 0,
    // 自动匹配模式，该模式下榜单标题大小写死，榜单条数自动调整
    autoMode: true,
    // 大组件可以显示多少行
    bigRowMaxCount: 7,
    // 中组件可以显示多少行
    mediumRowMaxCount: 4,
    // 热榜显示条数
    limit: 6,
    // 榜单logo大小
    logoSize: 18,
    // logo圆角
    logoRadius: 4,
    // 热搜榜来源标题字体
    sourceTitleFont: Font.systemFont(15),
    // 热搜榜来源标题颜色，后面的数字表示透明度
    sourceTitleColor: new Color("FFFFFF", 0.8),
    // 榜单标题序号字体
    titleNumFont: Font.italicSystemFont(15),
    // 榜单标题字体
    titleFont: Font.systemFont(13),
    // 榜单标题颜色，后面的数字表示透明度
    titleColor: new Color("FFFFFF", 0.7),
    // 前三名榜单数字颜色
    frontTitleColor: new Color("EA4041", 0.8),
    // 榜单标题之间的间距
    titleMargin: 10,
    // 热榜标题最多显示多少行，默认1行，超出部分省略号
    titleLineLimit: 1,
    // 组件背景色
    widgetBackgroundColor: new Color("000000", 0.9),
    // 组件是否使用图片作为背景
    widgetUsePicBackground: true,
    // 组件图片背景缓存
    widgetPicBgCacheKey: "picBgCache",
    // 组件使用背景图片时候，在图片上层的蒙版颜色
    widgetShadowPicBgColor: new Color("000000", 0.5),
    // 热榜轮播索引key
    hot_name_index_key: "hot_index_key",
    // 数据缓存名
    dataCacheKey: "topHub",
    // 微博热榜打开方式：0-》浏览器，1-》微博客户端，2-》微博国际版客户端，3-》vvebo客户端
    weiboOpenType: 0,
    // logo对应的图片
    logoArr: [{
        index: 0,
        name: "微博",
        logo: "https://file.ipadown.com/tophub/assets/images/media/s.weibo.com.png_50x50.png"
    }, {
        index: 1,
        name: "知乎",
        logo: "https://file.ipadown.com/tophub/assets/images/media/zhihu.com.png_50x50.png"
    }, {
        index: 2,
        name: "微信",
        logo: "https://file.ipadown.com/tophub/assets/images/media/mp.weixin.qq.com.png_50x50.png"
    }, {
        index: 3,
        name: "百度",
        logo: "https://file.ipadown.com/tophub/assets/images/media/baidu.com.png_50x50.png"
    }, {
        index: 4,
        name: "36氪",
        logo: "https://file.ipadown.com/tophub/assets/images/media/36kr.com.png_50x50.png"
    }, {
        index: 5,
        name: "少数派",
        logo: "https://file.ipadown.com/tophub/assets/images/media/sspai.com.png_50x50.png"
    }, {
        index: 6,
        name: "虎嗅网",
        logo: "https://file.ipadown.com/tophub/assets/images/media/huxiu.com.png_50x50.png"
    }, {
        index: 7,
        name: "IT之家",
        logo: "https://file.ipadown.com/tophub/assets/images/media/ithome.com.png_50x50.png"
    }, {
        index: 8,
        name: "哔哩哔哩",
        logo: "https://file.ipadown.com/tophub/assets/images/media/bilibili.com.png_50x50.png"
    }, {
        index: 9,
        name: "抖音",
        logo: "https://file.ipadown.com/tophub/assets/images/media/iesdouyin.com.png_50x50.png"
    }, {
        index: 10,
        name: "煎蛋",
        logo: "https://file.ipadown.com/tophub/assets/images/media/jandan.net.png_50x50.png"
    }, {
        index: 11,
        name: "豆瓣小组",
        logo: "https://file.ipadown.com/tophub/assets/images/media/douban.com.png_50x50.png"
    }, {
        index: 12,
        name: "吾爱破解",
        logo: "https://file.ipadown.com/tophub/assets/images/media/52pojie.cn.png_50x50.png"
    }, {
        index: 13,
        name: "百度贴吧",
        logo: "https://file.ipadown.com/tophub/assets/images/media/tieba.baidu.com.png_50x50.png"
    }, {
        index: 14,
        name: "V2EX",
        logo: "https://file.ipadown.com/tophub/assets/images/media/v2ex.com.png_50x50.png"
    }, {
        index: 15,
        name: "天涯",
        logo: "https://file.ipadown.com/tophub/assets/images/media/bbs.tianya.cn.png_50x50.png"
    }, {
        index: 16,
        name: "淘宝·天猫",
        logo: "https://file.ipadown.com/tophub/assets/images/media/taobao.com.png_50x50.png"
    }, {
        index: 17,
        name: "什么值得买",
        logo: "https://file.ipadown.com/tophub/assets/images/media/smzdm.com.png_50x50.png"
    }, {
        index: 18,
        name: "今日热卖",
        logo: "https://file.ipadown.com/tophub/assets/images/media/remai.today.png_50x50.png"
    }, {
        index: 19,
        name: "拼多多实时热销榜",
        logo: "https://file.ipadown.com/tophub/assets/images/media/p.pinduoduo.com.png_50x50.png"
    }, {
        index: 20,
        name: "雪球",
        logo: "https://file.ipadown.com/tophub/assets/images/media/xueqiu.com.png_50x50.png"
    }, {
        index: 21,
        name: "第一财经",
        logo: "https://file.ipadown.com/tophub/assets/images/media/yicai.com.png_50x50.png"
    }, {
        index: 22,
        name: "财新网",
        logo: "https://file.ipadown.com/tophub/assets/images/media/caixin.com.png_50x50.png"
    }, {
        index: 23,
        name: "新浪财经新闻",
        logo: "https://file.ipadown.com/tophub/assets/images/media/sina.com.cn.png_50x50.png"
    }, {
        index: 24,
        name: "水木社区",
        logo: "https://file.ipadown.com/tophub/assets/images/media/newsmth.net.png_50x50.png"
    }, {
        index: 25,
        name: "北大未名",
        logo: "https://file.ipadown.com/tophub/assets/images/media/bbs.pku.edu.cn.png_50x50.png"
    }, {
        index: 26,
        name: "武大珞珈山水",
        logo: "https://file.ipadown.com/tophub/assets/images/media/bbs.whu.edu.cn.png_50x50.png"
    }, {
        index: 27,
        name: "北师蛋蛋",
        logo: "https://file.ipadown.com/tophub/assets/images/media/oiegg.com.png_50x50.png"
    }, {
        index: 28,
        name: "知乎日报",
        logo: "https://file.ipadown.com/tophub/assets/images/media/daily.zhihu.com.png_50x50.png"
    }, {
        index: 29,
        name: "开眼视频",
        logo: "https://file.ipadown.com/tophub/assets/images/media/kaiyanapp.com.png_50x50.png"
    }, {
        index: 30,
        name: "百度知道日报",
        logo: "https://file.ipadown.com/tophub/assets/images/media/zhidao.baidu.com.png_50x50.png"
    }, {
        index: 31,
        name: "历史上的今天",
        logo: "https://file.ipadown.com/tophub/assets/images/media/lssdjt.com.png_50x50.png"
    }, {
        index: 32,
        name: "高楼迷",
        logo: "https://file.ipadown.com/tophub/assets/images/media/gaoloumi.cc.png_50x50.png"
    }, {
        index: 33,
        name: "地铁族",
        logo: "https://file.ipadown.com/tophub/assets/images/media/ditiezu.com.png_50x50.png"
    }, {
        index: 34,
        name: "宽带山",
        logo: "https://file.ipadown.com/tophub/assets/images/media/kdslife.com.png_50x50.png"
    }, {
        index: 35,
        name: "光谷社区",
        logo: "https://file.ipadown.com/tophub/assets/images/media/guanggoo.com.png_50x50.png"
    }, {
        index: 36,
        name: "豆瓣新片榜",
        logo: "https://file.ipadown.com/tophub/assets/images/media/movie.douban.com.png_50x50.png"
    }, {
        index: 37,
        name: "猫眼国内票房",
        logo: "https://file.ipadown.com/tophub/assets/images/media/maoyan.com.png_50x50.png"
    }, {
        index: 38,
        name: "知乎影视",
        logo: "https://file.ipadown.com/tophub/assets/images/media/zhihu.com.png_50x50.png"
    }, {
        index: 39,
        name: "豆瓣热门剧集",
        logo: "https://file.ipadown.com/tophub/assets/images/media/movie.douban.com.png_50x50.png"
    }, {
        index: 40,
        name: "微信读书",
        logo: "https://file.ipadown.com/tophub/assets/images/media/weread.qq.com.png_50x50.png"
    }, {
        index: 41,
        name: "当当畅销图书",
        logo: "https://file.ipadown.com/tophub/assets/images/media/book.douban.com.png_50x50.png"
    }, {
        index: 42,
        name: "起点中文网24小时热销",
        logo: "https://file.ipadown.com/tophub/assets/images/media/book.qidian.com.png_50x50.png"
    }, {
        index: 43,
        name: "纵横中文网24小时热销",
        logo: "https://file.ipadown.com/tophub/assets/images/media/book.zongheng.com.png_50x50.png"
    }, {
        index: 44,
        name: "TapTap首页推荐",
        logo: "https://file.ipadown.com/tophub/assets/images/media/taptap.com.png_50x50.png"
    }, {
        index: 45,
        name: "3DM游戏网",
        logo: "https://file.ipadown.com/tophub/assets/images/media/3dmgame.com.png_50x50.png"
    }, {
        index: 46,
        name: "机核网",
        logo: "https://file.ipadown.com/tophub/assets/images/media/gcores.com.png_50x50.png"
    }, {
        index: 47,
        name: "游研社",
        logo: "https://file.ipadown.com/tophub/assets/images/media/yystv.cn.png_50x50.png"
    }, {
        index: 48,
        name: "虎扑社区步行街热帖",
        logo: "https://file.ipadown.com/tophub/assets/images/media/bbs.hupu.com.png_50x50.png"
    }, {
        index: 49,
        name: "知乎体育热榜",
        logo: "https://file.ipadown.com/tophub/assets/images/media/zhihu.com.png_50x50.png"
    }, {
        index: 50,
        name: "微信‧体育24h热文榜",
        logo: "https://file.ipadown.com/tophub/assets/images/media/mp.weixin.qq.com.png_50x50.png"
    }, {
        index: 51,
        name: "新浪热点体育榜",
        logo: "https://file.ipadown.com/tophub/assets/images/media/rank.sinanews.sina.cn.png_50x50.png"
    }, {
        index: 52,
        name: "人人都是产品经理",
        logo: "https://file.ipadown.com/tophub/assets/images/media/woshipm.com.png_50x50.png"
    }, {
        index: 53,
        name: "鸟哥笔记周榜",
        logo: "https://file.ipadown.com/tophub/assets/images/media/niaogebiji.com.png_50x50.png"
    }, {
        index: 54,
        name: "产品100周榜",
        logo: "https://file.ipadown.com/tophub/assets/images/media/chanpin100.com.png_50x50.png"
    }, {
        index: 55,
        name: "Product Hunt今日新产品",
        logo: "https://file.ipadown.com/tophub/assets/images/media/producthunt.com.png_50x50.png"
    }, {
        index: 56,
        name: "GitHub Trending Today",
        logo: "https://file.ipadown.com/tophub/assets/images/media/github.com.png_50x50.png"
    }, {
        index: 57,
        name: "CSDN论坛技术区热帖",
        logo: "https://file.ipadown.com/tophub/assets/images/media/bbs.csdn.net.png_50x50.png"
    }, {
        index: 58,
        name: "掘金本周最热",
        logo: "https://file.ipadown.com/tophub/assets/images/media/juejin.im.png_50x50.png"
    }, {
        index: 59,
        name: "开发者头条",
        logo: "https://file.ipadown.com/tophub/assets/images/media/toutiao.io.png_50x50.png"
    }, {
        index: 60,
        name: "中国iPhone App免费榜",
        logo: "https://file.ipadown.com/tophub/assets/images/media/itunes.apple.com.png_50x50.png"
    }, {
        index: 61,
        name: "爱范儿AppSolution",
        logo: "https://file.ipadown.com/tophub/assets/images/media/ifanr.com.png_50x50.png"
    }, {
        index: 62,
        name: "TapTap排行榜",
        logo: "https://file.ipadown.com/tophub/assets/images/media/taptap.com.png_50x50.png"
    }, {
        index: 63,
        name: "最美应用",
        logo: "https://file.ipadown.com/tophub/assets/images/media/zuimeia.com.png_50x50.png"
    }, {
        index: 64,
        name: "汽车之家精选日报",
        logo: "https://file.ipadown.com/tophub/assets/images/media/club.autohome.com.cn.png_50x50.png"
    }, {
        index: 65,
        name: "老司机24小时热门",
        logo: "https://file.ipadown.com/tophub/assets/images/media/laosiji.com.png_50x50.png"
    }, {
        index: 66,
        name: "易车网7日视频排行",
        logo: "https://file.ipadown.com/tophub/assets/images/media/vc.yiche.com.png_50x50.png"
    }, {
        index: 67,
        name: "太平洋汽车网",
        logo: "https://file.ipadown.com/tophub/assets/images/media/bbs.pcauto.com.cn.png_50x50.png"
    }, {
        index: 68,
        name: "先知社区精华推荐",
        logo: "https://file.ipadown.com/tophub/assets/images/media/xz.aliyun.com.png_50x50.png"
    }, {
        index: 69,
        name: "看雪论坛精华",
        logo: "https://file.ipadown.com/tophub/assets/images/media/bbs.pediy.com.png_50x50.png"
    }, {
        index: 70,
        name: "安全客",
        logo: "https://file.ipadown.com/tophub/assets/images/media/anquanke.com.png_50x50.png"
    }, {
        index: 71,
        name: "FreeBuf",
        logo: "https://file.ipadown.com/tophub/assets/images/media/freebuf.com.png_50x50.png"
    },],
}
//------------------------------------------------



//------------------------------------------------
// logo缓存目录
let logo_cache_path = fm.joinPath(fm.documentsDirectory(), `lsp-logo-cache-${name}`)
// 组件图片背景缓存目录
let bg_pic_cache_path = fm.joinPath(fm.documentsDirectory(), `lsp-bg_pic-cache-${name}`)
//------------------------------------------------



//------------------------------------------------
// 热榜索引
const hot_size = hotNameArr.length
let hot_index = 0
const hot_name_index_key = widgetConfigs.hot_name_index_key
if (Keychain.contains(hot_name_index_key)) {
    const last = Keychain.get(hot_name_index_key)
    hot_index = parseInt(last)
}
if (hot_index >= hot_size) {
    hot_index = 0
}
// 当前轮播热榜
let hotName = hotNameArr[hot_index].name
//------------------------------------------------



//------------------------------------------------
// 绘制图片阴影浮层
async function loadShadowColor2Image(img, shadowColor) {
    let drawContext = new DrawContext()
    drawContext.size = img.size
    // 把图片画上去
    drawContext.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
    // 填充蒙版颜色
    drawContext.setFillColor(shadowColor)
    // 填充
    drawContext.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
    return await drawContext.getImage()
}
//------------------------------------------------




//------------------------------------------------
// 选中的热榜
let selectedHotEntity = undefined
for (let logoElement of widgetConfigs.logoArr) {
    if (logoElement.name == hotName) {
        selectedHotEntity = logoElement
        break
    }
}
// 不存在这个热榜
if (selectedHotEntity == undefined) {
    return
}
//////////////////////////////////////////////////////////////
/**
 * 请求初始化
 */
const request = new Request("https://tophub.today/")
const defaultHeaders = {
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36"
}
request.method = 'GET'
request.headers = defaultHeaders
// 热榜数据
let response = undefined
try {
    const html = await request.loadString()
    let webview = new WebView()
    await webview.loadHTML(html)
    // 通过dom操作把HTML里面的热榜内容提取出来
    var getData = `
    function getData() {
        allDataArr = document.querySelectorAll('.bc .cc-cd')
        singleItemData = allDataArr[${selectedHotEntity.index}]
        tagAData = singleItemData.querySelectorAll('a')
        
        // 标题
        titleArr = []
        for (item of tagAData) {
          titleArr.push(item.innerText)
        }
        titleArr.shift()
        
        // 链接
        linkArr = []
        tagAData[1].parentNode.innerHTML.replace(/<a [^>]*href=['"]([^'"]+)[^>]*/gi,function(match,capture){
            linkArr.push(capture)
        });
    
        return {titleArr:titleArr, linkArr:linkArr}
    }
    
    getData()
    `
    // 热榜数据
    response = await webview.evaluateJavaScript(getData, false)
    // 缓存请求数据
    Keychain.set(widgetConfigs.dataCacheKey, JSON.stringify(response))
    // 保存轮播索引
    Keychain.set(hot_name_index_key, `${hot_index + 1}`)
} catch (error) {
    if (Keychain.contains(widgetConfigs.dataCacheKey)) {
        response = JSON.parse(Keychain.get(widgetConfigs.dataCacheKey))
    }
}


//////////////////////////////////////////////////////////////
/**
 * 数据接入小组件
 */
const widget = new ListWidget()
widget.setPadding(widgetConfigs.contentTopPadding, widgetConfigs.contentLeftPadding, widgetConfigs.contentBottomPadding, widgetConfigs.contentRightPadding)
// 热榜标题stack
const sourceStack = widget.addStack()
sourceStack.size = new Size(300, 30)
sourceStack.layoutHorizontally()
sourceStack.centerAlignContent()
// logo链接
request.url = selectedHotEntity.logo
let logoImg = undefined
try {
    logoImg = await request.loadImage()
    // logo写入缓存
    fm.writeImage(logo_cache_path, logoImg)
} catch (error) {
    // 读取上次logo的缓存
    logoImg = fm.readImage(logo_cache_path)
}
let logoWidgetImg = sourceStack.addImage(logoImg)
logoWidgetImg.imageSize = new Size(widgetConfigs.logoSize, widgetConfigs.logoSize)
// 圆角
logoWidgetImg.cornerRadius = widgetConfigs.logoRadius
// logo、标题间距
sourceStack.addSpacer(6)
// 热榜标题
let sourceTitleWidgetText = sourceStack.addText(selectedHotEntity.name)
sourceTitleWidgetText.font = widgetConfigs.sourceTitleFont
sourceTitleWidgetText.textColor = widgetConfigs.sourceTitleColor
// 靠左
sourceStack.addSpacer()
// 标题
const titleArr = response.titleArr
// 榜单链接
const linkArr = response.linkArr
// 榜单条数
let limitCount = widgetConfigs.limit
// 序号字体
let titleNumFont = widgetConfigs.titleNumFont
// 榜单字体
let titleFont = widgetConfigs.titleFont
// 每条榜单显示的行数
titleLineLimit = widgetConfigs.titleLineLimit

// 自动匹配模式
if (widgetConfigs.autoMode) {
    // 写死字号
    titleNumFont = Font.italicSystemFont(15)
    titleFont = Font.systemFont(13)
    titleLineLimit = 10

    // 小组件尺寸
    const widgetSize = config.widgetFamily
    // 最多行数
    let maxRowCount = widgetConfigs.bigRowMaxCount
    if (widgetSize == "medium") {
        maxRowCount = widgetConfigs.mediumRowMaxCount
    } else {
        const lineMax = 9
        let tempRowCount = 0
        for (let index = 0; index < widgetConfigs.bigRowMaxCount; index++) {
            const titleElement = titleArr[index];
            const rowCount = Math.floor(titleElement.length / 20)
            tempRowCount = tempRowCount + rowCount
        }
        if (tempRowCount < lineMax) {
            maxRowCount = lineMax
        }
    }
    // 确定行数
    limitCount = maxRowCount
}


// 越界判断
if (limitCount > titleArr.length) {
    limitCount = titleArr.length
}
for (let index = 0; index < limitCount; index++) {
    const titleElement = titleArr[index];
    const titleEleArr = titleElement.split("\n")
    // 标题
    const title = titleEleArr[1]
    // 链接
    let linkElement = linkArr[index];
    if (widgetConfigs.autoMode) {
        widget.addSpacer()
    } else {
        widget.addSpacer(widgetConfigs.titleMargin)
    }
    // 热搜标题
    const titleStack = widget.addStack()
    if (hotName.search("微博") != -1) {
        const weiboOpenType = widgetConfigs.weiboOpenType
        if (weiboOpenType == 1) {
            // 微博客户端
            linkElement = 'sinaweibo://searchall?q=' + encodeURIComponent(`#${title}#`)
        } else if (weiboOpenType == 2) {
            // 微博国际版客户端
            linkElement = 'weibointernational://search?q=' + encodeURIComponent(`#${title}#`)
        } else if (weiboOpenType == 3) {
            // vvebo微博客户端
            linkElement = 'vvebo://search?q=' + encodeURIComponent(`#${title}#`)
        }
    }
    titleStack.url = linkElement
    titleStack.layoutHorizontally()
    const titleNumWidgetText = titleStack.addText(`${index + 1}`)
    titleNumWidgetText.font = widgetConfigs.titleNumFont
    if (index < 3) {
        titleNumWidgetText.textColor = widgetConfigs.frontTitleColor
    } else {
        titleNumWidgetText.textColor = widgetConfigs.titleColor
    }
    titleStack.addSpacer(8)
    const titleWidgetText = titleStack.addText(`${title}`)
    titleWidgetText.font = widgetConfigs.titleFont
    titleWidgetText.textColor = widgetConfigs.titleColor
    titleWidgetText.lineLimit = titleLineLimit
    // 靠左
    titleStack.addSpacer()
}
// 使用颜色还是图片
if (widgetConfigs.widgetUsePicBackground) {
    // 图片背景
    let widgetBgImg = undefined
    if (config.runsInApp) {
        // 图库选择图片
        widgetBgImg = await Photos.fromLibrary()
        // 图片背景写入缓存
        fm.writeImage(bg_pic_cache_path, widgetBgImg)
    } else {
        // 缓存中读取图片
        widgetBgImg = fm.readImage(bg_pic_cache_path)
    }
    // 设置背景图
    widget.backgroundImage = await loadShadowColor2Image(widgetBgImg, widgetConfigs.widgetShadowPicBgColor)
} else {
    // 组件背景颜色
    widget.backgroundColor = widgetConfigs.widgetBackgroundColor
}
widget.addSpacer()
widget.refreshAfterDate = new Date(30*1000)
// 完成进行预览
widget.presentLarge()
Script.setWidget(widget)
Script.complete()
