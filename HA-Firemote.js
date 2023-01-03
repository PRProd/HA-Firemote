import { LitElement, html, css } from "https://unpkg.com/lit?module";

// https://developer.amazon.com/docs/fire-tv/device-specifications-comparison-table.html

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


const fastappchoices = {
  "amc-plus": {
      "button": "amc+",
      "friendlyName": "AMC+",
      "appName": "com.amcplus.amcfiretv",
      "className": "amcPlusButton",
      "androidName": "com.amcplus.amcfiretv",
      "adbLaunchCommand": "adb shell am start -n com.amcplus.amcfiretv/com.amcplus.tv.MainActivity" },

  "apple-tv": {
      "button": "Apple TV",
      "friendlyName": 'Apple TV',
      "appName": "Apple TV+ (Fire TV)",
      "className": "appleTvButton",
      "androidName": "com.apple.atve.amazon.appletv",
      "adbLaunchCommand": "adb shell am start -n com.apple.atve.amazon.appletv/.MainActivity" },

  "bbc-iplayer": {
      "button": "BBC iPlayer",
      "friendlyName": 'BBC iPlayer (UK)',
      "appName": "uk.co.bbc.iplayer",
      "className": "bbciplayerButton",
      "androidName": "uk.co.bbc.iplayer" },

  "bell-fibe-tv": {
      "button": "Bell Fibe TV",
      "friendlyName": 'Bell Fibe TV (Canada)',
      "appName": "ca.bell.tv.firetv",
      "className": "bellFibeTVButton",
      "androidName": "ca.bell.tv.firetv",
      "adbLaunchCommand": "adb shell am start -n ca.bell.tv.firetv/ca.bell.fiberemote.tv.MainTvActivity" },

  "cnn": {
      "button": "CNN",
      "friendlyName": 'CNN',
      "appName": "com.cnn.mobile.fire.tv",
      "className": "cnnButton",
      "androidName": "com.cnn.mobile.fire.tv",
      "adbLaunchCommand": "adb shell am start -n com.cnn.mobile.fire.tv/com.cnnplusrn.MainActivity" },

  "crave-tv": {
      "button": "crave",
      "friendlyName": 'Crave TV (Canada)',
      "appName": "ca.bellmedia.cravetv",
      "className": "craveTVButton",
      "androidName": "ca.bellmedia.cravetv",
      "adbLaunchCommand": "adb shell am start -n ca.bellmedia.cravetv/axis.androidtv.sdk.app.MainActivity" },

  "cyberghost": {
      "button": "CyberGhost",
      "friendlyName": 'CyberGhost VPN',
      "appName": "com.cyberghostvpn.amazon",
      "className": "cyberghostButton",
      "androidName": "com.cyberghostvpn.amazon",
      "adbLaunchCommand": "adb shell am start -n com.cyberghostvpn.amazon/de.mobileconcepts.cyberghost.view.app.AppActivity" },

  "disney-plus": {
      "button": "Disney+",
      "friendlyName": "Disney +",
      "appName": "Disney+",
      "className": "disneyPlusButton",
      "androidName": "com.disney.disneyplus",
      "adbLaunchCommand": "adb shell am start -n com.disney.disneyplus/com.bamtechmedia.dominguez.main.MainActivity" },

  "emby": {
      "button": "emby",
      "friendlyName": "Emby",
      "appName": "tv.emby.embyatv",
      "className": "embyButton",
      "androidName": "tv.emby.embyatv" },

  "hbo-max": {
      "button": "HBO max",
      "friendlyName": "HBO Max",
      "appName": "com.hbo.hbonow",
      "className": "hboMaxButton",
      "androidName": "com.hbo.hbonow",
      "adbLaunchCommand": "adb shell am start -n com.hbo.hbonow/com.hbo.max.HboMaxActivity" },

  "hulu": { 
      "button": "hulu",
      "friendlyName": "Hulu",
      "appName": "Hulu",
      "className": "huluButton",
      "androidName": "com.hulu.plus" },

  "jellyfin": {
      "button": "Jellyfin",
      "friendlyName": "Jellyfin",
      "appName": "Jellyfin",
      "className": "jellyfinButton",
      "androidName": "org.jellyfin.androidtv" },

  "netflix": {
      "button": "NETFLIX",
      "friendlyName": "Netflix",
      "appName": "Netflix",
      "className": "netflixButton",
      "androidName": "com.netflix.ninja",
      "adbLaunchCommand": "adb shell am start -n com.netflix.ninja/.MainActivity" },

  "news": {
      "button": "news",
      "friendlyName": "News by Fire TV",
      "appName": "com.amazon.hedwig",
      "className": "newsButton",
      "androidName": "com.amazon.hedwig" },

  "nordvpn": {
      "button": "NordVPN",
      "friendlyName": "Nord VPN",
      "appName": "com.nordvpn.android",
      "className": "nordVPNButton",
      "androidName": "com.nordvpn.android",
      "adbLaunchCommand": "adb shell am start -n com.nordvpn.android/.MainActivity" },

  "pandora": {
      "button": "pandora",
      "friendlyName": "Pandora",
      "appName": "com.pandora.android.gtv",
      "className": "pandoraButton",
      "androidName": "com.pandora.android.gtv" },

  "paramount-plus": {
      "button": "Paramount+",
      "friendlyName": 'Paramount+',
      "appName": "com.cbs.ott",
      "className": "paramountPlusButton",
      "androidName": "com.cbs.ott",
      "adbLaunchCommand": "adb shell am start -n com.cbs.ott/com.cbs.app.tv.ui.activity.DeepLinkActivity" },

  "plex": {
      "button": "Plex",
      "friendlyName": "plex",
      "appName": "Plex",
      "className": "plexButton",
      "androidName": "com.plexapp.android" },

  "prime-video" : {
      "button": "prime video",
      "friendlyName": "Prime Video",
      "appName": "Prime Video (FireTV)",
      "className": "primeButton",
      "androidName": "com.amazon.avod",
      "androidName2": "com.amazon.firebat",
      "adbLaunchCommand": "adb shell am start com.amazon.firebat/.deeplink.DeepLinkRoutingActivity" },

  "shophq": {
      "button": "ShopHQ",
      "friendlyName": "ShopHQ",
      "appName": "com.amazon.rialto.cordova.webapp.webappb656e5788fd9475ea16e928d2c034d68",
      "className": "shopHQButton",
      "androidName": "com.amazon.rialto.cordova.webapp.webappb656e5788fd9475ea16e928d2c034d68",
      "adbLaunchCommand": "adb shell am start -n com.amazon.rialto.cordova.webapp.webappb656e5788fd9475ea16e928d2c034d68/.MainActivity" },

  "showtime": {
      "button": "SHOWTIME",
      "friendlyName": "Showtime",
      "appName": "com.showtime.standalone",
      "className": "showtimeButton",
      "androidName": "com.showtime.standalone",
      "adbLaunchCommand": "adb shell am start -n com.showtime.standalone/com.showtime.showtimeanytime.activities.IntroActivity" },

  "spotify": {
      "button": "Spotify",
      "friendlyName": "Spotify",
      "appName": "com.spotify.tv.android",
      "className": "spotifyButton",
      "androidName": "com.spotify.tv.android",
      "adbLaunchCommand": "adb shell am start -n com.spotify.tv.android/com.spotify.tv.android.SpotifyTVActivity" },

  "starz": {
      "button": "STARZ",
      "friendlyName": "Starz",
      "appName": "com.starz.starzplay.firetv",
      "className": "starzButton",
      "androidName": "com.starz.starzplay.firetv" },

  "tennis-channel": {
      "button": "TENNIS CHANNEL",
      "friendlyName": "Tennis Channel",
      "appName": "com.tennischannel.tceverywhere.amazon",
      "className": "tennisChannelButton",
      "androidName": "com.tennischannel.tceverywhere.amazon" },

  "twitch": {
      "button": "Twitch",
      "friendlyName": 'Twitch',
      "appName": "Twitch (FireTV)",
      "className": "twitchButton",
      "androidName": "tv.twitch.android.viewer",
      "adbLaunchCommand": "adb shell am start -n tv.twitch.android.viewer/tv.twitch.starshot64.app.StarshotActivity" },

  "waipuTV": {
      "button": "Waipu TV",
      "friendlyName": "Waipu TV (DE)",
      "appName": "Waipu TV",
      "className": "waipuTVButton",
      "androidName": "de.exaring.waipu.firetv.live" },


  "youtube": {
      "button": "YouTube",
      "friendlyName": "YouTube",
      "appName": "YouTube (FireTV)",
      "className": "youtubeButton",
      "androidName": "com.amazon.firetv.youtube",
      "adbLaunchCommand": "adb shell am start -n com.amazon.firetv.youtube/dev.cobalt.app.MainActivity" },

  "youtubeTV": {
      "button": "YouTubeTV",
      "friendlyName": "YouTubeTV",
      "appName": "com.amazon.firetv.youtube.tv",
      "className": "youtubeTVButton",
      "androidName": "com.amazon.firetv.youtube.tv",
      "adbLaunchCommand": "adb shell am start -n com.amazon.firetv.youtube.tv/dev.cobalt.app.MainActivity" },

  "vlc": {
      "button": "VLC",
      "friendlyName": "VLC",
      "appName": "org.videolan.vlc",
      "className": "vlcButton",
      "androidName": "org.videolan.vlc" },

  "xfinityStream": {
      "button": "Xfinity Stream",
      "friendlyName": "Xfinity Stream",
      "appName": "com.xfinity.cloudtvr.tenfoot",
      "className": "xfinityStreamButton",
      "androidName": "com.xfinity.cloudtvr.tenfoot" },

  "zattoo": {
      "button": "Zattoo",
      "friendlyName": "Zattoo",
      "appName": "com.zattoo.player.firetv",
      "className": "zattooButton",
      "androidName": "com.zattoo.player.firetv" },

};
const appmap = new Map(Object.entries(fastappchoices));


function truncate(str, length) {
  return str.length > length ? str.substr(0, length) : str;
}

function handlehdmi(config) {
  appmap.delete('hdmi_1');
  appmap.delete('hdmi_2');
  appmap.delete('hdmi_3');
  appmap.delete('hdmi_4');
  if( config.device_type == 'fire_tv_cube_third_gen') {
    if( config.hdmi_1 ) {
      const inputname = truncate(config.hdmi_1, 8);
      appmap.set("hdmi_1", {"button": truncate(inputname, 8), "friendlyName": "HDMI - "+inputname, "androidName": "", "adbLaunchCommand": "adb shell am start -n com.amazon.tv.inputpreference.service/com.amazon.tv.inputpreference.player.InputChooserActivity"});
    }
  }
  if( config.device_type == 'fire_tv_4_series') {
    if( config.hdmi_1 ) {
      const inputname = truncate(config.hdmi_1, 8);
      appmap.set("hdmi_1", {"button": truncate(inputname, 8), "friendlyName": "HDMI 1 - "+inputname, "androidName": "", "adbLaunchCommand": "HDMI1"});
    }
    if( config.hdmi_2 ) {
      const inputname = config.hdmi_2;
      appmap.set("hdmi_2", {"button": truncate(inputname, 8), "friendlyName": "HDMI 2 - "+inputname, "androidName": "", "adbLaunchCommand": "HDMI2"});
    }
    if( config.hdmi_3 ) {
      const inputname = config.hdmi_3;
      appmap.set("hdmi_3", {"button": truncate(inputname, 8), "friendlyName": "HDMI 3 - "+inputname, "androidName": "", "adbLaunchCommand": "HDMI3"});
    }
    if( config.hdmi_4 ) {
      const inputname = config.hdmi_4;
      appmap.set("hdmi_4", {"button": truncate(inputname, 8), "friendlyName": "HDMI 4 - "+inputname, "androidName": "", "adbLaunchCommand": "HDMI4"});
    }
  }
}



class FiremoteCard extends LitElement {

  static getConfigElement() {
    // Create and return an editor element
    return document.createElement("firemote-card-editor");
  }


  static get properties() {
    return {
      hass: {},
      _config: {},
    };
  }

  static getStubConfig() {
    // Return a minimal configuration that will result in a working card configuration
    return { 'entity': '',
             'device_type': 'fire_tv_4_series',
             'compatibility_mode': 'default',
             'app_launch_1': 'prime-video',
             'app_launch_2': 'netflix',
             'app_launch_3': 'disney-plus',
             'app_launch_4': 'hulu',
           };
  }

  setConfig(config) {
    if (!config.entity) {
     throw new Error('You need to define a Fire TV or Android TV entity');
    }
    this._config = config;
  }

  static styles = css`

          ha-card {
            background: rgba(30,30,30,0); 
            width: max-content; 
            padding: 0; 
            margin: auto;
            box-shadow: none;
            border: 0;
            outline: 0;
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

          .three-col-span {
            grid-column-start: 1;
            grid-column-end: 4;
            width: 100%;
            display: grid;
            grid-column-gap: calc(var(--sz) * 0.143rem);
            grid-template-columns: 50% 50%;
            align-content: center;
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

          .notch {
            background: #181818;
            height: calc(var(--sz) * 1rem);
            width: calc(var(--sz) * 0.4rem);
            margin-top: calc(var(--sz) * -0.5rem);
            border-radius: calc(var(--sz) * 0.2rem);
          }

          .notchtall {
            margin-bottom: calc(var(--sz) * 1.65rem);
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
          }

          .centerbutton{
            all: unset;
            border: solid black calc(var(--sz) * 0.0714rem);
            margin-left: calc(var(--sz) * 2.357rem);
            margin-top: calc(var(--sz) * 2.357rem);
            width: calc(var(--sz) * 6.428rem);
            height: calc(var(--sz) * 6.428rem);
            border-radius: 100%;
            position: absolute;
            background: rgba(55,55,55,1);
            box-shadow: inset 0 0.calc(var(--sz) * 2857rem) calc(var(--sz) * 0.1428rem) calc(var(--sz) * -0.1428rem) #000000d9;
            z-index: 2;
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

          .dpadbutton{
            all: unset;
            width: calc(var(--sz) * 5.5714rem);
            height: calc(var(--sz) * 5.5714rem);
            background: #141414;
            color: white;
            outline: solid #2e2e2e calc(var(--sz) * 0.0714rem);
          }

          .dpadbutton:active {
            background: #282828;
          }

          .centerbutton:active {
            transform: scale(95%);
          }

          .remote-button:active {
            box-shadow: inset rgb(0 0 0 / 13%) 0 calc(var(--sz) * 0.2857rem) calc(var(--sz) * 0.1428rem) 0;
          }

          .remote-button > ha-icon {
            color: #c6c6c6;
          }

          .remote-button:active > ha-icon {
            color: #bcbcbc;
            transform: scale(calc(var(--sz) * 0.85));
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

          .square:active, .round-bottom:active {
              box-shadow: none;
          }

          .srcButton {
            margin-top: calc(var(--sz) * 0.57rem);
            height: calc(var(--sz) * 2rem);
            width: calc(var(--sz) * 5.714rem);
            border: solid #090909 calc(var(--sz) * 0.0714rem);
            border-radius: calc(var(--sz) * 2rem);
            display: grid;
            justify-items: center;
            align-content: center;
            color: rgb(198 198 198);
            background: rgb(33 33 33);
            box-shadow: rgb(0 0 0 / 13%) 0 calc(var(--sz) * 0.214rem) calc(var(--sz) * 0.1428rem) 0;
            cursor: pointer;
            line-height: normal;
            user-select: none;
            font-size: calc(var(--sz) * 1.14rem);
            padding: calc(var(--sz) * 0.285rem);
            overflow: hidden;
          }

          .srcButton:active {
            transform: scale(0.9);
            box-shadow: none !important;
          }


          .amcPlusButton {
            color: #51ceff;
            font-weight: bold;
            background: #091c3d;
            filter: grayscale(50%) brightness(80%);
          }
          .amcPlusButton:active, .amcPlusButton.appActive {
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
            filter: none;
          }

          .appleTvButton {
            font-size: calc(var(--sz) * 1rem);
            color: #fff;
            font-weight: bold;
            background: #000;
            filter: brightness(50%);
          }
          .appleTvButton:active, .appleTvButton.appActive {
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
            filter: none;
          }

          .bbciplayerButton {
            color: rgb(255 255 255);
            font-size: calc(var(--sz) * 0.78rem);
            background: linear-gradient(120deg, rgba(52,3,61,1) 0%, rgba(183,14,209,1) 100%);
            filter: grayscale(10%) brightness(80%);
          }
          .bbciplayerButton:active, .bbciplayerButton.appActive {
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
            filter: none;
          }

          .bellFibeTVButton {
            color: rgb(255 255 255);
            font-size: calc(var(--sz) * 0.78rem);
            background: linear-gradient(180deg, rgba(71,86,255,1) 0%, rgba(46,62,234,1) 100%);
            filter: grayscale(10%) brightness(80%);
          }
          .bellFibeTVButton:active, .bellFibeTVButton.appActive {
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
            filter: none;
          }

          .cnnButton {
            color: rgb(255 255 255);
            font-size: calc(var(--sz) * 1.25rem);
            background: linear-gradient(0deg, rgba(110,0,0,1) 0%, rgba(227,0,0,1) 100%);
            filter: grayscale(10%) brightness(80%);
          }
          .cnnButton:active, .cnnButton.appActive {
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
            filter: none;
          }

          .craveTVButton {
            color: #00c1f3;
            background: #0a2aaa;
            font-size: calc(var(--sz) * 1.3rem);
            font-weight: bold;
            filter: grayscale(20%) brightness(60%);
          }
          .craveTVButton:active, .craveTVButton.appActive {
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
            filter: none;
          }

          .cyberghostButton {
            font-size: calc(var(--sz) * 0.8rem);
            background: #242538;
            color: #fc0;
            filter: grayscale(20%) brightness(60%);
          }
          .cyberghostButton:active, .cyberghostButton.appActive {
            filter: none;
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
          }

          .disneyPlusButton {
            color: #c6c6c6;
            background: #1a1f28;
          }
          .disneyPlusButton:active, .disneyPlusButton.appActive {
            color: #d1f8ff;
            background: #07183f;
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
          }

          .embyButton {
            font-size: calc(var(--sz) * 1.2rem);
            color: #FFF;
            font-weight: bold;
            background: #4CAF50;
            text-shadow: black 0px 1px 1px, black 1px 0px 1px, black 0px 0px 2px;
            filter: grayscale(20%) brightness(60%);
          }
          .embyButton:active, .embyButton.appActive {
            filter: none;
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
          }

          .hboMaxButton {
            color: #c6c6c6;
            font-size: calc(var(--sz) * 0.9285rem);
            background: linear-gradient(90deg, rgba(44,8,60,1) 0%, rgba(23,4,51,1) 100%);
          }
          .hboMaxButton:active, .hboMaxButton.appActive {
            color: #fff;
            background: linear-gradient(80deg, #73109E 0%, #2F0B62 100%);
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
          }

          .huluButton {
            color: #c6c6c6;
            background: #151e19;
          }
          .huluButton:active, .huluButton.appActive {
            color: #000;
            background: #1ce783;
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
          }

          .jellyfinButton {
            color: #c6c6c6;
            background: linear-gradient(90deg, rgba(62,34,71,1) 0%, rgba(0,60,80,1) 100%);
          }
          .jellyfinButton:active, .jellyfinButton.appActive {
            color: #fff;
            background: linear-gradient(90deg, rgba(112,62,128,1) 0%, rgba(0,108,144,1) 100%);
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
          }

          .netflixButton {
            font-weight: bold;
            font-size: calc(var(--sz) * 1rem);
            color: #6d2427;
            background: #878787;
          }
          .netflixButton:active, .netflixButton.appActive {
            color: #d30a14;
            background: #fff;
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 15%);
          }

          .newsButton {
            font-weight: bold;
            font-size: calc(var(--sz) * 1.4rem);
            text-shadow: 0 0 calc(var(--sz) * 0.5rem) black;
            color: #ffffff;
            background: linear-gradient(45deg, rgba(255,184,81,1) 31%, rgba(202,21,205,1) 100%);
            filter: brightness(75%);
          }
          .newsButton:active, .newsButton.appActive {
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 15%);
            filter: none;
          }

          .nordVPNButton {
            font-weight: bold;
            font-size: calc(var(--sz) * 1rem);
            text-shadow: 0 0 calc(var(--sz) * 0.5rem) black;
            color: #ffffff;
            background: #64c1ff;
            filter: grayscale(20%) brightness(50%);
          }
          .nordVPNButton:active, .nordVPNButton.appActive {
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 15%);
            filter: none;
          }

          .pandoraButton {
            font-size: calc(var(--sz) * 1rem);
            color: #919191;
            font-weight: bold;
            background: #304b9b
          }
          .pandoraButton:active, .pandoraButton.appActive {
            color: #fff;
            background: #3668ff;
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
          }

          .paramountPlusButton {
            font-size: calc(var(--sz) * 0.7857rem);
            color: #fff;
            font-weight: bold;
            background: #0667fc;
            filter: grayscale(50%) brightness(80%);
          }
          .paramountPlusButton:active, .paramountPlusButton.appActive {
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
            filter: none;
          }

          .plexButton {
            color: #919191;
            font-weight: bold;
            background: #000;
            display: inline;
          }
          .plexButton:active, .plexButton.appActive {
            color: #fff;
            background: #000;
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
          }
          .plexButton.appActive::after {
            content: '>';
            color: yellow;
          }

          .primeButton {
            color: #c6c6c6;
            background: #293942;
            font-size: calc(var(--sz) * 0.857rem);
          }
          .primeButton:active, .primeButton.appActive {
            color: #fff;
            text-shadow: 0 0 calc(var(--sz) * 0.214rem) black;
            background: #53a3d1;
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.1428rem) rgb(255 255 255 / 15%);
          }

          .shopHQButton {
            color: yellow;
            background: #000;
            font-weight: bold;
            filter: grayscale(30%) brightness(70%);
            font-size: calc(var(--sz) * 0.857rem);
          }
          .shopHQButton:active, .shopHQButton.appActive {
            color: #000;
            background: yellow;
            filter: none;
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
          }

          .showtimeButton {
            color: #6d0000;
            font-size: calc(var(--sz) * 0.7857rem);
            background: black;
          }
          .showtimeButton:active, .showtimeButton.appActive {
            color: #b10000;
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
          }

          .spotifyButton {
            color: #000;
            background: #fff;
            filter: brightness(50%);
            font-weight: bold;
          }
          .spotifyButton:active, .spotifyButton.appActive {
            color: rgb(23 163 73);
            filter: none;
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
          }

          .starzButton {
            font-size: calc(var(--sz) * 1rem);
            color: #9abc00;
            background: linear-gradient(99deg, rgba(16,65,69,1) 0%, rgba(8,31,33,1) 40%, rgba(13,71,75,1) 80%, rgba(16,60,64,1) 100%);
          }
          .starzButton:active, .starzButton.appActive {
            color: #d2ff00;
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
            background: linear-gradient(99deg, rgba(26,101,107,1) 0%, rgba(16,62,66,1) 40%, rgba(22,122,130,1) 80%, rgba(26,101,107,1) 100%);
          }

          .tennisChannelButton {
            color: #919191;
            font-size: calc(var(--sz) * 0.6428rem);
            font-weight: bold;
            background: linear-gradient(180deg, rgba(24,74,49,1) 0%, rgba(8,36,21,1) 100%);
          }
          .tennisChannelButton:active, .tennisChannelButton.appActive {
            color: #fff;
            background: linear-gradient(180deg, rgba(40,131,85,1) 0%, rgba(16,73,43,1) 100%);
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
          }

          .twitchButton {
            font-size: calc(var(--sz) * 1rem);
            color: #fff;
            font-weight: bold;
            background: #6441a5;
            filter: brightness(50%);
          }
          .twitchButton:active, .twitchButton.appActive {
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
            filter: none;
          }

          .waipuTVButton {
            font-size: calc(var(--sz) * 0.85rem);
            line-height: 0.75rem;
            color: #fff;
            font-weight: bold;
            background: linear-gradient(to right,#30182d 0,#0f2c4c 100%);
            filter: brightness(75%);
          }
          .waipuTVButton:active, .waipuTVButton.appActive {
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
            filter: none;
          }


          .xfinityStreamButton {
            font-size: calc(var(--sz) * 0.85rem);
            line-height: 0.75rem;
            color: #fff;
            font-weight: bold;
            background: linear-gradient(150deg, rgba(59,48,173,1) 0%, rgba(101,168,250,1) 100%);
            filter: brightness(75%);
          }
          .xfinityStreamButton:active, .xfinityStreamButton.appActive {
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
            filter: none;
          }

          .youtubeButton {
            font-size: calc(var(--sz) * 1rem);
            color: #919191;
            font-weight: bold;
            background: rgb(74 0 0);
          }
          .youtubeButton:active, .youtubeButton.appActive {
            color: #ffffff;
            background: rgb(199 0 0);
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
            text-shadow: 0 0 calc(var(--sz) * 0.2857rem) black;
          }

          .youtubeTVButton {
            font-size: calc(var(--sz) * .8rem);
            color: #ffffff;
            font-weight: bold;
            background: #000000;
            filter: brightness(50%);
          }
          .youtubeTVButton:active, .youtubeTVButton.appActive {
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
            filter: none;
          }


          .vlcButton {
            font-size: calc(var(--sz) * 1.25rem);
            color: #FFF;
            font-weight: bold;
            background: #f48b00;
            text-shadow: black 0px 1px 1px, black 1px 0px 1px, black 0px 0px 2px;
            filter: grayscale(20%) brightness(70%);
          }
          .vlcButton:active, .vlcButton.appActive {
            filter: none;
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
          }

          .zattooButton {
            font-size: calc(var(--sz) * 1rem);
            color: #FFF;
            font-weight: bold;
            background: #000;
            filter: brightness(60%);
          }
          .zattooButton:active, .zattooButton.appActive {
            filter: none;
            box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.142rem) rgb(255 255 255 / 20%);
          }


          .remote-logo {
            grid-column-start: 1;
            grid-column-end: 4;
            padding: calc(var(--sz) * 2.5rem) calc(var(--sz) * 2.357rem) 0 calc(var(--sz) * 2.357rem);
            width: calc(var(--sz) * 7.5714rem);
          }

          .litbutton {
              border: solid #4b4c3c 0.0714rem;
              box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.0714rem) rgb(255 255 25 / 15%);
          }
          .litbutton > ha-icon {
            color: yellow !important;
          }

          .dimlitbutton {
              border: solid #34342b calc(var(--sz) * 0.0714rem);
              box-shadow: 0 0 calc(var(--sz) * 0.857rem) calc(var(--sz) * 0.0714rem) rgb(255 255 116 / 15%);
          }
          .dimlitbutton > ha-icon {
            color: #e5e59a !important;
          }

          ha-icon {
            pointer-events: none;
            transform: scale(var(--sz));
          }
 
          .eightygap {
            height: calc(var(--sz) * 5.7143rem);
          }
  `;


    getOpenAppID() {
      return this.hass.states[this._config.entity].attributes.app_id;
    }

   render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    // allow hdmi inputs where appropriate
    handlehdmi(this._config)

    const stateObj = this.hass.states[this._config.entity];
    if (!stateObj) {
      return html` <ha-card>Unknown entity: ${this._config.entity}</ha-card> `;
    }

    const entityId = this._config.entity;
    const state = this.hass.states[entityId];
    const stateStr = state ? state.state : 'off';
    const appId = state.attributes.app_id;
    const deviceType = this._config.device_type;
    const scale = (parseInt(this._config.scale) || 100)/100;
    const scaleCss = html`<style> :host { --sz: ${scale} } </style>`;

    // Determine Power On/Off Status
    var powerStatusClass = ''
    if(stateStr != 'off' && stateStr != 'unavailable') {
      powerStatusClass = ' litbutton';
    }
    if(stateStr == 'standby') {
      powerStatusClass = ' dimlitbutton';
    }

    // Determine Home Status
    var homeStatusClass = '';
    if(appId == 'com.amazon.tv.launcher') {
      homeStatusClass = ' litbutton';
    }

    // Determine Play/Pause
    var playingStatusClass = '';
    if(stateStr == 'playing' && appId != 'com.amazon.firebat') {
      playingStatusClass = ' litbutton';
    }


    function getAppButtonData(configvalue, want) {

      if(appmap.has(configvalue)) {
        if(want=="active") {
          if (typeof appId != 'string') { return };
          return (appId == appmap.get(configvalue).androidName || appId == appmap.get(configvalue).androidName2) ? "appActive" : "";
        }
        else {
          return appmap.get(configvalue)[want];
        }
      }
      else {
        return ' ';
        //return configvalue; //This will return the raw button name
      }
    }

    function drawAppLaunchButtons(e, config) {
        var confBtnOne =   config.app_launch_1 || 'prime-video';
        var confBtnTwo =   config.app_launch_2 || 'netflix';
        var confBtnThree = config.app_launch_3 || 'disney-plus';
        var confBtnFour =  config.app_launch_4 || 'hulu';
        var fiveAndSix = '';
        if(config.app_launch_5 || config.app_launch_6) {
          var confBtnFive = config.app_launch_5 || '';
          var confBtnSix =  config.app_launch_6 || '';
          var fiveAndSix = html `
            <div class="three-col-span">
              <button class="srcButton ${getAppButtonData(confBtnFive, 'className')} ${getAppButtonData(confBtnFive, 'active')}"
                      id="${confBtnFive}-button" @click=${e.buttonClicked}>
                ${getAppButtonData(confBtnFive, 'button')}
              </button>
              <button class="srcButton ${getAppButtonData(confBtnSix, 'className')} ${getAppButtonData(confBtnSix, 'active')}"
                      id="${confBtnSix}-button" @click=${e.buttonClicked}>
                ${getAppButtonData(confBtnSix, 'button')}
              </button>
            </div>
          `
        }
        return html`
          <div class="three-col-span">
            <button class="srcButton ${getAppButtonData(confBtnOne, 'className')} ${getAppButtonData(confBtnOne, 'active')}" 
                    id="${confBtnOne}-button" @click=${e.buttonClicked}>
              ${getAppButtonData(confBtnOne, 'button')}
            </button>
            <button class="srcButton ${getAppButtonData(confBtnTwo, 'className')} ${getAppButtonData(confBtnTwo, 'active')}" 
                    id="${confBtnTwo}-button" @click=${e.buttonClicked}>
              ${getAppButtonData(confBtnTwo, 'button')}
            </button>
          </div>

          <div class="three-col-span">
            <button class="srcButton ${getAppButtonData(confBtnThree, 'className')} ${getAppButtonData(confBtnThree, 'active')}" 
                    id="${confBtnThree}-button" @click=${e.buttonClicked}>
              ${getAppButtonData(confBtnThree, 'button')}
            </button>
            <button class="srcButton ${getAppButtonData(confBtnFour, 'className')} ${getAppButtonData(confBtnFour, 'active')}" 
                    id="${confBtnFour}-button" @click=${e.buttonClicked}>
              ${getAppButtonData(confBtnFour, 'button')}
            </button>
          </div>
          ${fiveAndSix}
        `;
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



    // FireTV 4 Series Control
    if (deviceType == 'fire_tv_4_series' || deviceType == 'fire_tv_toshiba_v35' || deviceType == 'fire_tv_cube_third_gen') {
    return html`
      <ha-card>

      ${scaleCss}

      <div class="remote-body">

          <button class="remote-button${powerStatusClass}" id="power-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
          <div class="notch"> </div>
          <div> </div>

          <div> </div>
          <button class="remote-button keyboard-button teal" id="keyboard-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <div> </div>

          <div class="dpadContainer">
            <button class="centerbutton" id="center-button" @click=${this.buttonClicked}> </button>
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @click=${this.buttonClicked}></button>
              <button class="dpadbutton" id="right-button" @click=${this.buttonClicked}></button>
              <button class="dpadbutton" id="left-button" @click=${this.buttonClicked}></button>
              <button class="dpadbutton" id="down-button" @click=${this.buttonClicked}></button>
            </div>
          </div>

          <button class="remote-button" id="back-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:arrow-u-left-top"></ha-icon>
          </button>
          <button class="remote-button${homeStatusClass}" id="home-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:home-outline"></ha-icon>
          </button>
          <button class="remote-button" id="hamburger-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:menu"></ha-icon>
          </button>

          <button class="remote-button" id="rewind-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:rewind"></ha-icon>
          </button>
          <button class="remote-button${playingStatusClass}" id="playpause-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:play-pause"></ha-icon>
          </button>
          <button class="remote-button" id="fastforward-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:fast-forward"></ha-icon>
          </button>

          <button class="remote-button round-top" id="volume-up-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:volume-plus"></ha-icon>
          </button>
          <div> </div>
          <button class="remote-button round-top" id="channel-up-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:menu-up"></ha-icon>
          </button>

          <button class="remote-button round-bottom" id="volume-down-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:volume-minus"></ha-icon>
          </button>
          <button class="remote-button" id="tv-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:television-classic"></ha-icon>
          </button>
          <button class="remote-button round-bottom" id="channel-down-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:menu-down"></ha-icon>
          </button>

          <button class="remote-button" id="mute-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:volume-mute"></ha-icon>
          </button>
          <button class="remote-button" id="settings-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:cog"></ha-icon>
          </button>
          <button class="remote-button" id="app-switch-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:file-multiple-outline"></ha-icon>
          </button>

          ${drawAppLaunchButtons(this, this._config)}

          ${renderfiretvlogo()}

      </div>

      </ha-card>
    `;
    }


    // Fire TV cube
    if (deviceType == 'fire_tv_cube_second_gen' || deviceType == 'fire_tv_stick_4k_max') {
    return html`
      <ha-card>

      ${scaleCss}

      <div class="remote-body">

          <button class="remote-button${powerStatusClass}" id="power-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
          <div class="notch"> </div>
          <div> </div>

          <div> </div>
          <button class="remote-button keyboard-button teal" id="keyboard-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <div> </div>

          <div class="dpadContainer">
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @click=${this.buttonClicked}></button>
              <button class="dpadbutton" id="right-button" @click=${this.buttonClicked}></button>
              <button class="dpadbutton" id="left-button" @click=${this.buttonClicked}></button>
              <button class="dpadbutton" id="down-button" @click=${this.buttonClicked}></button>
            </div>
            <button class="centerbutton" id="center-button" @click=${this.buttonClicked}> </button>
          </div>

          <button class="remote-button" id="back-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:arrow-u-left-top"></ha-icon>
          </button>
          <button class="remote-button${homeStatusClass}" id="home-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:home-outline"></ha-icon>
          </button>
          <button class="remote-button" id="hamburger-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:menu"></ha-icon>
          </button>

          <button class="remote-button" id="rewind-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:rewind"></ha-icon>
          </button>
          <button class="remote-button${playingStatusClass}" id="playpause-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:play-pause"></ha-icon>
          </button>
          <button class="remote-button" id="fastforward-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:fast-forward"></ha-icon>
          </button>

          <button class="remote-button" id="mute-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:volume-mute"></ha-icon>
          </button>
          <button class="remote-button round-top" id="volume-up-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:volume-plus"></ha-icon>
          </button>
          <button class="remote-button" id="tv-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:television-classic"></ha-icon>
          </button>


          <div> </div>
          <button class="remote-button round-bottom" id="volume-down-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:volume-minus"></ha-icon>
          </button>
          <div></div>

          ${drawAppLaunchButtons(this, this._config)}

          ${renderfiretvlogo()}

        </div>

      </ha-card>
    `;
    }


    if (deviceType == 'fire_stick_4k' || deviceType == 'fire_tv_3rd_gen') {
    return html`
      <ha-card>

      ${scaleCss}

      <div class="remote-body">

          <button class="remote-button${powerStatusClass}" id="power-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
          <div class="notch"> </div>
          <div> </div>

          <div> </div>
          <button class="remote-button keyboard-button" id="keyboard-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <div> </div>

          <div class="dpadContainer">
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @click=${this.buttonClicked}></button>
              <button class="dpadbutton" id="right-button" @click=${this.buttonClicked}></button>
              <button class="dpadbutton" id="left-button" @click=${this.buttonClicked}></button>
              <button class="dpadbutton" id="down-button" @click=${this.buttonClicked}></button>
            </div>
            <button class="centerbutton" id="center-button" @click=${this.buttonClicked}> </button>
          </div>

          <button class="remote-button" id="back-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:arrow-u-left-top"></ha-icon>
          </button>
          <button class="remote-button${homeStatusClass}" id="home-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:home-outline"></ha-icon>
          </button>
          <button class="remote-button" id="hamburger-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:menu"></ha-icon>
          </button>

          <button class="remote-button" id="rewind-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:rewind"></ha-icon>
          </button>
          <button class="remote-button${playingStatusClass}" id="playpause-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:play-pause"></ha-icon>
          </button>
          <button class="remote-button" id="fastforward-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:fast-forward"></ha-icon>
          </button>

          <div> </div>
          <button class="remote-button round-top" id="volume-up-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:volume-plus"></ha-icon>
          </button>
          <div> </div>

          <div> </div>
          <button class="remote-button round-bottom" id="volume-down-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:volume-minus"></ha-icon>
          </button>
          <div> </div>

          <div> </div>
          <button class="remote-button" id="mute-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:volume-mute"></ha-icon>
          </button>
          <div> </div>

          ${renderAmazonArrowlogo()}

      </div>

      </ha-card>
    `;
    }


    if (deviceType == 'fire_tv_stick_lite') {
    return html`
      <ha-card>

      ${scaleCss}

      <div class="remote-body">

          <div> </div>
          <div class="notch notchtall"> </div>
          <div> </div>

          <div> </div>
          <button class="remote-button keyboard-button" id="keyboard-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <div> </div>

          <div class="dpadContainer">
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @click=${this.buttonClicked}></button>
              <button class="dpadbutton" id="right-button" @click=${this.buttonClicked}></button>
              <button class="dpadbutton" id="left-button" @click=${this.buttonClicked}></button>
              <button class="dpadbutton" id="down-button" @click=${this.buttonClicked}></button>
            </div>
            <button class="centerbutton" id="center-button" @click=${this.buttonClicked}> </button>
          </div>

          <button class="remote-button" id="back-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:arrow-u-left-top"></ha-icon>
          </button>
          <button class="remote-button${homeStatusClass}" id="home-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:home-outline"></ha-icon>
          </button>
          <button class="remote-button" id="hamburger-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:menu"></ha-icon>
          </button>

          <button class="remote-button" id="rewind-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:rewind"></ha-icon>
          </button>
          <button class="remote-button${playingStatusClass}" id="playpause-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:play-pause"></ha-icon>
          </button>
          <button class="remote-button" id="fastforward-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:fast-forward"></ha-icon>
          </button>

          <div> </div>
          <button class="remote-button" id="tv-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:television-classic"></ha-icon>
          </button>
          <div> </div>

          <div class="eightygap"> </div>
          <div> </div>
          <div> </div>

          ${renderAmazonArrowlogo()}

      </div>

      </ha-card>
    `;
    }




    if (deviceType == 'fire_stick_first_gen') {
    return html`
      <ha-card>

      ${scaleCss}

      <div class="remote-body">

          <div> </div>
          <div class="notch notchtall"> </div>
          <div> </div>

          <div> </div>
          <button class="remote-button keyboard-button" id="keyboard-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <div> </div>

          <div class="dpadContainer">
            <div class="directionButtonContainer">
              <button class="dpadbutton" id="up-button" @click=${this.buttonClicked}></button>
              <button class="dpadbutton" id="right-button" @click=${this.buttonClicked}></button>
              <button class="dpadbutton" id="left-button" @click=${this.buttonClicked}></button>
              <button class="dpadbutton" id="down-button" @click=${this.buttonClicked}></button>
            </div>
            <button class="centerbutton" id="center-button" @click=${this.buttonClicked}> </button>
          </div>

          <button class="remote-button" id="back-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:arrow-u-left-top"></ha-icon>
          </button>
          <button class="remote-button${homeStatusClass}" id="home-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:home-outline"></ha-icon>
          </button>
          <button class="remote-button" id="hamburger-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:menu"></ha-icon>
          </button>

          <button class="remote-button" id="rewind-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:rewind"></ha-icon>
          </button>
          <button class="remote-button${playingStatusClass}" id="playpause-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:play-pause"></ha-icon>
          </button>
          <button class="remote-button" id="fastforward-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:fast-forward"></ha-icon>
          </button>

          <svg id="svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0, 0, 400,140.46511627906978" xml:space="preserve" x="0px" y="0px" class="remote-logo" style="margin-top: 90px;"><g id="svgg"><path id="path0" d="M36.047 13.922 C 25.440 15.663,18.409 21.339,16.256 29.898 C 15.386 33.355,15.944 33.716,23.234 34.417 C 30.107 35.077,29.928 35.133,31.381 31.849 C 35.652 22.191,47.907 24.668,47.907 35.188 L 47.907 38.454 43.140 39.025 C 24.310 41.281,17.443 45.404,14.649 56.130 C 9.599 75.517,31.970 87.543,47.354 73.711 C 50.201 71.152,50.324 71.150,52.031 73.631 C 56.460 80.068,57.623 80.160,64.096 74.585 C 70.037 69.467,69.989 69.602,67.234 65.658 C 64.385 61.578,64.186 60.199,64.186 44.481 C 64.186 26.725,63.554 23.541,59.226 19.494 C 54.323 14.909,44.469 12.540,36.047 13.922 M186.744 13.922 C 176.330 15.631,169.990 20.534,167.390 28.888 C 165.975 33.434,166.192 33.603,174.534 34.465 C 180.636 35.095,181.475 34.834,182.015 32.134 C 182.650 28.960,186.790 26.067,190.698 26.067 C 195.996 26.067,198.575 29.032,198.594 35.144 L 198.605 38.427 190.985 39.444 C 173.765 41.743,166.724 46.806,165.131 58.037 C 162.420 77.148,182.807 86.721,198.346 73.634 L 201.111 71.305 203.071 73.969 C 207.640 80.175,208.370 80.214,214.845 74.602 C 220.532 69.673,220.651 69.411,218.542 66.499 C 215.103 61.751,215.144 62.006,214.858 43.721 C 214.565 24.975,214.487 24.520,210.880 20.508 C 206.094 15.184,195.940 12.413,186.744 13.922 M103.899 14.583 C 99.212 15.774,95.610 18.697,93.516 23.008 L 92.605 24.884 92.581 20.847 C 92.549 15.291,92.629 15.349,84.923 15.349 C 76.242 15.349,77.209 11.371,77.209 47.058 C 77.209 82.676,76.169 78.605,85.269 78.605 C 94.395 78.605,93.488 80.962,93.488 57.232 C 93.488 45.213,93.678 36.835,93.983 35.415 C 95.655 27.619,105.435 26.650,107.490 34.077 C 107.875 35.469,108.008 42.004,107.942 56.367 C 107.830 81.094,106.905 78.605,116.207 78.605 C 125.083 78.605,124.186 80.942,124.186 57.818 C 124.186 38.303,124.445 34.648,125.977 32.558 C 129.093 28.308,135.775 28.118,138.015 32.217 C 138.762 33.584,138.849 35.710,138.967 55.581 C 139.121 81.421,138.135 78.605,147.032 78.605 C 155.910 78.605,154.946 81.978,154.786 51.460 L 154.651 25.814 153.433 23.216 C 147.911 11.442,127.228 11.472,123.487 23.259 C 123.044 24.655,122.683 24.419,121.030 21.656 C 117.442 15.657,110.671 12.862,103.899 14.583 M298.774 14.615 C 285.440 17.133,277.963 28.760,277.963 46.977 C 277.963 67.645,287.466 79.560,303.922 79.525 C 321.679 79.488,332.781 61.905,329.312 39.314 C 326.649 21.981,313.990 11.742,298.774 14.615 M365.706 14.444 C 361.132 15.347,357.594 18.136,355.118 22.791 L 353.510 25.814 353.499 21.063 C 353.490 16.848,353.387 16.257,352.589 15.830 C 351.292 15.136,339.868 15.202,339.163 15.907 C 338.059 17.010,338.392 77.528,339.504 78.123 C 341.175 79.017,352.760 78.736,353.625 77.780 C 354.279 77.057,354.391 74.526,354.535 57.199 C 354.706 36.517,354.794 35.590,356.865 32.546 C 360.199 27.648,366.045 27.784,368.605 32.821 C 369.488 34.558,369.542 35.722,369.674 55.802 C 369.840 81.258,368.901 78.605,377.747 78.605 C 387.145 78.605,386.185 81.574,385.918 53.326 C 385.653 25.244,385.460 23.888,381.050 19.006 C 377.570 15.154,371.401 13.320,365.706 14.444 M229.395 15.907 C 228.463 16.840,228.641 26.700,229.605 27.501 C 230.182 27.981,232.851 28.197,240.345 28.372 L 250.317 28.605 246.877 33.488 C 225.578 63.731,226.518 62.053,226.514 69.846 C 226.510 77.165,227.179 78.065,231.128 76.064 C 240.755 71.186,254.759 70.813,265.639 75.147 C 270.087 76.918,271.392 77.100,271.811 76.008 C 272.287 74.767,272.123 64.647,271.611 63.690 C 270.386 61.400,262.537 58.786,254.613 58.027 L 248.986 57.488 255.726 47.930 C 259.433 42.673,264.371 35.651,266.698 32.326 L 270.930 26.279 271.089 21.495 C 271.198 18.214,271.071 16.496,270.684 16.029 C 269.925 15.115,230.304 14.998,229.395 15.907 M307.428 27.202 C 313.604 30.396,314.956 57.591,309.296 64.786 C 306.278 68.623,300.348 68.160,297.847 63.893 C 293.908 57.172,293.838 34.517,297.741 29.556 C 300.024 26.654,304.340 25.605,307.428 27.202 M47.816 53.140 C 47.451 62.310,43.833 67.442,37.733 67.442 C 29.210 67.442,28.768 53.144,37.183 49.647 C 38.778 48.984,43.987 48.007,46.221 47.952 L 48.024 47.907 47.816 53.140 M198.505 53.140 C 198.109 62.691,194.321 67.858,188.093 67.341 C 183.971 66.999,181.860 64.277,181.860 59.302 C 181.860 52.235,187.225 48.191,196.919 47.952 L 198.722 47.907 198.505 53.140 M243.256 81.389 C 228.857 83.572,219.241 91.284,232.867 89.721 C 239.505 88.959,250.067 88.951,250.823 89.707 C 251.112 89.996,251.700 90.233,252.129 90.233 C 255.453 90.233,254.387 98.588,249.481 110.993 C 246.496 118.538,247.584 119.927,252.619 115.000 C 259.876 107.900,266.457 88.534,263.140 84.042 C 261.471 81.783,250.399 80.306,243.256 81.389 M66.777 85.382 C 65.908 86.252,65.914 86.189,66.554 87.536 C 66.995 88.465,68.278 89.636,73.844 94.186 C 74.469 94.698,75.378 95.483,75.863 95.930 C 76.348 96.378,76.871 96.744,77.026 96.744 C 77.182 96.744,78.314 97.529,79.543 98.488 C 80.771 99.448,83.151 101.070,84.832 102.093 C 86.512 103.116,87.891 104.227,87.897 104.562 C 87.902 104.897,88.107 105.048,88.351 104.897 C 88.595 104.746,90.741 105.739,93.119 107.103 C 95.496 108.468,98.119 109.859,98.948 110.195 C 99.776 110.531,100.319 111.023,100.155 111.289 C 99.985 111.563,100.081 111.633,100.377 111.450 C 100.664 111.273,101.690 111.529,102.658 112.020 C 105.733 113.580,113.579 116.674,118.146 118.128 C 120.573 118.901,122.977 119.723,123.488 119.956 C 124.000 120.188,126.721 120.842,129.535 121.409 C 132.349 121.976,134.965 122.547,135.349 122.680 C 136.342 123.022,136.653 123.073,144.651 124.221 C 158.125 126.156,179.965 125.596,191.395 123.024 C 192.930 122.678,195.442 122.251,196.977 122.074 C 198.512 121.897,199.872 121.608,200.000 121.432 C 200.260 121.075,204.016 120.062,206.512 119.676 C 207.407 119.538,208.380 119.232,208.673 118.997 C 208.967 118.762,209.681 118.478,210.259 118.367 C 214.875 117.478,232.958 109.228,238.456 105.503 C 239.525 104.779,240.624 104.186,240.898 104.186 C 241.171 104.186,241.395 103.991,241.395 103.752 C 241.395 103.514,241.784 103.195,242.258 103.045 C 243.660 102.600,246.512 99.463,246.512 98.367 C 246.512 96.103,242.980 94.880,240.285 96.210 C 238.420 97.131,232.318 99.484,229.767 100.266 C 228.360 100.697,225.463 101.652,223.328 102.388 C 221.193 103.124,217.635 104.150,215.421 104.668 C 213.207 105.187,210.663 105.808,209.767 106.048 C 207.561 106.641,199.114 108.222,195.116 108.790 C 193.326 109.045,190.500 109.469,188.836 109.733 C 184.407 110.436,166.615 111.237,161.689 110.955 C 159.353 110.821,155.244 110.594,152.558 110.450 C 147.383 110.173,144.247 109.792,134.884 108.299 C 128.517 107.284,125.738 106.752,123.256 106.072 C 122.360 105.827,120.058 105.276,118.140 104.847 C 111.693 103.407,99.606 99.408,92.326 96.306 C 91.814 96.088,90.244 95.449,88.837 94.886 C 86.674 94.020,74.114 87.849,69.535 85.402 C 67.808 84.480,67.681 84.479,66.777 85.382 " stroke="none" fill="#0f0f0f" fill-rule="evenodd"></path></g></svg>

      </div>

      </ha-card>
    `;
    }

  }


  // Remote Button Click Handler
  buttonClicked(clicked) {

    // Inspect user prefs
    const deviceType = this._config.device_type;
    const compatibility_mode = this._config.compatibility_mode || 'default';
    const overrides = this._config.button_overrides;

    // Check for button override before proceeding
    if(typeof overrides !== 'undefined' && overrides !== null) {
        if(typeof overrides[clicked.target.id] !== 'undefined') {
            const overrideDef = overrides[clicked.target.id];

            if(overrideDef !== null && typeof overrideDef.script !== 'undefined') {
                // handle overrides via external script
                try{ this.hass.callService("script", overrideDef.script) }
                catch { return; }
                fireEvent(this, 'haptic', 'light'); // haptic feedback on success
                return;
            }
            else {
                // handle overrides via yaml instructions
                // TODO: console.log('Im responding to a YAML override for the '+clicked.target.id);
            }
        }
    }

    // provide haptic feedback for button press
    fireEvent(this, 'haptic', 'light')

    // Choose event listener path for client android device
    var eventListenerBinPath = '';
    if(compatibility_mode == 'default' || compatibility_mode == 'strong' || compatibility_mode == '') {
        if(deviceType == 'fire_tv_4_series' || deviceType == 'fire_tv_toshiba_v35') {
            var eventListenerBinPath = '/dev/input/event0';
        }
        if(deviceType == 'fire_stick_first_gen') {
            var eventListenerBinPath = '/dev/input/event1';
        }
        if(deviceType == 'fire_tv_cube_third_gen') {
            var eventListenerBinPath = '/dev/input/event3';
        }
        if(deviceType == 'fire_stick_4k' || deviceType == 'fire_tv_stick_lite' || deviceType == 'fire_tv_3rd_gen') {
            var eventListenerBinPath = '/dev/input/event4';
        }
        if(deviceType == 'fire_tv_stick_4k_max' || deviceType == 'fire_tv_cube_second_gen') {
            var eventListenerBinPath = '/dev/input/event5';
        }
    }
    else {
        var eventListenerBinPath = '/dev/input/'+compatibility_mode;
    }

    // Power Button
    if(clicked.target.id == 'power-button') {
      const state = this.hass.states[this._config.entity];
      const stateStr = state ? state.state : 'off';
      if(compatibility_mode == 'strong') {
        this.hass.callService("media_player", "toggle", { entity_id: this._config.entity});
      }
      else if(deviceType == 'fire_stick_4k' || deviceType == 'fire_tv_stick_4k_max' || deviceType == 'fire_tv_3rd_gen') {
        if(stateStr != 'off' && stateStr != 'unavailable') {
          this.hass.callService("media_player", "turn_off", { entity_id: this._config.entity});
        }
        else {
          this.hass.callService("media_player", "turn_on", { entity_id: this._config.entity});
        }
      }
      else if (deviceType == 'fire_tv_cube_third_gen') {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 116 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 116 0 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent /dev/input/event2 1 9 1 && sendevent /dev/input/event2 0 0 0 && sendevent /dev/input/event2 1 9 0 && sendevent /dev/input/event2 0 0 0' });
      }
      else {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'POWER' });
      }
      return;
      // 116 is the power command for the 4k max
    }


    // Keyboard button
    if(clicked.target.id == 'keyboard-button') {
      var text = prompt("Enter text to send");
      if (text && text != '') {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'input text "'+text+'"' });
      }
      return;
    };

    // Up Button
    if(clicked.target.id == 'up-button') {
      if(compatibility_mode == 'strong') {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'UP' });
      }
      else {
          this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 103 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 103 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
      }
      return;
    }

    // Left Button
    if(clicked.target.id == 'left-button') {
      if(compatibility_mode == 'strong') {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'LEFT' });
      }
      else {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 105 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 105 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
      }
      return;
    }

    // Center Button
    if(clicked.target.id == 'center-button') {
      if(compatibility_mode == 'strong') {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'CENTER' });
      }
      else {
        if(deviceType == 'fire_tv_4_series' || deviceType == 'fire_tv_toshiba_v35') {
          this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 28 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 28 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
        }
        else {
          this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 96 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 96 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
        }
      }
      return;
    }

    // Right Button
    if(clicked.target.id == 'right-button') {
      if(compatibility_mode == 'strong') {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'RIGHT' });
      }
      else {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 106 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 106 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
      }
      return;
    }

    // Down Button
    if(clicked.target.id == 'down-button') {
      if(compatibility_mode == 'strong') {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'DOWN' });
      }
      else {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 108 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 108 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
      }
      return;
    }

    // Back Button
    if(clicked.target.id == 'back-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'BACK' });
      return;
    }

    // Home Button
    if(clicked.target.id == 'home-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'HOME' });
      return;
    }

    // Hamburger Button
    if(clicked.target.id == 'hamburger-button') {
      if(compatibility_mode == 'strong') {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'MENU' });
      }
      else {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 139 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 139 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
      }
      return;
    }

    // Rewind Button
    if(clicked.target.id == 'rewind-button') {
      if(compatibility_mode == 'strong') {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'REWIND' });
      }
      else {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 168 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 168 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
      }
      return;
    }

    // Play/Pause Button
    if(clicked.target.id == 'playpause-button') {
      if(compatibility_mode == 'strong') {
        this.hass.callService("media_player", "media_play_pause", { entity_id: this._config.entity});
      }
      else {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 164 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 164 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
      }
      return;
    }

    // Fast Forward Button
    if(clicked.target.id == 'fastforward-button') {
      if(compatibility_mode == 'strong') {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'FAST_FORWARD' });
      }
      else {
        if(deviceType == 'fire_tv_4_series' || deviceType == 'fire_tv_toshiba_v35') {
          this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 159 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 159 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
        }
        else {
          this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 208 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 208 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
        }
      }
      return;
    }

    // Volume Up Button
    if(clicked.target.id == 'volume-up-button') {
      if(compatibility_mode == 'strong') {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'VOLUME_UP' });
      }
      else {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 115 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 115 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
      }
      return;
    }

    // Channel Up Button
    if(clicked.target.id == 'channel-up-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 402 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 402 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
      return;
    }

    // Volume Down Button
    if(clicked.target.id == 'volume-down-button') {
      if(compatibility_mode == 'strong') {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'VOLUME_DOWN' });
      }
      else {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 114 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 114 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
      }
      return;
    }

    // TV Button
    if(clicked.target.id == 'tv-button') {
      if (deviceType == 'fire_tv_cube_third_gen') {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'adb shell input keyevent 297'});
      }
      else {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 362 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 362 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
      }
    }

    // Channel Down Button
    if(clicked.target.id == 'channel-down-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 403 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 403 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
      return;
    }

    // Mute Button
    if(clicked.target.id == 'mute-button') {
      if(compatibility_mode == 'strong') {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'MUTE' });
      }
      else {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 113 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 113 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
      }
      return;
    }

    // Settings Button
    if(clicked.target.id == 'settings-button') {
      if(compatibility_mode == 'strong' || deviceType == 'fire_tv_cube_third_gen') {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'SETTINGS' });
      }
      else {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 249 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 249 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
      }
      return;
    }

    // App Switch (recents) Button
    if(clicked.target.id == 'app-switch-button') {
      if(compatibility_mode == 'strong') {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'RECENTS' });
      }
      else if (deviceType == 'fire_tv_cube_third_gen') {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'adb shell input keyevent 304'});
      }
      else {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent '+eventListenerBinPath+' 1 757 1 && sendevent '+eventListenerBinPath+' 0 0 0 && sendevent '+eventListenerBinPath+' 1 757 0 && sendevent '+eventListenerBinPath+' 0 0 0' });
      }
      return;
    }


    // App launch button (existing in JSON map)
    const clickedAppButtonID = clicked.target.id;
    const appkey = clickedAppButtonID.substr(0, clickedAppButtonID.indexOf("-button"));
    if(appmap.has(appkey)) {
      var adbcommand = appmap.get(appkey).adbLaunchCommand;
      var sourceName = appmap.get(appkey).appName;
      if (typeof adbcommand == 'undefined') {
        this.hass.callService("media_player", "select_source", { entity_id: this._config.entity, source: sourceName});
      }
      else {
        this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: adbcommand });
      }
      return;
    }


  }
}
customElements.define('firemote-card', FiremoteCard);


// Allow this card to appear in the card chooser menu
window.customCards = window.customCards || [];
window.customCards.push({
  type: "firemote-card",
  name: "Firemote Card",
  preview: false,
  description: "Remote control card for Amazon FireTV devices"
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

    // A config-changed event will tell lovelace we have made changed to the configuration
    // this make sure the changes are saved correctly later and will update the preview
    const event = new CustomEvent("config-changed", {
      detail: { config: _config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
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


  getAppChoices(buttonIndex, optionvalue) {
    if(this._config.device_type == 'fire_tv_4_series' || this._config.device_type == 'fire_tv_stick_4k_max' || this._config.device_type == 'fire_tv_cube_second_gen' || this._config.device_type == 'fire_tv_toshiba_v35' || this._config.device_type == 'fire_tv_cube_third_gen') {
      var appkeys = [];
      for (var [key, value] of appmap.entries()) {
        appkeys.push(key)
      }
      var blankOption = '';
      if(!(appmap.has(optionvalue))){
        blankOption = html `<option value="-" selected> - - - - </option>`;
      }
      if(buttonIndex == 5 || buttonIndex == 6) {
        blankOption = html `<option value=""> - - - - </option>`;
      }

      return html `
        App Launch Button ${buttonIndex}:
        <select name="app_launch_${buttonIndex}" id="app_launch_${buttonIndex}" style="padding: .6em; font-size: 1em;"
          .value=${optionvalue}
          @focusout=${this.configChanged}
          @change=${this.configChanged}
        >
          ${blankOption}
          ${appkeys.map((app) => {
            if (app != optionvalue) {
              return html`<option value="${app}">${appmap.get(app).friendlyName}</option> `
            }
            else {
              return html`<option value="${app}" selected>${appmap.get(app).friendlyName}</option> `
            }
          })}
        </select>
        <br>
      `;
    }
  }


  render() {
    if (!this.hass || !this._config) {
      return html``;
    }
    const mediaPlayerEntities = this.getEntitiesByPlatform('androidtv');
    var blankEntity = '';
    if(this._config.entity == '') {
      blankEntity = html `<option value="" selected> - - - - </option> `;
    }

    // Show and hide HDMI inputs if the device has them
    handlehdmi(this._config);

    return html`
          Entity:<br>
          <select name="entity" id="entity" style="padding: .6em; font-size: 1em;" .value="${this._config.entity}"
            @focusout=${this.configChanged}
            @change=${this.configChanged} >
            ${blankEntity}
            ${mediaPlayerEntities.map((eid) => {
              if (eid != this._config.entity) {
                return html`<option value="${eid}">${this.hass.entities[eid].name || eid}</option> `;
              }
              else {
                return html`<option value="${eid}" selected>${this.hass.entities[eid].name || eid}</option> `;
              }
            })}
          </select>     
        <br>
        <br>

        Fire Device Type:<br>
        <select name="device_type" id="device_type" style="padding: .6em; font-size: 1em;"
          .value=${this._config.device_type} 
          @focusout=${this.configChanged}
          @change=${this.configChanged}
        >
          <optgroup label="Smart TV">
            <option value="fire_tv_hisense_u6_4k_uhd_2022" disabled>Hisense U6 4K UHD - Fire TV (2022)</option>
            <option value="fire_tv_toshiba_v35">Toshiba Fire TV (V35 Series - 2021)</option>
            <option value="fire_tv_4_series">Fire TV (4 Series - 2021)</option>
          </optgroup>
          <optgroup label="Fire TV Cube">
            <option value="fire_tv_cube_third_gen">Fire TV Cube (3rd Gen - 2022)</option>
            <option value="fire_tv_cube_second_gen">Fire TV Cube (2nd Gen - 2019)</option>
            <option value="fire_tv_cube_first_gen" disabled>Fire TV Cube (1st Gen - 2018)</option>
          </optgroup>
          <optgroup label="Streaming Media Player">
            <option value="fire_tv_stick_4k_max">Fire TV Stick 4K Max (1st Gen - 2020)</option>
            <option value="fire_tv_3rd_gen">Fire TV Stick (3rd Gen - 2020)</option>
            <option value="fire_tv_stick_lite">Fire TV Stick Lite (1st Gen - 2020)</option>
            <option value="fire_stick_4k">Fire TV Stick 4K (1st Gen - 2018)</option>
            <option value="fire_stick_second_gen" disabled>Fire TV Stick (2nd gen - 2016 - 2019)</option>
            <option value="fire_stick_basic" disabled>Fire TV Stick (Basic Edition - 2017)</option>
            <option value="fire_stick_second_gen_2015" disabled>Fire TV Stick (2nd Gen - 2015)</option>
            <option value="fire_stick_first_gen">Fire TV Stick (1st gen - 2014)</option>
          </optgroup>
        </select>

        <br>
        <br>
        <hr>
        <br>
        Compatibility Mode:&nbsp;
        <select name="compatibility_mode" id="compatibility_mode" style="padding: .6em; font-size: 1em;"
          .value=${this._config.compatibility_mode} 
          @focusout=${this.configChanged}
          @change=${this.configChanged}
        >
          <option value="default">Default</option>
          <option value="strong">Strong (Slower)</option>
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
        ${this.getAppChoices("1", this._config.app_launch_1)}
        ${this.getAppChoices("2", this._config.app_launch_2)}
        ${this.getAppChoices("3", this._config.app_launch_3)}
        ${this.getAppChoices("4", this._config.app_launch_4)}
        ${this.getAppChoices("5", this._config.app_launch_5)}
        ${this.getAppChoices("6", this._config.app_launch_6)}
        <br>
        <label for="fader">Scale:&nbsp;
          <input type="range" min="20" max="120" .value=${this._config.scale} id="scale" name="scale" @change=${this.configChanged} style="width: 40ch;">
        </label>
    `;
  }
}

customElements.define("firemote-card-editor", FiremoteCardEditor);
