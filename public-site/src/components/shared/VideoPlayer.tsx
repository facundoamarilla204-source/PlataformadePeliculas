"use client";

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  streamingUrl: any; // string, o object, o array de objects
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ streamingUrl }) => {
  const streams = Array.isArray(streamingUrl) ? streamingUrl : [streamingUrl].filter(Boolean);
  
  const [activeStreamIndex, setActiveStreamIndex] = useState(0);
  const activeStream = streams[activeStreamIndex];
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let hls: Hls | null = null;
    const video = videoRef.current;
    
    const cleanup = () => {
      if (hls) {
        hls.destroy();
        hls = null;
      }
      if (video) {
        video.src = '';
        video.removeAttribute('src');
      }
    };

    if (activeStream && (activeStream.type === 'hls' || activeStream.provider === 'goodstream')) {
      const hlsUrl = activeStream.url || activeStream.hls_url;
      if (!video) return cleanup;

      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsUrl;
      }
    }
    
    return cleanup;
  }, [activeStream]);

  if (streams.length === 0) return null;

  return (
    <div className="w-full h-full flex flex-col relative group">
      {/* Selector de servidores (visible on hover or always if wanted, let's keep it visible at top) */}
      {streams.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 p-2 bg-black/60 backdrop-blur-md rounded-full shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {streams.map((stream, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStreamIndex(idx)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                idx === activeStreamIndex 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                  : 'text-neutral-300 hover:bg-white/10'
              }`}
            >
              {stream.name || stream.provider?.charAt(0).toUpperCase() + stream.provider?.slice(1) || `Servidor ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Contenedor del video */}
      <div className="w-full h-full absolute inset-0 bg-black flex items-center justify-center">
        {(!activeStream.type || activeStream.type === 'iframe' || typeof activeStream === 'string') ? (
          <iframe 
            src={activeStream.url || activeStream} 
            className="w-full h-full border-0" 
            allowFullScreen 
            allow="autoplay; fullscreen"
            referrerPolicy="origin"
          ></iframe>
        ) : (
          <video
            ref={videoRef}
            controls
            className="w-full h-full border-0 bg-black outline-none"
            crossOrigin="anonymous"
          />
        )}
      </div>
    </div>
  );
};
