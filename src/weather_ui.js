
import 'dotenv/config';
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import util from './util.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const argv = yargs(hideBin(process.argv)).options({
  lat: { type: 'number', demandOption: true },
  lon: { type: 'number', demandOption: true }
}).argv;

const API_KEY = process.env.OPENWEATHER_API_KEY;
if (!API_KEY) {
  console.error('Set OPENWEATHER_API_KEY');
  process.exit(1);
}

const uiDir = path.join(__dirname, '../ui');
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
    console.log('[weather_ui] sending weather to renderer');
    win.webContents.send('weather-data', weather);
  });
}

app.whenReady()
  .then(async () => {
    console.log('[weather_ui] app ready');
    const raw = await fetchWeather(argv.lat, argv.lon);
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
