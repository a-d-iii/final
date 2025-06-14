<template>
  <div class="scene" v-if="data" :class="makeClasses()">
    <slot name="weather-data"></slot>

    <div class="overlay" v-if="overlay"></div>

    <!-- WEATHER -->
    <lightning v-if="data.scene_lightning" />
    <thunderstorm v-if="data.scene_thunderstorm" />
    <rain v-if="data.scene_rain > 0" :rain="data.scene_rain" />
    <snow v-if="data.scene_snow" />
    <clouds
      v-if="data.scene_clouds"
      :percent="data.scene_cloud_percent"
      :speed="data.scene_wind_speed"
      :direction="data.scene_wind_direction"
    />
    <fog v-if="data.scene_fog" />

    <!-- SCENERY -->
    <moon
      v-if="data.scene_moon"
      :angle="data.moon_angle"
      :fraction="data.moon_fraction"
      :phase="data.moon_phase"
      :position="data.moon_position"
    />
    <sun v-if="data.scene_sun" :position="data.sun_position" />
    <random
      :time="data.scene_time"
      :clouds="data.scene_cloud_percent"
      :thunderstorm="data.scene_thunderstorm"
    />

    <mountains />
    <trees />
    <stars v-if="data.scene_stars" />
    <sky />
  </div>
</template>

<style lang="scss">
@use '@/scss/mixins' as *;
@use '@/scss/animations' as *;
@use '@/scss/scene' as *;
@use '@/scss/time' as *;
@use '@/scss/weather' as *;

.scene {
  height: 100%;
  position: relative;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.35);
    z-index: 30;
  }
}
</style>

<script>
import clouds from './weather/clouds.vue'
import fog from './weather/fog.vue'
import lightning from './weather/lightning.vue'
import rain from './weather/rain.vue'
import snow from './weather/snow.vue'
import thunderstorm from './weather/thunderstorm.vue'

import moon from './scenery/moon.vue'
import mountains from './scenery/mountains.vue'
import sky from './scenery/sky.vue'
import stars from './scenery/stars.vue'
import sun from './scenery/sun.vue'
import trees from './scenery/trees.vue'
import random from './scenery/random.vue'

export default {
  name: 'scene',
  props: {
    version: { type: Number, default: 1 },
    overlay: { type: Boolean, default: false },
    data: {
      type: Object,
      default() {
        return {
          city: null,
          condition_icon: 'wi-na',
          condition_label: 'Unknown',
          id: null,
          key: null,
          moon_angle: null,
          moon_fraction: null,
          moon_phase: null,
          moon_position: null,
          scene_cloud_percent: null,
          scene_clouds: false,
          scene_fog: false,
          scene_lightning: false,
          scene_moon: false,
          scene_rain: false,
          scene_snow: false,
          scene_stars: false,
          scene_sun: false,
          scene_thunderstorm: false,
          scene_time: 'midnight',
          scene_wind_direction: null,
          scene_wind_speed: null,
          sun_next: null,
          sun_position: null,
          sunrise: null,
          sunset: null,
          temp_actual: null,
          temp_feels_like: null,
          temp_max: null,
          temp_min: null,
          time_zone: null,
          wind_direction: null,
          wind_speed: null
        }
      }
    }
  },
  methods: {
    makeClasses() {
      const classes = [
        `time-${this.data.scene_time}`,
        `scene-${this.version}`
      ]
      if (this.data.scene_thunderstorm) {
        classes.push('thunderstorm')
      }
      return classes.join(' ')
    }
  },
  components: {
    clouds,
    fog,
    lightning,
    moon,
    mountains,
    rain,
    random,
    sky,
    snow,
    stars,
    sun,
    thunderstorm,
    trees
  }
}
</script>
