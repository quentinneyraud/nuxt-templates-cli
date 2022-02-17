const path = require('path')

const CONFIG_DOWNLOAD_ARGUMENT = '--no-config'
const TOKEN_ARGUMENT = '--token'
const REPOSITORY_ARGUMENT = '--repository'
const TMP_DIRECTORY_ARGUMENT = '--tmp'

const Config = {
  noConfigDownload: false,
  repository: 'quentinneyraud/nuxt-templates',
  token: null,
  rootDirectory: process.cwd(),
  tmpDirectory: 'tmp',

  parse () {
    const args = process.argv.slice(2)

    // Help
    if (args.includes('--help') || args.includes('-h')) {
      this.logHelp()
      throw String()
    }

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
  },

  logHelp () {
    console.log(`
Nuxt templates CLI

Arguments:
    ${CONFIG_DOWNLOAD_ARGUMENT}: Use this to logs feature config instead of downloading it in configs folder
    ${TOKEN_ARGUMENT}: Create a token (https://github.com/settings/tokens) to extend API limit
    ${REPOSITORY_ARGUMENT}: Github repository name (default: quentinneyraud/nuxt-templates)
    ${TMP_DIRECTORY_ARGUMENT}: Temporary directory to download files, use an empty directory (default: ./tmp)
`)
  }
}

module.exports = Config
