
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
  assets: { type: 'string', describe: 'Path to weather-bar static assets' },
  interval: { type: 'number', default: 60000, describe: 'Update interval in ms' }
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
  const res = await axios.get(url);
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

function buildIconPath(menubar) {
  let platformFolder = 'mac';
  let fileName = `${menubar.image}Template.png`;
  if (process.platform === 'win32') {
    platformFolder = 'win';
    fileName = `${menubar.image}.ico`;
  } else if (process.platform === 'linux') {
    platformFolder = 'linux';
    fileName = `${menubar.image}.png`;
  }
  return path.join(
    assetsDir,
    platformFolder,
    'weather-icons',
    menubar.folder,
    fileName
  );
}

async function updateTray() {
  try {
    const raw = await fetchWeather(argv.lat, argv.lon);
    const menubar = util.prepMenubarWeather(raw, settings);
    const iconPath = buildIconPath(menubar);
    if (!fs.existsSync(iconPath)) {
      throw new Error(`Icon not found at ${iconPath}`);
    }
    if (!tray) {
      tray = new Tray(iconPath);
    } else {
      tray.setImage(iconPath);
    }
    tray.setToolTip(menubar.tooltip);
  } catch (err) {
    console.error(err);
  }
}

app.whenReady()
  .then(() => {
    updateTray();
    setInterval(updateTray, argv.interval);
  })
  .catch(err => {
    console.error(err);
    app.quit();
  });
