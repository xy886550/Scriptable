// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: list-alt;
const ifanrLogoBase64 = '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';
const listIconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAAADxOwP///+ZVyMXAAAAAXRSTlMAQObYZgAAAAFiS0dEAmYLfGQAAAAgSURBVAjXY2AAAdHQ0BAIIcIAREQQDHBChBWkDUSAAADfMwUTMaVRwQAAAABJRU5ErkJggg==';
const listIcon = Image.fromData(Data.fromBase64String(listIconBase64));
const ifanrLogo = Image.fromData(Data.fromBase64String(ifanrLogoBase64));

function lastOfArray(array) {
  return array[array.length - 1];
}

function parseXml(string) {
  const xmlParser = new XMLParser(string);

  return new Promise((resolve, reject) => {

    const items = [];
    let currentValue = '';
    let currentItem = null;

    xmlParser.parseErrorOccurred = err => {
      reject(err);
      return;
    };

    xmlParser.foundCharacters = str => {
      currentValue += str
    }

    xmlParser.didStartElement = (name) => {
      currentValue = ""
      if (name == "item") {
        currentItem = {}
      }
    }

    xmlParser.didEndElement = (name) => {
      const hasItem = currentItem != null;
      if (hasItem && ["title", "link", "image"].indexOf(name) >= 0) {
        currentItem[name] = currentValue
      }

      if (name === "item") {
        items.push(currentItem)
        currentItem = {}
      }
      // console.log(arg0);
    }

    xmlParser.didEndDocument = () => {
      // console.log(stack);
      resolve(items);
    }

    xmlParser.parse();
  });
}

const host = 'https://sso.ifanr.com';
let itemsPerPage = 5;
let itemImageHight = 40;
let itemImageWidth = 72;
/** end global */

const dateFormatter = new DateFormatter();
dateFormatter.dateFormat = 'yyyy-MM-dd HH:mm:ss';

function queryStringify(query) {
  return `?${Object.keys(query).map(key => `${key}=${encodeURIComponent(query[key])}`).join('&')}`;
}

async function loadFeed() {
  // const request = new Request('https://www.ifanr.com/feed');
  // const response = await request.loadString();

  // const result = await parseXml(response);
  // console.log(result);
  // return result;
  // const parseState = xmlParser.parse();
  const queryIfanrParams = {
    limit: 5,
    offset: 0,
    published_at__lte: dateFormatter.string(new Date())
  }
  const request = new Request(`${host}/api/v5/wp/web-feed/?${queryStringify(queryIfanrParams)}`);
  const response = await request.loadJSON();
  
  const { meta, objects } = response;

  return objects;
}

function renderItemWithImage(stack, item) {
  stack.url = item.post_url;
  stack.spacing = 10;
  const previewImage = stack.addImage(item.image);
  previewImage.imageSize = new Size(50, 32);
  const text = stack.addText(item.post_title);
  text.font = Font.systemFont(14);
  stack.centerAlignContent();
}

function renderItemPlainText(stack, item) {
  stack.url = item.post_url;
  stack.spacing = 10;
  const listIconImage = stack.addImage(listIcon);
  listIconImage.imageSize = new Size(10, 10);
  const text = stack.addText(item.post_title);
  text.font = Font.systemFont(14);
  stack.centerAlignContent();
}

async function createWidget(items, widgetFamily) {
  const listWidget = new ListWidget();
  const nextDate = new Date();
  nextDate.setMinutes(nextDate.getMinutes() + 5);
  listWidget.refreshAfterDate = nextDate;
  const titleStack = listWidget.addStack();
  titleStack.spacing = 10;
  titleStack.setPadding(3, 0, 3, 0);
  const image = titleStack.addImage(ifanrLogo);
  image.imageSize = new Size(20, 20);
  const titleText = titleStack.addText('爱范儿');
  titleText.font = Font.boldSystemFont(16);
  let render;
  let present;
  // listWidget.addSpacer(4);
  switch (widgetFamily) {
    case 'large':
      await Promise.all(items.map(async item => {
        const req = new Request(item.post_cover_image);
        item.image = await req.loadImage();
        return Promise.resolve();
      }));
      render = renderItemWithImage;
      present = listWidget.presentLarge.bind(listWidget);
      items = items.slice(0, 5);
      listWidget.spacing = 14;
      break;
    case 'medium':
      render = renderItemPlainText;
      present = listWidget.presentMedium.bind(listWidget);
      items = items.slice(0, 4);
      listWidget.spacing = 6;
      break;
    default:
      return;
  }

  // const stacks = items.map(render);

  for (const item of items) {
    const stack = listWidget.addStack();
    render(stack, item);
  }

  const lastUpdateWidgetText = listWidget.addText(`上次更新：${dateFormatter.string(new Date())}`);
  lastUpdateWidgetText.font = Font.thinSystemFont(9);
  lastUpdateWidgetText.rightAlignText();
  Script.setWidget(listWidget);
  present();

}

async function initScript() {
  const feed = await loadFeed();
  await createWidget(feed, config.widgetFamily || 'large');
}

await initScript();

