#!/usr/bin/env node

const Cli = require('../src/Cli.js')
const Log = require('../src/Log.js')

// Commands
const install = require('../src/commands/install/index.js')
const getConfig = require('../src/commands/get-config/index.js')

Log.blankLine()

// Get commands and arguments from CLI entry
Cli.parse()

// Version argument
if (Cli.arguments.version) {
  Cli.logVersion()
  process.exit(0)
}

// No command or help argument
if (!Cli.command || Cli.arguments.help) {
  Cli.logHelp()
  process.exit(0)
}

// Install features
if (Cli.command === Cli.INSTALL_COMMAND) {
  process.on('exit', install.clean)

  install
    .run(Cli.arguments)
    .catch((error) => {
      if (error) console.error('Error:', error)
    })
}

// Get nuxt.config.js content
if (Cli.command === Cli.CONFIG_COMMAND) {
  getConfig
    .run()
}
