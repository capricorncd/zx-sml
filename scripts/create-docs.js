/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 13:13:33 (GMT+0900)
 */
const fs = require('fs')
const os = require('os')
const path = require('path')

const END_OF_LINE = os.EOL
const BLANK_LINE = ''
const METHOD_START = '<!--METHOD_START-->'
const METHOD_END = '<!--METHOD_END-->'

function handleFile(filePath, data) {
  let isMethod = false
  let methodCount = 0
  let methodName = null
  let tempStr
  fs.readFileSync(filePath)
    .toString()
    .split(new RegExp(END_OF_LINE))
    .forEach((line) => {
      line = line.trim()
      // Start with method annotations
      if (line === '/**') {
        isMethod = true
        return
      } else if (line === '*/' && isMethod) {
        isMethod = false
        methodCount = 0
        methodName = null
        return
      }
      if (!isMethod) return
      // method name
      if (methodCount === 0 && /^\*\s?(.+)/.test(line)) {
        methodName = RegExp.$1
        data[methodName] = {
          desc: [],
          params: [],
          returns: [],
        }
      } else if (methodName && /^\*\s?(.+)/.test(line)) {
        tempStr = RegExp.$1
        if (tempStr.startsWith('@param')) {
          data[methodName].params.push(tempStr.replace('@param', '').trim())
        } else if (tempStr.startsWith('@returns')) {
          data[methodName].returns.push(tempStr.replace('@returns', '').trim())
        } else {
          data[methodName].desc.push(tempStr.replace('@description', '').trim())
        }
      }
      methodCount++
    })
}

function createMethodsDoc(data) {
  const lines = []
  let item
  Object.keys(data).forEach((method) => {
    item = data[method]
    lines.push(
      `### ${method}`,
      BLANK_LINE,
      item.desc.join(END_OF_LINE),
      BLANK_LINE,
      item.params.map((param) => `* @param ${param}`).join(END_OF_LINE),
      BLANK_LINE,
      item.returns.map((ret) => `* @returns ${ret}`).join(END_OF_LINE),
      BLANK_LINE
    )
  })
  return lines
}

/**
 * <!--METHOD_START-->
 * <!--METHOD_END-->
 * @param data
 */
function writeInReadmeFile(data) {
  const readmeFile = path.resolve(__dirname, '../README.md')
  const lines = []
  let isMethodStart = false
  fs.readFileSync(readmeFile, 'utf8')
    .toString()
    .split(new RegExp(END_OF_LINE))
    .forEach((line) => {
      if (line.trim() === METHOD_START) {
        isMethodStart = true
        lines.push(METHOD_START, ...createMethodsDoc(data), METHOD_END)
        return
      }
      if (line.trim() === METHOD_END) {
        isMethodStart = false
        return
      }
      if (!isMethodStart) lines.push(line)
    })
  fs.writeFileSync(readmeFile, lines.join(END_OF_LINE))
}

function main() {
  const data = {}
  // Read files from the src directory
  const srcDir = path.resolve(__dirname, '../src')
  fs.readdirSync(srcDir)
    .filter((file) => file !== 'index.ts')
    .forEach((file) => {
      if (/\w+\.ts$/.test(file)) {
        handleFile(path.join(srcDir, file), data)
      }
    })
  // README.md
  writeInReadmeFile(data)
}

main()
