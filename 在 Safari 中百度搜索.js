// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic; share-sheet-inputs: plain-text;
// 获取到传递给 Scriptable 的文本
const input = args.plainTexts[0];

// 将 https://www.baidu.com/s?wd= 与待搜索的文本拼接
// encodeURIComponent() 是将输入的文本转成浏览器可识别的格式
const url = 'https://www.baidu.com/s?wd=' + encodeURIComponent(input);

// 使用 Safari 打开这个网址，搞定！
Safari.open(url);