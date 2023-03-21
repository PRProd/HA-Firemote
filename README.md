# HA-Firemote
[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/PRProd/HA-Firemote?style=for-the-badge)
![Maintenance](https://img.shields.io/maintenance/yes/2023?style=for-the-badge)

Need More Information?  Check out this project's [Wiki](https://github.com/PRProd/HA-Firemote/wiki) page

| ![Fire TV 4 Series Remote](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireTVRemote.png) | ![Fire TV Cube (Gen 2) Remote](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireTVCube2ndGen.png) | ![Fire TV Stick 4K](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireTVStick4K.png) | ![Fire TV Stick Lite](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireTVStickLite.png) | ![Fire Stick (1st Gen)](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireStick1stGen.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |

| ![NVIDIA Shield Remote](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/shieldRemote2.png) | ![NVIDIA Shield Gen 2 Remote](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/shieldRemote1.png)
| ------------- | ------------- |

<br>
<br>
<br>

## Prerequisites
* A functioning version of [Home Assistant](https://www.home-assistant.io/)
* [HACS](https://peyanski.com/how-to-install-home-assistant-community-store-hacs/) (not required, but it makes things easier)
* A supported Amazon Fire Device Type
  * Amazon Fire Smart TV
  * Amazon Fire Stick
  * Amazon Fire Cube
  * NVIDIA Shield
  * NVIDIA Shield Pro
  * Other Android based non-fire devices might work as well, but with limited (and unsupported) functionality

[Which Amazon Fire devices are supported?](../../wiki/Existing-Amazon-Devices---Support-Chart)<br>
[Which Amazon Fire device do I own?](https://developer.amazon.com/docs/fire-tv/device-specifications.html)<br>
[Which NVIDIA Shield devices are supported?](../../wiki/Existing-NVIDIA-Shield-Devices-Support-Chart)<br>
[Which NVIDIA Shield device do I own?](https://www.nvidia.com/en-us/shield/)

<br>
<br>
<br>

## Download and Setup via Home Assistant UI & HACS
1. [Turn on ADB Debugging](https://www.youtube.com/watch?v=40iVXrTWcPU) on your Amazon device
1. Set up the Home Assistant [Android TV Integration](https://www.home-assistant.io/integrations/androidtv/) and connect it to your Amazon Fire Device
1. Click on HACS and select Frontend
1. In the lower right hand corner, click the "+ EXPLORE & DOWNLOAD REPOSITORIES" button
1. Search for, and click on "Firemote Card", then click the "DOWNLOAD" button in the lower right hand corner
1. You will be prompted to reload your browser.  Click the RELOAD button to continue

## OR Install Manually
1. [Turn on ADB Debugging](https://www.youtube.com/watch?v=40iVXrTWcPU) on your Amazon device
1. Set up the Home Assistant [Android TV Integration](https://www.home-assistant.io/integrations/androidtv/) and connect it to your Amazon Fire Device
1. Download a copy of [HA-Firemote.js](https://github.com/PRProd/HA-Firemote/blob/main/HA-Firemote.js) and place it in your Home Assistant /config/www directory
1. [Register this file as a new resource](https://developers.home-assistant.io/docs/frontend/custom-ui/registering-resources/)

<br>
<br>

## How to use
1. On any dashboard, click the +ADD CARD button
1. Search by cards for "Firemote Card", and click on it
1. Under the Entity dropdown, a list of your Android TV integration entities will appear.  Select the one you wish to control.
1. Under Fire Device Type, select the device model that you own. ([Which device do I own?](https://developer.amazon.com/docs/fire-tv/device-specifications.html))
1. Make any other optional changes to your card, then click "SAVE"

![UIConfig](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/uiConfig.jpg)

![Dashboard](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/dashboard.jpg)

<br>
<br>
<br>

## YAML card setup options
Example:
```yaml
type: custom:firemote-card
entity: media_player.fire_tv_192_168_1_30
device_type: fire_tv_4_series
compatibility_mode: default
app_launch_1: prime-video
app_launch_2: netflix
app_launch_3: hdmi_1
app_launch_4: youtube
hdmi_1: Cable
scale: 85
button_overrides:
  mute-button:
    script: receiver_mute_script
```

Options:
| Name        | Type   | Required | Options                                                       | Description                            |
| ----------- | ------ | -------- | ------------------------------------------------------------- | -------------------------------------- |
| type        | string | yes      | custom:firemote-card                                          | Type of the card                       |
| entity      | string | yes      | any valid entity created in the android tv integration        | entity_id                              |
| device_type | string | yes      | [fire_tv_toshiba_v35](https://github.com/PRProd/HA-Firemote/wiki/Smart-TV---Toshiba-V35-Series-LED-FHD-HD---Fire-TV-(2021)) <br> [fire_tv_4_series](https://github.com/PRProd/HA-Firemote/wiki/Smart-TV---Fire-TV-4-Series-(2021)) <br> [fire_tv_cube_third_gen](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Cube---3rd-Gen-(2022)) <br> [fire_tv_cube_second_gen](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Cube---2nd-Gen-(2019)) <br> [fire_tv_cube_first_gen](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Cube---1st-Gen-(2018)) <br> [fire_tv_stick_4k_max](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Stick-4K-Max---1st-Gen-(2021)) <br> [fire_tv_3rd_gen](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Stick---3rd-Gen-(2020)) <br> [fire_tv_stick_lite](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Stick-Lite---1st-Gen-(2020)) <br> [fire_stick_4k](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Stick-4K---1st-Gen-(2018)) <br> [fire_stick_second_gen](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Stick---2nd-Gen-(2016---2019)) <br> [fire_stick_first_gen](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Stick-1st-Gen-(2014)) | The type of device you are controlling<br>[Which devices are supported?](https://github.com/PRProd/HA-Firemote/wiki/Existing-Amazon-Devices---Support-Chart)<br>[Which device do I own?](https://developer.amazon.com/docs/fire-tv/device-specifications.html) |
| compatibility_mode | string | no | default <br> strong <br> event0 <br> event1 <br> event2 <br> event3 <br> event4 <br> event5 <br> event6 <br> event7 <br> event8 <br> | Adjust this value only if your buttons are completely unresponsive<br>[FAQ Available for additional help](https://github.com/PRProd/HA-Firemote#faq) |
| app_launch_1<br>app_launch_2<br>app_launch_3<br>app_launch_4<br>app_launch_5<br>app_launch_6 | string | no | amc-plus<br>app-opener<br>apple-tv<br>bbc-iplayer<br>bell-fibe-tv<br>cnn<br>crave-tv<br>cyberghost<br>directv-stream<br>disney-plus<br>emby<br>espn<br>hbo-max<br>hulu<br>jellyfin<br>myCanal<br>netflix<br>news<br>nordvpn<br>pandora<br>paramount-plus<br>paramount-plus-de<br>plex<br>prime-video<br>raiplay<br>shophq<br>showtime<br>spotify<br>starz<br>tennis-channel<br>threenow<br>tvnz-plus<br>twitch<br>youtube<br>youtubeTV<br>vlc<br>waipuTV<br>youtube<br>youtubekids<br>youtubekids-alt<br>youtubeTV<br>xfinityStream<br>zattoo<br>hdmi_1<br>hdmi_2<br>hdmi_3<br>hdmi_4 | Quick launch apps customization |
|hdmi_1<br>hdmi_2<br>hdmi_3</br>hdmi_4| string | no | Personalized name for this HDMI input | The name entered here will appear on the button (truncated to 8 characters to fit)|
| scale       | integer| no       | Any positive number                                           | Change the size of this card by percentage.  Default size is 100 |
| button_overrides | object | no | Button name and HA script name are required.| Details are in the Button Overrides section of the [README.md](https://github.com/PRProd/HA-Firemote/edit/main/README.md#button-overrides) file |
| visible_name_text | string | no | Any text                                                      | Optional device label for your firemote|
| name_position | string | no     | hidden<br>bottom<br>top<br>                                   | Position for your optional device label|

<br>
<br>
<br>

## Button Overrides
Firemote buttons can be overridden by Home Assistant scripts through a simple YAML configuration.  

Ex:
```yaml
button_overrides:
  mute-button:
    script: receiver_mute_script
  volume-down-button:
    script: receiver_volume_down_script
```
Valid button names are as follows:
 - power-button
 - keyboard-button
 - up-button
 - left-button
 - center-button
 - right-button
 - down-button
 - back-button
 - home-button
 - hamburger-button
 - rewind-button
 - playpause-button
 - fastforward-button
 - volume-up-button
 - channel-up-button
 - volume-down-button
 - tv-button
 - channel-down-button
 - mute-button
 - settings-button
 - app-switch-button
<br>
<br>
<br>

## FAQ
###  Why won't my volume, mute, and/or power butons work?
In many cases, your Amazon remote control actually sends commands for volume, mute, and power to your TV or receiver using the IR emitter on the front of the physical remote control.  Since this is the case, these types of commands cannot be emulated through the same means that Firemote sends other commands.
<br>

In these cases, you still might be able to control your devices (TVs, Receivers, etc.) by using [Button Overrides](https://github.com/PRProd/HA-Firemote#button-overrides).  If you are able to control your non-fire devices through Home Assistant, you can write a HA script and attach that script to a button on your Firemote.
<br>
<br>

### Why don't any of the buttons on the Firemote work at all? ###
 * If your Firemote used to work perfectly, and some or all of the buttons suddenly stopped working, it could be that all you need to do is press one button (any button) on your Fire TV device's physical remote control.  After doing that step, try your Firemote again.
 * Check your card configuration:
   * Is the correct Android device selected?
   * Is the correct Fire TV Device type selected?
   * Is Compatibility Mode set to Default?
 * If the Default Compatibility Mode is not working on your device, and you've checked every other step, slowly choose "event0", "event1", etc. and test your remote buttons under each mode.  One of these will work.
<br>

### Why isn't my Fire Device supported?
There are currently over 40 different kinds of Amazon Fire devices, so it will take a while for every device to gain properly tested support.  If Firemote doesn't support your device yet yet, you can still use Firemote!  Simply choose a supported device that is similar to the one that you have (preferrably a remote that looks the same as your physical remote), then you can test different compatability modes to find out which one works the best.<br>

For extra credit, you could submit a request to have your device added!  It's simple!  Click on the [Issues](https://github.com/PRProd/HA-Firemote/issues) button on the top of this page, click 'New Issue' and then click the "Get Started" button next to the "Device Support Request" option.  Your help is VERY appreciated!
<br>
<br>

### I want to have a shortcut button for an app I use frequently, but it's not on the list.  Can it be added?
Absolutely!  Simply ask!  Here's how: Click on the [Issues](https://github.com/PRProd/HA-Firemote/issues) button on the top of this page, click 'New Issue' and then click the "Get Started" button next to the "App Shortcut Request" option.  Your request is important to you, and likely important for others as well!  As long as the app is easily downloaded through traditional Amazon app downloading channels (not sideloaded), your request will be granted ASAP.
<br>
<br>

### How do I report a problem, make a request, or just talk about stuff?
Click on the [Issues](https://github.com/PRProd/HA-Firemote/issues) button on the top of this page, click 'New Issue' and then select the appropriate category for your needs.  You're also welcome to join or begin a new [discussion ](https://github.com/PRProd/HA-Firemote/discussions) if that seems more suitable for your needs.
