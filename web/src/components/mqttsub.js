import React from 'react'

import mqtt from 'precompiled-mqtt'

import { useState } from 'react'
import { useEffect } from 'react'

const clientId = `mqttjs_${parseInt(Math.random() * 1000000)}`

const host = 'wss://mqtt.ect.ufrn.br:8083'
const mqttOptions = {
  keepalive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 5000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  },
  username: 'mqtt',
  password: 'lar_mqtt'
}

const soilHumidityTopic = 'ORIVA/jardim/umidadesolo'
const environmentHumidityTopic = 'ORIVA/casa/umidade'
const temperatureTopic = 'ORIVA/casa/temperatura'
const lightSensorTopic = 'ORIVA/casa/luminosidade'

export default function MQTTSub() {
  const [msgSoil, setMsgSoil] = useState('?')
  const [msgTemperature, setMsgTemperature] = useState('?')
  const [msgLight, setMsgLight] = useState('?')
  const [msgEnvHumidity, setMsgEnvHumidity] = useState('?')

  useEffect(() => {
    console.log('Connecting mqtt client!')
    const client = mqtt.connect(host, mqttOptions)
    client.on('connect', () => {
      console.log('Connected!')
      client.subscribe(soilHumidityTopic)
      client.subscribe(temperatureTopic)
      client.subscribe(lightSensorTopic)
      client.subscribe(environmentHumidityTopic)
    })

    client.on('message', (topic, payload, packet) => {
      if (topic === soilHumidityTopic) {
        setMsgSoil(payload.toString())
        console.log('New message from ' + topic + ': ' + payload.toString())
      }
      if (topic === temperatureTopic) {
        setMsgTemperature(payload.toString())
        console.log('New message from ' + topic + ': ' + payload.toString())
      }
      if (topic === lightSensorTopic) {
        setMsgLight(payload.toString())
        console.log('New message from ' + topic + ': ' + payload.toString())
      }
      if (topic === environmentHumidityTopic) {
        setMsgEnvHumidity(payload.toString())
        console.log('New message from ' + topic + ': ' + payload.toString())
      }
    })
  }, [msgSoil, msgTemperature, msgLight])

  return (
    <div>
      <div>
        <p> Umidade do solo: {msgSoil && msgSoil} (max: 4095) </p>
        <p>
          Umidade do ambiente: {msgEnvHumidity && msgEnvHumidity} % (max: 100%){' '}
        </p>
        <p> Tempeartura: {msgTemperature && msgTemperature} C </p>
        <p> Iluminação: {msgLight && msgLight} (max: 4095) </p>
      </div>
    </div>
  )
}
