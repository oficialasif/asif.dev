'use client';

import { Play, Pause, SkipForward, SkipBack, Repeat, Repeat1, Shuffle, Volume2, VolumeX, List } from "lucide-react";
import { useState, useRef, useEffect } from 'react';

interface Track {
    id: number;
    title: string;
    artist: string;
    cover: string;
    url: string;
}

const playlist: Track[] = [
    {
        id: 1,
        title: "Chill Vibes",
        artist: "Lo-Fi Beats",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        id: 2,
        title: "Summer Days",
        artist: "Acoustic Dreams",
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        id: 3,
        title: "Night Drive",
        artist: "Synthwave",
        cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        id: 4,
        title: "Morning Coffee",
        artist: "Jazz Cafe",
        cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
        id: 5,
        title: "Sunset Beach",
        artist: "Tropical House",
        cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    },
    {
        id: 6,
        title: "Urban Rhythm",
        artist: "Hip Hop Beats",
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
    },
    {
        id: 7,
        title: "Peaceful Mind",
        artist: "Meditation Music",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
    },
    {
        id: 8,
        title: "Electric Dreams",
        artist: "Electronic Vibes",
        cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    }
];

export const SpotifyCard = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [loopMode, setLoopMode] = useState<'off' | 'one' | 'all'>('off');
    const [isShuffled, setIsShuffled] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    const currentTrack = playlist[currentTrackIndex];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const playTrack = (index: number) => {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
        setTimeout(() => {
            audioRef.current?.play();
        }, 100);
    };

    const nextTrack = () => {
        if (isShuffled) {
            const randomIndex = Math.floor(Math.random() * playlist.length);
            setCurrentTrackIndex(randomIndex);
        } else {
            setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
        }
    };

    const previousTrack = () => {
        if (currentTime > 3) {
            audioRef.current!.currentTime = 0;
        } else {
            setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleEnded = () => {
        if (loopMode === 'one') {
            audioRef.current?.play();
        } else if (loopMode === 'all') {
            nextTrack();
        } else {
            setIsPlaying(false);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        setIsMuted(vol === 0);
    };

    const toggleMute = () => {
        if (isMuted) {
            setVolume(0.7);
            setIsMuted(false);
        } else {
            setVolume(0);
            setIsMuted(true);
        }
    };

    const toggleLoop = () => {
        setLoopMode((prev) => {
            if (prev === 'off') return 'all';
            if (prev === 'all') return 'one';
            return 'off';
        });
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div
            className="card-with-glow h-full relative perspective-1000 overflow-hidden rounded-2xl"
            onDoubleClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front Side - Horizontal Controller */}
                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-900/40 to-purple-950/60 rounded-2xl border-2 border-purple-600/50 p-3 sm:p-4 flex flex-col overflow-hidden">
                    <audio
                        ref={audioRef}
                        src={currentTrack.url}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={handleEnded}
                    />

                    {/* Progress Bar at Top */}
                    <div className="mb-3 sm:mb-4">
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-1.5 bg-purple-800/30 rounded-lg appearance-none cursor-pointer slider"
                        />
                    </div>

                    {/* Horizontal Controls */}
                    <div className="flex-1 flex items-center justify-between px-1 sm:px-2">
                        {/* Menu Icon - Opens Playlist */}
                        <button
                            onClick={() => setIsFlipped(true)}
                            className="p-2 sm:p-3 text-purple-300 hover:text-white transition-colors"
                            title="View playlist"
                        >
                            <List className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>

                        {/* Previous Button */}
                        <button
                            onClick={previousTrack}
                            className="p-2 sm:p-3 text-purple-300 hover:text-white transition-colors"
                        >
                            <SkipBack className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" />
                        </button>

                        {/* Play/Pause Button (Large, Center) */}
                        <button
                            onClick={togglePlay}
                            className="p-2.5 sm:p-3 bg-white hover:bg-purple-100 rounded-full text-purple-900 transition-all shadow-lg"
                        >
                            {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" />}
                        </button>

                        {/* Next Button */}
                        <button
                            onClick={nextTrack}
                            className="p-2 sm:p-3 text-purple-300 hover:text-white transition-colors"
                        >
                            <SkipForward className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" />
                        </button>

                        {/* Heart Icon - Toggle Shuffle */}
                        <button
                            onClick={() => setIsShuffled(!isShuffled)}
                            className={`p-2 sm:p-3 transition-colors ${isShuffled ? 'text-purple-400' : 'text-purple-300 hover:text-white'}`}
                            title={isShuffled ? "Shuffle on" : "Shuffle off"}
                        >
                            <Shuffle className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>

                    {/* Volume Control at Bottom */}
                    <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                        <button onClick={toggleMute} className="text-purple-400 hover:text-purple-300 flex-shrink-0">
                            {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="flex-1 h-1 bg-purple-800/30 rounded-lg appearance-none cursor-pointer slider"
                        />
                    </div>
                </div>

                {/* Back Side - Playlist */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-purple-900/40 to-purple-950/60 rounded-2xl border-2 border-purple-600/50 p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-white">Playlist ({playlist.length})</h3>
                        <button
                            onClick={() => setIsFlipped(false)}
                            className="text-purple-400 hover:text-purple-300 text-xs"
                        >
                            Back to Player
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto dashboard-scroll space-y-1">
                        {playlist.map((track, index) => (
                            <div
                                key={track.id}
                                onClick={() => {
                                    playTrack(index);
                                    setIsFlipped(false);
                                }}
                                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${index === currentTrackIndex
                                    ? 'bg-purple-600/40 border border-purple-500/50'
                                    : 'hover:bg-purple-800/20 border border-transparent'
                                    }`}
                            >
                                <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-white truncate">{track.title}</p>
                                    <p className="text-[10px] text-purple-300/60 truncate">{track.artist}</p>
                                </div>
                                {index === currentTrackIndex && isPlaying && (
                                    <div className="flex gap-0.5">
                                        <div className="w-0.5 h-3 bg-purple-400 animate-pulse" />
                                        <div className="w-0.5 h-3 bg-purple-400 animate-pulse delay-75" />
                                        <div className="w-0.5 h-3 bg-purple-400 animate-pulse delay-150" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: #a78bfa;
                    cursor: pointer;
                }
                .slider::-moz-range-thumb {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: #a78bfa;
                    cursor: pointer;
                    border: none;
                }
            `}</style>
        </div>
    );
};
