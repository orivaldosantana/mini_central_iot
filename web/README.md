# Mini Central IoT

## Instalação

O pacote MQTT instalado foi a opção pré-compilada, no dia 22/08/2023, o pacote mqtt estava dando incompatibilidade com arquivos do React craidos automaticamente.

```bash
$ yarn add precompiled-mqtt
```

## Execução

Na primeira vez basta executar `yarn` para instalar os pacotes e gerar os arquivos na pasta `node_modules` automaticamente.

Para executar o projeto em modo desenvolvimento:

```bash
$ yarn start
```

## Referências

- [A Quickstart Guide to Using MQTT over WebSocket](https://www.emqx.com/en/blog/connect-to-mqtt-broker-with-websocket#connection-options)
- [Client MQTT of EMQX](http://www.emqx.io/online-mqtt-clien)
- [How to use MQTT in the React project](https://www.emqx.com/en/blog/how-to-use-mqtt-in-react)
- [Pacote MQTT précompilado](https://www.npmjs.com/package/precompiled-mqtt)
- [Projeto de App React para ler um sensor](https://github.com/orivaldosantana/react_sensor_umidade_solo/blob/main/src/components/mqttsub.jsx)
