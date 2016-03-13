# react-lowlight

Syntax highlighter for React, utilizing VDOM for efficient updates

* Thin wrapper on top of [lowlight](https://github.com/wooorm/lowlight) (Syntax highlighting using VDOM)
* Lowlight uses [highlight.js](https://github.com/isagalaev/highlight.js) under the hood, thus supports all the same syntaxes

## Installation

```
npm install --save react-lowlight highlight.js
```

You'll also need to provide the [highlight.js](https://github.com/isagalaev/highlight.js/blob/master/docs/css-classes-reference.rst#language-names-and-aliases) language definitions you want to use. We don't bundle these in order to not bloat the component with unused definitions.

## Usage

```js
import Lowlight from 'react-lowlight'

// Load any languages you want to use (see https://github.com/isagalaev/highlight.js/tree/master/src/languages)
import js from 'highlight.js/lib/languages/javascript'

// Then register them with lowlight
Lowlight.registerLanguage('js', js)

ReactDOM.render(
  <Lowlight
    language="js"
    value="/* Code to highlight */"
  />,
  document.getElementById('target')
)
```

Note that the `language` property is optional, but significantly increases the speed and reliability of rendering.

## Props

| Name        | Description                                                                            |
|:------------|:---------------------------------------------------------------------------------------|
| `className` | Class name for the outermost `pre` tag. Default: `lowlight`                            |
| `language`  | Language to use for syntax highlighting this value. Must be registered prior to usage. |
| `value`     | The code snippet to syntax highlight                                                   |
| `prefix`    | Class name prefix for individual node. Default: `hljs-`                                |
| `subset`    | Array of languages to limit the auto-detection to.                                     |

## License

MIT-licensed. See LICENSE.
