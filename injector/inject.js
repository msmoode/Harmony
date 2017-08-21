const asar = require('asar')
const q = require('q')
const path = require('path')
const fs = require('fs')
const copydir = require('copy-dir')

const args = process.argv.slice(2)

const discordLocation = args[0]

const backupAsar = path.join(discordLocation, 'resources', 'app.asar.old')
const discordAsar = path.join(discordLocation, 'resources', 'app.asar')
const extractLocation = path.join(discordLocation, 'resources', 'app')

function inject (sourceAsar, outputAsar) {
  q.fcall(() => {
    console.log('Extracting app.asar...')
    asar.extractAll(sourceAsar, extractLocation)
    console.log('  ...Done!')
  }).then(() => {
    console.log('Injecting harmony...')
  }).then(() => {
    console.log('  ...Injecting dependency to package.json')
    return q.nfbind(fs.readFile)(path.join(extractLocation, 'package.json'), 'utf8')
  })
  .then(data => {
    return data.replace('"dependencies": {', '"dependencies": {"harmony": "1.0.0",')
  }).then(data => {
    return q.nfbind(fs.writeFile)(path.join(extractLocation, 'package.json'), data, 'utf8')
  }).then(() => {
    console.log('  ...Injecting initialisation code')
    return q.nfbind(fs.readFile)(path.join(extractLocation, 'index.js'), 'utf8')
  })
  .then(data => {
    return data.replace('require(\'electron\');', 'require(\'electron\');\n\nrequire(\'harmony\') // Harmony injection')
  }).then(data => {
    return q.nfbind(fs.writeFile)(path.join(extractLocation, 'index.js'), data, 'utf8')
  }).then(() => {
    console.log('  ..Injecting harmony package')
    return q.nfbind(copydir)('../build', path.join(extractLocation, 'node_modules', 'harmony'))
  }).then(() => {
    console.log('Repackaging app.asar...')
    return new q.Promise((resolve, reject) => asar.createPackage(extractLocation, outputAsar, resolve))
  })
  .then(() => {
    console.log('  ...Done!')
  })
  .done()
}

if (!fs.existsSync(backupAsar)) {
  const readStream = fs.createReadStream(discordAsar)
  readStream.once('error', (err) => { throw new Error(err) })
  readStream.once('end', () => inject(discordAsar, discordAsar))
  readStream.pipe(fs.createWriteStream(backupAsar))
} else {
  inject(backupAsar, discordAsar)
}
