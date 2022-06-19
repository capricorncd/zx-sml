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

```js
classNames({ active: true }, ['text-center'], 'flex')
// 'active text-center flex'
```

### createElement(tag, attrs?, children?)

create an element

- @param tag `string`
- @param attrs `Record<string, any>`
- @param children `string | HTMLElement | Node`

- @returns `HTMLElement`

### createUrlForGetRequest(url, params)

Create full URL for GET request

- @param url `string`
- @param params `Record<string, unknown>`

- @returns `string`

```js
createUrlForGetRequest('api/user', { age: 18 })
// 'api/user?age=18'
createUrlForGetRequest('api/user?class=a', { age: 18 })
// 'api/user?class=a&age=18'
```

### formatDate(date, format, langPackage?)

Date format,
please click [date-utils-2020](https://github.com/capricorncd/date-utils-2020) for details

- @param date `any`
- @param format `string`
- @param langPackage `ILangPackage`

- @returns `string`

```js
// timestamp
formatDate( 20210101 , 'yyyy-MM-dd hh:mm:ss') // 1970-01-01 14:36:50
// yyyyMMdd
formatDate('20210101', 'yyyy-MM-dd hh:mm:ss') // 2021-01-01 00:00:00
```

### formatKeys(obj, isCamelCase?)

Format the key of the object, using the `toSnakeCase` or `toCamelCase` method.

- @param obj `object {}`
- @param isCamelCase `boolean` Whether the key of the object uses camel-case or snake-case, default `false`

- @returns `object {}`

```js
formatObjKeys({lineHeight: 1.5}) // {'line-height': 1.5}
formatObjKeys({lineHeight: 1.5, childObj: {maxWidth: 100}})
// {'line-height': 1.5, 'child-obj': {'max-width': 100}}
formatObjKeys({'line-height': 1.5}, true) // {lineHeight: 1.5}
formatObjKeys({'line-height': 1.5, 'child-obj': {'max-width': 100}}, true)
// {lineHeight: 1.5, childObj: {maxWidth: 100}}
```

### getMaxZIndex(defaultZIndex?)

Get the max zIndex value in the document

- @param defaultZIndex `number` Return value when none of the DOM elements have `zIndex` set, default `100`

- @returns `number`

### getScrollableParents(el)

Get scrollable parent element

- @param el `HTMLElement`

- @returns `HTMLElement[]`

### getStyleValue(el, attr?, isNumber)

Get the value of `CSSStyleDeclaration` or `CSSStyleDeclaration[attr]`

- @param el `Node`
- @param attr `string` Arbitrary property key for CSSStyleDeclaration
- @param isNumber `boolean` whether to cast the returned property value to a numeric type

- @returns string | number | CSSStyleDeclaration | CSSRule | ((index: number) => string) | ((property: string, value: (string | null), priority?: (string | undefined)) => void) | null

### isArray(input)

determines whether the passed value is an Array

- @param input `T`

- @returns `boolean`

### isElement(el)

determines whether the el is an Element

- @param el `Element`

- @returns boolean

### isObject(input)

determines whether the passed value is an object

- @param input `T`

- @returns `boolean`

### joinUrl(...args)

format url,

- @param args `string[]`

- @returns `string`

```js
joinUrl('https://a.com/', '/news', 'detail/100001/?x=9')
// https://a.com/news/detail/100001?x=9
```

### slice(arrayLike, offset?)

Convert pseudo-array to array

- @param arrayLike `pseudo-array`
- @param offset `number` default `0`

- @returns `array T[]`

```js
slice({ length: 2, 0: 100, 1: 100 }) // [100, 100]
```

### splitValue(input)

Split an attribute value into number and suffix unit.
Returns `[0, '']` if the string does not start with a `number` or `-number`.

- @param input `string | number`

- @returns `[number, string]`

```js
splitValue('100px') // [100, 'px']
splitValue(100) // [100, '']
splitValue('2.5rem') // [2.5, 'rem']
splitValue('-2.5rem') // [-2.5, 'rem']
splitValue('50%') // [50, '%']
splitValue('1,600円') // [1600, '円']
splitValue(',1,600円') // [0, '']
splitValue('0000,600円') // [0, ',600円']
```

### toCamelCase(input, isFirstCapitalLetter?)

Format string as camel case

- @param input `string`
- @param isFirstCapitalLetter `boolean` whether to capitalize the first letter, default `false`

- @returns `string`

```js
toCamelCase('hello_world') // helloWorld
toCamelCase('hello-world') // helloWorld
toCamelCase('hello world') // helloWorld
toCamelCase('hello-world', true) // HelloWorld
```

### toDate(input)

Convert input to Date,
please click [date-utils-2020](https://github.com/capricorncd/date-utils-2020) for details

- @param input `any`

- @returns `Date | null`

### toNumber(input, isStrictMode?)

Convert any type to number.

- @param input `any`
- @param isStrictMode `boolean` Whether it is strict mode, default `false`

- @returns `number`

```js
toNumber('1.3rem') // 1.3
toNumber('1.3rem', true) // 0
toNumber('-12px') // -12
toNumber('-12px', true) // 0
toNumber('1,000,999Yan') // 1000999
toNumber('1,000,999', true) // 0
```

### toSnakeCase(input, connectSymbol?)

Format string as snake case

- @param input `string`
- @param connectSymbol `string` word connect symbol, default `-`

- @returns `string`

```js
toSnakeCase('helloWorld') // hello-world
toSnakeCase('HelloWorld') // hello-world
toSnakeCase('helloWorld', '_') // hello_world
toSnakeCase('helloWorld', ' ') // hello world
```

### toStrStyles(styles)

Convert styles object to string.
When the properties are the same, the previous object properties will be overwritten

- @param args `Array<object {} | CSSStyleDeclaration>`

- @returns `string`

```js
toStrStyles({'line-height': 1.5, width: '50%'})
// `line-height:1.5;width:'50%'`
toStrStyles({lineHeight: 1.5, width: '50%'})
// `line-height:1.5;width:50%`
toStrStyles({ lineHeight: 1.5, width: '50%' }, { 'line-height': '24px' })
// line-height:24px;width:50%
```

<!--METHOD_END-->

## License

[MIT](./LICENSE) License © 2022-Present [Capricorncd](https://github.com/capricorncd).
