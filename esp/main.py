# Complete project details at https://RandomNerdTutorials.com
import machine
import time

mqtt_server = conf["mqtt_server"]
server_port = conf["server_port"] 
mqtt_user = conf["mqtt_user"]
mqtt_password = conf["mqtt_password"]



last_message = 0
message_interval = 60 # segundos
counter = 0


## LED
# Code for Pin 2 
pin_led =  Pin(2, Pin.OUT)

## DHT11 Sensor
sensor_dht11 = dht.DHT11(Pin(14)) 

## LDR Sensor 
ldr = ADC(Pin(33))
ldr.atten(ADC.ATTN_11DB)   


topic_sub_led = b'ORIVA/casa/controleLED'
topic_pub_temp = b'ORIVA/casa/temperatura'
topic_pub_humi = b'ORIVA/casa/umidade' 
topic_pub_ldr = b'ORIVA/casa/luminosidade'
topic_pub_log = b'ORIVA/casa/log' 

def sub_cb(topic, msg):
  global topic_sub_led
  print((topic, msg))
  print(topic_sub_led)
  if topic == topic_sub_led:
    if msg == b'on':
      pin_led.on()
      print('led on')
    elif msg == b'off':
      pin_led.off()
      print('led off') 

   

def connect_and_subscribe():
  global client_id, mqtt_server, topic_sub_led, server_port, mqtt_user, mqtt_password
  client = MQTTClient(client_id, mqtt_server, server_port, mqtt_user, mqtt_password)
  client.set_callback(sub_cb)
  client.connect()
  client.subscribe(topic_sub_led)
  print('Connected to %s MQTT broker, subscribed to %s topic' % (mqtt_server, topic_sub_led))
  return client

def restart_and_reconnect():
  print('Failed to connect to MQTT broker. Reconnecting...')
  time.sleep(10)
  machine.reset()

try:
  client = connect_and_subscribe()
except OSError as e:
  restart_and_reconnect()

while True:
  try:
    client.check_msg()
    if (time.time() - last_message) > message_interval:
      last_message = time.time()
      # Blink LED for indicating the sensors readings
      pin_led.off()
      time.sleep(0.5)
      pin_led.on()
      time.sleep(0.5)
      pin_led.off()
      time.sleep(0.5)
      pin_led.on()
      time.sleep(0.5)
      pin_led.off()
      msg = b'Time #%d' % counter
      client.publish(topic_pub_log, msg)   
      # LDR Sensor 
      ldr_value = ldr.read()
      msg_ldr = b'%d' % ldr_value
      client.publish(topic_pub_ldr, msg_ldr)
      # Temperature and Humidity Sensor readings
      tempError = False
      try: 
        sensor_dht11.measure()        
      except OSError as e:
        print(e)
        print("DHT11 measurement error!")
        tempError = True        
      if not tempError:  
        temp = sensor_dht11.temperature()
        msg_temp = b'%3.1f'%temp 
        client.publish(topic_pub_temp, msg_temp)
        humi = sensor_dht11.humidity()
        msg_humi = b'%d'%humi
        client.publish(topic_pub_humi, msg_humi)
      #Time counter         
      counter += 1
      if counter > 10: # reinicia depois um tempo 
        counter = 0
        print("Restart counter!")
        time.sleep(10)
        print("Starting deep sleep!") 
        machine.deepsleep(1000*60*50) # 50 min
        machine.reset()          

  except OSError as e:
    restart_and_reconnect()



 


