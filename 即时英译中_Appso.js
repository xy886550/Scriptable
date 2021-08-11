// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic;
// share-sheet-inputs: plain-text;
function queryStringify(query) {
  return `${Object.keys(query).map(key => `${key}=${encodeURIComponent(query[key])}`).join('&')}`;
}

async function bingTranlate(text) {
  const request = new Request('https://cn.bing.com/ttranslatev3?isVertical=1&&IG=70CC264470994768897298DCA237D2C7&IID=translator.5025.1');
  request.method = 'post';
  request.headers = {
    "authority": "cn.bing.com",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    "content-type": "application/x-www-form-urlencoded",
    "accept": "*/*",
    "origin": "https://cn.bing.com",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
    "referer": "https://cn.bing.com/translator?mkt=zh-CN",
  };

  request.body = queryStringify({
    fromLang: 'auto-detect',
    to: 'zh-Hans',
    text,
  });

  const result = await request.loadJSON();

  return result[0].translations[0].text;
}

async function bingLookup(text) {
  const request = new Request('https://cn.bing.com/tlookupv3');
  request.method = 'post';
  request.headers = {
    "authority": "cn.bing.com",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    "content-type": "application/x-www-form-urlencoded",
    "accept": "*/*",
    "origin": "https://cn.bing.com",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
    "referer": "https://cn.bing.com/translator?mkt=zh-CN",
  };
  request.body = queryStringify({
    from: 'en',
    to: 'zh-Hans',
    text,
  });

  const result = await request.loadJSON();

  console.log(result);

  return result[0].translations.map(t => t.normalizedTarget);
}

function renderView(rawText, translateResult, lookupResults) {
  // const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return `
  <html>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <head>
    <style>
    html, body {
      padding: 0;
      margin: 0;
      background: #ffffff;
    }
    .card {
      padding: 20px;
      font-family: PingFangSC-Regular, sans-serif;
      color: #222222;
    }

    .card .desc {
      font-size: 13px;
      margin-bottom: 6px;
    }
    .raw-text {
      border-bottom: 0.5px solid #ececec;
      background: #ffffff;
      font-size: 18px;
    }

    .lookup-results span {
      display: inline-block;
      padding: 6px 12px;
      background: #ffffff;
      margin-right: 8px;
      margin-bottom: 8px;
      border: 0.5px solid #eeeeee;
    }

    .translate-result {
      background: #f9f9f9;
      font-size: 18px;
    }
    @media (prefers-color-scheme: dark) {
      html, body {
        padding: 0;
        margin: 0;
        background: #333333;
      }
      .card {
        padding: 20px;
        font-family: PingFangSC-Regular, sans-serif;
        color: #dddddd;
      }
  
      .card .desc {
        font-size: 13px;
        margin-bottom: 6px;
      }
      .raw-text {
        border-bottom: 0.5px solid #000000;
        background: #444444;
        font-size: 18px;
      }
  
      .lookup-results span {
        display: inline-block;
        padding: 6px 12px;
        background: #333333;
        margin-right: 8px;
        margin-bottom: 8px;
        border: 0.5px solid #000000;;
      }
  
      .translate-result {
        background: #222222;
        font-size: 18px;
      }
    }
    </style>
  </head>
  <body>
    <div class="card raw-text">
      <div class="desc">原文</div>
      <div class="text">${rawText}</div>
    </div>
    <div class="card translate-result">
    <div class="desc">译文</div>
      <div>${translateResult}</div>
    </div>
    <div class="card lookup-results">
      ${lookupResults.length ? `
      <div class="desc">其他释义</div>
      <div>${lookupResults.map(r => `<span>${r}</span>`).join('')}</div>
      ` : ''}
    </div>
  </body>
  </html>
  `
}

const webview = new WebView();

const input = args.plainTexts[0] || 'Stay';

const translateResult = await bingTranlate(input);
const lookupResult = await bingLookup(input);

webview.loadHTML(renderView(input, translateResult, lookupResult));

webview.present();
