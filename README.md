# HA-Firemote
[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/PRProd/HA-Firemote?style=for-the-badge)
![Maintenance](https://img.shields.io/maintenance/yes/2023?style=for-the-badge)

| Fire TV | Fire TV Cube,<br>Fire TV Stick 4K Max | Fire TV Stick 4K | Fire TV Stick Lite | Fire Stick (1st Gen) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| ![Fire TV 4 Series Remote](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireTVRemote.png) | ![Fire TV Cube (Gen 2) Remote](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireTVCube2ndGen.png) | ![Fire TV Stick 4K](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireTVStick4K.png) | ![Fire TV Stick Lite](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireTVStickLite.png) | ![Fire Stick (1st Gen)](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireStick1stGen.png) |

## Prerequisites
* A functioning version of [Home Assistant](https://www.home-assistant.io/)
* [HACS](https://peyanski.com/how-to-install-home-assistant-community-store-hacs/)
* A supported Amazon Fire Device - ( [Which device do I own?](https://developer.amazon.com/docs/fire-tv/device-specifications.html) )
  * [Fire TV (4 Series)](https://developer.amazon.com/docs/fire-tv/device-specifications-fire-tv-edition-smart-tv.html?v=4-series)
  * [Fire TV Cube (2nd Gen)](https://www.amazon.com/dp/B08XMDNVX6)
  * [Fire TV Stick 4K Max](https://developer.amazon.com/docs/fire-tv/device-specifications-fire-tv-streaming-media-player.html?v=ftvstick4kmax)
  * [Fire TV Stick 4K](https://developer.amazon.com/docs/fire-tv/device-specifications-fire-tv-streaming-media-player.html?v=ftvstick4k)
  * [Fire TV Stick Lite](https://developer.amazon.com/docs/fire-tv/device-specifications-fire-tv-streaming-media-player.html?v=ftvsticklite)
  * [Fire Stick (1st Gen)](https://developer.amazon.com/docs/fire-tv/device-specifications-fire-tv-streaming-media-player.html?v=ftvstickgen1) 
  * Others might work as well with limited functionality

## Download and Setup
1. [Turn on ADB Debugging](https://www.youtube.com/watch?v=40iVXrTWcPU) on your Amazon device
1. Set up the Home Assistant [Android TV Integration](https://www.home-assistant.io/integrations/androidtv/) and connect it to your Amazon Fire Device
1. Click on HACS and select Frontend
1. In the lower right hand corner, click the "+ EXPLORE & DOWNLOAD REPOSITORIES" button
1. Search for, and click on "Firemote Card", then click the "DOWNLOAD" button in the lower right hand corner
1. You will be prompted to reload your browser.  Click the RELOAD button to continue


## How to use
1. On any dashboard, click the +ADD CARD button
1. Search by cards for "Firemote Card", and click on it
1. Under the Entity dropdown, a list of your Android TV integration entities will appear.  Select the one you wish to control.
1. Under Fire Device Type, select the proper device type
1. Click "SAVE"


![Dashboard](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/dashboard.jpg)


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
```

Options:
| Name        | Type   | Required | Options                                                       | Description                            |
| ----------- | ------ | -------- | ------------------------------------------------------------- | -------------------------------------- |
| type        | string | yes      | custom:firemote-card                                          | Type of the card                       |
| entity      | string | yes      | any valid entity created in the android tv integration        | entity_id                              |
| device_type | string | yes      | fire_tv_4_series <br> fire_tv_cube_second_gen <br> fire_tv_stick_4k_max <br> fire_stick_4k <br> fire_tv_stick_lite <br> fire_stick_first_gen | The type of device you are controlling |
| compatibility_mode | string | no | default <br> strong <br> event0 <br> event1 <br> event2 <br> event3 <br> event4 <br> event5 <br> event6 <br> event7 <br> event8 <br> | Adjust this value only if your buttons are completely unresponsive |
| app_launch_1<br>app_launch_2<br>app_launch_3<br>app_launch_4<br>app_launch_5<br>app_launch_6 | string | no | prime-video<br>netflix<br>disney-plus<br>hulu<br>jellyfin<br>hbo-max<br>showtime<br>starz<br>youtube<br>pandora<br>plex<br>tennis-channel<br>amc-plus<br>apple-tv<br>paramount-plus<br>hdmi_1<br>hdmi_2<br>hdmi_3<br>hdmi_4 | Quick launch apps customization |
|hdmi_1<br>hdmi_2<br>hdmi_3</br>hdmi_4| string | no | Personalized name for this HDMI input | The name entered here will appear on the button |
| scale       | integer| no       | Any positive number                                           | Change the size of this card by percentage.  Default size is 100 |

