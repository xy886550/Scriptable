// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: angle-double-right;
// v2ex for scriptables
// author:hack_fish
// 项目地址：https://github.com/im3x/Scriptables
// 功能说明：调用v2ex的官方api，展示最新、最热的内容，点击后跳转相应URL
// 参数列表：
// v2ex@api:hot
// v2ex@api:latest（默认）
// 

class Im3xWidget {
  // 初始化，接收参数
  constructor (arg, loader) {
    this.arg = 'latest'
    this.loader = loader
    this.fileName = module.filename.split('Documents/')[1]
    this.widgetSize = config.widgetFamily
    if (arg === 'hot') this.arg = 'hot'
  }
  // 渲染组件
  async render () {
    if (this.widgetSize === 'medium') {
      return await this.renderMedium()
    } else if (this.widgetSize === 'large') {
      return await this.renderLarge()
    } else {
      return await this.renderSmall()
    }
  }
  async renderSmall () {
    let w = new ListWidget()
    let data = await this.getData()
    let topic = data[0]
    w.url = this.loader ? this.getURIScheme('open-url', {
      url: topic['url']
    }) : topic['url']
    w = await this.renderHeader(w)
    let content = w.addText(topic['title'])
    content.font = Font.lightSystemFont(16)
    content.textColor = Color.white()
    content.lineLimit = 3

    w.backgroundImage = await this.shadowImage(await this.getImage(topic['member']['avatar_large'].replace('mini', 'large')))

    w.addSpacer(10)
    let footer = w.addText(`@${topic['member']['username']} / ${topic['node']['title']}`)
    footer.font = Font.lightSystemFont(10)
    footer.textColor = Color.white()
    footer.textOpacity = 0.5
    footer.lineLimit = 1
    return w
  }
  // 中尺寸组件
  async renderMedium () {
    let w = new ListWidget()
    let data = await this.getData()
    w.addSpacer(10)
    w = await this.renderHeader(w, false)
    for (let i = 0; i < 2; i ++) {
      w = await this.renderCell(w, data[i])
      w.addSpacer(5)
    }

    return w
  }
  // 大尺寸组件
  async renderLarge () {
    let w = new ListWidget()
    let data = await this.getData()
    w.addSpacer(10)
    w = await this.renderHeader(w, false)
    for (let i = 0; i < 5; i ++) {
      w = await this.renderCell(w, data[i])
      w.addSpacer(10)
    }

    return w
  }
  async renderCell (widget, topic) {
    let body = widget.addStack()
    body.url = this.loader ? this.getURIScheme('open-url', {
      url: topic['url']
    }) : topic['url']

    let left = body.addStack()
    let avatar = left.addImage(await this.getImage(topic['member']['avatar_large'].replace('mini', 'large')))
    avatar.imageSize = new Size(35, 35)
    avatar.cornerRadius = 5

    body.addSpacer(10)

    let right = body.addStack()
    right.layoutVertically()
    let content = right.addText(topic['title'])
    content.font = Font.lightSystemFont(14)
    content.lineLimit = 2

    right.addSpacer(5)

    let info = right.addText(`@${topic['member']['username']} / ${topic['node']['title']}`)
    info.font = Font.lightSystemFont(10)
    info.textOpacity = 0.6
    info.lineLimit = 2

    widget.addSpacer(10)

    return widget
  }
  async renderHeader (widget, customStyle = true) {
    let _icon = await this.getImage("https://www.v2ex.com/static/img/icon_rayps_64.png")
    let _title = "V2EX·" + (this.arg === 'hot' ? '最热' : '最新')

    let header = widget.addStack()
    header.centerAlignContent()
    let icon = header.addImage(_icon)
    icon.imageSize = new Size(14, 14)
    icon.cornerRadius = 4
    header.addSpacer(10)
    let title = header.addText(_title)
    if (customStyle) title.textColor = Color.white()
    title.textOpacity = 0.7
    title.font = Font.boldSystemFont(12)
    
    widget.addSpacer(15)
    return widget
  }
    /**
   * 用户传递的组件自定义点击操作
   */
  async runActions () {
    let { act, data } = this.parseQuery()
    if (!act) return
    if (act === 'open-url') {
      Safari.openInApp(data['url'], false)
    }
  }

  // 获取跳转自身 urlscheme
  // w.url = this.getURIScheme("copy", "data-to-copy")
  getURIScheme (act, data) {
    let _raw = typeof data === 'object' ? JSON.stringify(data) : data
    let _data = Data.fromString(_raw)
    let _b64 = _data.toBase64String()
    return `scriptable:///run?scriptName=${encodeURIComponent(Script.name())}&act=${act}&data=${_b64}&__widget__=${encodeURIComponent(args['widgetParameter'])}`
  }
  // 解析 urlscheme 参数
  // { act: "copy", data: "copy" }
  parseQuery () {
    const { act, data } = args['queryParameters']
    if (!act) return { act }
    let _data = Data.fromBase64String(data)
    let _raw = _data.toRawString()
    let result = _raw
    try {
      result = JSON.parse(_raw)
    } catch (e) {}
    return {
      act,
      data: result
    }
  }
  // 获取远程图片
  async getImage (url) {
    try {
      let req = new Request(url)
      return await req.loadImage()
    } catch (e) {
      let ctx = new DrawContext()
      ctx.size = new Size(100, 100)
      ctx.setFillColor(Color.red())
      ctx.fillRect(new Rect(0, 0, 100, 100))
      return await ctx.getImage()
    }
  }
  // 给图片加透明遮罩
  async shadowImage (img) {
    let ctx = new DrawContext()
    // 获取图片的尺寸
    ctx.size = img.size
    
    ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
    ctx.setFillColor(new Color("#000000", 0.7))
    ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
    
    let res = await ctx.getImage()
    return res
  }
  // 加载数据
  async getData () {
    let api = `https://www.v2ex.com/api/topics/${this.arg}.json`
    let data = await this.fetchAPI(api)
    return data
  }
  async fetchAPI (api, json = true) {
    let data = null
    const cacheKey = `${this.fileName}_cache`
    try {
      let req = new Request(api)
      data = await (json ? req.loadJSON() : req.loadString())
    } catch (e) {}
    // 判断数据是否为空（加载失败）
    if (!data) {
      // 判断是否有缓存
      if (Keychain.contains(cacheKey)) {
        let cache = Keychain.get(cacheKey)
        return json ? JSON.parse(cache) : cache
      } else {
        // 刷新
        return null
      }
    }
    // 存储缓存
    Keychain.set(cacheKey, json ? JSON.stringify(data) : data)
    return data
  }
  // 用于测试
  async test () {
    if (config.runsInWidget) return
    this.widgetSize = 'small'
    let w1 = await this.render()
    await w1.presentSmall()
    this.widgetSize = 'medium'
    let w2 = await this.render()
    await w2.presentMedium()
    this.widgetSize = 'large'
    let w3 = await this.render()
    await w3.presentLarge()
  }
  // 单独运行
  async init () {
    if (!config.runsInWidget) return await this.runActions()
    let widget = await this.render()
    Script.setWidget(widget)
    Script.complete()
  }
}

module.exports = Im3xWidget
// 编辑器中测试
 await new Im3xWidget().test()
// 插件独立运行
 await new Im3xWidget().init()
