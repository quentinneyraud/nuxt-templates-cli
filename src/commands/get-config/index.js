const clipboard = require('clipboardy')
const fsPromises = require('fs').promises
const path = require('path')

const c = require('ansi-colors')
const Log = require('../../Log')

const run = async _ => {
  Log.title('nuxt.config.js :')

  const nuxtConfigFileContent = await fsPromises.readFile(path.resolve(__dirname, 'nuxt.config.js'), { encoding: 'utf8' })

  console.log(c.cyan(nuxtConfigFileContent))

  Log.blankLine()
  Log.blankLine()

  clipboard.writeSync(nuxtConfigFileContent)

  Log.log('🎉 nuxt.config.js content is copied in your clipboard !')
}

module.exports = {
  run
}
