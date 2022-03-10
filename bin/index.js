#!/usr/bin/env node

console.log()

const { run, clean } = require('../src/cli.js')

run()
  .catch((error) => {
    if (error) console.error('Error:', error)
    process.exit(2)
  })
  .finally(clean)
