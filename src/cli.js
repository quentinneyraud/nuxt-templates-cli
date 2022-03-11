const c = require('ansi-colors')
const Log = require('./Log.js')

const INSTALL_COMMAND = 'install'
const CONFIG_COMMAND = 'get-config'
const COMMANDS = [INSTALL_COMMAND, CONFIG_COMMAND]

const HELP_ARGUMENT = '--help'
const HELP_ARGUMENT_ALIAS = '-h'
const INSTALL_TOKEN_ARGUMENT = '--token'
const INSTALL_REPOSITORY_ARGUMENT = '--repository'
const INSTALL_TMP_DIRECTORY_ARGUMENT = '--tmp'

const Cli = {
  INSTALL_COMMAND,
  CONFIG_COMMAND,

  args: null,

  command: null,

  arguments: {
    help: false,
    token: null,
    repository: null,
    tmpDirectory: null
  },

  getCommand () {
    const maybeCommand = this.args[0]

    if (!COMMANDS.includes(maybeCommand)) return

    this.command = maybeCommand
  },

  getArguments () {
    // Help
    if (this.args.includes(HELP_ARGUMENT) || this.args.includes(HELP_ARGUMENT_ALIAS)) {
      this.arguments.help = true

      return
    }

    // token
    if (this.args.includes(INSTALL_TOKEN_ARGUMENT)) {
      const tokenArgumentIndex = this.args.findIndex(argument => argument === INSTALL_TOKEN_ARGUMENT)
      if (tokenArgumentIndex > -1 && this.args?.[tokenArgumentIndex + 1]) this.arguments.token = this.args?.[tokenArgumentIndex + 1]
    }

    // repository
    if (this.args.includes(INSTALL_REPOSITORY_ARGUMENT)) {
      const repositoryArgumentIndex = this.args.findIndex(argument => argument === INSTALL_REPOSITORY_ARGUMENT)
      if (repositoryArgumentIndex > -1 && this.args?.[repositoryArgumentIndex + 1]) this.arguments.repository = this.args?.[repositoryArgumentIndex + 1]
    }

    // tmp directory
    if (this.args.includes(INSTALL_TMP_DIRECTORY_ARGUMENT)) {
      const tmpArgumentIndex = this.args.findIndex(argument => argument === INSTALL_TMP_DIRECTORY_ARGUMENT)
      if (tmpArgumentIndex > -1 && this.args?.[tmpArgumentIndex + 1]) this.arguments.tmpDirectory = this.args?.[tmpArgumentIndex + 1]
    }
  },

  parse () {
    this.args = process.argv.slice(2)

    this.getCommand()

    if (!this.command) return

    this.getArguments()
  },

  logHelp () {
    Log.log(`${c.bold.underline('Nuxt templates CLI')}

${c.bold('Commands')}:
    ${INSTALL_COMMAND}: Install one or more features
    ${CONFIG_COMMAND}: Logs and copy to clipoard custom nuxt.config.js file content

${c.bold('Arguments')}:
    ${HELP_ARGUMENT} | ${HELP_ARGUMENT_ALIAS}: Display this help
    ${INSTALL_TOKEN_ARGUMENT}: Create a token (https://github.com/settings/tokens) to extend API limit
    ${INSTALL_REPOSITORY_ARGUMENT}: Github repository name (default: quentinneyraud/nuxt-templates)
    ${INSTALL_TMP_DIRECTORY_ARGUMENT}: Temporary directory to download files, use an empty directory (default: ./tmp)

${c.bold('Examples')}:
    nuxt-templates ${CONFIG_COMMAND}
    nuxt-templates ${INSTALL_COMMAND} ${INSTALL_TOKEN_ARGUMENT} abc123
`)
  }
}

module.exports = Cli
