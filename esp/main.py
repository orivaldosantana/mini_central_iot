# Complete project details at https://RandomNerdTutorials.com


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
  client = MQTTClient(client_id, mqtt_server, server_port)
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
      msg = b'Time #%d' % counter
      client.publish(topic_pub_log, msg)   
      # LDR Sensor 
      ldr_value = ldr.read()
      msg_ldr = b'%d' % ldr_value
      client.publish(topic_pub_ldr, msg_ldr)  
      # Temperature and Humidity Sensor readings 
      sensor_dht11.measure() 
      temp = sensor_dht11.temperature()
      msg_temp = b'%3.1f'%temp 
      client.publish(topic_pub_temp, msg_temp)  
      humi = sensor_dht11.humidity()
      msg_humi = b'%d'%humi  
      client.publish(topic_pub_humi, msg_humi)   
      #Time counter 
      last_message = time.time()
      counter += 1
  except OSError as e:
    restart_and_reconnect()





