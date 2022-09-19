# HA-Firemote
| Fire TV | Fire Stick 4K | Fire Stick (1st Gen) |
| ------------- | ------------- | ------------- |
| ![Fire TV 4 Series Remote](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireTVRemote.png) | ![Fire TV Stick 4K](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireTVStick4K.png) | ![Fire Stick (1st Gen)](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/fireStick1stGen.png) |

## Prerequisites
* A functioning version of [Home Assistant](https://www.home-assistant.io/)
* [HACS](https://peyanski.com/how-to-install-home-assistant-community-store-hacs/)
* [Card-Mod](https://github.com/thomasloven/lovelace-card-mod) (available from HACS)
* A supported Amazon Fire Device
  * Currently supported/tested devices are [Fire TV 4 Series](https://www.amazon.com/dp/B08SWD2SCK), [Fire Stick 4K](https://www.amazon.com/dp/B09GK44MZJ), and Fire Stick (1st Gen) but others might work as well

## How to use
1. [Turn on ADB Debugging](https://www.youtube.com/watch?v=40iVXrTWcPU) on your Amazon device
1. Set up the [Android TV Integration](https://www.home-assistant.io/integrations/androidtv/) to connect it to your Amazon Fire Device
1. Add this repository's [/logos](https://github.com/PRProd/HA-Firemote/tree/main/logos) directory into your Home Assistant /config/www/ directory
1. Append the contents of this repository's [/scripts.yaml](https://github.com/PRProd/HA-Firemote/blob/main/scripts.yaml) file to your current Home Assistant scripts file
1. Add a Manual (blank YAML) card to your dashboard, and paste the contents of the appropriate *Remote.yaml file from this repository file onto the new blank card
1. Change [line 3](https://github.com/PRProd/HA-Firemote/blob/main/FireStick4KRemote.yaml#L3) **tv_entity:** to reflect the name of your Amazon Android TV device that you set up in step 2
1. A Home Assistant restart, or script reload may be required to make this remote control UI fully functional
