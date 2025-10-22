const HAFiremoteVersion = 'v4.1.9';

import {LitElement, html, css, unsafeHTML, unsafeCSS, styleMap} from './lit/lit-all.min.js';
import {launcherData, launcherCSS} from "./launcher-buttons.js?version=v4.1.9";
import {rosettaStone} from './language-translations.js?version=v4.1.9';
import {devices} from './supported-devices.js?version=v4.1.9';

console.groupCollapsed("%c 🔥 FIREMOTE-CARD 🔥 %c "+HAFiremoteVersion+" installed ", "color: orange; font-weight: bold; background: black", "color: green; font-weight: bold;"),
console.log("Readme:", "https://github.com/PRProd/HA-Firemote"),
console.groupEnd();

const fireEvent = (node, type, detail, options) => {
  options = options || {};
  detail = detail === null || detail === undefined ? {} : detail;
  const event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed
  });
  event.detail = detail;
  node.dispatchEvent(event);
  return event;
}


// Process the imported data
const devicemap = new Map(Object.entries(devices));
var appmap = new Map(Object.entries(launcherData));
const translationmap = new Map(Object.entries(rosettaStone));


// Set the max number of app launcher buttons for each remote style
const appButtonMax = { "AF4":  6, "AF5":  6, "AF6":  6, "AFJTV": 6, "AFXF2": 6, "AR1": 10, "AR2":   8, "AR3":  8,
                       "CC1":  8, "CC2":  8, "CC3":  8, "NS2":   6, "ON1":   8, "ON2":  8, "RVRP": 10, "RHR": 10,
                       "RTR":  8, "RWR": 10, "RVR": 10, "RSR":  10, "XM1":  10, "XM2": 10, "HO1":   6, "HO2":  8,
                       "HO3":  6, "HO4":  6, "AL1": appmap.size,  "AL2": appmap.size,};


function deviceAttributeQuery(deviceAttribute, configvar){
  var deviceTypeRef = configvar.device_type;
  if(configvar[deviceAttribute+'_override']) {
    if(configvar[deviceAttribute+'_override'] != 'none') {
        return configvar[deviceAttribute+'_override'];
    }
  }
  var attributeValue = '';
  var deviceSearch = function(deviceName, jsonData) {
    for (var key in jsonData) {
      if(typeof(jsonData[key]) === 'object') {
        if(key == deviceName) {
          attributeValue = String(jsonData[key][deviceAttribute]);
        }
        else {
          deviceSearch(deviceName, jsonData[key]);
        }
      }
    }
    return attributeValue;
  }
  return String(deviceSearch(deviceTypeRef, devices));
}


function truncate(str, length) {
  return str.length > length ? str.substr(0, length) : str;
}


function resetAppMap(){
    appmap = new Map(Object.entries(launcherData));
}


function handlehdmi(config, inputs = 0) {
  if( inputs > 0 ) {
    for (let i = 1; i <= inputs; i++) {
      var configitem = "hdmi_"+i;
      var inputname = "HDMI "+i;
      var friendlyname = "HDMI "+i;
      if (config[configitem]) {
        inputname = truncate(config[configitem], 8);
        friendlyname = 'HDMI '+i+' - '+inputname;
      }
      if( config.device_type == 'fire_tv_cube_third_gen') {
        appmap.set(configitem, {"button": inputname, "friendlyName": friendlyname, "androidName": "", "adbLaunchCommand": "adb shell am start -n com.amazon.tv.inputpreference.service/com.amazon.tv.inputpreference.player.InputChooserActivity"});
        return;
      }
      if (config.device_family == "roku") {
        appmap.set(configitem, {"button": inputname, "friendlyName": friendlyname, "appName": "HDMI "+i, "remoteCommand": '{"command": "input_hdmi'+i+'", "num_repeats": 1, "hold_secs": 0}'});
      }
      else {
        appmap.set(configitem, {"button": inputname, "friendlyName": friendlyname, "androidName": "", "adbLaunchCommand": "HDMI"+i});
      }
    }
  }
}


function handlecustomlaunchers(config) {
    // Experimental - Only one of them works through the roku api for some reason ///
//    if (config.device_family == "roku") {
//        appmap.set("roku-secret-screen", {"button": "Secret", "friendlyName": "Function: Secret Screen 1"});
//    }

    let customlaunchers = config.custom_launchers;
    if(typeof customlaunchers == 'undefined' || customlaunchers == null) {
      return;
    }
    if(customlaunchers.constructor !== Array) {
      customlaunchers = new Array(config.custom_launchers);
    }
    var l = 1;
    customlaunchers.forEach((launcher) => {
       var style = ''; var icon = null; var imagePath = null;
       if (launcher.color) { style = 'color:'+launcher.color+';'; }
       if (launcher.background) { style = style+'background:'+launcher.background+';'; }
       var friendlyname = launcher.friendly_name || launcher.label || "customlauncher "+l;
       var label = launcher.label || launcher.friendly_name || "customlauncher "+l;
       if (launcher.icon) {
         icon = '<div class="customLauncherBackground" style="'+style+'"></div><ha-icon icon="'+launcher.icon+'" class="customLauncherIcon" style="'+style+'"></ha-icon>';
       }
       if (launcher.image_path) {
         imagePath = '<div class="customLauncherBackground" style="'+style+'"></div><img src="'+launcher.image_path+'" alt="'+label+'" class="customLauncherImg">';
       }
       label = '<div class="customLauncherBackground" style="'+style+'"></div><div style="'+style+'" class="customLauncherTxt">'+truncate(label, 10)+'</div>';
       var buttonFace = imagePath || icon || label
       appmap.set("customlauncher "+friendlyname, {"button": buttonFace, "friendlyName": "Custom: "+friendlyname, "script": launcher.script, "data": launcher.data});
       l++;
    })
}

function handleAVInputs(config, avInputs = 0) {
    if (avInputs > 0 && config.device_family == "roku") {
        appmap.set("av1_input", {"button": "AV", "friendlyName": "AV Input", "remoteCommand": '{"command": "input_av1", "num_repeats": 1, "hold_secs": 0}'});
    }
}

function handleTunerInputs(config, tunerInput) {
    if (config.device_family == "roku" && (tunerInput == true || tunerInput == 'true')) {
        appmap.set("tuner_input", {"button": "TV Tuner", "friendlyName": "TV Tuner", "remoteCommand": '{"command": "input_tuner", "num_repeats": 1, "hold_secs": 0}'});
        //appmap.set("roku-tv-channel", {"button": "Channel", "friendlyName": "Function: Input TV Channel"});
        return;
    }
    if (config.device_family == "amazon-fire" && (tunerInput == true || tunerInput == 'true')) {
        appmap.set("tuner_input", {"button": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="650" height="200" viewBox="0 0 650 200" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><g stroke="none" fill="#fff" fill-rule="nonzero"><path d="M24.387 146.275l9.642 11.491c.643.766 2.694 1.655 4.226.37l45.963-38.567h0c1.286 1.532 3.46 1.013 4.226.37l17.619-14.784 9.862.863c.766-.643 2.175-.52 2.175-.52l7.66-6.428.643.766c1.286 1.532 2.694 1.655 4.226.37l19.917-16.712c1.532-1.286 1.655-2.694.37-4.226l-10.285-12.257 17.619-14.784c1.532-1.286 3.187-3.98 2.668-6.155s-2.448-4.473-4.5-5.362c-2.694-1.655-5.635-.493-7.167.793l-17.619 14.784-10.285-12.257c-1.286-1.532-2.694-1.655-4.226-.37L97.205 60.37c-1.532 1.286-1.655 2.694-.37 4.226l1.286 1.532-7.66 6.428-1.532 1.286-.863 9.862-17.619 14.784c-.766.643-1.655 2.694-.37 4.226l.643.766-45.963 38.567c-1.532 1.286-1.655 2.694-.37 4.226zm76.288-44.432l-13.789 11.57-10.285-12.257 13.789-11.57zm-64.744 50.41l-5.785-6.894 44.431-37.282 5.785 6.894zm92.375-57.93l-3.214-3.83 16.087-13.499 3.214 3.83zM117.378 81.3l16.087-13.499 3.857 4.596-16.087 13.499zm-7.713-9.193l16.087-13.499 3.857 4.596-16.087 13.499zm43.445-26.011c.766-.643.766-.643 1.409.123s.643.766-.123 1.409l-17.619 14.784-1.286-1.532zm-34.428 4.086l3.857 4.596-16.087 13.499-3.857-4.596zm-16.703 20.543l19.926 23.747-6.894 5.785-8.453-.74L93.7 84.197l1.382-7.687zM249 141l-9-22h-35l-8 22h-12l33-85h9l33 85h-11zm-26-71l-15 40h29l-14-40z"/><use xlink:href="#oVi3"/><path d="M340 63h10v15h12v9h-12v39q0 4 2 6 2 2 5 2 2 0 6-1v9q-5 1-9 1-7 0-11-4-3-5-3-13V87h-12v-9h12V63zm62 80q-13 0-21-9-8-8-8-22v-2q0-10 4-17 3-8 10-12 6-4 14-4 12 0 19 8 7 8 7 23v5h-43q0 9 5 15 6 6 14 6 5 0 9-2 4-3 7-7l7 5q-8 13-24 13zm-1-57q-7 0-11 5-5 4-6 13h32v-1q-1-8-5-13-3-4-10-4z"/><use xlink:href="#oVi3" x="169"/><use xlink:href="#oVi3" x="235"/><path d="M621 142h-11q-1-2-2-7-7 8-18 8-9 0-15-6-6-5-6-13 0-10 8-15 7-6 21-6h10v-5q0-6-3-9-4-3-10-3-6 0-10 3-4 3-4 7h-11q0-5 4-9 3-5 9-7 6-3 12-3 11 0 18 5 6 6 6 16v29q0 8 2 14v1zm-29-9q5 0 10-2 4-3 6-7v-13h-8q-20 0-20 11 0 6 3 8 4 3 9 3z"/></g><defs ><path id="oVi3" d="M270 78h10l1 8q7-9 19-9 20 0 20 23v42h-11v-42q0-7-3-11-3-3-10-3-5 0-9 3-4 3-6 7v46h-11V78z"/></defs></svg>',
                                   "friendlyName": "Antenna",
                                   "androidName": "com.amazon.tv.livetv",
                                   "adbLaunchCommand": "adb shell input keyevent KEYCODE_TV"}
                  );
    }
}


function refreshAppMap(config, inputs = 0, avInputs = 0, tuner = true){
    resetAppMap();
    handlehdmi(config, inputs);
    handlecustomlaunchers(config);
    handleAVInputs(config, avInputs);
    handleTunerInputs(config, tuner);
}


function calculateLayoutCellHeight(h, s) {
    let numOfGapPixels = (( h / 56 ) * 8)-24;
    let standardHeight = ( h - numOfGapPixels ) / 56;
    let scale = s / 100;
    let raw  = standardHeight * scale;
    let calculated = Math.trunc(raw * Math.pow(10, 2)) / Math.pow(10, 2);
    //console.log('scale is '+s+' so Im returning a cell height of '+calculated);
    return calculated;
}

function calculateLayoutCellWidth(w, s) {
    var medianCellWidth = 104; // between 80px and 120px depending on the screen size - adjust as needed
    let numOfGapPixels = (( w / medianCellWidth ) * 8)-24;
    let scale = s / 100;
    let raw = ( (w - numOfGapPixels) / medianCellWidth) * scale;
    let calculated = Math.ceil(raw);
    //console.log('scale is '+s+' so Im returning a cell width of '+calculated+' raw was '+raw);
    return calculated;
}

function calculateMasonryViewHeight(h, s) {
    let scale = s / 100;
    let raw = (h / 50) * scale;
    let calculated = Math.ceil(raw);
    //console.log('masonryViewHeight - scale is '+s+' so Im returning a cell width of '+calculated+' raw was '+raw);
    return calculated;
}



class FiremoteCard extends LitElement {

  // Create and return an editor element
  static getConfigElement() {
    return document.createElement("firemote-card-editor");
  }

  static get properties() {
    return {
      hass: {},
      _config: {},
    };
  }

  // Sets a default card size (height) for masonry dashboard type
  getCardSize(){
    // https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card#sizing-in-masonry-view
    // TODO: This does not account for added app launcher rows
    var scale = this._config.scale || 100;
    switch (deviceAttributeQuery('defaultRemoteStyle', this._config)) {
      case "AF1":
        return calculateMasonryViewHeight(588.38, scale);
        break;
      case "AF2":
        return calculateMasonryViewHeight(634.08, scale);
        break;
      case "AF3":
        return calculateMasonryViewHeight(657.14, scale);
        break;
      case "AF4":
        return calculateMasonryViewHeight(715.94, scale);
        break;
      case "AF5":
        return calculateMasonryViewHeight(772.94, scale);
        break;
      case "AF6":
        return calculateMasonryViewHeight(750.45, scale);
        break;
      case "AFJTV":
      case "AFXF2":
        return calculateMasonryViewHeight(873.02, scale);
        break;
      case "AR1":
        return calculateMasonryViewHeight(747.5, scale);
        break;
      case "AR2":
        return calculateMasonryViewHeight(597, scale);
        break;
      case "AR3":
        return calculateMasonryViewHeight(737, scale);
        break;
      case "CC1":
      case "CC2":
      case "CC3":
        return calculateMasonryViewHeight(696.66, scale);
        break;
      case "NS1":
      case "NS2":
        return calculateMasonryViewHeight(681.98, scale);
        break;
      case "ON1":
      case "ON2":
        return calculateMasonryViewHeight(726.39, scale);
        break;
      case "RVRP":
      case "RVR":
      case "RSR":
        return calculateMasonryViewHeight(680.56, scale);
        break;
      case "RHR":
      case "RWR":
        return calculateMasonryViewHeight(652.56, scale);
        break;
      case "RTR":
        return calculateMasonryViewHeight(680.38, scale);
        break;
      case "XM1":
      case "XM2":
        return calculateMasonryViewHeight(793.98, scale);
        break;
      default:
        return;
    }
  }
  // Announces a default grid size for new experimental sections dashboard type
  getLayoutOptions() {
    // https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card#sizing-in-sections-view
    // TODO: This does not account for added app launcher rows
    var scale = this._config.scale || 100;
    switch (deviceAttributeQuery('defaultRemoteStyle', this._config)) {
      case "AF1":
        return {
          grid_rows: calculateLayoutCellHeight(588.38, scale),
          grid_columns: calculateLayoutCellWidth(193.97, scale),
        }
        break;
      case "AF2":
        return {
          grid_rows: calculateLayoutCellHeight(634.08, scale),
          grid_columns: calculateLayoutCellWidth(193.97, scale),
        }
        break;
      case "AF3":
        return {
          grid_rows: calculateLayoutCellHeight(657.14, scale),
          grid_columns: calculateLayoutCellWidth(193.97, scale),
        }
        break;
      case "AF4":
        return {
          grid_rows: calculateLayoutCellHeight(715.94, scale),
          grid_columns: calculateLayoutCellWidth(193.97, scale),
        }
        break;
      case "AF5":
        return {
          grid_rows: calculateLayoutCellHeight(772.94, scale),
          grid_columns: calculateLayoutCellWidth(193.97, scale),
        }
        break;
      case "AF6":
        return {
          grid_rows: calculateLayoutCellHeight(750.45, scale),
          grid_columns: calculateLayoutCellWidth(193.97, scale),
        }
        break;
      case "AFJTV":
      case "AFXF2":
        return {
          grid_rows: calculateLayoutCellHeight(873.02, scale),
          grid_columns: calculateLayoutCellWidth(193.97, scale),
        }
        break;
      case "AR1":
        return {
          grid_rows: calculateLayoutCellHeight(747.5, scale),
          grid_columns: calculateLayoutCellWidth(184, scale),
        }
        break;
      case "AR2":
        return {
          grid_rows: calculateLayoutCellHeight(597, scale),
          grid_columns: calculateLayoutCellWidth(184, scale),
        }
        break;
      case "AR3":
        return {
          grid_rows: calculateLayoutCellHeight(737, scale),
          grid_columns: calculateLayoutCellWidth(184, scale),
        }
        break;
      case "CC1":
      case "CC2":
      case "CC3":
        return {
          grid_rows: calculateLayoutCellHeight(696.66, scale),
          grid_columns: calculateLayoutCellWidth(203.36, scale),
        }
        break;
      case "HO1":
      case "HO2":
        return {
          grid_rows: calculateLayoutCellHeight(726.39, scale),
          grid_columns: calculateLayoutCellWidth(193.97, scale),
        }
        break;
      case "HO3":
      case "HO4":
        return {
          grid_rows: calculateLayoutCellHeight(902.83, scale),
          grid_columns: calculateLayoutCellWidth(193.97, scale),
        }
        break;
      case "NS1":
      case "NS2":
        return {
          grid_rows: calculateLayoutCellHeight(681.98, scale),
          grid_columns: calculateLayoutCellWidth(137.97, scale),
        }
        break;
      case "ON1":
      case "ON2":
        return {
          grid_rows: calculateLayoutCellHeight(726.39, scale),
          grid_columns: calculateLayoutCellWidth(137.97, scale),
        }
        break;
      case "RVRP":
      case "RVR":
      case "RSR":
        return {
          grid_rows: calculateLayoutCellHeight(680.56, scale),
          grid_columns: calculateLayoutCellWidth(183.8, scale),
        }
        break;
      case "RHR":
      case "RWR":
        return {
          grid_rows: calculateLayoutCellHeight(652.56, scale),
          grid_columns: calculateLayoutCellWidth(183.8, scale),
        }
        break;
      case "RTR":
        return {
          grid_rows: calculateLayoutCellHeight(680.38, scale),
          grid_columns: calculateLayoutCellWidth(202.02, scale),
        }
        break;
      case "XM1":
      case "XM2":
        return {
          grid_rows: calculateLayoutCellHeight(793.98, scale),
          grid_columns: calculateLayoutCellWidth(193.97, scale),
        }
        break;
      default:
        return {
          //grid_rows: 12.25,
          //grid_columns: 2,
        };
    }
  }


  // Returns a minimal configuration that will result in a working card
  static getStubConfig(e) {
    var androidTVEntities = Object.keys(e.entities).filter(
        (eid) => e.entities[eid].platform === 'androidtv'
    );
    var appleTVEntities = Object.keys(e.entities).filter(
        (eid) => e.entities[eid].platform === 'apple_tv'
    );
    var rokuEntities = Object.keys(e.entities).filter(
        (eid) => e.entities[eid].platform === 'roku'
    );
    if (androidTVEntities.length > 0) {
        return { 'entity': androidTVEntities[0],
                 'device_family': 'amazon-fire',
                 'device_type': 'fire_tv_4_series',
                 'compatibility_mode': 'default',
               };
    }
    else if (appleTVEntities.length > 0) {
        return { 'entity': appleTVEntities[0],
                 'device_family': 'apple-tv',
                 'device_type': 'appletv-4k-gen2',
                 'compatibility_mode': 'default',
               };
    }
    else if (rokuEntities.length > 0) {
        return { 'entity': rokuEntities[0],
                 'device_family': 'roku',
                 'device_type': 'roku-ultra-2020',
                 'compatibility_mode': 'default',
               };
    }
    else {
        return { 'entity': '',
                 'device_family': 'amazon-fire',
                 'device_type': 'fire_tv_4_series',
                 'compatibility_mode': 'default',
               };
    }
  }

  setConfig(config) {
    if (!config.entity) {
     throw new Error("entity must be defined. You need to define an Apple TV, Chromecast, Fire TV, NVIDIA Shield, onn., Roku, Xiaomi Mi, or any other media_player entity");
    }
    this._config = config;
  }

  static styles = css`

          ha-card {
            background: rgba(30,30,30,0);
            display: grid;
            justify-content: center;
            padding: 0;
            margin: auto;
            box-shadow: none;
            border: 0;
            outline: 0;
            isolation: isolate;
            direction: ltr;
            -webkit-tap-highlight-color: rgb(0 0 0 / 0%);
          }

          .hidden {
            display: none !important;
          }

          .mdiSubstituteIconWrapper {
            pointer-events: none;
            transform: scale(var(--sz));
          }

          .mdiSubstitueIcon {
            display: var(--ha-icon-display,inline-flex);
            align-items: center;
            justify-content: center;
            position: relative;
            vertical-align: middle;
            fill: var(--icon-primary-color,currentcolor);
            width: var(--mdc-icon-size,24px);
            height: var(--mdc-icon-size,24px);
          }

          .shield-remote-body {
            background: linear-gradient(90deg, rgba(22,21,21,1) 0%, rgba(37,37,37,1) 10%, rgba(37,37,37,1) 90%, rgba(22,21,21,1) 100%);
            border: solid #252525 calc(var(--sz) * 0.14rem);
            padding: calc(var(--sz) * 1.428rem) calc(var(--sz) * 0.714rem) calc(var(--sz) * 2.143rem) calc(var(--sz) * 0.714rem);
            display: grid;
            justify-items: center;
            align-content: flex-start;
            grid-column-gap: calc(var(--sz) * 1.2rem);
            grid-row-gap: calc(var(--sz) * 0.5rem);
            grid-template-columns: 1fr 1fr;
            width: calc(var(--sz) * 8.286rem);
            min-height: calc(var(--sz) * 45rem);
          }

          .shield-remote-body.ns1-body {
            background: linear-gradient(90deg, rgb(28 28 28) 0%, rgb(37, 37, 37) 8%, rgb(40 40 40) 50%, rgb(37, 37, 37) 92%, rgb(28, 28, 28) 100%);
            border: solid #1c1c1c calc(var(--sz) * 0.14rem);
            border-radius: calc(var(--sz) * 1.2rem);
          }

          .roku-remote-body {
            display: flex;
            flex-direction: column;
            align-content: center;
            justify-content: flex-start;
            align-items: center;
            gap: calc(var(--sz) * 1rem);
            background: linear-gradient(90deg, rgba(42,42,42,1) 0%, rgba(58,58,58,1) 50%, rgba(42,42,42,1) 100%);
            border-radius: calc(var(--sz) * 3.25rem);
            border: solid #252525 calc(var(--sz) * 0.6rem);
            border-top: solid #292929 calc(var(--sz) * 0.6rem);
            width: calc(var(--sz) * 11.287rem);
            padding: calc(var(--sz) * 0.35rem);
            padding-bottom: calc(var(--sz) * 1.12rem);
            min-height: calc(var(--sz) * 44rem);
          }

          .roku-remote-body:has(div.rokuTag) {
            margin-bottom: calc(var(--sz) * 2rem);
          }

          .roku-remote-body ha-icon {
            transform: scale(calc(var(--sz) * .8));
          }

          .roku-remote-body > div {
            display: flex;
            flex-wrap: nowrap;
            flex-direction: row;
            align-content: center;
            justify-content: center;
            align-items: center;
            gap: calc(var(--sz) * 0.35rem);
          }

          .roku-remote-body > div:not(.rokuDPadContainer) > button:active {
            box-shadow: none !important;
            transform: scale(0.975);
            transform-origin: center bottom;
          }

          .roku-remote-body > div:not(.rokuDPadContainer) > button:active > ha-icon {
            transform: scale(0.8);
          }

          .roku-remote-body.RVR > div.powerRow {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            align-items: center;
            justify-items: center;
            margin-bottom: calc(var(--sz) * 1rem);
          }

          .roku-remote-body.RTR {
              border-radius: calc(var(--sz) * 6rem);
              padding: calc(var(--sz) * 1rem);
          }

          .roku-remote-body.RWR > div.powerRow,
          .roku-remote-body.RTR > div.powerRow,
          .roku-remote-body.RHR > div.powerRow {
            margin-bottom: calc(var(--sz) * 1.25rem);
          }

          .roku-remote-body > div.micRow {
            height: calc(var(--sz) * 0.4rem);
            aspect-ratio: 1;
            background: black;
            border-radius: 100%;
            margin-top: calc(var(--sz) * 0.4rem);
          }

          .roku-remote-body.RVR div.micRow {
            height: calc(var(--sz) * 0.4rem);
            aspect-ratio: 1;
            background: black;
            border-radius: 100%;
          }

          .roku-remote-body.RSR > div.backHomeRow {
            padding-top: calc(var(--sz) * 5rem);
          }

          .roku-remote-body > div.backHomeRow > button{
            height: calc(var(--sz) * 2.5rem);
            width: calc(var(--sz) * 5.25rem);
            border: solid #090909 calc(var(--sz) * 0.125rem);
            border-radius: calc(var(--sz) * 0.7rem);
            box-shadow: 0px 5px 2px 0px #0000001a;
          }

          .roku-remote-body > div.rokuDPadContainer {
            background: linear-gradient(175deg, rgb(42 42 42) 0%, rgb(51 51 51) 100%);
            padding: calc(var(--sz) * 0.3rem);
            border-radius: calc(var(--sz) * 1.5rem);
            display: grid;
            grid-template-columns: 31% 38% 31%;
            grid-template-rows: 31% 38% 31%;
            grid-gap: 0;
            width: calc(var(--sz) * 10.15rem);
            height: calc(var(--sz) * 10.15rem);
            overflow: hidden;
          }

          .roku-remote-body.RTR > div.rokuDPadContainer {
            padding: calc(var(--sz) * 0.75rem);
            border-radius: 100%;
          }

          .rokuDPadContainer > button {
            background: #662d91;
            color: rgb(198, 198, 198);
            height: 100%;
            width: 100%;
            margin: 0;
            cursor: pointer;
            line-height: normal;
            user-select: none;
            display: grid;
            place-content: center;
            border: 0;
            aspect ratio: 1;
            font-size: calc(var(--sz) * 1.275rem);
            position: relative;
            z-index: 2;
          }

          .rokuDPadContainer > button > ha-icon {
            transform: scale(calc(var(--sz) * 1.3));
          }

          .rokuDPadContainer > button:active > ha-icon, .rokuDPadContainer > button:active > .okCircle {
            color: #bcbcbc;
            transform: scale(calc(var(--sz) * 0.85));
          }

          .roku-remote-body #up-button {
            transform-origin: bottom center;
            border-radius: calc(var(--sz) * 1rem) calc(var(--sz) * 1rem) 0 0;
            position: relative;
          }

          .roku-remote-body #left-button {
            transform-origin: center right;
            border-radius: calc(var(--sz) * 1rem) 0 0 calc(var(--sz) * 1rem);
            box-shadow: 0px 5px 2px 0px #0000001a;
          }

          .roku-remote-body #right-button {
            border-radius: 0 calc(var(--sz) * 1rem) calc(var(--sz) * 1rem) 0;
            transform-origin: center left;
            box-shadow: 0px 5px 2px 0px #0000001a;
            z-index: 1;
          }

          .roku-remote-body #down-button {
            transform-origin: top center;
            border-radius: 0 0 calc(var(--sz) * 1rem) calc(var(--sz) * 1rem);
            box-shadow: 0px 5px 2px 0px #0000001a;
          }

          .roku-remote-body #center-button {
            z-index: 3;
          }

          .roku-remote-body #up-button::before {
            content: '';
            position: absolute;
            margin: 0;
            padding: 0;
            bottom: 0;
            left: calc(var(--sz) * -1.95rem);
            border-radius: 100%;
            height: calc(var(--sz) * 2rem);
            width: calc(var(--sz) * 2rem);
            background: transparent;
            box-shadow: calc(var(--sz) * 1rem) calc(var(--sz) * 1rem) 0 rgb(102, 45, 145);
          }

          .roku-remote-body #up-button::after {
            content: '';
            position: absolute;
            margin: 0;
            padding: 0;
            bottom: 0;
            right: calc(var(--sz) * -1.95rem);
            border-radius: 100%;
            height: calc(var(--sz) * 2rem);
            width: calc(var(--sz) * 2rem);
            background: transparent;
            box-shadow: calc(var(--sz) * -1rem) calc(var(--sz) * 1rem) 0 rgb(102, 45, 145);
          }

          .roku-remote-body #down-button::before {
            content: '';
            position: absolute;
            margin: 0;
            padding: 0;
            top: 0;
            left: calc(var(--sz) * -1.95rem);
            border-radius: 100%;
            height: calc(var(--sz) * 2rem);
            width: calc(var(--sz) * 2rem);
            background: transparent;
            box-shadow: calc(var(--sz) * 1rem) calc(var(--sz) * -1rem) 0 rgb(102, 45, 145);
          }

          .roku-remote-body #down-button::after {
            content: '';
            position: absolute;
            margin: 0;
            padding: 0;
            top: 0;
            right: calc(var(--sz) * -1.95rem);
            border-radius: 100%;
            height: calc(var(--sz) * 2rem);
            width: calc(var(--sz) * 2rem);
            background: transparent;
            box-shadow: calc(var(--sz) * -1rem) calc(var(--sz) * -1rem) 0 rgb(102, 45, 145);
          }

          .rokuDPadContainer > button:not(#center-button):active {
            box-shadow: unset;
            transform: scale(0.98);
          }

          .okCircle {
            padding: calc(var(--sz) * .75rem);
            border-radius: 100%;
            border: calc(var(--sz) * 0.15rem) solid rgb(88 38 125);
            background: linear-gradient(175deg, rgb(165 165 165 / 20%) 10%, rgb(29 29 29 / 20%) 100%);
            margin: 0;
            place-self: center;
            display: flex;
            place-content: center;
            align-items: center;
            user-select: none;
            pointer-events: none;
            aspect-ratio: 1/1;
            overflow: hidden;
          }

          .rokuDPadContainer > button:active > .okCircle {
            color: #bcbcbc;
            transform: scale(calc(var(--sz) * 0.8));
            filter: brightness(0.9);
          }

          .roku-remote-body > div.replayVoiceOptionsRow,
          .roku-remote-body > div.scrubRow,
          .roku-remote-body > div.personalShortcutsRow {
            width: calc(var(--sz) * 10.15rem);
            display: grid;
            grid-template-columns: 35% 22% 35%;;
            justify-content: center;
            place-content: center space-between;
            place-items: center;
            justify-items: stretch;
            align-items: center;
          }

          .roku-remote-body.RVR > div.replayVoiceOptionsRow {
            grid-template-columns: 25% 38% 25%;
          }

          .roku-remote-body.RSR > div.replayVoiceOptionsRow,
          .roku-remote-body.RTR > div.replayVoiceOptionsRow {
            grid-template-columns: 47% 47%;
          }

          .roku-remote-body > div.replayVoiceOptionsRow button,
          .roku-remote-body > div.scrubRow button,
          .roku-remote-body > div.personalShortcutsRow button {
            height: calc(var(--sz) * 2.25rem);
            width: 100%;
            border: solid #090909 calc(var(--sz) * 0.125rem);
            border-radius: calc(var(--sz) * 0.7rem);
            box-shadow: 0px 5px 2px 0px #0000001a;
          }

          .roku-remote-body > div.scrubRow {
            grid-template-columns: 22% 48% 22%;
          }

          .roku-remote-body.RVR > div.scrubRow,
          .roku-remote-body.RSR > div.scrubRow,
          .roku-remote-body.RWR > div.scrubRow {
            margin-bottom: calc(var(--sz) * 0.75rem);
          }

          .roku-remote-body > div.scrubRow button {
            height: calc(var(--sz) * 3rem);
          }

          .roku-remote-body > div.personalShortcutsRow {
            grid-template-columns: 31% 31%;
            gap: calc(var(--sz) * 1.75rem);
            justify-content: center;
            padding: calc(var(--sz) * 0.3rem) 0 calc(var(--sz) * 0.6rem) 0;
          }

          .roku-remote-body > div.personalShortcutsRow > button > ha-icon {
            transform: scale(var(--sz));
          }

          .roku-remote-body .appLauncherAppsContainer {
            display: grid;
            grid-template-columns: 50% 50%;
            grid-row-gap: calc(var(--sz) * 1rem);
            align-items: center;
            justify-items: center;
            justify-content: center;
            align-content: center;
          }

          .roku-remote-body.RHR .appLauncherAppsContainer {
            padding: calc(var(--sz) * 1rem) 0 calc(var(--sz) * 4rem) 0;
          }

          .roku-remote-body.RWR .appLauncherAppsContainer {
            padding-bottom: calc(var(--sz) * 6rem);
          }

          .roku-remote-body .appLauncherAppsContainer > button {
            height: calc(var(--sz) * 1.8rem);
            width: calc(var(--sz) * 5.1426rem);
            border-radius: calc(var(--sz) * 0.7rem);
            box-sizing: border-box;
            align-items: center;
          }

          .roku-remote-body .appLauncherVerticalAppsContainer {
            display: grid;
            margin-top: calc(var(--sz) * 1.25rem);
            gap: calc(var(--sz) * 1rem);
          }

          .rokuBrandLogo {
            padding: calc(var(--sz) * 1rem) 0;
          }

          .RHR .rokuBrandLogo,
          .RWR .rokuBrandLogo {
            position: absolute;
            bottom: calc(var(--sz) * 2rem);
          }

          .RTR .rokuBrandLogo {
            padding: calc(var(--sz) * 1rem) 0 calc(var(--sz) * 2.25rem) 0;
          }

          .rokuBrandLogo svg {
            height: calc(var(--sz) * 1.15rem);
            max-width: calc(var(--sz) * 11.287rem);
          }

          .RHR .rokuBrandLogo svg {
            height: calc(var(--sz) * 0.8rem);
          }

          .RWR .rokuBrandLogo svg {
            height: calc(var(--sz) * 3.1rem);
          }

          .roku-remote-body .rokuTag {
            position: absolute;
            height: calc(var(--sz) * 2.2rem);
            width: calc(var(--sz) * 5.6rem);
            background: repeating-linear-gradient(#662D91, #662D91 calc(var(--sz) * 0.15rem), #3b1955 calc(var(--sz) * 0.15rem), #3b1955 calc(var(--sz) * 0.3rem));
            bottom: 0;
            overflow: hidden;
            box-sizing: border-box;
            padding: calc(var(--sz) * 1.1rem);
            border: solid #662d91 calc(var(--sz) * 0.1rem);
            border-top: none;
            border-bottom: none;
            -webkit-clip-path: polygon(7% 5%, 93% 5%, 100% 0, 100% 100%, 0 100%, 0 0);
            clip-path: polygon(7% 5%, 93% 5%, 100% 0, 100% 100%, 0 100%, 0 0);
          }

          .chromecast-remote-body {
            background: #ebebea;
            border-radius: calc(var(--sz) * 6rem);
            border: solid #cfcfcf calc(var(--sz) * 0.1rem);
            width: calc(var(--sz) * 11.287rem);
            padding: calc(var(--sz) * 0.35rem);
            padding-bottom: calc(var(--sz) * 4rem);
            display: grid;
            justify-items: center;
            align-content: flex-start;
            grid-column-gap: calc(var(--sz) * 1.2rem);
            grid-row-gap: calc(var(--sz) * 0.6rem);
            grid-template-columns: 1fr 1fr;
            min-height: calc(var(--sz) * 37rem);
          }

          .chromecast-remote-body.CC2 {
            background: #cad4d8;
          }

          .chromecast-remote-body.CC3 {
            background: #e1d2cc;
          }

          .apple-remote-body {
            background: #b5b5b5;
            background: linear-gradient(0deg, rgba(147,148,150,1) 0%, rgba(207,211,213,1) 100%);
            border: solid #d1d1d1 calc(var(--sz) * 0.05rem);
            border-radius: calc(var(--sz) * 1.75rem);
            display: grid;
            justify-items: center;
            align-content: flex-start;
            grid-column-gap: calc(var(--sz) * 1rem);
            grid-row-gap: calc(var(--sz) * 0.5rem);
            grid-template-columns: 1fr 1fr;
            width: calc(var(--sz) * 13rem);
            min-height: calc(var(--sz) * 51rem);
            padding-bottom: calc(var(--sz) * 1.5rem);
          }

          .apple-remote-body.AR1 {
            padding-top: calc(var(--sz) * 4.75rem);
            min-height: calc(var(--sz) * 47rem);
            grid-column-gap: calc(var(--sz) * 0.25rem);
            grid-row-gap: calc(var(--sz) * 0.75rem);
            font-size: calc(var(--sz) * 1rem);
          }

          .apple-remote-body.AR2 {
            background: linear-gradient(30deg, rgb(0, 0, 0) 0%, rgb(41, 41, 41) 70%);
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
            grid-row-gap: 0;
            border: solid #2d2d2d calc(var(--sz) * 0.01rem);
            min-height: calc(var(--sz) * 41rem);
            overflow: hidden;
          }

          .AR2TopSection, .AR2BottomSection {
            display: grid;
            justify-items: center;
            align-content: flex-start;
            grid-column-gap: calc(var(--sz) * 1.5rem);
            grid-row-gap: calc(var(--sz) * 0.5rem);
            grid-template-columns: 1fr 1fr;
            box-sizing: border-box;
          }

          .AR2TopSection {
            background: linear-gradient(0deg, rgba(46,46,46,1) 0%, rgba(59,59,59,1) 100%);
            height: 100%;
            width: 100%;
            padding-bottom: calc(var(--sz) * 0.25rem);
          }

          .AR2BottomSection {
            padding-top: calc(var(--sz) * 0.5rem);
          }

          .apple-remote-body.AR2 > div > button:nth-of-type(odd), .apple-remote-body.AR3 > button:nth-of-type(odd) {
            justify-self: self-end;
            transform-origin: center center;
          }

          .apple-remote-body.AR2 > div > button:nth-of-type(even), .apple-remote-body.AR3 > button:nth-of-type(even) {
            justify-self: self-start;
            transform-origin: center center;
          }

          .remote-body {
            background: linear-gradient(90deg, rgba(27,27,27,1) 0%, rgba(37,37,37,1) 8%, rgba(55,55,55,1) 50%,
                                               rgba(37,37,37,1) 92%, rgba(27,27,27,1) 100%);
            border: solid #252525 calc(var(--sz) * 0.14rem);
            border-radius: calc(var(--sz) * 8rem) calc(var(--sz) * 8rem) calc(var(--sz) * 8rem) calc(var(--sz) * 8rem) / calc(var(--sz) * 2.5rem) calc(var(--sz) * 2.5rem) calc(var(--sz) * 2.5rem) calc(var(--sz) * 2.5rem);
            padding: calc(var(--sz) * 1.428rem) calc(var(--sz) * 0.714rem) calc(var(--sz) * 2.143rem) calc(var(--sz) * 0.714rem);
            display: grid;
            justify-items: center;
            grid-column-gap: calc(var(--sz) * 0.14rem);
            grid-row-gap: calc(var(--sz) * 0.5rem);
            grid-template-columns: 1fr 1fr 1fr;
            width: calc(var(--sz) * 12.286rem);
          }

          .remote-body.AF6 {
            border-radius: calc(var(--sz) * 2.8rem);
          }

          .XM2 {
            min-height: calc(var(--sz) * 53rem);
            grid-template-rows: repeat(7, auto) 1fr;
            border-radius: calc(var(--sz) * 2rem);
          }

          .AL1, .AL2 {
            display: block;
            width: unset;
            border-radius: calc(var(--sz) * 0.5rem);
            padding: calc(var(--sz) * 1.4rem) calc(var(--sz) * 0.714rem);
          }

          .two-col-span {
            grid-column-start: 1;
            grid-column-end: 3;
            width: 100%;
            display: grid;
            justify-content: center;
            grid-row-gap: calc(var(--sz) * 0.143rem);
            align-content: center;
          }

          .three-col-span {
            grid-column-start: 1;
            grid-column-end: 4;
            width: 100%;
            display: grid;
            grid-column-gap: calc(var(--sz) * 0.143rem);
            grid-template-columns: 50% 50%;
            align-content: center;
          }

          .apple-tv-top {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            width: calc(var(--sz) * 11.286rem);
            justify-items: center;
            align-items: center;
            justify-content: center;
            align-content: center;
            padding-top: calc(var(--sz) * 0.85rem);
          }

          .remote-body #channel-up-button, .remote-body #channel-down-button {
            --mdc-icon-size: 38px;
          }

          .nsappsgrid {
            display: grid;
            grid-row-gap: calc(var(--sz) * 0.6rem);
          }

          .afappsgrid {
            display: grid;
            margin-top: calc(var(--sz) * 0.57rem);
            row-gap: calc(var(--sz) * 0.9rem);
            justify-items: center;
          }

          .XM2 .afappsgrid {
            margin-bottom: calc(var(--sz) * 0.57rem);
          }

          .appLauncherAppsContainer {
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            align-content: center;
            align-items: center;
            justify-content: center;
            gap: calc(var(--sz) * 0.9rem);
          }

          .ns1-wings {
            grid-column-start: 1;
            grid-column-end: 3;
            width: 100%;
            height: calc(var(--sz) * 25rem);
            margin-top: calc(var(--sz) * -1rem);
            display: grid;
            grid-template-columns: 1fr 27% 1fr;
          }

          #ns1spine {
            display: grid;
            padding: calc(var(--sz) * 4rem) 0;
          }

          #ns1spine button {
            all: unset;
            background: transparent;
          }

          #ns1spine button:active {
            background: #363636;
          }

          #wingL {
            background: rgb(28 28 28);
            -webkit-clip-path: polygon(100% 15%, 100% 85%, 0 100%, 0 0);
            clip-path: polygon(100% 15%, 100% 85%, 0 100%, 0 0);
            margin-left: calc(var(--sz) *-.714rem);
            border-right: solid #121212 calc(var(--sz) * .15rem);
          }

          #wingR {
            background: rgb(28 28 28);
            -webkit-clip-path: polygon(100% 0, 100% 100%, 0 85%, 0 15%);
            clip-path: polygon(100% 0, 100% 100%, 0 85%, 0 15%);
            margin-right: calc(var(--sz) *-.714rem);
            border-left: solid #121212 calc(var(--sz) * .15rem);
          }

          .ALControlsContainer {
            display: flex;
            gap: calc(var(--sz) * .25rem);
            place-items: center;
            padding-top: calc(var(--sz) * 2rem);
            margin-top: calc(var(--sz) * 2rem);
            border-top: groove rgb(0 0 0 / 42%) calc(var(--sz) * 0.2rem);
            justify-content: space-evenly;
            flex-wrap: wrap;
            flex-direction: row;
            width: 100%;
          }

          .ALControlsContainer.noApps {
            padding-top: 0;
            margin-top: 0;
            border-top: 0;
          }

          .ALControlsContainer > div {
            display: grid;
            justify-items: center;
            justify-content: center;
          }

          .left-pocket-controls {
            display: flex;
            column-gap: calc(var(--sz) * 2rem);
            row-gap: calc(var(--sz) * 0.5rem);
            flex-wrap: wrap;
            justify-content: center;
          }

          .ALControlsContainer .row {
            display: flex;
            align-items: center;
            gap: calc(var(--sz) * 0.5rem);
            padding: calc(var(--sz) * 0.75rem);
            background: rgb(255 255 255 / 6%);
            border: inset #000 calc(var(--sz) * 0.2rem);
          }

          .ALControlsContainer .row.noframes {
            background: none;
            border: 0;
          }

          .right-pocket-controls > .row {
            column-gap: calc(var(--sz) * 0.5rem);
            line-height: calc(var(--sz) * .4rem);
          }

          .remote-button {
            height: calc(var(--sz) * 3.572rem);
            width: calc(var(--sz) * 3.572rem);
            border: solid black calc(var(--sz) * 0.0714rem);
            border-radius: 100%;
            display: grid;
            justify-content: center;
            align-content: center;
            color: rgb(198 198 198);
            background: rgb(33 33 33);
            box-shadow: rgb(0 0 0 / 13%) 0 calc(var(--sz) * 0.214rem) calc(var(--sz) * 0.143rem 0);
            cursor: pointer;
            line-height: normal;
            user-select: none;
            padding: calc(var(--sz) * 0.2857rem);
          }

          #power-button {
            height: calc(var(--sz) * 2.8rem);
            width: calc(var(--sz) * 2.8rem);
            margin-bottom: calc(var(--sz) * -0.643rem);
          }

          .shield-remote-body .remote-button {
            height: calc(var(--sz) * 3rem);
            width: calc(var(--sz) * 3rem);
          }

          .apple-remote-body .remote-button {
            height: calc(var(--sz) * 4.75rem);
            width: calc(var(--sz) * 4.75rem);
          }

          .apple-remote-body.AR2 .remote-button {
            height: calc(var(--sz) * 4.5rem);
            width: calc(var(--sz) * 4.5rem);
          }

          .apple-remote-body.AR1 #back-button.remote-button, .apple-remote-body.AR2 #back-button.remote-button {
            font-size: calc(var(--sz) * 1rem);
            font-weight: 600;
          }

          .apple-remote-body.AR2 #search-button.remote-button, .apple-remote-body.AR3 #back-button.remote-button {
            background: linear-gradient(rgb(0, 0, 0) 0%, rgb(48, 48, 48) 100%);
            outline: solid #2b2b2b calc(var(--sz) * 0.01rem);
          }


          .chromecast-remote-body .remote-button, .chromecast-remote-body #keyboard-button {
            background: #fff;
            border: solid #bfbfbf calc(var(--sz) * 0.02em);
            height: calc(var(--sz) * 4.2rem);
            width: calc(var(--sz) * 4.2rem);
            box-shadow: rgb(0 0 0 / 5%) 0 calc(var(--sz) * 0.214rem) calc(var(--sz) * 0.1428rem) 0;
          }

          .chromecast-remote-body.CC2 .remote-button {
            background: #d5e0e4;
            border-color: #a6a6a6;
          }

          .chromecast-remote-body.CC3 .remote-button {
            background: #efddd6;
            border-color: #bababa;
          }

          .chromecast-remote-body .srcButton {
            border: solid #bfbfbf calc(var(--sz) * 0.02em);
            height: calc(var(--sz) * 4.2rem);
            width: calc(var(--sz) * 4.2rem);
            border-radius: 100%;
          }

          .chromecast-remote-body #keyboard-button {
            background: #484848;
          }

          .chromecast-remote-body #keyboard-button > ha-icon {
            color: rgb(235, 235, 234);
          }

          .chromecast-remote-body.CC2 #keyboard-button {
            background: linear-gradient(0deg, rgba(186,214,198,1) 0%, rgba(222,239,231,1) 90%);
            border-color: #a6a6a6;
          }

          .chromecast-remote-body.CC3 #keyboard-button {
            background: linear-gradient(0deg, rgba(221,158,152,1) 0%, rgba(228,186,180,1) 90%);
            border-color: #a6a6a6;
          }

          .chromecast-remote-body.CC2 #keyboard-button > ha-icon,
          .chromecast-remote-body.CC3 #keyboard-button > ha-icon {
            color: #fff;
          }

          .apple-remote-body .srcButton {
            border: solid #bfbfbf calc(var(--sz) * 0.02em);
            height: calc(var(--sz) * 4.75rem);
            width: calc(var(--sz) * 4.75rem);
            border-radius: 100%;
          }

          .shield-remote-body #power-button, .XM2 #power-button{
            height: calc(var(--sz) * 3rem);
            width: calc(var(--sz) * 3rem);
            margin-bottom: unset;
          }

          .XM2 #power-button, .XM2 #keyboard-button, .AL2 #power-button, .AL2 #keyboard-button {
            height: calc(var(--sz) * 3.572rem);
            width: calc(var(--sz) * 3.572rem);
          }

          .roku-remote-body #keyboard-button {
            height: calc(var(--sz) * 2.25rem);
            width: 100%;
          }

          .AL2 #power-button {
            margin-bottom: unset;
          }

          .right {
            display: flex;
            width: 100%;
            justify-content: flex-end;
          }

          .apple-remote-body #power-button {
            background: none;
            border: gray 0.01rem solid;
            transform: scale(0.75);
            margin: 0;
          }

          .shield-remote-body #power-button > ha-icon {
            color: #851313;
          }

          .apple-remote-body #power-button > ha-icon {
            color: rgb(33, 33, 33);
          }

          .roku-remote-body #power-button > ha-icon {
            color: #970000;
          }

          .XM2 #power-button > ha-icon {
            color: #835437;
          }

          #headset-button {
            height: calc(var(--sz) * 2.8rem);
            width: calc(var(--sz) * 2.8rem);
            margin-bottom: calc(var(--sz) * -0.643rem);
          }

          .shield-remote-body #home-button {
            --mdc-icon-size: 17px;
          }

          .shield-remote-body.ns1-body #home-button {
            --mdc-icon-size: 23px;
          }

          .apple-remote-body #back-button {
            --mdc-icon-size: 36px;
          }

          .shield-remote-body #back-button {
            --mdc-icon-size: 41px;
          }

          .notch {
            background: #181818;
            height: calc(var(--sz) * 1rem);
            width: calc(var(--sz) * 0.4rem);
            margin-top: calc(var(--sz) * -0.5rem);
            border-radius: calc(var(--sz) * 0.2rem);
          }

          .apple-remote-body .notch {
            margin: 0;
            width: calc(var(--sz) * 1rem);
            height: calc(var(--sz) * 0.4rem);
          }

          .chromecast-remote-body .notch {
            height: calc(var(--sz) * 0.8rem);
            width: calc(var(--sz) * 0.3rem);
            rotate: 90deg;
            margin: 0;
          }

          .shieldNotch {
            grid-column: 1 / 3;
            background: rgb(24, 24, 24);
            height: calc(var(--sz) * 0.3rem);
            width: calc(var(--sz) * 0.75rem);
            margin-top: calc(var(--sz) * -0.5rem);
            border-radius: calc(var(--sz) * 0.2rem);
          }

          .notchtall {
            margin-bottom: calc(var(--sz) * 1.65rem);
          }

          .ns1-body .shieldNotch {
            height: calc(var(--sz) * 0.75rem);
            width: calc(var(--sz) * 2.2rem);
            border: solid #282828 calc(var(--sz) * 0.12rem);
            border-radius: calc(var(--sz) * 0.5rem);
          }

          #keyboard-button {
            height: calc(var(--sz) * 3rem);
            width: calc(var(--sz) * 3rem);
          }

          .teal {
            background: #09727e;
          }

          .dpadContainer{
            grid-column: 1 / 4;
            display: grid;
            margin-bottom: calc(var(--sz) * 0.65rem);
            width: calc(var(--sz) * 11.286rem);
            height: calc(var(--sz) * 11.286rem);
            position: relative;
          }

          .chromecast-remote-body .dpadContainer,
          .apple-remote-body .dpadContainer {
            grid-column: 1 / 3;
            margin-bottom: 0;
          }

          .apple-remote-body.AR2 .dpadContainer {
            overflow: hidden;
          }

          .XM2 .dpadContainer,
          .XM.dpadContainer {
            align-items: center;
            justify-items: center;
            position: relative;
          }

          .shieldDpad {
            grid-column: 1 / 3;
            width: calc(var(--sz) * 8.2rem);
            height: calc(var(--sz) * 8.2rem);
            position: relative;
          }

          .ALControlsContainer .dpadContainer {
            grid-column: unset;
          }

          .centerbutton{
            all: unset;
            cursor: pointer;
            border: solid black calc(var(--sz) * 0.0714rem);
            margin-left: calc(var(--sz) * 2.357rem);
            margin-top: calc(var(--sz) * 2.357rem);
            width: calc(var(--sz) * 6.428rem);
            height: calc(var(--sz) * 6.428rem);
            border-radius: 100%;
            position: absolute;
            background: rgba(55,55,55,1);
            box-shadow: inset 0 0.calc(var(--sz) * 2857rem) calc(var(--sz) * 0.1428rem) calc(var(--sz) * -0.1428rem) #000000d9;
            z-index: 5;
          }

          .directionButtonContainer{
            transform: rotate(45deg);
            border: calc(var(--sz) * 0.0714rem) solid black;
            display: grid;
            grid-template-columns: auto auto;
            border-radius: 100%;
            overflow: hidden;
            box-shadow: rgb(20 20 20) calc(var(--sz) * 0.1428rem) calc(var(--sz) * 0.1428rem) calc(var(--sz) * 0.4285rem);
            position: relative;
          }

          .AR2 .directionButtonContainer {
            margin-top: calc(var(--sz) * -1.4rem);
            margin-left: calc(var(--sz) * -1.35rem);
            border-radius: 0;
            border: 0;
            overflow: unset;
            box-shadow: none;
          }

          .chromecast-remote-body .directionButtonContainer,
          .CC .directionButtonContainer {
            border: calc(var(--sz) * 0.0714rem) solid #9d9d9d;
            box-shadow: rgb(0 0 0 / 29%) 0 0 calc(var(--sz) * 0.4rem) calc(var(--sz) * 0.02rem);
          }

          .dpadbutton{
            all: unset;
            cursor: pointer;
            width: calc(var(--sz) * 5.5714rem);
            height: calc(var(--sz) * 5.5714rem);
            background: #141414;
            color: white;
            font-size: calc(var(--sz) * 1rem);
            outline: solid #2e2e2e calc(var(--sz) * 0.0714rem);
          }

          .AR2 .dpadbutton {
            width: calc(var(--sz) * 7rem);
            height: calc(var(--sz) * 7rem);
            outline: none;
          }

          .XM2 .dpadbutton,
          .XM .dpadbutton {
            background: rgb(28 28 28);
            border: solid rgb(15 15 15) calc(var(--sz) * 0.03rem);
            outline: none;
            box-sizing: border-box;
          }

          .XM2 .dpadbutton:active,
          .XM .dpadbutton:active {
            background: rgb(24 24 24);
            border: solid #000 calc(var(--sz) * 0.15rem);
          }

          .chromecast-remote-body.CC1 .dpadbutton,
          .CC .dpadbutton {
            background: #fff;
            outline: solid #c5c5c5 calc(var(--sz) * 0.0714rem);
          }

          .chromecast-remote-body.CC2 .dpadbutton,
          .CC2 .dpadbutton {
            background: #cad4d8;
            outline: solid #c5c5c5 calc(var(--sz) * 0.0714rem);
          }

          .chromecast-remote-body.CC3 .dpadbutton,
          .CC3 .dpadbutton {
            background: #e1d2cc;
            outline: solid #c5c5c5 calc(var(--sz) * 0.0714rem);
          }

          .AR3 .dpadbutton:nth-child(1)::after,
          .AR1 .dpadbutton:nth-child(1)::after {
            content: "•";
            text-align: center;
            display: block;
            font-weight: 600;
            color: rgb(198, 198, 198);
            padding-right: calc(var(--sz) * 1.2rem);
            padding-bottom: calc(var(--sz) * 1.2rem);
          }

          .AR3 .dpadbutton:nth-child(2)::after,
          .AR1 .dpadbutton:nth-child(2)::after {
            content: "•";
            text-align: center;
            display: block;
            font-weight: 600;
            color: rgb(198, 198, 198);
            padding-left: calc(var(--sz) * 1.2rem);
            padding-bottom: calc(var(--sz) * 1.2rem);
          }

          .AR3 .dpadbutton:nth-child(3)::after,
          .AR1 .dpadbutton:nth-child(3)::after {
            content: "•";
            text-align: center;
            display: block;
            font-weight: 600;
            color: rgb(198, 198, 198);
            padding-right: calc(var(--sz) * 1.2rem);
            padding-top: calc(var(--sz) * 1.2rem);
          }

          .AR3 .dpadbutton:nth-child(4)::after,
          .AR1 .dpadbutton:nth-child(4)::after {
            content: "•";
            text-align: center;
            display: block;
            font-weight: 600;
            color: rgb(198, 198, 198);
            padding-left: calc(var(--sz) * 1.2rem);
            padding-top: calc(var(--sz) * 1.2rem);
          }

          .dpadbutton:active {
            background: #282828;
          }

          .chromecast-remote-body .dpadbutton:active,
          .CC .dpadbutton:active {
            background: #efefef;
          }

          .chromecast-remote-body.CC2 .dpadbutton:active {
            background: #bfcbd0;
          }

          .chromecast-remote-body.CC3 .dpadbutton:active {
            background: #dbcac3;
          }

          .dpadbuttonShield {
            width: calc(var(--sz) * 4.101rem);
            height: calc(var(--sz) * 4.101rem);
          }

          .centerbuttonShield {
            width: calc(var(--sz) * 5rem);
            height: calc(var(--sz) * 5rem);
            margin: 0px;
            padding: 0px;
            place-self: center;
            position: absolute;
            background: rgba(37,37,37,1);
            background: radial-gradient(circle, rgba(28,28,28,1) 0%, rgba(37,37,37,1) 100%);
          }

          .XM2 .centerbutton,
          .XM .centerbutton {
            background: rgb(28, 28, 28);
            border: solid black calc(var(--sz) * 0.2rem);
            width: calc(var(--sz) * 5rem);
            height: calc(var(--sz) * 5rem);
            margin: 0px;
            position: absolute;
            box-sizing: border-box;
          }

          .chromecast-remote-body .centerbutton,
          .CC .centerbutton {
            background: linear-gradient(rgb(226 226 226) 0%, rgb(255, 255, 255) 70%);
            box-shadow: inset rgb(0 0 0 / 10%) 0 calc(var(--sz) * 0.15rem) calc(var(--sz) * 0.4rem);
            border: solid #dddddd calc(var(--sz) * 0.0714rem);
            width: calc(var(--sz) * 4rem);
            height: calc(var(--sz) * 4rem);
            place-self: center;
            position: absolute;
            margin: 0;
            padding: 0;
          }

          .chromecast-remote-body.CC2 .centerbutton {
            background: linear-gradient(0deg, rgb(208 218 225) 5%, rgb(181 194 199) 100%);
            border: solid #bbc5c9 calc(var(--sz)* 0.0714rem);
          }

          .chromecast-remote-body.CC3 .centerbutton {
            background: linear-gradient(0deg, rgba(245,226,219,1) 0%, rgba(196,180,174,1) 100%);
            border: solid #d9d1d1 calc(var(--sz)* 0.0714rem);
          }

          .apple-remote-body .centerbutton,
          .AR3 .centerbutton {
            background: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(48,48,48,1) 100%);
            width: calc(var(--sz) * 6rem);
            height: calc(var(--sz) * 6rem);
            margin-left: calc(var(--sz) * 2.65rem);
            margin-top: calc(var(--sz) * 2.65rem);
            box-sizing: border-box;
            transform-origin: center bottom;
            outline: solid #2e2e2e calc(var(--sz) * 0.0714rem);
          }

          .AR1 .centerbutton {
            background: linear-gradient(180deg, rgb(147, 148, 150) 0%, rgb(207, 211, 213) 100%);
          }

          .apple-remote-body.AR2 .centerbutton {
            border-radius: 0;
            border: 0;
            outline: 0;
            transform: scale(.75);
            transform-origin: center;
            text-align: center;
          }

          .apple-remote-body.AR2 .dpadContainer button {
            background: none;
            color: transparent;
          }
          .apple-remote-body.AR2 .dpadContainer button:hover,
          .apple-remote-body.AR2 .dpadContainer button:active {
            color: #636363;
            text-align: center;
          }


          .centerbutton:active {
            transform: scale(95%);
          }

          .chromecast-remote-body .centerbutton:active,
          .CC .centerbutton:active {
            transform: none;
            box-shadow: inset rgb(0 0 0 / 19%) 0 calc(var(--sz) * 0.25rem) calc(var(--sz) * 0.4375rem) calc(var(--sz) * 0.125rem);
          }


          .apple-remote-body .centerbutton:active,
          .AR3 .centerbutton:active {
            transform: none;
            border: calc(var(--sz) * 0.2rem) solid black;
          }

          .AR3 .centerbutton:active {
            background: linear-gradient(180deg, rgba(0,0,0,1) 15%, rgba(48,48,48,1) 100%);
          }

          .XM1 .centerbutton:active,
          .XM2 .centerbutton:active,
          .XM .centerbutton:active {
            transform: none;
            border: solid #090909 calc(var(--sz) * 0.24rem);
            background: rgb(26 26 26);
          }

          .minimal.dpadContainer {
            align-items: center;
            justify-items: center;
            display: grid;
            grid-template-columns: auto calc(var(--sz) * 5rem) auto;
            grid-template-rows: auto calc(var(--sz) * 5rem) auto;
            margin: calc(var(--sz) * 1rem);
            height: calc(var(--sz) * 10.3rem);
            aspect-ratio: 1/1;
          }

          .minimal .directionButtonContainer {
            border-radius: 30%;
            border: none;
            box-shadow: none;
          }

          .minimal .dpadbutton {
            background: transparent;
            outline: none;
            display: grid;
            height: 100%;
            width: 100%;
            transform-origin: center center;
            align-self: start;
            justify-items: center;
            justify-content: center;
            align-content: center;
          }

          .minimal .dpadbutton > svg {
            pointer-events: none;
          }

          .minimal .dpadbutton:active {
            transform: scale(0.8);
          }

          .minimal .dpadbutton > svg {
            display: inline-block;
            transform: scale(calc(var(--sz) * .55));
          }

          .minimal .centerbutton {
            border: calc(var(--sz) * 0.175rem) solid rgb(179 179 179);
            background: transparent;
            border-radius: 25%;
            width: calc(var(--sz) * 3rem);
            height: calc(var(--sz) * 3rem);
            margin: 0;
            position: unset;
          }

          .minimal.dpadContainer #up-button {
             align-content: flex-start;
          }

          .minimal.dpadContainer #right-button {
             justify-content: flex-end;
          }

          .minimal.dpadContainer #down-button {
             align-content: flex-end;
          }

          .minimal.dpadContainer #left-button {
             justify-content: flex-start;
          }

          .remote-button:active {
            box-shadow: inset rgb(0 0 0 / 13%) 0 calc(var(--sz) * 0.2857rem) calc(var(--sz) * 0.1428rem) 0;
          }

          .remote-button > ha-icon {
            color: #c6c6c6;
          }

          .remote-button:active > ha-icon, .remote-button:active > .mdiSubstituteIconWrapper {
            color: #bcbcbc;
            transform: scale(calc(var(--sz) * 0.85));
          }

          .chromecast-remote-body ha-icon {
            color: #686868;
          }

          .chromecast-remote-body .remote-button:active {
            box-shadow: rgb(0 0 0 / 5%) 0px calc(var(--sz) * 0.125rem) calc(var(--sz) * 0.125rem) calc(var(--sz) * 0.1875rem) inset;
          }

          .chromecast-remote-body .remote-button:active > ha-icon {
            color: #000;
          }

          .square {
            border-radius: 0;
            border: 0;
            padding: 0;
          }

          .round-top {
            border-radius: 100% 100% 0 0;
            border-bottom: 0;
            box-shadow: none;
            height: calc(var(--sz) * 3.92857rem);
            margin-bottom: calc(var(--sz) * -0.5rem);
          }

          .round-bottom {
            border-radius: 0 0 100% 100%;
            border-top: 0;
            height: calc(var(--sz) * 3.92857rem);
            margin-top: calc(var(--sz) * -0.5rem);
          }

          .apple-remote-body .round-bottom, .apple-remote-body.AR2 .round-bottom {
            height: calc(var(--sz) * 5.25rem);
          }

          .square:active, .round-bottom:active {
              box-shadow: none;
          }

          .remote-body #volume-up-button, .remote-body #volume-down-button {
              font-size: calc(var(--sz) * 2.5rem);
          }
          .apple-remote-body #volume-up-button, .apple-remote-body #volume-down-button {
              font-size: calc(var(--sz) * 2.25rem);
          }
          .remote-body #programmable-one-button, .remote-body #programmable-two-button {
              font-size: calc(var(--sz) * 1.75rem);
          }

          .remote-body #volume-up-button:active, .remote-body #volume-down-button:active {
              font-size: calc(var(--sz) * 2rem);
          }
          .apple-remote-body #volume-up-button:active, .apple-remote-body #volume-down-button:active {
              font-size: calc(var(--sz) * 1.75rem);
          }
          .remote-body #programmable-one-button:active, .remote-body #programmable-two-button:active {
              font-size: calc(var(--sz) * 1.45rem);
          }

          .srcButton {
            height: calc(var(--sz) * 2rem);
            width: calc(var(--sz) * 5.714rem);
            border: solid #090909 calc(var(--sz) * 0.0714rem);
            border-radius: calc(var(--sz) * 2rem);
            display: grid;
            justify-items: center;
            align-content: center;
            color: rgb(198 198 198);
            background: rgb(33 33 33);
            box-shadow: rgb(0 0 0 / 25%) 0 calc(var(--sz) * 0.214rem) calc(var(--sz) * 0.1428rem) 0;
            cursor: pointer;
            line-height: normal;
            user-select: none;
            font-size: calc(var(--sz) * 1.14rem);
            padding: calc(var(--sz) * 0.285rem);
            white-space: nowrap;
            transform: translate3d(0,0,0); /* because ios safari mobile */
            overflow: hidden;
            transition: filter 250ms;
            filter: var(--appButtonFilter);
          }

          .apple-remote-body .srcButton {
            border: none;
            box-shadow: rgb(0 0 0 / 13%) 0 calc(var(--sz) * 0.214rem) calc(var(--sz) * 0.143rem 0);
            transition: none;
          }

          .chromecast-remote-body .srcButton {
            filter: grayscale(40%);
            box-shadow: rgb(0 0 0 / 5%) 0 calc(var(--sz) * 0.214rem) calc(var(--sz) * 0.1428rem) 0;
          }

          .srcButton:active, .srcButton.appActive {
            filter: none;
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
            transition: filter 0s;
          }

          .srcButton.appActiveUnknown {
            filter: grayscale(0%) brightness(100%);
            transition: filter 0s;
          }

          .shield-remote-body .srcButton {
            height: calc(var(--sz) * 3rem);
            width: calc(var(--sz) * 8rem);
          }

          .srcButton:active {
            filter: brightness(90%);
            transform: scale(.95);
            box-shadow: none;
            transform-origin: center bottom;
          }

          .chromecast-remote-body .srcButton:active {
            filter: none;
          }

          .srcButton svg {
            pointer-events: none;
            max-width: calc(var(--sz) * 4.5rem);
            max-height: calc(var(--sz) * 1.6rem);
          }

          .shield-remote-body .srcButton svg {
            max-height: calc(var(--sz) * 2.1rem);
            max-width: calc(var(--sz) * 6.8rem);
          }

          .chromecast-remote-body .srcButton svg, .apple-remote-body .srcButton svg {
            max-width: calc(var(--sz) * 3.25rem);
            max-height: calc(var(--sz) * 3.25rem);
          }

          .apple-remote-body .srcButton svg {
            max-width: calc(var(--sz) * 3.55rem);
            max-height: calc(var(--sz) * 3.55rem);
          }

          .chromecastBottomIndentedRow {
            display: grid;
            width: calc(100% - (var(--sz) * 1.2rem) - (var(--sz) * 0.4rem * 2));
            padding: calc(var(--sz) * 0.4rem);
            box-sizing: border-box;
            grid-template-columns: auto 1fr auto;
            box-shadow: rgb(0 0 0 / 28%) 0 calc(var(--sz) * 0.12rem) calc(var(--sz) * 0.4rem) inset;
            border-radius: calc(var(--sz) * 5rem);
            grid-column: 1 / 3;
            place-items: center;
            margin-top: calc(var(--sz) * 1rem);
          }

          .chromecastBottomIndentedRow .remote-button, .chromecastBottomIndentedRow .input-button {
            height: calc(var(--sz) * 2.3rem) !important;
            width: calc(var(--sz) * 2.3rem) !important;
            margin: 0 !important;
          }

          .chromecastVolumeRocker {
            grid-column: 1 / 3;
            place-items: center;
            width: calc(100% - (var(--sz) * 1.2rem) - (var(--sz) * 0.4rem * 2));
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .chromecastVolumeRocker > button {
            height: calc(var(--sz) * 2rem) !important;
            width: 100% !important;
            box-shadow: rgb(0 0 0 / 5%) 0 calc(var(--sz) * 0.214rem) calc(var(--sz) * 0.1428rem) 0;
          }

          .chromecastVolumeRocker #volume-down-button {
            border-radius: calc(var(--sz) * 2rem) 0 0 calc(var(--sz) * 2rem);
            border-right: calc(var(--sz) * 0.05rem) solid #ebebeb;
          }

          .chromecastVolumeRocker #volume-up-button {
            border-radius: 0% calc(var(--sz) * 2rem) calc(var(--sz) * 2rem) 0;
            border-left: 0;
          }

          .digit-pad-button {
            font-size: calc(var(--sz) * 1rem);
            font-weight: 600;
            height: calc(var(--sz) * 2rem);
            border-radius: calc(var(--sz) * 1em);
          }

          .digit-pad-button:active {
            font-size: calc(var(--sz) * 0.9rem);
          }

          .deviceNameTop {
            white-space: nowrap;
            font-size: calc(var(--sz) * 1rem);
            overflow: hidden;
            color: var(--devicenamecolor);
            margin-left: -1rem;
            text-align: center;
            display: grid;
            height: calc(var(--sz) * 2rem);
            align-items: center;
            align-content: center;
            justify-items: center;
          }

          .AF6 .deviceNameTop,
          .AFJTV .deviceNameTop,
          .AFXF2 .deviceNameTop{
            grid-column: 1 / 4;
            display: block;
            text-align: center;
            margin: 0;
            padding: 0;
          }

          .AL1 .deviceNameTop, .AL2 .deviceNameTop {
            margin: 0rem 0px calc(var(--sz) * 1.25rem);
            display: block;
            height: unset;
            overflow: unset;
            font-size: calc(var(--sz) * 1.25rem);
          }

          .roku-remote-body .deviceNameTop {
            margin-left: 0;
            height: auto;
          }

          .roku-remote-body.RSR .deviceNameTop {
              position: absolute;
          }

          .shield-remote-body .deviceNameTop {
            display: unset;
            align-items: unset;
            align-content: unset;
            justify-items: unset;
            margin-left: 0;
            margin-top: -1rem;
          }

          .shield-remote-body.ns1-body .deviceNameTop {
            margin-top: 0rem;
            margin-bottom: -0.75rem;
          }

          .XM2 .deviceNameTop {
            grid-column: 1 / 4;
            margin: calc(var(--sz) * -1rem) 0 0;
          }

          .chromecast-remote-body .deviceNameTop {
            grid-column: 1 / 3;
            margin: unset;
            margin-top: calc(var(--sz) * 1rem);
            height: unset;
            display: block;
          }

          .apple-remote-body .deviceNameTop {
            grid-column: 1 / 3;
            margin: 0 0 calc(var(--sz) * -1.8rem) 0;
          }

          .apple-remote-body.AR1 .deviceNameTop {
            margin: calc(var(--sz) * -4rem) 0 calc(var(--sz) * -2.5rem) 0;
          }

          .deviceNameBottom {
            grid-column: 1/4;
            color: var(--devicenamecolor);
            font-size: calc(var(--sz) * 1.25rem);
            margin-bottom: calc(var(--sz) * -2.5rem);
            margin-top: calc(var(--sz) * .5rem);
            white-space: nowrap;
            overflow: hidden;
            width: 100%;
            text-align: center;
            align-self: flex-end;
          }

          .AF6 .deviceNameBottom {
            margin-bottom: calc(var(--sz) * -1rem);
          }

          .AL1 .deviceNameBottom, .AL2 .deviceNameBottom {
            margin-bottom: unset;
            margin-top: calc(var(--sz) * 1.8rem);
            overflow: unset;
          }

          .apple-remote-body .deviceNameBottom {
            grid-column: 1 / 3;
            margin-bottom: calc(var(--sz) * -1.25rem);
          }

          .shield-remote-body .deviceNameBottom {
            grid-column: 1 / 3;
            font-size: calc(var(--sz) * 1rem);
            margin-top: 0px;
            margin-bottom: 0px;
            position: absolute;
            bottom: calc(var(--sz) * 0.3rem);
          }

          .chromecast-remote-body .deviceNameBottom {
            grid-column: 1 / 3;
            margin-right: unset;
            margin-bottom: calc(var(--sz) * 1rem);
            margin-left: unset;
            margin-top: calc(var(--sz) * 0.5rem);
            height: unset;
            display: block;
          }

          .roku-remote-body.RTR .deviceNameBottom {
             margin-bottom: calc(var(--sz) * 0.1rem);
             margin-top: calc(var(--sz) * -1.25rem);
          }

          .roku-remote-body.RWR .deviceNameBottom,
          .roku-remote-body.RHR .deviceNameBottom {
            position: absolute;
            width: calc(var(--sz) * 11.45rem);
            bottom: calc(var(--sz) * 3.5rem);
          }

          .firemoteVersionNumber {
            text-shadow: 0px 1px 0px #1e1e1e, 0px -1px 0px #000;
            color: #4e4e4e;
            align-self: right;
            text-align: right;
            width: 100%;
            justify-self: right;
            display: block !important;
            font-size: calc(var(--sz) * .9rem);
            position: absolute;
            bottom: calc(var(--sz) * .35rem);
            right: calc(var(--sz) * .4rem);
          }

          .customLauncherBackground {
            pointer-events: none;
            position: absolute;
            height: 100%;
            width: 100%;
            transform: scale(1.25);
            z-index: 1;
            overflow: hidden;
          }

          .customLauncherTxt {
            z-index: 2;
            pointer-events: none;
          }

          .customLauncherIcon {
            display: flex;
            max-width: 100%;
            max-height: 100%;
            transform: scale(var(--sz));
            display: flex;
            align-items: center;
            z-index: 2;
          }

          .customLauncherImg {
            pointer-events: none;
            max-width: 100%;
            max-height: 100%;
            overflow: hidden;
            z-index: 2;
          }

          .AFJTV #tv-button,
          .AFXF2 #tv-button{
            font-size: calc(var(--sz) * 0.8rem);
            font-weight: 600;
          }

          .colorButtons {
            display: flex;
            justify-content: space-around;
            margin: calc(var(--sz) * 0.5rem) 0 calc(var(--sz) * 4.5rem) 0;;
          }

          .AFJTV div.colorButtons button,
          .AFXF2 div.colorButtons button{
            border-radius: 100%;
            overflow: hidden;
            height: calc(var(--sz) * 2.3rem);
            width: calc(var(--sz) * 2.3rem);
          }

          .AFJTV div.colorButtons button svg,
          .AFXF2 div.colorButtons button svg {
            height: calc(var(--sz) * 1.1rem);
            width: calc(var(--sz) * 1.1rem);
            filter: brightness(0.8) saturate(0.8);
            pointer-events: none;
          }

          .AFJTV div.colorButtons button:active svg,
          .AFXF2 div.colorButtons button:active svg{
            filter: none;
            transform: scale(0.85)
          }

          .AFJTV .jvcbrandlogo {
             height: 0;
             display: flex;
             justify-content: center;
             align-items: center;
             margin-top: calc(var(--sz) * -2rem);
          }

          .AFJTV .jvcbrandlogo svg {
            width: calc(var(--sz) * 5rem);
            height: auto;
          }

          .AFXF2 .xf2brandlogo {
             height: 0;
             display: flex;
             justify-content: center;
             align-items: center;
             margin-top: calc(var(--sz) * -1.5rem);
          }

          .AFXF2 .xf2brandlogo svg {
            width: calc(var(--sz) * 7rem);
            height: auto;
          }

          /* Homatics styles */
          .homatics-remote-body {
            align-content: start;
            grid-row-gap: calc(var(--sz)* 1rem);
            background: #ebebea;
            border-color: #dcdcdc;
            border-radius: calc(var(--sz)* 2.8rem);
            min-height: calc(var(--sz)* 48.5rem);
            padding: calc(var(--sz) * 1.1rem) calc(var(--sz) * 0.714rem) calc(var(--sz) * 2.143rem) calc(var(--sz) * 0.714rem);
            box-shadow: 0 calc(var(--sz) * 0.214rem) calc(var(--sz) * 0.214rem) rgb(0 0 0 / 10%);
          }

          .homatics-remote-body.HO2, 
          .homatics-remote-body.HO4 {
            background: #252525;
            border-color: #2f2f2f;
          }

          .HO1 .remote-button,
          .HO3 .remote-button {
            background: #fff;
            color: rgb(106, 106, 106);
            border: solid rgb(186 186 186) calc(var(--sz)* 0.0714rem);
            box-shadow: rgb(0 0 0 / 15%) 0px calc(var(--sz)* 0.063rem) calc(var(--sz)* 0.188rem);
          }

          .HO2 .remote-button, 
          .HO4 .remote-button {
            background: #2f2f2f;
            border: solid rgb(15 15 15) calc(var(--sz)* 0.0714rem);
          }

          .homatics-remote-body .remote-button:active {
            box-shadow: inset rgb(0 0 0 / 42%) 0px calc(var(--sz)* 0.1rem) calc(var(--sz)* 0.188rem);
            filter: brightness(0.94);
            border: solid rgb(232 232 232) calc(var(--sz)* 0.0714rem);
          }

          .HO2 .remote-button:active, 
          .HO4 .remote-button:active {
            border: solid rgb(10 10 10) calc(var(--sz)* 0.0714rem);
          }

          .HO2 .litbutton,
          .HO4 .litbutton {
            box-shadow: 0 0 calc(var(--sz)* 0.857rem) calc(var(--sz)* 0.0714rem) rgb(171 253 255 / 15%);
          }

          .HO1 .litbutton > ha-icon, 
          .HO3 .litbutton > ha-icon {
            color: #00979b !important;
          }

          .HO2 .litbutton > ha-icon, 
          .HO4 .litbutton > ha-icon {
            color: #abfdff !important
          }

          .homatics-remote-body .deviceNameTop {
            grid-column: 1 / 4;
            margin: unset;
            height: unset;
            display: block;
            margin-bottom: calc(var(--sz) * -1rem);
          }

          .HO1 #home-button.litbutton > ha-icon, .HO3 #home-button.litbutton > ha-icon {
            color: #03585b !important
          }

          .HO2 #home-button.litbutton > ha-icon, .HO4 #home-button.litbutton > ha-icon {
            color: #45989a !important
          }

          .homatics-remote-body .micHole {
            background: black;
            border-radius: 100%;
            height: calc(var(--sz)* 0.3rem);
            aspect-ratio: 1 / 1;
            align-self: end;
            justify-self: center;
          }

          .homatics-remote-body #power-button, .homatics-remote-body #input-button {
            height: calc(var(--sz)* 2.75rem);
            width: calc(var(--sz)* 2.75rem);
          }

          .remote-body.HO1 .remote-button > ha-icon, 
          .remote-body.HO3 .remote-button > ha-icon {
            color: rgb(106 106 106);
          }

          .remote-body.HO2 .remote-button > ha-icon {
            color: rgb(245 245 245);
          }

          .homatics-remote-body .remote-button.dark {
            background: linear-gradient(180deg, rgb(168 168 168) 26%, rgb(144 144 144) 50%, rgb(128 128 128) 75%);
          }

          .homatics-remote-body.HO2 .remote-button.dark,
          .homatics-remote-body.HO4 .remote-button.dark {
            background: linear-gradient(180deg, rgb(255 255 255) 26%, rgb(221 221 221) 50%, rgb(211 211 211) 75%);
          }

          .homatics-remote-body .remote-button.dark > ha-icon {
            color: #000;
          }

          .homatics-remote-body.HO2 .remote-button.dark > ha-icon,
          .homatics-remote-body.HO4 .remote-button.dark > ha-icon {
            color: #4b4b4b;
          }

          .remote-body.HO2 .remote-button.light > ha-icon {
            color: #464646;
          }

          .homatics-remote-body .micNLight {
            display: grid;
            align-content: space-between;
            padding: calc(var(--sz) * 0.25rem) 0;
          }

          .homatics-remote-body .activityLight {
            background: #ff0000;
            box-shadow: #ff0000 0 0 calc(var(--sz)* 0.6rem) calc(var(--sz)* 0.05rem);
            border-radius: 100%;
            height: calc(var(--sz)* 0.4rem);
            aspect-ratio: 1 / 1;
            opacity: 0;
          }

          .homatics-remote-body.HO2 .activityLight,
          .homatics-remote-body.HO4 .activityLight {
            background: #adff87;
            box-shadow: lime 0 0 calc(var(--sz)* 0.6rem) calc(var(--sz)* 0.05rem);
          }

          .homatics-remote-body .digit-pad-button {
            font-size: calc(var(--sz)* 1rem);
            font-weight: 600;
            height: calc(var(--sz)* 2.75rem);
            width: calc(var(--sz)* 2.75rem);
            border-radius: 100%;
            margin-bottom: calc(var(--sz)* -0.6rem);
          }

          .homatics-remote-body .colorButtons {
            display: flex;
            justify-content: space-around;
            margin: calc(var(--sz) * 0.5rem) 0 0 0;
          }

          .homatics-remote-body div.colorButtons button {
            border-radius: 100%;
            overflow: hidden;
            height: calc(var(--sz) * 2.3rem);
            width: calc(var(--sz) * 2.3rem);
          }

          .homatics-remote-body div.colorButtons button svg{
            height: calc(var(--sz) * 1.1rem);
            width: calc(var(--sz) * 1.1rem);
            filter: brightness(0.8) saturate(0.8);
            pointer-events: none;
          }

          .homatics-remote-body div.colorButtons button:active svg{
            filter: none;
            transform: scale(0.85)
          }


          .homatics-remote-body #bookmark-button, .homatics-remote-body #settings-button {
            align-self: end;
          }

          .homatics-remote-body #keyboard-button {
            height: calc(var(--sz)* 3.572rem);
            width: calc(var(--sz)* 3.572rem);
            margin-bottom: calc(var(--sz)* 1.1rem);
          }

          .homatics-remote-body .directionButtonContainer {
            box-shadow: rgb(0 0 0 / 15%) calc(var(--sz)* 0.025rem) calc(var(--sz)* 0.025rem) calc(var(--sz)* 0.025rem)
            background: #cacaca;
            border: calc(var(--sz)* 0.0714rem) solid #cacaca;
          }

          .homatics-remote-body .directionButtonContainer:has(#down-button:active) {
            box-shadow: none;
          }

          .homatics-remote-body .dpadContainer {
            align-items: center;
            justify-items: center;
            position: relative;
            margin-top: calc(var(--sz)* -1.5rem);
            margin-bottom: calc(var(--sz)* -1.5rem);
            isolation: isolate;
          }

          .homatics-remote-body .dpadbutton, .homatics-remote-body .dpadbutton:active {
            all: unset;
            cursor: pointer;
            width: calc(var(--sz)* 5.5714rem);
            height: calc(var(--sz)* 5.5714rem);
            outline: solid #a6a6a6 calc(var(--sz)* 0.0714rem);
          }

          .homatics-remote-body .dpadbutton {
            background: #adadad;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            -webkit-tap-highlight-color: transparent;
          }

          .HO2 .dpadbutton,
          .HO4 .dpadbutton {
            background: rgb(216 216 216);
            outline: solid rgb(200 200 200) calc(var(--sz)* 0.0714rem);
          }

          .homatics-remote-body .dpadbutton:active {
            background: rgb(153 153 153);
            box-shadow: inset #4f4f4f 0 0 calc(var(--sz)* 0.35rem) 0px;
            transform: none;
            filter: none;
            overflow: hidden;
            backdrop-filter: none;
            appearance: none;
          }

          .HO2 .dpadbutton:active,
          .HO4 .dpadbutton:active {
            background: rgb(200 200 200);
            box-shadow: none;
            outline: solid #989898 calc(var(--sz)* 0.0714rem);
          }

          .homatics-remote-body .centerbutton {
            background: linear-gradient(180deg, #c8c8c8 0%, rgba(255, 255, 255, 1) 100%);
            border: solid #a1a1a1 calc(var(--sz)* 0.25rem);
            width: calc(var(--sz)* 5.13rem);
            height: calc(var(--sz)* 5.13rem);
            margin: 0px;
            position: absolute;
            box-sizing: border-box;
            isolation: isolate;
          }

          .HO2 .centerbutton,
          .HO4 .centerbutton {
            background: linear-gradient(0deg, rgb(48 48 48) 26%, rgb(39 39 39) 50%, rgb(33 33 33) 75%);
            border: solid #252525 calc(var(--sz)* 0.25rem); 
          }

          .homatics-remote-body .centerbutton:active {
            transform: none;
            filter: brightness(0.92);
            border: solid #b3b3b3 calc(var(--sz)* 0.29rem);
          }

          .HO2 .centerbutton:active,
          .HO4 .centerbutton:active {
            filter: brightness(0.8);
            border: solid #000 calc(var(--sz)* 0.29rem); 
          }

          .homatics-remote-body #home-button {
            align-self: end;
            margin-top: calc(var(--sz)* 1.1rem);
            z-index: 10;  /* Required for companion app to prevent accidental push of down button */
          }

          .homatics-remote-body .volumeChannelSection {
            grid-column-start: 1;
            grid-column-end: 4;
            display: grid;
            grid-template-columns: 33% 1fr 33%;
            grid-template-areas: "vol-up   mute ch-up"
                                 "vol-down mute ch-down";
            grid-row-gap: 0;
            width: 100%;
            justify-items: center;
            align-items: center;
          }

          .homatics-remote-body #volume-up-button-container {
            grid-area: vol-up;
            margin-bottom: 0;
            border-bottom: 0;
            font-size: calc(var(--sz)* 2rem);
          }

          .homatics-remote-body #volume-up-button-container ha-icon,
          .homatics-remote-body #channel-up-button-container ha-icon {
            margin-top: calc(var(--sz)* -1rem);
          }

          .homatics-remote-body #voltext,
          .homatics-remote-body #chtext {
            max-width: calc(var(--sz)* 1.5rem);
            max-height: calc(var(--sz)* 1rem);
            position: absolute;
            padding-left: calc(var(--sz)* 1.0rem);
            pointer-events: none;
            margin-top: calc(var(--sz)* -0.5rem);
          }

          .homatics-remote-body #voltext > * {
            fill: rgb(106 106 106);
          }

          .homatics-remote-body.HO2 #voltext > *, 
          .homatics-remote-body.HO4 #voltext > * {
            fill: rgb(245, 245, 245);
          }

          .homatics-remote-body #chtext {
            max-width: calc(var(--sz)* 1rem);
            padding-left: calc(var(--sz)* 1.25rem);
          }

          .homatics-remote-body #chtext > * {
            fill: rgb(106 106 106);
          }

          .homatics-remote-body.HO2 #chtext > *, 
          .homatics-remote-body.HO4 #chtext > * {
            fill: rgb(245, 245, 245);
          }

          .homatics-remote-body #channel-up-button-container {
            grid-area: ch-up;
            margin-bottom: 0;
            border-bottom: 0;
          }

          .homatics-remote-body #mute-button {
            grid-area: mute;
            height: calc(var(--sz)* 2.6rem);
            width: calc(var(--sz)* 2.6rem);
          }

          #soundeqtext {
            grid-area: mute;
            max-width: calc(var(--sz)* 3.5rem);
            max-height: calc(var(--sz)* 0.7rem);
            margin-top: calc(var(--sz)* 4.1rem);
            fill: rgb(106 106 106);
          }

          .HO2 #soundeqtext, .HO4 #soundeqtext {
            fill: rgb(245, 245, 245);
          }

          .homatics-remote-body #volume-down-button {
            grid-area: vol-down;
            border-top: 0;
            font-size: calc(var(--sz)* 2rem);
          }

          .homatics-remote-body #volume-down-button ha-icon,
          .homatics-remote-body #channel-down-button ha-icon {
            margin-bottom: calc(var(--sz)* -1rem);
          }

          .homatics-remote-body #channel-down-button {
            grid-area: ch-down;
            border-top: 0;
          }

          .homatics-remote-body #volume-down-button, 
          .homatics-remote-body #channel-down-button {
            box-shadow: rgb(0 0 0 / 15%) 0px calc(var(--sz)* 0.063rem) calc(var(--sz)* 0.1rem);
          }

          .homatics-remote-body #volume-up-button, 
          .homatics-remote-body #channel-up-button {
            box-shadow: none;
          }

          .homatics-remote-body #volume-up-button:active, 
          .homatics-remote-body #channel-up-button:active {
            filter: none;
            background: linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(240, 240, 240, 1) 95%);
            border: solid rgb(186 186 186) calc(var(--sz)* 0.0714rem);
            border-bottom: 0;
          }

          .homatics-remote-body.HO2 #volume-up-button:active, 
          .homatics-remote-body.HO2 #channel-up-button:active,
          .homatics-remote-body.HO4 #volume-up-button:active, 
          .homatics-remote-body.HO4 #channel-up-button:active {
            filter: none;
            background: linear-gradient(0deg, rgb(46 46 46) 0%, rgb(38 38 38) 95%);
            border: solid rgb(0 0 0) calc(var(--sz)* 0.08rem);
            border-bottom: 0;
          }

          .homatics-remote-body #volume-down-button:active, 
          .homatics-remote-body #channel-down-button:active {
            filter: none;
            background: linear-gradient(0deg, rgba(240, 240, 240, 1) 0%, rgba(255, 255, 255, 1) 95%);
            box-shadow: none;
            border: solid rgb(186 186 186) calc(var(--sz)* 0.0714rem);
            border-top: 0;
          }

          .homatics-remote-body.HO2 #volume-down-button:active, 
          .homatics-remote-body.HO2 #channel-down-button:active,
          .homatics-remote-body.HO4 #volume-down-button:active, 
          .homatics-remote-body.HO4 #channel-down-button:active {
            filter: none;
            background: linear-gradient(180deg, rgb(46 46 46) 0%, rgb(38 38 38) 95%);
            box-shadow: none;
            border: solid rgb(0 0 0) calc(var(--sz)* 0.08rem);
            border-top: 0;
          }

          .homatics-remote-body .afappsgrid {
            margin-bottom: calc(var(--sz)* 7rem);
          }

          .homatics-remote-body .srcButton {
            border: solid #a7a7a7 calc(var(--sz) * 0.0714rem);
          }

          .homaticsLogo {
            position: absolute;
            bottom: calc(var(--sz)* 3rem);
            width: calc(var(--sz)* 12.286rem);
            text-align: center;
          }

          .homaticsLogo svg {
            max-width: calc(var(--sz)* 6.5rem);
            max-height: calc(var(--sz)* 3.2rem);
            stroke: rgb(161 161 161);
          }

          .HO2 .homaticsLogo svg,
          .HO4 .homaticsLogo svg {
            stroke: #000;
          }

          .homatics-remote-body .deviceNameBottom {
            position: absolute;
            bottom: calc(var(--sz)* 3.5rem);
            width: calc(var(--sz)* 12.286rem);
            text-align: center;
          }

          .homatics-remote-body .srcButton {
            border-color: rgb(255 255 255 / 0%);
          }

          .homatics-remote-body .srcButton.appActive {
            box-shadow: rgb(0 0 0 / 13%) 0 calc(var(--sz)* 0.214rem) calc(var(--sz)* 0.1428rem) 0, white 0 0 calc(var(--sz)* 0.857rem) calc(var(--sz)* 0.429rem);
            border-color: #e6e6e6;
            animation-name: homatics_flash_border;
            animation-duration: 2s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }

          .HO2 .srcButton.appActive, .HO4 .srcButton.appActive {
            box-shadow: rgb(255 255 255 / 0%) 0 calc(var(--sz)* 0.214rem) calc(var(--sz)* 0.1428rem) 0, rgb(255 255 255 / 31%) 0 0 calc(var(--sz)* 0.857rem) calc(var(--sz)* 0.429rem);
          }

          @keyframes homatics_flash_border {
            0% {
              border-color: rgb(0 0 0 / 16%);
            }
            50% {
              border-color: #fff;
            }
            100% {
              border-color: rgb(0 0 0 / 16%);
            }
          }

          /* end Homatics styles */


          /* onn. styles */
          .remote-body.ON1, .remote-body.ON2 {
            align-content: start;
            grid-row-gap: calc(var(--sz)* 1rem);
            background: #ebebea;
            border-color: #dcdcdc;
            border-radius: calc(var(--sz)* 2.8rem);
            min-height: calc(var(--sz)* 48.5rem);
            padding: calc(var(--sz) * 1.1rem) calc(var(--sz) * 0.714rem) calc(var(--sz) * 2.143rem) calc(var(--sz) * 0.714rem);
            box-shadow: 0 calc(var(--sz) * 0.214rem) calc(var(--sz) * 0.214rem) rgb(0 0 0 / 10%);
          }

          .remote-body.ON2 {
            background: #252525;
            border-color: #2f2f2f;
          }

          .ON1 .remote-button, .ON2 .remote-button {
            background: #fff;
            color: rgb(106, 106, 106);
            border: solid rgb(186 186 186) calc(var(--sz)* 0.0714rem);
            box-shadow: rgb(0 0 0 / 15%) 0px calc(var(--sz)* 0.063rem) calc(var(--sz)* 0.188rem);
          }

          .ON2 .remote-button {
            background: #2f2f2f;
            border: solid rgb(15 15 15) calc(var(--sz)* 0.0714rem);
          }

          .ON1 .remote-button:active, .ON2 .remote-button:active {
            box-shadow: inset rgb(0 0 0 / 42%) 0px calc(var(--sz)* 0.1rem) calc(var(--sz)* 0.188rem);
            filter: brightness(0.94);
            border: solid rgb(232 232 232) calc(var(--sz)* 0.0714rem);
          }

          .ON2 .remote-button:active {
            border: solid rgb(10 10 10) calc(var(--sz)* 0.0714rem);
          }

          .remote-body.ON1 .remote-button.litbutton {
            background: #ffffe7;
          }

          .remote-body.ON1 #power-button.litbutton > ha-icon,
          .remote-body.ON2 .remote-button.litbutton > ha-icon {
            color: #017374 !important;
          }

          .remote-body.ON2 #power-button.litbutton > ha-icon {
            color: #ebef66 !important;
          }

          .remote-body.ON1 .remote-button:active > ha-icon,
          .remote-body.ON2 .remote-button:active > ha-icon {
            transform: scale(calc(var(--sz)* 0.90));
          }

          .remote-body.ON1 .remote-button.dark,
          .remote-body.ON2 .remote-button.dark {
            background: linear-gradient(180deg, rgba(69,69,69,1) 26%, rgba(55,55,55,1) 50%, rgba(45,45,45,1) 75%);
          }

          .remote-body.ON2 .remote-button.light {
            background: linear-gradient(0deg, #c8c8c8 0%, rgba(255, 255, 255, 1) 100%);
          }

          .remote-body.ON1 .remote-button > ha-icon {
            color: rgb(106 106 106);
          }

          .remote-body.ON2 .remote-button > ha-icon {
            color: rgb(245 245 245);
          }

          .remote-body.ON1 .remote-button.dark > ha-icon {
            color: #ebebea;
          }

          .remote-body.ON2 .remote-button.light > ha-icon {
            color: #464646;
          }

          .remote-body.ON1 .remote-button.dark.litbutton {
            background: #004040;
          }

          .remote-body.ON1 .remote-button.litbutton > ha-icon,
          .remote-body.ON1 .remote-button.dark.litbutton > ha-icon,
          .remote-body.ON2 .remote-button.dark.litbutton > ha-icon {
            color: #ffffab;
          }

          .ON1 .directionButtonContainer, .ON2 .directionButtonContainer {
            box-shadow: rgb(0 0 0 / 73%) calc(var(--sz)* 0.025rem) calc(var(--sz)* 0.025rem) calc(var(--sz)* 0.025rem);
            background: black;
          }

          .ON1 .directionButtonContainer:has(#down-button:active), .ON2 .directionButtonContainer:has(#down-button:active) {
            box-shadow: none;
          }

          .ON1 .dpadContainer, .ON2 .dpadContainer {
            align-items: center;
            justify-items: center;
            position: relative;
            margin-top: calc(var(--sz)* -1.5rem);
            margin-bottom: calc(var(--sz)* -1.5rem);
            isolation: isolate;
          }

          .ON1 .dpadbutton, .ON1 .dpadbutton:active,
          .ON2 .dpadbutton, .ON2 .dpadbutton:active {
            all: unset;
            cursor: pointer;
            width: calc(var(--sz)* 5.5714rem);
            height: calc(var(--sz)* 5.5714rem);
            outline: solid #2e2e2e calc(var(--sz)* 0.0714rem);
          }

          .ON1 .dpadbutton, .ON2 .dpadbutton {
            background: rgba(55, 55, 55, 1);
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            -webkit-tap-highlight-color: transparent;
          }

          .ON2 .dpadbutton {
            background: rgb(216 216 216);
            outline: solid rgb(200 200 200) calc(var(--sz)* 0.0714rem);
          }

          .ON1 .dpadbutton:active, .ON2 .dpadbutton:active {
            background: rgba(45, 45, 45, 1);
            box-shadow: inset #161616 0 0 calc(var(--sz)* 0.35rem) 0px;
            transform: none;
            filter: none;
            overflow: hidden;
            backdrop-filter: none;
            appearance: none;
          }

          .ON2 .dpadbutton:active {
            background: rgb(200 200 200);
            box-shadow: none;
            outline: solid #989898 calc(var(--sz)* 0.0714rem);
          }

          .ON1 .centerbutton, .ON2 .centerbutton {
            background: linear-gradient(180deg, #c8c8c8 0%, rgba(255, 255, 255, 1) 100%);
            border: solid #2b2b2b calc(var(--sz)* 0.25rem);
            width: calc(var(--sz)* 5.13rem);
            height: calc(var(--sz)* 5.13rem);
            margin: 0px;
            position: absolute;
            box-sizing: border-box;
            isolation: isolate;
          }

          .ON2 .centerbutton {
            background: linear-gradient(0deg, rgb(48 48 48) 26%, rgb(39 39 39) 50%, rgb(33 33 33) 75%);
          }

          .ON1 .centerbutton:active, .ON2 .centerbutton:active {
            transform: none;
            filter: brightness(0.92);
            border: solid #2b2b2b calc(var(--sz)* 0.29rem);
          }

          .ON2 .centerbutton:active {
            filter: brightness(0.8);
          }

          .ON1 #power-button, .ON1 #input-button,
          .ON2 #power-button, .ON2 #magic-star-button {
            height: calc(var(--sz)* 2.5rem);
            width: calc(var(--sz)* 2.5rem);
          }

          .ON1 #power-button, .ON2 #power-button {
            justify-self: left;
          }

          .ON1 .micNLight, .ON2 .micNLight {
            display: grid;
            align-content: space-between;
            padding: calc(var(--sz) * 0.25rem) 0;
          }

          .ON1 .activityLight, .ON2 .activityLight {
            background: #adff87;
            box-shadow: lime 0 0 calc(var(--sz)* 0.6rem) calc(var(--sz)* 0.05rem);
            border-radius: 100%;
            height: calc(var(--sz)* 0.4rem);
            aspect-ratio: 1 / 1;
            opacity: 0;
          }

          .ON1 .micHole, .ON2 .micHole {
            background: black;
            border-radius: 100%;
            height: calc(var(--sz)* 0.3rem);
            aspect-ratio: 1 / 1;
            align-self: end;
            justify-self: center;
          }

          .ON1 #input-button, .ON2 #magic-star-button {
            justify-self: right;
          }

          .ON1 #profile-button, .ON1 #settings-button,
          .ON2 #profile-button, .ON2 #settings-button {
            align-self: end;
          }

          .ON1 #keyboard-button, .ON2 #keyboard-button {
            height: calc(var(--sz)* 3.572rem);
            width: calc(var(--sz)* 3.572rem);
            margin-bottom: calc(var(--sz)* 1.1rem);
          }

          .ON1 #home-button, .ON2 #home-button {
            align-self: end;
            margin-top: calc(var(--sz)* 1.1rem);
            z-index: 10;  /* Required for companion app to prevent accidental push of down button */
          }

          .ON1 .volumeChannelSection, .ON2 .volumeChannelSection {
            grid-column-start: 1;
            grid-column-end: 4;
            display: grid;
            grid-template-columns: 33% 1fr 33%;
            grid-template-areas: "vol-up   mute ch-up"
                                 "vol-down mute ch-down";
            grid-row-gap: 0;
            width: 100%;
            justify-items: center;
            align-items: center;
          }

          .ON1 #volume-up-button, .ON2 #volume-up-button {
            grid-area: vol-up;
            margin-bottom: 0;
            border-bottom: 0;
            font-size: calc(var(--sz)* 2rem);
          }

          .ON1 #channel-up-button, .ON2 #channel-up-button {
            grid-area: ch-up;
            margin-bottom: 0;
            border-bottom: 0;
          }

          .ON1 #mute-button, .ON2 #mute-button {
            grid-area: mute;
            height: calc(var(--sz)* 2.6rem);
            width: calc(var(--sz)* 2.6rem);
          }

          .ON1 #volume-down-button, .ON2 #volume-down-button {
            grid-area: vol-down;
            border-top: 0;
            font-size: calc(var(--sz)* 2rem);
          }

          .ON1 #channel-down-button, .ON2 #channel-down-button {
            grid-area: ch-down;
            border-top: 0;
          }

          .ON1 #volume-up-button:active, .ON1 #channel-up-button:active {
            filter: none;
            background: linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(240, 240, 240, 1) 95%);
            border: solid rgb(186 186 186) calc(var(--sz)* 0.0714rem);
            border-bottom: 0;
          }

          .ON2 #volume-up-button:active, .ON2 #channel-up-button:active {
            filter: none;
            background: linear-gradient(0deg, rgb(46 46 46) 0%, rgb(38 38 38) 95%);
            border-bottom: 0;
          }

          .ON1 #volume-down-button:active, .ON1 #channel-down-button:active {
            filter: none;
            background: linear-gradient(0deg, rgba(240, 240, 240, 1) 0%, rgba(255, 255, 255, 1) 95%);
            box-shadow: none;
            border: solid rgb(186 186 186) calc(var(--sz)* 0.0714rem);
            border-top: 0;
          }

          .ON2 #volume-down-button:active, .ON2 #channel-down-button:active {
            filter: none;
            background: linear-gradient(180deg, rgb(46 46 46) 0%, rgb(38 38 38) 95%);
            box-shadow: none;
            border-top: 0;
          }

          .ON1 .afappsgrid, .ON2 .afappsgrid {
            align-content: start;
            margin: calc(var(--sz)* 0.75rem) 0 calc(var(--sz)* 3.75rem) 0;
          }

          .ON1 .srcButton {
            border-color: #ccc;
          }

          .ON2 .srcButton {
            border-color: #292929;
          }

          .ON1 .srcButton.appActive, .ON2 .srcButton.appActive {
            box-shadow: rgb(0 0 0 / 13%) 0 calc(var(--sz)* 0.214rem) calc(var(--sz)* 0.1428rem) 0, white 0 0 calc(var(--sz)* 0.857rem) calc(var(--sz)* 0.429rem);
            border-color: #e6e6e6;
            animation-name: flash_border;
            animation-duration: 2s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }

          .ON2 .srcButton.appActive {
            box-shadow: rgb(255 255 255 / 0%) 0 calc(var(--sz)* 0.214rem) calc(var(--sz)* 0.1428rem) 0, rgb(255 255 255 / 31%) 0 0 calc(var(--sz)* 0.857rem) calc(var(--sz)* 0.429rem);
          }

          @keyframes flash_border {
            0% {
              border-color: rgb(0 0 0 / 16%);
            }
            50% {
              border-color: #fff;
            }
            100% {
              border-color: rgb(0 0 0 / 16%);
            }
          }

          .ON1 .srcButton:active, .ON2 .srcButton:active {
            box-shadow: inset rgb(0 0 0 / 25%) 0 calc(var(--sz)* 0.214rem) calc(var(--sz)* 0.1428rem) 0;
          }

          .ON1 .deviceNameTop, .ON2 .deviceNameTop {
            grid-column: 1 / 4;
            margin: calc(var(--sz)* -1rem) 0;
          }

          .ON1 .deviceNameBottom, .ON2 .deviceNameBottom {
            position: absolute;
            bottom: calc(var(--sz)* 0.75rem);
            margin: 0;
            width: calc(var(--sz)* 12.286rem);
            text-align: center;
          }

          .onnLogo {
            position: absolute;
            bottom: calc(var(--sz)* 2rem);
            width: calc(var(--sz)* 12.286rem);
            text-align: center;
          }

          .onnLogo svg {
            max-width: calc(var(--sz)* 5rem);
            max-height: calc(var(--sz)* 2rem);
          }

          .ON2 .onnLogo svg {
            fill: #949494;
          }
          /* end onn. styles */

          ${unsafeCSS(launcherCSS)}

          .functionFindRemoteButton, .functionMuteButton, .functionRebootButton,
          .functionSystemUpdateButton, .functionKeyboardButton, .functionMenuButton, .functionSettingsButton {
            color: #ff0000;
            font-weight: bold;
            background: #000;
            border: solid calc(var(--sz) * 0.1rem) #850000;
            display: block;
          }

          .functionAppSwitchButton, .functionAppManageButton {
            background: #000;
          }

          .ON1 .functionRebootButton, .ON2 .functionRebootButton {
            background: #fff;
          }

          .ON1 .functionSearchGoogleTVButton, .ON1 .functionCaptionsButton, .ON1 .functionpairingButton,
          .ON2 .functionSearchGoogleTVButton, .ON2 .functionCaptionsButton, .ON2 .functionpairingButton {
            background: #fff;
            color: #000;
          }

          .roku-remote-body .functionMuteButton, .roku-remote-body .functionVolumeUpButton, .roku-remote-body .functionVolumeDownButton, .roku-remote-body .functionFindRemoteButton,
          .roku-remote-body .searchButton, .roku-remote-body .functionChannelUpButton, .roku-remote-body .functionChannelDownButton {
            color: #c6c6c6;
            font-weight: bold;
            background: #662d91;
            border: 0;
            filter: none !important;
            display: grid;
          }

          .functionAppleSettingsButton {
            background: linear-gradient(0deg, rgba(143,143,148,1) 0%, rgba(228,228,233,1) 100%);
            border: solid #838383 calc(var(--sz) * 0.05rem) !important;
          }

          .functionKeyboardButton {
            display: inherit;
          }

          .functionFindRemoteButton > ha-icon, .functionMuteButton > ha-icon, .functionRebootButton > ha-icon, .functionSettingsButton > ha-icon {
            display: none;
          }

          .ON1 .functionSystemUpdateButton, .ON2 .functionSystemUpdateButton {
            background: #fff;
            color: #000;
          }

          .functionAppSwitchButton:active, .functionFindRemoteButton:active, .functionMuteButton:active, .functionRebootButton:active, .functionSettingsButton:active {
            filter: none;
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%) !important;
          }

          .ON1 .functionFindRemoteButton,
          .ON2 .functionFindRemoteButton {
            color: yellow;
            border: solid calc(var(--sz) * 0.1rem) #017374;
          }

          .shield-remote-body .functionFindRemoteButton, .shield-remote-body .functionMuteButton, .shield-remote-body .functionSystemUpdateButton,
          .shield-remote-body .functionMuteButton, .shield-remote-body .functionRebootButton, .shield-remote-body .functionSettingsButton, .shield-remote-body .functionCaptionsButton {
            color: rgb(153, 231, 0);
            border: solid calc(var(--sz) * 0.1rem) #456800;
          }

          .functionFindRemoteButton {
            font-size: calc(var(--sz) * .75rem);
          }
          .shield-remote-body .functionFindRemoteButton {
            font-size: calc(var(--sz) * .75rem);
            --mdc-icon-size: calc(var(--sz) * 1.4rem);
          }
          .roku-remote-body .functionFindRemoteButton {
            font-size: calc(var(--sz) * .6rem);
          }

          .functionMuteButton {
            font-size: calc(var(--sz) * 1rem);
          }
          .shield-remote-body .functionMuteButton {
            font-size: calc(var(--sz) * 1.2rem);
            --mdc-icon-size: calc(var(--sz) * 1.6rem);
          }

          .functionRebootButton {
            font-size: calc(var(--sz) * 1rem);
          }
          .shield-remote-body .functionRebootButton {
            font-size: calc(var(--sz) * 1rem);
            --mdc-icon-size: calc(var(--sz) * 1.6rem);
          }
          .chromecast-remote-body .functionRebootButton {
            font-size: calc(var(--sz) * 0.95rem);
            background: #fff;
          }

          .apple-remote-body .functionAppSwitchButton {
            background: rgb(33, 33, 33);
          }

          .functionSettingsButton {
            font-size: calc(var(--sz) * .75rem);
          }
          .shield-remote-body .functionSettingsButton {
            font-size: calc(var(--sz) * 0.86rem);
            --mdc-icon-size: calc(var(--sz) * 1.5rem);
          }
          .chromecast-remote-body .functionSettingsButton, .chromecast-remote-body .functionSystemUpdateButton {
            font-size: calc(var(--sz) * 0.7rem);
            background: #fff;
          }

          .functionControlCenterButton {
            background: rgb(215 215 215);
            border: solid #838383 calc(var(--sz) * 0.05rem) !important;
          }

          .remote-logo {
            grid-column-start: 1;
            grid-column-end: 4;
            padding: calc(var(--sz) * 2.5rem) calc(var(--sz) * 2.357rem) 0 calc(var(--sz) * 2.357rem);
            width: calc(var(--sz) * 7.5714rem);
          }

          .AF6 .remote-logo {
            padding: calc(var(--sz) * .75rem) calc(var(--sz) * 2.357rem) 0 calc(var(--sz) * 2.357rem);
          }

          .miLogo, .xiaomiLogo {
            align-self: flex-end;
            padding-bottom: calc(var(--sz) * 1.3rem)
          }

          .miLogo {
            width: calc(var(--sz) * 2.75rem);
          }

          .ns1-body #keyboard-button {
            margin-top: calc(var(--sz) * 1rem);
            height: calc(var(--sz) * 5rem);
            width: calc(var(--sz) * 5rem);
            --mdc-icon-size: 34px;
          }

          .ns1-body .remote-button:active {
            border: solid #395600 0.0714rem;
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.0714rem) rgb(153 231 0 / 20%);
          }

          .ns1-body .remote-button:active > ha-icon {
            color: #99e700 !important;
          }

          .litbutton {
              border: solid #4b4c3c 0.0714rem;
              box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.0714rem) rgb(255 255 25 / 15%);
          }
          .litbutton > ha-icon {
            color: yellow !important;
          }

          .shield-remote-body .litbutton {
              border: solid #500101 0.0714rem;
              box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.0714rem) rgb(255 25 25 / 15%);
          }

          .shield-remote-body .litbutton > ha-icon,
          .roku-remote-body #power-button.litbutton > ha-icon {
            color: red !important;
          }

          .roku-remote-body #power-button.litbutton {
            border: 0.0714rem solid rgb(92 0 0);
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.0714rem) rgb(229 58 58 / 31%);
          }

          .roku-remote-body.RTR #power-button {
            background: #810000;
          }

          .roku-remote-body.RTR #power-button > ha-icon {
            color: #c6c6c6;
          }

          .roku-remote-body.RTR #power-button.litbutton {
            background: rgb(159, 0, 0);
            border: 0.0714rem solid rgb(139, 62, 62);
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.0714rem) rgb(229 164 164 / 31%);
          }

          .roku-remote-body.RTR #power-button.litbutton > ha-icon {
            color: #fff !important;
          }

          .roku-remote-body #home-button.litbutton, .roku-remote-body #playpause-button.litbutton {
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.0714rem) rgb(255 255 255 / 20%);
          }

          .roku-remote-body #home-button.litbutton > ha-icon, .roku-remote-body #playpause-button.litbutton > ha-icon {
            color: white !important;
          }

          .XM2 .litbutton {
              border: solid #5c2b00 0.0714rem;
              box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.0714rem) rgb(229 124 58 / 31%);
          }

          .XM2 .litbutton > ha-icon, .XM2 .litbutton > .mdiSubstituteIconWrapper {
            color: #ff7700 !important;
          }


          .chromecast-remote-body .litbutton, .chromecast-remote-body .appActive {
              position: relative;
              z-index: 2;
          }

          .chromecast-remote-body .appActive {
            border: transparent;
          }

          .chromecast-remote-body .litbutton::before, .chromecast-remote-body .appActive::before {
            content: "";
            position: absolute;
            z-index: -1;
            inset: 0.25rem;
            background: conic-gradient(from 0deg, rgba(66,133,244,1) 0%, rgba(219,68,55,1) 25%, rgba(244,180,0,1) 50%, rgba(15,157,88,1) 75%, rgba(66,133,244,1) 100%);
            filter: blur(0.3rem) contrast(3);
            transition: opacity 0.3s ease 0s;
            border-radius: inherit;
            animation: spin 7s linear infinite;
          }

          .chromecast-remote-body .appActive::before {
            inset: calc(var(--sz) * -0.25rem);
            filter: contrast(3);
          }

          @keyframes spin {
            0 {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          .chromecast-remote-body .litbutton::after, .chromecast-remote-body .appActive::after {
              content: "";
              z-index: -1;
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              background: inherit;
              border-radius: inherit;
              inset: 0.15rem;
          }

          .chromecast-remote-body .litbutton > ha-icon {
            color: #d70000 !important;
          }

          .apple-remote-body .litbutton {
              background: rgb(255 255 255 / 25%) !important;
              border: 0.01rem solid gray !important;
              box-shadow: none;
          }

          .apple-remote-body .litbutton > ha-icon {
              color: rgb(33, 33, 33) !important;
          }

          .shield-remote-body.ns1-body .litbutton {
              border: solid #395600 0.0714rem;
              box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.0714rem) rgb(153 231 0 / 20%);
          }

          .shield-remote-body.ns1-body .litbutton > ha-icon {
            color: #99e700 !important;
          }

          .dimlitbutton {
              border: solid #34342b calc(var(--sz) * 0.0714rem);
              box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.0714rem) rgb(255 255 116 / 15%);
          }
          .dimlitbutton > ha-icon {
            color: #e5e59a !important;
          }

          .apple-remote-body .dimlitbutton {
              border: 0.01rem solid gray !important;
              background: none !important;
              box-shadow: none;
          }

          .apple-remote-body .dimlitbutton > ha-icon {
              color: rgb(33, 33, 33) !important;
          }

          .shield-remote-body .dimlitbutton {
              border: solid #3c1818 0.0714rem;
              box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.0714rem) rgb(255 25 25 / 11%);
          }

          .shield-remote-body .dimlitbutton > ha-icon {
            color: #ff7575 !important;
          }

          .XM2 .dimlitbutton {
              border: solid #463327 0.0714rem;
              box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.0714rem) rgb(255 143 36 / 21%);
          }

          .XM2 .dimlitbutton > ha-icon {
            color: #b36d41 !important;
          }

          ha-icon {
            pointer-events: none;
            transform: scale(var(--sz));
          }

          .eightygap {
            height: calc(var(--sz) * 5.7143rem);
          }
  `;
//`

    getState() {
      if(this._config.device_family === 'none' || this._config.entity === 'none') { return; }
      if(this._config.android_tv_remote_entity == '' || typeof this._config.android_tv_remote_entity == 'undefined' || this._config.device_family == 'amazon-fire' ) {
        return this.hass.states[this._config.entity];
      }
      else {
        return this.hass.states[this._config.android_tv_remote_entity];
      }
    }

    getOpenAppID() {
      if(this._config.device_family === 'none' || this._config.entity === 'none') { return; }
      else if(this._config.device_family == 'roku') {
        return this.hass.states[this._config.entity].attributes.app_name;
      }
      else if(this._config.android_tv_remote_entity == '' || typeof this._config.android_tv_remote_entity == 'undefined' || this._config.device_family == 'amazon-fire' ) {
        return this.hass.states[this._config.entity].attributes.app_id;
      }
      else {
        if(this.getState().state == 'on') {
          return this.hass.states[this._config.android_tv_remote_entity].attributes.current_activity;
        }
      }
    }

  createRenderRoot() {
    const root = super.createRenderRoot();
    // This section prevents unwanted scrolling on iOS devices when double clicking in a Sections view #508
    root.addEventListener(
      'dblclick',
      (e) => (e.preventDefault())
    );
    return root;
  }


  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    const stateObj = this.hass.states[this._config.entity];
    if (!stateObj && this._config.entity != 'none') {
      return html` <ha-card>Unknown entity: ${this._config.entity}</ha-card> `;
    }
    const entityId = this._config.entity;
    const state = this.getState();
    const stateStr = state ? state.state : 'off';
    const appId = this.getOpenAppID();
    const deviceType = this._config.device_type;
    const scale = (parseInt(this._config.scale) || 100)/100;
    var launcherscaleoffset = 0;
    if (this._config.app_launcher_relative_size) { launcherscaleoffset = (parseInt(this._config.app_launcher_relative_size) || 100)/100 };
    const launcherscale = scale + launcherscaleoffset;
    const overrides = this._config.button_overrides;
    var buttonHidingCss = '';
    if(overrides && typeof overrides === 'object') {
      for (let [key, value] of Object.entries(overrides)) {
        if(value && typeof value === 'object') {
          for (let [action, actionvalue] of Object.entries(value)) {
            if(action == 'hidden' && actionvalue == true) {
              buttonHidingCss += '#'+key+' { opacity: 0; pointer-events: none; } ';
            }
          }
        }
      }
    }
    var AppLaunchButtonFilterCssValue = 'grayscale(25%) brightness(58%)';
    if(this._config.device_family == 'apple-tv') {
      AppLaunchButtonFilterCssValue = 'grayscale(0%) brightness(100%)';
    }
    else if (['onn', 'homatics'].includes(this._config.device_family) || ['ON1', 'ON2', 'HO1', 'HO2', 'HO3', 'HO4'].includes(this._config.defaultRemoteStyle_override)) {
      AppLaunchButtonFilterCssValue = 'grayscale(25%) brightness(80%)';
    }
    var guiEditorDirection = this.hass.config.language == 'he' ? 'rtl' : 'ltr';
    const devicenamecolor = this._config.visible_name_text_color || '#000000';
    var backgroundInherit = '';
    if (this._config.use_theme_background == true) {
        backgroundInherit = 'background: var(--ha-card-background,var(--card-background-color,#fff))!important; border: inherit !important; border-radius: inherit !important;';
    }
    if (this._config.useCustomSkin===true) {
        var skin = '#4682b4';
        if(this._config.skin) { skin = this._config.skin; }
        backgroundInherit = 'background: '+skin+' !important;';
    }
    const cssVars = html `<style>
                            :host {
                              --sz: ${scale};
                              --devicenamecolor: ${devicenamecolor};
                              --appButtonFilter: ${AppLaunchButtonFilterCssValue};
                            }
                            ${buttonHidingCss}
                            .AL1, .AL2 {
                              --sz: calc(${scale} * 2);
                              ${backgroundInherit}
                            }
                            .AL2 .appLauncherAppsContainer {
                              --sz: calc(${launcherscale} * 2);
                            }
                            .CC1, .CC2, .CC3 {
                              --sz: calc(${scale} * 1.2);
                            }
                            .ALControlsContainer{
                              --sz: calc(${scale} * 1.5);
                            }
                          </style>`;



    // Handle standard button highlight/lit states
    var powerStatusClass = ''
    var homeStatusClass = '';
    var playingStatusClass = '';
    var patchWallStatusClass = '';
    if ((this._config.hide_button_highlights != true)) {

        // Determine Power On/Off Status
        if(stateStr != 'off' && stateStr != 'unavailable') {
          powerStatusClass = ' litbutton';
        }
        if(stateStr == 'standby') {
          powerStatusClass = ' dimlitbutton';
        }

        // Determine Home Status
        if(['com.amazon.tv.launcher', 'com.google.android.tvlauncher', 'com.google.android.apps.tv.launcherx', 'Home'].includes(appId)) {
          homeStatusClass = ' litbutton';
        }

        // Determine Play/Pause
        var alwaysRegisterdAsPlaying = ['com.amazon.firebat', 'com.android.systemui', 'com.android.vending', 'com.android.tv.settings',
                                        'com.nvidia.shieldtech.accessoryui', 'com.esaba.downloader', 'com.amazon.venezia'];
        if(stateStr == 'playing' && !(alwaysRegisterdAsPlaying.includes(appId))) {
          playingStatusClass = ' litbutton';
        }

        // Determine Patchwall Status
        if(appId == 'com.mitv.tvhome.atv') {
          patchWallStatusClass = ' litbutton';
        }
    }

    // Get current device's Attributes AND use any applicable overrides from user conf
    var confRef = this._config;
    function getDeviceAttribute(deviceAttribute){
      return deviceAttributeQuery(deviceAttribute, confRef);
    }

    // Rebuild AppMap - allow hdmi inputs where appropriate & add configured custom launchers from YAML
    refreshAppMap(this._config, getDeviceAttribute('hdmiInputs'), getDeviceAttribute('avInputs'), getDeviceAttribute('tuner'));

    // get app button details from appmap json
    function getAppButtonData(config, configvalue, want) {
      if(appmap.has(configvalue)) {
        var deviceFamily = config["device_family"];
        var familySpecificAppData = appmap.get(configvalue)[deviceFamily];
        if(want=="active") {
          if (config["device_type"]=="fire_tv_stick_4k_max_second_gen" || config["device_type"]=="fire_tv_stick_4k_second_gen") {
              return "appActiveUnknown";
          }
          if (typeof appId != 'string') { return };
          if(familySpecificAppData && !(appmap.get(configvalue).androidName) && !(appmap.get(configvalue).androidName2) && !(appmap.get(configvalue).appName)) {
            return (appId == familySpecificAppData["androidName"] || appId == familySpecificAppData["androidName2"] || appId == familySpecificAppData["appName"]) ? "appActive" : "";
          }
          else {
            return (appId == appmap.get(configvalue).androidName || appId == appmap.get(configvalue).androidName2) || appId == appmap.get(configvalue).appName ? "appActive" : "";
          }
        }
        else {
          if (appmap.get(configvalue)[want]) {
            return appmap.get(configvalue)[want];
          }
          else if(familySpecificAppData) {
            return familySpecificAppData[want];
          }
        }
      }
      else {
        return ' ';
      }
    }

    function drawAppLaunchButtons(e, config, cols=3, max=6) {
        var spanclass = "three-col-span afappsgrid";
        if(cols == 2) {
          spanclass = "two-col-span nsappsgrid";
        }
        if(cols == 1) {
          spanclass = "appLauncherVerticalAppsContainer";
        }
        if(cols == 'fill') {
          spanclass = "appLauncherAppsContainer";
        }
        function showHide(buttonKey) {
          if (buttonKey === '') {
            return 'hidden';
          }
        }
        var buttonStyle = 'button';
        const appLaunchButtons = new Map();
        for(let i=1; i<=max; i++) {
          var appid = config["app_launch_"+i] || '';
          appLaunchButtons.set("confBtn"+i, appid);
        }

        // Properly apply default launcher buttons
        var displayedRemote = config.defaultRemoteStyle_override || getDeviceAttribute("defaultRemoteStyle") || config.device_family;
        if(['AF1', 'AF2', 'AF3', 'AF4', 'AF5', 'AF6', 'AL1', 'amazon-fire'].includes(displayedRemote)) {
            appLaunchButtons.set("confBtn1", config.app_launch_1 || 'prime-video');
            appLaunchButtons.set("confBtn2", config.app_launch_2 || 'netflix');
            appLaunchButtons.set("confBtn3", config.app_launch_3 || 'disney-plus');
            appLaunchButtons.set("confBtn4", config.app_launch_4 || 'hulu');
        }
        else if(['AR1', 'AR2', 'AR3', 'apple-tv'].includes(displayedRemote)) {
            buttonStyle = 'button-round';
        }
        else if(['CC1', 'CC2', 'CC3', 'chromecast'].includes(displayedRemote)) {
            appLaunchButtons.set("confBtn1", config.app_launch_1 || 'youtube');
            appLaunchButtons.set("confBtn2", config.app_launch_2 || 'netflix');
            buttonStyle = 'button-round';
        }
        else if(['NS1', 'NS2', 'nvidia-shield'].includes(displayedRemote)) {
            appLaunchButtons.set("confBtn1", config.app_launch_1 || 'netflix');
        }
        else if(['XM1', 'XM2', 'xiaomi'].includes(displayedRemote)) {
            appLaunchButtons.set("confBtn1", config.app_launch_1 || 'netflix');
            appLaunchButtons.set("confBtn2", config.app_launch_2 || 'prime-video');
        }
        else if(['RSR', 'RVR'].includes(displayedRemote)) {
            appLaunchButtons.set("confBtn1", config.app_launch_1 || 'netflix');
            appLaunchButtons.set("confBtn2", config.app_launch_2 || 'disney-plus');
            appLaunchButtons.set("confBtn3", config.app_launch_3 || 'apple-tv');
            appLaunchButtons.set("confBtn4", config.app_launch_4 || 'paramount-plus');
        }
        else if(['RTR'].includes(displayedRemote)) {
            appLaunchButtons.set("confBtn1", config.app_launch_1 || 'netflix');
            appLaunchButtons.set("confBtn2", config.app_launch_2 || 'disney-plus');
            appLaunchButtons.set("confBtn3", config.app_launch_3 || 'hulu');
            appLaunchButtons.set("confBtn4", config.app_launch_4 || 'roku-channel');
        }
        else if(['RHR'].includes(displayedRemote)) {
            appLaunchButtons.set("confBtn1", config.app_launch_1 || 'netflix');
            appLaunchButtons.set("confBtn2", config.app_launch_2 || 'hulu');
            appLaunchButtons.set("confBtn3", config.app_launch_3 || 'roku-channel');
            appLaunchButtons.set("confBtn4", config.app_launch_4 || 'disney-plus');
        }
        else if(['RVRP', 'RWR', 'roku'].includes(displayedRemote)) {
            appLaunchButtons.set("confBtn1", config.app_launch_1 || 'netflix');
            appLaunchButtons.set("confBtn2", config.app_launch_2 || 'disney-plus');
            appLaunchButtons.set("confBtn3", config.app_launch_3 || 'apple-tv');
            appLaunchButtons.set("confBtn4", config.app_launch_4 || 'hulu');
        }
        else if(['AFJTV', 'AFXF2'].includes(displayedRemote)) {
            appLaunchButtons.set("confBtn1", config.app_launch_1 || 'prime-video');
            appLaunchButtons.set("confBtn2", config.app_launch_2 || 'netflix');
            appLaunchButtons.set("confBtn3", config.app_launch_3 || 'disney-plus');
            appLaunchButtons.set("confBtn4", config.app_launch_4 || 'freeview-play');
        }
        else if(['ON1', 'ON2'].includes(displayedRemote)) {
            appLaunchButtons.set("confBtn1", config.app_launch_1 || 'youtube');
            appLaunchButtons.set("confBtn2", config.app_launch_2 || 'netflix');
            appLaunchButtons.set("confBtn3", config.app_launch_3 || 'disney-plus');
            appLaunchButtons.set("confBtn4", config.app_launch_4 || 'paramount-plus');
        }
        else if(['HO1', 'HO2', 'HO3', 'HO4'].includes(displayedRemote)) {
            appLaunchButtons.set("confBtn1", config.app_launch_1 || 'youtube');
            appLaunchButtons.set("confBtn2", config.app_launch_2 || 'netflix');
            appLaunchButtons.set("confBtn3", config.app_launch_3 || 'prime-video');
            appLaunchButtons.set("confBtn4", config.app_launch_4 || 'rocket-launcher-btn');
        }


        // Return button HTML
        if(['CC1', 'CC2', 'CC3', 'AR1', 'AR2', 'AR3'].includes(config.defaultRemoteStyle_override) || (['apple-tv', 'chromecast'].includes(config.device_family) && !(config.defaultRemoteStyle_override))) {
          return html `
            ${ Array.from(appLaunchButtons.keys()).map(key => {
              var val = appLaunchButtons.get(key);
              if(val) {
                  return html `<button class="srcButton ${getAppButtonData(config, val, 'className')} ${getAppButtonData(config, val, 'active')} ${showHide(val)}" id="${val}-button" @click=${e.buttonDown}>
                                 ${unsafeHTML(getAppButtonData(config, val, buttonStyle) || getAppButtonData(config, val, 'button'))}
                               </button>`;
              }
            })}
          `;
        }
        else {
          return html `
            <div class="${spanclass}">
            ${ Array.from(appLaunchButtons.keys()).map(key => {
              var val = appLaunchButtons.get(key);
              return html `<button class="srcButton ${getAppButtonData(config, val, 'className')} ${getAppButtonData(config, val, 'active')} ${showHide(val)}" id="${val}-button" @click=${e.buttonDown}>
                             ${unsafeHTML(getAppButtonData(config, val, 'button'))}
                           </button>`;

            })}
            </div>
          `;
        }
    }

    // Draw optional device name
    function drawDeviceName(e, config, section){
      if(!config.visible_name_text) { return };
      if(config.name_position=='bottom' && section=='bottom') {
        return html`<div class="deviceNameBottom">${config.visible_name_text}</div>`;
      }
      else if(config.name_position=='top' && section=='top') {
        return html`<div class="deviceNameTop">${config.visible_name_text}</div>`;
      }
      return;
    }

    // Draw optional Firemote Version number
    function drawFiremoteVersionNumber(e, config){
      if(config.show_version_number === true) {
        return html ` <div class="firemoteVersionNumber">${HAFiremoteVersion}</div>`;
      }
    }

    //Draw Optional MediaControl buttons on CC
    function drawMediaControlButtons(e, config) {
      if (config.show_media_controls==true) {
        return html`
          <button class="remote-button" id="rewind-button" @pointerdown=${e.buttonDown}>
            <ha-icon icon="mdi:rewind"></ha-icon>
          </button>
          <button class="remote-button${playingStatusClass}" id="playpause-button" @pointerdown=${e.buttonDown}>
            <ha-icon icon="mdi:play-pause"></ha-icon>
          </button>
          <button class="remote-button" id="fastforward-button" @pointerdown=${e.buttonDown}>
            <ha-icon icon="mdi:fast-forward"></ha-icon>
          </button>
          `;
        }
        return;
    }

    // Reused SVG Logos
    function renderfiretvlogo() {
      return html`
          <!-- <div class="three-col-span">Remote name</div> -->
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          	 viewBox="0 0 1276 712" style="enable-background:new 0 0 1276 712;" xml:space="preserve" class="remote-logo">
            <style type="text/css">
            	.st0{fill:#0f0f0f;}
            </style>
           <g id="Layer_7">
          	<path class="st0" d="M168.6,30.3c0.3,0.6,0.8,0.5,1.3,0.5c10,0.7,19.9,2.4,29.6,5c1.2,0.3,2.3,0.7,3.4,1.2c3.5,1.5,5.8,4,6.2,7.9
          		c0.2,1.7,0.5,3.4,0.5,5.1c0.1,4.7,0.1,9.5,0,14.2c0,1.4-0.2,2.8-0.6,4.2c-0.5,2.9-3.1,5-6,4.9c-2,0.1-4,0-6-0.2
          		c-4-0.5-7.9-1.3-11.9-1.8c-7.1-1-14.2-1.2-21.3-0.6c-4.3,0.3-8.6,1-12.8,2.1c-2.4,0.7-4.8,1.6-7,2.7c-5.8,2.9-9.4,7.7-11.6,13.7
          		c-1.4,4-2.2,8.1-2.5,12.3c-0.4,4.8-0.3,9.6-0.3,14.5c0,11.3,0,22.5,0,33.8v3.2c0.7,0.2,1.4,0.3,2.1,0.3c4.1,0,8.2,0,12.4,0h51.3
          		c1.2,0,2.4,0,3.6,0.1c4.7,0.4,7.2,3.6,7.6,7.9c0,0.6,0,1.2,0,1.8c0,6.3,0,12.7,0,19c0.1,0.9,0,1.8-0.1,2.7c-1,4.9-3.6,6.5-7.8,7.2
          		c-1.1,0.1-2.2,0.2-3.3,0.1h-62.2h-3.3c-0.1,0.5-0.3,1.1-0.3,1.6c0,0.9,0,1.8,0,2.7c0,65.7,0,131.3,0,197c0,1.3,0,2.6-0.1,3.9
          		c-0.4,4.4-3.1,7.2-7.5,7.7c-0.6,0.1-1.2,0.1-1.8,0.1c-10.2,0-20.3,0-30.5,0c-1.3,0-2.6-0.2-3.8-0.6c-3.3-1.1-5-3.6-5.4-6.9
          		c-0.1-1.3-0.1-2.6-0.1-3.9c0-65.9,0-131.8,0-197.7v-3.8c-1-0.1-1.9-0.2-2.8-0.2c-11.2,0-22.3,0-33.5,0c-1.4,0-2.8-0.2-4.2-0.5
          		c-3.2-0.6-5.6-3.2-6-6.4c-0.1-0.3-0.1-0.6-0.2-0.9c0.1-0.4,0.1-0.8,0.2-1.2c0-4.1,0-8.2-0.1-12.3c0-1.2-0.1-2.4-0.1-3.6
          		c0.5-4.5,3.1-7,7.5-7.9c1.8-0.4,3.5-0.8,5.3-1c4-0.5,8-0.9,12-1.4c6.3-0.8,12.5-1.6,18.8-2.4c1-0.1,1.9-0.4,3.1-0.6v-3.1
          		c0-12.4,0-24.7,0-37.1c-0.1-8,0.5-16.1,1.9-24c1.2-7.6,3.5-15.1,6.7-22.1c3.9-8.5,9.7-16,17-21.8c9.6-7.6,20.7-11.7,32.7-13.7
          		c3.7-0.7,7.5-1.2,11.3-1.4c0.4-0.1,0.7-0.2,1-0.5H168.6z"/>
          	<path class="st0" d="M573.7,678c0-0.2,0-0.4-0.1-0.5c1.5,0,3-0.1,4.5-0.1h97.7c1.4,0,2.8,0.1,4.2,0.1c0,0.2-0.1,0.3-0.1,0.5
          		L573.7,678z"/>
          	<path class="st0" d="M32.7,167.3l0.9-0.1c0,1.2,0.1,2.4,0.1,3.6c0,4.1,0,8.2,0.1,12.3c0,0.4-0.1,0.8-0.2,1.2l-0.9-0.1V167.3z"/>
          	<path class="st0" d="M680,677.4c-1.4,0-2.8-0.1-4.2-0.1h-97.7c-1.5,0-3,0-4.5,0.1c-4.5-0.3-9-0.7-13.5-1.1
          		c-2.4-0.2-4.8-0.5-7.2-0.7c-8.1-0.8-16.2-1.9-24.2-3c-12.6-1.7-25.2-3.8-37.7-6.3c-9.3-1.8-18.7-3.9-27.9-6.1
          		c-17-4-33.8-8.7-50.4-14.1c-15.3-4.9-30.4-10.4-45.3-16.3c-14.9-6-29.6-12.4-44.1-19.5c-32.2-15.6-63.2-33.6-92.6-54
          		c-14-9.7-27.6-19.9-40.8-30.6c-9.3-7.5-18.4-15.3-27.3-23.3c-1.2-1.1-2.3-2.2-3.4-3.4c-1.4-1.7-2.2-3.9-2.2-6.1
          		c0-3.9,2.9-7.2,6.8-7.6c2.4-0.3,4.9,0.1,7,1.3c2.7,1.4,5.2,3,7.9,4.4c8.6,4.7,17.2,9.6,25.9,14.1s17.3,8.9,26.1,13.2
          		c14.4,7,28.9,13.5,43.7,19.7c15,6.3,30.2,12.2,45.5,17.7c17,6.1,34.2,11.7,51.5,16.8c16.8,5,33.8,9.5,50.9,13.5
          		c14.8,3.5,29.6,6.7,44.5,9.3c9.5,1.7,19,3.3,28.5,4.8c7.7,1.2,15.5,2.4,23.2,3.4c6,0.8,12,1.4,18,2c4.8,0.5,9.6,1.1,14.4,1.6
          		c2.8,0.3,5.6,0.5,8.4,0.7c4.3,0.4,8.6,0.8,12.9,1.1c4.6,0.3,9.2,0.6,13.8,0.8c6.6,0.4,13.2,0.7,19.9,1c3.1,0.1,6.2,0.1,9.3,0.2
          		c3.5,0,7,0.1,10.6,0.1c6,0.1,12.1,0.3,18.1,0.3c9.1-0.1,18.3-0.3,27.4-0.6c4.1-0.1,8.2-0.3,12.3-0.6c7.5-0.5,15-1,22.5-1.6
          		c3.6-0.3,7.2-0.5,10.8-0.8c5.1-0.5,10.2-1.1,15.3-1.6c2.2-0.2,4.4-0.4,6.6-0.7c4.6-0.5,9.2-1.1,13.7-1.7c3.8-0.5,7.6-0.9,11.4-1.4
          		c3.2-0.4,6.4-0.9,9.5-1.4c5.6-0.9,11.1-1.8,16.6-2.7c5.1-0.9,10.3-1.7,15.4-2.7c8.5-1.6,16.9-3.4,25.4-5.2
          		c7.2-1.5,14.3-3.2,21.4-4.8c16.6-3.9,33.1-8.4,49.4-13.3c28.7-8.5,56.9-18.5,84.6-29.8c3.3-1.4,6.7-2.8,10-4.2
          		c2.8-1.2,5.8-1.8,8.8-1.6c4.7,0.3,8.8,2.1,11.6,6.1c3.2,4.5,3,9.2,0.4,13.9c-1.5,2.4-3.4,4.5-5.8,6.1c-9.7,7.2-19.7,13.9-29.9,20.3
          		c-12.5,7.8-25.4,15.1-38.6,21.8c-18.5,9.5-37.5,18-56.8,25.6c-12.1,4.8-24.4,9.2-36.8,13.2c-16.4,5.3-33,10.1-49.7,14.3
          		c-11.3,2.8-22.6,5.4-34.1,7.7c-8.3,1.7-16.6,3-24.9,4.4c-5.9,1-11.9,2-17.8,2.8c-5.5,0.8-11,1.4-16.4,2c-4.6,0.6-9.2,1.1-13.8,1.6
          		C688.3,676.9,684.2,677.2,680,677.4z"/>
          	<path class="st0" d="M564.2,290c0.2,3.7,0.2,7.2,0.5,10.7c0.4,4.1,1,8.2,1.7,12.2c2,11.2,5.5,21.8,11.8,31.3
          		c6.1,9.2,14.7,16.5,24.8,20.9c6.8,3,14,5.1,21.3,6.3c9.2,1.5,18.6,2.1,27.9,1.8c4.7-0.1,9.4-0.3,14.1-0.8
          		c8.7-0.7,17.3-2.2,25.8-4.4c7.8-2.1,15.7-4.4,23.5-6.6c1.9-0.6,3.9-0.9,5.9-1c2.5,0,4.7,1.6,5.4,4c0.4,1,0.6,2.1,0.6,3.2
          		c0.1,6.2,0.1,12.5,0,18.7c0.1,3.9-2,7.6-5.5,9.4c-3.6,2-7.3,3.8-11.2,5.1c-9.6,3.4-19.5,6.1-29.6,8c-6.3,1.2-12.7,2.1-19,2.8
          		c-3.7,0.4-7.4,0.6-11.1,0.8c-3,0.2-6,0.4-9,0.4c-8.5,0-17.1-0.4-25.5-1.5c-10.6-1.2-21-3.7-31-7.3c-15.4-5.5-29.1-14.9-39.9-27.2
          		c-7.9-9.2-14.1-19.6-18.4-30.9c-3.7-9.5-6.4-19.5-8-29.6c-1.2-7.3-2-14.7-2.5-22.1c-0.5-8.8-0.6-17.7-0.2-26.5
          		c0.2-6.2,0.8-12.4,1.7-18.6c2.4-16.8,6.9-33,15.1-48c9.4-17.2,22.4-31,39.6-40.8c9.1-5.1,18.9-8.8,29.2-11.1
          		c7.2-1.6,14.6-2.6,22-3.1c6.1-0.4,12.2-0.5,18.4-0.2c8.9,0.3,17.8,1.7,26.4,4c13.3,3.6,25.2,9.7,35.4,19.1
          		c6.2,5.7,11.4,12.4,15.6,19.8c5.2,9.4,8.8,19.6,10.7,30.2c2.1,11.1,2.9,22.3,2.4,33.6c-0.2,4.7-0.3,9.4-0.7,14.1
          		c-0.3,5.4-1.1,10.8-2.2,16.1c-1.3,5.3-3.4,6.9-8.9,7.2c-1.1,0-2.2,0-3.3,0H567.6C566.5,289.9,565.4,290,564.2,290z M687.7,256.8
          		c0.2-2.4,0.5-4.5,0.5-6.6c0.3-7.1-0.1-14.3-1-21.3c-0.9-6.5-2.7-12.8-5.4-18.7c-5.2-11.4-15-20.1-26.9-23.8
          		c-6.5-2-13.3-3.1-20.1-3.3c-3.4-0.1-6.8,0-10.2,0.4c-5,0.4-9.9,1.3-14.8,2.6c-13.1,3.6-24.5,12-31.9,23.4c-4.4,7-7.7,14.6-9.8,22.5
          		c-1.5,6-2.7,12.1-3.4,18.3c-0.1,1-0.2,2-0.2,3c0,1.1-0.4,2.2,0.1,3.2c0.3,0.1,0.6,0.2,0.9,0.2L687.7,256.8z"/>
          	<path class="st0" d="M847.4,192.2c-1.3,0-2.3-0.1-3.3-0.1c-10.6,0-21.1,0-31.7,0c-1.5,0-3-0.2-4.5-0.5c-3.5-0.8-5.4-3.3-6-6.8
          		c-0.1-0.9-0.2-1.8-0.2-2.7c0-4.2,0-8.4,0-12.7c0-0.7,0-1.4,0.1-2.1c0.4-3.6,2.1-6.3,5.7-7.3c2-0.6,4.1-1.1,6.1-1.5
          		c4-0.6,8-0.9,12-1.4c4.2-0.5,8.4-1.1,12.5-1.6c2.2-0.3,4.4-0.5,6.6-0.8c1.3-0.2,2.6-0.4,4-0.6c0.2-1.5,0.5-2.8,0.7-4.2
          		c0.5-4.8,0.9-9.6,1.4-14.4s1.1-9.4,1.6-14.1c0.3-2.7,0.5-5.4,0.8-8.1c0.5-4.9,1.1-9.8,1.6-14.7c0.3-2.4,0.5-4.8,0.7-7.2
          		c0.2-1.5,0.6-3,1.4-4.3c1.2-2.4,3.5-4,6.2-4.3c1.8-0.3,3.6-0.4,5.4-0.4c4.6-0.1,9.3-0.1,13.9,0c2.2,0,4.4,0.1,6.6,0.3
          		c4.5,0.4,7.3,3.3,7.7,7.8c0.1,1,0.1,2,0.1,3v55.8c0,1.1,0.1,2.2,0.1,3.3c1.1,0.3,2.2,0.4,3.4,0.3c19.7,0,39.4,0,59.2,0
          		c1.6,0,3.2,0.1,4.8,0.3c3.5,0.4,6.3,3.1,6.8,6.6c0.2,1.1,0.3,2.2,0.4,3.3c0,6.2,0,12.5,0,18.7c0,1.4-0.2,2.8-0.6,4.2
          		c-0.6,2.8-2.9,5-5.8,5.5c-1.6,0.3-3.2,0.4-4.8,0.5c-19.9,0-39.9,0-59.8,0H897c-0.1,0.7-0.2,1.2-0.3,1.8s0,1.2,0,1.8
          		c0,46.6,0,93.2,0,139.7c-0.1,4.9,0.5,9.8,1.8,14.6c1.3,4.5,3.3,8.6,7,11.8c3,2.5,6.6,4.3,10.4,5.2c6.7,1.7,13.7,2.3,20.6,1.9
          		c7.8-0.5,15.6-1.5,23.3-3.1c1.7-0.3,3.4-0.6,5.1-0.8c1.4-0.2,2.8-0.1,4.2,0.3c1.7,0.4,3.1,1.7,3.5,3.4c0.4,1.3,0.7,2.7,0.7,4.1
          		c0.1,5.7,0.1,11.5,0,17.2c-0.1,1.7-0.3,3.4-0.8,5c-0.5,2.2-1.9,4.1-3.8,5.2c-1.6,1-3.4,1.8-5.2,2.4c-4.9,1.6-9.8,2.8-14.9,3.6
          		c-5.7,1-11.5,1.6-17.3,2c-6.2,0.5-12.5,0.6-18.7,0.3c-11-0.5-21.8-2.2-31.9-6.8c-12.1-5.3-21.7-15.1-26.8-27.3
          		c-3-7-4.9-14.5-5.7-22.1c-0.7-6.2-1-12.4-0.9-18.6c0-45.9,0-91.7,0-137.6L847.4,192.2z"/>
          	<path class="st0" d="M1120.6,359.9c1.1-3.1,2-5.5,2.9-7.9c6.3-18,12.6-36,18.9-54c7.9-22.4,15.7-44.9,23.6-67.3
          		c5.2-14.7,10.3-29.3,15.5-44c2.4-6.8,4.8-13.6,7.2-20.4c1-2.6,2.1-5.2,3.4-7.7c1.5-2.9,4.4-4.8,7.7-5c2.3-0.2,4.6-0.4,6.9-0.4
          		c8.2-0.1,16.3-0.1,24.4,0c1.5,0,3,0.1,4.5,0.4c2.8,0.5,4.3,2.3,4.4,5.2c0.1,2.4-0.3,4.8-1.2,7c-9.1,22.8-18.1,45.5-27,68.3
          		c-9.2,23.3-18.4,46.7-27.7,70c-6.4,16.1-12.7,32.1-19.1,48.1c-5.6,14.1-11.2,28.2-16.8,42.3c-0.5,1.3-1.2,2.5-1.8,3.8
          		c-1.9,4.4-5.5,6.5-10.2,6.8c-0.8,0.1-1.6,0.1-2.4,0.1c-9.9,0-19.7,0-29.6-0.1c-1.4-0.1-2.8-0.3-4.2-0.6c-2.8-0.4-5.3-2.2-6.6-4.8
          		c-1-1.9-2-3.7-2.8-5.7c-14.7-36.6-29.3-73.3-43.8-109.9c-8.6-21.6-17.2-43.3-25.8-64.9c-6.2-15.7-12.5-31.3-18.7-47
          		c-1-2.6-2-5.2-3-7.9c-0.7-1.7-1-3.5-0.9-5.3c0.2-3.2,1.7-5.1,4.8-5.7c1.2-0.2,2.4-0.4,3.6-0.4c9.5,0,18.9,0,28.4,0c2,0,4,0.2,6,0.5
          		c3.1,0.2,5.8,2,7.3,4.7c1.1,2,2.1,4.1,3,6.2c2.5,6.9,4.9,13.8,7.4,20.7l19.9,56.9l23.6,67l17.1,48.5
          		C1119.9,358.1,1120.1,358.6,1120.6,359.9z"/>
          	<path class="st0" d="M412.5,219.5v3.8c0,56.7,0,113.4,0,170.2c0.1,1.9-0.1,3.8-0.5,5.7c-1,3.5-3.4,5.3-6.8,6c-1,0.2-2,0.2-3,0.2
          		h-29c-1.6,0-3.2-0.2-4.7-0.7c-2.3-0.8-4.1-2.6-4.8-5c-0.4-1.4-0.6-2.7-0.6-4.2c-0.1-2.1,0-4.2,0-6.3c0-74.9,0-149.9,0-224.8
          		c-0.1-1.7,0.1-3.4,0.5-5.1c0.5-2.5,2.4-4.5,4.9-5.2c1.6-0.5,3.3-0.8,5-0.8c7-0.1,14.1-0.1,21.1,0c1.5,0,3,0.2,4.5,0.5
          		c3.3,0.6,5.9,3.1,6.6,6.3c0.5,2.1,0.9,4.3,1.2,6.5c0.6,4.4,1.1,8.8,1.7,13.1c0.3,2.4,0.5,4.8,0.8,7.2c0.1,1,0.3,1.9,0.5,3.2
          		c1.4-1.1,2.7-2.4,3.9-3.7c8.8-8.9,18-17.2,28.9-23.5c8.3-4.8,17.3-8.2,26.7-9.9c8-1.4,16.2-1.9,24.3-1.5c1.7,0.1,3.4,0.2,5.1,0.4
          		c1.2,0.2,2.4,0.4,3.5,0.9c2.8,1,4.8,3.6,4.9,6.7c0.1,0.8,0.1,1.6,0.1,2.4c0,8.3,0,16.7,0,25c0.1,1.7-0.1,3.4-0.6,5.1
          		c-0.7,2.2-2.4,3.8-4.6,4.3c-1.6,0.4-3.3,0.6-5,0.5c-7.3-0.3-14.6-1.2-22-0.9c-12.9,0.5-25.5,3.2-37.4,8.2
          		c-8.5,3.6-16.5,8.4-23.6,14.2C413.5,218.5,413.1,218.9,412.5,219.5z"/>
          	<path class="st0" d="M298.4,279.2c0,38.4,0,76.8,0,115.2c0,1.5-0.1,3-0.4,4.5c-0.9,4-3.8,5.7-7.2,6.2c-0.8,0.1-1.6,0.1-2.4,0.1
          		c-9.7,0-19.3,0-29,0c-1.5,0-3-0.2-4.5-0.6c-2.7-0.6-4.8-2.8-5.3-5.6c-0.3-1.5-0.5-3-0.6-4.5c0-0.5,0-1,0-1.5
          		c0-75.9,0-151.9,0-227.8c-0.1-1.9,0.1-3.8,0.5-5.7c0.6-3.2,3.2-5.6,6.3-6.1c1.5-0.3,3-0.4,4.5-0.4c9.1,0,18.1,0,27.2,0
          		c1.3,0,2.6,0.1,3.9,0.4c4.9,0.9,6.5,3.9,7,7.5c0.1,1.1,0.1,2.2,0.1,3.3L298.4,279.2z"/>
          	<path class="st0" d="M1036.1,466.5c6.1,0.3,12.3,0.4,18.4,0.9c10.4,0.8,20.8,2.3,30.8,5.4c2.8,0.9,5.4,2.1,8.1,3.2
          		c4.8,2,7.1,5.9,7.9,10.9c0.9,5.3,0.8,10.6,0.7,15.9c-0.3,6.9-1,13.8-2.3,20.6c-2,11.5-4.9,22.8-8.6,33.8
          		c-5.3,15.9-12.4,31.2-21.2,45.5c-5.2,8.4-11.1,16.3-17.8,23.5c-3.7,4.1-7.7,7.9-12,11.4c-1.4,1.3-3.1,2.3-4.9,2.9
          		c-1.1,0.4-2.3,0.6-3.5,0.6c-3.7,0.1-6-2.6-5.5-6.2c0.3-1.6,0.7-3.1,1.4-4.6c1.9-5.1,4-10.1,6-15.1c5.4-13.8,10.5-27.8,15-41.9
          		c3.1-9.6,5.6-19.3,7.6-29.1c0.8-3.9,1.2-7.9,1.6-11.9c0.3-3.4,0.2-6.8-0.2-10.2c-0.1-0.6-0.1-1.2-0.2-1.8c-0.8-5-4.1-9.2-8.7-11.2
          		c-4.1-1.8-8.5-3.1-13-3.8c-4.7-0.8-9.4-1.1-14.1-1.4c-6.6-0.4-13.3-0.4-19.9-0.3c-5.3,0.1-10.6,0.5-15.9,0.9
          		c-3.6,0.2-7.2,0.4-10.8,0.8c-6,0.5-12,1.1-18,1.7c-4.5,0.4-9,0.9-13.5,1.4c-2.4,0.3-4.8,0.7-7.2,0.9c-1.6,0.2-3.2,0.2-4.8,0.3
          		c-0.4,0-0.8,0-1.2-0.1c-4.3-0.7-6.2-3.5-4.6-7.8c0.5-1.2,1.2-2.3,2.1-3.3c1.2-1.3,2.6-2.5,4.1-3.5c11.2-7.7,23.5-13.7,36.4-17.8
          		c10.1-3.3,20.5-5.8,31-7.4c7.4-1.2,14.9-2,22.4-2.4C1026.3,467,1031.2,466.8,1036.1,466.5z"/>
          	<path class="st0" d="M274.1,49c4.6-0.3,9.3,0.5,13.6,2.2c7.4,2.9,13.2,9,15.5,16.6c2.3,7,2.3,14.6,0,21.6c-2.9,9.1-9,15-18.2,17.7
          		c-7.5,2.3-15.4,2.2-22.8-0.2c-9.2-2.9-15.2-9.1-17.9-18.4c-2-6.6-1.9-13.6,0.2-20.2c3.2-10.2,10.3-16.2,20.6-18.7
          		C268.1,49.1,271.1,48.8,274.1,49z"/>
              </g>
         </svg>
      `;
    }

    function renderAmazonArrowlogo() {
      return html`<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" x="0px" y="0px" viewBox="0 0 733 200" style="enable-background:new 0 0 1276 712;" xml:space="preserve" class="remote-logo"><g><path style="stroke:none;stroke-width:1;stroke-dasharray:none;stroke-linecap:butt;stroke-dashoffset:0;stroke-linejoin:miter;stroke-miterlimit:4;fill:#0f0f0f;fill-rule:nonzero;opacity:1" transform="matrix(.75 0 0 .75 -112.16 -331.09)" d="M680 677.4c-1.4 0-2.8-.1-4.2-.1h-97.7c-1.5 0-3 0-4.5.1-4.5-.3-9-.7-13.5-1.1-2.4-.2-4.8-.5-7.2-.7-8.1-.8-16.2-1.9-24.2-3-12.6-1.7-25.2-3.8-37.7-6.3-9.3-1.8-18.7-3.9-27.9-6.1-17-4-33.8-8.7-50.4-14.1-15.3-4.9-30.4-10.4-45.3-16.3-14.9-6-29.6-12.4-44.1-19.5-32.2-15.6-63.2-33.6-92.6-54-14-9.7-27.6-19.9-40.8-30.6-9.3-7.5-18.4-15.3-27.3-23.3-1.2-1.1-2.3-2.2-3.4-3.4-1.4-1.7-2.2-3.9-2.2-6.1 0-3.9 2.9-7.2 6.8-7.6 2.4-.3 4.9.1 7 1.3 2.7 1.4 5.2 3 7.9 4.4 8.6 4.7 17.2 9.6 25.9 14.1s17.3 8.9 26.1 13.2c14.4 7 28.9 13.5 43.7 19.7 15 6.3 30.2 12.2 45.5 17.7 17 6.1 34.2 11.7 51.5 16.8 16.8 5 33.8 9.5 50.9 13.5 14.8 3.5 29.6 6.7 44.5 9.3 9.5 1.7 19 3.3 28.5 4.8 7.7 1.2 15.5 2.4 23.2 3.4 6 .8 12 1.4 18 2 4.8.5 9.6 1.1 14.4 1.6 2.8.3 5.6.5 8.4.7 4.3.4 8.6.8 12.9 1.1 4.6.3 9.2.6 13.8.8 6.6.4 13.2.7 19.9 1 3.1.1 6.2.1 9.3.2 3.5 0 7 .1 10.6.1 6 .1 12.1.3 18.1.3 9.1-.1 18.3-.3 27.4-.6 4.1-.1 8.2-.3 12.3-.6 7.5-.5 15-1 22.5-1.6 3.6-.3 7.2-.5 10.8-.8 5.1-.5 10.2-1.1 15.3-1.6 2.2-.2 4.4-.4 6.6-.7 4.6-.5 9.2-1.1 13.7-1.7 3.8-.5 7.6-.9 11.4-1.4 3.2-.4 6.4-.9 9.5-1.4 5.6-.9 11.1-1.8 16.6-2.7 5.1-.9 10.3-1.7 15.4-2.7 8.5-1.6 16.9-3.4 25.4-5.2 7.2-1.5 14.3-3.2 21.4-4.8 16.6-3.9 33.1-8.4 49.4-13.3 28.7-8.5 56.9-18.5 84.6-29.8 3.3-1.4 6.7-2.8 10-4.2 2.8-1.2 5.8-1.8 8.8-1.6 4.7.3 8.8 2.1 11.6 6.1 3.2 4.5 3 9.2.4 13.9-1.5 2.4-3.4 4.5-5.8 6.1-9.7 7.2-19.7 13.9-29.9 20.3-12.5 7.8-25.4 15.1-38.6 21.8-18.5 9.5-37.5 18-56.8 25.6-12.1 4.8-24.4 9.2-36.8 13.2-16.4 5.3-33 10.1-49.7 14.3-11.3 2.8-22.6 5.4-34.1 7.7-8.3 1.7-16.6 3-24.9 4.4-5.9 1-11.9 2-17.8 2.8-5.5.8-11 1.4-16.4 2-4.6.6-9.2 1.1-13.8 1.6-4.1.5-8.2.8-12.4 1z"/><path style="stroke:none;stroke-width:1;stroke-dasharray:none;stroke-linecap:butt;stroke-dashoffset:0;stroke-linejoin:miter;stroke-miterlimit:4;fill:#0f0f0f;fill-rule:nonzero;opacity:1" transform="matrix(.75 0 0 .75 -112.16 -331.09)" d="M1036.1 466.5c6.1.3 12.3.4 18.4.9 10.4.8 20.8 2.3 30.8 5.4 2.8.9 5.4 2.1 8.1 3.2 4.8 2 7.1 5.9 7.9 10.9.9 5.3.8 10.6.7 15.9-.3 6.9-1 13.8-2.3 20.6-2 11.5-4.9 22.8-8.6 33.8-5.3 15.9-12.4 31.2-21.2 45.5-5.2 8.4-11.1 16.3-17.8 23.5-3.7 4.1-7.7 7.9-12 11.4-1.4 1.3-3.1 2.3-4.9 2.9-1.1.4-2.3.6-3.5.6-3.7.1-6-2.6-5.5-6.2.3-1.6.7-3.1 1.4-4.6 1.9-5.1 4-10.1 6-15.1 5.4-13.8 10.5-27.8 15-41.9 3.1-9.6 5.6-19.3 7.6-29.1.8-3.9 1.2-7.9 1.6-11.9.3-3.4.2-6.8-.2-10.2-.1-.6-.1-1.2-.2-1.8-.8-5-4.1-9.2-8.7-11.2-4.1-1.8-8.5-3.1-13-3.8-4.7-.8-9.4-1.1-14.1-1.4-6.6-.4-13.3-.4-19.9-.3-5.3.1-10.6.5-15.9.9-3.6.2-7.2.4-10.8.8-6 .5-12 1.1-18 1.7-4.5.4-9 .9-13.5 1.4-2.4.3-4.8.7-7.2.9-1.6.2-3.2.2-4.8.3-.4 0-.8 0-1.2-.1-4.3-.7-6.2-3.5-4.6-7.8.5-1.2 1.2-2.3 2.1-3.3 1.2-1.3 2.6-2.5 4.1-3.5 11.2-7.7 23.5-13.7 36.4-17.8 10.1-3.3 20.5-5.8 31-7.4 7.4-1.2 14.9-2 22.4-2.4 4.6-.3 9.5-.5 14.4-.8z"/></g></svg>
      `;
    }

    function renderAmazonNameWithArrowLogo() {
      return html`<svg id="svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0, 0, 400,140.46511627906978" xml:space="preserve" x="0px" y="0px" class="remote-logo" style="margin-top: 90px;"><g id="svgg"><path id="path0" d="M36.047 13.922 C 25.440 15.663,18.409 21.339,16.256 29.898 C 15.386 33.355,15.944 33.716,23.234 34.417 C 30.107 35.077,29.928 35.133,31.381 31.849 C 35.652 22.191,47.907 24.668,47.907 35.188 L 47.907 38.454 43.140 39.025 C 24.310 41.281,17.443 45.404,14.649 56.130 C 9.599 75.517,31.970 87.543,47.354 73.711 C 50.201 71.152,50.324 71.150,52.031 73.631 C 56.460 80.068,57.623 80.160,64.096 74.585 C 70.037 69.467,69.989 69.602,67.234 65.658 C 64.385 61.578,64.186 60.199,64.186 44.481 C 64.186 26.725,63.554 23.541,59.226 19.494 C 54.323 14.909,44.469 12.540,36.047 13.922 M186.744 13.922 C 176.330 15.631,169.990 20.534,167.390 28.888 C 165.975 33.434,166.192 33.603,174.534 34.465 C 180.636 35.095,181.475 34.834,182.015 32.134 C 182.650 28.960,186.790 26.067,190.698 26.067 C 195.996 26.067,198.575 29.032,198.594 35.144 L 198.605 38.427 190.985 39.444 C 173.765 41.743,166.724 46.806,165.131 58.037 C 162.420 77.148,182.807 86.721,198.346 73.634 L 201.111 71.305 203.071 73.969 C 207.640 80.175,208.370 80.214,214.845 74.602 C 220.532 69.673,220.651 69.411,218.542 66.499 C 215.103 61.751,215.144 62.006,214.858 43.721 C 214.565 24.975,214.487 24.520,210.880 20.508 C 206.094 15.184,195.940 12.413,186.744 13.922 M103.899 14.583 C 99.212 15.774,95.610 18.697,93.516 23.008 L 92.605 24.884 92.581 20.847 C 92.549 15.291,92.629 15.349,84.923 15.349 C 76.242 15.349,77.209 11.371,77.209 47.058 C 77.209 82.676,76.169 78.605,85.269 78.605 C 94.395 78.605,93.488 80.962,93.488 57.232 C 93.488 45.213,93.678 36.835,93.983 35.415 C 95.655 27.619,105.435 26.650,107.490 34.077 C 107.875 35.469,108.008 42.004,107.942 56.367 C 107.830 81.094,106.905 78.605,116.207 78.605 C 125.083 78.605,124.186 80.942,124.186 57.818 C 124.186 38.303,124.445 34.648,125.977 32.558 C 129.093 28.308,135.775 28.118,138.015 32.217 C 138.762 33.584,138.849 35.710,138.967 55.581 C 139.121 81.421,138.135 78.605,147.032 78.605 C 155.910 78.605,154.946 81.978,154.786 51.460 L 154.651 25.814 153.433 23.216 C 147.911 11.442,127.228 11.472,123.487 23.259 C 123.044 24.655,122.683 24.419,121.030 21.656 C 117.442 15.657,110.671 12.862,103.899 14.583 M298.774 14.615 C 285.440 17.133,277.963 28.760,277.963 46.977 C 277.963 67.645,287.466 79.560,303.922 79.525 C 321.679 79.488,332.781 61.905,329.312 39.314 C 326.649 21.981,313.990 11.742,298.774 14.615 M365.706 14.444 C 361.132 15.347,357.594 18.136,355.118 22.791 L 353.510 25.814 353.499 21.063 C 353.490 16.848,353.387 16.257,352.589 15.830 C 351.292 15.136,339.868 15.202,339.163 15.907 C 338.059 17.010,338.392 77.528,339.504 78.123 C 341.175 79.017,352.760 78.736,353.625 77.780 C 354.279 77.057,354.391 74.526,354.535 57.199 C 354.706 36.517,354.794 35.590,356.865 32.546 C 360.199 27.648,366.045 27.784,368.605 32.821 C 369.488 34.558,369.542 35.722,369.674 55.802 C 369.840 81.258,368.901 78.605,377.747 78.605 C 387.145 78.605,386.185 81.574,385.918 53.326 C 385.653 25.244,385.460 23.888,381.050 19.006 C 377.570 15.154,371.401 13.320,365.706 14.444 M229.395 15.907 C 228.463 16.840,228.641 26.700,229.605 27.501 C 230.182 27.981,232.851 28.197,240.345 28.372 L 250.317 28.605 246.877 33.488 C 225.578 63.731,226.518 62.053,226.514 69.846 C 226.510 77.165,227.179 78.065,231.128 76.064 C 240.755 71.186,254.759 70.813,265.639 75.147 C 270.087 76.918,271.392 77.100,271.811 76.008 C 272.287 74.767,272.123 64.647,271.611 63.690 C 270.386 61.400,262.537 58.786,254.613 58.027 L 248.986 57.488 255.726 47.930 C 259.433 42.673,264.371 35.651,266.698 32.326 L 270.930 26.279 271.089 21.495 C 271.198 18.214,271.071 16.496,270.684 16.029 C 269.925 15.115,230.304 14.998,229.395 15.907 M307.428 27.202 C 313.604 30.396,314.956 57.591,309.296 64.786 C 306.278 68.623,300.348 68.160,297.847 63.893 C 293.908 57.172,293.838 34.517,297.741 29.556 C 300.024 26.654,304.340 25.605,307.428 27.202 M47.816 53.140 C 47.451 62.310,43.833 67.442,37.733 67.442 C 29.210 67.442,28.768 53.144,37.183 49.647 C 38.778 48.984,43.987 48.007,46.221 47.952 L 48.024 47.907 47.816 53.140 M198.505 53.140 C 198.109 62.691,194.321 67.858,188.093 67.341 C 183.971 66.999,181.860 64.277,181.860 59.302 C 181.860 52.235,187.225 48.191,196.919 47.952 L 198.722 47.907 198.505 53.140 M243.256 81.389 C 228.857 83.572,219.241 91.284,232.867 89.721 C 239.505 88.959,250.067 88.951,250.823 89.707 C 251.112 89.996,251.700 90.233,252.129 90.233 C 255.453 90.233,254.387 98.588,249.481 110.993 C 246.496 118.538,247.584 119.927,252.619 115.000 C 259.876 107.900,266.457 88.534,263.140 84.042 C 261.471 81.783,250.399 80.306,243.256 81.389 M66.777 85.382 C 65.908 86.252,65.914 86.189,66.554 87.536 C 66.995 88.465,68.278 89.636,73.844 94.186 C 74.469 94.698,75.378 95.483,75.863 95.930 C 76.348 96.378,76.871 96.744,77.026 96.744 C 77.182 96.744,78.314 97.529,79.543 98.488 C 80.771 99.448,83.151 101.070,84.832 102.093 C 86.512 103.116,87.891 104.227,87.897 104.562 C 87.902 104.897,88.107 105.048,88.351 104.897 C 88.595 104.746,90.741 105.739,93.119 107.103 C 95.496 108.468,98.119 109.859,98.948 110.195 C 99.776 110.531,100.319 111.023,100.155 111.289 C 99.985 111.563,100.081 111.633,100.377 111.450 C 100.664 111.273,101.690 111.529,102.658 112.020 C 105.733 113.580,113.579 116.674,118.146 118.128 C 120.573 118.901,122.977 119.723,123.488 119.956 C 124.000 120.188,126.721 120.842,129.535 121.409 C 132.349 121.976,134.965 122.547,135.349 122.680 C 136.342 123.022,136.653 123.073,144.651 124.221 C 158.125 126.156,179.965 125.596,191.395 123.024 C 192.930 122.678,195.442 122.251,196.977 122.074 C 198.512 121.897,199.872 121.608,200.000 121.432 C 200.260 121.075,204.016 120.062,206.512 119.676 C 207.407 119.538,208.380 119.232,208.673 118.997 C 208.967 118.762,209.681 118.478,210.259 118.367 C 214.875 117.478,232.958 109.228,238.456 105.503 C 239.525 104.779,240.624 104.186,240.898 104.186 C 241.171 104.186,241.395 103.991,241.395 103.752 C 241.395 103.514,241.784 103.195,242.258 103.045 C 243.660 102.600,246.512 99.463,246.512 98.367 C 246.512 96.103,242.980 94.880,240.285 96.210 C 238.420 97.131,232.318 99.484,229.767 100.266 C 228.360 100.697,225.463 101.652,223.328 102.388 C 221.193 103.124,217.635 104.150,215.421 104.668 C 213.207 105.187,210.663 105.808,209.767 106.048 C 207.561 106.641,199.114 108.222,195.116 108.790 C 193.326 109.045,190.500 109.469,188.836 109.733 C 184.407 110.436,166.615 111.237,161.689 110.955 C 159.353 110.821,155.244 110.594,152.558 110.450 C 147.383 110.173,144.247 109.792,134.884 108.299 C 128.517 107.284,125.738 106.752,123.256 106.072 C 122.360 105.827,120.058 105.276,118.140 104.847 C 111.693 103.407,99.606 99.408,92.326 96.306 C 91.814 96.088,90.244 95.449,88.837 94.886 C 86.674 94.020,74.114 87.849,69.535 85.402 C 67.808 84.480,67.681 84.479,66.777 85.382 " stroke="none" fill="#0f0f0f" fill-rule="evenodd"></path></g></svg>`;
    }

    function renderMiLogo() {
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="55" height="50" xml:space="preserve" viewBox="0 70 300 55" class="remote-logo miLogo"><path style="stroke:none;stroke-width:1;stroke-dasharray:none;stroke-linecap:butt;stroke-dashoffset:0;stroke-linejoin:miter;stroke-miterlimit:4;fill:#000;fill-rule:nonzero;opacity:1" transform="translate(99.01 41.62)" d="M204.546-41.122c1.759 0 3.223 1.417 3.223 3.161v189.386c0 1.715-1.464 3.139-3.223 3.139H163.05c-1.781 0-3.228-1.424-3.228-3.139V-37.961c0-1.743 1.446-3.161 3.228-3.161h41.496zm-180.078 0c31.303 0 64.033 1.435 80.176 17.589 15.871 15.897 17.59 47.549 17.656 78.286v96.671c0 1.715-1.446 3.139-3.219 3.139h-41.49c-1.777 0-3.229-1.424-3.229-3.139V53.09c-.044-17.167-1.031-34.81-9.884-43.692C56.858 1.757 42.639.007 27.853-.356h-75.21c-1.764 0-3.208 1.419-3.208 3.136v148.645c0 1.715-1.462 3.139-3.237 3.139h-41.516c-1.774 0-3.201-1.424-3.201-3.139V-37.961c0-1.743 1.426-3.161 3.201-3.161H24.468zm9.287 75.427c1.766 0 3.201 1.413 3.201 3.143v113.977c0 1.715-1.436 3.139-3.201 3.139H-9.829c-1.792 0-3.228-1.424-3.228-3.139V37.448c0-1.73 1.436-3.143 3.228-3.143h43.584z"></path></svg>`;
    }

    function renderXiaomiLogo() {
      return html`<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 281 46" width="281" height="46" xml:space="preserve" class="remote-logo xiaomiLogo"><path style="stroke:none;stroke-width:1;stroke-dasharray:none;stroke-linecap:butt;stroke-dashoffset:0;stroke-linejoin:miter;stroke-miterlimit:4;fill:#000;fill-rule:nonzero;opacity:1" transform="translate(.5 .5)" d="M158.12.7c-6.42 0-12.86.81-16.92 4.81s-5.64 10-5.64 17.38S137 36.16 141 40.16s10.66 5 17.08 5 12.86-.86 16.92-4.86 5.67-10 5.67-17.41-1.43-13.24-5.49-17.23S164.55.7 158.12.7zm9.75 32.82c-2.27 2.58-6.37 3-9.75 3s-7.47-.45-9.74-3S146 27.38 146 22.9s.15-7.95 2.41-10.54 5.9-3 9.74-3 7.48.45 9.74 3 2.41 6.05 2.41 10.54-.17 8.03-2.43 10.62zM69.1 1.49H60a.69.69 0 0 0-.7.69v41.49a.69.69 0 0 0 .7.69h9.1a.7.7 0 0 0 .7-.69V2.18a.7.7 0 0 0-.7-.69zM30.87 22.57 47 2.57a.66.66 0 0 0-.52-1.08H34.87a.9.9 0 0 0-.71.35L23.48 16 13.07 1.85a.9.9 0 0 0-.71-.36H.68a.66.66 0 0 0-.52 1.08l16.35 20.37L.14 43.29a.66.66 0 0 0 .52 1.07h11.68a.9.9 0 0 0 .72-.37L24 29.89 34.29 44a.91.91 0 0 0 .72.36h11.53a.66.66 0 0 0 .52-1.07zM252.33 4.64c-3.7-3.44-9.65-3.86-14.46-3.86-6.22 0-10.18 1.32-12.58 2.56h-1.67c-2.35-1.3-6.49-2.56-13-2.56-4.82 0-10.72.35-14.36 3.41-3 2.52-3.71 5.89-3.71 12.79v26.67a.7.7 0 0 0 .71.69h9.09a.7.7 0 0 0 .71-.69V21.7c0-4-.15-8.08.7-9.62.67-1.2 1.71-2.53 6.65-2.53 5.89 0 7.28.41 8.21 3a9.37 9.37 0 0 1 .38 2.56v28.54a.69.69 0 0 0 .7.69h9.09a.7.7 0 0 0 .71-.69V15.13a9.37 9.37 0 0 1 .38-2.56c.93-2.61 2.31-3 8.2-3 4.94 0 6 1.33 6.65 2.53.86 1.54.7 5.66.7 9.62v22a.7.7 0 0 0 .71.69h9.09a.7.7 0 0 0 .7-.69v-25c0-7.28-.23-10.95-3.6-14.08zM121.82 7.18C117.62 1.39 110-.36 102.14.06a56 56 0 0 0-15 2.66c-.88.33-.77 1.09-.78 1.55 0 1.53-.15 5.49-.14 7.1 0 .71.87 1 1.6.78a56.6 56.6 0 0 1 12.62-3c4.67-.38 11 0 12.76 2.65.83 1.26.87 3.19 1 5.16a78.77 78.77 0 0 0-11.51-.4c-3.35.15-9.69.44-13.5 2.44-3.06 1.63-4.86 3.11-5.82 5.87a17 17 0 0 0-.73 7.06c.56 5 2.28 7.43 4.61 9.15 3.67 2.72 8.31 4.15 17.89 3.94 12.75-.28 16.1-4.4 17.79-7.33 2.88-5 2.38-12.85 2.29-17.68-.03-2.01-.33-8.59-3.4-12.83zm-8.31 26.17c-1.2 2.53-5.49 2.92-8 3-4.7.21-8.16 0-10.4-1.08A5.12 5.12 0 0 1 92.4 31c-.08-1.63-.05-2.46.68-3.43 1.66-2.15 6-2.61 10.41-2.78a78.94 78.94 0 0 1 10.94.63c-.03 3.24-.24 6.5-.92 7.93zM280.17 1.49h-9.09a.7.7 0 0 0-.71.69v41.49a.7.7 0 0 0 .71.69h9.09a.7.7 0 0 0 .71-.69V2.18a.7.7 0 0 0-.71-.69z"/></svg>`;
    }

    // Render Amazon Fire Remote Style AF1
    // TODO: AF1 does not seem to scale properly
    if ( getDeviceAttribute('defaultRemoteStyle') == 'AF1' ) {
    return html`
      <ha-card>

      ${cssVars}

      <div class="remote-body">

          <div> </div>
          <div class="notch notchtall"> </div>
          <div style="display: inherit;"> ${drawDeviceName(this, this._config, 'top')} </div>

          <div> </div>
          <button class="remote-button keyboard-button" id="keyboard-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <div> </div>

          <div class="dpadContainer">
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="right-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="left-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="down-button" @pointerdown=${this.buttonDown}></button>
            </div>
            <button class="centerbutton" id="center-button" @pointerdown=${this.buttonDown}> </button>
          </div>

          <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:arrow-u-left-top"></ha-icon>
          </button>
          <button class="remote-button${homeStatusClass}" id="home-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:home-outline"></ha-icon>
          </button>
          <button class="remote-button" id="hamburger-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:menu"></ha-icon>
          </button>

          <button class="remote-button" id="rewind-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:rewind"></ha-icon>
          </button>
          <button class="remote-button${playingStatusClass}" id="playpause-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:play-pause"></ha-icon>
          </button>
          <button class="remote-button" id="fastforward-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:fast-forward"></ha-icon>
          </button>

          ${drawDeviceName(this, this._config, 'bottom')}
          ${renderAmazonNameWithArrowLogo()}
          ${drawFiremoteVersionNumber(this, this._config)}

      </div>

      </ha-card>
    `;
    }


    // Render Amazon Fire Remote Style AF2
    if ( getDeviceAttribute('defaultRemoteStyle') == 'AF2' ) {
    return html`
      <ha-card>

      ${cssVars}

      <div class="remote-body">

          <div> </div>
          <div class="notch notchtall"> </div>
          <div style="display: inherit;"> ${drawDeviceName(this, this._config, 'top')} </div>

          <div> </div>
          <button class="remote-button keyboard-button" id="keyboard-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <div> </div>

          <div class="dpadContainer">
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="right-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="left-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="down-button" @pointerdown=${this.buttonDown}></button>
            </div>
            <button class="centerbutton" id="center-button" @pointerdown=${this.buttonDown}> </button>
          </div>

          <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:arrow-u-left-top"></ha-icon>
          </button>
          <button class="remote-button${homeStatusClass}" id="home-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:home-outline"></ha-icon>
          </button>
          <button class="remote-button" id="hamburger-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:menu"></ha-icon>
          </button>

          <button class="remote-button" id="rewind-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:rewind"></ha-icon>
          </button>
          <button class="remote-button${playingStatusClass}" id="playpause-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:play-pause"></ha-icon>
          </button>
          <button class="remote-button" id="fastforward-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:fast-forward"></ha-icon>
          </button>

          <div> </div>
          <button class="remote-button" id="tv-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:television-classic"></ha-icon>
          </button>
          <div> </div>

          <div class="eightygap"> </div>
          <div> </div>
          <div> </div>

          ${drawDeviceName(this, this._config, 'bottom')}
          ${renderAmazonArrowlogo()}
          ${drawFiremoteVersionNumber(this, this._config)}

      </div>

      </ha-card>
    `;
    }


    // Render Amazon Fire Remote Style AF3
    if ( getDeviceAttribute('defaultRemoteStyle') == 'AF3' ) {
    return html`
      <ha-card>

      ${cssVars}

      <div class="remote-body">

          <button class="remote-button${powerStatusClass}" id="power-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
          <div class="notch"> </div>
          <div style="display: inherit;"> ${drawDeviceName(this, this._config, 'top')} </div>

          <div> </div>
          <button class="remote-button keyboard-button" id="keyboard-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <div> </div>

          <div class="dpadContainer">
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="right-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="left-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="down-button" @pointerdown=${this.buttonDown}></button>
            </div>
            <button class="centerbutton" id="center-button" @pointerdown=${this.buttonDown}> </button>
          </div>

          <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:arrow-u-left-top"></ha-icon>
          </button>
          <button class="remote-button${homeStatusClass}" id="home-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:home-outline"></ha-icon>
          </button>
          <button class="remote-button" id="hamburger-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:menu"></ha-icon>
          </button>

          <button class="remote-button" id="rewind-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:rewind"></ha-icon>
          </button>
          <button class="remote-button${playingStatusClass}" id="playpause-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:play-pause"></ha-icon>
          </button>
          <button class="remote-button" id="fastforward-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:fast-forward"></ha-icon>
          </button>

          <div> </div>
          <button class="remote-button round-top" id="volume-up-button" @pointerdown=${this.buttonDown}>
            +
          </button>
          <div> </div>

          <div> </div>
          <button class="remote-button round-bottom" id="volume-down-button" @pointerdown=${this.buttonDown}>
            &#x2013;
          </button>
          <div> </div>

          <div> </div>
          <button class="remote-button" id="mute-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:volume-mute"></ha-icon>
          </button>
          <div> </div>

          ${drawDeviceName(this, this._config, 'bottom')}
          ${renderAmazonArrowlogo()}
          ${drawFiremoteVersionNumber(this, this._config)}

      </div>

      </ha-card>
    `;
    }


    // Render Amazon Fire Remote Style AF4
    if ( getDeviceAttribute('defaultRemoteStyle') == 'AF4' ) {
    return html`
      <ha-card>

      ${cssVars}

      <div class="remote-body">

          <button class="remote-button${powerStatusClass}" id="power-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
          <div class="notch"> </div>
          <div style="display: inherit;"> ${drawDeviceName(this, this._config, 'top')} </div>

          <div> </div>
          <button class="remote-button keyboard-button teal" id="keyboard-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <div> </div>

          <div class="dpadContainer">
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="right-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="left-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="down-button" @pointerdown=${this.buttonDown}></button>
            </div>
            <button class="centerbutton" id="center-button" @pointerdown=${this.buttonDown}> </button>
          </div>

          <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:arrow-u-left-top"></ha-icon>
          </button>
          <button class="remote-button${homeStatusClass}" id="home-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:home-outline"></ha-icon>
          </button>
          <button class="remote-button" id="hamburger-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:menu"></ha-icon>
          </button>

          <button class="remote-button" id="rewind-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:rewind"></ha-icon>
          </button>
          <button class="remote-button${playingStatusClass}" id="playpause-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:play-pause"></ha-icon>
          </button>
          <button class="remote-button" id="fastforward-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:fast-forward"></ha-icon>
          </button>

          <button class="remote-button" id="mute-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:volume-mute"></ha-icon>
          </button>
          <button class="remote-button round-top" id="volume-up-button" @pointerdown=${this.buttonDown}>
            +
          </button>
          <button class="remote-button" id="tv-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:television-classic"></ha-icon>
          </button>


          <div> </div>
          <button class="remote-button round-bottom" id="volume-down-button" @pointerdown=${this.buttonDown}>
            &#x2013;
          </button>
          <div></div>

          ${drawAppLaunchButtons(this, this._config, 3, appButtonMax["AF4"])}
          ${drawDeviceName(this, this._config, 'bottom')}
          ${renderfiretvlogo()}
          ${drawFiremoteVersionNumber(this, this._config)}

        </div>

      </ha-card>
    `;
    }


    // Render Amazon Fire Remote Style AF5
    if ( getDeviceAttribute('defaultRemoteStyle') == 'AF5' ) {
    return html`
      <ha-card>

      ${cssVars}

      <div class="remote-body">

          <button class="remote-button${powerStatusClass}" id="power-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
          <div class="notch"> </div>
          <div style="display: inherit;"> ${drawDeviceName(this, this._config, 'top')} </div>

          <div> </div>
          <button class="remote-button keyboard-button teal" id="keyboard-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <div> </div>

          <div class="dpadContainer">
            <button class="centerbutton" id="center-button" @pointerdown=${this.buttonDown}> </button>
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="right-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="left-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="down-button" @pointerdown=${this.buttonDown}></button>
            </div>
          </div>

          <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:arrow-u-left-top"></ha-icon>
          </button>
          <button class="remote-button${homeStatusClass}" id="home-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:home-outline"></ha-icon>
          </button>
          <button class="remote-button" id="hamburger-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:menu"></ha-icon>
          </button>

          <button class="remote-button" id="rewind-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:rewind"></ha-icon>
          </button>
          <button class="remote-button${playingStatusClass}" id="playpause-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:play-pause"></ha-icon>
          </button>
          <button class="remote-button" id="fastforward-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:fast-forward"></ha-icon>
          </button>

          <button class="remote-button round-top" id="volume-up-button" @pointerdown=${this.buttonDown}>
            +
          </button>
          <div> </div>
          <button class="remote-button round-top" id="channel-up-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:menu-up"></ha-icon>
          </button>

          <button class="remote-button round-bottom" id="volume-down-button" @pointerdown=${this.buttonDown}>
            &#x2013;
          </button>
          <button class="remote-button" id="tv-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:television-classic"></ha-icon>
          </button>
          <button class="remote-button round-bottom" id="channel-down-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:menu-down"></ha-icon>
          </button>

          <button class="remote-button" id="mute-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:volume-mute"></ha-icon>
          </button>
          <button class="remote-button" id="settings-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:cog"></ha-icon>
          </button>
          <button class="remote-button" id="app-switch-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:file-multiple-outline"></ha-icon>
          </button>

          ${drawAppLaunchButtons(this, this._config, 3, appButtonMax["AF5"])}
          ${drawDeviceName(this, this._config, 'bottom')}
          ${renderfiretvlogo()}
          ${drawFiremoteVersionNumber(this, this._config)}

      </div>

      </ha-card>
    `;
    }


    // Render Amazon Fire Remote Style AF6
    if ( getDeviceAttribute('defaultRemoteStyle') == 'AF6' ) {
    return html`
      <ha-card>

      ${cssVars}

      <div class="remote-body AF6">

          ${drawDeviceName(this, this._config, 'top')}

          <button class="remote-button${powerStatusClass}" id="power-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
          <div class="notch"> </div>
          <button class="remote-button" id="headset-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:headphones"></ha-icon>
          </button>

          <div> </div>
          <button class="remote-button keyboard-button teal" id="keyboard-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <div> </div>

          <div class="dpadContainer">
            <button class="centerbutton" id="center-button" @pointerdown=${this.buttonDown}> </button>
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="right-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="left-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="down-button" @pointerdown=${this.buttonDown}></button>
            </div>
          </div>

          <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:arrow-u-left-top"></ha-icon>
          </button>
          <button class="remote-button${homeStatusClass}" id="home-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:home-outline"></ha-icon>
          </button>
          <button class="remote-button" id="hamburger-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:menu"></ha-icon>
          </button>

          <button class="remote-button" id="rewind-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:rewind"></ha-icon>
          </button>
          <button class="remote-button${playingStatusClass}" id="playpause-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:play-pause"></ha-icon>
          </button>
          <button class="remote-button" id="fastforward-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:fast-forward"></ha-icon>
          </button>

          <button class="remote-button round-top" id="volume-up-button" @pointerdown=${this.buttonDown}>
            +
          </button>
          <button class="remote-button" id="tv-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:television-classic"></ha-icon>
          </button>
          <button class="remote-button round-top" id="channel-up-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:menu-up"></ha-icon>
          </button>

          <button class="remote-button round-bottom" id="volume-down-button" @pointerdown=${this.buttonDown}>
            &#x2013;
          </button>
          <button class="remote-button" id="settings-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:cog"></ha-icon>
          </button>
          <button class="remote-button round-bottom" id="channel-down-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:menu-down"></ha-icon>
          </button>

          <button class="remote-button" id="mute-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:volume-mute"></ha-icon>
          </button>
          <button class="remote-button" id="programmable-one-button" @pointerdown=${this.buttonDown}>
            1
          </button>
          <button class="remote-button" id="programmable-two-button" @pointerdown=${this.buttonDown}>
            2
          </button>

          ${drawAppLaunchButtons(this, this._config, 3, appButtonMax["AF6"])}
          ${drawDeviceName(this, this._config, 'bottom')}
          ${renderfiretvlogo()}
          ${drawFiremoteVersionNumber(this, this._config)}

      </div>

      </ha-card>
    `;
    }

    // Render Amazon Fire Remote Style AFJTV or AFXF2
    function renderBrandLogo(style) {
      if (style == 'AFJTV') {
        return html`
                <div class="three-col-span jvcbrandlogo">
              <svg xmlns="http://www.w3.org/2000/svg" width="936" height="372" viewBox="0 0 936 372" stroke="none" stroke-linecap="round" stroke-linejoin="round" fill="#adadad" fill-rule="nonzero"><path d="M421 368h101L638 3h-91l-76 237L396 3h-92zm514-81v-61h-87v61H741V83h107v61h87V67h0c0-8-1-16-2-24-3-21-21-38-42-42-7-1-15-1-22-1H721c-8 0-15 0-22 1-21 4-39 21-42 42-1 8-2 16-2 24v236c0 8 1 16 2 24 3 22 21 38 42 42 7 1 14 1 22 1h148c7 0 15 0 22-1 21-4 39-20 42-42 1-8 2-16 2-24h0zM0 288v-70h86v70h108V3h86v301c0 8-1 15-2 23-3 22-21 39-42 42-7 1-15 1-22 1H66c-8 0-15 0-22-1-21-3-39-20-42-42-1-8-2-15-2-23h0zm0 0"/></svg>
          </div>`;
      }
      if (style == 'AFXF2') {
        return html`
          <div class="three-col-span xf2brandlogo">
            <svg xmlns="http://www.w3.org/2000/svg" width="969" height="577" viewBox="0 0 969 577" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><path d="M541 1c-19 0-38 3-50 14-13 12-17 30-17 53 0 22 4 39 16 51s32 15 51 15 39-2 51-14 17-30 17-52c0-23-5-40-17-52S560 1 541 1zm29 98c-6 8-19 9-29 9s-22-1-29-9c-7-7-7-18-7-31 0-14 0-24 7-32s18-9 29-9c12 0 23 1 29 9 7 8 8 18 8 32 0 13-1 24-8 31zM275 3h-27c-1 0-2 1-2 1s-1 1-1 2v124l1 1c0 1 1 1 2 1h27c1 0 2-1 2-2V6c0-2-1-3-2-3zM160 67l49-60V5c0-1-1-2-2-2h-35l-2 2-32 42-31-42c0-1-1-2-2-2H70c-1 0-1 1-2 2v2l49 61-49 61v2c1 0 1 1 2 1h35c1 0 2-1 2-1l33-43 31 43s1 1 2 1h34c1 0 2-1 2-1v-2zm663-54C812 3 794 1 780 1c-19 0-31 4-38 8h-5c-7-4-19-8-39-8-14 0-32 1-43 11-9 7-11 17-11 38v80l1 1 1 1h28l1-1c1 0 1-1 1-1V64c0-12-1-24 2-29 2-3 5-7 20-7 17 0 22 1 24 9 1 2 1 5 1 7v86l1 1s1 1 2 1h27l1-1c1 0 1-1 1-1V44c0-2 0-5 1-7 3-8 7-9 25-9 14 0 18 4 19 7 3 5 3 17 3 29v66 1c1 1 1 1 2 1h27c1 0 2-1 2-2V55c0-22-1-33-11-42zm-390 7C420 3 397-2 374-1c-16 1-31 3-45 8-3 1-2 3-3 5v21c0 2 3 3 5 2 12-4 25-7 38-9 14-1 33 0 38 8 2 4 2 10 3 16-12-1-23-2-35-1-10 0-29 1-40 7-9 5-15 9-17 17-3 7-3 14-3 22 2 15 7 22 14 27 11 8 25 12 54 12 38-1 48-13 53-22 9-15 7-39 7-53 0-6-1-26-10-39zm-25 79c-4 7-17 9-24 9-14 0-25 0-31-3-5-3-8-8-8-13-1-5-1-8 2-10 5-7 18-8 31-9 11 0 22 1 32 2 0 10 0 20-2 24zM907 3h-28l-1 1c-1 0-1 1-1 2v124s0 1 1 1c0 1 1 1 1 1h28s1 0 1-1l1-1V6c0-1-1-2-1-2l-1-1z" stroke="none" fill="#000" fill-rule="nonzero"/><path fill="none" d="M4 210h960" stroke-width="9"/><path d="M667 497c6 7-6 38-12 52-1 4 2 6 6 2 24-20 31-63 26-69s-48-12-74 7c-4 2-4 6 1 6 15-2 47-6 53 2m-19 21c-45 34-112 52-169 52-80 0-152-30-206-79-4-4-1-9 4-6 59 34 132 55 207 55 51 0 106-11 158-32 7-4 14 5 6 10m45-70c-1 1-3 0-4 0-1-1-2-3-3-5l-38-97c-1-1-1-2-2-2v-3c0-2 1-3 3-3h13c2 0 4 1 5 1 0 1 1 2 2 5l30 85 30-85c1-3 2-4 3-5 1 0 3-1 4-1h12c2 0 4 1 4 3 0 1-1 2-1 3 0 0-1 1-1 2l-38 97c-1 2-2 4-3 5-2 0-3 1-5 0zm-80 2c-21 0-31-10-31-31v-64h-16c-3 0-4-1-4-4v-6c0-1 0-2 1-3 0 0 2-1 4-1l15-2 3-27c1-3 2-4 5-4h9c3 0 4 1 4 4v26h29c2 0 4 2 4 5v8c0 3-2 4-4 4h-29v63c0 5 1 9 4 11 2 3 6 4 12 4 3 0 6-1 10-1 3-1 4-1 5-1s2 0 2 1c1 0 1 2 1 3v6c0 1 0 3-1 4s-2 2-4 2c-6 2-13 3-19 3m-104-66c0-1 1-3 1-6a32.21 32.21 0 0 0-7-20c-4-4-10-6-18-6-9 0-16 2-21 8-5 5-8 13-9 24zm-21 68c-17 0-31-5-40-15s-14-24-14-43 5-33 14-43 22-16 38-16c14 0 25 4 32 12s11 19 11 33c0 5 0 9-1 14 0 2-1 3-1 4h-4-68c0 13 4 22 9 28 6 6 15 9 28 9 4 0 8 0 12-1 5-1 10-2 15-4h3c1-1 1-1 2-1 2 0 3 2 3 4v6c0 2-1 3-1 4-1 1-2 2-4 3-5 2-10 3-15 4-6 1-12 2-19 2m-120-3c-3 0-4-2-4-5V343c0-3 1-4 4-4h10c1 0 2 0 3 1 1 0 2 1 2 3l1 12c4-4 8-8 11-10 7-5 15-7 23-7h5c3 0 4 2 4 4v12c0 2-1 4-4 4-1 0-2-1-4-1h-4c-11 0-21 4-30 11v76c0 3-1 5-4 5zm-49 0c-3 0-5-2-5-5V343c0-3 2-4 5-4h12c3 0 5 1 5 4v101c0 3-2 5-5 5zm6-130c-4 0-7-1-10-3-2-3-4-6-3-10 0-4 1-7 3-9 3-3 6-4 10-4s8 1 10 4c2 2 3 5 3 9 1 4-1 7-3 10-3 2-6 3-10 3m-80 130c-3 0-5-2-5-5v-88h-16c-3 0-4-2-4-5v-5c0-2 0-3 1-3 1-1 2-2 4-2l15-2v-18c0-24 12-36 35-36 6 0 11 1 18 2 1 1 2 1 3 2s1 3 1 5v6c0 2-1 4-3 4s-4-1-6-1-5-1-8-1c-7 0-11 2-14 4-3 3-4 7-4 13v20h29c3 0 5 1 5 4v8c0 3-2 5-5 5h-29v88c0 3-2 5-4 5z" stroke="none" fill="#000" fill-rule="nonzero"/></svg>
          </div>`;
      }
    }

    if ( getDeviceAttribute('defaultRemoteStyle') == 'AFJTV' ||  getDeviceAttribute('defaultRemoteStyle') == 'AFXF2') {
    return html`
      <ha-card>

      ${cssVars}

      <div class="remote-body ${getDeviceAttribute('defaultRemoteStyle')}">

          ${drawDeviceName(this, this._config, 'top')}

          <button class="remote-button${powerStatusClass}" id="power-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
          <div class="notch"> </div>
          <div></div>

          <div> </div>
          <button class="remote-button keyboard-button" id="keyboard-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <div> </div>

          <div class="dpadContainer">
            <button class="centerbutton" id="center-button" @pointerdown=${this.buttonDown}> </button>
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="right-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="left-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="down-button" @pointerdown=${this.buttonDown}></button>
            </div>
          </div>

          <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:arrow-u-left-top"></ha-icon>
          </button>
          <button class="remote-button${homeStatusClass}" id="home-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:home-outline"></ha-icon>
          </button>
          <button class="remote-button" id="hamburger-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:menu"></ha-icon>
          </button>

          <button class="remote-button" id="rewind-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:rewind"></ha-icon>
          </button>
          <button class="remote-button${playingStatusClass}" id="playpause-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:play-pause"></ha-icon>
          </button>
          <button class="remote-button" id="fastforward-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:fast-forward"></ha-icon>
          </button>

          <button class="remote-button round-top" id="volume-up-button" @pointerdown=${this.buttonDown}>
            +
          </button>
          <button class="remote-button" id="tv-button" @pointerdown=${this.buttonDown}>
            GUIDE
          </button>
          <button class="remote-button round-top" id="channel-up-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:menu-up"></ha-icon>
          </button>

          <button class="remote-button round-bottom" id="volume-down-button" @pointerdown=${this.buttonDown}>
            &#x2013;
          </button>
          <button class="remote-button" id="mute-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:volume-mute"></ha-icon>
          </button>
          <button class="remote-button round-bottom" id="channel-down-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:menu-down"></ha-icon>
          </button>

          <button class="remote-button digit-pad-button" id="num1-button" @pointerdown=${this.buttonDown}>1</button>
          <button class="remote-button digit-pad-button" id="num2-button" @pointerdown=${this.buttonDown}>2</button>
          <button class="remote-button digit-pad-button" id="num3-button" @pointerdown=${this.buttonDown}>3</button>

          <button class="remote-button digit-pad-button" id="num4-button" @pointerdown=${this.buttonDown}>4</button>
          <button class="remote-button digit-pad-button" id="num5-button" @pointerdown=${this.buttonDown}>5</button>
          <button class="remote-button digit-pad-button" id="num6-button" @pointerdown=${this.buttonDown}>6</button>

          <button class="remote-button digit-pad-button" id="num7-button" @pointerdown=${this.buttonDown}>7</button>
          <button class="remote-button digit-pad-button" id="num8-button" @pointerdown=${this.buttonDown}>8</button>
          <button class="remote-button digit-pad-button" id="num9-button" @pointerdown=${this.buttonDown}>9</button>

          <button class="remote-button digit-pad-button" id="subtitle-button" @pointerdown=${this.buttonDown}>SUBT</button>
          <button class="remote-button digit-pad-button" id="num0-button" @pointerdown=${this.buttonDown}>0</button>
          <button class="remote-button digit-pad-button" id="live-button" @pointerdown=${this.buttonDown}>LIVE</button>

          ${drawAppLaunchButtons(this, this._config, 3, appButtonMax["AFJTV"])}

          <div class="three-col-span colorButtons">
              <button class="remote-button" id="red-button" @pointerdown=${this.buttonDown}>
                <svg xmlns="http://www.w3.org/2000/svg" width="560" height="560" viewBox="0 0 560 560" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><circle cx="280" cy="280" fill="red" stroke="none" r="280"/></svg>
              </button>
              <button class="remote-button" id="green-button" @pointerdown=${this.buttonDown}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="560" height="560" viewBox="0 0 560 560" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><circle cx="280" cy="280" fill="green" stroke="none" r="280"/></svg>
              </button>
              <button class="remote-button" id="yellow-button" @pointerdown=${this.buttonDown}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="560" height="560" viewBox="0 0 560 560" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><circle cx="280" cy="280" fill="yellow" stroke="none" r="280"/></svg>
              </button>
              <button class="remote-button" id="blue-button" @pointerdown=${this.buttonDown}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="560" height="560" viewBox="0 0 560 560" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><circle cx="280" cy="280" fill="#1e90ff" stroke="none" r="280"/></svg>
              </button>
          </div>

          ${renderBrandLogo(getDeviceAttribute('defaultRemoteStyle'))}

          ${drawDeviceName(this, this._config, 'bottom')}
          ${drawFiremoteVersionNumber(this, this._config)}

      </div>

      </ha-card>
    `;
    }


    function renderHomaticsExtras(remote, style){
      if (style == 'HO1' || style == 'HO2') { 
        return 
      };
      return html`
          <button class="remote-button digit-pad-button" id="num1-button" @pointerdown=${remote.buttonDown}>
            <ha-icon icon="mdi:numeric-1"></ha-icon>
          </button>
          <button class="remote-button digit-pad-button" id="num2-button" @pointerdown=${remote.buttonDown}>
            <ha-icon icon="mdi:numeric-2"></ha-icon>
          </button>
          <button class="remote-button digit-pad-button" id="num3-button" @pointerdown=${remote.buttonDown}>
            <ha-icon icon="mdi:numeric-3"></ha-icon>
          </button>

          <button class="remote-button digit-pad-button" id="num4-button" @pointerdown=${remote.buttonDown}>
            <ha-icon icon="mdi:numeric-4"></ha-icon>
          </button>
          <button class="remote-button digit-pad-button" id="num5-button" @pointerdown=${remote.buttonDown}>
            <ha-icon icon="mdi:numeric-5"></ha-icon>
          </button>
          <button class="remote-button digit-pad-button" id="num6-button" @pointerdown=${remote.buttonDown}>
            <ha-icon icon="mdi:numeric-6"></ha-icon>
          </button>

          <button class="remote-button digit-pad-button" id="num7-button" @pointerdown=${remote.buttonDown}>
            <ha-icon icon="mdi:numeric-7"></ha-icon>
          </button>
          <button class="remote-button digit-pad-button" id="num8-button" @pointerdown=${remote.buttonDown}>
            <ha-icon icon="mdi:numeric-8"></ha-icon>
          </button>
          <button class="remote-button digit-pad-button" id="num9-button" @pointerdown=${remote.buttonDown}>
            <ha-icon icon="mdi:numeric-9"></ha-icon>
          </button>

          <button class="remote-button digit-pad-button" id="subtitle-button" @pointerdown=${remote.buttonDown}>
            <ha-icon icon="mdi:subtitles-outline"></ha-icon>
          </button>
          <button class="remote-button digit-pad-button" id="num0-button" @pointerdown=${remote.buttonDown}>
            <ha-icon icon="mdi:numeric-0"></ha-icon>
          </button>
          <button class="remote-button digit-pad-button" id="info-button" @pointerdown=${remote.buttonDown}>
            <ha-icon icon="mdi:information-slab-circle-outline"></ha-icon>
          </button>

          <div class="three-col-span colorButtons">
              <button class="remote-button" id="red-button" @pointerdown=${remote.buttonDown}>
                <svg xmlns="http://www.w3.org/2000/svg" width="560" height="560" viewBox="0 0 560 560" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><circle cx="280" cy="280" fill="red" stroke="none" r="280"/></svg>
              </button>
              <button class="remote-button" id="green-button" @pointerdown=${remote.buttonDown}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="560" height="560" viewBox="0 0 560 560" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><circle cx="280" cy="280" fill="green" stroke="none" r="280"/></svg>
              </button>
              <button class="remote-button" id="yellow-button" @pointerdown=${remote.buttonDown}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="560" height="560" viewBox="0 0 560 560" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><circle cx="280" cy="280" fill="yellow" stroke="none" r="280"/></svg>
              </button>
              <button class="remote-button" id="blue-button" @pointerdown=${remote.buttonDown}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="560" height="560" viewBox="0 0 560 560" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><circle cx="280" cy="280" fill="#1e90ff" stroke="none" r="280"/></svg>
              </button>
          </div>
      `;

    }

    // Render Homatics Remote Style HO1, HO2, HO3, HO4
    if ( ['HO1', 'HO2', 'HO3', 'HO4'].includes(getDeviceAttribute('defaultRemoteStyle'))) {
    return html`
      <ha-card>

      ${cssVars}

      <div class="remote-body homatics-remote-body ${getDeviceAttribute('defaultRemoteStyle')}">

          ${drawDeviceName(this, this._config, 'top')}

          <button class="remote-button${powerStatusClass}" id="power-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
          <div class="micNLight">
            <div class="activityLight"> </div>
            <div class="micHole"> </div>
          </div>
          <button class="remote-button" id="input-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:import"></ha-icon>
          </button>

          ${renderHomaticsExtras(this, getDeviceAttribute('defaultRemoteStyle'))}

          <button class="remote-button" id="bookmark-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:bookmark-outline"></ha-icon>
          </button>
          <button class="remote-button keyboard-button dark" id="keyboard-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <button class="remote-button" id="settings-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:cog-outline"></ha-icon>
          </button>

          <div class="dpadContainer">
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @pointerdown=${this.buttonDown}> </button>
              <button class="dpadbutton" id="right-button" @pointerdown=${this.buttonDown}> </button>
              <button class="dpadbutton" id="left-button" @pointerdown=${this.buttonDown}> </button>
              <button class="dpadbutton" id="down-button" @pointerdown=${this.buttonDown}> </button>
            </div>
            <button class="centerbutton" id="center-button" @pointerdown=${this.buttonDown}> </button>
          </div>

          <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
          <button class="remote-button dark${homeStatusClass}" id="home-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:home"></ha-icon>
          </button>
          <button class="remote-button" id="tv-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:television-classic"></ha-icon>
          </button>

          <div class="volumeChannelSection">
            <div id="volume-up-button-container">
              <button class="remote-button round-top" id="volume-up-button" @pointerdown=${this.buttonDown}>
                <ha-icon icon="mdi:plus"></ha-icon>
              </button>
              <svg id="voltext" xmlns="http://www.w3.org/2000/svg" width="128" height="52" viewBox="0 0 128.413 51.545" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><g fill="#000" stroke="none" fill-rule="nonzero"><path d="M38 1h6L25 50h-7L0 1h8l14 40L38 1z"/><use href="#DwyP"/><path d="M129 43v7H95V1h7v42h27z"/><use href="#DwyP"/></g><defs ><path id="DwyP" d="M90 26q0 10-4 17-6 9-18 9-12 0-17-9-5-7-5-17 0-10 5-17 6-9 17-9 12 0 18 9 4 7 4 17zm-6 0q0-8-3-13-5-8-13-8-8 0-12 8-3 5-3 13 0 7 3 13 4 7 12 7 8 0 12-7 4-6 4-13z"/></defs></svg>
            </div>
            <div> </div>
            <div id="channel-up-button-container">
              <button class="remote-button round-top" id="channel-up-button" @pointerdown=${this.buttonDown}>
                <ha-icon icon="mdi:chevron-up"></ha-icon>
              </button>
              <svg id="chtext" xmlns="http://www.w3.org/2000/svg" width="85" height="52" viewBox="0 0 85.475 51.61" stroke="none" stroke-linecap="round" stroke-linejoin="round" fill="#000" fill-rule="nonzero"><path d="M36 40l4 4q-3 3-7 5-5 3-10 3-13 0-18-9-5-7-5-17Q0 15 5 9q5-9 18-9 5 0 10 2 4 2 7 5l-4 5q-6-7-13-7-9 0-13 8-3 5-3 13 0 8 3 13 4 7 13 7 7 0 13-6zM86 1v49h-7V29H57v21h-7V1h7v21h22V1h7z"/></svg>
            </div>
            <button class="remote-button round-bottom" id="volume-down-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:minus"></ha-icon>
            </button>
            <button class="remote-button" id="mute-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:volume-mute"></ha-icon>
            </button>
            <svg id="soundeqtext" xmlns="http://www.w3.org/2000/svg" width="317" height="60" viewBox="0 0 316.555 59.605" stroke="none" stroke-linecap="round" stroke-linejoin="round" fill="#000" fill-rule="nonzero"><path d="M34 37q0 7-4 11-5 4-13 4-5 0-9-3-5-2-8-5l4-4q7 6 14 6 4 0 7-2 2-3 2-6 0-3-2-5-2-2-6-3-1-1-5-3-6-2-8-5-4-4-4-9Q2 7 7 3q4-3 12-3 4 0 8 2 4 2 7 5l-4 4q-6-6-13-6-3 0-6 3-2 2-2 5 0 5 8 8 2 1 6 3 5 2 8 5 3 3 3 8zm48-11q0 10-4 17-6 9-18 9-12 0-17-9-5-7-5-17 0-10 5-17 6-9 17-9 12 0 18 9 4 7 4 17zm-6 0q0-8-3-13-5-8-13-8-8 0-12 8-3 5-3 13 0 7 3 13 4 7 12 7 8 0 12-7 4-6 4-13zm49-25v31q0 19-18 19-11 0-16-5-4-4-4-13V1h7v31q0 7 2 10 3 4 11 4 7 0 10-5 2-4 2-11V1h6zm44 0v49h-7l-24-38v3 35h-6V1h7l24 37v-2V1h6zm47 24q0 25-25 25h-15V1h14q15 0 21 7 5 5 5 17zm-7 1q0-10-3-14-4-6-15-6h-8v38h8q10 0 15-5 3-5 3-13zm60 18v6h-33V1h29v6h-22v14h20v6h-20v17h26zm47-18q0 19-15 25 6 3 10 3 2 0 3-1v6q-1 1-3 1-12 0-19-8-11-1-16-10-4-7-4-16 0-10 5-17 6-9 17-9 12 0 18 9 4 7 4 17zm-6 0q0-8-3-13-5-8-13-8-8 0-12 8-3 5-3 13 0 7 3 13 4 7 12 7 8 0 13-7 3-6 3-13z"/></svg>
            <button class="remote-button round-bottom" id="channel-down-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </button>
          </div>

          ${drawAppLaunchButtons(this, this._config, 3, appButtonMax["ON1"])}

          <div class="homaticsLogo">
            <svg xmlns="http://www.w3.org/2000/svg" width="590" height="289" viewBox="0 0 590 289" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="none" fill-rule="evenodd" stroke-width="18"><path d="M99 272H9V157L154 17l143 140M152 277V160l73-73m-21 188h185"/><path d="M247 65l50-48 70 70-70 70v118"/><path d="M439 275l-2-116-73-74m25-23l50-47 140 142v115h-90"/></svg>
          </div>


          ${drawDeviceName(this, this._config, 'bottom')}
          ${drawFiremoteVersionNumber(this, this._config)}

      </div>

      </ha-card>
    `;
    }



    // Render NVIDIA Shield Remote Style NS1
    if ( getDeviceAttribute('defaultRemoteStyle') == 'NS1' ) {
    return html`
      <ha-card>

      ${cssVars}

      <div class="shield-remote-body ns1-body">

          <div class="shieldNotch"> </div>

          <div class="two-col-span"> ${drawDeviceName(this, this._config, 'top')} </div>

          <div class="dpadContainer shieldDpad">
            <button class="centerbutton centerbuttonShield" id="center-button" @pointerdown=${this.buttonDown}> </button>
            <div class="directionButtonContainer">
              <button class="dpadbutton dpadbuttonShield" id="up-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton dpadbuttonShield" id="right-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton dpadbuttonShield" id="left-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton dpadbuttonShield" id="down-button" @pointerdown=${this.buttonDown}></button>
            </div>
          </div>


          <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:menu-left-outline"></ha-icon>
          </button>
          <button class="remote-button${homeStatusClass}" id="home-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:circle-outline"></ha-icon>
          </button>

          <div class="two-col-span">
            <button class="remote-button keyboard-button" id="keyboard-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:keyboard-outline"></ha-icon>
            </button>
          </div>

          <div class="ns1-wings">
            <div id="wingL"> </div>
            <div id="ns1spine">
              <button class="ns1volume" id="volume-up-button" @pointerdown=${this.buttonDown}></button>
              <button class="ns1volume" id="volume-down-button" @pointerdown=${this.buttonDown}></button>
            </div>
            <div id="wingR"> </div>
          </div>

          ${drawDeviceName(this, this._config, 'bottom')}
          ${drawFiremoteVersionNumber(this, this._config)}

      </div>

      </ha-card>
    `;
    }


    // Render NVIDIA Shield Remote Style NS2
    if ( getDeviceAttribute('defaultRemoteStyle') == 'NS2' ) {
    return html`
      <ha-card>

      ${cssVars}

        <div class="shield-remote-body">

          <div class="shieldNotch notchtall"> </div>

          <div class="two-col-span"> ${drawDeviceName(this, this._config, 'top')} </div>

          <button class="remote-button${powerStatusClass}" id="power-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
          <button class="remote-button" id="hamburger-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:menu"></ha-icon>
          </button>


          <div class="dpadContainer shieldDpad">
            <button class="centerbutton centerbuttonShield" id="center-button" @pointerdown=${this.buttonDown}> </button>
            <div class="directionButtonContainer">
              <button class="dpadbutton dpadbuttonShield" id="up-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton dpadbuttonShield" id="right-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton dpadbuttonShield" id="left-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton dpadbuttonShield" id="down-button" @pointerdown=${this.buttonDown}></button>
            </div>
          </div>


          <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:menu-left"></ha-icon>
          </button>
          <button class="remote-button${homeStatusClass}" id="home-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:circle"></ha-icon>
          </button>

          <button class="remote-button" id="fastforward-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:fast-forward"></ha-icon>
          </button>
          <button class="remote-button keyboard-button" id="keyboard-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>

          <button class="remote-button${playingStatusClass}" id="playpause-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:play-pause"></ha-icon>
          </button>
          <button class="remote-button" id="volume-up-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:volume-high"></ha-icon>
          </button>

          <button class="remote-button" id="rewind-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:rewind"></ha-icon>
          </button>
          <button class="remote-button" id="volume-down-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:volume-medium"></ha-icon>
          </button>

          ${drawAppLaunchButtons(this, this._config, 2, appButtonMax["NS2"])}
          ${drawDeviceName(this, this._config, 'bottom')}
          ${drawFiremoteVersionNumber(this, this._config)}

        </div>

      </ha-card>
    `;
    }


    // Render onn. remote style 1
    if ( getDeviceAttribute('defaultRemoteStyle') == 'ON1' ) {
    return html`
      <ha-card>

      ${cssVars}

      <div class="remote-body ON1">

          ${drawDeviceName(this, this._config, 'top')}

          <button class="remote-button${powerStatusClass}" id="power-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
          <div class="micNLight">
            <div class="activityLight"> </div>
            <div class="micHole"> </div>
          </div>
          <button class="remote-button" id="input-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:import"></ha-icon>
          </button>

          <button class="remote-button" id="profile-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:account"></ha-icon>
          </button>
          <button class="remote-button keyboard-button dark" id="keyboard-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <button class="remote-button" id="settings-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:cog"></ha-icon>
          </button>

          <div class="dpadContainer">
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @pointerdown=${this.buttonDown}> </button>
              <button class="dpadbutton" id="right-button" @pointerdown=${this.buttonDown}> </button>
              <button class="dpadbutton" id="left-button" @pointerdown=${this.buttonDown}> </button>
              <button class="dpadbutton" id="down-button" @pointerdown=${this.buttonDown}> </button>
            </div>
            <button class="centerbutton" id="center-button" @pointerdown=${this.buttonDown}> </button>
          </div>

          <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
          <button class="remote-button dark${homeStatusClass}" id="home-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:home"></ha-icon>
          </button>
          <button class="remote-button" id="tv-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:television-classic"></ha-icon>
          </button>

          <div class="volumeChannelSection">
            <button class="remote-button round-top" id="volume-up-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
            <div> </div>
            <button class="remote-button round-top" id="channel-up-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:chevron-up"></ha-icon>
            </button>

            <button class="remote-button round-bottom" id="volume-down-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:minus"></ha-icon>
            </button>
            <button class="remote-button" id="mute-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:volume-mute"></ha-icon>
            </button>
            <button class="remote-button round-bottom" id="channel-down-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </button>
          </div>

          ${drawAppLaunchButtons(this, this._config, 3, appButtonMax["ON1"])}

          <div class="onnLogo">
            <svg xmlns="http://www.w3.org/2000/svg" width="1667" height="465" viewBox="0 0 1667 465" stroke="none" stroke-linecap="round" stroke-linejoin="round" fill="#393939" fill-rule="nonzero"><path d="M237 0C106 0 0 104 0 232s106 232 237 232 237-104 237-232S368 0 237 0zm0 325c-50 0-91-42-91-93s41-93 91-93c51 0 92 42 92 93s-41 93-92 93zm711-152v277H801V207v-1-1c-1-37-28-67-62-67h-8c-38 0-70 30-70 68v1 243H514V15h147v36c14-15 31-27 49-36 19-8 39-13 60-13h22c20 0 41 4 60 13 56 26 96 87 96 158zm489 0v277h-147V207v-1-1c-1-37-28-67-62-67h-8c-38 0-70 30-70 68v1 243h-147V15h147v36c14-15 31-27 49-36 19-8 39-13 60-13h22c20 0 41 4 60 13 56 26 96 87 96 158zm44 199c0-50 41-91 93-91 51 0 92 41 92 91s-41 91-92 91c-52 0-93-41-93-91z"/></svg>
          </div>

          ${drawDeviceName(this, this._config, 'bottom')}
          ${drawFiremoteVersionNumber(this, this._config)}

      </div>

      </ha-card>
    `;
    }


    // Render onn. remote style 2
    if ( getDeviceAttribute('defaultRemoteStyle') == 'ON2' ) {
    return html`
      <ha-card>

      ${cssVars}

      <div class="remote-body ON2">

          ${drawDeviceName(this, this._config, 'top')}

          <button class="remote-button${powerStatusClass}" id="power-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
          <div class="micNLight">
            <div class="activityLight"> </div>
            <div class="micHole"> </div>
          </div>
          <button class="remote-button" id="magic-star-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:star"></ha-icon>
          </button>

          <button class="remote-button" id="profile-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:account"></ha-icon>
          </button>
          <button class="remote-button keyboard-button light" id="keyboard-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <button class="remote-button" id="settings-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:cog"></ha-icon>
          </button>

          <div class="dpadContainer">
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @pointerdown=${this.buttonDown}> </button>
              <button class="dpadbutton" id="right-button" @pointerdown=${this.buttonDown}> </button>
              <button class="dpadbutton" id="left-button" @pointerdown=${this.buttonDown}> </button>
              <button class="dpadbutton" id="down-button" @pointerdown=${this.buttonDown}> </button>
            </div>
            <button class="centerbutton" id="center-button" @pointerdown=${this.buttonDown}> </button>
          </div>

          <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
          <button class="remote-button light${homeStatusClass}" id="home-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:home"></ha-icon>
          </button>
          <button class="remote-button" id="tv-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:television-classic"></ha-icon>
          </button>

          <div class="volumeChannelSection">
            <button class="remote-button round-top" id="volume-up-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
            <div> </div>
            <button class="remote-button round-top" id="channel-up-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:chevron-up"></ha-icon>
            </button>

            <button class="remote-button round-bottom" id="volume-down-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:minus"></ha-icon>
            </button>
            <button class="remote-button" id="mute-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:volume-mute"></ha-icon>
            </button>
            <button class="remote-button round-bottom" id="channel-down-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </button>
          </div>

          ${drawAppLaunchButtons(this, this._config, 3, appButtonMax["ON2"])}

          <div class="onnLogo">
            <svg xmlns="http://www.w3.org/2000/svg" width="1667" height="465" viewBox="0 0 1667 465" stroke="none" stroke-linecap="round" stroke-linejoin="round" fill="#393939" fill-rule="nonzero"><path d="M237 0C106 0 0 104 0 232s106 232 237 232 237-104 237-232S368 0 237 0zm0 325c-50 0-91-42-91-93s41-93 91-93c51 0 92 42 92 93s-41 93-92 93zm711-152v277H801V207v-1-1c-1-37-28-67-62-67h-8c-38 0-70 30-70 68v1 243H514V15h147v36c14-15 31-27 49-36 19-8 39-13 60-13h22c20 0 41 4 60 13 56 26 96 87 96 158zm489 0v277h-147V207v-1-1c-1-37-28-67-62-67h-8c-38 0-70 30-70 68v1 243h-147V15h147v36c14-15 31-27 49-36 19-8 39-13 60-13h22c20 0 41 4 60 13 56 26 96 87 96 158zm44 199c0-50 41-91 93-91 51 0 92 41 92 91s-41 91-92 91c-52 0-93-41-93-91z"/></svg>
          </div>

          ${drawDeviceName(this, this._config, 'bottom')}
          ${drawFiremoteVersionNumber(this, this._config)}

      </div>

      </ha-card>
    `;
    }


    function renderRokuPowerRow(remote, style){
      if(style=='RVR') {
        return html`
            <div class="powerRow">
              <div class="micRow"> </div>
              <button class="remote-button${powerStatusClass}" id="power-button" @pointerdown=${remote.buttonDown}>
                <ha-icon icon="mdi:power"></ha-icon>
              </button>
              <div> </div>
            </div>`;
      }
      else {
        return html`
            <div class="powerRow">
              <button class="remote-button${powerStatusClass}" id="power-button" @pointerdown=${remote.buttonDown}>
                <ha-icon icon="mdi:power"></ha-icon>
              </button>
            </div>`;
      }
    }

    function renderRokuDPad(remote) {
      return html`
          <div class="rokuDPadContainer">
              <div> </div>
              <button id="up-button" @pointerdown=${remote.buttonDown}>
                  <ha-icon icon="mdi:chevron-up"></ha-icon>
              </button>
              <div> </div>
              <button id="left-button" @pointerdown=${remote.buttonDown}>
                  <ha-icon icon="mdi:chevron-left"></ha-icon>
              </button>
              <button id="center-button" @pointerdown=${remote.buttonDown}>
                <div class="okCircle">
                    OK
                </div>
              </button>
              <button id="right-button" @pointerdown=${remote.buttonDown}>
                  <ha-icon icon="mdi:chevron-right"></ha-icon>
              </button>
              <div> </div>
              <button id="down-button" @pointerdown=${remote.buttonDown}>
                  <ha-icon icon="mdi:chevron-down"></ha-icon>
              </button>
              <div> </div>
          </div>`;
    }

    function renderRokuBackHomeRow(remote) {
      return html`
          <div class="backHomeRow">
            <button class="remote-button" id="back-button" @pointerdown=${remote.buttonDown}>
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </button>
            <button class="remote-button${homeStatusClass}" id="home-button" @pointerdown=${remote.buttonDown}>
              <ha-icon icon="mdi:home-outline"></ha-icon>
            </button>
          </div>`;
    }

    function renderRokuReplayOptionsRow(remote, style) {
      var middleButton = html `<button class="remote-button" id="keyboard-button" @pointerdown=${remote.buttonDown}>
                                <ha-icon icon="mdi:keyboard-outline"></ha-icon>
                              </button>`;
      if (style=='RHR'|| style=='RWR') {
        var middleButton = html `<button class="remote-button" id="sleep-button" @pointerdown=${remote.buttonDown}>
                                <ha-icon icon="mdi:moon-waxing-crescent"></ha-icon>
                              </button>`;
      }
      if (style=='RSR' || style=='RTR') { middleButton = '' };
      return html`
          <div class="replayVoiceOptionsRow">
            <button class="remote-button" id="replay-button" @pointerdown=${remote.buttonDown}>
              <ha-icon icon="mdi:restore"></ha-icon>
            </button>
            ${middleButton}
            <button class="remote-button" id="options-button" @pointerdown=${remote.buttonDown}>
              <ha-icon icon="mdi:asterisk"></ha-icon>
            </button>
          </div>`;
    }

    function renderRokuScrubRow(remote) {
      return html`
          <div class="scrubRow">
            <button class="remote-button" id="rewind-button" @pointerdown=${remote.buttonDown}>
              <ha-icon icon="mdi:rewind"></ha-icon>
            </button>
            <button class="remote-button${playingStatusClass}" id="playpause-button" @pointerdown=${remote.buttonDown}>
              <ha-icon icon="mdi:play-pause"></ha-icon>
            </button>
            <button class="remote-button" id="fastforward-button" @pointerdown=${remote.buttonDown}>
              <ha-icon icon="mdi:fast-forward"></ha-icon>
            </button>
          </div>`;
    }

    function renderRokuTag() {
      return html`<div class="rokuTag">
            <svg xmlns="http://www.w3.org/2000/svg" width="954" height="298" viewBox="0 0 954 298" stroke="none" stroke-linecap="round" stroke-linejoin="round" fill="#adadad" fill-rule="nonzero"><path d="M259.3 291.2h-88l-70-97H77.7v97H0V0h111.2c64 0 116.5 43.6 116.5 97.3 0 32.7-20 62-50.6 79.8l82.2 114.2M150 97.2c.1-13-5-25.3-14-34.5-9-9-21.5-14.3-34.4-14.4h-24v97.4h24c26.7-.1 48.3-21.8 48.4-48.5z"/><path d="M466.4 177a119 119 0 0 1-203.3 85.2c-34.2-34-44.6-85.3-26.2-130A119 119 0 0 1 431.3 93a119 119 0 0 1 35.1 84.1M347 114.7c-20.6 0-38 28-38 62.4 0 34.5 17.4 62.4 38 62.4 21 0 38.4-28 38.4-62.4S368 114.7 347 114.7zm301.6-51.5l-89.4 89.5V63h-77.7v228h77.7v-92.5l93.4 92.5h97.6L631.6 172.3 730 74v135.5c0 45 27 86.3 95 86.3a108 108 0 0 0 76.3-34.8l35 30h16.5V63h-77.5v147.6c-8.7 15.3-21 25-39.7 25-19.2 0-28-11.4-28-47.6V63z"/></svg></div>`;
      }

    // Render Roku Hisense Remote
    if ( getDeviceAttribute('defaultRemoteStyle') == 'RHR' ) {
    return html`
      <ha-card>
      ${cssVars}
      <div class="roku-remote-body RHR">
          ${drawDeviceName(this, this._config, 'top')}
          ${renderRokuPowerRow(this, 'RHR')}
          ${renderRokuBackHomeRow(this)}
          ${renderRokuDPad(this)}
          ${renderRokuReplayOptionsRow(this, "RHR")}
          ${renderRokuScrubRow(this)}
          ${drawAppLaunchButtons(this, this._config, 'fill', appButtonMax["RHR"])}
          <div class="rokuBrandLogo">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1736" height="144" viewBox="0 0 1736 144" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><g fill="#b9b9b9" stroke="none"><path d="M1226 85c0 23-14 44-35 53-22 9-47 4-63-12-17-16-22-41-13-62 9-22 30-36 53-36 16 0 31 6 41 17 11 10 17 25 17 40m-58-30c-10 0-18 14-18 30 0 17 8 30 18 30s19-13 19-30c0-16-9-30-19-30zm145-25l-43 43V30h-37v110h37V95l45 45h47l-57-57 47-48v65c0 22 13 42 46 42 16 0 30-9 37-17l17 15h8V30h-38v71c-4 7-10 12-19 12s-13-5-13-23V30z" fill-rule="nonzero"/><path d="M1484 32h41v106h32V32h41V3l54 136h29l54-137h-35l-33 90-34-90h-149M917 71c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z"/><g fill-rule="nonzero"><path d="M1126 140h-43l-33-47h-12v47h-37V0h53c31 0 57 21 57 47 0 16-10 30-25 38l40 55m-53-93c0-6-2-12-7-17-4-4-10-7-16-7h-12v47h12c13 0 23-10 23-23zM158 1l-11 137h-43l5-61H48l-5 61H0L11 1h31c4 0 11 0 11 9l-3 39h61l4-48zm545 78c19 8 39 17 36 35-3 21-33 25-58 25-2 0-4-1-6-1-33-1-50-3-50-3l1-22s24 4 46 5c12 0 21-1 21-5 1-4-6-6-19-11l-11-5c-14-6-37-14-36-33s24-25 37-27c8-1 16-1 28-1 25 0 46 5 46 5l-2 21s-22-5-45-5c-14 0-19 1-20 4-1 4 7 7 17 12l15 6M210 1c7 0 9 3 9 9 0 2-2 17-2 17h-42l2-26h33m7 37l-8 100h-42l8-100z"/><path d="M574 72c0-14-10-14-14-14-11 0-25 2-25 2l-5 78h-39l6-96s31-4 55-5h9c10 0 17 1 18 1 15 1 36 3 34 33l-4 67h-40l5-66"/><use xlink:href="#oug9"/><use xlink:href="#oug9" x="-395"/><path d="M307 79l-15-7c-10-4-18-7-17-11 1-3 6-4 20-4 23 0 45 5 45 5l2-21s-21-5-46-5c-12 0-20 0-28 1-13 2-36 8-37 27s22 28 36 33l11 5c13 5 20 7 19 11 0 4-9 5-21 5-22-1-46-5-46-5l-1 22s17 2 50 3h6c25 0 55-3 58-24 3-19-17-27-36-35"/></g></g><defs ><path id="oug9" d="M874 96c8-48-34-58-44-59-4-1-8-1-12-1-45 0-67 28-69 51-2 21 6 52 72 52 24 0 39-3 46-5 1-5 2-14 3-21-3 1-23 5-44 5h-2c-30-1-36-15-36-22v-1zm-84-19c2-11 10-22 27-22 25 1 23 22 23 22z"/></defs></svg>
          </div>
          ${drawDeviceName(this, this._config, 'bottom')}
          ${drawFiremoteVersionNumber(this, this._config)}
      </div>
      </ha-card>
    `;
    }

    // Render Roku Simple Remote
    if ( getDeviceAttribute('defaultRemoteStyle') == 'RSR' ) {
    return html`
      <ha-card>
      ${cssVars}
      <div class="roku-remote-body RSR">
          ${drawDeviceName(this, this._config, 'top')}
          ${renderRokuBackHomeRow(this)}
          ${renderRokuDPad(this)}
          ${renderRokuReplayOptionsRow(this, 'RSR')}
          ${renderRokuScrubRow(this)}
          ${drawAppLaunchButtons(this, this._config, 'fill', appButtonMax["RSR"])}
          ${drawDeviceName(this, this._config, 'bottom')}
          ${renderRokuTag()}
          ${drawFiremoteVersionNumber(this, this._config)}
      </div>
      </ha-card>
    `;
    }

    // Render Roku TCL Remote
    if ( getDeviceAttribute('defaultRemoteStyle') == 'RTR' ) {
    return html`
      <ha-card>
      ${cssVars}
      <div class="roku-remote-body RTR">
          ${drawDeviceName(this, this._config, 'top')}
          ${renderRokuPowerRow(this, 'RTR')}
          ${renderRokuBackHomeRow(this)}
          ${renderRokuDPad(this)}
          ${renderRokuReplayOptionsRow(this, "RTR")}
          ${renderRokuScrubRow(this)}
          ${drawAppLaunchButtons(this, this._config, 1, appButtonMax["RTR"])}
          <div class="rokuBrandLogo">
              <svg xmlns="http://www.w3.org/2000/svg" width="1324" height="145" viewBox="0 0 1324 145" stroke="none" stroke-linecap="round" stroke-linejoin="round" fill="#b9b9b9" fill-rule="evenodd"><path d="M0 45h52v93h47V45h52V7H0v38zm242 66c-10 0-18-3-25-9-7-7-12-16-12-29v-2c0-13 5-23 12-29 7-7 15-10 25-10 26 0 31 15 33 25h41c-1-20-10-34-24-43-13-9-28-14-49-14-25 0-43 6-58 18-15 13-23 33-23 53v1c0 22 7 39 22 53 14 13 35 19 58 18 21 0 39-4 51-14 13-10 22-24 23-43h-41c-1 8-6 25-33 25m144-9V7h-45v131h118v-36h-73z" fill-rule="nonzero"/><path d="M1072 32h41v106h32V32h41V3l54 136h29l54-137h-35l-33 90-34-90h-149"/><g fill-rule="nonzero"><path d="M714 140h-43l-33-47h-12v47h-37V0h53c31 0 57 21 57 47 0 16-10 30-25 38l40 55m-53-93c0-6-2-12-7-17-4-4-10-7-16-7h-12v47h12c13 0 23-10 23-23z"/><path d="M814 85c0 23-14 44-35 53-22 9-47 4-63-12-17-16-22-41-13-62 9-22 30-36 53-36 16 0 31 6 41 17 11 10 17 25 17 40m-58-30c-10 0-18 14-18 30 0 17 8 30 18 30s19-13 19-30c0-16-9-30-19-30zm145-25l-43 43V30h-37v110h37V95l45 45h47l-57-57 47-48v65c0 22 13 42 46 42 16 0 30-9 37-17l17 15h8V30h-38v71c-4 7-10 12-19 12s-13-5-13-23V30z"/></g><path d="M505 71c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z"/></svg>
          </div>
          ${drawDeviceName(this, this._config, 'bottom')}
          ${drawFiremoteVersionNumber(this, this._config)}
      </div>
      </ha-card>
    `;
    }

    // Render Roku Westinghouse Remote
    if ( getDeviceAttribute('defaultRemoteStyle') == 'RWR' ) {
    return html`
      <ha-card>
      ${cssVars}
      <div class="roku-remote-body RWR">
          ${drawDeviceName(this, this._config, 'top')}
          ${renderRokuPowerRow(this, 'RWR')}
          ${renderRokuBackHomeRow(this)}
          ${renderRokuDPad(this)}
          ${renderRokuReplayOptionsRow(this, "RWR")}
          ${renderRokuScrubRow(this)}
          ${drawAppLaunchButtons(this, this._config, 'fill', appButtonMax["RWR"])}
          <div class="rokuBrandLogo">
              <svg xmlns="http://www.w3.org/2000/svg" width="996" height="448" viewBox="0 0 996 448" stroke="none" stroke-linecap="round" stroke-linejoin="round" fill="#b9b9b9" fill-rule="evenodd"><path d="M643 320h47v122h37V320h46v-33l62 156h33l62-157h-40l-38 103-39-103H643"/><g fill-rule="nonzero"><path d="M233 443h-49l-38-54h-14v54H90V283h61c35 0 65 24 65 54 0 18-12 34-29 43l46 63m-61-106c0-7-2-14-8-20-4-4-11-8-18-8h-14v54h14c15 0 26-11 26-26z"/><path d="M347 380c0 27-16 51-40 61-25 10-54 4-72-14-20-18-25-47-15-71 10-25 34-41 61-41 17 0 34 7 47 19 12 12 19 29 19 46m-66-34c-12 0-21 16-21 34 0 20 9 35 21 35 11 0 21-15 21-35 0-18-10-34-21-34zm166-29l-50 49v-49h-42v126h42v-51l52 51h54l-66-65 54-55v74c0 26 15 48 53 48 18 0 34-10 42-19l20 17h9V317h-44v82c-4 8-11 13-21 13-11 0-15-5-15-26v-69z"/></g><path d="M484 247c0-13 10-23 23-23s23 10 23 23-10 23-23 23-23-10-23-23z"/><path d="M374 1c6-2 13 0 16 5 3 6 1 13-4 16-7 4-16 2-19-5-3-6 1-14 7-16zM0 2h25c4 32 9 63 14 95L56 2h26l17 95 15-95h24l-25 151H89L69 48 50 153H26L0 2zm582 151V2h23v43c3-5 7-9 13-11s13-2 19 0c7 3 12 9 15 15 2 5 2 9 2 14v90h-22V68c0-5-1-10-4-13-4-4-10-3-15-2-5 2-8 8-8 13v87h-23zM317 14h20c1 7 0 14 1 21h17v20h-17v68c0 4 1 8 2 12 1 6 4 13 9 18h-24c-2-3-4-6-5-10-2-5-4-10-3-15-1-24 0-49 0-73h-52c-5 0-10 2-13 6-2 5-2 11 2 15 2 3 5 6 9 8 7 4 14 7 21 11 6 3 11 8 14 13 3 7 3 14 3 21-1 7-5 14-11 19-8 6-19 7-28 7-14-1-26-9-32-21-3-7-4-14-4-21h22c0 6 1 12 5 17s11 7 18 5c4-2 7-7 7-12s-4-9-9-12l-22-13c-5-4-10-8-14-13-4-7-5-15-4-23s6-16 13-20c7-5 16-7 25-7h50V14zm235 34c-1-7 3-14 10-15s14 5 14 12c-1 7-7 12-14 11-3-1-5-2-7-4 2 7 3 14 3 22s0 16-2 24c-1 6-4 12-9 17-5 4-12 6-19 7s-15 0-22-3v16h35c6 0 12 0 18 3 5 2 8 6 10 10 3 6 4 13 3 19s-4 12-9 16c-6 5-14 6-21 6h-31c-7-1-14-1-18-6-5-5-4-12-4-19 2-6 9-10 15-10-6-1-11-4-14-9-2-6-2-13 2-19 3-4 8-7 13-8-5-3-10-8-12-13-3-8-4-17-4-25s0-17 2-25c2-6 5-11 9-14 5-4 12-6 18-6 8-1 15-1 22 2 5 2 9 6 12 11m-32 5a10.85 10.85 0 0 0-8 8c-3 6-2 14-2 21 0 6 0 12 3 17 4 7 15 8 19 2 3-4 4-9 5-13 1-7 1-14 0-20-1-5-2-9-5-12-3-4-8-4-12-3m-14 100v18h36c3 0 6 0 9-1 5-3 6-11 1-14-3-2-7-3-10-3h-36zM168 34c12-2 24-1 34 6 9 7 12 19 13 30v27h-51v20c0 4 1 9 5 13 3 3 8 4 12 4 4-1 7-3 9-6 2-5 2-11 2-16h23c0 6 0 12-2 19-2 9-8 17-17 21s-21 4-31 2c-9-2-17-10-20-19-6-16-5-34-5-52 0-11 0-24 6-34 4-9 13-14 22-15m-2 24c-3 6-3 13-3 20h29c0-7 0-15-4-21-4-8-18-7-22 1zm274-24c7-2 14-2 20 2 9 4 14 13 15 22 1 5 1 10 1 16v79h-22V71c0-6-2-12-7-16-4-3-10-2-14 1s-6 9-6 15v82h-22V35h21v10c3-5 8-9 14-11zm257 0c11-2 24 0 32 9 7 6 10 16 10 25v53c0 7-1 14-5 20-3 5-8 9-13 11-8 3-15 4-23 3s-15-4-21-10c-5-5-8-13-8-21V72c0-8 1-16 5-23 5-9 14-14 23-15m3 20c-5 1-8 5-9 10-2 7-1 14-1 21v32c0 5 1 11 6 15 4 3 11 3 16 0s6-9 6-15V71c0-5-1-10-4-14-4-4-9-4-14-3zm141-3c5-11 17-17 28-18 9-1 19 2 26 8 8 8 12 19 12 30h-22c0-6-2-13-7-16-6-4-16-1-18 6-1 3-1 6 1 9s5 6 9 8c7 4 13 8 20 12 6 4 12 9 15 16 3 5 4 12 4 18 0 8-3 16-9 22-7 7-17 9-27 9-9 1-18-2-25-9-9-8-13-21-13-34h21c0 6 2 12 6 16 3 5 9 7 15 6s10-7 9-13c-1-5-5-9-9-12-8-5-16-9-23-14-4-2-6-4-9-7-8-10-9-26-4-37zm97-14c7-3 16-4 23-4 8 0 16 3 22 8 8 8 11 19 12 30v26h-51v21c1 4 2 9 5 12s8 4 12 4c4-1 7-3 9-6 2-5 2-11 2-16h23c0 6 0 12-1 17-2 8-6 14-12 19s-15 7-23 7c-10 0-21-2-28-10-4-5-7-12-8-18-4-17-3-35-3-53 0-8 1-17 5-25 3-5 8-9 13-12m8 21c-3 6-3 13-3 20h29c0-7 0-15-4-21-4-8-18-7-22 1zM368 36h22v117h-22V36zm385-1h22v83c0 4 0 9 3 13 3 3 7 4 12 4 4-1 8-4 9-8 3-6 3-13 3-19V35h21v118h-21v-10c-3 4-7 7-11 9-7 3-15 4-21 2s-10-6-12-11c-4-8-5-17-5-25V35z" fill-rule="nonzero"/></svg>
          </div>
          ${drawDeviceName(this, this._config, 'bottom')}
          ${drawFiremoteVersionNumber(this, this._config)}
      </div>
      </ha-card>
    `;
    }

    // Render Roku Voice Remote
    if ( getDeviceAttribute('defaultRemoteStyle') == 'RVR' ) {
    return html`
      <ha-card>
      ${cssVars}
      <div class="roku-remote-body RVR">
          ${drawDeviceName(this, this._config, 'top')}
          ${renderRokuPowerRow(this, 'RVR')}
          ${renderRokuBackHomeRow(this)}
          ${renderRokuDPad(this)}
          ${renderRokuReplayOptionsRow(this)}
          ${renderRokuScrubRow(this)}

          ${drawAppLaunchButtons(this, this._config, 'fill', appButtonMax["RVR"])}
          ${drawDeviceName(this, this._config, 'bottom')}
          ${renderRokuTag()}
          ${drawFiremoteVersionNumber(this, this._config)}
      </div>
      </ha-card>
    `;
    }

    // Render Roku Voice Remote Pro
    if ( getDeviceAttribute('defaultRemoteStyle') == 'RVRP' ) {
    return html`
      <ha-card>
      ${cssVars}
      <div class="roku-remote-body RVRP">
          ${drawDeviceName(this, this._config, 'top')}
          ${renderRokuPowerRow(this)}
          <div class="micRow"> </div>
          ${renderRokuBackHomeRow(this)}
          ${renderRokuDPad(this)}
          ${renderRokuReplayOptionsRow(this)}
          ${renderRokuScrubRow(this)}
          <div class="personalShortcutsRow">
            <button class="remote-button" id="programmable-one-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:numeric-1"></ha-icon>
            </button>
            <button class="remote-button" id="programmable-two-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:numeric-2"></ha-icon>
            </button>
          </div>
          ${drawAppLaunchButtons(this, this._config, 'fill', appButtonMax["RVRP"])}
          ${drawDeviceName(this, this._config, 'bottom')}
          ${renderRokuTag()}
          ${drawFiremoteVersionNumber(this, this._config)}
      </div>
      </ha-card>
    `;
    }


    // Render Xiaomi Remote 1
    if ( getDeviceAttribute('defaultRemoteStyle') == 'XM1' ) {
    return html`
      <ha-card>

      ${cssVars}

      <div class="remote-body XM2">
          ${drawDeviceName(this, this._config, 'top')}

          <div> </div>
          <button class="remote-button${powerStatusClass}" id="power-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
          <div> </div>

          <div> </div>
          <button class="remote-button keyboard-button" id="keyboard-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <div> </div>

          <div class="dpadContainer">
            <button class="centerbutton" id="center-button" @pointerdown=${this.buttonDown}> </button>
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="right-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="left-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="down-button" @pointerdown=${this.buttonDown}></button>
            </div>
          </div>

          <button class="remote-button${patchWallStatusClass}" id="patchwall-button" @pointerdown=${this.buttonDown}>
            <div class="mdiSubstituteIconWrapper">
              <svg class="mdiSubstitueIcon" xmlns="http://www.w3.org/2000/svg" width="850" height="850" viewBox="0 0 850 850" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><path d="M81.6 57.8C73.5 57.6 66 67.6 66 75l-.5 391.5c0 9.5 11 19.5 18.8 20.7-.3-.2 444.2.3 444.2.3 11-1.3 22.5-10 22.5-17.5l.5-395c0-9-4-18-19-18 .5-.4-447 .3-451.5.5m572.5-.5c-13.3 0-25 9-25 20v292c0 12 8 16 16 16h124c9 0 15-4 15-16V77c-1-10-8-20-20-20h-111m-.8 408c-23.2.2-20.7 2.7-20.7 55.2 0 55 2.5 50-25 50H473.5c-20 0-27.5 5-27.5 20v190c.5 12 12.5 20 38.6 19.7-1 .3 259 .3 259 .3 32.5 0 40-5 40-20v-297c0-13-5-18-22.5-18.5l-109.3.3M84 569.2c-14 0-18 6-18 18.5v192.5c5 30-7.5 20 270 20 20 0 30.5-7 30.5-19v-194c0-11-11-18-31-18h-258" stroke="none"/></svg>
            </div>
          </button>
          <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
          <button class="remote-button${homeStatusClass}" id="home-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:checkbox-blank-circle-outline"></ha-icon>
          </button>

          ${drawAppLaunchButtons(this, this._config, 3, appButtonMax["XM1"])}

          <div> </div>
          <button class="remote-button round-top" id="volume-up-button" @pointerdown=${this.buttonDown}>
            +
          </button>
          <div> </div>

          <div> </div>
          <button class="remote-button round-bottom" id="volume-down-button" @pointerdown=${this.buttonDown}>
            &#x2013;
          </button>
          <div> </div>

          ${drawDeviceName(this, this._config, 'bottom')}
          ${renderXiaomiLogo()}
          ${drawFiremoteVersionNumber(this, this._config)}

      </div>

      </ha-card>
    `;
    }


    // Render Xiaomi Mi Remote
    if ( getDeviceAttribute('defaultRemoteStyle') == 'XM2' ) {
    return html`
      <ha-card>

      ${cssVars}

      <div class="remote-body XM2">
          ${drawDeviceName(this, this._config, 'top')}

          <div> </div>
          <button class="remote-button${powerStatusClass}" id="power-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
          <div> </div>

          <div> </div>
          <button class="remote-button keyboard-button" id="keyboard-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <div> </div>

          <div class="dpadContainer">
            <button class="centerbutton" id="center-button" @pointerdown=${this.buttonDown}> </button>
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="right-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="left-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="down-button" @pointerdown=${this.buttonDown}></button>
            </div>
          </div>

          <button class="remote-button" id="apps-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:apps"></ha-icon>
          </button>
          <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
          <button class="remote-button${homeStatusClass}" id="home-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:checkbox-blank-circle-outline"></ha-icon>
          </button>

          ${drawAppLaunchButtons(this, this._config, 3, appButtonMax["XM2"])}

          <div> </div>
          <button class="remote-button round-top" id="volume-up-button" @pointerdown=${this.buttonDown}>
            +
          </button>
          <div> </div>

          <div> </div>
          <button class="remote-button round-bottom" id="volume-down-button" @pointerdown=${this.buttonDown}>
            &#x2013;
          </button>
          <div> </div>

          ${drawDeviceName(this, this._config, 'bottom')}
          ${renderMiLogo()}
          ${drawFiremoteVersionNumber(this, this._config)}

      </div>

      </ha-card>
    `;
    }


    // Render Chromecast 1, 2, or 3
    if ( ['CC1', 'CC2', 'CC3'].includes(getDeviceAttribute('defaultRemoteStyle'))) {
    return html`
      <ha-card>

      ${cssVars}

      <div class="chromecast-remote-body ${getDeviceAttribute('defaultRemoteStyle')}">
          ${drawDeviceName(this, this._config, 'top')}

          <div class="dpadContainer">
            <button class="centerbutton" id="center-button" @pointerdown=${this.buttonDown}> </button>
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="right-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="left-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="down-button" @pointerdown=${this.buttonDown}></button>
            </div>
          </div>

          <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
          <button class="remote-button keyboard-button" id="keyboard-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>


          <button class="remote-button${homeStatusClass}" id="home-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:home"></ha-icon>
          </button>
          <button class="remote-button" id="mute-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:volume-mute"></ha-icon>
          </button>

          ${drawMediaControlButtons(this, this._config)}


          ${drawAppLaunchButtons(this, this._config, 2, appButtonMax[getDeviceAttribute('defaultRemoteStyle')])}

          <div class="chromecastBottomIndentedRow">
            <button class="remote-button${powerStatusClass}" id="power-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:power"></ha-icon>
            </button>
            <div class="notch"> </div>
            <button class="remote-button" id="input-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:import"></ha-icon>
            </button>
          </div>

          <div class="chromecastVolumeRocker">
            <button class="remote-button" id="volume-down-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:volume-minus"></ha-icon>
            </button>
            <button class="remote-button" id="volume-up-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:volume-plus"></ha-icon>
            </button>
          </div>

          ${drawDeviceName(this, this._config, 'bottom')}
          ${drawFiremoteVersionNumber(this, this._config)}

      </div>

      </ha-card>
    `;
    }


    // Render Apple TV Remote - Style 1
    if ( getDeviceAttribute('defaultRemoteStyle') == 'AR1' ) {
    return html`
      <ha-card>

      ${cssVars}

      <div class="apple-remote-body AR1">
          ${drawDeviceName(this, this._config, 'top')}

          <div class="dpadContainer AR1Dpad">
            <button class="centerbutton" id="center-button" @pointerdown=${this.buttonDown}></button>
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="right-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="left-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="down-button" @pointerdown=${this.buttonDown}></button>
            </div>
          </div>


          <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
            MENU
          </button>
          <button class="remote-button${playingStatusClass}" id="playpause-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:play-pause"></ha-icon>
          </button>

          ${drawAppLaunchButtons(this, this._config, 2, appButtonMax["AR1"])}

          ${drawDeviceName(this, this._config, 'bottom')}
          ${drawFiremoteVersionNumber(this, this._config)}

      </div>

      </ha-card>
    `;
    }


    // Render Apple TV Remote - Style 2
    if ( getDeviceAttribute('defaultRemoteStyle') == 'AR2' ) {
    return html`
      <ha-card>

      ${cssVars}

      <div class="apple-remote-body AR2">
        <div class="AR2TopSection">
          ${drawDeviceName(this, this._config, 'top')}

          <div class="two-col-span apple-tv-top">
            <div></div>
            <div class="notch"></div>
            <div></div>
          </div>

          <div class="dpadContainer">
            <button class="centerbutton" id="center-button" @pointerdown=${this.buttonDown}>
              <ha-icon icon="mdi:checkbox-blank-circle"></ha-icon>
            </button>
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @pointerdown=${this.buttonDown}>
                <ha-icon icon="mdi:arrow-top-left"></ha-icon>
              </button>
              <button class="dpadbutton" id="right-button" @pointerdown=${this.buttonDown}>
                <ha-icon icon="mdi:arrow-top-right"></ha-icon>
              </button>
              <button class="dpadbutton" id="left-button" @pointerdown=${this.buttonDown}>
                <ha-icon icon="mdi:arrow-bottom-left"></ha-icon>
              </button>
              <button class="dpadbutton" id="down-button" @pointerdown=${this.buttonDown}>
                <ha-icon icon="mdi:arrow-bottom-right"></ha-icon>
              </button>
            </div>
          </div>

          <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
            MENU
          </button>
          <button class="remote-button" id="home-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:monitor"></ha-icon>
          </button>

        </div>
        <div class="AR2BottomSection">

          <button class="remote-button" id="search-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:magnify"></ha-icon>
          </button>
          <button class="remote-button round-top" id="volume-up-button" @pointerdown=${this.buttonDown}>
            +
          </button>


          <button class="remote-button" id="playpause-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:play-pause"></ha-icon>
          </button>
          <button class="remote-button round-bottom" id="volume-down-button" @pointerdown=${this.buttonDown}>
            &#x2013;
          </button>

          ${drawAppLaunchButtons(this, this._config, 2, appButtonMax["AR2"])}

          ${drawDeviceName(this, this._config, 'bottom')}
          ${drawFiremoteVersionNumber(this, this._config)}
        </div>

      </div>

      </ha-card>
    `;
    }


    // Render Apple TV Remote - Style 3
    if ( getDeviceAttribute('defaultRemoteStyle') == 'AR3' ) {
    return html`
      <ha-card>

      ${cssVars}

      <div class="apple-remote-body AR3">
          ${drawDeviceName(this, this._config, 'top')}

          <div class="two-col-span apple-tv-top">
            <div></div>
            <div class="notch"></div>
            <div class="right">
              <button class="remote-button${powerStatusClass}" id="power-button" @pointerdown=${this.buttonDown}>
                <ha-icon icon="mdi:power"></ha-icon>
              </button>
            </div>
          </div>

          <div class="dpadContainer">
            <button class="centerbutton type-button" id="center-button" @pointerdown=${this.buttonDown}></button>
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="right-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="left-button" @pointerdown=${this.buttonDown}></button>
              <button class="dpadbutton" id="down-button" @pointerdown=${this.buttonDown}></button>
            </div>
          </div>

          <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <button class="remote-button${homeStatusClass}" id="home-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:monitor"></ha-icon>
          </button>


          <button class="remote-button${playingStatusClass}" id="playpause-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:play-pause"></ha-icon>
          </button>
          <button class="remote-button round-top" id="volume-up-button" @pointerdown=${this.buttonDown}>
            +
          </button>


          <button class="remote-button" id="mute-button" @pointerdown=${this.buttonDown}>
            <ha-icon icon="mdi:volume-off"></ha-icon>
          </button>
          <button class="remote-button round-bottom" id="volume-down-button" @pointerdown=${this.buttonDown}>
            &#x2013;
          </button>

          ${drawAppLaunchButtons(this, this._config, 2, appButtonMax["AR3"])}

          ${drawDeviceName(this, this._config, 'bottom')}
          ${drawFiremoteVersionNumber(this, this._config)}

      </div>

      </ha-card>
    `;
    }


    // Render App Launcher 1
    if ( getDeviceAttribute('defaultRemoteStyle') == 'AL1' ) {
    return html`
      <ha-card>
        ${cssVars}
        <div class="remote-body AL1">
          ${drawDeviceName(this, this._config, 'top')}
          ${drawAppLaunchButtons(this, this._config, 'fill', appButtonMax["AL1"])}
          ${drawDeviceName(this, this._config, 'bottom')}
          ${drawFiremoteVersionNumber(this, this._config)}
        </div>
      </ha-card>
    `;
    }


    // Render App Launcher 2
    if ( getDeviceAttribute('defaultRemoteStyle') == 'AL2' ) {
      var lpb4icon = 'mdi:rewind';
      var lpb6icon = 'mdi:fast-forward';
      var rpb2icon = 'mdi:restart';
      var rpb2id = 'reboot-button';
      var hiddenclass = '';
      if(this._config.device_family == 'apple-tv') {
        var lpb4icon = 'mdi:skip-backward';
        var lpb6icon = 'mdi:skip-forward';
        var rpb2icon = 'mdi:magnify';
        var rpb2id = 'search-button';
        var hiddenclass = 'hidden';
      }

      // conditionally hide the app launcher section if no apps are selected
      var configuredAppLaunchButtons = 0;
      for(let i=1; i<=appmap.size; i++) {
        if(this._config["app_launch_"+i] && this._config["app_launch_"+i] != '') {
            configuredAppLaunchButtons++;
        }
      }
      var noAppsClass = '';
      if (configuredAppLaunchButtons==0){
        noAppsClass = 'noApps';
      }

      // conditionally hide the button frame sections and their backgrounds
      var rowClass = "row";
      if(this._config.hide_button_group_frame == true) {
        rowClass="row noframes";
      }

      // allow the dpad style to change for AL2 remotes
      function getDpad(caller, style='amazon-fire') {
        var dpadClass = '';
        switch(style) {
          case 'apple-tv-black':
            dpadClass = 'AR3 ';
            break;
          case 'apple-tv-silver':
            dpadClass = 'AR1 ';
            break;
          case 'chromecast':
            dpadClass = 'CC ';
            break;
          case 'xiaomi':
            dpadClass = 'XM ';
            break;
          case 'minimal':
            dpadClass = "minimal ";
            break;
        }
        if(style=='minimal'){
          return html`

              <div class="${dpadClass}dpadContainer">
                  <div> </div>
                  <button class="dpadbutton" id="up-button" @pointerdown=${caller.buttonDown}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="57" height="19" viewBox="0 0 57 19" stroke="#b3b3b3" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><path fill="none" d="M3 15Q23 3 28 3q5 0 25 12" stroke-width="6"/></svg>
                  </button>
                  <div> </div>
                  <button class="dpadbutton" id="left-button" @pointerdown=${caller.buttonDown}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="57" viewBox="0 0 19 57" stroke="#b3b3b3" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><path fill="none" d="M15 53Q3 33 3 28q0-5 12-25" stroke-width="6"/></svg>
                  </button>
                  <button class="centerbutton" id="center-button" @pointerdown=${caller.buttonDown}> </button>
                  <button class="dpadbutton" id="right-button" @pointerdown=${caller.buttonDown}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="57" viewBox="0 0 19 57" stroke="#b3b3b3" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><path fill="none" d="M3 3q12 20 12 25 0 5-12 25" stroke-width="6"/></svg>
                  </button>
                  <div> </div>
                  <button class="dpadbutton" id="down-button" @pointerdown=${caller.buttonDown}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="57" height="19" viewBox="0 0 57 19" stroke="#b3b3b3" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><path fill="none" d="M53 3Q33 15 28 15 23 15 3 3" stroke-width="6"/></svg>
                  </button>
                  <div> </div>
              </div>

          `;
        }
        else {
          return html`
              <div class="${dpadClass}dpadContainer">
                <button class="centerbutton" id="center-button" @pointerdown=${caller.buttonDown}> </button>
                <div class="directionButtonContainer">
                  <button class="dpadbutton" id="up-button" @pointerdown=${caller.buttonDown}></button>
                  <button class="dpadbutton" id="right-button" @pointerdown=${caller.buttonDown}></button>
                  <button class="dpadbutton" id="left-button" @pointerdown=${caller.buttonDown}></button>
                  <button class="dpadbutton" id="down-button" @pointerdown=${caller.buttonDown}></button>
                </div>
              </div>
          `;
        }
      }

      return html`
      <ha-card>
        ${cssVars}
        <div class="remote-body AL2">
          ${drawDeviceName(this, this._config, 'top')}
          ${drawAppLaunchButtons(this, this._config, 'fill', appButtonMax["AL2"])}

          <div class="ALControlsContainer ${noAppsClass}">

            <div class="left-pocket-controls">
              <div class="${rowClass}">
                <button class="remote-button${powerStatusClass}" id="power-button" @pointerdown=${this.buttonDown}>
                  <ha-icon icon="mdi:power"></ha-icon>
                </button>
                <button class="remote-button" id="back-button" @pointerdown=${this.buttonDown}>
                  <ha-icon icon="mdi:arrow-left"></ha-icon>
                </button>
                <button class="remote-button${homeStatusClass}" id="home-button" @pointerdown=${this.buttonDown}>
                  <ha-icon icon="mdi:home-outline"></ha-icon>
                </button>
              </div>
              <div class="${rowClass}">
                <button class="remote-button" id="rewind-button" @pointerdown=${this.buttonDown}>
                  <ha-icon icon="${lpb4icon}"></ha-icon>
                </button>
                <button class="remote-button${playingStatusClass}" id="playpause-button" @pointerdown=${this.buttonDown}>
                  <ha-icon icon="mdi:play-pause"></ha-icon>
                </button>
                <button class="remote-button" id="fastforward-button" @pointerdown=${this.buttonDown}>
                  <ha-icon icon="${lpb6icon}"></ha-icon>
                </button>
              </div>
            </div>

            <div class="center-pocket-controls">
              ${getDpad(this, this._config.dpad_style)}
            </div>

            <div class="right-pocket-controls">
              <div class="${rowClass}">
                <div class="volumeContainer">
                  <button class="remote-button round-top" id="volume-up-button" @pointerdown=${this.buttonDown}>
                    +
                  </button>
                  <button class="remote-button round-bottom" id="volume-down-button" @pointerdown=${this.buttonDown}>
                    &#x2013;
                  </button>
                </div>
                <div>
                  <button class="remote-button" id="${rpb2id}" @pointerdown=${this.buttonDown}>
                    <ha-icon icon="${rpb2icon}"></ha-icon>
                  </button>
                  <br>
                  <button class="remote-button" id="mute-button" @pointerdown=${this.buttonDown}>
                    <ha-icon icon="mdi:volume-mute"></ha-icon>
                  </button>
                </div>
                <div>
                  <button class="remote-button keyboard-button ${hiddenclass}" id="keyboard-button" @pointerdown=${this.buttonDown}>
                    <ha-icon icon="mdi:keyboard-outline"></ha-icon>
                  </button>
                  <br>
                  <button class="remote-button ${hiddenclass}" id="hamburger-button" @pointerdown=${this.buttonDown}>
                    <ha-icon icon="mdi:menu"></ha-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
          ${drawDeviceName(this, this._config, 'bottom')}
          ${drawFiremoteVersionNumber(this, this._config)}
        </div>
      </ha-card>
    `;
    }


  }



  // Firemote Button Click or Click + Hold Handler
  buttonDown(clicked) {

    // Ignore right clicks
    if (clicked.which === 3) {
      return;
    }

    // Inspect user prefs & setup click timer
    const _config = this._config;
    const _hass = this.hass;
    const deviceType = this._config.device_type;
    const deviceFamily = this._config.device_family;
    const entity = this._config.entity;
    const compatibility_mode = this._config.compatibility_mode || 'default';
    const overrides = this._config.button_overrides;
    const atvRemoteEntity = this._config.android_tv_remote_entity;
    const rokuRemoteEntity = this._config.roku_remote_entity;
    const activityLight = this.renderRoot.querySelector('.activityLight');
    const start = Date.now();
    const holdTime = 500;
    const buttonID = clicked.target.id;
    var pressedTarget = clicked.target;
    var timer = null;

    // Rebuild AppMap - allow hdmi inputs where appropriate & add configured custom launchers from YAML
    refreshAppMap(this._config, 4, 1, true);


    // Function for buttons that need overrides because HA integration support is lacking
    function unsupportedButton(){
      alert('"'+buttonID+"\"\n\nUse a button override to program this button\nhttps://github.com/PRProd/HA-Firemote/#button-overrides");
      return;
    }

    // Check for user set Associated Android TV Remote Integration entity
    var hasATVAssociation = true;
    if(atvRemoteEntity == '' || typeof atvRemoteEntity == 'undefined' || deviceFamily == 'amazon-fire' ) {
        hasATVAssociation = false;
    }

    // Choose event listener path for client android device
    var eventListenerBinPath = '';
    if(compatibility_mode == 'default' || compatibility_mode == 'strong' || compatibility_mode == '') {
        eventListenerBinPath = deviceAttributeQuery("defaultEventListenerBinPath", this._config);
    }
    else {
        var eventListenerBinPath = '/dev/input/'+compatibility_mode;
    }

    // Function to handle translations from English to the user's language
    const ha_language = this.hass.config.language;
    function translateToUsrLang(englishString) {
        var translatedString = englishString;
        if (typeof translationmap.get(ha_language) !== 'undefined'){
            if (typeof translationmap.get(ha_language)[sourceName] !== 'undefined'){
                translatedString = translationmap.get(ha_language)[englishString];
            }
        }
        return translatedString;
    }

    // Function: Assemble arguments for service calls
    function getCustomServiceArgs(def) {
        if((typeof def.action !== 'undefined' || typeof def.service !== 'undefined') && typeof def.target !== 'undefined') {
            var svcarray;
            if(typeof def.action !== 'undefined') {
              svcarray = def.action.split(".");
            }
            else {
              svcarray = def.service.split(".");
            }
            var data = Object;
            if(typeof def.data !== 'undefined') {
              var extraData = JSON.parse(JSON.stringify(def.data));
              var target = JSON.parse(JSON.stringify(def.target));
              data = Object.assign(target, extraData);
            }
            else {
              data = Object.assign(def.target);
            }
            return new Array(svcarray[0], svcarray[1], data);
        }
    };



    // Check for and handle button overrides before proceeding
    // No HOLD actions for button overrides are supported
    if(typeof overrides !== 'undefined' && overrides !== null) {
        if(typeof overrides[buttonID] !== 'undefined') {
            const overrideDef = overrides[buttonID];
            if(overrideDef !== null) {
              if(typeof overrideDef.script !== 'undefined') {
                // handle overrides via external script
                try{ _hass.callService("script", overrideDef.script, overrideDef.data) }
                catch { return; }
                fireEvent(this, 'haptic', 'light'); // haptic feedback on success
                return;
              }
              else if((typeof overrideDef.service !== 'undefined' || typeof overrideDef.action !== 'undefined') && typeof overrideDef.target !== 'undefined') {
                // handle overrides via yaml instructions
                var ServiceDetails = getCustomServiceArgs(overrideDef);
                try{ _hass.callService(ServiceDetails[0], ServiceDetails[1], ServiceDetails[2]) }
                catch { return; }
                fireEvent(this, 'haptic', 'light'); // haptic feedback on success
                return;
              }
            }
        }
    }


    // Handle custom launcher button clicks
    // No HOLD actions for custom launchers are supported
    var customLauncherIDPfx = new RegExp('customlauncher ')
    if(customLauncherIDPfx.test(buttonID)){
        var clickedButtonID = buttonID;
        const customLauncherKey = clickedButtonID.substr(0, clickedButtonID.indexOf("-button"));
        if(appmap.has(customLauncherKey)) {
            if(appmap.get(customLauncherKey).script) {
                try{ _hass.callService("script", appmap.get(customLauncherKey).script, appmap.get(customLauncherKey).data) }
                catch { return; }
                fireEvent(this, 'haptic', 'light');
                return;
            }
            else {
               var launcher = appmap.get(customLauncherKey);
               if(typeof launcher.friendlyName !== 'undefined') {
                 _config.custom_launchers.forEach(element => {
                   var name = launcher.friendlyName.substr(8);
                   if (name == element.friendly_name) {
                     var ServiceDetails = getCustomServiceArgs(element);
                     try{ _hass.callService(ServiceDetails[0], ServiceDetails[1], ServiceDetails[2]) }
                     catch { return; }
                     fireEvent(this, 'haptic', 'light');
                   }
                 });
                 return;
               }
            }
        }
    }


    // Handle Built-in App launcher buttons (existing in JSON map)
    // No HOLD actions for app launchers are supported
    const appkey = buttonID.substr(0, buttonID.indexOf("-button"));
    if(appmap.has(appkey)) {
      var familySpecificAppData = appmap.get(appkey)[deviceFamily];
      if(familySpecificAppData && (familySpecificAppData.adbLaunchCommand || familySpecificAppData.appName || familySpecificAppData.remoteCommand)) {
        var adbcommand = familySpecificAppData.adbLaunchCommand;
        var sourceName = familySpecificAppData.appName;
        var remoteCommand = familySpecificAppData.remoteCommand;
      }
      else {
        var adbcommand = appmap.get(appkey).adbLaunchCommand;
        var sourceName = appmap.get(appkey).appName;
        var remoteCommand = appmap.get(appkey).remoteCommand
      }
      sourceName = translateToUsrLang(sourceName);
      fireEvent(this, 'haptic', 'light');
      if (typeof remoteCommand != 'undefined' && ['apple-tv', 'roku'].includes(deviceFamily)) {
        var data = JSON.parse(remoteCommand);
        switch (deviceFamily) {
          case 'apple-tv':
            data['entity_id'] = _config.apple_tv_remote_entity;
            break;
          case 'roku':
            data['entity_id'] = rokuRemoteEntity;
            break;
        }
        _hass.callService("remote", "send_command", data);
        return;
      }
      if (typeof adbcommand == 'undefined') {
        _hass.callService("media_player", "select_source", { entity_id: _config.entity, source: sourceName});
        return;
      }
      else {
        if(adbcommand == 'adb shell reboot') {
          if(confirm('Are you sure you want to reboot '+_hass.states[_config.entity].attributes.friendly_name) == false) {
            return;
          }
        }
        _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: adbcommand });
        return;
      }
      return;
    }


    // Catch-all for none/other configurations where a button hasn't been defined in YAML config
    if(_config.entity === 'none') {
        unsupportedButton();
        return;
    }


    // detect difference between click or hold actions
    // then carry out the appropriate actions
    const userAction = getActionType(this);
    async function getActionType(that) {
      let type = new Promise((resolve, reject) => {

        pressedTarget.addEventListener("mouseup", release, true);
        pressedTarget.addEventListener("pointerup", release, true);
        pressedTarget.addEventListener("mouseout", mouseOutHandler, true);
        pressedTarget.addEventListener('touchmove', handleTouchMove, {passive: true});
        timer = setTimeout(function(){
          if(start){
            // it was a hold
            pressedTarget.removeEventListener("mouseup", release, true);
            pressedTarget.removeEventListener("pointerup", release, true);
            pressedTarget.removeEventListener("mouseout", mouseOutHandler, true);
            pressedTarget.removeEventListener('touchmove', handleTouchMove, {passive: true});
            resolve("hold");
          }
        }, holdTime);
      
        // it was a click
        function release(){
          clearTimeout(timer);
          let start = null;
          pressedTarget.removeEventListener("mouseup", release, true);
          pressedTarget.removeEventListener("pointerup", release, true);
          pressedTarget.removeEventListener("mouseout", mouseOutHandler, true);
          pressedTarget.removeEventListener('touchmove', handleTouchMove, {passive: true});
          resolve("click");
        }
  
        // a non-event is cancelled here
        function mouseOutHandler() {
          clearTimeout(timer);
          let start = null;
          pressedTarget.removeEventListener("mouseup", release, true);
          pressedTarget.removeEventListener("pointerup", release, true);
          pressedTarget.removeEventListener("mouseout", mouseOutHandler, true);
          pressedTarget.removeEventListener('touchmove', handleTouchMove, {passive: true});
          resolve(null);
        }
        function handleTouchMove() {
          clearTimeout(timer);
          let start = null;
          pressedTarget.removeEventListener("mouseup", release, true);
          pressedTarget.removeEventListener("pointerup", release, true);
          pressedTarget.removeEventListener("mouseout", mouseOutHandler, true);
          pressedTarget.removeEventListener('touchmove', handleTouchMove, {passive: true});
          resolve(null);
        }
      });

      // After determining the button interaction type,
      // send the appropriate commands
      let actionType = await type;
      if (actionType === null) {return;}
      if(actionType == 'click' || actionType == 'hold') {

        // Flash activity light if it exists
        if (activityLight) {
          activityLight.style.opacity = '1';
          setTimeout(function() {activityLight.style.opacity = '0'}, 100);
        }

        // provide haptic feedback for button press
        fireEvent(that, 'haptic', 'light')



        // Power Button Click
        if(buttonID == 'power-button' && actionType == 'click') {
          const state = _hass.states[entity];
          const stateStr = state ? state.state : 'off';
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            if(stateStr != 'off' && stateStr != 'unavailable' && stateStr != 'standby') {
              _hass.callService("media_player", "turn_off", { entity_id: entity});
            }
            else {
              _hass.callService("media_player", "turn_on", { entity_id: entity});
            }
              return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_POWER' });
          }
          else if (compatibility_mode == 'strong' && eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'POWER' });
          }
          else if(compatibility_mode == 'strong') {
            _hass.callService("media_player", "toggle", { entity_id: entity});
          }
          else if(deviceType == 'fire_stick_4k'   || deviceType == 'fire_tv_stick_4k_max' ||
                  deviceType == 'fire_tv_3rd_gen' || deviceType =='fire_stick_second_gen' ||
                  deviceType == 'fire_tv_stick_4k_second_gen' ) {
            if(stateStr != 'off' && stateStr != 'unavailable') {
              _hass.callService("media_player", "turn_off", { entity_id: entity});
            }
            else {
              _hass.callService("media_player", "turn_on", { entity_id: entity});
            }
          }
          else if (deviceType == 'fire_tv_cube_third_gen') {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 116 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 116 0 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent /dev/input/event2 1 9 1 && sendevent /dev/input/event2 0 0 0 && sendevent /dev/input/event2 1 9 0 && sendevent /dev/input/event2 0 0 0' });
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'POWER' });
          }
          return;
        }
        // Power Button Hold
        if(buttonID == 'power-button' && actionType == 'hold') {
          if(['amazon-fire', 'apple-tv', 'chromecast', 'nvidia-shield', 'onn', 'roku'].includes(deviceFamily)) {
            return;
          }
          if(deviceFamily == 'xiaomi'){
            if(hasATVAssociation) {
              _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_POWER', num_repeats: 1, delay_secs: 0, hold_secs: 0.75 });
            }
            else {
              _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'adb shell input keyevent --longpress POWER'});
            }
            return;
          }
        }



        // Account Button (Google TV) Click
        if(buttonID == 'profile-button' && actionType == 'click') {
          _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'adb shell input keyevent KEYCODE_PROFILE_SWITCH' });
          return;
        };
        // Account Button (Google TV) Hold
        if(buttonID == 'profile-button' && actionType == 'hold') {
          // no special behaviors found for this yet
          return;
        }



        // Magic Button / Star Button (Google TV / onn pro) Click
        if(buttonID == 'magic-star-button' && actionType == 'click') {
          if (deviceType == 'onn-streaming-device-4k-pro') {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'adb shell input keyevent 313' });
            return;
          }
          else {
            unsupportedButton();
            return;
          }
        };
        // Magic Button / Star Button (Google TV / onn pro) Hold
        if(buttonID == 'magic-star-button' && actionType == 'hold') {
          if (deviceType == 'onn-streaming-device-4k-pro') {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'adb shell input keyevent --longpress 313' });
            return;
          }
          else {
            unsupportedButton();
            return;
          }
        };



        // Keyboard button click
        if(buttonID == 'keyboard-button' && actionType == 'click') {
          if(['apple-tv'].includes(deviceFamily)) {
            unsupportedButton();
            return;
          }
          var text = prompt("Enter text to send");
          if (text && text != '') {
            if(['roku'].includes(deviceFamily)) {
              _hass.callService("remote", "send_command", { entity_id: rokuRemoteEntity, command: 'Lit_'+text, num_repeats: 1, delay_secs: 0, hold_secs: 0});
            }
            else {
              var escapedText = text.replace(/"/g, "\\\"");
              _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'input text "'+escapedText+'"' });
            }
          }
          return;
        };
        // Keyboard button hold
        if(buttonID == 'keyboard-button' && actionType == 'hold') {
          // no special behaviors dreamed up for this yet
          return;
        }



        // Up Button click
        if(buttonID == 'up-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            var t = deviceFamily+"_remote_entity";
            var confname = t.replace(/\-/, "_");
            _hass.callService("remote", "send_command", { entity_id: _config[confname], command: 'up', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_DPAD_UP' });
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'UP' });
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 103 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 103 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Up Button hold
        if(buttonID == 'up-button' && actionType == 'hold') {
          if(['apple-tv'].includes(deviceFamily)) {
            // needs to be at least 1sec hold time for Apple TV
            _hass.callService("remote", "send_command", { entity_id: _config.apple_tv_remote_entity, command: 'up', num_repeats: 1, delay_secs: 0, hold_secs: 1});
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("remote", "send_command", { entity_id: _config.apple_tv_remote_entity, command: 'up', num_repeats: 1, delay_secs: 0, hold_secs: 1});
                  }, 1025);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          if(['roku'].includes(deviceFamily)) {
            // hold does not work with Roku - https://github.com/home-assistant/core/issues/123999 - using a 1/4 sec repeat is an ok substitute for now
            _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'up', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'up', num_repeats: 1, delay_secs: 0, hold_secs: 0});
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_DPAD_UP', num_repeats: 1, delay_secs: 0, hold_secs: 0.5});
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_DPAD_UP', num_repeats: 1, delay_secs: 0, hold_secs: 0.5});
                  }, 525);
            function rls() {
              clearInterval(rpt);
            }
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'UP' });
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'UP' });
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
          }
          else {
            clicked.target.addEventListener("pointerup", rls, true);
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 103 1 && sendevent '+eventListenerBinPath+' 0 0 0' });
            function rls() {
              clicked.target.removeEventListener("pointerup", rls, true);
              _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 103 0 && sendevent '+eventListenerBinPath+' 0 0 0 '});
            }
          }
          return;
        }
        


        // Left Button Click
        if(buttonID == 'left-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            var t = deviceFamily+"_remote_entity";
            var confname = t.replace(/\-/, "_");
            _hass.callService("remote", "send_command", { entity_id: _config[confname], command: 'left', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_DPAD_LEFT' });
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'LEFT' });
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 105 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 105 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Left Button Hold
        if(buttonID == 'left-button' && actionType == 'hold') {
          if(['apple-tv'].includes(deviceFamily)) {
            // needs to be at least 1sec hold time for Apple TV
            _hass.callService("remote", "send_command", { entity_id: _config.apple_tv_remote_entity, command: 'left', num_repeats: 1, delay_secs: 0, hold_secs: 1});
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("remote", "send_command", { entity_id: _config.apple_tv_remote_entity, command: 'left', num_repeats: 1, delay_secs: 0, hold_secs: 1});
                  }, 1025);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          if(['roku'].includes(deviceFamily)) {
            // hold does not work with Roku - https://github.com/home-assistant/core/issues/123999 - using a 1/4 sec repeat is an ok substitute for now
            _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'left', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'left', num_repeats: 1, delay_secs: 0, hold_secs: 0});
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_DPAD_LEFT', num_repeats: 1, delay_secs: 0, hold_secs: 0.5});
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_DPAD_LEFT', num_repeats: 1, delay_secs: 0, hold_secs: 0.5});
                  }, 525);
            function rls() {
              clearInterval(rpt);
            }
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'LEFT' });
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'LEFT' });
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
          }
          else {
            clicked.target.addEventListener("pointerup", rls, true);
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 105 1 && sendevent '+eventListenerBinPath+' 0 0 0' });
            function rls() {
              clicked.target.removeEventListener("pointerup", rls, true);
              _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 105 0 && sendevent '+eventListenerBinPath+' 0 0 0 '});
            }
          }
          return;
        }



        // Right Button Click
        if(buttonID == 'right-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            var t = deviceFamily+"_remote_entity";
            var confname = t.replace(/\-/, "_");
            _hass.callService("remote", "send_command", { entity_id: _config[confname], command: 'right', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_DPAD_RIGHT' });
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'RIGHT' });
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 106 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 106 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Right Button Hold
        if(buttonID == 'right-button' && actionType == 'hold') {
          if(['apple-tv'].includes(deviceFamily)) {
            // needs to be at least 1sec hold time for Apple TV
            _hass.callService("remote", "send_command", { entity_id: _config.apple_tv_remote_entity, command: 'right', num_repeats: 1, delay_secs: 0, hold_secs: 1});
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("remote", "send_command", { entity_id: _config.apple_tv_remote_entity, command: 'right', num_repeats: 1, delay_secs: 0, hold_secs: 1});
                  }, 1025);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          if(['roku'].includes(deviceFamily)) {
            // hold does not work with Roku - https://github.com/home-assistant/core/issues/123999 - using a 1/4 sec repeat is an ok substitute for now
            _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'right', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'right', num_repeats: 1, delay_secs: 0, hold_secs: 0});
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_DPAD_RIGHT', num_repeats: 1, delay_secs: 0, hold_secs: 0.5});
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_DPAD_RIGHT', num_repeats: 1, delay_secs: 0, hold_secs: 0.5});
                  }, 525);
            function rls() {
              clearInterval(rpt);
            }
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'RIGHT' });
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'RIGHT' });
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
          }
          else {
            clicked.target.addEventListener("pointerup", rls, true);
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 106 1 && sendevent '+eventListenerBinPath+' 0 0 0' });
            function rls() {
              clicked.target.removeEventListener("pointerup", rls, true);
              _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 106 0 && sendevent '+eventListenerBinPath+' 0 0 0 '});
            }
          }
          return;
        }



        // Down Button Click
        if(buttonID == 'down-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            var t = deviceFamily+"_remote_entity";
            var confname = t.replace(/\-/, "_");
            _hass.callService("remote", "send_command", { entity_id: _config[confname], command: 'down', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_DPAD_DOWN' });
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'DOWN' });
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 108 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 108 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Down Button Hold
        if(buttonID == 'down-button' && actionType == 'hold') {
          if(['apple-tv'].includes(deviceFamily)) {
            // needs to be at least 1sec hold time for Apple TV
            _hass.callService("remote", "send_command", { entity_id: _config.apple_tv_remote_entity, command: 'down', num_repeats: 1, delay_secs: 0, hold_secs: 1});
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("remote", "send_command", { entity_id: _config.apple_tv_remote_entity, command: 'down', num_repeats: 1, delay_secs: 0, hold_secs: 1});
                  }, 1025);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          if(['roku'].includes(deviceFamily)) {
            // hold does not work with Roku - https://github.com/home-assistant/core/issues/123999 - using a 1/4 sec repeat is an ok substitute for now
            _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'down', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'down', num_repeats: 1, delay_secs: 0, hold_secs: 0});
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_DPAD_DOWN', num_repeats: 1, delay_secs: 0, hold_secs: 0.5});
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_DPAD_DOWN', num_repeats: 1, delay_secs: 0, hold_secs: 0.5});
                  }, 525);
            function rls() {
              clearInterval(rpt);
            }
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'DOWN' });
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'DOWN' });
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
          }
          else {
            clicked.target.addEventListener("pointerup", rls, true);
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 108 1 && sendevent '+eventListenerBinPath+' 0 0 0' });
            function rls() {
              clicked.target.removeEventListener("pointerup", rls, true);
              _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 108 0 && sendevent '+eventListenerBinPath+' 0 0 0 '});
            }
          }
          return;
        }



        // Center Button Click
        if(buttonID == 'center-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            var t = deviceFamily+"_remote_entity";
            var confname = t.replace(/\-/, "_");
            _hass.callService("remote", "send_command", { entity_id: _config[confname], command: 'select', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_DPAD_CENTER' });
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'CENTER' });
          }
          else {
            if(deviceType == 'fire_tv_4_series' || deviceType == 'fire_tv_toshiba_v35' || deviceType == 'fire_tv_jvc-4k-2021') {
              _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 28 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 28 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
            }
            else if(deviceType == 'mi-box-s') {
              _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 353 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 353 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
            }
            else {
              _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 96 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 96 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
            }
          }
          return;
        }
        // Center Button Hold
        if(buttonID == 'center-button' && actionType == 'hold') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            var t = deviceFamily+"_remote_entity";
            var confname = t.replace(/\-/, "_");
            // This strategy does not work with Roku - https://github.com/home-assistant/core/issues/123999
            _hass.callService("remote", "send_command", { entity_id: _config[confname], command: 'select', num_repeats: 1, delay_secs: 0, hold_secs: 1});
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_DPAD_CENTER', num_repeats: 1, delay_secs: 0, hold_secs: 0.75 });
            return;
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            // This adb shell input keyevent --longpress 23 strategy does not seem to work with the NVIDIA Shield, onn. or Chromecast through ADB
            // need to rapidfire the center button like we do the other dpad buttons
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'adb shell input keyevent 23' });
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'adb shell input keyevent 23' });
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
          }
          else {
            if(deviceType == 'fire_tv_4_series' || deviceType == 'fire_tv_toshiba_v35' || deviceType == 'fire_tv_jvc-4k-2021') {
              clicked.target.addEventListener("pointerup", rls, true);
              _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 28 1 && sendevent '+eventListenerBinPath+' 0 0 0' });
              function rls() {
                clicked.target.removeEventListener("pointerup", rls, true);
                _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 28 0 && sendevent '+eventListenerBinPath+' 0 0 0 '});
              }
            }
            else if(deviceType == 'mi-box-s') {
              clicked.target.addEventListener("pointerup", rls, true);
              _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 353 1 && sendevent '+eventListenerBinPath+' 0 0 0' });
              function rls() {
                clicked.target.removeEventListener("pointerup", rls, true);
                _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 353 0 && sendevent '+eventListenerBinPath+' 0 0 0 '});
              }
            }
            else {
              clicked.target.addEventListener("pointerup", rls, true);
              _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 96 1 && sendevent '+eventListenerBinPath+' 0 0 0' });
              function rls() {
                clicked.target.removeEventListener("pointerup", rls, true);
                _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 96 0 && sendevent '+eventListenerBinPath+' 0 0 0 '});
              }
            }
          }
          return;
        }



        // Replay Button Click
        if(buttonID == 'replay-button' && actionType == 'click') {
          if(['roku'].includes(deviceFamily)) {
            _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'replay', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          else {
            unsupportedButton();
            return;
          }
        }
        // Replay Button Hold
        if(buttonID == 'replay-button' && actionType == 'hold') {
          if(['roku'].includes(deviceFamily)) {
            // hold does not work with Roku - https://github.com/home-assistant/core/issues/123999 - using a 1/4 sec repeat is an ok substitute for now
            _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'replay', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'replay', num_repeats: 1, delay_secs: 0, hold_secs: 0});
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          return;
        }



        // Options Button Click
        if(buttonID == 'options-button' && actionType == 'click') {
          if(['roku'].includes(deviceFamily)) {
            _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'info', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
        }
        // Options Button Hold
        if(buttonID == 'options-button' && actionType == 'hold') {
          // no special behaviors found for this yet
          return;
        }



        // Apps Button Click
        if(buttonID == 'apps-button' && actionType == 'click') {
          if (deviceType == 'mi-box-s') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell am start -n com.google.android.tvlauncher/.appsview.AppsViewActivity' });
          }
          else if (deviceFamily == 'nvidia-shield') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent KEYCODE_APP_SWITCH' });
          }
          else if (deviceFamily == 'amazon-fire') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'am start -n com.amazon.venezia/com.amazon.venezia.grid.AppsGridLauncherActivity' });
          }
          else if (deviceFamily == 'onn') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent KEYCODE_ALL_APPS' });
          }
          else if (deviceFamily == 'roku') {
            unsupportedButton();
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'RECENTS' });
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 757 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 757 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Apps Button Hold
        if(buttonID == 'apps-button' && actionType == 'hold') {
          // no special behaviors found for this yet
          return;
        }



        // Back Button Click
        if(buttonID == 'back-button' && actionType == 'click') {
          if(deviceFamily == 'apple-tv') {
            _hass.callService("remote", "send_command", { entity_id: _config.apple_tv_remote_entity, command: 'menu', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if(deviceFamily == 'roku') {
            _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'back', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: _config.android_tv_remote_entity, command: 'KEYCODE_BACK' });
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'BACK' });
          }
          return;
        }
        // Back Button Hold
        if(buttonID == 'back-button' && actionType == 'hold') {
          // no special behaviors found for this with Chromecast, FireTV, onn., NVIDIA Shield, Roku, or Xiaomi mi
          if(deviceFamily == 'apple-tv') {
            _hass.callService("remote", "send_command", { entity_id: _config.apple_tv_remote_entity, command: 'home', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          return;
        }



        // Home Button Click
        if(buttonID == 'home-button' && actionType == 'click') {
          if(deviceFamily == 'apple-tv') {
            _hass.callService("remote", "send_command", { entity_id: _config.apple_tv_remote_entity, command: 'top_menu', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if(deviceFamily == 'roku') {
            _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'home', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: _config.android_tv_remote_entity, command: 'KEYCODE_HOME' });
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'HOME' });
          }
          return;
        }
        // Home Button Hold
        if(buttonID == 'home-button' && actionType == 'hold') {
          // no special behavior noticed for Roku
          if(deviceFamily == 'amazon-fire') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent SETTINGS' });
          }
          else if(['chromecast', 'onn'].includes(deviceFamily)) {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 83' });
          }
          else if(deviceFamily == 'apple-tv') {
            _hass.callService("remote", "send_command", { entity_id: _config.apple_tv_remote_entity, command: 'home', num_repeats: 1, delay_secs: 0, hold_secs: 1});
          }
          else if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: _config.android_tv_remote_entity, command: 'KEYCODE_HOME', num_repeats: 1, delay_secs: 0, hold_secs: 0.75});
          }
          else if(['nvidia-shield', 'xiaomi'].includes(deviceFamily)) {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent KEYCODE_ALL_APPS' });
          }
          return;
        }



        // Hamburger Button Click
        if(buttonID == 'hamburger-button' && actionType == 'click') {
          if(['apple-tv', 'roku', 'onn'].includes(deviceFamily)) {
            unsupportedButton();
            return;
          }
          if(deviceType == 'shield-tv-pro-2019' || deviceType == 'shield-tv-2019') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'am start -a android.settings.SETTINGS' });
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'MENU' });
          }
          else if(['xiaomi'].includes(deviceFamily)) {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell am start -n com.android.tv.settings/com.android.tv.settings.MainSettings' });
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 139 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 139 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Hamburger Button Hold
        if(buttonID == 'hamburger-button' && actionType == 'hold') {
          // no special behaviors found for this with FireTV, or NVIDIA Shield
          // the hamburger button for Xiaomi isn't actually real
          return;
        }



        // Rewind Button Click
        if(buttonID == 'rewind-button' && actionType == 'click') {
          if(deviceFamily == 'apple-tv') {
            _hass.callService("remote", "send_command", { entity_id: _config.apple_tv_remote_entity, command: 'skip_backward', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if(deviceFamily == 'roku') {
            _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'reverse', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: _config.android_tv_remote_entity, command: 'KEYCODE_MEDIA_REWIND' });
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined' || deviceType == 'mi-box-s') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'REWIND' });
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 168 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 168 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Rewind Button Hold
        if(buttonID == 'rewind-button' && actionType == 'hold') {
          if(['apple-tv'].includes(deviceFamily)) {
            // n/a for Apple TV (assuming rewind translates to skip_backward)
            return;
          }
          if(['roku'].includes(deviceFamily)) {
            // hold does not work with Roku - https://github.com/home-assistant/core/issues/123999 - using a 0.15 sec repeat is an ok-ish substitute for now
            _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'reverse', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'reverse', num_repeats: 1, delay_secs: 0, hold_secs: 0});
                  }, 150);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_MEDIA_REWIND', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_MEDIA_REWIND', num_repeats: 1, delay_secs: 0, hold_secs: 0});
                  }, 100);
            function rls() {
              clearInterval(rpt);
            }
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'REWIND' });
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'REWIND' });
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
          }
          else {
            clicked.target.addEventListener("pointerup", rls, true);
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 168 1 && sendevent '+eventListenerBinPath+' 0 0 0' });
            function rls() {
              clicked.target.removeEventListener("pointerup", rls, true);
              _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 168 0 && sendevent '+eventListenerBinPath+' 0 0 0 '});
            }
          }
          return;
        }



        // Play/Pause Button Click
        if(buttonID == 'playpause-button' && actionType == 'click') {
          if(deviceFamily == 'apple-tv') {
            var playpausecommand = 'pause';
            if(_hass.states[_config.entity].state=='paused'){ playpausecommand = 'play'; };
            _hass.callService("remote", "send_command", { entity_id: _config.apple_tv_remote_entity, command: playpausecommand, num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if(deviceFamily == 'roku') {
            _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'play', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: _config.android_tv_remote_entity, command: 'KEYCODE_MEDIA_PLAY_PAUSE' });
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined' || deviceType == 'mi-box-s') {
            _hass.callService("media_player", "media_play_pause", { entity_id: _config.entity});
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 164 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 164 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Play/Pause Button Hold
        if(buttonID == 'playpause-button' && actionType == 'hold') {
          // Button does not exist for apple tv, chromecast, onn., or xiaomi - so no hold behaviors are emulated
          // No special behaviors noticed for this with FireTV, NVIDIA Shield, or Roku
          return;
        }



        // Fast Forward Button Click
        if(buttonID == 'fastforward-button' && actionType == 'click') {
          if(deviceFamily == 'apple-tv') {
            _hass.callService("remote", "send_command", { entity_id: _config.apple_tv_remote_entity, command: 'skip_forward', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if(deviceFamily == 'roku') {
            _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'forward', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: _config.android_tv_remote_entity, command: 'KEYCODE_MEDIA_FAST_FORWARD' });
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined' || deviceType == 'mi-box-s') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'FAST_FORWARD' });
          }
          else {
            if(deviceType == 'fire_tv_4_series' || deviceType == 'fire_tv_toshiba_v35' || deviceType == 'fire_tv_jvc-4k-2021') {
              _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 159 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 159 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
            }
            else {
              _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 208 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 208 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
            }
          }
          return;
        }
        // Fast Forward Button Hold
        if(buttonID == 'fastforward-button' && actionType == 'hold') {
          if(['apple-tv'].includes(deviceFamily)) {
            // n/a for Apple TV (assuming fast forward translates to skip_forward)
            return;
          }
          if(['roku'].includes(deviceFamily)) {
            // hold does not work with Roku - https://github.com/home-assistant/core/issues/123999 - using a 0.15 sec repeat is an ok-ish substitute for now
            _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'forward', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'forward', num_repeats: 1, delay_secs: 0, hold_secs: 0});
                  }, 150);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_MEDIA_FAST_FORWARD', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("remote", "send_command", { entity_id: atvRemoteEntity, command: 'KEYCODE_MEDIA_FAST_FORWARD', num_repeats: 1, delay_secs: 0, hold_secs: 0});
                  }, 100);
            function rls() {
              clearInterval(rpt);
            }
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'FAST_FORWARD' });
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
                    _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'FAST_FORWARD' });
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
          }
          else {
            if(deviceType == 'fire_tv_4_series' || deviceType == 'fire_tv_toshiba_v35' || deviceType == 'fire_tv_jvc-4k-2021') {
              clicked.target.addEventListener("pointerup", rls, true);
              _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 159 1 && sendevent '+eventListenerBinPath+' 0 0 0' });
              function rls() {
                clicked.target.removeEventListener("pointerup", rls, true);
                _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 159 0 && sendevent '+eventListenerBinPath+' 0 0 0 '});
              }
            }
            else {
              clicked.target.addEventListener("pointerup", rls, true);
              _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 208 1 && sendevent '+eventListenerBinPath+' 0 0 0' });
              function rls() {
                clicked.target.removeEventListener("pointerup", rls, true);
                _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 208 0 && sendevent '+eventListenerBinPath+' 0 0 0 '});
              }
            }
            return;
          }
        }



        // Volume Up Button Click
        if(buttonID == 'volume-up-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            var t = deviceFamily+"_remote_entity";
            var confname = t.replace(/\-/, "_");
            _hass.callService("remote", "send_command", { entity_id: _config[confname], command: 'volume_up', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: _config.android_tv_remote_entity, command: 'KEYCODE_VOLUME_UP' });
          }
          else if(deviceFamily == 'nvidia-shield') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell cmd media_session volume --show --adj raise' });
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'VOLUME_UP' });
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 115 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 115 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Volume Up Button Hold
        if(buttonID == 'volume-up-button' && actionType == 'hold') {
          if(['apple-tv'].includes(deviceFamily)) {
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
              _hass.callService("remote", "send_command", { entity_id: _config.apple_tv_remote_entity, command: 'volume_up', num_repeats: 1, delay_secs: 0, hold_secs: 0});
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          if(['roku'].includes(deviceFamily)) {
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
              _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'volume_up', num_repeats: 1, delay_secs: 0, hold_secs: 0});
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          if(hasATVAssociation) {
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
              _hass.callService("remote", "send_command", { entity_id: _config.android_tv_remote_entity, command: 'KEYCODE_VOLUME_UP' });
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          else if(deviceFamily == 'nvidia-shield') {
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
              _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell cmd media_session volume --show --adj raise' });
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
              _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'VOLUME_UP' });
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          else {
            clicked.target.addEventListener("pointerup", rls, true);
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 115 1 && sendevent '+eventListenerBinPath+' 0 0 0' });
            function rls() {
              clicked.target.removeEventListener("pointerup", rls, true);
              _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 115 0 && sendevent '+eventListenerBinPath+' 0 0 0 '});
            }
          }
          return;
        }



        // Volume Down Button Click
        if(buttonID == 'volume-down-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            var t = deviceFamily+"_remote_entity";
            var confname = t.replace(/\-/, "_");
            _hass.callService("remote", "send_command", { entity_id: _config[confname], command: 'volume_down', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: _config.android_tv_remote_entity, command: 'KEYCODE_VOLUME_DOWN' });
          }
          else if(deviceFamily == 'nvidia-shield') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell cmd media_session volume --show --adj lower' });
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'VOLUME_DOWN' });
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 114 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 114 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Volume Down Button Hold
        if(buttonID == 'volume-down-button' && actionType == 'hold') {
          if(['apple-tv'].includes(deviceFamily)) {
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
              _hass.callService("remote", "send_command", { entity_id: _config.apple_tv_remote_entity, command: 'volume_down', num_repeats: 1, delay_secs: 0, hold_secs: 0});
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          if(['roku'].includes(deviceFamily)) {
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
              _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'volume_down', num_repeats: 1, delay_secs: 0, hold_secs: 0});
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          if(hasATVAssociation) {
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
              _hass.callService("remote", "send_command", { entity_id: _config.android_tv_remote_entity, command: 'KEYCODE_VOLUME_DOWN' });
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          else if(deviceFamily == 'nvidia-shield') {
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
              _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell cmd media_session volume --show --adj lower' });
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
              _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'VOLUME_DOWN' });
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          else {
            clicked.target.addEventListener("pointerup", rls, true);
            _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 114 1 && sendevent '+eventListenerBinPath+' 0 0 0' });
            function rls() {
              clicked.target.removeEventListener("pointerup", rls, true);
              _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 114 0 && sendevent '+eventListenerBinPath+' 0 0 0 '});
            }
          }
          return;
        }



        // Mute Button Click
        if(buttonID == 'mute-button' && actionType == 'click') {
          if(deviceFamily == 'apple-tv') {
            unsupportedButton();
          }
          if(deviceFamily == 'roku') {
            _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'volume_mute', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if(hasATVAssociation) {
            _hass.callService("remote", "send_command", { entity_id: _config.android_tv_remote_entity, command: 'KEYCODE_VOLUME_MUTE' });
          }
          else if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'MUTE' });
          }
          else if (deviceType == 'mi-box-s') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 164'});
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 113 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 113 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Mute Button Hold
        if(buttonID == 'mute-button' && actionType == 'hold') {
          // Button does not exist for chromecast, NVIDIA Shield, or xiaomi - so no hold behaviors are emulated
          // No special behaviors noticed for this with Apple TV, FireTV, onn., or Roku
          return;
        }



        // Channel Up Button Click
        if(buttonID == 'channel-up-button' && actionType == 'click') {
          if(['apple-tv', 'chromecast', 'nvidia-shield', 'xiaomi'].includes(deviceFamily)) {
            unsupportedButton();
            return;
          }
          if(deviceFamily == 'roku') {
            _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'channel_up', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if (['homatics'].includes(deviceFamily)) {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent KEYCODE_CHANNEL_UP'});
            return;
          }
          if (['fire_tv_stick_4k_second_gen', 'fire_tv_stick_4k_max_second_gen', 'onn-streaming-device-4k-pro', 'onn-4k-streaming-box', 'onn-full-hd-streaming-stick'].includes(deviceType)) {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent KEYCODE_CHANNEL_UP'});
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 402 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 402 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Channel Up Button Hold
        if(buttonID == 'channel-up-button' && actionType == 'hold') {
          // No special behaviors noticed for this with onn.
          // Button does not exist for Apple TV, Chromecast, Homatics, NVIDIA Shield, or Xiaomi - so no hold behaviors are emulated
          if(['onn', 'apple-tv', 'chromecast', 'homatics', 'nvidia-shield', 'xiaomi'].includes(deviceFamily)) {
            return;
          }
          if(['roku'].includes(deviceFamily)) {
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
              _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'channel_up', num_repeats: 1, delay_secs: 0, hold_secs: 0});
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          else {
            if (['fire_tv_stick_4k_second_gen', 'fire_tv_stick_4k_max_second_gen'].includes(deviceType)) {
              clicked.target.addEventListener("pointerup", rls, true);
              let rpt = setInterval( function() {
                _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent KEYCODE_CHANNEL_UP'});
                    }, 250);
              function rls() {
                clearInterval(rpt);
              }
              return;
            }
            else {
              clicked.target.addEventListener("pointerup", rls, true);
              _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 402 1 && sendevent '+eventListenerBinPath+' 0 0 0' });
              function rls() {
                clicked.target.removeEventListener("pointerup", rls, true);
                _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 402 0 && sendevent '+eventListenerBinPath+' 0 0 0 '});
              }
            }
            return;
          }
        }



        // Channel Down Button Click
        if(buttonID == 'channel-down-button' && actionType == 'click') {
          if(['apple-tv', 'chromecast', 'nvidia-shield', 'xiaomi'].includes(deviceFamily)) {
            unsupportedButton();
            return;
          }
          if(deviceFamily == 'roku') {
            _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'channel_down', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          if (['homatics'].includes(deviceFamily)) {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent KEYCODE_CHANNEL_DOWN'});
            return;
          }
          if (['fire_tv_stick_4k_second_gen', 'fire_tv_stick_4k_max_second_gen', 'onn-streaming-device-4k-pro', 'onn-4k-streaming-box', 'onn-full-hd-streaming-stick'].includes(deviceType)) {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent KEYCODE_CHANNEL_DOWN'});
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 403 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 403 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Channel Down Button Hold
        if(buttonID == 'channel-down-button' && actionType == 'hold') {
          // No special behaviors noticed for this with onn.
          // Button does not exist for Apple TV, Chromecast, NVIDIA Shield, or Xiaomi - so no hold behaviors are emulated
          if(['onn', 'apple-tv', 'chromecast', 'homatics', 'nvidia-shield', 'xiaomi'].includes(deviceFamily)) {
            return;
          }
          if(['roku'].includes(deviceFamily)) {
            clicked.target.addEventListener("pointerup", rls, true);
            let rpt = setInterval( function() {
              _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'channel_down', num_repeats: 1, delay_secs: 0, hold_secs: 0});
                  }, 250);
            function rls() {
              clearInterval(rpt);
            }
            return;
          }
          else {
            if (['fire_tv_stick_4k_second_gen', 'fire_tv_stick_4k_max_second_gen'].includes(deviceType)) {
              clicked.target.addEventListener("pointerup", rls, true);
              let rpt = setInterval( function() {
                _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent KEYCODE_CHANNEL_DOWN'});
                    }, 250);
              function rls() {
                clearInterval(rpt);
              }
              return;
            }
            else {
              clicked.target.addEventListener("pointerup", rls, true);
              _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 403 1 && sendevent '+eventListenerBinPath+' 0 0 0' });
              function rls() {
                clicked.target.removeEventListener("pointerup", rls, true);
                _hass.callService("androidtv", "adb_command", { entity_id: entity, command: 'sendevent '+eventListenerBinPath+' 1 403 0 && sendevent '+eventListenerBinPath+' 0 0 0 '});
              }
            }
            return;
          }
        }



        // TV Button Click
        if(buttonID == 'tv-button' && actionType == 'click') {
          if(['apple-tv', 'roku', 'nvidia-shield'].includes(deviceFamily)) {
            unsupportedButton();
            return;
          }
          if (deviceType == 'fire_tv_cube_third_gen') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 297'});
          }
          else if (deviceType == 'fire_tv_stick_4k_second_gen' || deviceType == 'fire_tv_stick_4k_max_second_gen') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 300'});
          }
          else if (deviceType == 'mi-box-s') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell am start -n com.google.android.tv/com.android.tv.MainActivity' });
          }
          else if (['onn', 'homatics'].includes(deviceFamily)) {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent KEYCODE_GUIDE'});
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 362 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 362 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // TV Button Button Hold
        if(buttonID == 'tv-button' && actionType == 'hold') {
          // no special behaviors found for this
          return;
        }



        // Settings Button Click
        if(buttonID == 'settings-button' && actionType == 'click') {
          if(['roku', 'nvidia-shield'].includes(deviceFamily)) {
            unsupportedButton();
            return;
          }
          if (['onn'].includes(deviceFamily)) {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 83' });
          }
          else if(compatibility_mode == 'strong'  || eventListenerBinPath == 'undefined' || deviceType == 'fire_tv_cube_third_gen') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'SETTINGS' });
          }
          else if(deviceType == 'mi-box-s') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell am start -n com.android.tv.settings/com.android.tv.settings.MainSettings' });
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 249 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 249 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Settings Button Button Hold
        if(buttonID == 'settings-button' && actionType == 'hold') {
          // no special behaviors found for this
          return;
        }



        // App Switch (recents) Button
        if(buttonID == 'app-switch-button' && actionType == 'click') {
          if(compatibility_mode == 'strong') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'RECENTS' });
          }
          else if (deviceType == 'fire_tv_stick_4k_second_gen' || deviceType == 'fire_tv_stick_4k_max_second_gen') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 307'});
          }
          else if(eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'RECENTS' });
          }
          else if (deviceType == 'fire_tv_cube_third_gen') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 304'});
          }
          else if (deviceType == 'mi-box-s') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent KEYCODE_APP_SWITCH' });
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 757 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 757 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // App Switch (recents) Button Hold
        if(buttonID == 'app-switch-button' && actionType == 'hold') {
          // no special behaviors found for this
          return;
        }



        // Headset Button Click
        if(buttonID == 'headset-button' && actionType == 'click') {
          if (['amazon-fire'].includes(deviceFamily)) {
              _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent BUTTON_3'});
          }
          else if (['onn'].includes(deviceFamily)) {
              _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent KEYCODE_PAIRING'});
          }
          else if (['chromecast', 'nvidia-shield', 'xiaomi'].includes(deviceFamily)) {
              _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell am start -n com.android.tv.settings/com.android.tv.settings.accessories.AddAccessoryActivity'});
          }
          else {
            unsupportedButton();
            return;
          }
          return;
        }
        // Headset Button Hold
        if(buttonID == 'headset-button' && actionType == 'hold') {
          // no special behaviors found for this
          return;
        }



        // Programmable 1 Button Click
        if(buttonID == 'programmable-one-button' && actionType == 'click') {
          if(['amazon-fire'].includes(deviceFamily)) {
            if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
              _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent BUTTON_1'});
            }
            else {
              _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 638 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 638 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
            }
            return;
          }
          else {
            unsupportedButton();
            return;
          }
        }
        // Programmable 1 Button Hold
        if(buttonID == 'programmable-one-button' && actionType == 'hold') {
          if(['amazon-fire'].includes(deviceFamily)) {
            if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
              //TODO: - (spent too much time here already)
            }
            else {
              //_hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 638 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sleep 1 && sendevent '+eventListenerBinPath+' 1 638 0 && sendevent '+eventListenerBinPath+' 0 0 0' }); // TODO: sleep does not work as expected? (spent too much time here already)
            }
            return;
          }
        }



        // Programmable 2 Button Click
        if(buttonID == 'programmable-two-button' && actionType == 'click') {
          if(['amazon-fire'].includes(deviceFamily)) {
            if(compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
              _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent BUTTON_2'}); // this is wrong for fire_tv_4_series
            }
            else {
              _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 4 4 787071 && sendevent '+eventListenerBinPath+' 1 639 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 4 4 787071 && sendevent '+eventListenerBinPath+' 1 639 0 && sendevent '+eventListenerBinPath+' 0 0 0' }); // wrong w/event0 on ftv 4
            }
            return;
          }
          else {
            unsupportedButton();
            return;
          }
        }
        // Programmable 2 Button Hold
        if(buttonID == 'programmable-two-button' && actionType == 'hold') {
          // TODO - (spent too much time here already)
          return;
        }



        // Info Button Click
        if(buttonID == 'info-button' && actionType == 'click') {
          if(!(['homatics'].includes(deviceFamily))) {
            unsupportedButton();
          }
          else if (compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 165'});
          }
          return;
        }
        // Info Button Click
        if(buttonID == 'info-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }


        // Bookmark Button Click
        if(buttonID == 'bookmark-button' && actionType == 'click') {
          if(!(['homatics'].includes(deviceFamily))) {
            unsupportedButton();
          }
          else if (compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent KEYCODE_BOOKMARK'});
          }
          return;
        }
        // Bookmark Button Click
        if(buttonID == 'bookmark-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }


        // Numeric 1 Button Click
        if(buttonID == 'num1-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            unsupportedButton();
          }
          else if (compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 8'});
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 2 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 2 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Numeric 1 Button Hold
        if(buttonID == 'num1-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // Numeric 2 Button Click
        if(buttonID == 'num2-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            unsupportedButton();
          }
          else if (compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 9'});
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 3 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 3 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Numeric 2 Button Hold
        if(buttonID == 'num2-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // Numeric 3 Button Click
        if(buttonID == 'num3-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            unsupportedButton();
          }
          else if (compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 10'});
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 4 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 4 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Numeric 3 Button Hold
        if(buttonID == 'num3-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // Numeric 4 Button Click
        if(buttonID == 'num4-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            unsupportedButton();
          }
          else if (compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 11'});
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 5 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 5 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Numeric 4 Button Hold
        if(buttonID == 'num4-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // Numeric 5 Button Click
        if(buttonID == 'num5-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            unsupportedButton();
          }
          else if (compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 12'});
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 6 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 6 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Numeric 5 Button Hold
        if(buttonID == 'num5-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // Numeric 6 Button Click
        if(buttonID == 'num6-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            unsupportedButton();
          }
          else if (compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 13'});
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 7 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 7 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Numeric 6 Button Hold
        if(buttonID == 'num6-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // Numeric 7 Button Click
        if(buttonID == 'num7-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            unsupportedButton();
          }
          else if (compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 14'});
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 8 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 8 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Numeric 7 Button Hold
        if(buttonID == 'num7-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // Numeric 8 Button Click
        if(buttonID == 'num8-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            unsupportedButton();
          }
          else if (compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 15'});
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 9 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 9 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Numeric 8 Button Hold
        if(buttonID == 'num8-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // Numeric 9 Button Click
        if(buttonID == 'num9-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            unsupportedButton();
          }
          else if (compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 16'});
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 10 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 10 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Numeric 9 Button Hold
        if(buttonID == 'num9-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // Numeric 0 Button Click
        if(buttonID == 'num0-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            unsupportedButton();
          }
          else if (compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 7'});
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 11 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 11 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // Numeric 0 Button Hold
        if(buttonID == 'num0-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // SUBT Button Click
        if(buttonID == 'subtitle-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            unsupportedButton();
          }
          else if (compatibility_mode == 'strong' || eventListenerBinPath == 'undefined') {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 175'});
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+eventListenerBinPath+' 1 469 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 469 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
          }
          return;
        }
        // SUBT Button Hold
        if(buttonID == 'subtitle-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // LIVE Button Click
        if(buttonID == 'live-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            unsupportedButton();
          }
          else {
            if(deviceType == 'fire_tv_jvc-4k-2021') {
              var tempbinpath = '/dev/input/event4'
              _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'sendevent '+tempbinpath+' 1 358 1 && sendevent '+tempbinpath+' 0 0 0 && sendevent '+tempbinpath+' 1 358 0 && sendevent '+tempbinpath+' 0 0 0' });
            }
            else if (['fire_tv_4_series', 'fire_tv_toshiba_v35"'].includes(deviceType)) {
               _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent KEYCODE_TV'});
            }
            else {
              unsupportedButton();
            }
          }
          return;
        }
        // LIVE Button Hold
        if(buttonID == 'live-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // Red Button Click
        if(buttonID == 'red-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            unsupportedButton();
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 183'});
          }
          return;
        }
        // Red Button Hold
        if(buttonID == 'red-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // Green Button Click
        if(buttonID == 'green-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            unsupportedButton();
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 184'});
          }
          return;
        }
        // Green Button Hold
        if(buttonID == 'green-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // Yellow Button Click
        if(buttonID == 'yellow-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            unsupportedButton();
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 185'});
          }
          return;
        }
        // Yellow Button Hold
        if(buttonID == 'yellow-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // Blue Button Click
        if(buttonID == 'blue-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            unsupportedButton();
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 186'});
          }
          return;
        }
        // Blue Button Hold
        if(buttonID == 'blue-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // Voice Button Click
        if(buttonID == 'voice-button' && actionType == 'click') {
            unsupportedButton();
            return;
        }
        // Voice Button Hold
        if(buttonID == 'voice-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // Sleep Button Click
        if(buttonID == 'sleep-button' && actionType == 'click') {
          if(deviceFamily == 'roku') {
            _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: 'sleep', num_repeats: 1, delay_secs: 0, hold_secs: 0});
            return;
          }
          else {
            unsupportedButton();
            return;
          }
        }
        // Sleep Button Hold
        if(buttonID == 'sleep-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // PatchWall Button Click
        if(buttonID == 'patchwall-button' && actionType == 'click') {
          if(['xiaomi'].includes(deviceFamily)) {
              _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell am start com.mitv.tvhome.atv'});
          }
          else {
            unsupportedButton();
          }
          return;
        }
        // PatchWall Button Hold
        if(buttonID == 'patchwall-button' && actionType == 'hold') {
          // no special behaviors known for this - I'm unable to test in my region
          return;
        }



        // Input Button Click
        if(buttonID == 'input-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            unsupportedButton();
          }
          else {
            _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell input keyevent 178'});
          }
          return;
        }
        // Input Button Hold
        if(buttonID == 'input-button' && actionType == 'hold') {
          // no special behaviors known for this
          return;
        }



        // Reboot Button Click
        if(buttonID == 'reboot-button' && actionType == 'click') {
          if(['apple-tv', 'roku'].includes(deviceFamily)) {
            unsupportedButton();
            return;
          }
          if(confirm('Are you sure you want to reboot '+_hass.states[_config.entity].attributes.friendly_name) == false) {
            return;
          }
          _hass.callService("androidtv", "adb_command", { entity_id: _config.entity, command: 'adb shell reboot' });
          return;
        }
        // Reboot Button Hold
        if(buttonID == 'reboot-button' && actionType == 'hold') {
          // no special actions imagined for this yet
          return;
        }



        // Search Button Click (Apple TV Remote style 2)
        if(buttonID == 'search-button' && actionType == 'click') {
          if(['apple-tv'].includes(deviceFamily)) {
            _hass.callService("media_player", "select_source", { entity_id: _config.entity, source: "Search"});
          }
          else {
            unsupportedButton();
          }
          return;
        }
        // Search Button Hold (Apple TV Remote style 2)
        if(buttonID == 'search-button' && actionType == 'hold') {
          // no special behaviors known for this - I do not own this, so I'm unable to test
          return;
        }


// TODO: Not important, but also not working with the refactor
//        // Roku Function: Secret Screen Click
//        if(buttonID == 'roku-secret-screen-button' && actionType == 'click') {
//          if(['roku'].includes(deviceFamily)) {
//            var command = ['home', 'home', 'home', 'home', 'home', 'forward', 'forward', 'forward', 'reverse', 'reverse'];
//            for (let index = 0, len = command.length; index < len; ++index) {
//              setTimeout(() =>
//                _hass.callService("remote", "send_command", { entity_id: _config.roku_remote_entity, command: command[index], num_repeats: 1, delay_secs: 0, hold_secs: 0}),
//                index*50);
//            }
//          }
//          else {
//            unsupportedButton();
//          }
//          return;
//        }
//        // Roku Function: Secret Screen Hold
//        if(buttonID == 'roku-secret-screen-button' && actionType == 'hold') {
//          // no special actions imagined for this yet
//          return;
//        }


      // uncaught button presses land here
      //console.log('unhandled '+actionType+' action for '+buttonID);
      return;


      }
      else {
        // unhandled actiontype
        return;
      }


    }


  }

}
customElements.define('firemote-card', FiremoteCard);


// Allow this card to appear in the card chooser menu
window.customCards = window.customCards || [];
window.customCards.push({
  type: "firemote-card",
  name: "Firemote Card",
  preview: true,
  description: "Remote control card for Amazon FireTV, Apple TV, Chromecast, NVIDIA Shield, onn., Roku, and Xiaomi devices"
});



// Ceate and register the card editor
class FiremoteCardEditor extends LitElement {

  static get properties() {
    return {
      hass: {},
      _config: {},
    };
  }

  // setConfig works the same way as for the card itself
  setConfig(config) {
    this._config = config;
  }

  // This function is called when the input element of the editor loses focus or is changed
  configChanged(ev) {

    const _config = Object.assign({}, this._config);
    _config[ev.target.name.toString()] = ev.target.value;
    this._config = _config;

    if (ev.type == 'change') {
      // If the Device Family changes, we need to blank the device type value, or
      // if a boolean style checkbox value changes, special handling is required
      switch(ev.target.id) {
        case 'device_family':
          this._config.device_type = null;
          break;
        case 'hideFramesCheckbox':
          this._config.hide_button_group_frame = ev.target.checked;
          break;
        case 'useCustomSkinCheckbox':
          this._config.useCustomSkin = ev.target.checked;
          break;
        case "showMediaControlsCheckbox":
          this._config.show_media_controls = ev.target.checked;
          break;
      }
    }

    // A config-changed event will tell lovelace we have made a change to the configuration
    // this will make sure the changes are saved correctly later and will update the preview
    const event = new CustomEvent("config-changed", {
      detail: { config: _config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }


  translateToUsrLang(englishString) {
    const ha_language = this.hass.config.language;
    var translatedString = englishString;
    if (typeof translationmap.get(ha_language) !== 'undefined'){
        if (typeof translationmap.get(ha_language)[englishString] !== 'undefined'){
            translatedString = translationmap.get(ha_language)[englishString];
        }
    }
    return translatedString;
  }

  removeMatching(originalArray, regex) {
    var j = 0;
    while (j < originalArray.length) {
        if (regex.test(originalArray[j]))
            originalArray.splice(j, 1);
        else
            j++;
    }
    return originalArray;
  }

  getEntitiesByType(type) {
    return Object.keys(this.hass.states).filter(
      (eid) => eid.substr(0, eid.indexOf('.')) === type
    );
  }

  getEntitiesByPlatform(platformName) {
    return Object.keys(this.hass.entities).filter(
      (eid) => this.hass.entities[eid].platform === platformName
    );
  }

  getMediaPlayerEntitiesByPlatform(platformName) {
    var entities = Object.keys(this.hass.entities).filter(
      (eid) => this.hass.entities[eid].platform === platformName
    );
    const re = /media_player/;
    return entities.filter(a => re.exec(a));
  }


  getRemoteEntitiesByPlatform(platformName) {
    //console.log(this.hass.entities);
    var entities = Object.keys(this.hass.entities).filter(
      (eid) => this.hass.entities[eid].platform === platformName
    );
    const re = /remote/;
    const negreg = /Supports/i;
    return this.removeMatching(entities.filter(a => re.exec(a)), negreg);
  }

  getDeviceFamiliesDropdown(optionvalue){
    var familykeys = [];
    for(var [key, value] of devicemap.entries()) {
      familykeys.push(key)
    }
    return html `
      <select name="device_family" id="device_family" style="padding: .6em; font-size: 1em;"
          .value=${optionvalue}
          @focusout=${this.configChanged}
          @change=${this.configChanged}
      >
        ${familykeys.map((family) => {
          var familyTranslatedName = this.translateToUsrLang(devicemap.get(family).meta.friendlyName);
          if(devicemap.get(family).meta.supported) {
            if (family == optionvalue) {
              return html`<option value="${family}" selected>${familyTranslatedName}</option> `
            }
            else {
              return html`<option value="${family}">${familyTranslatedName}</option> `
            }
          }
          else {
            return html`<option value="${family}" disabled>${familyTranslatedName}</option>`
          }
        })}
      </select>
      <br>
    `;
  }



  getMediaPlayerEntityDropdown(optionValue){
    if(['none'].includes(this._config.device_family)) { 
      this._config.entity = 'none';
      this.configChanged;
      return;
    }
    var mediaPlayerEntities = [];
    var heading = '';
    if(this._config.device_family == 'apple-tv') {
      mediaPlayerEntities = this.getMediaPlayerEntitiesByPlatform('apple_tv');
      heading = 'Apple TV Media Player '+ this.translateToUsrLang('Entity');
      heading = this.hass.config.language == 'he' || this.hass.config.language == 'fr' ? 
        this.translateToUsrLang('Entity') + ' Apple TV Media Player' : 'Apple TV Media Player '+ this.translateToUsrLang('Entity');
    }
    else if(this._config.device_family == 'roku') {
      mediaPlayerEntities = this.getMediaPlayerEntitiesByPlatform('roku');
      heading = this.hass.config.language == 'he' || this.hass.config.language == 'fr' ?
        this.translateToUsrLang('Entity') + ' Roku Media Player' : 'Roku Media Player '+ this.translateToUsrLang('Entity');
    }
    else {
      mediaPlayerEntities = this.getMediaPlayerEntitiesByPlatform('androidtv');
      heading = this.hass.config.language == 'he' || this.hass.config.language == 'fr' ? 
        this.translateToUsrLang('Entity') + ' Android Debug Bridge' : 'Android Debug Bridge '+ this.translateToUsrLang('Entity');
    }
    var blankEntity = '';
    if(this._config.entity == '' || !(mediaPlayerEntities).includes(optionValue)) {
      blankEntity = html `<option value="" selected> - - - - </option> `;
    }
    return html`
        ${heading}:<br>
        <select name="entity" id="entity" style="padding: .6em; font-size: 1em;" .value="${optionValue}"
            @focusout=${this.configChanged}
            @change=${this.configChanged} >
            ${blankEntity}
            ${mediaPlayerEntities.map((eid) => {
              if (eid != this._config.entity) {
                return html`<option value="${eid}">${this.hass.states[eid].attributes.friendly_name || eid}</option> `;
              }
              else {
                return html`<option value="${eid}" selected>${this.hass.states[eid].attributes.friendly_name || eid}</option> `;
              }
            })}
        </select>
        <br>
        <br>`
  }


  getAssociatedRemoteEntityDropdown(optionValue){
    if(['amazon-fire', 'none'].includes(this._config.device_family)) { return; }
    var blankRemoteEntity = '';
    var remoteEntities = [];
    var appleTVRemoteEntities = this.getRemoteEntitiesByPlatform('apple_tv');
    if(this._config.device_family == 'apple-tv') {
        var dropdownLabel = this.translateToUsrLang('Associated') + ' Apple TV Remote ' + this.translateToUsrLang('Entity');
        dropdownLabel = this.hass.config.language == 'he' ?  'ישות משויכת ל-' + 'Apple TV Remote ' : dropdownLabel;
        if(this._config.apple_tv_remote_entity == '' || typeof this._config.apple_tv_remote_entity == 'undefined') {
            blankRemoteEntity = html `<option value="" selected> - - - - </option> `;
        }
        remoteEntities = this.getRemoteEntitiesByPlatform('apple_tv');
        return html`
              ${dropdownLabel}:<br>
              <select name="apple_tv_remote_entity" id="apple_tv_remote_entity" style="padding: .6em; font-size: 1em;" .value=${optionValue}
                @focusout=${this.configChanged}
                @change=${this.configChanged} >
                ${blankRemoteEntity}
                ${remoteEntities.map((eid) => {
                  if (eid != this._config.apple_tv_remote_entity) {
                    return html`<option value="${eid}">${this.hass.states[eid].attributes.friendly_name || eid}</option> `;
                  }
                  else {
                    return html`<option value="${eid}" selected>${this.hass.states[eid].attributes.friendly_name || eid}</option> `;
                  }
                })}
              </select>
            <br>
            <br>`
    }
    if(this._config.device_family == 'roku') {
        var dropdownLabel = this.translateToUsrLang('Associated') + ' Roku Remote ' + this.translateToUsrLang('Entity');
        dropdownLabel = this.hass.config.language == 'he' ?  'ישות משויכת ל-' + 'Roku Remote ' : dropdownLabel;
        if(this._config.roku_remote_entity == '' || typeof this._config.roku_remote_entity == 'undefined') {
            blankRemoteEntity = html `<option value="" selected> - - - - </option> `;
        }
        remoteEntities = this.getRemoteEntitiesByPlatform('roku');
        return html`
              ${dropdownLabel}:<br>
              <select name="roku_remote_entity" id="roku_remote_entity" style="padding: .6em; font-size: 1em;" .value=${optionValue}
                @focusout=${this.configChanged}
                @change=${this.configChanged} >
                ${blankRemoteEntity}
                ${remoteEntities.map((eid) => {
                  if (eid != this._config.roku_remote_entity) {
                    return html`<option value="${eid}">${this.hass.states[eid].attributes.friendly_name || eid}</option> `;
                  }
                  else {
                    return html`<option value="${eid}" selected>${this.hass.states[eid].attributes.friendly_name || eid}</option> `;
                  }
                })}
              </select>
            <br>
            <br>`
    }
    else {
        var dropdownLabel = this.translateToUsrLang('Associated') + ' Android TV Remote ' + this.translateToUsrLang('Entity') + ': (' + this.translateToUsrLang('optional') + ')';
        dropdownLabel = this.hass.config.language == 'he' ?  'ישות משויכת ל-' + 'Android TV Remote ' : dropdownLabel;
        dropdownLabel = this.hass.config.language == 'fr' ?  'Entité Android TV Remote Associé (optionnel)' : dropdownLabel;
        if(this._config.androidTVRemoteEntity == '' || typeof this._config.androidTVRemoteEntity == 'undefined') {
            blankRemoteEntity = html `<option value="" selected> - - - - </option> `;
        }
        remoteEntities = this.getRemoteEntitiesByPlatform('androidtv_remote');
        return html`
              ${dropdownLabel}<br>
              <select name="android_tv_remote_entity" id="android_tv_remote_entity" style="padding: .6em; font-size: 1em;" .value=${optionValue}
                @focusout=${this.configChanged}
                @change=${this.configChanged} >
                ${blankRemoteEntity}
                ${remoteEntities.map((eid) => {
                  if (eid != this._config.android_tv_remote_entity) {
                    return html`<option value="${eid}">${this.hass.states[eid].attributes.friendly_name || eid}</option> `;
                  }
                  else {
                    return html`<option value="${eid}" selected>${this.hass.states[eid].attributes.friendly_name || eid}</option> `;
                  }
                })}
              </select>
            <br>
            <br>`
    }
  }


  getDeviceTypeDropdown(optionValue, dropdownLabel){
    if (this._config.device_family === 'none') {
      this._config.device_type = 'other';
      this._config.entity = 'none';
      delete this._config['apple_tv_remote_entity'];
      delete this._config['android_tv_remote_entity'];
      this.configChanged;
      return;
    }
    var family = this._config.device_family;
    var optionMenu = String();
    Object.entries(devices).forEach(deviceFamily => {
      const [familyKey,familyValue] = deviceFamily;
      if(familyKey == family) {
        var blankWasDisplayed = false;
        Object.entries(familyValue).forEach(deviceCategory => {
          const [categorykey,categoryvalue] = deviceCategory;
          if(categorykey == 'meta') {return}
          if(optionValue in categoryvalue) {blankWasDisplayed = true}
          if(!(optionValue in categoryvalue) && !(blankWasDisplayed)){
            optionMenu += '<option value="" selected disabled> - - - choose one - - - </option>';
            blankWasDisplayed = true;
          }
          if(categorykey != 'noCategory'){optionMenu += '<optgroup label="'+ categorykey + '">'}
          Object.entries(categoryvalue).forEach(deviceEntry => {
            const [devicekey,deviceproperties] = deviceEntry;
            if(deviceproperties.supported) {
              if(devicekey == this._config.device_type) {
                optionMenu += '<option value="'+ devicekey +'" selected>'+ deviceproperties.friendlyName +'</option>';
              }
              else {
                optionMenu += '<option value="'+ devicekey +'">'+ deviceproperties.friendlyName +'</option>';
              }
            }
            else {
              optionMenu += '<option value="'+ devicekey +'" disabled>'+ deviceproperties.friendlyName +'</option>';
            }
          })
          if(categorykey != 'noCategory'){optionMenu += '</optgroup>'}
        })
      }
    })
    return html `
      ${dropdownLabel}:<br>
      <select name="device_type" id="device_type" style="padding: .6em; font-size: 1em;"
        .value=${this._config.device_type}
        @focusout=${this.configChanged}
        @change=${this.configChanged}
      >
        ${unsafeHTML(optionMenu)}
      </select>
      <br>
      <br>
    `;
  }


  getCompatibilityModeDropdown(optionValue, deviceFriendlyName){
    if(['apple-tv', 'chromecast', 'homatics', 'nvidia-shield', 'onn', 'roku', 'none'].includes(this._config.device_family)) { return; }
    if(['xiaomi-tv-stick-4k', 'fire_tv_stick_4k_max_second_gen', 'fire_tv_stick_4k_second_gen'].includes(this._config.device_type)) { return; }
    var heading = this.translateToUsrLang('Compatibility Mode');
    return html`
        ${heading}:<br>
        <select name="compatibility_mode" id="compatibility_mode" style="padding: .6em; font-size: 1em;"
          .value=${optionValue}
          @focusout=${this.configChanged}
          @change=${this.configChanged}
        >
          <option value="default">${this.translateToUsrLang('Default for')} ${deviceFriendlyName}</option>
          <option value="strong">${this.translateToUsrLang('Strong (Slower)')}</option>
          <option value="event0">event0</option>
          <option value="event1">event1</option>
          <option value="event2">event2</option>
          <option value="event3">event3</option>
          <option value="event4">event4</option>
          <option value="event5">event5</option>
          <option value="event6">event6</option>
          <option value="event7">event7</option>
          <option value="event8">event8</option>
          <option value="event9">event9</option>
          <option value="event10">event10</option>
          <option value="event11">event11</option>
          <option value="event12">event12</option>
          <option value="event13">event13</option>
        </select>
        <br>
        <br>
    `;
  }


  getAppChoiceOptionMenus(remoteStyle) {
    if(['none'].includes(this._config.device_family)) { return; }
    var family = this._config.device_family;
    if(appButtonMax[remoteStyle]) {
      var appkeys = [];
      for (var [key, value] of appmap.entries()) {
        appkeys.push(key)
      }
      const optionsmap = new Map();
      for(let i=1; i<=appButtonMax[remoteStyle]; i++) {
        optionsmap.set(i, "app_launch_"+i);
      }
      var optionkeys = [];
      for (var [key, value] of optionsmap.entries()) {
        optionkeys.push(key)
      }

      return html `
        <br>
        ${optionkeys.map((optionnumber) => {
          var blankOption = html `<option value=""> - - - - </option>`;
          if(!(appmap.has(optionvalue))){
            blankOption = html `<option value="" selected> - - - - </option>`;
          }
          var heading = this.translateToUsrLang('App Launch Button');
          var optionvalue = this._config[optionsmap.get(optionnumber)];
          return html `
            ${heading} ${optionnumber}:
            <select name="app_launch_${optionnumber}" id="app_launch_${optionnumber}" style="padding: .6em; font-size: 1em;"
              .value=${optionvalue}
              @focusout=${this.configChanged}
              @change=${this.configChanged}
            >
              ${blankOption}
              ${appkeys.map((app) => {
               var userLanguageAppName = this.translateToUsrLang(appmap.get(app).friendlyName);
               if ((appmap.get(app).deviceFamily && appmap.get(app).deviceFamily.includes(family)) || !(appmap.get(app).deviceFamily)) {
                if (app != optionvalue) {
                  return html`<option value="${app}">${userLanguageAppName}</option> `
                }
                else {
                  return html`<option value="${app}" selected>${userLanguageAppName}</option> `
                }
               }
              })}
            </select>
            <br>
          `;
        })}
      `;
    }
  }

  getALConfigOptions(remoteStyle){
    if(remoteStyle && remoteStyle=="AL1"){
      return html `
        <label for="useCustomSkinCheckbox">
          <input type="checkbox" id="useCustomSkinCheckbox" name="useCustomSkin" ?checked=${this._config.useCustomSkin===true} @change=${this.configChanged}>&nbsp;
          ${this.translateToUsrLang('Custom Remote Skin')}:&nbsp;&nbsp;<input type="color" name="skin" id="skin" .value=${this._config.skin || '#4682b4'} @change=${this.configChanged}>
        </label>
        <br><br><hr><br>
      `;
    }
    if(remoteStyle && remoteStyle=="AL2"){
      return html `
        <label for="hideFramesCheckbox">
          <input type="checkbox" id="hideFramesCheckbox" name="hide_button_group_frame" ?checked=${this._config.hide_button_group_frame===true} @change=${this.configChanged}>&nbsp;
          ${this.translateToUsrLang('Hide frames around button groups')}
        </label>
        <br><br>
        <label for="useCustomSkinCheckbox">
          <input type="checkbox" id="useCustomSkinCheckbox" name="useCustomSkin" ?checked=${this._config.useCustomSkin===true} @change=${this.configChanged}>&nbsp;
          ${this.translateToUsrLang('Custom Remote Skin')}:&nbsp;&nbsp;<input type="color" name="skin" id="skin" .value=${this._config.skin || '#4682b4'} @change=${this.configChanged}>
        </label>
        <br><br>
          ${this.translateToUsrLang('DPad Style')}:
          <select name="dpad_style" id="dpad_style}" style="padding: .6em; font-size: 1em;"
          .value=${this._config.dpad_style || ''}
          @focusout=${this.configChanged}
          @change=${this.configChanged}
        >
          <option value="amazon-fire">Amazon Fire</option>
          <option value="apple-tv-black">Apple TV ${this.translateToUsrLang('black')}</option>
          <option value="apple-tv-silver">Apple TV ${this.translateToUsrLang('silver')}</option>
          <option value="chromecast">Chromecast</option>
          <option value="xiaomi">Xiaomi</option>
          <option value="minimal">${this.translateToUsrLang('Minimal')}</option>
        </select>
        <br><br><hr><br>
      `;
    }
  }

  getChromecastMediaControls(remoteStyle) {
    if (['CC1', 'CC2', 'CC3'].includes(remoteStyle)) {
        return html`
          <label for="showMediaControlsCheckbox">
            <input type="checkbox" id="showMediaControlsCheckbox" name="show_media_controls"
              ?checked=${this._config.show_media_controls === true} @change=${this.configChanged}>&nbsp; ${this.translateToUsrLang("Show Media Controls")}
          </label>
          <br>`;
    }
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    if(!this._config.device_family) {
        this._config.device_family = devicemap.keys().next().value;
    }

    var appLauncherRelativeScaleSlide = '';
    if(this._config.defaultRemoteStyle_override == 'AL2') {
      if(!(this._config.app_launcher_relative_size)) {
        this._config.app_launcher_relative_size = 0;
      }
      appLauncherRelativeScaleSlide = html `
        <br>
        <label for="relativefader">${this.translateToUsrLang('App Launcher Relative Scale')}:&nbsp;
          <input type="range" min="-25" max="75" .value=${this._config.app_launcher_relative_size} id="app_launcher_relative_size" name="app_launcher_relative_size" @change=${this.configChanged} style="width: 40ch;">
        </label>
        <br>`;
    }

    // Get current device's Attributes AND use any applicable overrides from user conf
    var confRef = this._config;
    function getDeviceAttribute(deviceAttribute){
      return deviceAttributeQuery(deviceAttribute, confRef);
    }

    // Rebuild AppMap - allow hdmi inputs where appropriate & add configured custom launchers from YAML
    refreshAppMap(this._config, getDeviceAttribute('hdmiInputs'), getDeviceAttribute('avInputs'), getDeviceAttribute('tuner'));

    var deviceModelSelectorLabel = devicemap.get(this._config.device_family).meta.friendlyName + ' ' + this.translateToUsrLang('Device Model');
    if (this.hass.config.language == 'he') {
      deviceModelSelectorLabel =  this.translateToUsrLang('Device Model') + ' ' + devicemap.get(this._config.device_family).meta.friendlyName;
    }

    if(this._config.device_type == null || this._config.device_type == '') {
      return html`
        ${this.translateToUsrLang('Device Family')}: <br>
        ${this.getDeviceFamiliesDropdown(this._config.device_family)}
        <br>

        ${this.getDeviceTypeDropdown(this._config.device_type, deviceModelSelectorLabel)}`;
    }
    else {

      return html`
        ${this.translateToUsrLang('Device Family')}: <br>
        ${this.getDeviceFamiliesDropdown(this._config.device_family)}
        <br>

        ${this.getDeviceTypeDropdown(this._config.device_type, deviceModelSelectorLabel)}

        ${this.getMediaPlayerEntityDropdown(this._config.entity)}

        ${this.getAssociatedRemoteEntityDropdown(this._config.android_tv_remote_entity)}

        <hr>

        <br>
        <label for="fader">${this.translateToUsrLang('Scale')}:&nbsp;
          <input type="range" min="20" max="120" .value=${this._config.scale} id="scale" name="scale" @change=${this.configChanged} style="width: 40ch;">
        </label>
        <br>
        ${appLauncherRelativeScaleSlide}

        <br>
        ${this.translateToUsrLang('Remote Style')}:<br>
        <select name="defaultRemoteStyle_override" id="defaultRemoteStyle_override" style="padding: .6em; font-size: 1em;"
          .value=${this._config.defaultRemoteStyle_override || ''}
          @focusout=${this.configChanged}
          @change=${this.configChanged}
        >
          <option value="">${this.translateToUsrLang('Default for')} ${getDeviceAttribute('friendlyName')}</option>
          <option value="AF1">Amazon Fire ${this.translateToUsrLang('style')} 1</option>
          <option value="AF2">Amazon Fire ${this.translateToUsrLang('style')} 2</option>
          <option value="AF3">Amazon Fire ${this.translateToUsrLang('style')} 3</option>
          <option value="AF4">Amazon Fire ${this.translateToUsrLang('style')} 4</option>
          <option value="AF5">Amazon Fire ${this.translateToUsrLang('style')} 5</option>
          <option value="AF6">Amazon Fire ${this.translateToUsrLang('style')} 6</option>
          <option value="AFJTV">Amazon Fire JVC TV</option>
          <option value="AFXF2">Amazon Fire Xiaomi F2</option>
          <option value="AR1">Apple TV ${this.translateToUsrLang('remote style')} 1</option>
          <option value="AR2">Apple TV ${this.translateToUsrLang('remote style')} 2</option>
          <option value="AR3">Apple TV ${this.translateToUsrLang('remote style')} 3</option>
          <option value="CC1">Chromecast (snow)</option>
          <option value="CC2">Chromecast (sky)</option>
          <option value="CC3">Chromecast (sunrise)</option>
          <option value="HO1">Homatics ${this.translateToUsrLang('style')} 1</option>
          <option value="HO2">Homatics ${this.translateToUsrLang('style')} 2</option>
          <option value="HO3">Homatics ${this.translateToUsrLang('style')} 3</option>
          <option value="HO4">Homatics ${this.translateToUsrLang('style')} 4</option>
          <option value="NS1">NVIDIA Shield ${this.translateToUsrLang('style')} 1</option>
          <option value="NS2">NVIDIA Shield ${this.translateToUsrLang('style')} 2</option>
          <option value="ON1">onn. ${this.translateToUsrLang('style')} 1</option>
          <option value="ON2">onn. ${this.translateToUsrLang('style')} 2</option>
          <option value="RVRP">Roku Voice ${this.translateToUsrLang('remote')} Pro</option>
          <option value="RVR">Roku Voice ${this.translateToUsrLang('remote')}</option>
          <option value="RSR">Roku Simple ${this.translateToUsrLang('remote')}</option>
          <option value="RHR">Hisense Roku TV ${this.translateToUsrLang('remote')}</option>
          <option value="RTR">TCL Roku TV ${this.translateToUsrLang('remote')}</option>
          <option value="RWR">Westinghouse Roku TV ${this.translateToUsrLang('remote')}</option>
          <option value="XM1">Xiaomi Mi ${this.translateToUsrLang('style')} 1</option>
          <option value="XM2">Xiaomi Mi ${this.translateToUsrLang('style')} 2</option>
          <option value="AL1">${this.translateToUsrLang('App Launcher')} 1</option>
          <option value="AL2">${this.translateToUsrLang('App Launcher')} 2</option>
        </select>
        <br>
        <br>
        ${this.getChromecastMediaControls(getDeviceAttribute("defaultRemoteStyle"))}

        ${this.getCompatibilityModeDropdown(this._config.compatibility_mode, getDeviceAttribute('friendlyName'))}

        ${this.getAppChoiceOptionMenus(getDeviceAttribute("defaultRemoteStyle"))}
        <br>
        <hr>
        <br>
        ${this.getALConfigOptions(getDeviceAttribute("defaultRemoteStyle"))}

        <label for="visible_name_text">${this.translateToUsrLang('Visible Device Name')}:<br>
          <input type="text" maxlength="15" .value=${ this._config.visible_name_text || ''} id="visible_name_text" name="visible_name_text" @change=${this.configChanged} @focusout=${this.configChanged} @keyup=${this.configChanged} style="padding: .6em; font-size: 1em; width: 10rem;">
        </label>
        <br>
        <br>
        ${this.translateToUsrLang('Name Position')}:<br>
        <select name="name_position" id="name_position" .value=${this._config.name_position || 'hidden'} @focusout=${this.configChanged} @change=${this.configChanged}  style="padding: .6em; font-size: 1em;">
          <option value="hidden" selected>${this.translateToUsrLang('hidden')}</option>
          <option value="top">${this.translateToUsrLang('top')}</option>
          <option value="bottom">${this.translateToUsrLang('bottom')}</option>
        </select><br>
        <br>
        <label for="visible_name_text_color">${this.translateToUsrLang('Device Name Text Color')}:<br><input type="color" name="visible_name_text_color" id="visible_name_text_color" .value=${this._config.visible_name_text_color || '#000000'} @change=${this.configChanged}></label>

    `;
   }
  }
}

customElements.define("firemote-card-editor", FiremoteCardEditor);
