<template>
  <div class="random-wrapper">
    <div class="bird" v-if="showBird()"></div>
    <div class="bat" v-if="showBat()"></div>
    <div
      class="hot-air-balloon"
      v-if="showHotAirBalloon()"
      :class="{ night: isNight() }"
    ></div>
    <div class="girl-balloon" v-if="showGirlBalloon()"></div>
    <div class="tardis" v-if="showTardis()"></div>
  </div>
</template>

<style lang="scss">
@use '@/scss/random' as *;
</style>

<script>
export default {
  name: 'random',
  props: {
    time: { type: String },
    clouds: { type: Number },
    thunderstorm: { type: Boolean }
  },
  data() {
    return {
      runs: 0,
      timer: null,
      random: 4
    }
  },
  mounted() {
    this.randomBackground()
  },
  beforeUnmount() {
    clearTimeout(this.timer)
  },
  methods: {
    clearSkies() {
      return this.clouds < 50 && !this.thunderstorm
    },
    isDay() {
      return ['morning','mid-morning','noon','afternoon','evening','dusk'].includes(this.time)
    },
    isNight() {
      return ['dawn','early-morning','night','midnight'].includes(this.time)
    },
    showBird() {
      return this.random % 10 === 0 && this.isDay()
    },
    showBat() {
      return this.random % 10 === 0 && this.isNight()
    },
    showHotAirBalloon() {
      return this.random === 3

    },
    showGirlBalloon() {
      return this.random === 4 && this.isNight()
    },
    showTardis() {
      return this.random === 5 && this.runs > 10
    },
    randomBackground() {
      // 1-in-10 chance of firing any given call
      this.random = Math.floor(Math.random() * 50) + 1
      this.runs++

      clearTimeout(this.timer)
      // schedule next random check in 5–10 minutes
      this.timer = setTimeout(
        this.randomBackground,
        Math.floor(Math.random() * 300_000) + 300_000
      )
    }
  }
}
</script>
