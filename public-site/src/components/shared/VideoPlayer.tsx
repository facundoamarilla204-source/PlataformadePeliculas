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
    <div className="w-full flex flex-col gap-4 sm:gap-6">
      {/* Selector de servidores (Fuera del video, siempre visible y accesible en mobile) */}
      {streams.length > 0 && (
        <div className="flex flex-wrap items-center justify-start gap-2 sm:gap-3 w-full">
          {streams.map((stream, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStreamIndex(idx)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex-1 sm:flex-none text-center flex items-center justify-center gap-2 ${
                idx === activeStreamIndex 
                  ? 'bg-primary text-white shadow-[0_0_15px_var(--primary)] border border-primary' 
                  : 'bg-surface border border-surface-hover text-text-secondary hover:text-white hover:bg-surface-hover hover:border-white/20'
              }`}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0 bg-current opacity-80" />
              {stream.name || stream.provider?.charAt(0).toUpperCase() + stream.provider?.slice(1) || `Opción ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Contenedor del video */}
      <div className="w-full aspect-video relative bg-[#080B12] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center">
        {(!activeStream.type || activeStream.type === 'iframe' || typeof activeStream === 'string') ? (
          <iframe 
            src={activeStream.url || activeStream} 
            className="w-full h-full border-0 absolute inset-0" 
            allowFullScreen 
            {...{ webkitallowfullscreen: "true", mozallowfullscreen: "true" }}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            referrerPolicy="origin"
          ></iframe>
        ) : (
          <video
            ref={videoRef}
            controls
            className="w-full h-full border-0 bg-black outline-none absolute inset-0"
            crossOrigin="anonymous"
          />
        )}
      </div>
    </div>
  );
};
