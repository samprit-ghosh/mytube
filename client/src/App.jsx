import { useEffect, useState, useRef } from 'react';

function App() {
  const [videos, setVideos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const iframeRef = useRef(null);

  useEffect(() => {
    fetch('https://mytube-fl0o.onrender.com/videos')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setVideos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Function to control YouTube player
  const sendCommandToPlayer = (command) => {
    if (iframeRef.current) {
      const message = JSON.stringify({
        event: 'command',
        func: command,
        args: ''
      });
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  };

  // Handle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      sendCommandToPlayer('pauseVideo');
    } else {
      sendCommandToPlayer('playVideo');
    }
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
<div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
  <div className="flex flex-col items-center">
    {/* Circle with play button in center */}
    <div className="relative w-24 h-24">
      {/* Spinning border */}
      <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-blue-500/50"></div>
      
      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 text-blue-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>

    {/* Loading text */}
    <p className="mt-6 text-white text-xl font-semibold animate-pulse tracking-wide">
      Loading videos...
    </p>
  </div>
</div>


    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md text-center">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-white text-xl font-bold mb-2">Error Loading Content</h2>
          <p className="text-red-200">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // When a video is selected show the player
  if (selected) {
    const videoId = selected.id;
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&modestbranding=1&rel=0`;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        {/* Header */}
        <header className="bg-black/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSelected(null)}
              className="flex items-center text-gray-300 hover:text-white transition-colors group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Videos
            </button>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              StreamVid
            </h1>
            <div className="w-5"></div>
          </div>
        </header>

        {/* Video Player Section */}
        <main className="w-full mx-auto px-4 py-8">
          <div className="bg-black rounded-xl overflow-hidden shadow-2xl shadow-blue-500/10 mb-6">
            <div className="aspect-video relative">
              <iframe
                ref={iframeRef}
                className="w-full h-full"
                src={embedUrl}
                title={selected.snippet.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
                id="ytplayer"
              ></iframe>
            </div>
          </div>

          {/* Play/Pause Controls */}
          <div className="flex justify-center mb-6">
            <button
              onClick={togglePlayPause}
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {isPlaying ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play
                </>
              )}
            </button>
          </div>

          {/* Video Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">{selected.snippet.title}</h2>
            <div className="flex items-center text-gray-400 mb-4">
              <span className="mr-4">{selected.snippet.channelTitle}</span>
             
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4 mb-6">
              <button className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                Like
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z" />
                </svg>
                Save
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                </svg>
                Share
              </button>
            </div>
            
            {/* Description */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-300 text-sm">
                {selected.snippet.description || "No description available for this video."}
              </p>
            </div>
          </div>

          {/* Comments Section */}
          
        </main>
      </div>
    );
  }

  // Homepage - List view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <div className="w-full mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            StreamVid
          </h1>
          <p className="text-gray-400 text-sm mt-1">Your curated collection of videos</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Videos</h2>
          <div className="flex items-center space-x-2 text-gray-400">
            <span>Sort by:</span>
            <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white">
              <option>Most Popular</option>
              <option>Newest First</option>
              <option>A-Z</option>
            </select>
          </div>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📹</div>
            <h3 className="text-xl font-semibold mb-2">No videos available</h3>
            <p className="text-gray-400">Check back later for new content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((v) => (
              <div
                key={v.id}
                onClick={() => setSelected(v)}
                className="group cursor-pointer bg-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="relative">
                  <img
                    src={v.snippet.thumbnails.medium.url}
                    alt={v.snippet.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
              
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2 mb-1 group-hover:text-blue-300 transition-colors">
                    {v.snippet.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">{v.snippet.channelTitle}</p>
                  <div className="flex items-center text-xs text-gray-500">
                
                
                  
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2023 StreamVid. All rights reserved.</p>
          <p className="mt-2">This is a demo application for educational purposes.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;