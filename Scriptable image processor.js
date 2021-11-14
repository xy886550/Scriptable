// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic;
// These three lines demonstrate how this code works.
let img = await Photos.fromLibrary()
let newImg = await processImage(img)
QuickLook.present(newImg)

// This function takes an image and returns a processed image.
async function processImage(image) {
  
  const imageId = "imageId"
  const canvasId = "canvasId"

  const js = `

  // Set up the canvas.
  const img = document.getElementById("${imageId}");
  const canvas = document.getElementById("${canvasId}");

  const w = img.naturalWidth;
  const h = img.naturalHeight;

  canvas.style.width  = w + "px";
  canvas.style.height = h + "px";
  canvas.width = w;
  canvas.height = h;

  const context = canvas.getContext("2d");
  context.clearRect( 0, 0, w, h );
  context.drawImage( img, 0, 0 );
  
  // Image modifications go here. This desaturates the image.
  context.globalCompositeOperation = "saturation";
  context.fillStyle = "hsl(0,0%,50%)";
  context.fillRect(0, 0, w, h);

  // Return a base64 representation.
  canvas.toDataURL(); 
  `
  
  // Convert the images and create the HTML.
  let inputData = Data.fromPNG(image).toBase64String()
  let html = `
  <img id="${imageId}" src="data:image/png;base64,${inputData}" />
  <canvas id="${canvasId}" />
  `
  
  // Make the web view and get its return value.
  let view = new WebView()
  await view.loadHTML(html)
  let returnValue = await view.evaluateJavaScript(js)
  
  // Remove the data type from the string and convert to data.
  let outputDataString = returnValue.slice(returnValue.indexOf(",")+1)
  outputData = Data.fromBase64String(outputDataString)
  
  // Convert to image and return.
  return Image.fromData(outputData)
}