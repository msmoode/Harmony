function getPlatformHarmonizer () {
  try { // Running in Electron
    require.resolve('electron')
    return require('./harmonizer/electronHarmonizer.js')
  } catch (e) { // Running on web
    return require('./harmonizer/webHarmonizer.js')
  }
}

const Harmonizer = getPlatformHarmonizer()

const Harmony = new Harmonizer()

Harmony.on('ready', () => {
  Harmony.debug('test')
})
