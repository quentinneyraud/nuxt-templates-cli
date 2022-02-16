#!/usr/bin/env node

require('../src/cli.js').run()
  .catch((error) => {
    console.error('Error:', error)
    process.exit(2)
  })
