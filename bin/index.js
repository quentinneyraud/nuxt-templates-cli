#!/usr/bin/env node

const { run, clean } = require('../src/cli.js')

run()
  .catch((error) => {
    console.error('Error:', error)
    process.exit(2)
  })
  .finally(clean)
