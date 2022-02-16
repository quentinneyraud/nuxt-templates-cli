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
        const [installationFile] = await ghrepo.contentsAsync('nuxt-templates-cli.js', branchName)

        await download(installationFile.download_url, `${process.cwd()}/tmp/${branchName}`)

        const { metas, dependencies, devDependencies, files } = require(`${process.cwd()}/tmp/${branchName}/nuxt-templates-cli.js`)

        return {
          uid: branchName.replace('features/', ''),
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

const getFiles = async (filePath, branchName = 'master') => {
  const [filesOrDirs] = await ghrepo.contentsAsync(filePath, branchName)

  return filesOrDirs
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

module.exports = {
  getFeatures,
  getFiles
}
