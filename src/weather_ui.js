
import 'dotenv/config';
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import util from './util.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const argvRaw = yargs(hideBin(process.argv)).options({
  lat: { type: 'number' },
  lon: { type: 'number' }
}).argv;

let lat = argvRaw.lat ?? parseFloat(argvRaw._[0]);
let lon = argvRaw.lon ?? parseFloat(argvRaw._[1]);

if (isNaN(lat) || isNaN(lon)) {
  console.error('Latitude and longitude are required. Pass with --lat and --lon or as positional arguments.');
  process.exit(1);
}

const API_KEY = process.env.OPENWEATHER_API_KEY;
if (!API_KEY) {
  console.error('Set OPENWEATHER_API_KEY');
  process.exit(1);
}

const uiDir = path.join(__dirname, '../ui');


function ensureAssets() {
  const required = [
    path.join(uiDir, 'dist', 'main.js'),
    path.join(uiDir, 'dist', 'assets', 'main.css'),
    path.join(uiDir, 'css', 'app.css'),
    path.join(uiDir, 'css', 'weather-icons.css'),
    path.join(uiDir, 'css', 'fontawesome-all.css'),
    path.join(uiDir, 'font', 'weathericons-regular-webfont.woff'),
    path.join(uiDir, 'webfonts', 'fa-solid-900.woff2')
  ];
  const missing = required.filter(p => !fs.existsSync(p));
  if (missing.length) {
    console.error('[weather_ui] Missing UI assets:');
    for (const m of missing) {
      console.error(' -', path.relative(uiDir, m));
    }
    console.error('Run "npm run build-ui" to generate them.');
    process.exit(1);
  }
}

ensureAssets();

const assetsFile = path.join(uiDir, 'dist', 'main.js');
if (!fs.existsSync(assetsFile)) {
  console.error('[weather_ui] UI assets missing. Run "npm run build-ui" first.');
  process.exit(1);
}


async function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  console.log('[weather_ui] fetching', url);
  try {
    const res = await axios.get(url);
    console.log('[weather_ui] fetched weather');
    return res.data;
  } catch (err) {
    console.error('[weather_ui] failed to fetch weather:', err.message);
    throw err;
  }
}

const settings = {
  app_language: 'en',
  units_temperature: 'fahrenheit',
  units_wind_speed: 'mph'
};

let win;

function createWindow(weather) {
  console.log('[weather_ui] creating window');
  win = new BrowserWindow({
    width: 400,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile(path.join(__dirname, '../ui/weather.html'));
  win.webContents.on('did-finish-load', () => {
    console.log('[weather_ui] window loaded');
  });

  const timeout = setTimeout(() => {
    console.error('[weather_ui] renderer did not signal ready');
  }, 5000);

  ipcMain.once('renderer-ready', event => {
    clearTimeout(timeout);
    console.log('[weather_ui] renderer ready, sending weather');
    event.reply('weather-data', weather);
  });
}

app.whenReady()
  .then(async () => {
    console.log('[weather_ui] app ready');
    const raw = await fetchWeather(lat, lon);
    const parsed = util.parseWeather('location', raw, settings);
    console.log('[weather_ui] weather parsed, creating window');
    createWindow(parsed);
  })
  .catch(err => {
    console.error(err);
    app.quit();
  });

app.on('window-all-closed', () => {
  console.log('[weather_ui] window-all-closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
