# Complete project details at https://RandomNerdTutorials.com

import time
from umqttsimple import MQTTClient
import ubinascii
from machine import Pin, unique_id, ADC  
import micropython
import network
import esp
import dht 
esp.osdebug(None)
import gc
gc.collect()

import json 
conf_file = open('conf.json') 
conf = json.load(conf_file) 
conf_file.close() 



ssid = conf["ssid"]
password = conf["password"]


client_id = ubinascii.hexlify(unique_id())


station = network.WLAN(network.STA_IF)

station.active(True)

 
if not station.isconnected():
    print('Connecting to WiFi')
    station.connect(ssid, password)
    while not station.isconnected():
      pass

    print('Connection successful')
    print(station.ifconfig())


