// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: umbrella-beach;
  let widget = new ListWidget();

  let img_url_arr = [
  // ✨博天·API  mobile:竖屏 pc:横屏
  "https://api.btstu.cn/sjbz/api.php",
  "https://api.btstu.cn/sjbz/api.php?method=mobile&lx=meizi",
  "https://api.btstu.cn/sjbz/api.php?method=mobile&lx=dongman",
  "https://api.btstu.cn/sjbz/api.php?method=mobile&lx=fengjing",
  // ✨Uomg·API img1:横屏  随机/美女/汽车/二次元/动漫
  "https://api.uomg.com/api/rand.img1",
  "https://api.uomg.com/api/rand.img1?sort=%E7%BE%8E%E5%A5%B3&format=images",
  //"https://api.uomg.com/api/rand.img1?sort=%E6%B1%BD%E8%BD%A6&format=images",
  "https://api.uomg.com/api/rand.img1?sort=%E4%BA%8C%E6%AC%A1%E5%85%83&format=images",
  "https://api.uomg.com/api/rand.img1?sort=%E5%8A%A8%E6%BC%AB&format=images",
  // img2:竖屏  随机/美女/二次元/腿控
  "https://api.uomg.com/api/rand.img2",
  "https://api.uomg.com/api/rand.img2?sort=%E7%BE%8E%E5%A5%B3&format=images",
  "https://api.uomg.com/api/rand.img2?sort=%E4%BA%8C%E6%AC%A1%E5%85%83&format=images",
  //"https://api.uomg.com/api/rand.img2?sort=%E8%85%BF%E6%8E%A7&format=images",
  // avatar:头像  方形 女/男
  //"https://api.uomg.com/api/rand.avatar?sort=%E5%A5%B3&format=images",
  // ✨接口互联·API  横竖屏
  "https://api88.net/api/img/rand/",
  "https://api88.net/api/img/rand/?rand_type=rand_mz",//含动图
  "https://img.tjit.net/bing/rand/",
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

  // 预览大/中/小尺寸组件
  widget.presentLarge()
  // widget.presentMedium()
  // widget.presentSmall()

  // 最后这两句直接加上就可以，相当于结束操作
  Script.setWidget(widget)
  Script.complete()