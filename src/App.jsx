import { useEffect, useState, useCallback } from 'react'
import './App.css'
import NotionPageRenderer from './NotionPageRenderer'

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Page Title');
  const [pageID, setPageID] = useState('Page ID');
  const [pageURL, setPageURL] = useState('');
  const [pageIDclean, setPageID_clean] = useState('');
  const [NeedToReview, setNeedToReview] = useState(false);
  const [sidebarState, setSidebarState] = useState(false);
  const [notionBlocks, setNotionBlocks] = useState([]);

  const [relationProperty, setRelationProperty] = useState('');
  const [subitemIDs, setSubitemIDs] = useState([]);
  const [subitemCount, setSubitemCount] = useState(0);



  const NotionPageRender = useCallback(async () => {
    if (!pageIDclean) return;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notion/blocks/${pageIDclean}`);
    const data = await response.json();
    // console.log(data);
    setNotionBlocks(data.results);
  }, [pageIDclean]);

  const fetchSubitems = useCallback(async () => {
    if (!pageIDclean) return;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notion/subitems/${pageIDclean}`);
    const data = await response.json();
    setRelationProperty(data.relation_property);
    setSubitemIDs(data.subitem_ids);
    setSubitemCount(data.subitem_count);
  }, [pageIDclean]);

  const fetchRecentPage = useCallback(async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recentpage`);
    const data = await response.json();
    setMessage(data.most_recent_title);
    setPageID(data.page_id);
    setPageURL(data.notion_url);
    setPageID_clean(data.page_id_clean);
    setNeedToReview(data.checkbox_properties["Need to Review"]);
  }, []);

  // useEffect(() => {
  //   fetchRecentPage();
  //   const interval = setInterval(fetchRecentPage, 5000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [fetchRecentPage])

  useEffect(() => {
    if (pageIDclean) {
      NotionPageRender();
    }
  }, [pageIDclean])

  useEffect(() => {
    if (pageIDclean) {
      fetchSubitems();
    }
  }, [pageIDclean])

  useEffect(() => {
    if (!pageIDclean) return;

    const interval = setInterval(() => {
      fetchRecentPage();
      NotionPageRender();
      fetchSubitems();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [pageIDclean, NotionPageRender, fetchSubitems])

  return (
    <div className={sidebarState ? "flex h-screen" : "flex h-screen"}>
      <div className={sidebarState ? "flex-1 p-4 flex items-start justify-center" : "w-md mx-auto p-4"}>
        <div className="w-md pt-5">
          <button onClick={NotionPageRender} className="w-full mb-3 py-1 bg-[#53361F] text-white rounded-xl px-2 hover:shadow-md/40 shadow-[#53361F] hover:cursor-pointer">Refresh</button>
          <button onClick={fetchSubitems} className="w-full mb-3 py-1 bg-[#53361F] text-white rounded-xl px-2 hover:shadow-md/40 shadow-[#53361F] hover:cursor-pointer">Fetch Subitems</button>


          <button
            onClick={() => setSidebarState(!sidebarState)}
            className="w-full mb-3 py-1 bg-[#53361F] text-white rounded-xl px-2 hover:shadow-md/40 shadow-[#53361F] hover:cursor-pointer"
            >
              {sidebarState ? 'Close Sideview' : 'Open Sideview'}
            </button>

          <a href={pageURL} target="_blank" className="block px-5 bg-[#233850] text-white rounded-xl p-3 hover:shadow-lg/40 shadow-[#233850] text-left hover:cursor-pointer no-underline">
            
            <h1 className="text-5xl font-bold mb-5">{message}</h1>
            {/* <p className="py-2">{pageID}</p> */}
            <div className={`${NeedToReview ? 'bg-[#5e1f15]' : 'bg-[#10381c]'} rounded inline-block pb-1`}>      
              <p className="text-white px-4">{NeedToReview ? 'Needs Review' : 'No Need For Review'}</p>
            </div>
            
          </a>

          <div className="text-white mt-3">
            <p className="mb-2">{relationProperty}</p>
            <p className="mb-2">Count: {subitemCount}</p>
            
            {subitemIDs && subitemIDs.length > 0 ? (
              <div className="space-y-2">
                {subitemIDs.map((subitemID, index) => (
                  <div 
                    key={subitemID} 
                    className="bg-[#233850] rounded-xl p-3 hover:shadow-lg/40 shadow-[#233850]"
                  >
                    <p className="text-sm text-gray-400">Subitem {index + 1}</p>
                    <p className="font-semibold">{subitemID}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No subitems</p>
            )}
          </div>
          

        </div>
      </div>

      <div
        className={`bg-[#191919] border-l-4 border-neutral-300 transition-all duration-300 ease-in-out overflow-y-auto ${
          sidebarState ? 'w-1/2 p-4' : 'w-0 p-0 border-0 overflow-hidden'
        }`}
      >
        <div className={`${sidebarState ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>

          {notionBlocks.length > 0 ? (
            <NotionPageRenderer blocks={notionBlocks} />
          ) : (
            <div className="text-white">Click Here</div>
          
          )}

          {/* <iframe src={`https://working-ethernet-639.notion.site/ebd/${pageIDclean}`} frameborder="0" loading="lazy" className="w-full h-full"  /> */}
        </div>
      </div>

    </div>
  )
}

export default App
