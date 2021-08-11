// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: image;
class Im3xWidget {
  /**
   * 初始化
   * @param arg 外部传递过来的参数
   */
  constructor (arg) {
    this.arg = arg
    this.widgetSize = config.widgetFamily
  }
  /**
   * 渲染组件
   */
  async render () {
    if (this.widgetSize === 'medium') {
      return await this.renderMedium()
    } else if (this.widgetSize === 'large') {
      return await this.renderLarge()
    } else {
      return await this.renderSmall()
    }
  }

  /**
   * 渲染小尺寸组件
   */
  async renderSmall () {
    let w = new ListWidget()
    let data = await this.getData()
    w.backgroundImage = await this.getImage(data['img_url'])
    w.url = data['img_url']
    return w
  }
  /**
   * 渲染中尺寸组件
   */
  async renderMedium () {
    let w = new ListWidget()
    w.addSpacer()
    let data = await this.getData()
    w.backgroundImage = await this.getImage(data['img_url'])
    w.url = data['img_url']
    let t = w.addText(data['title'])
    t.font = Font.lightSystemFont(12)
    t.textColor = Color.white()
    // 字体阴影颜色
    t.shadowColor = new Color("000000")
    // 阴影半径
    t.shadowRadius = 1
    //阴影的偏移量
    t.shadowOffset = new Point(0, 0)
    t.rightAlignText()
    return w
  }
  /**
   * 渲染大尺寸组件
   */
  async renderLarge () {
    let w = new ListWidget()
    w.addSpacer()
    let data = await this.getData()
    w.backgroundImage = await this.getImage(data['img_url'])
    w.url = data['img_url']
    let t = w.addText(data['title'])
    t.font = Font.lightSystemFont(12)
    t.textColor = Color.white()
    // 字体阴影颜色
    t.shadowColor = new Color("000000")
    // 阴影半径
    t.shadowRadius = 1
    //阴影的偏移量
    t.shadowOffset = new Point(0, 0)
    t.centerAlignText()
    return w
  }

  async getData () {
    let idx = parseInt(this.arg)
    if (!Number.isInteger(idx)) idx = 0
    if (idx > 7) idx = 7
    if (idx < 0) idx = 0
    let api = `https://api.sumt.cn/api/bing.php?format=json&idx=${idx}`
//     let api = `https://area.sinaapp.com/bingImg/`
//     let api = `https://cn.bing.com/HPImageArchive.aspx?format=js&idx=${idx}&n=1&mkt=zh-CN`
    let req = new Request(api)
    let res = await req.loadJSON()
    return res
  }

  /**
   * 加载远程图片
   * @param url string 图片地址
   * @return image
   */
  async getImage (url) {
    let req = new Request(url)
    return await req.loadImage()
  }

  /**
   * 给图片加上半透明遮罩
   * @param img 要处理的图片对象
   * @return image
   */
  async shadowImage (img) {
    let ctx = new DrawContext()
    ctx.size = img.size
    ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
    // 图片遮罩颜色、透明度设置
    ctx.setFillColor(new Color("#000000", 0.7))
    ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
    let res = await ctx.getImage()
    return res
  }
  
  /**
   * 编辑测试使用
   */
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
  
  /**
   * 组件单独在桌面运行时调用
   */
  async init () {
    if (!config.runsInWidget) return
    let widget = await this.render()
    Script.setWidget(widget)
    Script.complete()
  }
}

module.exports = Im3xWidget

// 如果是在编辑器内编辑、运行、测试，则取消注释这行，便于调试：
  await new Im3xWidget().test()

// 如果是组件单独使用（桌面配置选择这个组件使用，则取消注释这一行：
  await new Im3xWidget(args.widgetParameter).init()