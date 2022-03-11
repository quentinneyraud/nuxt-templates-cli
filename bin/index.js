#!/usr/bin/env node

const { run, clean } = require('../src/cli.js')
const Log = require('../src/Log.js')

process.on('exit', clean)

Log.blankLine()

run()
  .catch((error) => {
    if (error) console.error('Error:', error)
  })
