/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/12 13:14:13 (GMT+0900)
 */
const fs = require('fs')
const { EOL } = require('os')
const path = require('path')
const { formatDate } = require('../dist/utils/index.umd')
const pkg = require('../package.json')

const header = [
  '/*!',
  ` * ${pkg.name} version ${pkg.version}`,
  ` * Author: ${pkg.author}`,
  ` * Repository: ${pkg.repository}`,
  ` * Released on: ${formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss (g)')}`,
  ` */`,
]

function addHeader(file) {
  const liens = fs.readFileSync(file, 'utf8').toString().split(EOL)
  fs.writeFileSync(file, [...header, ...liens].join(EOL))
}

function main(lib) {
  const distDir = path.resolve(__dirname, `../dist/${lib}`)
  fs.readdirSync(distDir).forEach((file) => {
    if (/\.js$/.test(file)) {
      addHeader(path.join(distDir, file))
    }
  })
}

main('utils')
main('docgen')
