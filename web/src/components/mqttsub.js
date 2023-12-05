import React from 'react'

import mqtt from 'mqtt'

import { useState } from 'react'
import { useEffect } from 'react'

const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)

const host = 'wss://broker.emqx.io:8084/mqtt'
const mqttOptions = {
  keepalive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 5,
  clean: true,
  reconnectPeriod: 3000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  }
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
  const [connectStatus, setConnectStatus] = useState('Disconnected')

  const [client, setClient] = useState(null)
  const mqttConnect = () => {
    setConnectStatus('Connecting')
    console.log('host: ' + host)
    setClient(mqtt.connect(host, mqttOptions))
  }

  useEffect(() => {
    if (client) {
      console.log('Connecting mqtt client!')
      //console.log(client)
      client.on('connect', () => {
        setConnectStatus('Connected')
        client.subscribe(soilHumidityTopic, { qos: 0 }, error => {
          if (error) {
            console.log('Subscribe to topic error', error)
            return
          }
        })
        client.subscribe(temperatureTopic)
        client.subscribe(lightSensorTopic)
        client.subscribe(environmentHumidityTopic)
      })
      client.on('error', err => {
        console.error('Connection error: ', err)
        client.end()
      })
      client.on('reconnect', () => {
        console.log('Reconnecting... \nClient ' + clientId)
      })
      client.on('message', (topic, message) => {
        if (topic === soilHumidityTopic) {
          setMsgSoil(message.toString())
          console.log('New message from ' + topic + ': ' + message.toString())
        }
        if (topic === temperatureTopic) {
          setMsgTemperature(message.toString())
          console.log('New message from ' + topic + ': ' + message.toString())
        }
        if (topic === lightSensorTopic) {
          setMsgLight(message.toString())
          console.log('New message from ' + topic + ': ' + message.toString())
        }
        if (topic === environmentHumidityTopic) {
          setMsgEnvHumidity(message.toString())
          console.log('New message from ' + topic + ': ' + message.toString())
        }
      })
    }
  }, [client])

  console.log(connectStatus)
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
      <div>
        <button onClick={mqttConnect}> Conectar </button>
      </div>
    </div>
  )
}
