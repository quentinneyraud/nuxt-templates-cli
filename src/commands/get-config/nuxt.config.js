/* eslint-disable no-console */
import fs, { promises as fsPromises } from 'fs'
import path from 'path'
import defu from 'defu'

/**
 * Environment informations
 */
const ENVIRONMENT = process.env.ENV || 'dev'
const IS_DEV = ENVIRONMENT === 'dev'
const IS_PREPROD = ENVIRONMENT === 'preprod'
const IS_PROD = ENVIRONMENT === 'prod'

/**
 * Build mode informations
 */
const MODE = process.env.MODE || 'static'
const BASE_URL = process.env.BASE_URL || {
  dev: 'http://localhost:3000',
  preprod: 'http://preprod.my-site.fr',
  prod: 'http://my-site.fr'
}[ENVIRONMENT] || 'http://my-site.fr'

/**
 * Website informations
 */
const lang = 'en'
const title = 'My company'
const description = 'My company is doing something'
const themeColor = '#FFFFFF'
const shareImage = '/share.jpg'

// Returns an array of each features config
const getFeaturesConfigs = async (_) => {
  const CONFIGS_PATH = path.resolve(__dirname, 'configs')

  console.log(`Reading configs from ${CONFIGS_PATH} ...`)

  if (!fs.existsSync(CONFIGS_PATH)) {
    return []
  }

  const configsFilesNames = await fsPromises.readdir(CONFIGS_PATH)

  return configsFilesNames
    .map((configFileName) => {
      return require(path.resolve(CONFIGS_PATH, configFileName))({
        ENVIRONMENT,
        IS_DEV,
        IS_PREPROD,
        IS_PROD,
        MODE,
        BASE_URL,
        lang,
        title,
        description,
        shareImage,
        themeColor
      })
    })
}

export default async (_) => {
  const baseConfig = {
    target: 'static',
    buildModules: [
      '@nuxtjs/eslint-module'
    ]
  }

  const config = defu(baseConfig, ...(await getFeaturesConfigs()))

  /**

    Override config here

   */

  // ...

  return config
}
