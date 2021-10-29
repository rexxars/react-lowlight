import { useState } from 'react'
import ReactDOM from 'react-dom'

import Lowlight from '../../src/Lowlight'
import javascript from 'highlight.js/lib/languages/javascript'

import '../css/demo.css'
import 'highlight.js/styles/base16/solarized-dark.css'

import code from './code.js?raw'

Lowlight.registerLanguage('js', javascript)

const App = () => {
  const [value, setValue] = useState(code)

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <div className='container'>
      <div className='input'>
        <h1>Input</h1>
        <textarea value={value} onChange={handleChange} />
      </div>
      <div className='output'>
        <h1>Output</h1>
        <Lowlight language='js' value={value} />
      </div>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
