import React from 'react'

import mqtt from 'precompiled-mqtt'

import { useState } from 'react'
import { useEffect } from 'react'

const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)

const host = 'wss://broker.emqx.io:8084/mqtt'
const mqttOptions = {
  keepalive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  }
}

export default function MQTTSub() {
  const [mqttmsgs, setMqttmsgs] = useState('?')

  useEffect(() => {
    console.log('Connecting mqtt client!')
    const client = mqtt.connect(host, mqttOptions)
    client.on('connect', () => {
      client.subscribe('CASA/umidadesolo')
    })

    client.on('message', (topic, payload, packet) => {
      setMqttmsgs(payload.toString())
      console.log('New message from ' + topic + ': ' + payload.toString())
    })
  }, [mqttmsgs])

  return (
    <div>
      <div>Umidade do solo: {mqttmsgs && mqttmsgs} (max: 4095) </div>
    </div>
  )
}
