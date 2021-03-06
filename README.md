# mingine

A Node.js module to understand your dependencies `engines`.

## Usage

First, you'll need to install mingine:

```sh
npm i mingine
```

Next, you'll want to require and use mingine. Requring mingine returns a promise that resolves an object.

```js
const mingine = require('mingine')

async function getNodeMinimumEngine () {
  const engines = await mingine() // mingine returns a promise

  console.log(engines.node ? engines.node.minimum : undefined) // will log the minimum usable version of node.js if there were any `engines` that included `node`, otherwise it'll return undefined
}

getNodeMinimumEngine()
```

## `mingine(options)`

* `options` object (optional) - An object that acts as a courrier of options to [Arborist][]. Currently, only `path` is actively used.
  * `path` string (optional) - where to search for node_modules. defaults to the current working directory.

Returns `promise` - a promise that resolves an object, which represents the strucutre of engines. See [Returned Object Structure][] for more context on the shape of this object.

Calling `mingine()` by itself will return a promise that resolves an object. It searches the current working directory's `node_modules` to do so. Calling `mingine(options)` where `options` is an object and has the property `path`, the value of `path` will be used as the directory to search for `node_modules`.

## Returned Object Structure

The _structure_ of mingine's API is consistent, but the properties will not be. Mingine collects the `engine` property from every package inside of `node_modules` and then dynamically builds an object that includes every property within `engines` it encountered. It makes no assurances that any given property will exist since there's no gaurantee that a property may exist within `node_modules`.

The general structure will be:

- `${engineName}` object - an object where the key is the name encountered inside of the `engines` property of a given package.json. Examples: `node`, `npm`
  - `versions` object - an object that will always be identified as `versions` that contains arrays that represent each `${version}` of `${engineName}`
    - `${version}` array - an array where the key is either a **valid** semver version OR any other string - even if it's not a valid semver version - since people do weird things with engines. In the future this may be tweaked/audited. Examples: `1.4.2`, `10.0.0`, `8.2.0`
      - `${package}` string - strings that represent the package names of packages that included `${version}` as the value for `${engineName}` in their package.json. Examples: `webpack`, `react`, `qs`, `request`
  - `minimum` string - a string that includes the _minimum usable version_ of `${engineName}` given the context collected from the `engines` property of all package.json files within `node_modules`.

  An example of JSON output can be found at [./examples/everything-output.json][]

  [./examples/everything-output.json]:./examples/everything-output.json
  [Arborist]:https://www.npmjs.com/package/@npmcli/arborist
