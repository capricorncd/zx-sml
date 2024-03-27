/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 13:13:33 (GMT+0900)
 */
import fs from 'node:fs'
import { EOL } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { outputFile, writeFileSync } from 'zx-sml/docgen'

const METHOD_START = '<!--METHOD_START-->'
const METHOD_END = '<!--METHOD_END-->'

function resolve(filePath) {
  return path.resolve(process.cwd(), filePath)
}

/**
 * <!--METHOD_START-->
 * <!--METHOD_END-->
 * @param inputLines
 */
function writeInReadmeFile(inputLines) {
  const readmeFile = resolve('README.md')
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

const getCommentsDataOptions = {
  // disableKeySorting: true,
  // isExtractCodeFromComments: true,
  tableAlign: {
    Required: 'center',
  },
}

const outputFileOptions = {
  ...getCommentsDataOptions,
  lines: {
    // start: [
    //   'start ============='
    // ],
    end: [
      '',
      '## License',
      '',
      'MIT License © 2022-Present [Capricorncd](https://github.com/capricorncd).',
    ],
    //   afterType: {
    //     document: 'afterType document ------',
    //     method: ['afterType method', 'method==='],
    //     type: 'afterType ty[e'
    //   },
    //   afterTitle: {
    //     document: 'afterTitle document ------',
    //     method: ['afterTitle method', 'method==='],
    //     type: 'afterTitle type'
    //   },
  },
  alias: {
    // requiredValues: ['x', 'o'],
    // requiredValues: {
    //    0: 'x',
    //    1: 'o',
    //   //  method: ['no', 'yes'],
    //    type: ['可选', '必须'],
    // },
    // tableHead: {
    //   Param: '参数',
    //   Prop: '属性',
    //   Types: '类型',
    //   Required: '必须',
    //   Description: '描述'
    // },
    //   sourceCodeSummary: '代码'
    types: {
      // method: '函数',
      // constant: '常量'
    },
  },
  typeWithAuto: true,
  // // outputDocTypesAndOrder: ['document', 'constant', 'type', 'method'],
  handlers: {
    // constant: (arr, options, lines) => {
    //   if (isValidArray(arr)) {
    //     lines.push('## Constant', '')
    //     const linesAfterType = options.lines?.afterType?.['constant']
    //     if (isValidArray(linesAfterType)) {
    //       lines.push(...linesAfterType)
    //     }
    //     arr.forEach((item) => {
    //       lines.push(`### ${item.fullName}`, '', ...item.desc, '')
    //       if (isValidArray(item.codes)) {
    //         lines.push('```ts', ...item.codes, '```', '')
    //       }
    //     })
    //   }
    //   // console.log(arr, options, lines)
    // },
  },
  // // GetCommentsDataOptions
  // expendTypesHandlers: {
  //   // constant: (data, line) => {
  //   //   console.log(line)
  //   // },
  // },
  // codeTypes: [],
}

function main() {
  // zx-sml default docs
  const srcDir = resolve('libs/utils/src')
  const { lines } = outputFile(srcDir, getCommentsDataOptions)
  // README.md
  writeInReadmeFile(lines)

  // generate zx-sml/docgen docs
  const input = resolve('libs/docgen/src')
  const { lines: docGenLines } = outputFile(
    input,
    resolve('docs/docgen.md'),
    outputFileOptions
  )

  writeFileSync(resolve('libs/docgen/README.md'), docGenLines)
}

main()
