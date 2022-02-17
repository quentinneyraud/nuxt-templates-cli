const github = require('octonode')
const download = require('download')

const TOKEN = ''

const client = github.client(TOKEN)
const ghrepo = client.repo('quentinneyraud/nuxt-templates')

const getFeaturesBranchesNames = async _ => {
  const [branches] = await ghrepo.branchesAsync()

  return branches
    .filter(({ name }) => name.includes('features'))
    .map(({ name }) => name)
    // TODO: remove
    .slice(15, 16)
}

const getFeatures = async _ => {
  const branchesNames = await getFeaturesBranchesNames()

  const promises = branchesNames
    .map(async branchName => {
      try {
        const uid = branchName.replace('features/', '')
        const [installationFile] = await ghrepo.contentsAsync('nuxt-templates-cli.js', branchName)

        const folder = `${process.cwd()}/tmp/${uid}`

        await download(installationFile.download_url, folder)

        const { metas, dependencies, devDependencies, files } = require(`${folder}/nuxt-templates-cli.js`)

        return {
          uid,
          branchName,
          metas,
          dependencies,
          devDependencies,
          files
        }
      } catch (_) {
        return null
      }
    })

  return (await Promise.all(promises))
    .filter(v => !!v)
}

const getDirectoryContent = async (directoryPath, branchName = 'master') => {
  const [directoryContents] = await ghrepo.contentsAsync(directoryPath, branchName)

  return directoryContents
    .map(fileOrDir => {
      const { name, download_url: downloadUrl, type, path } = fileOrDir

      return {
        name,
        path,
        type,
        downloadUrl
      }
    })
}

const recursivelyGetDirectoryContent = async (directoryPath, branchName, acc = []) => {
  const directoryContents = await getDirectoryContent(directoryPath, branchName)

  await Promise.all(directoryContents.map(async fileOrDir => {
    if (fileOrDir.type === 'file') {
      acc.push(fileOrDir)
    }

    if (fileOrDir.type === 'dir') {
      await recursivelyGetDirectoryContent(fileOrDir.path, branchName, acc)
    }
  }))

  return acc
}

module.exports = {
  getFeatures,
  getDirectoryContent,
  recursivelyGetDirectoryContent
}
