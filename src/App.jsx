import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <a href="https://www.notion.so/Adiabatic-Process-2978ecb0c9a5807aba90cbaa223053dc?v=2528ecb0c9a5800a85a3000c6d9a863f&" className="block border-2 rounded-xl p-3 hover:shadow-lg/40 shadow-white hover:ring-1 text-left hover:cursor-pointer no-underline">
      
      <h1 className="text-3xl font-bold">Test Card</h1>
      <p className="py-2">This is more text</p>
      <div className="bg-amber-400 rounded inline-block">      
        <p className="text-black px-2">Tag</p>
      </div>
      
    </a>
  )
}

export default App
