import './App.css'
import Header from './components/header'
import MQTTSub from './components/mqttsub'

function App() {
  return (
    <main>
      <Header title="Mini Central IoT" />
      <MQTTSub />
    </main>
  )
}

export default App
