// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: clock;
// This example shows how to load HTML into a web view. You can also load both CSS styling and JavaScript into the web view.
// Web views can be displayed in a Siri Shortcut.
// Note that this example uses the loadHTML() function of the WebView bridge. However, typically you would store your HTML and assets in the Scriptable folder in iCloud Drive and edit your HTML files using a suitable app, eg. Textastic. Then you can use the loadFile() function on the web view to load the HTML file.
let html = `
<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;"/>
<style>
body {
  font-family: -apple-system;
  height: 100%;
}
#container {
  display: table;
  width: 100%;
  height: 100%;
}
#countdown {
  text-align: center;
  font-size: 20pt;
  min-height: 10em;
  display: table-cell;
  vertical-align: middle;
}
</style>
<div id="container">
  <div id="countdown"></div>
</div>
<script>
// Date we want to countdown to
let targetDate = new Date()
targetDate.setHours(24, 0, 0, 0)
let targetTime = targetDate.getTime()
// Create a timer that updates every second
let timer = setInterval(function() {
  var now = new Date().getTime()
  let distance = targetTime - now;
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  let seconds = Math.floor((distance % (1000 * 60)) / 1000)
  // Update the element with id="countdown"
  let e = document.getElementById("countdown")
  e.innerHTML = "🌝 "
    + hours + "h "
    + minutes + "m " + seconds + "s "
    + " to midnight"
  if (distance < 0) {
    clearInterval(timer)
  }
}, 1000)
</script>
`
WebView.loadHTML(html, null, new Size(0, 100))
// It is good practice to call Script.complete() at the end of a script, especially when the script is used with Siri or in the Shortcuts app. This lets Scriptable report the results faster. Please see the documentation for details.
Script.complete()