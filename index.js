const Arborist = require('@npmcli/arborist')
const semver = require('semver')

const data = {} // initialize data we'll return

async function mingine (options) {
  const arboristOptions = {}

  for (const option in options) {
    if (option === 'path' || option === 'registry' || option === 'auth' || option === 'scopes') { // only use the options that arborist actually takes
      arboristOptions[option] = options[option]
    }
  }
  const arborist = new Arborist(arboristOptions)

  const actualVersions = arborist.loadActual().then(tree => {
    tree.children.forEach(packageMapHandler) // iterate over the chidlren Map() with the packageMapHandler method
  }).then(() => {
    return data // once iteration is completed, return data
  })

  return actualVersions
}

function packageMapHandler (value, key, map) {
  const symbols = Object.getOwnPropertySymbols(value)
  const children = map.get(key)
  const enginesPropertyInPacakgeJSON = children[symbols[0]].engines // only extract the engines property
  const namePropertyInPacakgeJSON = children[symbols[0]].name // only extract the name property

  if (enginesPropertyInPacakgeJSON !== undefined) {
    const presentEngines = Object.keys(enginesPropertyInPacakgeJSON)

    presentEngines.forEach(engine => { // in an unopinionated way, iterate over the values for every single engine and build our API
      const version = semverify(enginesPropertyInPacakgeJSON[engine]) // semverify normalizes semver ranges for our use case

      if (data[engine] === undefined) {
        data[engine] = {}
      }

      if (data[engine].versions === undefined) {
        data[engine].versions = {}
      }

      if (data[engine].versions[version] === undefined) {
        data[engine].versions[version] = []
      }

      if (data[engine].minimum === undefined) {
        data[engine].minimum = version
      }

      if (semver.valid(semver.coerce(version)) !== null) {
        if (semver.lt(data[engine].minimum, version)) {
          data[engine].minimum = version
        }
      }

      data[engine].versions[version].push(namePropertyInPacakgeJSON)
    })
  }
}

function semverify (versionlike) {
  let cleaned = semver.valid(semver.coerce(versionlike))

  if (cleaned === null) {
    cleaned = versionlike
  }

  return cleaned
}

module.exports = mingine
