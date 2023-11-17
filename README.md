# HA-Firemote
[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/PRProd/HA-Firemote?style=for-the-badge)
![Maintenance](https://img.shields.io/maintenance/yes/2023?style=for-the-badge)

<a href="https://www.buymeacoffee.com/PRProd" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

Need More Information?  Check out this project's [Wiki](https://github.com/PRProd/HA-Firemote/wiki) page

| ![Fire TV Remote Style 6](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/AF6.png) | ![Fire TV Remote Style 5](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/AF5.png) | ![Fire TV Remote Style 4](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/AF4.png) | ![Fire TV Remote Style 3](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/AF3.png) | ![Fire TV Remote Style 2](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/AF2.png) | ![Fire TV Remote Style 1](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/AF1.png)
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |

| ![Apple TV Remote Style 3](https://github.com/PRProd/HA-Firemote/assets/25486599/af60a8e5-5278-4854-8a3d-622e63e44257) | ![Apple TV Remote Style 2](https://github.com/PRProd/HA-Firemote/assets/25486599/f2913052-62da-43f1-b644-f42efad2cf7a) | ![Apple TV Remote Style 1](https://github.com/PRProd/HA-Firemote/assets/25486599/1b0323af-22d6-42c2-9752-ff8e42a08865) | ![NVIDIA Shield Remote 2](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/NS2.png) | ![NVIDIA Shield Remote 1](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/NS1.png) |  ![Chromecast Remote](https://github.com/PRProd/HA-Firemote/assets/25486599/36a14224-b46f-4d4c-97ec-b1217e99b272) 
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |

| ![Xiaomi Mi Remote 2](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/XM2.png) | ![App Launcher 1](https://github.com/PRProd/HA-Firemote/raw/main/Example%20Images/AL1.png) | ![App Launcher 2](https://github.com/PRProd/HA-Firemote/assets/25486599/9531fd5f-9003-41f1-bc05-a6d3962e346b)
| ------------- | ------------- | ------------- |

<br>
<br>
<br>

## Prerequisites
* A functioning version of [Home Assistant](https://www.home-assistant.io/)
* [HACS](https://peyanski.com/how-to-install-home-assistant-community-store-hacs/) (not required, but it makes things easier)
* A supported device
  * Amazon Fire Smart TV
  * Amazon Fire Stick
  * Amazon Fire Cube
  * Apple TV
  * NVIDIA Shield
  * NVIDIA Shield Pro
  * Xiaomi Mi Box S
  * Chromecast
  * Other Android-based non-fire devices might work as well, but with limited (and unsupported) functionality

[Which Amazon Fire devices are supported?](../../wiki/Existing-Amazon-Devices---Support-Chart)<br>
[Which Amazon Fire device do I own?](https://developer.amazon.com/docs/fire-tv/device-specifications.html)<br>
Which Apple TV device do I own?<br>
[Which NVIDIA Shield devices are supported?](../../wiki/Existing-NVIDIA-Shield-Devices-Support-Chart)<br>
[Which NVIDIA Shield device do I own?](https://www.nvidia.com/en-us/shield/)<br>
Which Xiaomi Mi device do I own?<br>
Which Chromecast device do I own?

<br>
<br>
<br>

## Download and Setup via Home Assistant UI & HACS
1. For non-Apple TV users, [Turn on ADB Debugging](https://www.youtube.com/watch?v=40iVXrTWcPU) on your Amazon, Shield, Xiaomi, Chromecast, or Android TV device
1. Connect your device to Home Assistant:
   - Amazon, Shield, Xiaomi, Chromecast, or Android TV users:
     - Set up the Home Assistant [Android Debug Bridge Integration](https://www.home-assistant.io/integrations/androidtv/) and connect it to your device (**always required in every setup**)
     - Optionally, for non Amazon Fire devices only, you may additionally choose to set up the Home Assistant [Android TV Remote Integration](https://www.home-assistant.io/integrations/androidtv_remote/) and connect it to your device. (optional)
   - Apple TV Users
     - Set up the Home Assistant [Apple TV Integration](https://www.home-assistant.io/integrations/apple_tv) and connect it to your device.  This will create a "Media Player" entity, and a "Remote" entity automatically.
1. Click on HACS and select Frontend
1. In the lower right-hand corner, click the "+ EXPLORE & DOWNLOAD REPOSITORIES" button
1. Search for, and click on "Firemote Card" then click the "DOWNLOAD" button in the lower right-hand corner
1. You will be prompted to reload your browser.  Click the RELOAD button to continue

## OR Install Manually
1. For non-Apple TV users, [Turn on ADB Debugging](https://www.youtube.com/watch?v=40iVXrTWcPU) on your Amazon, Shield, Xiaomi, Chromecast, or Android TV device
1. Connect your device to Home Assistant:
   - Amazon, Shield, Xiaomi, Chromecast, or Android TV users:
     - Set up the Home Assistant [Android Debug Bridge Integration](https://www.home-assistant.io/integrations/androidtv/) and connect it to your device (**always required in every setup**)
     - Optionally, for non Amazon Fire devices only, you may additionally choose to set up the Home Assistant [Android TV Remote Integration](https://www.home-assistant.io/integrations/androidtv_remote/) and connect it to your device. (optional)
   - Apple TV Users
     - Set up the Home Assistant [Apple TV Integration](https://www.home-assistant.io/integrations/apple_tv) and connect it to your device.  This will create a "Media Player" entity, and a "Remote" entity automatically.
1. Download the contents of the [dist/](https://github.com/PRProd/HA-Firemote/blob/main/dist/) directory, and place it in your Home Assistant /config/www directory
1. [Register the HA-Firemote.js file that you just installed as a new resource](https://developers.home-assistant.io/docs/frontend/custom-ui/registering-resources/)

<br>
<br>

## How to use
1. On any dashboard, click the +ADD CARD button
1. Search by cards for "Firemote Card" and click on it
1. Under the **Device Family** dropdown, choose "Amazon Fire", "Apple TV",  "Chromecast", "NVIDIA Shield", or "Xiaomi"
   - Amazon, Shield, Xiaomi, Chromecast, or Android TV users:
     - Under **Device Model**, select the device model that you own. (Help: Which [Amazon Fire](https://developer.amazon.com/docs/fire-tv/device-specifications.html) or [NVIDIA Shield](https://www.nvidia.com/en-us/shield/)  device do I own?)
     - Under the Android Debug Bridge Entity dropdown, a list of your Android Debug Bridge integration entities will appear.  Select the one you wish to control.
     - If you are setting up something other than an Amazon Fire device, select the Associated Android TV Remote Entity that points to the same device as your Android Debug Bridge entity.  This step is not required, but it will greatly improve the speed and reliability of your Firemote card
   - Apple TV Users
     - Under **Apple TV Device Model**, select the device model that you own
     - Under **Apple TV Media Player Entity**, select the Apple TV Media Player entity you wish to control
     - Under **Apple TV Remote Entity**, select the Apple TV remote entity that is associated with the Apple TV Media Player Entity you chose in the previous step
1. Make any other optional changes to your card, then click "SAVE"  Other options include changing the app launch buttons to apps that you use most often, or changing the style of your remote control to look like something completely different from what shipped with your device.  You can even add names and adjust the size of your Firemote card too!

![Config](https://github.com/PRProd/HA-Firemote/assets/25486599/9a4f061c-9584-44df-92f8-07d5e8346c6b)



<br>
<br>
<br>

## Screenshots from Users
![Dashboard](https://github.com/PRProd/HA-Firemote/assets/25486599/ddc0dc74-2b5d-47bd-b73f-05249dda3377)<br>
[Click here](https://github.com/PRProd/HA-Firemote/discussions/129) to see the full gallery

<br>
<br>
<br>

## YAML card setup options
Examples:
```yaml
type: custom:firemote-card
entity: media_player.fire_tv_192_168_1_30
device_family: amazon-fire
device_type: fire_tv_4_series
compatibility_mode: default
app_launch_1: prime-video
app_launch_2: netflix
app_launch_3: hdmi_1
app_launch_4: youtube
hdmi_1: Cable
scale: 85
```
```yaml
type: custom:firemote-card
entity: media_player.apple_tv_4k_2nd_gen
device_family: apple-tv
device_type: appletv-4k-gen2
compatibility_mode: default
apple_tv_remote_entity: remote.apple_tv_4k_2nd_gen
app_launch_1: apple-appstore
app_launch_2: apple-tv-arcade
app_launch_3: mlb
app_launch_4: nfl
visible_name_text: Game Room
name_position: top
button_overrides:
  mute-button:
    script: receiver_mute_script
```
```yaml
type: custom:firemote-card
entity: media_player.android_tv_192_168_107_209
device_family: nvidia-shield
device_type: shield-tv-pro-2019
compatibility_mode: default
android_tv_remote_entity: remote.shield
scale: '100'
app_launch_1: netflix
app_launch_2: function-find-my-remote
app_launch_3: function-mute
```

Options:
| Name                   | Type   | Required | Options                                                          | Description                            |
| ---------------------- | ------ | -------- | ---------------------------------------------------------------- | -------------------------------------- |
| type                   | string | yes      | custom:firemote-card                                             | Type of the card                       |
| entity                 | string | yes      | any valid media player entity created in the [Android Debug Bridge Integration](https://www.home-assistant.io/integrations/androidtv/) or the [Apple TV Integration](https://www.home-assistant.io/integrations/apple_tv) | entity_id                              |
| device_family          | string | yes      | amazon-fire<br>apple-tv<br>chromecast<br>nvidia-shield<br>xiaomi | Manufacturer Family                    |
|android_tv_remote_entity| string | no       | any valid entity created in the [Android TV Remote Integration](https://www.home-assistant.io/integrations/androidtv_remote/) | entity_id<br>Ignored in Apple TV configurations
| apple_tv_remote_entity | string | yes*     | any valid remote entity created in the [Apple TV Integration](https://www.home-assistant.io/integrations/apple_tv)  | entity_id<br>* Required ONLY in Apple TV configurations
| device_type            | string | yes      | appletv-4k-gen2<br>appletv-gen4<br>chromecast-4k<br>[fire_tv_toshiba_v35](https://github.com/PRProd/HA-Firemote/wiki/Smart-TV---Toshiba-V35-Series-LED-FHD-HD---Fire-TV-(2021)) <br> [fire_tv_4_series](https://github.com/PRProd/HA-Firemote/wiki/Smart-TV---Fire-TV-4-Series-(2021)) <br> [fire_tv_cube_third_gen](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Cube---3rd-Gen-(2022)) <br> [fire_tv_cube_second_gen](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Cube---2nd-Gen-(2019)) <br> [fire_tv_cube_first_gen](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Cube---1st-Gen-(2018)) <br> [fire_tv_stick_4k_max_second_gen](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Stick-4K-Max-2nd-Gen-(2023)) <br> [fire_tv_stick_4k_second_gen](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Stick-4K-2nd-Gen-(2023)) <br>[fire_tv_stick_4k_max](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Stick-4K-Max---1st-Gen-(2021)) <br> [fire_tv_3rd_gen](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Stick---3rd-Gen-(2020)) <br> [fire_tv_stick_lite](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Stick-Lite---1st-Gen-(2020)) <br> [fire_stick_4k](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Stick-4K---1st-Gen-(2018)) <br> [fire_stick_second_gen](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Stick---2nd-Gen-(2016---2019)) <br> [fire_stick_first_gen](https://github.com/PRProd/HA-Firemote/wiki/Fire-TV-Stick-1st-Gen-(2014)) <br> shield-tv-2017 <br> shield-tv-pro-2017 <br> shield-tv-2019 <br> shield-tv-pro-2019 <br> mi-box-s | The type of device you are controlling<br>[Which devices are supported?](https://github.com/PRProd/HA-Firemote/wiki/Existing-Amazon-Devices---Support-Chart)<br>[Which device do I own?](https://developer.amazon.com/docs/fire-tv/device-specifications.html) |
| compatibility_mode | string | no | default <br> strong <br> event0 <br> event1 <br> event2 <br> event3 <br> event4 <br> event5 <br> event6 <br> event7 <br> event8 <br> event9 <br> event10 <br> event11 <br> event12 <br> event13 | Adjust this value only if your buttons are completely unresponsive<br><br>Ignored in Apple TV configurations<br><br>[FAQ Available for additional help](https://github.com/PRProd/HA-Firemote#faq) |
|defaultRemoteStyle_override | string | no | AF1 <br> AF2 <br> AF3 <br> AF4 <br> AF5 <br> AF6 <br> AR1 <br> AR2 <br> AR3 <br> CC1 <br> NS1 <br> NS2 <br> XM2 <br> AL1 <br> AL2 | Optionally select a style of remote different from the one that shipped with your device |
| app_launch_1<br>app_launch_2<br>app_launch_3<br>app_launch_4<br>app_launch_5<br>etc... | string | no | [ See App Launch Button Customization section for options](#app-launch-button-customization) | Quick launch apps customization |
|hdmi_1<br>hdmi_2<br>hdmi_3</br>hdmi_4| string | no | Personalized name for this HDMI input | The name entered here will appear on the button (truncated to 8 characters to fit)|
| scale       | integer| no       | Any positive number                                           | Change the size of this card by percentage. The default size is 100 |
| button_overrides | object | no | Button name and HA script name are required.| Details are in the Button Overrides section of the [README.md](https://github.com/PRProd/HA-Firemote/edit/main/README.md#button-overrides) file |
| visible_name_text       | string | no      | Any text                                                         | Optional device label for your firemote|
| name_position           | string | no      | hidden<br>bottom<br>top<br>                                      | Position for your optional device label|
| visible_name_text_color | hex color value | no | Any hex color value e.g.: #ffffff                            | Optional text color for the device name label |
| show_version_number     | bool   | no      | true<br>false                                                    | Optionally display the Firemote Version number on the card|
| hide_button_highlights  | bool   | no      | true<br>false                                                    | Optionally hide the status higlighting decorations for the power, home, and play/pause buttons|
| use_theme_background    | bool   | no      | true<br>false                                                    | Optionally hide the AL1 or AL2 remote style's background color to let the HA theme color show|

<br>
<br>
<br>

## App Launcher Buttons
Custom app launch buttons are not limited to the few that came printed on your remote control.  In fact, the possibilities are endless!  If you don't see your favorite app on this list, you can click on the [Issues](https://github.com/PRProd/HA-Firemote/issues) button on the top of this page, click 'New Issue' and then click the "Get Started" button next to the "App Shortcut Request" option.  [Click here](https://github.com/PRProd/HA-Firemote/wiki/Firemote-App-Launchers) to view the chart of **over 200** options

<br>
<br>
<br>

## Launcher Button Customizations
You are not limited to only using the launcher buttons that come with Firemote.  Through YAML, you can define your own working buttons in one of two ways: defining a script or constructing a service call.

Example:
```yaml
type: custom:firemote-card
entity: media_player.fire_tv_192_168_107_88
device_family: amazon-fire
device_type: fire_tv_4_series
compatibility_mode: default
custom_launchers:
  - friendly_name: flash the light
    label: FLASH
    image_path: https://upload.wikimedia.org/wikipedia/commons/2/28/Flash-outlined-thin-circular-button.svg
    color: red
    background: white
    script: flashthelablight
  - friendly_name: Red Lamp
    label: red
    icon: mdi:lamp
    color: red
    background: blue
    service: light.toggle
    target:
      entity_id: light.bedroom_lamp
    data:
      color_name: red
      transition: 2
      brightness_pct: 100
app_launch_1: customlauncher flash the light
app_launch_2: customlauncher Red Lamp
scale: '110'
```
<br>

YAML usage:
| Key           | Value           | Required                  | Description                                                                     |
| ------------- | --------------- | ------------------------- | ------------------------------------------------------------------------------- |
| friendly_name | string          | yes                       | This is the name that will appear in the GUI app selector dropdown              |
| label         | string          | no                        | The text that will appear on the button                                         |
| icon          | mdi icon name   | no                        | a valid mdi icon name<br> ex: mdi:lamp                                          |
| image_path    | url             | no                        | path to an image resource                                                       |
| color         | css color value | no                        | custom color for your text label or your mdi icon<br>ex: white<br>ex: '#ff0000' |
| background    | css color value | no                        | custom color for your button's background<br>ex: green<br>ex: '#ffffff'         |
| script        | string          | yes if calling a script   | The name of your Home Assistant script                                          |
| service       | string          | yes if not using a script | The name of the Home Assistant service you want to call                         |
| target        | object          | yes if not using a script | Define the entity for your service to act upon                                  |
| data          | object          | no                        | optional parameters for your service call                                       |


Once defined, a custom button can be assigned to a Firemote button location through the YAML config itself, or it can be selected through the Visual Editor dropdown

![image](https://github.com/PRProd/HA-Firemote/assets/25486599/ce6ccb6c-fae1-4757-8ee8-087831e4b5b5)

<br>
<br>
<br>

## Button Overrides
Button Overrides can be very useful for customization.  These overrides can be used to call a Home Assistant service directly, run a script, or hide a button on your remote.  These options are accomplished through your Firemote's YAML configuration.

Consider this example:
```yaml
button_overrides:
  mute-button:
    script: receiver_mute_script
  volume-down-button:
    script: receiver_volume_down_script
  volume-up-button:
    service: light.toggle
    target:
      entity_id: light.bedroom_lamp
    data:
      color_name: red
      transition: 2
      brightness_pct: 100
  power-button:
    hidden: true
```

Valid button names are as follows:
 - app-switch-button
 - apps-button
 - back-button
 - center-button
 - channel-down-button
 - channel-up-button
 - down-button
 - fastforward-button
 - hamburger-button
 - headset-button
 - home-button
 - input-button
 - keyboard-button
 - left-button
 - mute-button
 - playpause-button
 - power-button
 - programmable-one-button
 - programmable-two-button
 - restart-button
 - rewind-button
 - right-button
 - search-button
 - settings-button
 - tv-button
 - up-button
 - volume-down-button
 - volume-up-button
 
<br>
<br>
<br>

## FAQ
###  Why won't the volume, mute, and/or power buttons work from my Firemote card?
In many cases, your remote control sends commands for volume, mute, and power to your TV or receiver using the IR emitter on the front of the physical remote control.  These IR commands cannot be sent in a traditional Home Assistant setup.
<br>

If your player device AND the device they are connected to both offer CEC options, then activating CEC will allow the Firemote card controls to work as expected.  [Click here](https://github.com/PRProd/HA-Firemote/wiki/Using-CEC-Controls) to learn more about how to [configure CEC to work with your Firemote](https://github.com/PRProd/HA-Firemote/wiki/Using-CEC-Controls).  Another option might be to control your devices (TVs, Receivers, etc.) using [Button Overrides](https://github.com/PRProd/HA-Firemote#button-overrides).  If you can control those kinds of devices through Home Assistant, you can write a HA script and attach that script to a button on your Firemote.
<br>

Due to the way the Apple TV Home Assistant integration is built, an Apple TV style Firemote cannot properly simulate a "Mute" button press.  A [Button Override](https://github.com/PRProd/HA-Firemote#button-overrides) will be required in this case.
<br>
<br>

### Why don't any of the buttons on the Firemote work at all? ###
 * If your Firemote used to work perfectly, and some or all of the buttons suddenly stopped working, it could be that all you need to do is press one button (any button) on your Fire TV device's physical remote control.  After doing that step, try your Firemote again.  This step most commonly fixes the issue in Amazon Fire devices after they are powered on, restarted, or updated.
 * Check your card configuration:
   * Is the correct Android device selected?
   * Is the correct Device Family selected?
   * Is the correct Device type selected?
   * If you are using it, is the correct matching Android TV Remote Entity selected?
   * Is Compatibility Mode set to Default?
 * If the Default Compatibility Mode is not working on your device, and you've checked every other step, slowly choose "event0", "event1", etc. and test your remote buttons under each mode.  One of these will work.
<br>

### Why isn't my Amazon Fire Device supported?
There are over 40 kinds of Amazon Fire devices, so it will take a while to gain properly tested support for all of them.  If Firemote doesn't support your Amazon Fire device yet, you can still use Firemote!  Simply choose a supported device that is similar to the one that you have (preferably a remote that looks the same as your physical remote), then you can test different compatibility modes to find out which one works the best.<br>

For extra credit, you could submit a request to have your device added!  It's simple!  Click on the [Issues](https://github.com/PRProd/HA-Firemote/issues) button on the top of this page, click 'New Issue' and then click the "Get Started" button next to the "Device Support Request" option.  Your help is VERY appreciated!
<br>
<br>

### Why do only some of the Firemote buttons for the Apps that came with my Apple TV work properly, while others don't?
Apple TV app shortcuts work simply by passing the name of the app to the apple tv remote entity.  Firemote is built and tested against an environment that uses English as the primary language.  In some scenarios, built-in Apple TV apps use language app specific names, which is why asking it to open the English version of that app's name does not work.  In order to overcome this, I request that you click the [Issues](https://github.com/PRProd/HA-Firemote/issues) button at the top of this page so we can work together and make all of these buttons work in your native language.
<br>
<br>

### I want a shortcut button for an app I use frequently, but it's not on the list.  Can it be added?
Absolutely!  Simply ask!  Here's how: Click the [Issues](https://github.com/PRProd/HA-Firemote/issues) button at the top of this page, click 'New Issue' and then click the "Get Started" button next to the "App Shortcut Request" option.  Your request is important to you and likely important to others as well!  If the app is easily downloaded through your device's official store (not sideloaded), your request will be granted ASAP.
<br>
<br>

### How do I report a problem, make a request, or talk about stuff?
Click on the [Issues](https://github.com/PRProd/HA-Firemote/issues) button at the top of this page, click 'New Issue', and select the appropriate category for your needs.  You're also welcome to join or begin a new [discussion](https://github.com/PRProd/HA-Firemote/discussions) if that suits your needs.
<br>
<br>

### How can I contribute?
 - Take a look at the current [discussions board](https://github.com/PRProd/HA-Firemote/discussions) to see if anything is tagged with "Help Wanted".
 - <a href="https://www.buymeacoffee.com/PRProd" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
 - Since it is personally expensive for me to purchase, evaluate, and develop integrations for all of your requests, I've set up an [Amazon Wish List (US)](https://www.amazon.com/hz/wishlist/ls/2UDS10RPJ6F5K?ref_=wl_share) and an [Amazon Wish List (DE)](https://www.amazon.de/hz/wishlist/ls/HFABU3R70GWE?ref_=wl_share) for any of you who are feeling incredibly generous and want to send me something that I don't already own.
