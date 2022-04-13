/* eslint-disable no-console */
import fs, { promises as fsPromises } from 'fs'
import path from 'path'
import defu from 'defu'

const ENVIRONMENT = process.env.ENV || 'dev'
const IS_DEV = ENVIRONMENT === 'dev'
const IS_PREPROD = ENVIRONMENT === 'preprod'
const IS_PROD = ENVIRONMENT === 'prod'

const MODE = process.env.MODE
const BASE_URL = {
  dev: 'http://localhost:3000',
  preprod: 'http://preprod.my-site.fr',
  prod: 'http://my-site.fr'
}[ENVIRONMENT] || 'http://my-site.fr'

const title = 'My project'

/**

  Returns an array of each features config

 */
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
        title
      })
    })
}

export default async (_) => {
  const baseConfig = {
    target: 'static',

    head: {
      title,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
    css: [],
    plugins: [],
    components: true,
    buildModules: [
      '@nuxtjs/eslint-module'
    ],
    build: {}
  }

  const config = defu(baseConfig, ...(await getFeaturesConfigs()))

  /**

    Override config here

   */

  // ...

  return config
}
