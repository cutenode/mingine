const mingine = require('..')
const fs = require('fs')
const path = require('path')

async function getNodeMinimumEngine () {
  const engines = await mingine() // mingine returns a promise
  const outputPath = path.join(__dirname, '/node-minimum-output.json')

  fs.writeFile(outputPath, engines ? JSON.stringify(engines, null, 2) : undefined, function (error) { // will write the minimum usable version of node.js if there were any `engines` that included `node`, otherwise it'll return undefined
    if (error) throw error

    console.log(`wrote output to ${outputPath}!`)
  })
}

getNodeMinimumEngine()
