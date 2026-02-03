import { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

const VideoPlayer = ({ src, poster, onHeartbeat }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);

    let controlsTimeout;

    // Heartbeat for tracking
    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                if (videoRef.current && onHeartbeat) {
                    onHeartbeat({
                        duration: 10,
                        position: videoRef.current.currentTime
                    });
                }
            }, 10000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const duration = videoRef.current.duration;
            setProgress((current / duration) * 100);
        }
    };

    const handleSeek = (e) => {
        if (videoRef.current) {
            const seekTime = (e.target.value / 100) * videoRef.current.duration;
            videoRef.current.currentTime = seekTime;
            setProgress(e.target.value);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e) => {
        if (videoRef.current) {
            const newVolume = parseFloat(e.target.value);
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            videoRef.current.parentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    }

    return (
        <div
            className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group shadow-2xl border border-white/10"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
            />

            {/* Overlay - Play Button */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer" onClick={togglePlay}>
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                </div>
            )}

            {/* Controls Bar */}
            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Progress Bar */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer mb-4 accent-purple-500 hover:h-2 transition-all"
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="text-white hover:text-purple-400 transition-colors">
                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>

                        <div className="flex items-center gap-2 group/volume">
                            <button onClick={toggleMute} className="text-white hover:text-purple-400 transition-colors">
                                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>
                    </div>

                    <button onClick={toggleFullscreen} className="text-white hover:text-purple-400 transition-colors">
                        {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
