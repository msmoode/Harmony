import Harmonizer from './harmonizer'
import {BrowserWindow} from 'electron'

class ElectronHarmonizer extends Harmonizer {
  constructor () {
    super()

    this.mainWindow = null

    const defer = setInterval(() => {
      for (const window of BrowserWindow.getAllWindows()) {
        if (window.webContents.getURL().includes('discordapp.com')) {
          this.mainWindow = window
          this.ready()
          clearInterval(defer)
          break
        }
      }
    }, 100)
  }

  debug (...message) {
    require('electron').dialog.showErrorBox('Debug', message.join(' '))
  }
}

module.exports = ElectronHarmonizer
