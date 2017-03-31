const glob = require('glob')
const fs = require('fs')

const manifest = glob.sync('./comics/*/*/*.{jpg,png}').reduce((accumulator, path) => {
    const pathParts =  path.split('/').reverse();
    const chapter = parseInt(pathParts[1])
    const volume = parseInt(pathParts[2])

    const page = parseInt(pathParts[0].split('.')[0])

    accumulator[volume] || (accumulator[volume] = [])
    accumulator[volume][chapter] || (accumulator[volume][chapter] = [])
    accumulator[volume][chapter][page] = path.replace(/^\.\/comics/, '');
    return accumulator
}, [])

fs.writeFileSync('./source/scripts/manifest.json', JSON.stringify(manifest, null, '  '))
