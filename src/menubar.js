
import axios from 'axios';
import util from './util.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).options({
  lat: { type: 'number', demandOption: true },
  lon: { type: 'number', demandOption: true }
}).argv;

const API_KEY = process.env.OPENWEATHER_API_KEY;
if (!API_KEY) {
  console.error('Set OPENWEATHER_API_KEY');
  process.exit(1);
}

async function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const res = await axios.get(url);
  return res.data;
}

const settings = {
  app_language: 'en',
  layout_current_temp: 'actual',
  app_launch_icon: 'both',
  units_temperature: 'fahrenheit',
  units_wind_speed: 'mph'
};

(async () => {
  const raw = await fetchWeather(argv.lat, argv.lon);
  const menubar = util.prepMenubarWeather(raw, settings);
  console.log(JSON.stringify(menubar, null, 2));
})();
