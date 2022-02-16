const { install } = require('lmify')
const { removeDuplicates } = require('./utils')

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
    await install(...removeDuplicates(this.dependencies))
  },

  async installDevDependencies () {
    await install(['-D', ...removeDuplicates(this.devDependencies)])
  },

  async installAll () {
    await this.installDependencies()
    await this.installDevDependencies()
  }
}

module.exports = DependenciesInstaller
