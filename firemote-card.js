import { html, LitElement } from "https://unpkg.com/lit?module";


class FiremoteCard extends LitElement {

  static getConfigElement() {
    // Create and return an editor element
    return document.createElement("firemote-card-editor");
  }

  static getStubConfig() {
    // Return a minimal configuration that will result in a working card configuration
    return { entity: '',
             'device_type': 'fire_tv_4_series',
           };
  }

  static get properties() {
    return {
      hass: {},
      _config: {},
    };
  }

  setConfig(config) {
    this._config = config;
  }


   render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    const stateObj = this.hass.states[this._config.entity];
    if (!stateObj) {
      return html` <ha-card>Unknown entity: ${this._config.entity}</ha-card> `;
    }

    const entityId = this._config.entity;
    const state = this.hass.states[entityId];
    const stateStr = state ? state.state : 'off';
    const appId = state.attributes.app_id;

    // Determine Power On/Off Status
    var powerStatusClass = ''
    if(stateStr != 'off' && stateStr != 'unavailable') {
      powerStatusClass = ' litbutton';
    }

    // Determine Home Status
    var homeStatusClass = '';
    if(appId == 'com.amazon.tv.launcher') {
      homeStatusClass = ' litbutton';
    }

    // Determine Play/Pause
    var playingStatusClass = '';
    if(stateStr == 'playing') {
      playingStatusClass = ' litbutton';
    }

    // Determine Prime Video Status
    var primevideoactive = '';
    var netflixactive = '';
    var disneyplusactive = '';
    var huluactive = '';
    if(appId == 'com.amazon.avod' || appId == 'com.amazon.firebat') {
      primevideoactive = ' appActive';
    }
    if(appId == 'com.netflix.ninja') {
      netflixactive = ' appActive';
    }
    if(appId == 'com.disney.disneyplus') {
      disneyplusactive = ' appActive';
    }
    if(appId == 'com.hulu.plus') {
      huluactive = ' appActive';
    }

    // @click below is also LitElement magic
    return html`
      <ha-card style="background: rgba(30,30,30,0); width: 250px; padding: 0; margin: 0;">
      <style>
          .remote-body {
            background: linear-gradient(90deg, rgba(27,27,27,1) 0%, rgba(37,37,37,1) 8%, rgba(55,55,55,1) 50%, 
                                               rgba(37,37,37,1) 92%, rgba(27,27,27,1) 100%); 
            border: solid #252525 2px;
            border-radius: 8em 8em 8em 8em / 2.5em 2.5em 2.5em 2.5em;
            padding: 20px 10px 30px 10px;
            width: 170px;
            display: grid;
            justify-items: center;
            grid-column-gap: 2px;
            grid-row-gap: 7px;
            grid-template-columns: 33% 33% 33%;
          }

          .three-col-span {
            grid-column-start: 1;
            grid-column-end: 4;
            width: 100%;
            display: grid;
            grid-column-gap: 2px;
            grid-template-columns: 50% 50%;
            align-content: center;
          }

          .remote-button {
            height: 50px; 
            width: 50px;
            border: solid black 1px;
            border-radius: 100%;
            display: grid;
            justify-content: center;
            align-content: center;
            color: rgb(198 198 198);
            background: rgb(33 33 33);
            box-shadow: rgb(0 0 0 / 13%) 0 3px 2px 0px;
            cursor: pointer;
            line-height: normal;
            user-select: none;
            padding: 4px;
          }

          .remote-button:active {
            box-shadow: inset rgb(0 0 0 / 13%) 0 4px 2px 0px;
          }

          .remote-button > ha-icon {
            color: #c6c6c6;
          }

          .remote-button:active > ha-icon {
            color: #bcbcbc;
            transform: scale(0.85);
          }

          .square {
            border-radius: 0;
            border: 0px;
            padding: 0px;
          }

          .round-top {
            border-radius: 100% 100% 0 0;
            border-bottom: 0px;
            box-shadow: none;
            height: 55px;
            margin-bottom: -7px;
          }

          .round-right {
            border-radius: 0 100% 100% 0;
            border-left: 0px;
            width: 55px;
            margin-left: -11px;
          }

          .round-bottom {
            border-radius: 0 0 100% 100%;
            border-top: 0px;
            height: 55px;
            margin-top: -7px;
          }

          .round-left {
            border-radius: 100% 0 0 100%;
            border-right: 0px;
            width: 55px;
            margin-right: -11px;
          }

          .square:active, .round-bottom:active {
              box-shadow: none;
          }

          .srcButton {
            margin-top: 8px;
            height: 28px; 
            width: 80px;
            border: solid #090909 1px;
            border-radius: 2em;
            display: grid;
            justify-items: center;
            align-content: center;
            color: rgb(198 198 198);
            background: rgb(33 33 33);
            box-shadow: rgb(0 0 0 / 13%) 0 3px 2px 0px;
            cursor: pointer;
            line-height: normal;
            user-select: none;
            font-size: 16px;
            padding: 4px;
          }

          .primeButton {
            color: #c6c6c6;
            background: #293942;
            font-size: 12px;
          }

          .primeButton:active, .primeButton.appActive {
            color: #fff;
            background: #53a3d1;
            box-shadow: 0px 0px 12px 2px rgb(255 255 255 / 15%);
          }

          .netflixButton {
            color: #6d2427;
            background: #878787;
          }

          .netflixButton:active, .netflixButton.appActive {
            color: #d30a14;
            background: #fff;
            box-shadow: 0px 0px 12px 2px rgb(255 255 255 / 15%);
          }

          .disneyPlusButton {
            color: #c6c6c6;
            background: #1a1f28;
          }

          .disneyPlusButton:active, .disneyPlusButton.appActive {
            color: #d1f8ff;
            background: #07183f;
            box-shadow: 0px 0px 12px 2px rgb(255 255 255 / 20%);
          }

          .huluButton {
            color: #c6c6c6;
            background: #151e19;
          }

          .huluButton:active, .huluButton.appActive {
            color: #000;
            background: #1ce783;
            box-shadow: 0px 0px 12px 2px rgb(255 255 255 / 20%);
          }

          .remote-logo {
            grid-column-start: 1;
            grid-column-end: 4;
            padding: 35px 33px 0px 33px;
          }

          .litbutton {
              border: solid #4b4c3c 1px;
              box-shadow: 0px 0px 12px 1px rgb(255 255 25 / 15%);
          }
          .litbutton > ha-icon {
            color: yellow !important;
          }

          ha-icon {
            pointer-events: none;
          }

      </style>

      <div class="remote-body">

          <button class="remote-button${powerStatusClass}" style="margin-bottom: -18px;" id="power-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
          <div> </div>
          <div> </div>

          <div> </div>
          <button class="remote-button round-top" style="margin-bottom: -12px;" id="up-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:arrow-up-bold"></ha-icon>
          </button>
          <div> </div>

          <button class="remote-button round-left" id="left-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:arrow-left-bold"></ha-icon>
          </button>
          <button class="remote-button square" id="center-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:checkbox-blank-circle"></ha-icon>
          </button>
          <button class="remote-button round-right" id="right-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:arrow-right-bold"></ha-icon>
          </button>

          <div> </div>
          <button class="remote-button round-bottom" style="margin-bottom: 9px;" id="down-button" @click=${this.buttonClicked}>
            <ha-icon icon="mdi:arrow-down-bold"></ha-icon>
          </button>
          <div> </div>

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

          <div class="three-col-span">
            <button class="srcButton primeButton${primevideoactive}" id="prime-video-button" @click=${this.buttonClicked}>
              prime video
            </button>
            <button class="srcButton netflixButton${netflixactive}" id="netflix-button" @click=${this.buttonClicked}>
              Netflix
            </button>
          </div>

          <div class="three-col-span">
            <button class="srcButton disneyPlusButton${disneyplusactive}" id="disney-plus-button" @click=${this.buttonClicked}>
              Disney +
            </button>
            <button class="srcButton huluButton${huluactive}" id="hulu-button" @click=${this.buttonClicked}>
              hulu
            </button>
          </div>

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

      </div>

      ${entityId}<br>
      State: ${stateStr}<br>
      App ID: ${appId}<br>

      </ha-card>
    `;

  }


  // Remote Button Click Handler
  buttonClicked(clicked) {

    //console.log(clicked.target.id);

    const stateObj = this.hass.states[this._config.entity];

    // Power Button
    if(clicked.target.id == 'power-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'POWER' });
      return;
    }

    // Up Button
    if(clicked.target.id == 'up-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event0 1 103 1 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 1 103 0 && sendevent /dev/input/event0 0 0 0' });
      return;
    }

    // Left Button
    if(clicked.target.id == 'left-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event0 1 105 1 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 1 105 0 && sendevent /dev/input/event0 0 0 0' });
      return;
    }

    // Center Button
    if(clicked.target.id == 'center-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event0 1 28 1 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 1 28 0 && sendevent /dev/input/event0 0 0 0' });
      return;
    }

    // Right Button
    if(clicked.target.id == 'right-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event0 1 106 1 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 1 106 0 && sendevent /dev/input/event0 0 0 0' });
      return;
    }

    // Down Button
    if(clicked.target.id == 'down-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event0 1 108 1 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 1 108 0 && sendevent /dev/input/event0 0 0 0' });
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
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event0 1 139 1 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 1 139 0 && sendevent /dev/input/event0 0 0 0' });
      return;
    }

    // Rewind Button
    if(clicked.target.id == 'rewind-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event0 4 4 786612 && sendevent /dev/input/event0 1 168 1 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 4 4 786612 && sendevent /dev/input/event0 1 168 0 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 20 0 0 && sendevent /dev/input/event0 20 1 0 && sendevent /dev/input/event0 0 0 0' });
      return;
    }

    // Play/Pause Button
    if(clicked.target.id == 'playpause-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event0 1 164 1 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 1 164 0 && sendevent /dev/input/event0 0 0 0' });
      return;
    }

    // Fast Forward Button
    if(clicked.target.id == 'fastforward-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event4 4 4 786611 && sendevent /dev/input/event4 1 208 1 && sendevent /dev/input/event4 0 0 0 && sendevent /dev/input/event4 4 4 786611 && sendevent /dev/input/event4 1 208 0 && sendevent /dev/input/event4 0 0 0 && sendevent /dev/input/event4 20 0 0 && sendevent /dev/input/event4 20 1 0 && sendevent /dev/input/event4 0 0 0' });
      return;
    }

    // Volume Up Button
    if(clicked.target.id == 'volume-up-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event0 1 115 1 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 1 115 0 && sendevent /dev/input/event0 0 0 0' });
      return;
    }

    // Channel Up Button
    if(clicked.target.id == 'channel-up-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event0 4 4 786588 && sendevent /dev/input/event0 1 402 1 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 4 4 786588 && sendevent /dev/input/event0 1 402 0 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 20 0 0 && sendevent /dev/input/event0 20 1 0 && sendevent /dev/input/event0 0 0 0' });
      return;
    }

    // Volume Down Button
    if(clicked.target.id == 'volume-down-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event0 1 114 1 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 1 114 0 && sendevent /dev/input/event0 0 0 0' });
      return;
    }

    // TV Button
    if(clicked.target.id == 'tv-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event0 4 4 786573 && sendevent /dev/input/event0 1 362 1 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 4 4 786573 && sendevent /dev/input/event0 1 362 0 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 20 0 0 && sendevent /dev/input/event0 20 1 0 && sendevent /dev/input/event0 0 0 0' });
      return;
    }

    // Channel Down Button
    if(clicked.target.id == 'channel-down-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event0 4 4 786589 && sendevent /dev/input/event0 1 403 1 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 4 4 786589 && sendevent /dev/input/event0 1 403 0 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 20 0 0 && sendevent /dev/input/event0 20 1 0 && sendevent /dev/input/event0 0 0 0' });
      return;
    }

    // Mute Button
    if(clicked.target.id == 'mute-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event0 1 113 1 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 1 113 0 && sendevent /dev/input/event0 0 0 0' });
      return;
    }

    // Settings Button
    if(clicked.target.id == 'settings-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event0 4 4 786483 && sendevent /dev/input/event0 1 249 1 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 4 4 786483 && sendevent /dev/input/event0 1 249 0 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 20 0 0 && sendevent /dev/input/event0 20 1 0 && sendevent /dev/input/event0 0 0 0' });
      return;
    }

    // App Switch Button
    if(clicked.target.id == 'app-switch-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event5 4 4 786434 && sendevent /dev/input/event5 1 748 1 && sendevent /dev/input/event5 0 0 0 && sendevent /dev/input/event5 4 4 786434 && sendevent /dev/input/event5 1 748 0 && sendevent /dev/input/event5 0 0 0 && sendevent /dev/input/event5 20 0 0 && sendevent /dev/input/event5 20 1 0 && sendevent /dev/input/event5 0 0 0' });
      return;
    }

    // Prime Video Button
    if(clicked.target.id == 'prime-video-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event0 1 745 1 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 1 745 0 && sendevent /dev/input/event0 0 0 0' });
      return;
    }

    // Netflix Button
    if(clicked.target.id == 'netflix-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'adb shell am start -n com.netflix.ninja/.MainActivity' });
      return;
    }

    // Disney +  Button
    if(clicked.target.id == 'disney-plus-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'adb shell am start -n com.disney.disneyplus/com.bamtechmedia.dominguez.main.MainActivity' });
      return;
    }

    // hulu Button
    if(clicked.target.id == 'hulu-button') {
      this.hass.callService("androidtv", "adb_command", { entity_id: this._config.entity, command: 'sendevent /dev/input/event0 1 747 1 && sendevent /dev/input/event0 0 0 0 && sendevent /dev/input/event0 1 747 0 && sendevent /dev/input/event0 0 0 0' });
      return;
    }

  }


  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  //setConfig(config) {
  //  if (!config.entity) {
  //    throw new Error('You need to define a Fire TV or Android TV entity');
  //  }
  //  this.config = config;
  //}

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  //getCardSize() {
  //  return 3;
  //}

}
customElements.define('firemote-card', FiremoteCard);


// Allow this card to appear in the card chooser menu
window.customCards = window.customCards || [];
window.customCards.push({
  type: "firemote-card",
  name: "Firemote Card",
  preview: false, // Optional - defaults to false
  description: "Remote control card for FireTV" // Optional
});




// Finally we create and register the editor itself
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

  // This function is called when the input element of the editor loses focus
  entityChanged(ev) {

    // We make a copy of the current config so we don't accidentally overwrite anything too early
    const _config = Object.assign({}, this._config);
    // Then we update the entity value with what we just got from the input field
    _config.entity = ev.target.value;
    // And finally write back the updated configuration all at once
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

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    // @focusout below will call entityChanged when the input field loses focus (e.g. the user tabs away or clicks outside of it)
    return html`
        Entity:&nbsp;&nbsp;
        <input style="padding: 5px; width: 300px; font-size: 1em;"
          name="element"
          .value=${this._config.entity}
          @focusout=${this.entityChanged}>
        </input>
        <br><br><br>
        Fire Device Type:&nbsp;&nbsp;
        <select name="device_type" id="device_type" .value=${this._config.device_type} @focusout=${this.entityChanged} style="padding: 5px; width: 300px; font-size: 1em;" disabled>
          <option value="fire_tv_4_series">Fire TV 4 Series</option>
          <option value="fire_stick_4k">Fire Stick 4K</option>
        </options>
    `;
  }
}

customElements.define("firemote-card-editor", FiremoteCardEditor);


