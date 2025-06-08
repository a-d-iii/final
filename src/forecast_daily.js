
import axios from 'axios';
import util from './util.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).options({
  lat: { type: 'number', demandOption: true },
  lon: { type: 'number', demandOption: true },
  units: {
    type: 'string',
    choices: ['standard', 'metric', 'imperial'],
    default: 'imperial',
    describe: 'units: standard (K), metric (°C), imperial (°F)'
  }
}).argv;

const API_KEY = process.env.OPENWEATHER_API_KEY;
if (!API_KEY) {
  console.error('Set OPENWEATHER_API_KEY');
  process.exit(1);
}

async function fetch3hForecast(lat, lon, units) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  console.log('[forecast_daily] fetching', url);
  const res = await axios.get(url);
  console.log('[forecast_daily] fetched forecast');
  return res.data;
}

function summarizeDaily(raw, units) {
  const days = {};
  for (const item of raw.list) {
    const day = item.dt_txt.slice(0, 10);
    if (!days[day]) {
      days[day] = {
        temps: [],
        icon: item.weather[0],
        noon: item.dt_txt.includes('12:00:00') ? item.weather[0] : null
      };
    }
    days[day].temps.push(item.main.temp);
    if (item.dt_txt.includes('12:00:00')) {
      days[day].noon = item.weather[0];
    }
  }

  const result = [];
  Object.keys(days).forEach(date => {
    const info = days[date];
    const tempMax = Math.max(...info.temps);
    const tempMin = Math.min(...info.temps);
    const weatherInfo = info.noon || info.icon;
    const time = weatherInfo.icon.endsWith('d') ? 'day' : 'night';
    const code = weatherInfo.id;

    result.push({
      day_label: new Date(date).toLocaleDateString('en', { weekday: 'short' }),
      day_number: String(new Date(date).getDate()),
      condition_icon: util.getWeatherIcon(code, time),
      temp_max: units === 'imperial' ? Math.round(tempMax) : Math.round(tempMax),
      temp_min: units === 'imperial' ? Math.round(tempMin) : Math.round(tempMin)
    });
  });

  return { hash_key: 'location', forecast: result };
}

(async () => {
  console.log('[forecast_daily] start');
  const raw = await fetch3hForecast(argv.lat, argv.lon, argv.units);
  const summary = summarizeDaily(raw, argv.units);
  console.log(JSON.stringify(summary, null, 2));
})();

