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

  const longestFeatureTitle = availableFeatures
    .reduce((longest, feature) => {
      if (feature.metas.title.length > longest) longest = feature.metas.title.length

      return longest
    }, 0)

  const choices = availableFeatures
    .map(feature => {
      return {
        name: `${feature.metas.title.padEnd(longestFeatureTitle + 10, ' ')} (${feature.metas?.description})`,
        value: feature.uid,
        checked: false
      }
    })

  const { features: featuresUidsToInstall } = await inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select features',
        choices,
        pageSize: choices.length,
        loop: false
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
  featuresToInstall.forEach(async featureToInstall => {
    await install(featureToInstall)
  })

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
