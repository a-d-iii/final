
const { ipcRenderer } = require('electron');

ipcRenderer.send('renderer-ready');

function show(id, condition) {
  const el = document.querySelector(id);
  if (el) {
    el.style.display = condition ? 'block' : 'none';
  }
}

ipcRenderer.on('weather-data', (event, data) => {
  document.getElementById('icon').className = 'wi ' + data.condition_icon;
  document.getElementById('temp').textContent = `${data.temp_actual}°`;
  document.getElementById('desc').textContent = data.condition_label;

  show('.sun', data.scene_sun);
  show('.moon', data.scene_moon);
  show('.clouds', data.scene_clouds);
  show('.rain', data.scene_rain > 0);
  show('.snow', data.scene_snow);
  show('.fog', data.scene_fog);
  show('.lightning', data.scene_thunderstorm);
  show('.stars', data.scene_stars);
});
