const inquirer = require('inquirer')

const { getFeatures } = require('./Github.js')
const { install } = require('./Installer.js')
const DependenciesInstaller = require('./DependenciesInstaller.js')
const Config = require('./Config.js')
const { removeDirectory, isNuxtDir } = require('./utils.js')

/**
 * Get all available features from Github repo,
 * then display them in a checkbox list to let user choose which ones he wants to add
 *
 * @returns {Array} Array of features objects selected by user
 */
const getFeaturesToInstall = async _ => {
  const availableFeatures = await getFeatures()

  const choices = availableFeatures
    .map(feature => {
      return {
        name: `${feature?.metas.title} (${feature?.metas.description})`,
        value: feature.uid,
        checked: true
      }
    })

  const { features: featuresUidsToInstall } = await inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Select features',
        name: 'features',
        choices
      }
    ])

  return availableFeatures
    .filter(availableFeature => featuresUidsToInstall.includes(availableFeature.uid))
}

const run = async _ => {
  Config.parse()

  if (!isNuxtDir(process.cwd())) {
    throw String('Not a Nuxt directory')
  }

  const featuresToInstall = await getFeaturesToInstall()
  await Promise.all(featuresToInstall.map(install))

  await DependenciesInstaller.installAll()

  console.log('All done')
}

const clean = _ => {
  removeDirectory(Config.tmpDirectory)
}

module.exports = {
  run,
  clean
}
