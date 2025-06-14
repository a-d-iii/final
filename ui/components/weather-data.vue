<template>
  <div class="weather-data">
    <div class="main-weather">
      <div class="left">
        <div class="current-temp">
          {{ data.temp_actual }}<span class="degree">°</span>
        </div>
        <div class="feels-like-temp">
          Feels Like {{ data.temp_feels_like }}<span class="degree">°</span>
        </div>
      </div>

      <div class="right">
        <div class="current-measure">
          <i class="wi wi-humidity"></i> {{ data.humidity }}
        </div>

        <div class="current-measure">
          <i class="wi wi-time-4"></i> {{ data.current_time }}
        </div>

        <div class="current-measure">
          <i class="wi wi-strong-wind"></i> {{ data.wind_speed }}
          <span class="direction">{{ data.wind_direction }}</span>
        </div>
      </div>
    </div>

    <div class="current-conditions">
      <div class="left">
        <i class="wi" :class="data.condition_icon"></i>
      </div>
      <div class="right">
        <h3>{{ data.city }}</h3>
        <h1>{{ data.condition_label }}</h1>
      </div>
    </div>

    <Swiper
      class="weather-overview"
      ref="forecastSwiper"
      v-bind="swiperOption"


      :modules="swiperModules"

    >
      <swiper-slide
        class="forecast"
        v-for="(day, index) in forecast"
        :key="index"
      >
        <div class="forecast-day">
          <div class="date">
            {{ day.day_label }} <span>{{ day.day_number }}</span>
          </div>
          <div class="icon">
            <i class="wi" :class="day.condition_icon"></i>
          </div>
          <div class="high-low">
            {{ day.temp_max }}°<span>|</span>{{ day.temp_min }}°
          </div>
        </div>
      </swiper-slide>

      <template #pagination>
        <div
          class="swiper-pagination"
          role="navigation"
          aria-label="Forecast Navigation"
        ></div>
      </template>
    </Swiper>
  </div>
</template>

<style lang="scss">
@use '@/scss/weather-data' as *;
</style>

<script>

import 'swiper/css'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'



export default {
  name: 'weather-data',
  props: {
    data: {
      type: Object,
      default() {
        return {
          city: null,
          condition_icon: 'wi-na',
          condition_label: 'Unknown',
          humidity: null,
          current_time: null,
          sun_next: null,
          sunrise: null,
          sunset: null,
          wind_speed: null,
          wind_direction: null,
          temp_actual: null,
          temp_feels_like: null
        }
      }
    },
    forecast: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 0,
        loop: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      },
      swiperModules: [Pagination]
    }
  },
  computed: {
    swiper() {
      return this.$refs.forecastSwiper.swiper
    }
  },
  mounted() {
    window.addEventListener('keyup', this.keyPress)
  },
  beforeUnmount() {
    window.removeEventListener('keyup', this.keyPress)
  },
  methods: {
    keyPress(event) {
      if (event.which === 37) {
        this.swipeLeft()
      } else if (event.which === 39) {
        this.swipeRight()

      }
    },
    swipeLeft() {
      this.swiper.slidePrev(300, false)
    },
    swipeRight() {
      this.swiper.slideNext(300, false)
    }
  },
  components: {
    Swiper,
    SwiperSlide
  }
}
</script>
