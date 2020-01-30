const mingine = require('..')

async function getNodeMinimumEngine () {
  const engines = await mingine() // mingine returns a promise

  console.log(engines.node ? JSON.stringify(engines.node.minimum, null, 2) : undefined) // will write the minimum usable version of node.js if there were any `engines` that included `node`, otherwise it'll return undefined
}

getNodeMinimumEngine()
