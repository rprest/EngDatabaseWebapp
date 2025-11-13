import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Page Title');
  const [pageID, setPageID] = useState('Page ID');
  const [pageURL, setPageURL] = useState('');
  const [pageIDclean, setPageID_clean] = useState('');
  const [NeedToReview, setNeedToReview] = useState(false);
  const [sidebarState, setSidebarState] = useState(false);

  const fetchRecentPage = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recentpage`);
    const data = await response.json();
    setMessage(data.most_recent_title);
    setPageID(data.page_id);
    setPageURL(data.notion_url);
    setPageID_clean(data.page_id_clean);
    setNeedToReview(data.checkbox_properties["Need to Review"]);
  };

  useEffect(() => {
    fetchRecentPage();
    const interval = setInterval(fetchRecentPage, 5000);
    return () => clearInterval(interval);
  }, [])

  return (
    <div className={sidebarState ? "flex h-screen" : "flex h-screen"}>
      <div className={sidebarState ? "flex-1 p-4 flex items-start justify-center" : "w-md mx-auto p-4"}>
        <div className="w-md pt-5">
          <button onClick={fetchRecentPage} className="w-full mb-3 py-1 bg-[#53361F] text-white rounded-xl px-2 hover:shadow-md/40 shadow-[#53361F] hover:cursor-pointer">Refresh</button>

          <button
            onClick={() => setSidebarState(!sidebarState)}
            className="w-full mb-3 py-1 bg-[#53361F] text-white rounded-xl px-2 hover:shadow-md/40 shadow-[#53361F] hover:cursor-pointer"
            >
              {sidebarState ? 'Close Sideview test' : 'Open Sideview'}
            </button>

          <a href={pageURL} target="_blank" className="block px-5 bg-[#233850] text-white rounded-xl p-3 hover:shadow-lg/40 shadow-[#233850] text-left hover:cursor-pointer no-underline">
            
            <h1 className="text-5xl font-bold">{message}</h1>
            <p className="py-2">{pageID}</p>
            <div className={`${NeedToReview ? 'bg-red-900' : 'bg-green-900'} rounded inline-block`}>      
              <p className="text-white px-4">{NeedToReview ? 'Needs Review' : 'No Need For Review'}</p>
            </div>
            
          </a>
        </div>
      </div>

      <div 
        className={`bg-[#191919] p-4 border-l-4 border-neutral-300 shadow-xl/70 shadow-white transition-all duration-300 ease-in-out ${
          sidebarState ? 'w-1/2' : 'w-0 p-0 border-0 overflow-hidden'
        }`}
      >
        <div className={`${sidebarState ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 h-full`}>
          <iframe src={`https://working-ethernet-639.notion.site/ebd/${pageIDclean}`} frameborder="0" loading="lazy" className="w-full h-full"  />
        </div>
      </div>

    </div>
  )
}

export default App
