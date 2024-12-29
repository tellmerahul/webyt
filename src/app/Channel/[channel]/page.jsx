"use client";

// import { useAuth } from "@/components/auth";
import React, { useEffect, useState, useCallback, useMemo } from "react";

export default function Page() {
  const [setPlaylistData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [mainVideo, setMainVideo] = useState(null);
  const [channelInfo, setChannelInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");
  async function fetchID(name) {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_FULL_BASE_DOMAIN}/api/user?name=${name}`;
      console.log("Fetching from URL:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "GET",
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (data.success) {
        console.log("Channel Id:", data.data.channelId);
        setId(data.data.channelId);
        return data.message;
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Full error:", err);
      alert(`Error checking user in db: ${err.message}`);
    }
  }

  async function fetchID(name) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FULL_BASE_DOMAIN}/api/user?name=${name}`, {
        method: "GET",
      });
      const res = await response.json();
      if (res.success) {
        console.log("channel Id: ",res.data.channelId);
        setId(res.data.channelId);
        return res.message;
      } else {
        alert(res.message);
        return;
      }
    } catch (err) {
      alert(`Error checking user in db: ${err.message}`);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const url = window.location.hostname;
      await fetchID(url.split(".")[0]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchChannelInfo = async (channelId) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id=${channelId}&key=${process.env.NEXT_PUBLIC_YT_SECRET}`
        );
        const channelData = await response.json();
        setChannelInfo(channelData.items[0]?.snippet);
      } catch (error) {
        console.log("Error fetching channel info:", error.message);
      }
    };

    const fetchPlaylistVideos = async (channelId) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${process.env.NEXT_PUBLIC_YT_SECRET}`
        );
        const channelData = await response.json();
        const uploadsPlaylistId =
          channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;

        if (uploadsPlaylistId) {
          const playlistResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${process.env.NEXT_PUBLIC_YT_SECRET}`
          );
          const playlistData = await playlistResponse.json();

          const latestVideoId = playlistData.items[0]?.snippet?.resourceId?.videoId;
          setPlaylistData(playlistData);
          setVideos(playlistData.items.slice(1));

          if (latestVideoId) {
            const videoResponse = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${latestVideoId}&key=${process.env.NEXT_PUBLIC_YT_SECRET}`
            );
            const videoData = await videoResponse.json();
            setMainVideo(videoData.items[0]);
          }
        }
      } catch (error) {
        console.log("Error fetching playlist:", error.message);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchChannelInfo(id);
    fetchPlaylistVideos(id);
  }, [id]);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const debouncedSearch = useCallback(debounce(setDebouncedSearchTerm, 500), []);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const filteredVideos = useMemo(() => {
    return videos.filter((video) =>
      video.snippet.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [debouncedSearchTerm, videos]);

  const handleVideoClick = (videoId) => {
    const selectedVideo = videos.find(
      (video) => video.snippet.resourceId.videoId === videoId
    );
    setMainVideo(selectedVideo || null);
  };

  if (!id) return <h1 className="mt-16 mx-auto text-white">Channel Not Found</h1>;
  return (
    <div className="min-h-screen bg-gray-100">
      {loading ? (
        <div className="flex space-x-2 justify-center items-center mt-16 bg-white h-screen dark:invert">
          <span className="sr-only">Loading...</span>
          <div className="lg:h-6 lg:w-6 h-4 w-4 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="lg:h-6 lg:w-6 h-4 w-4 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="lg:h-6 lg:w-6 h-4 w-4 bg-black rounded-full animate-bounce"></div>
        </div>
      ) : (

        <>
          <div className="min-h-screen bg-gray-100">
            <nav className="sticky top-0 z-50 bg-white shadow-lg py-4">
              <div className="container mx-auto px-0 sm:px-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  {channelInfo?.thumbnails?.default?.url && (
                    <img
                      src={channelInfo.thumbnails.default.url}
                      alt="Channel Logo"
                      className="h-10 w-10 rounded-full"
                    />
                  )}
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                    {channelInfo?.title || "Channel Name"}
                  </h1>
                </div>

                <div className="w-full sm:max-w-xs">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search videos..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </nav>

            <div className="container mx-auto py-2 flex flex-col lg:flex-row gap-8 sm:mx-1">
              <div className="lg:w-3/4 flex flex-col gap-6 w-full sm:w-full">
                {mainVideo ? (
                  <div className="bg-white p-0 sm:p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">
                      {mainVideo.snippet.title}
                    </h2>
                    <iframe
                      className="w-full h-[490px] rounded-lg shadow-md"
                      src={`https://www.youtube.com/embed/${mainVideo.snippet.resourceId?.videoId || mainVideo.id}`}
                      frameBorder="0"
                      allowFullScreen
                      title={mainVideo.snippet.title}
                    ></iframe>
                    <p className="mt-4 text-gray-700">{mainVideo.snippet.description}</p>
                    <div className="mt-4 text-sm text-gray-500">
                      <strong>Views:</strong> {mainVideo.statistics?.viewCount || 'N/A'}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <p className="text-lg text-gray-500">No video available</p>
                  </div>
                )}

                <div className="bg-white p-0 sm:p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Playlist</h3>
                  {filteredVideos.length > 0 &&
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredVideos.map((video) => (
                        <div
                          key={video.snippet.resourceId.videoId}
                          className="bg-white rounded-lg shadow-md cursor-pointer"
                          onClick={() => handleVideoClick(video.snippet.resourceId.videoId)}
                        >
                          <iframe
                            className="w-full aspect-video rounded-md"
                            src={`https://www.youtube.com/embed/${video.snippet.resourceId.videoId}`}
                            frameBorder="0"
                            allowFullScreen
                            title={video.snippet.title}
                          ></iframe>
                          <h4 className="mt-2 px-2 text-lg font-semibold">{video.snippet.title}</h4>
                          <p className="text-sm px-2 text-gray-500">
                            {video.snippet.description.substring(0, 80)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  }
                </div>
              </div>

              <div className="lg:w-1/4 h-screen sticky top-0 overflow-y-auto">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Other Videos</h3>
                {filteredVideos.length > 0 ? (
                  <div className="space-y-6">
                    {filteredVideos.map((video) => (
                      <div key={video.snippet.resourceId.videoId} className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                        onClick={() => handleVideoClick(video.snippet.resourceId.videoId, true)}>
                        <iframe
                          className="w-full aspect-video rounded-md"
                          src={`https://www.youtube.com/embed/${video.snippet.resourceId.videoId}`}
                          frameBorder="0"
                          allowFullScreen
                          title={video.snippet.title}
                        ></iframe>
                        <h4 className="mt-2 text-lg font-semibold">{video.snippet.title}</h4>
                        <p className="text-sm text-gray-500">
                          {video.snippet.description.substring(0, 80)}...
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-lg text-gray-500">No videos match your search</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
