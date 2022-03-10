const download = require('download')
const colors = require('ansi-colors')
const cliProgress = require('cli-progress')
const Config = require('./Config.js')
const DependenciesInstaller = require('./DependenciesInstaller.js')
const { recursivelyGetDirectoryContent, getDirectoryContent } = require('./Github.js')
const { mergeArrays } = require('./utils.js')

const install = async ({ uid, featureTmpDirectory, branchName, dependencies, devDependencies, files } = {}) => {
  const fileDownloadsPromises = []

  // Add dependencies
  if (dependencies) {
    DependenciesInstaller.addDependencies(dependencies)
  }

  // Add devDependencies
  if (devDependencies) {
    DependenciesInstaller.addDevDependencies(devDependencies)
  }

  /**
   *
   * Files
   *
   */
  const progressBar = new cliProgress.SingleBar({
    format: colors.cyan('{bar}') + ' {percentage}% ({value}/{total})'
  }, cliProgress.Presets.shades_classic)

  if (files) {
    // Glob all files
    const allFilesPromises = files.map(file => recursivelyGetDirectoryContent(file, branchName))
    let allFiles = await Promise.all(allFilesPromises)
    allFiles = mergeArrays(allFiles)

    // Store download promises
    fileDownloadsPromises.push(...allFiles.map(file => async _ => {
      await download(file.downloadUrl, file.pathDirectory)
      progressBar.increment()
    }))
  }

  /**
   *
   * Config
   *
   */
  const configFile = await getDirectoryContent('config.js', branchName)
  let featureConfig = null

  if (configFile) {
    // Log config instead of download it
    if (Config.noConfigDownload) {
      fileDownloadsPromises.push(async _ => {
        await download(configFile.downloadUrl, featureTmpDirectory)
        progressBar.increment()

        featureConfig = require(`${featureTmpDirectory}/config.js`)?.()
      })
    } else {
      fileDownloadsPromises.push(async _ => {
        await download(configFile.downloadUrl, 'configs', {
          filename: `nuxt.config.${uid}.js`
        })
        progressBar.increment()
      })
    }
  }

  // Run all download promises
  progressBar.start(fileDownloadsPromises.length, 0)
  await Promise.all(fileDownloadsPromises.map(fn => fn()))
  progressBar.stop()

  if (featureConfig) {
    console.log()
    console.log()
    console.log(featureConfig)
    console.log()
    console.log()
  }
}

module.exports = {
  install
}
