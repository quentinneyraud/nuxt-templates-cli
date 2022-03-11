import fs, { promises as fsPromises } from 'fs'
import path from 'path'
import defu from 'defu'

const ENVIRONMENT = process.env.ENV
const IS_DEV = ENVIRONMENT === 'dev'
const IS_PROD = ENVIRONMENT === 'prod'

/**

  Returns an array of each features config

 */
const getFeaturesConfigs = async (_) => {
  const CONFIGS_PATH = path.resolve(__dirname, 'configs')

  if (!fs.existsSync(CONFIGS_PATH)) {
    return []
  }

  const configsFilesNames = await fsPromises.readdir(CONFIGS_PATH)

  return configsFilesNames
    .map((configFileName) => {
      return require(path.resolve(CONFIGS_PATH, configFileName))({
        IS_DEV,
        IS_PROD
      })
    })
}

export default async (_) => {
  const baseConfig = {
    target: 'static',

    head: {
      title: 'test-nuxt-templates-cli',
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
    modules: [
      '@nuxtjs/pwa'
    ],
    pwa: {
      manifest: {
        lang: 'en'
      }
    },
    build: {}
  }

  const config = defu(baseConfig, ...(await getFeaturesConfigs()))

  /**

    Override config here

   */

  // ...

  return config
}
