const glob = require('glob')
const fs = require('fs')

const manifest = glob.sync('./comics/*/*/*.{jpg,png}').map((path) => path.replace(/^\.\/comics/, ''))

fs.writeFileSync('./source/scripts/manifest.json', JSON.stringify(manifest, null, '  '))
