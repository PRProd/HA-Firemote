# HA-Firemote
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

| Fire TV | Fire Stick 4K | Fire Stick (1st Gen) |
| ------------- | ------------- | ------------- |
| ![Fire TV 4 Series Remote](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireTVRemote.png) | ![Fire TV Stick 4K](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireTVStick4K.png) | ![Fire Stick (1st Gen)](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireStick1stGen.png) |

## Prerequisites
* A functioning version of [Home Assistant](https://www.home-assistant.io/)
* [HACS](https://peyanski.com/how-to-install-home-assistant-community-store-hacs/)
* [Card-Mod](https://github.com/thomasloven/lovelace-card-mod) (available from HACS)
* A supported Amazon Fire Device
  * [Fire TV 4 Series](https://www.amazon.com/dp/B08SWD2SCK)
  * [Fire Stick 4K](https://www.amazon.com/dp/B09GK44MZJ)
  * [Fire Stick (1st Gen)](https://en.wikipedia.org/wiki/Amazon_Fire_TV#First_generation_3) 
  * others might work as well with limited functionality

## How to use
1. [Turn on ADB Debugging](https://www.youtube.com/watch?v=40iVXrTWcPU) on your Amazon device
1. Set up the Home Assistant [Android TV Integration](https://www.home-assistant.io/integrations/androidtv/) and connect it to your Amazon Fire Device
1. Add this repository's [/logos](https://github.com/PRProd/HA-Firemote/tree/main/logos) directory into your Home Assistant /config/www/ directory
1. Append the contents of this repository's [/scripts.yaml](https://github.com/PRProd/HA-Firemote/blob/main/scripts.yaml) file to your current Home Assistant scripts file [(how do I do that?)](https://siytek.com/home-assistant-script-tutorial-for-dummies/)
1. Add a Manual (blank YAML) card to your dashboard:
   * **For FireTV 4 Series**
     1. Copy the contents of [FireTVSeries4Remote.yaml](https://github.com/PRProd/HA-Firemote/blob/main/FireTVSeries4Remote.yaml)
     1. Paste that contents into a new Manual (blank YAML) card on your dashboard
     1. Change [lines 3 - 5](https://github.com/PRProd/HA-Firemote/blob/main/FireTVSeries4Remote.yaml#L3-L5) to reflect the entity name of the Amazon Android TV device that you set up in step 2. For example: media_player.fire_tv_192_168_107_88 - Your individual name will vary, so use the entity name that fits your situation.
       
   * **For Fire Stick 4K**
     1. Copy the contents of [FireStick4KRemote.yaml](https://github.com/PRProd/HA-Firemote/blob/main/FireStick4KRemote.yaml)
     1. Paste that contents into a new Manual (blank YAML) card on your dashboard
     1. Change [line 3](https://github.com/PRProd/HA-Firemote/blob/main/FireStick4KRemote.yaml#L3) to reflect the entity name of the Amazon Android TV device that you set up in step 2. For example: media_player.fire_tv_192_168_107_201 - Your individual name will vary, so use the entity name that fits your situation.
 
   * **For Fire Stick (1st Gen)**
     1. Copy the contents of [FireStick1stGen.yaml](https://github.com/PRProd/HA-Firemote/blob/main/FireStick1stGen.yaml)
     1. Paste that contents into a new Manual (blank YAML) card on your dashboard
     1. Change [lines 3-5](https://github.com/PRProd/HA-Firemote/blob/main/FireStick1stGen.yaml#L3-L5) to reflect the entity name of the Amazon Android TV device that you set up in step 2. For example: media_player.fire_tv_192_168_107_8 - Your individual name will vary, so use the entity name that fits your situation.
     
1. A Home Assistant restart, or script reload may be required to make this remote control UI fully functional

![Dashboard](https://github.com/PRProd/HA-Firemote/blob/main/Example%20Images/dashboard.jpg)
