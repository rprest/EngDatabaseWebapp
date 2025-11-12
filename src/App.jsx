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
  const [NeedToReview, setNeedToReview] = useState(false);

  const fetchRecentPage = async () => {
    const response = await fetch('http://localhost:5000/api/recentpage');
    const data = await response.json();
    setMessage(data.most_recent_title);
    setPageID(data.page_id);
    setPageURL(data.notion_url);
    setPageID_clean(data.page_id_clean);
    setNeedToReview(data.checkbox_properties["Need to Review"]);
  };

  return (
    <>
      <button onClick={fetchRecentPage} className="w-full mb-3 py-1 border-white text-white border-2 rounded-xl px-2 hover:shadow-md/40 shadow-white hover:ring-1 hover:cursor-pointer">Refresh</button>

      <a href={pageURL} className="block px-5 border-white text-white border-2 rounded-xl p-3 hover:shadow-lg/40 shadow-white hover:ring-1 text-left hover:cursor-pointer no-underline">
        
        <h1 className="text-5xl font-bold">{message}</h1>
        <p className="py-2">{pageID}</p>
        <div className={`${NeedToReview ? 'bg-red-900' : 'bg-green-900'} rounded inline-block`}>      
          <p className="text-white px-4">{NeedToReview ? 'Needs Review' : 'No Need For Review'}</p>
        </div>
        
      </a>
    </>
  )
}

export default App
