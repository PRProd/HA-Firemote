# HA-Firemote
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

| Fire TV | Fire Stick 4K | Fire Stick (1st Gen) |
| ------------- | ------------- | ------------- |
| ![Fire TV 4 Series Remote](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireTVRemote.png) | ![Fire TV Stick 4K](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireTVStick4K.png) | ![Fire Stick (1st Gen)](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireStick1stGen.png) |

## Prerequisites
* A functioning version of [Home Assistant](https://www.home-assistant.io/)
* [HACS](https://peyanski.com/how-to-install-home-assistant-community-store-hacs/)
* A supported Amazon Fire Device
  * [Fire TV (4 Series)](https://www.amazon.com/dp/B08SWD2SCK)
  * [Fire TV Cube (2nd Gen) - TESTING](https://www.amazon.com/dp/B08XMDNVX6)
  * [Fire Stick 4K](https://www.amazon.com/dp/B09GK44MZJ)
  * [Fire Stick (1st Gen)](https://en.wikipedia.org/wiki/Amazon_Fire_TV#First_generation_3) 
  * others might work as well with limited functionality

## Download and Setup
1. [Turn on ADB Debugging](https://www.youtube.com/watch?v=40iVXrTWcPU) on your Amazon device
1. Set up the Home Assistant [Android TV Integration](https://www.home-assistant.io/integrations/androidtv/) and connect it to your Amazon Fire Device
1. Click on HACS and select Frontend
1. Click the three dots in the upper right hand corner and select Custom Repositories
1. Paste the URL of this repository in the "Repository" field: https://github.com/PRProd/HA-Firemote
1. Under Category, select Lovelace
1. Click "ADD"
1. In the lower right hand corner, click the "+ EXPLORE & DOWNLOAD REPOSITORIES" button
1. Search for "Firemote Card", click on it and then click the "DOWNLOAD" button in the lower right hand corner
1. You will be prompted to reload your browser.  Click the RELOAD button to continue


## How to use
1. On any dashboard, click the +ADD CARD button
1. Search by cards for "Firemote Card", and click on it
1. Under the Entity dropdown, a list of your Android TV integration entities will appear.  Select the one you wish to control.
1. Under Fire Device Type, select the proper device type
1. Click "SAVE"


![Dashboard](https://github.com/PRProd/HA-Firemote/blob/main/Example%20Images/dashboard.jpg)


## YAML card setup options    
| Name        | Type   | Required | Options                                                       | Description                            |
| ----------- | ------ | -------- | ------------------------------------------------------------- | -------------------------------------- |
| type        | string | yes      | custom:firemote-card                                          | Type of the card                       |
| entity      | string | yes      | any valid entity created in the android tv integration        | entity_id                              |
| device_type | string | yes      | fire_tv_4_series <br> fire_tv_cube_second_gen <br> fire_stick_4k <br> fire_stick_first_gen | The type of device you are controlling |

Example:
```
     type: cusom:firemote-card
     entity: media_player.fire_tv_192_168_1_30
     device_type: fire_tv_4_series
``` 
