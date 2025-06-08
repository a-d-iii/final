
import 'dotenv/config';
import { app, Tray } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import axios from 'axios';
import util from './util.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const argv = yargs(hideBin(process.argv)).options({
  lat: { type: 'number', demandOption: true },
  lon: { type: 'number', demandOption: true },
  assets: { type: 'string', describe: 'Path to weather-bar static assets' }
}).argv;

const API_KEY = process.env.OPENWEATHER_API_KEY;
if (!API_KEY) {
  console.error('Set OPENWEATHER_API_KEY');
  process.exit(1);
}

const assetEnv = process.env.WEATHER_BAR_ASSETS;
const assetsDir = argv.assets || assetEnv ||
  path.resolve(__dirname, '..', '..', 'weather-bar-app-1.0.0', 'static');

if (!fs.existsSync(assetsDir)) {
  console.error(
    `Assets directory not found: ${assetsDir}\n` +
    'Set WEATHER_BAR_ASSETS or use the --assets option to point to the Weather Bar static folder.'
  );
  process.exit(1);
}

async function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  console.log('[tray] fetching', url);
  const res = await axios.get(url);
  console.log('[tray] fetched weather');
  return res.data;
}

const settings = {
  layout_current_temp: 'actual',
  app_launch_icon: 'both',
  app_language: 'en',
  units_temperature: 'fahrenheit',
  units_wind_speed: 'mph'
};

let tray = null;

app.whenReady()
  .then(async () => {
    console.log('[tray] app ready');
    const raw = await fetchWeather(argv.lat, argv.lon);
    const menubar = util.prepMenubarWeather(raw, settings);

    // Select the correct icon folder and extension for the host platform
    let platformFolder = 'mac';
    let fileName = `${menubar.image}Template.png`;
    if (process.platform === 'win32') {
      platformFolder = 'win';
      fileName = `${menubar.image}.ico`;
    } else if (process.platform === 'linux') {
      platformFolder = 'linux';
      fileName = `${menubar.image}.png`;
    }

    const iconPath = path.join(
      assetsDir,
      platformFolder,
      'weather-icons',
      menubar.folder,
      fileName
    );

    if (!fs.existsSync(iconPath)) {
      throw new Error(`Icon not found at ${iconPath}\nSet WEATHER_BAR_ASSETS or --assets to point to Weather Bar static files.`);
    }

    tray = new Tray(iconPath);
    tray.setToolTip(menubar.tooltip);
  })
  .catch((err) => {
    console.error(err);
    app.quit();
  });

