import { createApp, h } from 'vue'
import WeatherApp from './WeatherApp.vue'

const ipc = window.require ? window.require('electron').ipcRenderer : null

createApp({
  data() {
    return { weather: null }
  },
  render() {
    return h(WeatherApp, { weather: this.weather })
  },
  mounted() {
    if (ipc) {
      ipc.send('renderer-ready')
      ipc.on('weather-data', (event, data) => {
        this.weather = data
      })
      setTimeout(() => {
        if (!this.weather) {
          console.error('weather data not received')
        }
      }, 5000)
    }
  }
}).mount('#app')
