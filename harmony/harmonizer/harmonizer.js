import EventEmitter from 'events'

export default class extends EventEmitter {
  constructor () {
    super()
    if (this.debug === undefined) throw new Error('Harmonizer missing `debug` method!')

    this.on('ready', () => {
      
    })
  }

  ready () {
    this.emit('ready')
  }
}
