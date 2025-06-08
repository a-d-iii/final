<template>
  <div class="weather-app">
    <scene v-if="weather" :data="weather">
      <template #weather-data>
        <weather-data :data="weather" :forecast="weather.forecast || []" />
      </template>
    </scene>
  </div>
</template>

<script>
import Scene from './components/scene.vue'
import WeatherData from './components/weather-data.vue'

export default {
  name: 'WeatherApp',
  props: {
    weather: {
      type: Object,
      default: null
    }
  },
  components: {
    Scene,
    WeatherData
  }
}
</script>

<style scoped>
.weather-app {
  height: 100%;
}
</style>
