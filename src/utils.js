const fs = require('fs')
const path = require('path')
const fsPromises = fs.promises

// https://github.com/nuxt/nuxt.js/blob/dev/packages/cli/src/utils/dir.js
const isNuxtDir = rootDirectory => {
  if (fs.existsSync(path.join(rootDirectory, 'nuxt.config.js')) ||
    fs.existsSync(path.join(rootDirectory, 'pages')) ||
    fs.existsSync(path.join(rootDirectory, 'nuxt.config.ts'))) {
    return true
  }
  return false
}

const createDirectory = async directoryPath => {
  await fsPromises.mkdir(directoryPath, { recursive: true })
}

const removeDirectory = async directoryPath => {
  await fsPromises.rm(directoryPath, { recursive: true })
}

const removeDuplicates = arr => Array.from(new Set(arr))

module.exports = {
  createDirectory,
  removeDirectory,
  isNuxtDir,
  removeDuplicates
}
