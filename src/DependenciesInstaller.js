const lmify = require('lmify')
const { removeDuplicates } = require('./utils.js')

const DependenciesInstaller = {
  dependencies: [],
  devDependencies: [],

  addDependencies (dependencies) {
    if (!Array.isArray(dependencies)) dependencies = [dependencies]

    this.dependencies.push(...dependencies)
  },

  addDevDependencies (dependencies) {
    if (!Array.isArray(dependencies)) dependencies = [dependencies]

    this.devDependencies.push(...dependencies)
  },

  async installDependencies () {
    await lmify.install(...removeDuplicates(this.dependencies))
  },

  async installDevDependencies () {
    await lmify.install(['-D', ...removeDuplicates(this.devDependencies)])
  },

  async installAll () {
    await this.installDependencies()
    await this.installDevDependencies()
  }
}

module.exports = DependenciesInstaller
