const path = require('path')
const github = require('octonode')
const download = require('download')
const Config = require('./Config')

let ghrepo

const getRepo = () => {
  if (!ghrepo) {
    const client = github.client(Config.token)
    ghrepo = client.repo(Config.repository)
  }

  return ghrepo
}

const getFeaturesBranchesNames = async _ => {
  const [branches] = await getRepo().branchesAsync()

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
        const [installationFile] = await getRepo().contentsAsync('nuxt-templates-cli.js', branchName)

        const featureTmpDirectory = path.resolve(Config.tmpDirectory, uid)

        await download(installationFile.download_url, featureTmpDirectory)

        const { metas, dependencies, devDependencies, files } = require(`${featureTmpDirectory}/nuxt-templates-cli.js`)

        return {
          uid,
          featureTmpDirectory,
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
  const parseFileOrDir = fileOrDir => {
    const { name, download_url: downloadUrl, type, path } = fileOrDir

    return {
      name,
      path,
      type,
      downloadUrl
    }
  }

  try {
    const [directoryContents] = await getRepo().contentsAsync(directoryPath, branchName)

    if (!Array.isArray()) {
      return parseFileOrDir(directoryContents)
    }

    return directoryContents
      .map(parseFileOrDir)
  } catch (_) {
    return null
  }
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
