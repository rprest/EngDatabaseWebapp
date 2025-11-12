import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Page Title');
  const [pageID, setPageID] = useState('Page ID');
  const [pageURL, setPageURL] = useState('');
  const [pageIDclean, setPageID_clean] = useState('');

  const fetchRecentPage = async () => {
    const response = await fetch('http://localhost:5000/api/recentpage');
    const data = await response.json();
    setMessage(data.most_recent_title);
    setPageID(data.page_id);
    setPageURL(data.notion_url);
    setPageID_clean(data.page_id_clean);
  };

  return (
    <>
      <button onClick={fetchRecentPage} className="w-full mb-3 py-1 border-white text-white border-2 rounded-xl px-2 hover:shadow-md/40 shadow-white hover:ring-1 hover:cursor-pointer">Refresh</button>

      <a href="https://www.notion.so/Adiabatic-Process-2978ecb0c9a5807aba90cbaa223053dc?v=2528ecb0c9a5800a85a3000c6d9a863f&" className="block px-5 border-white text-white border-2 rounded-xl p-3 hover:shadow-lg/40 shadow-white hover:ring-1 text-left hover:cursor-pointer no-underline">
        
        <h1 className="text-5xl font-bold">{message}</h1>
        <p className="py-2">{pageID}</p>
        <div className="bg-amber-400 rounded inline-block">      
          <p className="text-black px-2">Tag</p>
        </div>
        
      </a>
    </>
  )
}

export default App
