// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: calendar-plus;
class Im3xWidget {

  currentDate() {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var week = date.getDay()
    var weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return {
      MM年dd日: month + "月" + day + "日",
      yyyy年MM年dd日: year + "年" + month + "月" + day + "日",
      week: weekArr[week],
      isFriday: week == 5,
      nextFriday: (5 - week + 7) % 7
    }
  }

  /**
   * 初始化
   * @param arg 外部传递过来的参数
   */
  constructor(arg) {
    this.arg = arg
    this.widgetSize = config.widgetFamily
  }

  /**
   * 渲染组件
   */
  async render() {
    if (this.widgetSize === 'medium') {
      return await this.renderMedium()
    } else if (this.widgetSize === 'large') {
      return await this.renderLarge()
    } else {
      return await this.renderSmall()
    }
  }

  async createBasicWidget(dateStr, week) {
    let widget = new ListWidget()
    widget.url = 'calshow://'
    widget.setPadding(0, 10, 0, 10)

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
  //"https://api.uomg.com/api/rand.avatar?sort=%E5%A5%B3&format=images",
  // ✨接口互联·API  横竖屏
  "https://api88.net/api/img/rand/",
  //"https://api88.net/api/img/rand/?rand_type=rand_mz",//含动图
  "https://api88.net/api/bing/rand",
  // ✨小歪·API  横屏 风景
  "https://api.ixiaowai.cn/gqapi/gqapi.php",
  // ✨动漫星空·API  横屏 ACG
  "https://api.dongmanxingkong.com/suijitupian/acg/1080p/index.php?",
  // ✨Loli·API  横屏 ACG
  "https://api.loli.bj/api",
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
    const req = new Request(img_url)
    let image = await req.loadImage()
    widget.backgroundImage = image

    // 时间
    var date = widget.addStack()
    var dateText = date.addText(dateStr)
    dateText.font = Font.lightSystemFont(13)
    dateText.textColor = new Color("#FFFFFF")
    // 字体阴影颜色
    dateText.shadowColor = new Color("000000")
    // 阴影半径
    dateText.shadowRadius = 1.5
    //阴影的偏移量
    dateText.shadowOffset = new Point(0, 0)
    date.addSpacer(3)
    
    var weekText = date.addText(week)
    weekText.font = Font.lightSystemFont(13)
    weekText.textColor = Color.yellow()
    // 字体阴影颜色
    weekText.shadowColor = new Color("000000")
    // 阴影半径
    weekText.shadowRadius = 1.5
    //阴影的偏移量
    weekText.shadowOffset = new Point(0, 0)
    widget.addSpacer(3)

    var question = widget.addText("今天是周五吗")
    question.font = Font.lightSystemFont(16)
    question.textColor = new Color("#FFFFFF")
    // 字体阴影颜色
    question.shadowColor = new Color("000000")
    // 阴影半径
    question.shadowRadius = 1.5
    //阴影的偏移量
    question.shadowOffset = new Point(0, 0)
    return widget
  }

  /**
   * 渲染小尺寸组件
   */
  async renderSmall() {
    var current = this.currentDate()
    let widget = await this.createBasicWidget(current.MM年dd日, current.week)

    widget.addSpacer(60)

    var answer
    if (current.isFriday) {
      answer = widget.addText('周五啦～🥳')
      answer.textColor = new Color("#F79709")
    } else {
      answer = widget.addText('不是😶')
    }
    answer.textColor = new Color("#FFFFFF")
    answer.font = Font.lightSystemFont(28)
    // 字体阴影颜色
    answer.shadowColor = new Color("000000")
    // 阴影半径
    answer.shadowRadius = 1.5
    //阴影的偏移量
    answer.shadowOffset = new Point(0, 0)
    return widget
  }

  /**
   * 渲染中尺寸组件
   */
  async renderMedium() {
    var current = this.currentDate()
    let widget = await this.createBasicWidget(current.yyyy年MM年dd日, current.week)

    widget.addSpacer(60)

    var answer
    if (current.isFriday) {
      answer = widget.addText('周五啦～🥳')
      answer.textColor = new Color("#F79709")
      answer.font = Font.lightSystemFont(30)
    } else {
      answer = widget.addText('不是😶，还有' + current['nextFriday'] + '天')
      answer.textColor = new Color("#FFFFFF")
      answer.font = Font.lightSystemFont(28)
    }
    // 字体阴影颜色
    answer.shadowColor = new Color("000000")
    // 阴影半径
    answer.shadowRadius = 1.5
    //阴影的偏移量
    answer.shadowOffset = new Point(0, 0)
    return widget
  }

  /**
   * 渲染大尺寸组件
   */
  async renderLarge() {
    return await this.renderMedium()
  }

  /**
   * 加载远程图片
   * @param url string 图片地址
   * @return image
   */
  async getImage(url) {
    try {
      let req = new Request(url)
      return await req.loadImage()
    } catch (e) {
      return null
    }
  }

  /**
   * 给图片加上半透明遮罩
   * @param img 要处理的图片对象
   * @return image
   */
  async shadowImage(img) {
    let ctx = new DrawContext()
    ctx.size = img.size
    ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
    // 图片遮罩颜色、透明度设置
    ctx.setFillColor(new Color("#000000", 0.2))
    ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
    return await ctx.getImage()
  }

  /**
   * 编辑测试使用
   */
  async test() {
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
  async init() {
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
