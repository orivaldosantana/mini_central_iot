# Complete project details at https://RandomNerdTutorials.com

import network
import esp
esp.osdebug(None)
import gc
gc.collect()

import json 
conf_file = open('conf.json') 
conf = json.load(conf_file) 
conf_file.close() 


ssid = conf["ssid"]
password = conf["password"]

station = network.WLAN(network.STA_IF)

station.active(True)

 
if not station.isconnected():
    print('Connecting to WiFi')
    station.connect(ssid, ssid_password)
    while not station.isconnected():
      pass

    print('Connection successful')
    print(station.ifconfig())

