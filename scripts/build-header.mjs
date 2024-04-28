/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/12 13:14:13 (GMT+0900)
 */
import path from 'node:path'
import { header } from '@zx-libs/header'

function resolve(filePath) {
  return path.resolve(process.cwd(), filePath)
}

header(resolve('dist'))
