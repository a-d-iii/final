
const { ipcRenderer } = require('electron');

ipcRenderer.on('weather-data', (event, data) => {
  const pre = document.getElementById('weather');
  pre.textContent = JSON.stringify(data, null, 2);
});
