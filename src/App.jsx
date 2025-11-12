import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="border-2 rounded-xl p-3 hover:shadow-lg/40 shadow-white hover:ring-1 text-left hover:cursor-pointer">
      
      <h1 className="text-3xl font-bold">Test Card</h1>
      <p className="p-2">This is more text</p>
      <div className="bg-amber-400 rounded inline-block">      
        <p className="text-black px-2">Tag</p>
      </div>
      
    </div>
  )
}

export default App
