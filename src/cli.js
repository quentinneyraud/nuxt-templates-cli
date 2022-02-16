const inquirer = require('inquirer')

const { getFeatures } = require('./Github')
const { install } = require('./Installer')
const { removeDirectory, isNuxtDir } = require('./utils')
const DependenciesInstaller = require('./DependenciesInstaller')

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

module.exports = {
  run: async _ => {
    if (!isNuxtDir(process.cwd())) {
      throw String('Not a Nuxt directory')
    }

    const featuresToInstall = await getFeaturesToInstall()
    await Promise.all(featuresToInstall.map(install))

    // await DependenciesInstaller.installAll()

    console.log('all done')

    // await install(features[0])

    // removeDirectory('./tmp')
  }
}
