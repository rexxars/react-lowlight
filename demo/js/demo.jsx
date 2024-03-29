import { useState } from 'react'
import { createRoot } from 'react-dom/client'

import Lowlight from '../../src/Lowlight'
import '../../src/common.js'

import '../css/demo.css'
import 'highlight.js/styles/base16/solarized-dark.css'

import code from './code.js?raw'

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

const root = createRoot(document.getElementById('root'))
root.render(<App />)
