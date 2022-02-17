const download = require('download')
const Config = require('./Config.js')
const DependenciesInstaller = require('./DependenciesInstaller.js')
const { recursivelyGetDirectoryContent, getDirectoryContent } = require('./Github.js')
const { mergeArrays } = require('./utils.js')

const install = async ({ uid, featureTmpDirectory, branchName, dependencies, devDependencies, files } = {}) => {
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

  // config
  const configFile = await getDirectoryContent('config.js', branchName)

  if (configFile) {
    // Log config instead of download it
    if (Config.noConfigDownload) {
      await download(configFile.downloadUrl, featureTmpDirectory)

      const config = require(`${featureTmpDirectory}/config.js`)?.()

      console.log()
      console.log()
      console.log('Ajouter cette config a nuxt.config:', config)
      console.log()
      console.log()
    } else {
      await download(configFile.downloadUrl, 'configs', {
        filename: `nuxt.config.${uid}.js`
      })
    }
  }
}

module.exports = {
  install
}
