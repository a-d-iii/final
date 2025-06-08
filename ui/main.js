import Vue from 'vue'
import WeatherApp from './WeatherApp.vue'

const ipc = window.require ? window.require('electron').ipcRenderer : null

new Vue({
  data() {
    return { weather: null }
  },
  render(h) {
    return h(WeatherApp, { props: { weather: this.weather } })
  },
  mounted() {
    if (ipc) {
      ipc.on('weather-data', (event, data) => {
        this.weather = data
      })
    }
  }
}).$mount('#app')
