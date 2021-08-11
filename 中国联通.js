// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-brown; icon-glyph: globe;
// Author: 脑瓜
// 电报群：https://t.me/Scriptable_JS @anker1209
// 该脚本小尺寸组件支持两种模式，默认为圆环进度条模式，主屏幕长按小组件-->编辑小组件-->Parameter，输入1，使用文字模式
// 渐变进度条为试验性功能，默认关闭
// version:2.1.0
// update:2021/04/02

if (typeof require === 'undefined') require = importModule;
const {DmYY, Runing} = require('./DmYY');

class Widget extends DmYY {
  constructor(arg) {
    super(arg);
    this.name = '中国联通';
    this.en = 'ChinaUnicom_2021';
    this.logo = 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1ebbd3c-ca49-405b-957b-effe60782276/cbbfab2c-790c-4308-b11f-299ae4311c07.png';
    this.verticalLogo = 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1ebbd3c-ca49-405b-957b-effe60782276/00010042-8cc7-4931-afe2-b65ee49f6374.png';
    this.Run();
  }

  widgetParam = args.widgetParameter;
  cookie = ''; // 推荐使用Boxjs代理缓存，若无请自行手动抓包后在此输入中国联通cookie数据。

  gradient = false;

  flowColorHex = '12A6E4';
  voiceColorHex = 'F86527';

  ringStackSize = 61;
  ringTextSize = 14;
  feeTextSize = 21;
  textSize = 13;
  smallPadding = 16;
  padding = 10;
  logoScale = 0.24;

  canvSize = 178;
  canvWidth = 18;
  canvRadius = 80;

  format = (str) => {
    return parseInt(str) >= 10 ? str : `0${str}`;
  };

  date = new Date();
  arrUpdateTime = [
    this.format(this.date.getMonth() + 1),
    this.format(this.date.getDate()),
    this.format(this.date.getHours()),
    this.format(this.date.getMinutes()),
  ];

  fee = {
    title: '话费剩余',
    number: 0,
    unit: '元',
    en: '¥',
  };
  
  flow = {
    percent: 0,
    title: '已用流量',
    number: 0,
    unit: 'MB',
    en: 'MB',
    icon: 'antenna.radiowaves.left.and.right',
    iconColor: new Color('1ab6f8'),
    FGColor: new Color(this.flowColorHex),
    BGColor: new Color(this.flowColorHex, 0.2),
    colors: [],
  };

  voice = {
    percent: 0,
    title: '语音剩余',
    number: 0,
    unit: '分钟',
    en: 'MIN',
    icon: 'phone.fill',
    iconColor: new Color('30d15b'),
    FGColor: new Color(this.voiceColorHex),
    BGColor: new Color(this.voiceColorHex, 0.2),
    colors: [],
  };
  
  point = {
    title: '剩余积分',
    number: 0,
    unit: '',
    icon: 'tag.fill',
    iconColor: new Color('fc6d6d'),
  }

  init = async () => {
    try {
      await this.getData();
    } catch (e) {
      console.log(e);
    }
  };
  
  async login() {
    const url = 'https://m.client.10010.com/dailylottery/static/textdl/userLogin?version=iphone_c@8.0200&desmobile=';
    try {
      const sign = new Request(url);
      sign.headers = {'cookie': this.cookie};
      const signInfo = await sign.loadString();

      if (signInfo.indexOf('天天抽奖') >= 0 && signInfo.indexOf('请稍后重试') < 0) {
        console.log('用户登录成功');
      } else {
        console.log('用户登录失败');
      }
    } catch (e) {
      console.log('用户登录失败' + e);
    }
  }

  async getData() {
    await this.login();
    const url= 'https://m.client.10010.com/mobileserviceimportant/home/queryUserInfoSeven?version=iphone_c@8.0200&desmobiel=&showType=0';

    try {
      const req = new Request(url);
      req.headers = {'cookie': this.cookie};
      const userInfo = await req.loadJSON();

      if (userInfo.code === 'Y') {
        console.log('获取信息成功');
        console.log(userInfo.data);
        userInfo.data.dataList.forEach((item) => {
          if (item.type === 'fee') {
            if (item.unit ==='万元') {
              this.fee.number = item.number * 10000;
            } else {
              this.fee.number = item.number;
              this.fee.unit = item.unit;
            }
            this.fee.title = item.remainTitle;
          }
          if (item.type === 'flow') {
            this.flow.number = item.number;
            this.flow.unit = item.unit;
            this.flow.en = item.unit;
            this.flow.percent = (100 - item.persent).toFixed(2);
            this.flow.title = item.remainTitle;
          }
          if (item.type === 'voice') {
            this.voice.number = item.number;
            this.voice.unit = item.unit;
            this.voice.percent = (100 - item.persent).toFixed(2);
            this.voice.title = item.remainTitle;
          }
          if (item.type === 'point') {
            this.point.number = item.number;
            this.point.title = item.remainTitle;
          }
        });
      } else {
        throw 'cookie错误/服务器维护';
      }
    } catch (e) {
      console.log('获取信息失败：' + e);
    }
  }

  async smallHeader(stack) {
    const headerStack = stack.addStack();
    headerStack.addSpacer();
    const logo = headerStack.addImage(await this.$request.get(this.logo, 'IMG'));
    logo.imageSize = new Size(415 * this.logoScale, 125 * this.logoScale);
    headerStack.addSpacer();
    stack.addSpacer();

    const feeStack = stack.addStack();
    feeStack.centerAlignContent();
    feeStack.addSpacer();
    const feeValue = feeStack.addText(`${this.fee.number}`);
    feeValue.font = Font.mediumRoundedSystemFont(this.feeTextSize);
    feeValue.textColor = this.widgetColor;
    feeStack.addSpacer();
    stack.addSpacer();
  }

  textLayout(stack, data) {
    const rowStack = stack.addStack();
    rowStack.centerAlignContent();
    const icon = SFSymbol.named(data.icon);
    icon.applyHeavyWeight();
    let iconElement = rowStack.addImage(icon.image);
    iconElement.imageSize = new Size(this.textSize, this.textSize);
    iconElement.tintColor = data.iconColor;
    rowStack.addSpacer(4);
    let title = rowStack.addText(data.title);
    rowStack.addSpacer();
    let number = rowStack.addText(data.number + data.unit);
    ;[title, number].map(t => t.textColor = this.widgetColor);
    ;[title, number].map(t => t.font = Font.systemFont(this.textSize));
  }

  async mediumCell(canvas, stack, data, color, fee = false, percent) {
    const bg = new LinearGradient();
    bg.locations = [0, 1];
    bg.colors = [
    new Color(color, 0.03),
    new Color(color, 0.1)
    ];
    const dataStack = stack.addStack();
    dataStack.backgroundGradient = bg;
    dataStack.cornerRadius = 20;
    dataStack.layoutVertically();
    dataStack.addSpacer();

    const topStack = dataStack.addStack();
    topStack.addSpacer();
    await this.imageCell(canvas, topStack, data, fee, percent);
    topStack.addSpacer();

    if (fee) {
      dataStack.addSpacer(5);
      const updateStack = dataStack.addStack();
      updateStack.addSpacer();
      updateStack.centerAlignContent();
      const updataIcon = SFSymbol.named('arrow.2.circlepath');
      updataIcon.applyHeavyWeight();
      const updateImg = updateStack.addImage(updataIcon.image);
      updateImg.tintColor = new Color(color, 0.6);
      updateImg.imageSize = new Size(10, 10);
      updateStack.addSpacer(3);
      const updateText = updateStack.addText(`${this.arrUpdateTime[2]}:${this.arrUpdateTime[3]}`)
      updateText.font = Font.mediumSystemFont(10);
      updateText.textColor = new Color(color, 0.6);
      updateStack.addSpacer();
      /*
      let tempStack = dataStack.addStack();
      tempStack.layoutVertically()
      let tempStack1 = tempStack.addStack()
      tempStack1.addSpacer()
      let tempText1 = tempStack1.addText(this.flow.colors.toString())
tempStack1.addSpacer()
let tempStack2 = tempStack.addStack()
tempStack2.addSpacer()
      let tempText2 = tempStack2.addText(this.voice.colors.toString())
tempStack2.addSpacer()
      ;[tempText1, tempText2].map(t => t.font = Font.systemFont(6));
      ;[tempText1, tempText2].map(t => t.textColor = updateText.textColor);
      */
    }
    
    dataStack.addSpacer();

    const numberStack = dataStack.addStack();
    numberStack.addSpacer();
    const number = numberStack.addText(`${data.number} ${data.en}`);
    number.font = Font.semiboldSystemFont(15);
    numberStack.addSpacer();

    dataStack.addSpacer(3);

    const titleStack = dataStack.addStack();
    titleStack.addSpacer();
    const title = titleStack.addText(data.title);
    title.font = Font.mediumSystemFont(11);
    title.textOpacity = 0.7;
    titleStack.addSpacer();

    dataStack.addSpacer(15);
    ;[title, number].map(t => t.textColor = new Color(color));
  }

  async imageCell(canvas, stack, data, fee, percent) {
    const canvaStack = stack.addStack();
    canvaStack.layoutVertically();
    if (!fee) {
      this.drawArc(canvas, data.percent * 3.6, data.FGColor, data.BGColor);
      canvaStack.size = new Size(this.ringStackSize, this.ringStackSize);
      canvaStack.backgroundImage = canvas.getImage();
      this.ringContent(canvaStack, data, percent);
    } else {
      canvaStack.addSpacer(10);
      const smallLogo = await this.$request.get(this.verticalLogo, 'IMG');
      const logoStack = canvaStack.addStack();
      logoStack.size = new Size(40, 40);
      logoStack.backgroundImage = smallLogo;
    }
  }

  ringContent(stack, data, percent = false) {
    const rowIcon = stack.addStack();
    rowIcon.addSpacer();
    const icon = SFSymbol.named(data.icon);
    icon.applyHeavyWeight();
    const iconElement = rowIcon.addImage(icon.image);
    iconElement.tintColor = this.gradient ? new Color(data.colors[1]) : data.FGColor;
    iconElement.imageSize = new Size(12, 12);
    iconElement.imageOpacity = 0.7;
    rowIcon.addSpacer();

    stack.addSpacer(1);

    const rowNumber = stack.addStack();
    rowNumber.addSpacer();
    const number = rowNumber.addText(percent ? `${data.percent}` : `${data.number}`);
    number.font = percent ? Font.systemFont(this.ringTextSize - 2) : Font.mediumSystemFont(this.ringTextSize);
    rowNumber.addSpacer();

    const rowUnit = stack.addStack();
    rowUnit.addSpacer();
    const unit = rowUnit.addText(percent ? '%' : data.unit);
    unit.font = Font.boldSystemFont(8);
    unit.textOpacity = 0.5;
    rowUnit.addSpacer();

    if (percent) {
      if (this.gradient) {
        ;[unit, number].map(t => t.textColor = new Color(data.colors[1]));
      } else {
        ;[unit, number].map(t => t.textColor = data.FGColor);
      }
    } else {
      ;[unit, number].map(t => t.textColor = this.widgetColor);
    }
  }

  makeCanvas() {
    const canvas = new DrawContext();
    canvas.opaque = false;
    canvas.respectScreenScale = true;
    canvas.size = new Size(this.canvSize, this.canvSize);
    return canvas;
  }

  sinDeg(deg) {
    return Math.sin((deg * Math.PI) / 180);
  }

  cosDeg(deg) {
    return Math.cos((deg * Math.PI) / 180);
  }

  drawArc(canvas, deg, fillColor, strokeColor) {
    let ctr = new Point(this.canvSize / 2, this.canvSize / 2);
    let bgx = ctr.x - this.canvRadius;
    let bgy = ctr.y - this.canvRadius;
    let bgd = 2 * this.canvRadius;
    let bgr = new Rect(bgx, bgy, bgd, bgd)

    canvas.setStrokeColor(strokeColor);
    canvas.setLineWidth(this.canvWidth);
    canvas.strokeEllipse(bgr);

    for (let t = 0; t < deg; t++) {
      let rect_x = ctr.x + this.canvRadius * this.sinDeg(t) - this.canvWidth / 2;
      let rect_y = ctr.y - this.canvRadius * this.cosDeg(t) - this.canvWidth / 2;
      let rect_r = new Rect(rect_x, rect_y, this.canvWidth, this.canvWidth);
      canvas.setFillColor(this.gradient ? new Color(fillColor[t]) : fillColor);
      canvas.setStrokeColor(strokeColor)
      canvas.fillEllipse(rect_r);
    }
  }

  arrColor() {
    let colorArr = [['#FFF000', '#E62490'], ['#ABDCFF', '#0396FF'], ['#FEB692', '#EA5455'], ['#FEB692', '#EA5455'], ['#CE9FFC', '#7367F0'], ['#90F7EC', '#32CCBC'], ['#FFF6B7', '#F6416C'], ['#E2B0FF', '#9F44D3'], ['#F97794', '#F072B6'], ['#FCCF31', '#F55555'], ['#5EFCE8', '#736EFE'], ['#FAD7A1', '#E96D71'], ['#FFFF1C', '#00C3FF'], ['#FEC163', '#DE4313'], ['#F6CEEC', '#D939CD'], ['#FDD819', '#E80505'], ['#FFF3B0', '#CA26FF'], ['#EECDA3', '#EF629F'], ['#C2E59C', '#64B3F4'], ['#FFF886', '#F072B6'], ['#F5CBFF', '#C346C2'], ['#FFF720', '#3CD500'], ['#FFC371', '#FF5F6D'], ['#FFD3A5', '#FD6585'], ['#C2FFD8', '#465EFB'], ['#FFC600', '#FD6E6A'], ['#FFC600', '#FD6E6A'], ['#92FE9D', '#00C9FF'], ['#FFDDE1', '#EE9CA7'], ['#F0FF00', '#58CFFB'], ['#FFE985', '#FA742B'], ['#72EDF2', '#5151E5'], ['#F6D242', '#FF52E5'], ['#F9D423', '#FF4E50'], ['#00EAFF', '#3C8CE7'], ['#FCFF00', '#FFA8A8'], ['#FF96F9', '#C32BAC'], ['#FFDD94', '#FA897B'], ['#FFCC4B', '#FF7D58'], ['#D0E6A5', '#86E3CE'], ['#F0D5B6', '#F16238'], ['#C4E86B', '#00BCB4'], ['#FFC446', '#FA0874'], ['#E1EE32', '#FFB547'], ['#FFD804', '#2ACCC8'], ['#E9A6D2', '#E9037B'], ['#F8EC70', '#49E2F6'], ['#A2F8CD', '#A2F852'], ['#A2F8CD', '#00C3FF'], ['#FDEFE2', '#FE214F'], ['#F8EC70', '#A2F8CD'], ['#F8EC70', '#49E2F6'], ['#FFB7D1', '#E4B7FF'], ['#D0E6A5', '#86E3CE'], ['#E8E965', '#64C5C7']];
    let colors = colorArr[Math.floor(Math.random() * colorArr.length)];
    return colors;
  }

  gradientColor(colors, step) {
    var startRGB = this.colorToRgb(colors[0]),
    startR = startRGB[0],
    startG = startRGB[1],
    startB = startRGB[2];

    var endRGB = this.colorToRgb(colors[1]),
    endR = endRGB[0],
    endG = endRGB[1],
    endB = endRGB[2];

    var sR = (endR - startR) / step,
    sG = (endG - startG) / step,
    sB = (endB - startB) / step;

    var colorArr = [];
    for (var i = 0;i < step; i++) {
     var hex = this.colorToHex('rgb(' + parseInt((sR * i + startR)) + ',' + parseInt((sG * i + startG)) + ',' + parseInt((sB * i + startB)) + ')');
     colorArr.push(hex);
   }
   return colorArr;
 }

 colorToRgb(sColor) {
   var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
   var sColor = sColor.toLowerCase();
   if (sColor && reg.test(sColor)) {
     if (sColor.length === 4) {
       var sColorNew = "#";
       for (var i = 1; i < 4; i += 1) {
         sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
       }
       sColor = sColorNew;
     }
     var sColorChange = [];
     for (var i = 1; i < 7; i += 2) {
       sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
     }
     return sColorChange;
   } else {
     return sColor;
   }
 };

 colorToHex(rgb) {
   var _this = rgb;
   var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
   if (/^(rgb|RGB)/.test(_this)) {
     var aColor = _this.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
     var strHex = "#";
     for (var i = 0; i < aColor.length; i++) {
       var hex = Number(aColor[i]).toString(16);
       hex = hex.length < 2 ? 0 + '' + hex : hex;
       if (hex === "0") {
         hex += hex;
       }
       strHex += hex;
     }
     if (strHex.length !== 7) {
       strHex = _this;
     }

     return strHex;
   } else if (reg.test(_this)) {
     var aNum = _this.replace(/#/,"").split("");
     if (aNum.length === 6) {
       return _this;
     } else if (aNum.length === 3) {
       var numHex = "#";
       for (var i = 0; i < aNum.length; i+=1) {
         numHex += (aNum[i] + aNum[i]);
       }
       return numHex;
     }
   } else {
     return _this;
   }
 }

  renderSmall = async (w) => {
    w.setPadding(this.smallPadding, this.smallPadding, this.smallPadding, this.smallPadding);
    await this.smallHeader(w);
    const bodyStack = w.addStack();
    bodyStack.layoutVertically();
    if (this.widgetParam == "1"){
      this.textLayout(bodyStack, this.flow);
      bodyStack.addSpacer(7);
      this.textLayout(bodyStack, this.voice);
      bodyStack.addSpacer(7);
      this.textLayout(bodyStack, this.point);
    } else {
      const canvas = this.makeCanvas();
      const ringStack = bodyStack.addStack();
      this.imageCell(canvas, ringStack, this.flow);
      ringStack.addSpacer();
      this.imageCell(canvas, ringStack, this.voice);
    }
    return w;
  };

  renderMedium = async (w) => {
    w.setPadding(this.padding, this.padding, this.padding, this.padding);
    const canvas = this.makeCanvas();
    const bodyStack = w.addStack();
    await this.mediumCell(canvas, bodyStack, this.fee, 'd7000f', true);
    bodyStack.addSpacer(this.padding);
    await this.mediumCell(canvas, bodyStack, this.flow, this.flowColorHex, false, true);
    bodyStack.addSpacer(this.padding);
    await this.mediumCell(canvas, bodyStack, this.voice, this.voiceColorHex, false,true);
    return w;
  };

  renderLarge = async (w) => {
    w.addText('暂不支持')
    return w;
  };

  Run() {
    if (config.runsInApp) {
      const widgetInitConfig = {
        cookie: '@YaYa_10010.cookie',
      };
      this.registerAction('颜色配置', async () => {
        await this.setAlertInput(
          `${this.name}颜色配置`,
          '进度条颜色|底圈颜色\n底圈颜色留空将跟随进度条颜色并淡显',
          {
            gradient: '是否开启渐变进度条，缺省：false',
            step1: '流量进度条颜色',
            step2: '语音进度条颜色',
            inner1: '流量进度条底圈颜色',
            inner2: '语音进度条底圈颜色',
          },
          );
      }, 'https://gitee.com/anker1209/image/raw/master/jd/colorSet.png');
      this.registerAction('尺寸设置', async () => {
        await this.setAlertInput(
          `${this.name}尺寸设置`,
          '进度条大小|文字大小',
          {
            logoScale: '小组件logo缩放，缺省：0.24',
            ringStackSize: '圆环大小，缺省：61',
            ringTextSize: '圆环中心文字大小，缺省：14',
            feeTextSize: '话费文字大小，缺省：21',
            textSize: '文字模式下文字大小，缺省：13',
            smallPadding: '小尺寸组件边距，缺省：16',
            padding: '中尺寸组件边距，缺省：10',
          },
          );
      }, 'https://gitee.com/anker1209/image/raw/master/jd/resize.png');
      this.registerAction('账号设置', async () => {
        await this.setAlertInput(
          `${this.name}账号`,
          '读取 BoxJS 缓存信息',
            {cookie: 'cookie'},
          );
      }, 'https://gitee.com/anker1209/image/raw/master/jd/account.png');
      this.registerAction('代理缓存', async () => {
        await this.setCacheBoxJSData(widgetInitConfig);
      }, 'https://gitee.com/anker1209/image/raw/master/jd/boxjs.png');
      this.registerAction('基础设置', this.setWidgetConfig, 'https://gitee.com/anker1209/image/raw/master/jd/preferences.png');
    }

    try {
      const {
        cookie,
        step1,
        step2,
        inner1,
        inner2,
        logoScale,
        ringStackSize,
        ringTextSize,
        feeTextSize,
        textSize,
        smallPadding,
        padding,
        gradient,
      } = this.settings;
      this.cookie = cookie ? cookie : this.cookie;
      this.gradient = gradient === 'true' ? true : this.gradient;
      this.flowColorHex = step1 ? step1 : this.flowColorHex;
      this.voiceColorHex = step2 ? step2 : this.voiceColorHex;
      this.flow.BGColor = inner1 ? new Color(inner1) : new Color(this.flowColorHex, 0.2);
      this.voice.BGColor = inner2 ? new Color(inner2) : new Color(this.voiceColorHex, 0.2);
      this.flow.FGColor = new Color(this.flowColorHex);
      this.voice.FGColor = new Color(this.voiceColorHex);

      this.logoScale = logoScale ? parseFloat(logoScale) : this.logoScale;
      this.ringStackSize = ringStackSize ? parseFloat(ringStackSize) : this.ringStackSize;
      this.ringTextSize = ringTextSize ? parseFloat(ringTextSize) : this.ringTextSize;
      this.feeTextSize = feeTextSize ? parseFloat(feeTextSize) : this.feeTextSize;
      this.textSize = textSize ? parseFloat(textSize) : this.textSize;
      this.smallPadding = smallPadding ? parseFloat(smallPadding) : this.smallPadding;
      this.padding = padding ? parseFloat(padding) : this.padding;

      if (this.gradient) {
        this.flow.colors = this.arrColor();
        this.voice.colors = this.arrColor();
        this.flow.BGColor = inner1 ? new Color(inner1) : new Color(this.flow.colors[1], 0.2);
        this.voice.BGColor = inner2 ? new Color(inner2) : new Color(this.voice.colors[1], 0.2);
        this.flow.FGColor = this.gradientColor(this.flow.colors, 360);
        this.voice.FGColor = this.gradientColor(this.voice.colors, 360);
        this.flowColorHex = this.flow.colors[1];
        this.voiceColorHex = this.voice.colors[1];
      }

    } catch (e) {
      console.log(e);
    }
  }

  async render() {
    await this.init();
    const widget = new ListWidget();
    await this.getWidgetBackgroundImage(widget);
    if (this.widgetFamily === 'medium') {
      return await this.renderMedium(widget);
    } else if (this.widgetFamily === 'large') {
      return await this.renderLarge(widget);
    } else {
      return await this.renderSmall(widget);
    }
  }
}

await Runing(Widget, args.widgetParameter, false);
