# Standalone Weather Parser

This example demonstrates how to fetch weather data from OpenWeatherMap and parse it into the JSON format used by the Weather Bar UI.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set an OpenWeatherMap API key as an environment variable:
   ```bash
   export OPENWEATHER_API_KEY=your_key_here
   ```
   On Windows (Command Prompt):
   ```cmd
   set OPENWEATHER_API_KEY=your_key_here
   ```
3. Build the UI assets:
   ```bash
   npm run build-ui
   ```
   This populates the `ui/dist` folder required by the Electron weather preview.
4. Launch the graphical preview with your coordinates:
  ```bash
  npm run weather-ui -- --lat 40.7128 --lon -74.0060
  ```
   You can also pass the latitude and longitude positionally. **Make sure there is a space after `--`** or npm will treat the numbers as option names:
  ```bash
  npm run weather-ui -- 40.7128 -74.0060
  ```
  (Incorrect: `npm run weather-ui --40.7128 --74.0060`)
  This fetches live data and opens an Electron window showing the animated scene.
  To force all animations on for testing, add the `--demo` flag:
  ```bash
 npm run weather-ui -- --lat 40.7128 --lon -74.0060 --demo
  ```
5. Run the parser with latitude and longitude:
   ```bash
   node src/index.js --lat 40.7128 --lon -74.0060
   ```
   On Windows you can use backslashes:
   ```cmd
   node src\index.js --lat 40.7128 --lon -74.0060
   ```
6. To preview the animated scene in a regular browser, first build the UI
   assets and then serve the `ui` folder over HTTP. The page uses ES modules,
   so loading it directly with `file://` will fail and the page will appear blank.
   One quick option is:
   ```bash
   npx -y http-server ui -p 8081
   ```
   After running that command, open <http://localhost:8081/demo.html>. The
   demo page loads sample data so all effects are visible without Electron.

The script prints the parsed JSON to stdout.

## Menubar Icon Data

Generate the tray icon payload used by the menubar app:

```bash
node src/menubar.js --lat 40.7128 --lon -74.0060
```
On Windows:
```cmd
node src\menubar.js --lat 40.7128 --lon -74.0060
```

This prints a small JSON object containing the icon image ID, tooltip text and the folder name (`day`, `night` or `moon`).

## Tray Icon Example

A simple Electron script updates the system tray using the parsed data. Run it with `npx` so Electron is downloaded on demand:

```bash
npx electron src/tray.js --lat 40.7128 --lon -74.0060
```
On Windows the command is the same:
```cmd
npx electron src\tray.js --lat 40.7128 --lon -74.0060
```

This launches an Electron process that fetches the weather, builds the menubar payload and sets a tray icon and tooltip based on those values.

## Troubleshooting

- **Build fails with `Cannot find package '@vitejs/plugin-vue'`:** Run
  `npm install` to install missing dev dependencies before building.

- **Sass reports `Can't find stylesheet to import`:** Use the `@use` syntax
  for SCSS modules (e.g. `@use '@/scss/mixins' as *;`) and ensure the `@`
  alias is configured in `vite.config.js`.
- **Build fails with `[commonjs--resolver] Missing "./modules" specifier in
  "swiper" package`:** Install dependencies again with `npm install` and ensure
  the project uses Swiper v11 or later. If the error persists, delete your
  `node_modules` folder and reinstall.
- **npm warns about `vue-awesome-swiper` and `swiper` peer dependencies:**
  This project uses the Vue components bundled with Swiper itself. Remove any
  `vue-awesome-swiper` entry from your dependencies or lock file and keep
  Swiper updated (v11 or later) to avoid the warning.
