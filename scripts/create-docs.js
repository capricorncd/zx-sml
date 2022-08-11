/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 13:13:33 (GMT+0900)
 */
const fs = require('fs')
const { EOL } = require('os')
const path = require('path')
const { outputFile } = require('../nodejs')

const METHOD_START = '<!--METHOD_START-->'
const METHOD_END = '<!--METHOD_END-->'

/**
 * <!--METHOD_START-->
 * <!--METHOD_END-->
 * @param inputLines
 */
function writeInReadmeFile(inputLines) {
  const readmeFile = path.resolve(__dirname, '../README.md')
  const lines = []
  let isMethodStart = false
  fs.readFileSync(readmeFile, 'utf8')
    .toString()
    .split(new RegExp(EOL))
    .forEach((line) => {
      if (line.trim() === METHOD_START) {
        isMethodStart = true
        lines.push(METHOD_START, ...inputLines, METHOD_END)
        return
      }
      if (line.trim() === METHOD_END) {
        isMethodStart = false
        return
      }
      if (!isMethodStart) lines.push(line)
    })
  fs.writeFileSync(readmeFile, lines.join(EOL))
}

const outputFileOptions = {
  endLines: [
    '',
    '## License',
    '',
    'MIT License © 2022-Present [Capricorncd](https://github.com/capricorncd).',
  ],
}

function main() {
  // zx-sml default docs
  const srcDir = path.resolve(__dirname, '../src')
  const { lines } = outputFile(srcDir)
  // README.md
  writeInReadmeFile(lines)

  // zx-sml/nodejs docs
  const input = path.resolve(__dirname, '../nodejs')
  outputFile(
    input,
    path.resolve(__dirname, '../nodejs/README.md'),
    outputFileOptions
  )
}

main()
