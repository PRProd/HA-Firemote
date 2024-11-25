const devices = {
  "amazon-fire": {

    "meta": {
      "friendlyName": "Amazon Fire",
      "supported": true,
    },

    "Smart TV": {

      "fire_tv_4_series": {
        "supported": true,
        "friendlyName": "Fire TV (4 Series - 2021)",
        "defaultEventListenerBinPath": "/dev/input/event0",
        "defaultRemoteStyle": "AF5",
        "hdmiInputs": 4,
        "tuner": true,
      },
      "fire_tv_hisense_u6_4k_uhd_2022": {
        "supported": false,
        "friendlyName": "Hisense U6 4K UHD - Fire TV (2022)",
        "defaultEventListenerBinPath": "/dev/input/event0",
        "defaultRemoteStyle": "AF5",
        "hdmiInputs": 4,
        "tuner": true,
      },
      "fire_tv_insignia_f20": {
        "supported": true,
        "friendlyName": "INSIGNIA TV (F20 Series)",
        "defaultEventListenerBinPath": "/dev/input/event0",
        "defaultRemoteStyle": "AF5",
        "hdmiInputs": 3,
        "tuner": true,
      },
      "fire_tv_jvc-4k-2021": {
        "supported": true,
        "friendlyName": "JVC 4K - Fire TV with Freeview Play (2021)",
        "defaultEventListenerBinPath": "/dev/input/event0",
        "defaultRemoteStyle": "AFJTV",
        "hdmiInputs": 4,
        "tuner": true,
      },
      "fire_tv_toshiba_v35": {
        "supported": true,
        "friendlyName": "Toshiba Fire TV (V35 Series - 2021)",
        "defaultEventListenerBinPath": "/dev/input/event0",
        "defaultRemoteStyle": "AF5",
        "hdmiInputs": 4,
        "tuner": true,
      },
      "fire_tv_xiaomi_f202922": {
        "supported": false,
        "friendlyName": "Xiaomi F2 4K ‐ Fire TV (2022)",
        "defaultEventListenerBinPath": "/dev/input/event0",
        "defaultRemoteStyle": "AFXF2",
        "hdmiInputs": 4,
        "tuner": true,
      },
    },

    "Fire TV Cube": {

      "fire_tv_cube_third_gen": {
        "supported": true,
        "friendlyName": "Fire TV Cube (3rd Gen - 2022)",
        "defaultEventListenerBinPath": "/dev/input/event3",
        "defaultRemoteStyle": "AF5",
        "hdmiInputs": 1,
      },
      "fire_tv_cube_second_gen": {
        "supported": true,
        "friendlyName": "Fire TV Cube (2nd Gen - 2019)",
        "defaultEventListenerBinPath": "/dev/input/event5",
        "defaultRemoteStyle": "AF4",
        "hdmiInputs": 0,
      },
      "fire_tv_cube_first_gen": {
        "supported": true,
        "friendlyName": "Fire TV Cube (1st Gen - 2018)",
        "defaultEventListenerBinPath": "/dev/input/event5",
        "defaultRemoteStyle": "AF1",
        "hdmiInputs": 0,
      },
    },

    "Streaming Media Player": {

      "fire_tv_stick_4k_max_second_gen": {
        "supported": true,
        "friendlyName": "Fire TV Stick 4K Max (2nd Gen - 2023)",
        "defaultRemoteStyle": "AF5",
        "hdmiInputs": 0,
      },
      "fire_tv_stick_4k_second_gen": {
        "supported": true,
        "friendlyName": "Fire TV Stick 4K (2nd Gen - 2023)",
        "defaultRemoteStyle": "AF4",
        "hdmiInputs": 0,
      },
      "fire_tv_stick_4k_max": {
        "supported": true,
        "friendlyName": "Fire TV Stick 4K Max (1st Gen - 2021)",
        "defaultEventListenerBinPath": "/dev/input/event5",
        "defaultRemoteStyle": "AF4",
        "hdmiInputs": 0,
      },
      "fire_tv_3rd_gen": {
        "supported": true,
        "friendlyName": "Fire TV Stick (3rd Gen - 2020)",
        "defaultEventListenerBinPath": "/dev/input/event4",
        "defaultRemoteStyle": "AF3",
        "hdmiInputs": 0,
      },
      "fire_tv_stick_lite": {
        "supported": true,
        "friendlyName": "Fire TV Stick Lite (1st Gen - 2020)",
        "defaultEventListenerBinPath": "/dev/input/event4",
        "defaultRemoteStyle": "AF2",
        "hdmiInputs": 0,
      },
      "fire_stick_4k": {
        "supported": true,
        "friendlyName": "Fire TV Stick 4K (1st Gen - 2018)",
        "defaultEventListenerBinPath": "/dev/input/event4",
        "defaultRemoteStyle": "AF3",
        "hdmiInputs": 0,
      },
      "fire_stick_second_gen": {
        "supported": true,
        "friendlyName": "Fire TV Stick (2nd gen - 2016 - 2019)",
        "defaultEventListenerBinPath": "/dev/input/event4",
        "defaultRemoteStyle": "AF3",
        "hdmiInputs": 0,
      },
      "fire_stick_basic": {
        "supported": true,
        "friendlyName": "Fire TV Stick (Basic Edition - 2017)",
        "defaultEventListenerBinPath": "/dev/input/event4",
        "defaultRemoteStyle": "AF1",
        "hdmiInputs": 0,
      },
      "fire_stick_first_gen": {
        "supported": true,
        "friendlyName": "Fire TV Stick (1st gen - 2014)",
        "defaultEventListenerBinPath": "/dev/input/event1",
        "defaultRemoteStyle": "AF1",
        "hdmiInputs": 0,
      },
      "fire_tv_third_gen_2017": {
        "supported": true,
        "friendlyName": "Fire TV (3rd Gen - 2017)",
        "defaultEventListenerBinPath": "/dev/input/event3",
        "defaultRemoteStyle": "AF1",
        "hdmiInputs": 0,
      },
      "fire_tv_second_gen_2015": {
        "supported": true,
        "friendlyName": "Fire TV (2nd Gen - 2015)",
        "defaultEventListenerBinPath": "/dev/input/event6",
        "defaultRemoteStyle": "AF1",
        "hdmiInputs": 0,
      },
      "fire_tv_first_gen_2014": {
        "supported": false,
        "friendlyName": "Fire TV (1st Gen - 2014)",
        "defaultEventListenerBinPath": "/dev/input/event3",
        "defaultRemoteStyle": "AF1",
        "hdmiInputs": 0,
      },
    },
  },


  "apple-tv": {

    "meta": {
      "friendlyName": "Apple TV",
      "supported": true,
    },

    "noCategory": {

      "appletv-4k-gen3": {
        "supported": true,
        "friendlyName": "Apple TV 4K - Gen3 2022",
        "defaultRemoteStyle": "AR3",
        "hdmiInputs": 0,
      },
      "appletv-4k-gen2": {
        "supported": true,
        "friendlyName": "Apple TV 4K - Gen2 2021",
        "defaultRemoteStyle": "AR3",
        "hdmiInputs": 0,
      },
      "appletv-4k-gen1": {
        "supported": true,
        "friendlyName": "Apple TV 4K - Gen1 2017",
        "defaultRemoteStyle": "AR2",
        "hdmiInputs": 0,
      },
      "appletv-gen4": {
        "supported": true,
        "friendlyName": "Apple TV HD - Gen4 2015",
        "defaultRemoteStyle": "AR2",
        "hdmiInputs": 0,
      },
      "appletv-gen3": {
        "supported": true,
        "friendlyName": "Apple TV Gen3 2012",
        "defaultRemoteStyle": "AR1",
        "hdmiInputs": 0,
      },
      "appletv-gen2": {
        "supported": true,
        "friendlyName": "Apple TV Gen2 2010",
        "defaultRemoteStyle": "AR1",
        "hdmiInputs": 0,
      },
      "appletv-gen1": {
        "supported": true,
        "friendlyName": "Apple TV Gen1 2007",
        "defaultRemoteStyle": "AR1",
        "hdmiInputs": 0,
      },

    }

  },


  "chromecast": {

    "meta": {
      "friendlyName": "Chromecast",
      "supported": true,
    },

    "noCategory": {

      "chromecast-4k": {
        "supported": true,
        "friendlyName": "Chromecast 4K",
        "defaultRemoteStyle": "CC1",
        "hdmiInputs": 0,
      },
      "chromecast-hd": {
        "supported": true,
        "friendlyName": "Chromecast HD",
        "defaultRemoteStyle": "CC1",
        "hdmiInputs": 0,
      },

    }

  },


  "homatics": {

    "meta": {
      "friendlyName": "Homatics",
      "supported": true,
    },

    "noCategory": {

      "dune-hd-box-4-4k-plus": {
        "supported": true,
        "friendlyName": "Dune HD Box R 4K Plus",
        "defaultRemoteStyle": "HO4",
        "hdmiInputs": 0,
      },
      "box-4-4k-plus": {
        "supported": true,
        "friendlyName": "Box R 4K Plus",
        "defaultRemoteStyle": "HO1",
        "hdmiInputs": 0,
      },

    }

  },


  "nvidia-shield": {

    "meta": {
      "friendlyName": "NVIDIA Shield",
      "supported": true,
    },

    "noCategory": {

      "shield-tv-pro-2019": {
        "supported": true,
        "friendlyName": "SHIELD TV Pro (2019)",
        "defaultRemoteStyle" : "NS2",
      },
      "shield-tv-2019": {
        "supported": true,
        "friendlyName": "SHIELD TV (2019)",
        "defaultRemoteStyle" : "NS2",
      },
      "shield-tv-pro-2017": {
        "supported": true,
        "friendlyName": "SHIELD TV Pro (2015 or 2017)",
        "defaultRemoteStyle" : "NS1",
      },
      "shield-tv-2017": {
        "supported": true,
        "friendlyName": "SHIELD TV (2015 or 2017)",
        "defaultRemoteStyle" : "NS1",
      },

    },
  },


  "onn": {

    "meta": {
      "friendlyName": "onn.",
      "supported": true,
    },

    "noCategory": {

      "onn-streaming-device-4k-pro": {
        "supported": true,
        "friendlyName": "onn. Streaming Device 4K pro",
        "defaultRemoteStyle" : "ON2",
      },
      "onn-4k-streaming-box": {
        "supported": true,
        "friendlyName": "onn. 4K Streaming Box",
        "defaultRemoteStyle" : "ON1",
      },
      "onn-full-hd-streaming-stick": {
        "supported": true,
        "friendlyName": "onn. Full HD Streaming Stick",
        "defaultRemoteStyle" : "ON1",
      },
    },

  },


  "roku": {

    "meta": {
      "friendlyName": "Roku",
      "supported": true,
    },

    "Streaming Players": {

      "roku-streambar-pro": {
        "supported": true,
        "friendlyName": "Roku Streambar Pro",
        "defaultRemoteStyle" : "RVRP",
        "hdmiInputs": 0,
      },
      "roku-streambar": {
        "supported": true,
        "friendlyName": "Roku Streambar",
        "defaultRemoteStyle" : "RVR",
        "hdmiInputs": 0,
      },
      "roku-ultra-lt-2023": {
        "supported": true,
        "friendlyName": "Roku Ultra LT (2023)",
        "defaultRemoteStyle" : "RVRP",
        "hdmiInputs": 0,
      },
      "roku-ultra-lt": {
        "supported": true,
        "friendlyName": "Roku Ultra LT",
        "defaultRemoteStyle" : "RVR",
        "hdmiInputs": 0,
      },
      "roku-ultra-2020": {
        "supported": true,
        "friendlyName": "Roku Ultra (2020)",
        "defaultRemoteStyle" : "RVRP",
        "hdmiInputs": 0,
      },
      "roku-streaming-stick-4k": {
        "supported": true,
        "friendlyName": "Roku Streaming Stick 4K",
        "defaultRemoteStyle" : "RVR",
        "hdmiInputs": 0,
      },
      "roku-express-4k-plus": {
        "supported": true,
        "friendlyName": "Roku Express 4K+",
        "defaultRemoteStyle" : "RVR",
        "hdmiInputs": 0,
      },
      "roku-express-4k": {
        "supported": true,
        "friendlyName": "Roku Express 4K",
        "defaultRemoteStyle" : "RVR",
        "hdmiInputs": 0,
      },
      "roku-express": {
        "supported": true,
        "friendlyName": "Roku Express",
        "defaultRemoteStyle" : "RSR",
        "hdmiInputs": 0,
      },
      "roku-premiere": {
        "supported": true,
        "friendlyName": "Roku Premiere",
        "defaultRemoteStyle" : "RSR",
        "hdmiInputs": 0,
      },

    },

    "TV": {

      "roku-generic-hisense": {
        "supported": true,
        "friendlyName": "Hisense",
        "defaultRemoteStyle" : "RHR",
        "hdmiInputs": 4,
        "avInputs": 1,
        "tuner": true,
      },
      "roku-generic-tcl": {
        "supported": true,
        "friendlyName": "TCL",
        "defaultRemoteStyle" : "RTR",
        "hdmiInputs": 4,
        "avInputs": 1,
        "tuner": true,
      },
      "roku-generic-westinghouse": {
        "supported": true,
        "friendlyName": "Westinghouse",
        "defaultRemoteStyle" : "RWR",
        "hdmiInputs": 4,
        "avInputs": 1,
        "tuner": true,
      },
    },
  },


  "xiaomi": {

    "meta": {
      "friendlyName": "Xiaomi",
      "supported": true,
    },

    "Mi Box": {

      "mi-box-s": {
        "supported": true,
        "friendlyName": "Mi Box S",
        "defaultEventListenerBinPath": "/dev/input/event2",
        "defaultRemoteStyle": "XM2",
        "hdmiInputs": 0,
      },

    },

    "TV Stick": {

      "xiaomi-tv-stick-4k": {
        "supported": true,
        "friendlyName": "TV Stick 4K",
        "defaultRemoteStyle": "XM1",
        "hdmiInputs": 0,
      },
      "mi-tv-stick": {
        "supported": false,
        "friendlyName": "Mi TV Stick",
        "defaultEventListenerBinPath": "/dev/input/event2",
        "defaultRemoteStyle": "XM2",
        "hdmiInputs": 0,
      },

    },

  },


  "none": {

    "meta": {
      "friendlyName": "None / Other",
      "supported": true,
    },

    "noCategory": {

      "other": {
        "supported": true,
        "friendlyName": "None / Other",
        "defaultRemoteStyle" : "AF5",
        "hdmiInputs": 0,
      },
    },

  },

}

export { devices }; 
