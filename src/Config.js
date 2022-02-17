const path = require('path')

const Config = {
  noConfigDownload: false,
  repository: 'quentinneyraud/nuxt-templates',
  token: null,
  rootDirectory: process.cwd(),
  tmpDirectory: 'tmp',

  parse () {
    const args = process.argv.slice(2)

    // no config
    if (args.includes('--no-config')) this.noConfigDownload = true

    // token
    if (args.includes('--token')) {
      const tokenArgumentIndex = args.findIndex(argument => argument === '--token')
      if (tokenArgumentIndex > -1 && args?.[tokenArgumentIndex + 1]) this.token = args?.[tokenArgumentIndex + 1]
    }

    // repository
    if (args.includes('--repository')) {
      const repositoryArgumentIndex = args.findIndex(argument => argument === '--repository')
      if (repositoryArgumentIndex > -1 && args?.[repositoryArgumentIndex + 1]) this.repository = args?.[repositoryArgumentIndex + 1]
    }

    // tmp directory
    if (args.includes('--tmp')) {
      const tmpArgumentIndex = args.findIndex(argument => argument === '--tmp')
      if (tmpArgumentIndex > -1 && args?.[tmpArgumentIndex + 1]) this.tmpDirectory = args?.[tmpArgumentIndex + 1]
    }
    this.tmpDirectory = path.resolve(this.rootDirectory, this.tmpDirectory)
  }
}

module.exports = Config
