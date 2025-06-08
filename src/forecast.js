
import axios from 'axios';
import util from './util.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).options({
  lat: { type: 'number', demandOption: true },
  lon: { type: 'number', demandOption: true },
  days: { type: 'number', default: 16, describe: 'Number of days to request (1-16)' }
}).argv;

const API_KEY = process.env.OPENWEATHER_API_KEY;
if (!API_KEY) {
  console.error('Set OPENWEATHER_API_KEY');
  process.exit(1);
}

async function fetchForecast(lat, lon, days) {
  const url = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=${days}&appid=${API_KEY}`;
  console.log('[forecast] fetching', url);
  const res = await axios.get(url);
  console.log('[forecast] fetched forecast');
  return res.data;
}

const settings = {
  app_language: 'en',
  units_temperature: 'fahrenheit',
  units_wind_speed: 'mph'
};

const todayLabel = new Date().toLocaleDateString('en', { weekday: 'short' });

(async () => {
  console.log('[forecast] start');
  const raw = await fetchForecast(argv.lat, argv.lon, argv.days);
  const forecast = util.parseWeatherForecast('location', raw, settings, todayLabel);
  console.log(JSON.stringify(forecast, null, 2));
})();
