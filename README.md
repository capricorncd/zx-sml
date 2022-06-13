# zx-sml

<p>
  <a href="https://npmcharts.com/compare/zx-sml?minimal=true"><img src="https://img.shields.io/npm/dm/zx-sml.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/zx-sml"><img src="https://img.shields.io/npm/v/zx-sml.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/zx-sml"><img src="https://img.shields.io/npm/l/zx-sml.svg?sanitize=true" alt="License"></a>
</p>

zx-sml are some static method libraries that I commonly use.

## Setup

### NPM Install

```shell
npm install zx-sml
```

### Yarn add

```shell
yarn add zx-sml
```

## Usage Example

```typescript
import { formatDate } from 'zx-sml'

formatDate('2020-12-04', 'yyyy/MM/dd W')
// 2020/12/04 Fri
```

## Methods

<!--METHOD_START-->

### $$(selector, doc?)

Get the DOM elements that matches selector

- @param selector `string`
- @param doc `Document | HTMLElement`

- @returns `HTMLElement[]`

### $(selector, doc?)

Get the DOM element that matches selector

- @param selector `string | HTMLElement`
- @param doc `Document | HTMLElement`

- @returns `HTMLElement | null`

### classNames(...args)

handle className

- @param args `string | [string] | { className1: true, className2: false }`

- @returns `string`

### createElement(tag, attrs?, innerHTML?)

create an element

- @param tag `string`
- @param attrs `Record<string, string>`
- @param innerHTML `string`

- @returns `HTMLElement`

### createUrlForGetRequest(url, params)

Create full URL for GET request

- @param url `string`
- @param params `Record<string, unknown>`

- @returns `string`

### formatDate(date, format, langPackage?)

Date format,
please click [date-utils-2020](https://github.com/capricorncd/date-utils-2020) for details

- @param date `any`
- @param format `string`
- @param langPackage `ILangPackage`

- @returns `string`

### isArray(input)

determines whether the passed value is an Array

- @param input `T`

- @returns `boolean`

### isObject(input)

determines whether the passed value is an object

- @param input `T`

- @returns `boolean`

### joinUrl(...args)

format url,

```js
joinUrl('https://a.com/', '/news', 'detail/100001/?x=9')
// https://a.com/news/detail/100001?x=9
```

- @param args `string[]`

- @returns `string`

### slice(arrayLike, offset?)

Convert pseudo-array to array

- @param arrayLike `pseudo-array`
- @param offset `number` default `0`

- @returns `array T[]`

### splitValue(input)

Split an attribute value into number and suffix unit.

```js
splitValue('100px') // [100, 'px']
splitValue(100) // [100, '']
splitValue('2.5rem') // [2.5, 'rem']
splitValue('-2.5rem') // [-2.5, 'rem']
splitValue('50%') // [50, '%']
```

- @param input `string | number`

- @returns `[number, string]`

### toCamelCase(input, isFirstCapitalLetter?)

Format string as camel case

```js
toCamelCase('hello_world') // helloWorld
toCamelCase('hello-world') // helloWorld
toCamelCase('hello world') // helloWorld
toCamelCase('hello-world', true) // HelloWorld
```

- @param input `string`
- @param isFirstCapitalLetter `boolean` whether to capitalize the first letter, default `false`

- @returns `string`

### toDate(input)

Convert input to Date,
please click [date-utils-2020](https://github.com/capricorncd/date-utils-2020) for details

- @param input `any`

- @returns `Date | null`

### toNumber(input, isStrictMode?)

Convert any type to number.

```js
toNumber('1.3rem') // 1.3
toNumber('1.3rem', true) // 0
toNumber('-12px') // -12
toNumber('-12px', true) // 0
toNumber('1,000,999Yan') // 1000999
toNumber('1,000,999', true) // 0
```

- @param input `any`
- @param isStrictMode `boolean` Whether it is strict mode, default `false`

- @returns `number`

### toSnakeCase(input, connectSymbol?)

Format string as snake case

```js
toSnakeCase('helloWorld') // hello-world
toSnakeCase('HelloWorld') // hello-world
toSnakeCase('helloWorld', '_') // hello_world
toSnakeCase('helloWorld', ' ') // hello world
```

- @param input `string`
- @param connectSymbol `string` word connect symbol, default `-`

- @returns `string`

<!--METHOD_END-->

## License

[MIT](./LICENSE) License © 2022-Present [Capricorncd](https://github.com/capricorncd).
