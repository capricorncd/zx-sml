# zx-sml

<p>
  <a href="https://npmcharts.com/compare/zx-sml?minimal=true"><img src="https://img.shields.io/npm/dm/zx-sml.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/zx-sml"><img src="https://img.shields.io/npm/v/zx-sml.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/zx-sml"><img src="https://img.shields.io/npm/l/zx-sml.svg?sanitize=true" alt="License"></a>
</p>

zx-sml are some static method libraries that I commonly use.

## Methods

<!--METHOD_START-->

### isArray(input)

determines whether the passed value is an Array

- @param input T

- @returns boolean

### isObject(input)

determines whether the passed value is an object

- @param input T

- @returns boolean

### formatDate(date, format, langPackage?)

Date format,
please click [date-utils-2020](https://github.com/capricorncd/date-utils-2020) for details

- @param date T
- @param format string
- @param langPackage ILangPackage

- @returns string

### toDate(input)

Convert input to Date,
please click [date-utils-2020](https://github.com/capricorncd/date-utils-2020) for details

- @param input any

- @returns Date | null

### $(selector, doc?)

Get the DOM element that matches selector

- @param selector string | HTMLElement
- @param doc Document | HTMLElement

- @returns HTMLElement | null

### $$(selector, doc?)

Get the DOM elements that matches selector

- @param selector string
- @param doc Document | HTMLElement

- @returns HTMLElement[]

### createElement(tag, attrs?, innerHTML?)

create element

- @param tag string
- @param attrs Record<string, string>
- @param innerHTML string

- @returns HTMLElement

### createUrlForGetRequest(url, params)

Create full URL for GET request

- @param url string
- @param params Record<string, unknown>

- @returns string

### toSnakeCase(input, connectSymbol?)

`toSnakeCase(helloWorld)` => `hello-world`
HelloWorld => hello-world
helloWorld => hello_world
helloWorld => hello world

- @param input string
- @param connectSymbol string word connect symbol, default `-`

- @returns string

### toCamelCase(input, isFirstCapitalLetter?)

hello_world => helloWorld
hello-world => helloWorld
hello world => helloWorld
when isFirstCapitalLetter is true
hello world => HelloWorld

- @param input string
- @param isFirstCapitalLetter boolean whether to capitalize the first letter, default `false`

- @returns string

### toNumber(input)

Convert any type to number.

- @param input any

- @returns number

### splitValue(input)

'100px' => [100, 'px']
100 => [100, '']
'2.5rem' => [2.5, 'rem']

- @param input string | number

- @returns [number, string]

### classNames(...args)

handle className

- @param args string | [string] | { className1: true, className2: false }

- @returns string

### joinUrl(...args)

format url

- @param args string[] 'https://a.com/', '/news', 'detail/100001/?x=9'

- @returns 'https://a.com/news/detail/100001?x=9'

### slice(arrayLike, offset?)

Convert pseudo-array to array

- @param arrayLike pseudo-array
- @param offset number default `0`

- @returns array T[]

<!--METHOD_END-->

## License

zx-sml is [MIT licensed](./LICENSE).
