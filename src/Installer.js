const DependenciesInstaller = require('./DependenciesInstaller')
const { getFiles } = require('./Github')

const install = async ({ branchName, dependencies, devDependencies, files } = {}) => {
  // dependencies
  if (dependencies) {
    DependenciesInstaller.addDependencies(dependencies)
  }

  // devDependencies
  if (devDependencies) {
    DependenciesInstaller.addDevDependencies(devDependencies)
  }

  const getAllFiles = async (acc, file) => {
    const ffiles = await getFiles(file, branchName)

    await Promise.all(ffiles.map(async f => {
      if (f.type === 'file') {
        acc.push(f)
      }

      if (f.type === 'dir') {
        await getAllFiles(acc, f.path)
      }
    }))

    return acc
  }

  const a = await getAllFiles([], files[0])
  console.log('a:', a)
}

module.exports = {
  install
}
