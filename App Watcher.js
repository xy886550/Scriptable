// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: laptop-code;
// share-sheet-inputs: url;
/*******************************************
 *                                         *
 *             /\                          *
 *            /  \   _ __  _ __            *
 *           / /\ \ | '_ \| '_ \           *
 *          / ____ \| |_) | |_) |          *
 *         /_/    \_\ .__/| .__/           *
 *                  | |   | |              *
 *__          __   _|_|   |_|              *
 *\ \        / /  | |     | |              *
 * \ \  /\  / /_ _| |_ ___| |__   ___ _ __ *
 *  \ \/  \/ / _` | __/ __| '_ \ / _ \ '__|*
 *   \  /\  / (_| | || (__| | | |  __/ |   *
 *    \/  \/ \__,_|\__\___|_| |_|\___|_|   *
 *                                         *
 *    Track the price of apps and their    *
 *            in-app purchases             *
 *                                         *
 *   - To view the list of apps just run   *
 *              this script.               *
 *   - To add an app, just share the app   *
 *   from the AppStore to Scriptable and   *
 *           choose this script.           *
 * - To remove an app from the list, check *
 * in the result view the checkbox "Remove *
 *  app" at the top, press "Done" and it   *
 *   will ask you to select the apps to    *
 *                 remove.                 *
 * - To reset the changes in prices, check *
 * in the result view the checkbox "Reset  *
 *   price changes" at the top and press   *
 *                 "Done"                  *
 *                                         *
 *       This script can also run in       *
 *   notifications. It then will display   *
 *            only the changes.            *
 *                                         *
 * You can also start this script with the *
 *  URL scheme with a parameter "mode" to  *
 *  directly execute its action. This is   *
 *      useful for the actions inside      *
 *  notifications. It can have the values  *
 *  "view" to only view the apps without   *
 *   polling for any changes, "reset" to   *
 *    delete every recorded change and     *
 * "remove" to jump to the selection where *
 *         you can remove the apps         *
 *                                         *
 *            ! ! ! ! ! ! ! ! !            *
 *  This script can only handle apps from  *
 *          the AppStore for now           *
 *            ! ! ! ! ! ! ! ! !            *
 *                                         *
 *      Below this comment is a small      *
 *         configuration section.          *
 *                                         *
 * Scroll to the bottom for the changelog! *
 *                                         *
 *  Made by @schl3ck (Reddit, Automators   *
 *         Talk) in November 2018          *
 *                                         *
 *              Version 1.0.9              *
 *                                         *
 *******************************************/

// if true, updates will be tracked
const trackVersion = true;
// if true, in-app purchases will be tracked
const trackIAPs = true;
// if true, starts the in app results view with an overview of the found changes
const defaultToChangesView = true;

// ======= end of config =======

// set it to true initially as it gets set to false when at least one app could retrieve its in-app-purchases (even if there are none)
let errorFindingInAppDueToWebsiteChange = trackIAPs;
const errorFindingInAppTitle =
  "Looks like Apple changed their AppStore web appeareance. Tap here to see if there is an update for this script.";
const errorFindingInAppSubtitle =
  "If there is no update, please try again after some time.";
const forumPostURLOfScript =
  "https://talk.automators.fm/t/appwatcher-track-the-price-of-apps-and-their-in-app-purchases/3381";

let fm = FileManager.iCloud();
let settingsFilename = "AppWatcher.json";
let file = fm.joinPath(fm.documentsDirectory(), settingsFilename);
if (!fm.isFileDownloaded(file)) {
  await fm.downloadFileFromiCloud(file);
}
let apps = fm.readString(file);
let noFile = false;
if (!apps) {
  if (config.runsInWidget) {
    Script.setWidget(
      MessageWidget(
        "No settings file was found. Please run the script in the app first.",
      ),
    );
    Script.complete();
    return;
  } else {
    let alert = new Alert();
    alert.title = `The file "${settingsFilename}" was not found in the Scriptable iCloud folder. You can select a file or create a new one`;
    alert.addAction("Select from iCloud");
    alert.addAction("Create new file");
    alert.addCancelAction("Cancel");
    let i = await alert.presentSheet();
    switch (i) {
      case -1:
        Script.complete();
        return;
      case 0:
        file = (await DocumentPicker.open(["public.json"]))[0];
        apps = fm.readString(file);
        break;
      case 1:
        apps = "[]";
        break;
    }
    noFile = true;
  }
}
apps = JSON.parse(apps);
apps.forEach((app) => {
  setUndef(app);
  if (!app.inApp) return;
  app.inApp.forEach(setUndef);
});
if (noFile) save();

function MessageWidget(message) {
  let w = new ListWidget();
  w.backgroundColor = Color.dynamic(Color.white(), Color.black());
  w.addSpacer();
  let text = w.addText(message);
  text.centerAlignText();
  text.textColor = Color.red();
  text.minimumScaleFactor = 0.5;
  w.addSpacer();
  let stack = w.addStack();
  stack.layoutHorizontally();
  stack.addSpacer();
  text = stack.addText("Last update:");
  text.rightAlignText();
  text.textColor = Color.gray();
  text.font = Font.footnote();
  text.lineLimit = 1;
  text.minimumScaleFactor = 0.7;
  stack.addSpacer(1);
  let time = stack.addDate(new Date());
  time.rightAlignText();
  time.applyTimeStyle();
  time.textColor = Color.gray();
  time.font = Font.footnote();
  time.minimumScaleFactor = 0.7;
  return w;
}

class noSave {
  constructor(data) {
    this.data = data;
    log(data);
  }

  toJSON() {
    return undefined;
  }

  toString() {
    return this.data.toString();
  }
}

function setUndef(i) {
  if (!i.price) return;
  if (i.price[0] == null) {
    i.price[0] = undefined;
    i.formattedPrice[0] = undefined;
  }
}

function getInAppPurchases(html, url, id, retries = 0) {
  // get authorization bearer & api host
  let regex = /<meta name="web-experience-app\/config\/environment" content="([^"]+)" ?\/?>/s;
  let match = html.match(regex);
  if (!match) {
    log("Did not find web-experience-app/config, " + url);
    // probably the website has changed
    errorFindingInAppDueToWebsiteChange =
      errorFindingInAppDueToWebsiteChange && true;
    return;
  }
  // the regex found something. It looks like the website hasn't changed yet
  errorFindingInAppDueToWebsiteChange = false;
  let json = JSON.parse(decodeURIComponent(match[1]));

  // construct header
  let header = {
    Accept: "application/json",
    Referer: url,
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Authorization: "Bearer " + json.MEDIA_API.token,
    Origin: "https://apps.apple.com",
  };
  // construct url
  let country = url.match(
    /^https:\/\/(?:apps|itunes).apple.com\/([a-zA-Z]{2})\/app/,
  )[1];
  let reqUrl = `${
    json.API.AppHost
  }/v1/catalog/${country.toUpperCase()}/apps/${id}?platform=web&additionalPlatforms=appletv,ipad,iphone,mac&include=top-in-apps`;
  log("in-app url: " + reqUrl);

  let req = new Request(reqUrl);
  req.headers = header;
  return req.loadJSON().then((res) => {
    if (res.message && res.message === "API capacity exceeded") {
      if (retries === 2) {
        throw new Error("API capacity exceeded for app " + reqUrl);
      }
      // retry when api returned nothing
      return getInAppPurchases(html, url, id, retries + 1);
    }
    // log(
    //   "in-app response for " + reqUrl + "\nis " + JSON.stringify(res, null, 2),
    // );
    return res.data[0].relationships["top-in-apps"].data.map((inApp) => {
      return {
        id: inApp.attributes.offerName,
        name: inApp.attributes.name,
        price: inApp.attributes.offers[0].price,
        formattedPrice: inApp.attributes.offers[0].priceFormatted,
      };
    });
  });
}

function getColor([a, b]) {
  // 	log(`getColor(${a}, ${b})`)
  if (typeof a === "undefined") return "";
  if (a < b) return "table-danger";
  if (b === 0) return "table-success";
  if (a > b) return "table-warning";
  return "";
}

function save() {
  // 	log(JSON.stringify(apps, null, 4));
  // 	return;
  if (fm.fileExists(file)) fm.remove(file);
  fm.writeString(
    file,
    JSON.stringify(
      apps,
      (k, v) => {
        if (k === "removed") return undefined;
        return v;
      },
      0,
    ),
  );
  log("Saved!");
}

let addApp = args.urls[0];
if (addApp) {
  if (!/^https?:\/\/(?:itunes|apps)\.apple\.com\/[^/]+\/app\//.test(addApp)) {
    let a = new Alert();
    a.title = "Not an AppStore app";
    a.message =
      "I'm sorry, but this script only supports apps from the AppStore for now 😕";
    a.addCancelAction("OK");
    await a.presentAlert();
    return;
  }
  let id = parseInt(addApp.match(/id(\d+)/)[1]);
  let country = addApp.match(
    /https?:\/\/(?:itunes|apps)\.apple\.com\/([^/]+)/,
  )[1];
  let alert = new Alert();
  if (apps.find((a) => a.id == id)) {
    alert.title = "This app is already in the list";
    alert.addCancelAction("OK");
    await alert.presentAlert();
    Script.complete();
    return;
  }
  apps.push({ id, country, trackViewUrl: addApp });
  save();
  alert.title = "Show all apps?";
  alert.addAction("Yes");
  alert.addCancelAction("No");
  if (-1 === (await alert.presentAlert())) {
    Script.complete();
    return;
  }
}

if (!apps.length) {
  const msg =
    "There are no apps in your list. Please add an app by sharing its AppStore URL to this script.";
  if (config.runsInWidget) {
    Script.setWidget(MessageWidget(msg));
    Script.complete();
  } else {
    let a = new Alert();
    a.title = "No apps";
    a.message = msg;
    a.addCancelAction("OK");
    await a.presentAlert();
    Script.complete();
  }
  return;
}

let launchMode = args.queryParameters.mode;
log("launchMode: " + launchMode);
let wv;

if (config.runsInApp) {
  // launchMode = "edit"
}

if (!launchMode) {
  log("retrieving prices");

  let countries = {};
  apps.forEach((a) => {
    countries[a.country] = countries[a.country] || [];
    countries[a.country].push(a.id);
  });
  log("getting app details");
  let req = Promise.all(
    Object.entries(countries).map(([c, ids]) =>
      new Request(
        `https://itunes.apple.com/lookup?country=${c}&id=${ids.join(",")}`,
      )
        .loadJSON()
        .then((a) => a.results),
    ),
  );

  let json = (await req).reduce((acc, val) => acc.concat(val), []);
  // 	log(JSON.stringify(json, null, 4))
  // return;

  log("getting in-app purchases");
  let inApp = [];
  if (trackIAPs) {
    inApp = await Promise.all(
      json.map((i) => {
        if (!i.trackViewUrl) log("item: " + JSON.stringify(i, null, 4));
        let req = new Request(i.trackViewUrl);

        return req
          .loadString()
          .then(
            (html) => {
              return getInAppPurchases(html, i.trackViewUrl, i.trackId);
            },
            (err) => {
              logError("error by request " + i.trackName + ":\n" + err);
            },
          )
          .then((ia) => {
            // log("in app:\n" + JSON.stringify(ia, null, 4));
            return ia;
          });
      }),
    );
  }
  json = json.map((app, i) => {
    return {
      inApp: inApp[i],
      price: app.price,
      formattedPrice: app.formattedPrice,
      name: app.trackName,
      icon: app.artworkUrl60,
      trackViewUrl: app.trackViewUrl,
      id: app.trackId,
      version: app.version,
    };
  });
  // 	log(JSON.stringify(json, null, 4))
  apps.forEach((old, i) => {
    let app = json.find((a) => a.id == old.id);
    old.price = old.price || [undefined, undefined];
    old.formattedPrice = old.formattedPrice || [undefined, undefined];
    old.inApp = old.inApp || [];
    old.version = old.version || [undefined, undefined];

    if (!app) {
      // 			log("removed")
      // 			log(old)
      old.removed = true;
      log(typeof old.price[1]);
      if (old.price[1] == null) {
        old.price[1] = -1;
        old.formattedPrice[1] = "";
      }
      old.name =
        old.name
        || new noSave(
          (old.trackViewUrl
            && decodeURI(
              old.trackViewUrl.match(
                /https?:\/\/(?:itunes|apps)\.apple\.com\/(?:[^/]+\/){2}([^/]+)\/id/,
              )[1],
            ))
            || "removed",
        );
    } else {
      old.name = app.name;
      old.icon = app.icon;
      old.trackViewUrl = app.trackViewUrl;
      if (old.price[1] !== app.price) {
        old.price.shift();
        old.price.push(app.price);
        old.formattedPrice.shift();
        old.formattedPrice.push(app.formattedPrice);
      }
      if (old.version[1] !== app.version) {
        old.version.shift();
        old.version.push(app.version);
      }
      if (trackIAPs) {
        if (!app.inApp) {
          // 				log("no inapp")
          // 				log(old)
          old.removed = true;
          return;
        }
        // log("old.inApp:\n" + JSON.stringify(old.inApp, null, 4));
        old.inApp = app.inApp.map((ia) => {
          let oldia = old.inApp.find((a) => a.id === ia.id);
          // log("ia:\n" + JSON.stringify(ia, null, 4));
          oldia =
            oldia
            || old.inApp.find(
              (a) => a.name === ia.name && a.price[1] === ia.price,
            );
          oldia = oldia || old.inApp.find((a) => a.name === ia.name);
          // log("oldia:\n" + JSON.stringify(oldia, null, 4));
          if (oldia && oldia.price[1] !== ia.price) {
            oldia.price.shift();
            oldia.price.push(ia.price);
            oldia.formattedPrice.shift();
            oldia.formattedPrice.push(ia.formattedPrice);
          } else if (!oldia) {
            oldia = {
              price: [undefined, ia.price],
              formattedPrice: [undefined, ia.formattedPrice],
              name: ia.name,
              id: ia.id,
            };
          }
          oldia.id = ia.id;
          if (
            oldia.formattedPrice[1] == null
            || oldia.formattedPrice[1] == oldia.price[1]
          ) {
            oldia.formattedPrice[1] = ia.formattedPrice || oldia.price[1];
          }
          return oldia;
        });
        old.inApp.sort((a, b) => a.price[1] - b.price[1]);
      }
    }
  });

  // 	await QuickLook.present(JSON.stringify(apps, null, 4));
  apps.sort((a, b) => {
    let c = a.price[1] - b.price[1];
    return a.removed ? (b.removed ? c : -1) : b.removed ? 1 : c;
  });

  save();
} // /!launchMode

let changes = apps
  .map((app) => {
    let a = {};
    Object.entries(app).forEach(([k, v]) => {
      a[k] = v;
    });
    app = a;
    app.inApp = trackIAPs
      ? app.inApp.filter((ia) => typeof ia.price[0] === "number")
      : [];
    return app;
  })
  .filter((app) => {
    return (
      app.inApp.length
      || typeof app.price[0] === "number"
      || app.removed
      || app.version[0] != null
    );
  });
// present results

if (config.runsInNotification) {
  let ui = new UITable(),
    row,
    cell;
  if (errorFindingInAppDueToWebsiteChange) {
    row = new UITableRow();
    row
      .addText(errorFindingInAppTitle, errorFindingInAppSubtitle)
      .centerAligned();
    row.dismissOnSelect = false;
    row.onSelect = () => {
      Safari.open(forumPostURLOfScript);
    };
    row.height = 110;
    row.backgroundColor = Color.orange();
    ui.addRow(row);
  }
  if (changes.length) {
    changes.forEach((app) => {
      row = new UITableRow();
      row.height = 60;
      row.dismissOnSelect = false;
      row.onSelect = () => {
        Safari.open(app.trackViewUrl);
      };

      cell = row.addImageAtURL(app.icon);
      // 			cell.centerAligned();
      cell.widthWeight = 20;

      cell = row.addText(app.name.toString());
      cell.widthWeight = 60;

      cell = row.addText(
        app.formattedPrice[1],
        app.formattedPrice[0] && `was ${app.formattedPrice[0]}`,
      );
      cell.rightAligned();
      cell.widthWeight = 30;
      if (app.formattedPrice[0]) {
        row.backgroundColor =
          app.price[1] === 0
            ? Color.green()
            : app.price[1] < app.price[0]
              ? Color.yellow()
              : Color.red();
      }
      ui.addRow(row);

      if (app.removed) {
        row = new UITableRow();
        row
          .addText(
            "There was a problem retrieving data for this app. Maybe the app was removed 🙁",
          )
          .centerAligned();
        ui.addRow(row);
      }
      if (trackVersion && app.version[0] != null) {
        row = new UITableRow();
        row
          .addText("New version! " + app.version[0] + " -> " + app.version[1])
          .centerAligned();
        ui.addRow(row);
      }

      if (trackIAPs) {
        // inApps
        app.inApp.forEach((ia) => {
          row = new UITableRow();
          row.height = 35;
          row.backgroundColor =
            ia.price[1] === 0
              ? Color.green()
              : ia.price[1] < ia.price[0]
                ? Color.yellow()
                : Color.red();

          // cell spacer
          cell = row.addText("");
          cell.widthWeight = 4;

          cell = row.addText(ia.name);
          cell.widthWeight = 60;

          cell = row.addText(
            ia.formattedPrice[1],
            `was ${ia.formattedPrice[0]}`,
          );
          cell.rightAligned();
          cell.widthWeight = 30;

          ui.addRow(row);
        });
      }

      // row spacer
      row = new UITableRow();
      row.height = 10;
      ui.addRow(row);
    });
    // remove last spacer
    ui.removeRow(row);
  } else {
    row = new UITableRow();
    row.addText("No changes found").centerAligned();
    ui.addRow(row);
  }
  ui.present();
  Script.complete();
  return;
}

if (config.runsInWidget) {
  const w = MessageWidget("This script does not support running in widgets");

  Script.setWidget(w);
  Script.complete();
  return;
}

if (!launchMode || launchMode === "view") {
  log("viewing");

  const appToHTML = (app) => {
    /* eslint-disable */
    return `<tr class="${getColor(app.price)}">
        <td>
          <a href="${app.trackViewUrl}">
            <img src="${app.icon}" width="60" height="60">
          </a>
        </td>
        <td>${app.name}</td>
        <td>${
          typeof app.price[0] !== "undefined"
            ? `<del>${app.formattedPrice[0]}</del>&nbsp;`
            : ""
        }${app.formattedPrice[1]}</td>
      </tr>
      ${
        app.removed
          ? `<tr><td colspan="3" class="text-center">
              There was a problem retrieving data for this app.<br>
              Maybe it was removed 🙁
            </td></tr>`
          : ""
      }
      ${
        trackVersion && app.version[0] != null
          ? `<tr><td colspan="3" class="text-center">
              New version! ${app.version[0]} -&gt; ${app.version[1]}
            </td></tr>`
          : ""
      }
      ${
        trackIAPs
          ? `<tr><td colspan="3">
        <table class="table table-sm">
          ${app.inApp
            .map((ia) => {
              return `<tr class="${getColor(ia.price)}">
              <td>${ia.name}</td>
              <td>${
                typeof ia.price[0] !== "undefined"
                  ? `<del>${ia.formattedPrice[0]}</del>&nbsp;`
                  : ""
              }${ia.formattedPrice[1]}</td>
            </tr>`;
            })
            .join("")}
        </table>
      </td></tr>`
          : ""
      }`;
    /* eslint-enable */
  };

  /* eslint-disable */
  let html = `<html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="initial-scale=1, width=device-width">
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
      <style>
        .table > tbody > tr:nth-child(odd) > td:last-child,
        .table .table td:last-child {
          text-align: right;
          white-space: nowrap;
        }
        .table > tbody td {
          vertical-align: middle;
        }
        .table .table {
          width: 100%
          margin: 0 5px;
          padding: 0;
        }
        .table {
          max-width: 100%;
        }
        .text-center {
          text-align: center;
          white-space: wrap !important;
        }
        .controls {
          margin: 2px;
        }
        .btn {
          margin: 2px;
          text-align: left;
        }
        .btn span {
          position: relative;
          top: -4px;
        }
        .btn span:before {
          content: "\\2610";
          position: relative;
          left: -5px;
          top: 1px;
          font: 20pt "Menlo-Regular";
        }
        input:checked + .btn span:before {
          content: "\\2611";
        }
        .message {
          padding: 10 0 0;
          text-align: center;
          font-size: 2em;
        }
        .no-in-app-found {
          background-color: orange;
        }
        .no-in-app-found .title {
          font-size: 0.6em;
        }
        .no-in-app-found .subtitle {
          font-size: 0.45em;
        }
        a.full-size {
          width: 100%;
          display: inline-block;
          color: black;
        }
        a.full-size:hover,
        a.full-size:active,
        a.full-size.active,
        a.full-size:focus,
        a.full-size.focus {
          text-decoration: none;
          color: black;
        }
      </style>
    </head>
    <body>
      <div class="d-flex flex-wrap justify-content-around controls">
        <input type="checkbox" id="removeApps" hidden>
        <label class="btn btn-danger flex-grow-1" for="removeApps"><span>Remove apps</span></label>
        <input type="checkbox" id="resetPrices" hidden>
        <label class="btn btn-secondary flex-grow-1" for="resetPrices"><span>Reset price changes</span></label>
        <input type="checkbox" id="toggleView" hidden ${
          defaultToChangesView ? `checked="checked"` : ""
        }>
        <label class="btn btn-primary flex-grow-1" for="toggleView"><span>Show only changes</span></label>
      </div>
      ${
        errorFindingInAppDueToWebsiteChange && launchMode !== "view"
          ? `<div class="message no-in-app-found">
          <a class="full-size" href="${forumPostURLOfScript}">
            <span class="title">${errorFindingInAppTitle}</span>
            <br />
            <span class="subtitle">${errorFindingInAppSubtitle}</span>
          </a>
        </div>`
          : ""
      }
      ${
        changes.length
          ? `<table class="table table-striped" id="changesView">
        <thead>
          <tr>
            <th>Icon</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
        ${changes.map(appToHTML).join("\n")}
        </tbody>
        </table>`
          : `<div id="changesView" class="message">No changes found</div>`
      }
      <table class="table table-striped" id="fullView">
      <thead>
        <tr>
          <th>Icon</th>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${apps.map(appToHTML).join("")}
      </tbody>
      </table>
      <script>
        let btn = document.getElementById("toggleView");
        let changesView = document.getElementById("changesView");
        let fullView = document.getElementById("fullView");
        
        function toggleView() {
          if (btn.checked) {
            changesView.style.display = "";
            fullView.style.display = "none";
          } else {
            changesView.style.display = "none";
            fullView.style.display = "";
          }
        }
        btn.addEventListener("change", toggleView);
        toggleView();
      </script>
    </body>
    </html>`;
  /* eslint-enable */
  // Pasteboard.copyString(html);
  // await QuickLook.present(html);

  wv = new WebView();
  wv.shouldAllowRequest = (req) => {
    // log("ShouldAllowRequest url: " + req.url);
    if (/^(itms-appss|https?):\/\//.test(req.url)) {
      Safari.open(req.url);
      return false;
    }
    return true;
  };
  wv.loadHTML(html);
  await wv.present();

  launchMode = undefined;
}

let rm = launchMode
  ? launchMode === "remove"
  : await wv.evaluateJavaScript(
      'document.getElementById("removeApps").checked;',
  );

let resetPrices = launchMode
  ? launchMode === "reset"
  : await wv.evaluateJavaScript(
      'document.getElementById("resetPrices").checked;',
  );

function createRows(apps, ui) {
  ui.removeAllRows();
  let row = new UITableRow();
  row.dismissOnSelect = false;
  row.addText("Please choose which apps you want to REMOVE from the list");
  row.height = 60;
  ui.addRow(row);
  apps.forEach((app) => {
    row = new UITableRow();
    row.dismissOnSelect = false;
    row.onSelect = () => {
      app.checked = !app.checked;
      createRows(apps, ui);
    };

    // checkmark
    let cell = UITableCell.text(app.checked ? "\u2714" : "");
    cell.centerAligned();
    cell.widthWeight = 8;
    row.addCell(cell);

    // icon
    cell = UITableCell.imageAtURL(app.icon);
    cell.widthWeight = 10;
    cell.centerAligned();
    row.addCell(cell);

    // name
    cell = UITableCell.text(app.name);
    cell.widthWeight = 65;
    cell.leftAligned();
    row.addCell(cell);

    // price
    cell = UITableCell.text(app.formattedPrice[1]);
    cell.widthWeight = 17;
    cell.rightAligned();
    row.addCell(cell);

    ui.addRow(row);
  });
  ui.reload();
}

if (rm) {
  let ui = new UITable();
  createRows(apps, ui);
  await ui.present();
  apps = apps
    .filter((app) => !app.checked)
    .map((app) => {
      delete app.checked;
      return app;
    });
}

// =========================================
// reset section

if (resetPrices) {
  apps.forEach((app) => {
    app.price[0] = app.formattedPrice[0] = undefined;
    app.version[0] = undefined;
    app.inApp.forEach((ia) => {
      ia.price[0] = ia.formattedPrice[0] = undefined;
    });
  });
  log("Prices were reset");
}

save();

Script.complete();

/*

Changelog

v1.0.9 - 2021-09-06
Fix some problems with urls
Create/copy file if no file was found
Fix some spelling

v1.0.8 - 2021-04-20
Add option to disable tracking of in-app purchases
Save state more often

v1.0.7 - 2020-10-04
Fixed error when making too many in-app API requests

v1.0.6 - 2020-03-11
Added a check when adding a URL to only allow the addition of apps

v1.0.5 - 2019-09-19
Adapted to the changes of the AppStore website made by Apple. It should find the in-app-purchases again
Added a message if there was a problem fetching the in-app-purchases of all apps (probably due to a new website change)

v1.0.4 - 2019-06-25
Added tracking of app updates
Added overview of found changes for in app result view
Fixed error while adding a new app, as Apple has changed their API slightly
Fixed bug enabling duplicate apps in the list. If you have duplicates, please remove them manually via the interface

v1.0.3 - 2019-03-05
Fixed error "can't find variable chooseItems"

v1.0.2 - 2019-01-29
Fixed not needed inclusion of module "~chooseItems.js"

v1.0.1 - 2019-01-29
Added ability to reset old prices
Fixed error when an app was removed from the AppStore

v1.0 - 2018-12-02
Initial Release



*/