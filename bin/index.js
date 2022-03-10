#!/usr/bin/env node

const { run, clean } = require('../src/cli.js')

process.on('exit', clean)

console.log()

run()
  .catch((error) => {
    if (error) console.error('Error:', error)
  })
