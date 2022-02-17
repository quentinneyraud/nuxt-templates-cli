const download = require('download')
const DependenciesInstaller = require('./DependenciesInstaller')
const { recursivelyGetDirectoryContent } = require('./Github')
const { mergeArrays } = require('./utils')

const install = async ({ branchName, dependencies, devDependencies, files } = {}) => {
  // dependencies
  if (dependencies) {
    DependenciesInstaller.addDependencies(dependencies)
  }

  // devDependencies
  if (devDependencies) {
    DependenciesInstaller.addDevDependencies(devDependencies)
  }

  // files
  const allFilesPromises = files.map(file => recursivelyGetDirectoryContent(file, branchName))
  let allFiles = await Promise.all(allFilesPromises)
  allFiles = mergeArrays(allFiles)

  const downloadAllFilesPromises = allFiles.map(file => download(file.downloadUrl, file.path))
  await Promise.all(downloadAllFilesPromises)
}

module.exports = {
  install
}
