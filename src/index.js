
import 'dotenv/config';
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
  console.log('[index] fetching', url);
  const res = await axios.get(url);
  console.log('[index] fetched weather');
  return res.data;
}

const settings = {
  app_language: 'en',
  units_temperature: 'fahrenheit',
  units_wind_speed: 'mph'
};

(async () => {
  console.log('[index] start');
  const raw = await fetchWeather(argv.lat, argv.lon);
  const parsed = util.parseWeather('location', raw, settings);
  console.log(JSON.stringify(parsed, null, 2));
})();
