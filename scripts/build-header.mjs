/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/12 13:14:13 (GMT+0900)
 */
import fs from 'node:fs'
import { EOL } from 'node:os'
import path from 'node:path'
import { formatDate } from 'zx-sml'
import pkg from '../package.json' assert { type: 'json' }

const header = [
  '/*!',
  ` * ${pkg.name} version ${pkg.version}`,
  ` * Author: ${pkg.author}`,
  ` * Repository: ${pkg.repository}`,
  ` * Released on: ${formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss (g)')}`,
  ` */`,
]

function resolve(filePath) {
  return path.resolve(process.cwd(), filePath)
}

function addHeader(file) {
  const liens = fs.readFileSync(file, 'utf8').toString().split(EOL)
  fs.writeFileSync(file, [...header, ...liens].join(EOL))
}

function main(lib) {
  const distDir = resolve(`dist/${lib}`)
  fs.readdirSync(distDir).forEach((file) => {
    if (/\.js$/.test(file)) {
      addHeader(path.join(distDir, file))
    }
  })
}

main('utils')
main('docgen')
