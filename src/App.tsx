import { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import { Copy, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProfileImageUpload } from './components/ProfileImageUpload';
import { useProfileImage } from './hooks/useProfileImage';
import { useYouTubeVideos } from './hooks/useYouTubeVideos';
import { VideoEmbed } from './components/VideoEmbed';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import discordAnimation from './assets/icons8-discórdia.json';

function AppContent() {
  const [copiedText, setCopiedText] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDiscordHovered, setIsDiscordHovered] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [videoFilter, setVideoFilter] = useState<'shorts' | 'long-form'>('long-form');
  const [shortsCarouselIndex, setShortsCarouselIndex] = useState(0);
  const [longFormCarouselIndex, setLongFormCarouselIndex] = useState(0);
  const { imageUrl, updateImageUrl } = useProfileImage();
  const { videos, loading: videosLoading } = useYouTubeVideos();
  const { isAuthenticated } = useAdmin();
  const contactButtonsRef = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'A' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        if (isAuthenticated) {
          setShowAdminPanel(true);
        } else {
          setShowAdminLogin(true);
        }
      }
      if (e.key === 'Escape') {
        setShowAdminLogin(false);
        setShowAdminPanel(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);

    const overlay = document.getElementById('blur-overlay');
    const buttonIndex = type === 'discord' ? 1 : type === 'email' ? 2 : -1;
    const button = contactButtonsRef.current[buttonIndex];

    if (button && overlay) {
      overlay.classList.add('active');
      button.classList.add('hover-focus');
    }

    setTimeout(() => {
      setCopiedText('');
      if (button && overlay) {
        overlay.classList.remove('active');
        button.classList.remove('hover-focus');
      }
    }, 2000);
  };

  useEffect(() => {
    const overlay = document.getElementById('blur-overlay');
    const buttons = contactButtonsRef.current;

    buttons.forEach(button => {
      if (button) {
        const handleMouseEnter = () => {
          overlay?.classList.add('active');
          button.classList.add('hover-focus');
        };

        const handleMouseLeave = () => {
          overlay?.classList.remove('active');
          button.classList.remove('hover-focus');
        };

        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);

        (button as any)._hoverHandlers = { handleMouseEnter, handleMouseLeave };
      }
    });

    return () => {
      buttons.forEach(button => {
        if (button && (button as any)._hoverHandlers) {
          const { handleMouseEnter, handleMouseLeave } = (button as any)._hoverHandlers;
          button.removeEventListener('mouseenter', handleMouseEnter);
          button.removeEventListener('mouseleave', handleMouseLeave);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background - Professional Video Timeline */}
      <div className="absolute pointer-events-none opacity-40 z-0 overflow-hidden" style={{ top: '60vh', bottom: 0, left: 0, right: 0 }}>
        {/* Timeline Grid Lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(100,100,100,0.1) 0px, transparent 1px, transparent 50px, rgba(100,100,100,0.1) 50px)',
        }}></div>

        {/* Track 1 - Green Video Clips */}
        <div className="absolute top-[8%] left-0 w-[300%] h-14 timeline-track" style={{ animationDuration: '55s' }}>
          <div className="flex gap-2 h-full">
            {[80, 150, 60, 200, 90, 120, 180, 70, 110, 160, 85, 140, 95, 170, 100, 130, 75, 190, 65, 145, 105, 175, 88, 155, 92, 125, 78, 165, 82, 135].map((width, i) => (
              <div key={`v1-${i}`} className="flex-shrink-0 h-full rounded" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-br from-emerald-500/90 to-emerald-700/90 rounded border border-emerald-400/50 relative shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent 4px)',
                  }}></div>
                  <div className="absolute top-1 left-1 right-1 h-1 bg-white/20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 1b - Smaller Vertical Green Clips */}
        <div className="absolute top-[15%] left-0 w-[300%] h-6 timeline-track" style={{ animationDuration: '48s', animationDelay: '-10s' }}>
          <div className="flex gap-3 h-full">
            {[25, 32, 20, 35, 28, 30, 22, 34, 26, 30, 24, 32, 20, 36, 28, 26, 22, 34, 24, 30, 26, 32, 22, 28, 24, 34, 20, 30, 26, 28].map((width, i) => (
              <div key={`v1b-${i}`} className="flex-shrink-0 h-full rounded-sm" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-b from-emerald-400/60 to-emerald-600/60 rounded-sm border border-emerald-300/30 relative shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-300/40 via-transparent to-black/20"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.1) 1px, transparent 2px)',
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 2 - Cyan Audio Clips */}
        <div className="absolute top-[25%] left-0 w-[300%] h-10 timeline-track" style={{ animationDuration: '28s', animationDelay: '-8s' }}>
          <div className="flex gap-2 h-full">
            {[120, 90, 180, 65, 140, 100, 160, 75, 110, 150, 95, 130, 85, 170, 105, 125, 78, 155, 88, 145, 92, 135, 82, 165, 98, 115, 72, 175, 102, 125].map((width, i) => (
              <div key={`a1-${i}`} className="flex-shrink-0 h-full rounded" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-br from-cyan-500/90 to-cyan-700/90 rounded border border-cyan-400/50 relative shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-cyan-300/30"></div>
                  <div className="absolute inset-0 opacity-40" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.1) 1px, transparent 2px, transparent 4px)',
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 2b - Smaller Vertical Cyan Clips */}
        <div className="absolute top-[32%] left-0 w-[300%] h-5 timeline-track" style={{ animationDuration: '42s', animationDelay: '-5s' }}>
          <div className="flex gap-3 h-full">
            {[22, 28, 24, 32, 20, 30, 26, 34, 22, 28, 24, 30, 22, 32, 20, 28, 26, 30, 24, 28, 22, 32, 24, 26, 20, 30, 22, 28, 24, 30].map((width, i) => (
              <div key={`a1b-${i}`} className="flex-shrink-0 h-full rounded-sm" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-b from-cyan-400/60 to-cyan-600/60 rounded-sm border border-cyan-300/30 relative shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/40 via-transparent to-black/20"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.1) 1px, transparent 2px)',
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 3 - Pink/Magenta Clips */}
        <div className="absolute top-[40%] left-0 w-[300%] h-12 timeline-track" style={{ animationDuration: '60s', animationDelay: '-15s' }}>
          <div className="flex gap-2 h-full">
            {[100, 160, 70, 130, 95, 145, 80, 170, 110, 125, 88, 155, 75, 140, 105, 120, 92, 165, 85, 150, 78, 135, 98, 175, 72, 115, 102, 145, 82, 128].map((width, i) => (
              <div key={`p1-${i}`} className="flex-shrink-0 h-full rounded" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-br from-pink-500/90 to-pink-700/90 rounded border border-pink-400/50 relative shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent 4px)',
                  }}></div>
                  <div className="absolute top-1 left-1 right-1 h-1 bg-white/20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 3b - Smaller Vertical Pink Clips */}
        <div className="absolute top-[48%] left-0 w-[300%] h-5 timeline-track" style={{ animationDuration: '27s', animationDelay: '-12s' }}>
          <div className="flex gap-3 h-full">
            {[20, 30, 26, 32, 22, 30, 20, 34, 26, 28, 22, 32, 24, 30, 20, 30, 26, 28, 22, 32, 24, 28, 20, 32, 26, 30, 22, 28, 24, 30].map((width, i) => (
              <div key={`p1b-${i}`} className="flex-shrink-0 h-full rounded-sm" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-b from-pink-400/60 to-pink-600/60 rounded-sm border border-pink-300/30 relative shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-pink-300/40 via-transparent to-black/20"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.1) 1px, transparent 2px)',
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 4 - Orange Clips */}
        <div className="absolute top-[55%] left-0 w-[300%] h-16 timeline-track" style={{ animationDuration: '40s', animationDelay: '-5s' }}>
          <div className="flex gap-2 h-full">
            {[140, 85, 190, 110, 155, 78, 170, 95, 135, 105, 165, 88, 145, 72, 125, 98, 180, 82, 150, 92, 120, 102, 160, 75, 130, 108, 175, 68, 140, 95].map((width, i) => (
              <div key={`o1-${i}`} className="flex-shrink-0 h-full rounded" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-br from-orange-500/90 to-orange-700/90 rounded border border-orange-400/50 relative shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent 4px)',
                  }}></div>
                  <div className="absolute top-1 left-1 right-1 h-1.5 bg-white/20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 4b - Smaller Vertical Orange Clips */}
        <div className="absolute top-[64%] left-0 w-[300%] h-6 timeline-track" style={{ animationDuration: '52s', animationDelay: '-18s' }}>
          <div className="flex gap-3 h-full">
            {[22, 30, 20, 34, 26, 28, 22, 32, 26, 28, 24, 32, 20, 34, 26, 30, 22, 30, 22, 28, 24, 32, 22, 30, 26, 28, 20, 32, 24, 28].map((width, i) => (
              <div key={`o1b-${i}`} className="flex-shrink-0 h-full rounded-sm" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-b from-orange-400/60 to-orange-600/60 rounded-sm border border-orange-300/30 relative shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-orange-300/40 via-transparent to-black/20"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.1) 1px, transparent 2px)',
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 5 - Blue Clips */}
        <div className="absolute top-[75%] left-0 w-[300%] h-11 timeline-track" style={{ animationDuration: '30s', animationDelay: '-20s' }}>
          <div className="flex gap-2 h-full">
            {[115, 170, 68, 145, 90, 160, 82, 135, 105, 150, 75, 125, 98, 175, 85, 140, 92, 165, 78, 130, 102, 155, 72, 120, 95, 180, 88, 145, 80, 138].map((width, i) => (
              <div key={`b1-${i}`} className="flex-shrink-0 h-full rounded" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-br from-blue-500/90 to-blue-700/90 rounded border border-blue-400/50 relative shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent 4px)',
                  }}></div>
                  <div className="absolute top-1 left-1 right-1 h-1 bg-white/20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 5b - Smaller Vertical Blue Clips */}
        <div className="absolute top-[82%] left-0 w-[300%] h-5 timeline-track" style={{ animationDuration: '45s', animationDelay: '-14s' }}>
          <div className="flex gap-3 h-full">
            {[22, 30, 24, 32, 20, 30, 26, 32, 22, 28, 26, 30, 22, 34, 24, 30, 20, 32, 26, 28, 22, 30, 24, 32, 20, 28, 26, 30, 22, 28].map((width, i) => (
              <div key={`b1b-${i}`} className="flex-shrink-0 h-full rounded-sm" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-b from-blue-400/60 to-blue-600/60 rounded-sm border border-blue-300/30 relative shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-300/40 via-transparent to-black/20"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.1) 1px, transparent 2px)',
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 6 - Yellow/Amber Clips */}
        <div className="absolute top-[90%] left-0 w-[300%] h-10 timeline-track" style={{ animationDuration: '58s', animationDelay: '-12s' }}>
          <div className="flex gap-2 h-full">
            {[95, 155, 72, 130, 88, 165, 78, 145, 105, 120, 92, 170, 68, 135, 98, 150, 82, 125, 108, 160, 75, 140, 90, 175, 85, 115, 102, 145, 78, 132].map((width, i) => (
              <div key={`y1-${i}`} className="flex-shrink-0 h-full rounded" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-br from-amber-500/90 to-amber-700/90 rounded border border-amber-400/50 relative shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-amber-300/30"></div>
                  <div className="absolute inset-0 opacity-40" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.1) 1px, transparent 2px, transparent 4px)',
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 6b - Smaller Vertical Amber Clips */}
        <div className="absolute top-[97%] left-0 w-[300%] h-4 timeline-track" style={{ animationDuration: '24s', animationDelay: '-8s' }}>
          <div className="flex gap-3 h-full">
            {[20, 28, 22, 30, 22, 28, 20, 32, 24, 26, 26, 30, 22, 32, 20, 28, 24, 30, 22, 28, 20, 30, 24, 28, 22, 32, 20, 26, 24, 28].map((width, i) => (
              <div key={`y1b-${i}`} className="flex-shrink-0 h-full rounded-sm" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-b from-amber-400/60 to-amber-600/60 rounded-sm border border-amber-300/30 relative shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-300/40 via-transparent to-black/20"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.1) 1px, transparent 2px)',
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 7 - Lime Green Clips */}
        <div className="absolute top-[3%] left-0 w-[300%] h-8 timeline-track" style={{ animationDuration: '62s', animationDelay: '-16s' }}>
          <div className="flex gap-2 h-full">
            {[90, 130, 75, 155, 85, 140, 70, 165, 95, 125, 80, 150, 88, 135, 92, 145, 78, 160, 85, 130, 90, 140, 82, 155, 87, 135, 75, 150, 90, 125].map((width, i) => (
              <div key={`lime-${i}`} className="flex-shrink-0 h-full rounded" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-br from-lime-400 to-lime-600 rounded border border-lime-300/70 relative shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 4px)',
                  }}></div>
                  <div className="absolute top-1 left-1 right-1 h-1 bg-white/30 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 7b - Smaller Vertical Lime Clips */}
        <div className="absolute top-[10%] left-0 w-[300%] h-5 timeline-track" style={{ animationDuration: '29s', animationDelay: '-7s' }}>
          <div className="flex gap-3 h-full">
            {[24, 30, 22, 34, 26, 30, 22, 32, 28, 26, 24, 32, 22, 34, 26, 28, 24, 30, 22, 32, 26, 30, 24, 32, 22, 28, 26, 30, 24, 28].map((width, i) => (
              <div key={`lime-b-${i}`} className="flex-shrink-0 h-full rounded-sm" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-b from-lime-400/80 to-lime-600/80 rounded-sm border border-lime-300/50 relative shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-lime-300/50 via-transparent to-black/20"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.15) 1px, transparent 2px)',
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 8 - Purple Clips */}
        <div className="absolute top-[19%] left-0 w-[300%] h-13 timeline-track" style={{ animationDuration: '34s', animationDelay: '-22s' }}>
          <div className="flex gap-2 h-full">
            {[110, 145, 80, 170, 95, 135, 75, 160, 105, 130, 85, 155, 90, 140, 98, 150, 82, 165, 92, 135, 88, 145, 78, 158, 94, 132, 80, 148, 96, 128].map((width, i) => (
              <div key={`purple-${i}`} className="flex-shrink-0 h-full rounded" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-br from-purple-400 to-purple-600 rounded border border-purple-300/70 relative shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 4px)',
                  }}></div>
                  <div className="absolute top-1 left-1 right-1 h-1 bg-white/30 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 8b - Smaller Vertical Purple Clips */}
        <div className="absolute top-[27%] left-0 w-[300%] h-5 timeline-track" style={{ animationDuration: '50s', animationDelay: '-19s' }}>
          <div className="flex gap-3 h-full">
            {[22, 32, 24, 30, 22, 34, 26, 30, 24, 28, 26, 32, 22, 34, 24, 30, 22, 32, 26, 28, 24, 30, 22, 32, 26, 30, 24, 32, 22, 28].map((width, i) => (
              <div key={`purple-b-${i}`} className="flex-shrink-0 h-full rounded-sm" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-b from-purple-400/80 to-purple-600/80 rounded-sm border border-purple-300/50 relative shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-300/50 via-transparent to-black/20"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.15) 1px, transparent 2px)',
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 9 - Teal Clips */}
        <div className="absolute top-[36%] left-0 w-[300%] h-11 timeline-track" style={{ animationDuration: '54s', animationDelay: '-11s' }}>
          <div className="flex gap-2 h-full">
            {[105, 150, 72, 165, 88, 140, 78, 170, 100, 135, 82, 155, 92, 145, 85, 160, 95, 130, 80, 150, 90, 142, 75, 168, 98, 138, 82, 152, 88, 134].map((width, i) => (
              <div key={`teal-${i}`} className="flex-shrink-0 h-full rounded" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-br from-teal-400 to-teal-600 rounded border border-teal-300/70 relative shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 4px)',
                  }}></div>
                  <div className="absolute top-1 left-1 right-1 h-1 bg-white/30 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 9b - Smaller Vertical Teal Clips */}
        <div className="absolute top-[43%] left-0 w-[300%] h-6 timeline-track" style={{ animationDuration: '26s', animationDelay: '-3s' }}>
          <div className="flex gap-3 h-full">
            {[24, 30, 22, 34, 26, 28, 22, 32, 26, 30, 24, 32, 22, 34, 26, 28, 24, 30, 22, 32, 26, 30, 24, 32, 22, 28, 26, 30, 24, 28].map((width, i) => (
              <div key={`teal-b-${i}`} className="flex-shrink-0 h-full rounded-sm" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-b from-teal-400/80 to-teal-600/80 rounded-sm border border-teal-300/50 relative shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-teal-300/50 via-transparent to-black/20"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.15) 1px, transparent 2px)',
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 10 - Rose/Red Clips */}
        <div className="absolute top-[51%] left-0 w-[300%] h-14 timeline-track" style={{ animationDuration: '37s', animationDelay: '-25s' }}>
          <div className="flex gap-2 h-full">
            {[120, 155, 75, 175, 92, 138, 80, 168, 108, 132, 85, 160, 95, 145, 88, 165, 100, 135, 78, 158, 94, 142, 82, 170, 102, 136, 76, 154, 92, 130].map((width, i) => (
              <div key={`rose-${i}`} className="flex-shrink-0 h-full rounded" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-br from-rose-400 to-rose-600 rounded border border-rose-300/70 relative shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 4px)',
                  }}></div>
                  <div className="absolute top-1 left-1 right-1 h-1 bg-white/30 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 10b - Smaller Vertical Rose Clips */}
        <div className="absolute top-[59%] left-0 w-[300%] h-5 timeline-track" style={{ animationDuration: '47s', animationDelay: '-21s' }}>
          <div className="flex gap-3 h-full">
            {[22, 30, 24, 32, 22, 30, 26, 32, 24, 28, 26, 30, 22, 34, 24, 30, 22, 32, 26, 28, 24, 30, 22, 32, 26, 30, 24, 32, 22, 28].map((width, i) => (
              <div key={`rose-b-${i}`} className="flex-shrink-0 h-full rounded-sm" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-b from-rose-400/80 to-rose-600/80 rounded-sm border border-rose-300/50 relative shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-rose-300/50 via-transparent to-black/20"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.15) 1px, transparent 2px)',
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 11 - Sky Blue Clips */}
        <div className="absolute top-[68%] left-0 w-[300%] h-12 timeline-track" style={{ animationDuration: '56s', animationDelay: '-17s' }}>
          <div className="flex gap-2 h-full">
            {[100, 140, 78, 160, 90, 145, 75, 170, 105, 130, 82, 155, 95, 138, 88, 165, 98, 135, 80, 150, 92, 142, 76, 162, 96, 136, 82, 148, 90, 132].map((width, i) => (
              <div key={`sky-${i}`} className="flex-shrink-0 h-full rounded" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-br from-sky-400 to-sky-600 rounded border border-sky-300/70 relative shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 4px)',
                  }}></div>
                  <div className="absolute top-1 left-1 right-1 h-1 bg-white/30 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 11b - Smaller Vertical Sky Clips */}
        <div className="absolute top-[77%] left-0 w-[300%] h-6 timeline-track" style={{ animationDuration: '27s', animationDelay: '-9s' }}>
          <div className="flex gap-3 h-full">
            {[24, 30, 22, 34, 26, 28, 22, 32, 26, 30, 24, 32, 22, 34, 26, 28, 24, 30, 22, 32, 26, 30, 24, 32, 22, 28, 26, 30, 24, 28].map((width, i) => (
              <div key={`sky-b-${i}`} className="flex-shrink-0 h-full rounded-sm" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-b from-sky-400/80 to-sky-600/80 rounded-sm border border-sky-300/50 relative shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-sky-300/50 via-transparent to-black/20"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.15) 1px, transparent 2px)',
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 12 - Fuchsia Clips */}
        <div className="absolute top-[85%] left-0 w-[300%] h-10 timeline-track" style={{ animationDuration: '29s', animationDelay: '-6s' }}>
          <div className="flex gap-2 h-full">
            {[95, 135, 70, 155, 88, 140, 75, 165, 100, 128, 80, 150, 92, 138, 85, 160, 96, 132, 78, 148, 90, 140, 74, 158, 94, 134, 80, 146, 88, 130].map((width, i) => (
              <div key={`fuchsia-${i}`} className="flex-shrink-0 h-full rounded" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 rounded border border-fuchsia-300/70 relative shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 4px)',
                  }}></div>
                  <div className="absolute top-1 left-1 right-1 h-1 bg-white/30 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 12b - Smaller Vertical Fuchsia Clips */}
        <div className="absolute top-[92%] left-0 w-[300%] h-5 timeline-track" style={{ animationDuration: '44s', animationDelay: '-4s' }}>
          <div className="flex gap-3 h-full">
            {[22, 28, 24, 32, 22, 30, 26, 32, 24, 28, 26, 30, 22, 34, 24, 30, 22, 32, 26, 28, 24, 30, 22, 32, 26, 30, 24, 32, 22, 28].map((width, i) => (
              <div key={`fuchsia-b-${i}`} className="flex-shrink-0 h-full rounded-sm" style={{ width: `${width}px` }}>
                <div className="h-full bg-gradient-to-b from-fuchsia-400/80 to-fuchsia-600/80 rounded-sm border border-fuchsia-300/50 relative shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-300/50 via-transparent to-black/20"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.15) 1px, transparent 2px)',
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* REC Indicator */}
      <div className="fixed top-auto bottom-6 md:top-6 md:bottom-auto left-6 z-50 flex items-center gap-3 font-space">
        <div className="flex items-center gap-2 bg-black/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          <div className="relative flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
            <span className="text-red-500 font-bold text-lg tracking-wider">REC</span>
          </div>
          <div className="h-5 w-px bg-gray-600 mx-1"></div>
          <span className="text-gray-300 text-base font-semibold tracking-wide">{formatTime(recordingTime)}</span>
        </div>
      </div>

      {/* Navigation - Island Style */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex gap-4 font-exo">
          <a
            href="#projects"
            className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-sm tracking-widest uppercase hover:bg-white/10 hover:border-amber-500/50 hover:text-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 font-medium"
          >
            Projects
          </a>
          <a
            href="#about"
            className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-sm tracking-widest uppercase hover:bg-white/10 hover:border-amber-500/50 hover:text-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 font-medium"
          >
            About Me
          </a>
          <a
            href="#contact"
            className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-sm tracking-widest uppercase hover:bg-white/10 hover:border-amber-500/50 hover:text-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 font-medium"
          >
            Contact
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 relative z-10" style={{ background: '#000000' }}>
        <div className="mb-8 relative mt-32">
          <div
            className="w-48 h-48 rounded-2xl border-4 border-emerald-500 overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.5)] cursor-pointer profile-photo-container"
            style={{ transition: 'transform 0.15s ease-out' }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const rotateX = ((y - centerY) / centerY) * -25;
              const rotateY = ((x - centerX) / centerX) * 25;
              e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            }}
          >
            <img
              src={imageUrl}
              alt="Profile"
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-amber-500 tracking-wider font-orbitron">
          GUSTAVO RODRIGUES "TABAJARA"
        </h1>
        <p className="text-xl text-gray-300 tracking-wide font-exo font-light mb-32">
          Video Editor for Content Creators
        </p>

        {showUploadModal && (
          <div className="mt-8 w-full max-w-md">
            <ProfileImageUpload
              onImageUploaded={(url) => {
                updateImageUrl(url);
                setShowUploadModal(false);
              }}
            />
          </div>
        )}

        {/* Video Grid */}
        <div id="projects" className="mt-32 w-full max-w-6xl">
          {/* Filter Buttons */}
          <div className="flex items-center justify-center gap-6 mb-12">
            <button
              onClick={() => setVideoFilter('long-form')}
              className={`px-8 py-3 rounded-full font-orbitron font-bold tracking-wider transition-all duration-300 ${
                videoFilter === 'long-form'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              LONG-FORM
            </button>
            <button
              onClick={() => setVideoFilter('shorts')}
              className={`px-8 py-3 rounded-full font-orbitron font-bold tracking-wider transition-all duration-300 ${
                videoFilter === 'shorts'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              SHORTS
            </button>
          </div>

          {videosLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-emerald-400" />
            </div>
          ) : videos.filter(v =>
              videoFilter === 'shorts' ? v.video_type === 'shorts' : v.video_type === 'normal'
            ).length > 0 ? (
            <div className="space-y-6">
              {videoFilter === 'shorts' ? (
                /* SHORTS Carousel - 3 videos at a time */
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos
                      .filter(v => v.video_type === 'shorts')
                      .slice(shortsCarouselIndex, shortsCarouselIndex + 3)
                      .map((video) => (
                        <VideoEmbed
                          key={video.id}
                          videoId={video.youtube_id}
                          title={video.title}
                          isShorts={video.video_type === 'shorts'}
                        />
                      ))}
                  </div>

                  {/* Carousel Navigation */}
                  {videos.filter(v => v.video_type === 'shorts').length > 3 && (
                    <div className="flex items-center justify-center gap-6 mt-8">
                      <button
                        onClick={() => setShortsCarouselIndex(Math.max(0, shortsCarouselIndex - 3))}
                        disabled={shortsCarouselIndex === 0}
                        className="p-3 rounded-full bg-amber-500 text-black hover:bg-amber-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-amber-500 shadow-lg hover:shadow-amber-500/50"
                        aria-label="Previous shorts"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <span className="text-gray-400 font-space text-sm">
                        {Math.floor(shortsCarouselIndex / 3) + 1} / {Math.ceil(videos.filter(v => v.video_type === 'shorts').length / 3)}
                      </span>
                      <button
                        onClick={() => setShortsCarouselIndex(Math.min(videos.filter(v => v.video_type === 'shorts').length - 3, shortsCarouselIndex + 3))}
                        disabled={shortsCarouselIndex + 3 >= videos.filter(v => v.video_type === 'shorts').length}
                        className="p-3 rounded-full bg-amber-500 text-black hover:bg-amber-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-amber-500 shadow-lg hover:shadow-amber-500/50"
                        aria-label="Next shorts"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* LONG-FORM Videos - Carousel with 8 videos per page (3+2+3) */
                <div className="relative">
                  <div className="space-y-8">
                    {/* First Row - 3 videos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {videos
                        .filter(v => v.video_type === 'normal')
                        .slice(longFormCarouselIndex, longFormCarouselIndex + 3)
                        .map((video) => (
                          <VideoEmbed
                            key={video.id}
                            videoId={video.youtube_id}
                            title={video.title}
                            isShorts={video.video_type === 'shorts'}
                          />
                        ))}
                    </div>

                    {/* Second Row - 2 larger videos */}
                    {videos.filter(v => v.video_type === 'normal').slice(longFormCarouselIndex).length > 3 && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                        {videos
                          .filter(v => v.video_type === 'normal')
                          .slice(longFormCarouselIndex + 3, longFormCarouselIndex + 5)
                          .map((video, index) => (
                            <div key={video.id} className={`scale-[1.15] ${index === 0 ? 'lg:-translate-x-8' : 'lg:translate-x-8'}`}>
                              <VideoEmbed
                                videoId={video.youtube_id}
                                title={video.title}
                                isShorts={video.video_type === 'shorts'}
                              />
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Third Row - 3 videos */}
                    {videos.filter(v => v.video_type === 'normal').slice(longFormCarouselIndex).length > 5 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videos
                          .filter(v => v.video_type === 'normal')
                          .slice(longFormCarouselIndex + 5, longFormCarouselIndex + 8)
                          .map((video) => (
                            <VideoEmbed
                              key={video.id}
                              videoId={video.youtube_id}
                              title={video.title}
                              isShorts={video.video_type === 'shorts'}
                            />
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Carousel Navigation */}
                  {videos.filter(v => v.video_type === 'normal').length > 8 && (
                    <div className="flex items-center justify-center gap-6 mt-8">
                      <button
                        onClick={() => setLongFormCarouselIndex(Math.max(0, longFormCarouselIndex - 8))}
                        disabled={longFormCarouselIndex === 0}
                        className="p-3 rounded-full bg-amber-500 text-black hover:bg-amber-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-amber-500 shadow-lg hover:shadow-amber-500/50"
                        aria-label="Previous long-form videos"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <span className="text-gray-400 font-space text-sm">
                        {Math.floor(longFormCarouselIndex / 8) + 1} / {Math.ceil(videos.filter(v => v.video_type === 'normal').length / 8)}
                      </span>
                      <button
                        onClick={() => setLongFormCarouselIndex(Math.min(videos.filter(v => v.video_type === 'normal').length - 8, longFormCarouselIndex + 8))}
                        disabled={longFormCarouselIndex + 8 >= videos.filter(v => v.video_type === 'normal').length}
                        className="p-3 rounded-full bg-amber-500 text-black hover:bg-amber-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-amber-500 shadow-lg hover:shadow-amber-500/50"
                        aria-label="Next long-form videos"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 font-space text-lg">No {videoFilter === 'shorts' ? 'shorts' : 'long-form'} videos available yet</p>
              <p className="text-gray-600 font-space text-sm mt-2">Check back soon for new content!</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-20 relative z-10">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 sm:mb-12 md:mb-16 text-emerald-400 glitch-blink font-orbitron">
          ABOUT ME
        </h2>

        {/* CRT Monitor */}
        <div className="relative w-full max-w-5xl">
          {/* Monitor Frame - Beige plastic body */}
          <div className="relative bg-gradient-to-b from-[#e8dcc8] via-[#d4c4a8] to-[#c4b49a] rounded-[20px] sm:rounded-[30px] md:rounded-[40px] p-4 sm:p-6 md:p-12 shadow-2xl">
            {/* Top vent slots - hidden on small screens */}
            <div className="hidden sm:flex absolute top-4 md:top-6 left-1/2 transform -translate-x-1/2 gap-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-1 h-3 md:h-4 bg-[#a89880] rounded"></div>
              ))}
            </div>

            {/* Inner darker bezel */}
            <div className="bg-gradient-to-b from-[#b8a890] to-[#a89880] rounded-[15px] sm:rounded-[20px] md:rounded-[30px] p-3 sm:p-4 md:p-8">
              {/* Screen area with curved glass effect */}
              <div className="relative bg-black rounded-[12px] sm:rounded-[16px] md:rounded-[20px] overflow-hidden border-2 sm:border-4 md:border-[6px] border-[#8a7a68] shadow-inner min-h-[400px] sm:min-h-0 sm:aspect-[4/3]">
                {/* Glass reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-30"></div>

                {/* Scanlines effect */}
                <div className="absolute inset-0 pointer-events-none z-20" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
                }}></div>

                {/* Screen glow */}
                <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none z-10"></div>

                {/* Curved screen edges darkening */}
                <div className="absolute inset-0 pointer-events-none z-20 rounded-[12px] sm:rounded-[16px] md:rounded-[20px]" style={{
                  boxShadow: 'inset 0 0 60px 20px rgba(0,0,0,0.6)'
                }}></div>

                {/* Content */}
                <div className="relative z-20 h-full flex flex-col justify-center p-4 sm:p-6 md:p-12 lg:p-16">
                  <div className="space-y-3 sm:space-y-4 md:space-y-6 text-left">
                    <p className="text-emerald-300 text-sm sm:text-base md:text-lg leading-relaxed font-space">
                      <span className="text-emerald-500">&gt;</span> Hello, I'm Gustavo Rodrigues Barbosa. I'm 20, and for the past 3 years,
                      I've been immersed in the world of editing.
                    </p>

                    <p className="text-emerald-300 text-sm sm:text-base md:text-lg leading-relaxed font-space">
                      <span className="text-emerald-500">&gt;</span> I don't see hours of raw footage as a problem, but as a code to be
                      deciphered. My process goes beyond simply "cutting\"—it's about sculpting
                      time, finding the rhythmic pulse in every scene, and mixing realities.
                    </p>

                    <p className="text-emerald-300 text-sm sm:text-base md:text-lg leading-relaxed font-space">
                      <span className="text-emerald-500">&gt;</span> With a special focus on composition and visual effects (VFX), I don't
                      just assemble a story; I build an atmosphere that keeps the viewer locked
                      in.
                    </p>

                    {/* Blinking cursor */}
                    <div className="flex items-center gap-2 mt-2 sm:mt-4">
                      <span className="text-emerald-500 font-space">&gt;</span>
                      <span className="w-2 sm:w-3 h-4 sm:h-5 bg-emerald-400 animate-pulse"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Control buttons at bottom - smaller on mobile */}
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-5 sm:w-6 md:w-8 h-1.5 sm:h-2 bg-[#8a7a68] rounded-full shadow-inner"></div>
              ))}
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)] ml-1 sm:ml-2"></div>
            </div>

            {/* Brand label - hidden on very small screens */}
            <div className="hidden sm:block absolute bottom-3 md:bottom-4 right-4 md:right-8 text-[#8a7a68] text-xs font-bold tracking-widest opacity-60 font-exo">
              CRT-2000
            </div>
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative z-10">
        <h2 className="text-5xl md:text-6xl font-bold mb-16 font-orbitron">
          GET IN TOUCH
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-12 w-full max-w-5xl">
          {/* Contact Buttons */}
          <div className="flex-1 space-y-4 w-full max-w-md">
            {/* Twitter */}
            <a
              ref={el => contactButtonsRef.current[0] = el}
              href="https://x.com/tabajara_2"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-contato group relative flex flex-row items-center justify-center bg-black border border-gray-700 rounded-full px-8 py-6 hover:border-gray-500 transition-all gap-4 overflow-visible cursor-pointer"
            >
              <div className="absolute inset-0 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10" style={{ backdropFilter: 'blur(8px)', transform: 'scale(1.05)' }}></div>
              <img src="/icons8-twitter-96 copy.png" alt="X/Twitter" className="relative z-10 w-12 h-12 flex-shrink-0" />
              <div className="flex flex-col items-center flex-1">
                <span className="relative z-10 font-space text-sm tracking-widest uppercase text-gray-300 select-text">MY TWITTER/X.COM</span>
                <span className="relative z-10 font-space text-xl uppercase select-text">@tabajara_2</span>
              </div>
            </a>

            {/* Discord */}
            <button
              ref={el => contactButtonsRef.current[1] = el}
              onClick={() => handleCopy('.tabajara', 'discord')}
              onMouseEnter={() => setIsDiscordHovered(true)}
              onMouseLeave={() => setIsDiscordHovered(false)}
              className="btn-contato group relative flex flex-row items-center justify-center rounded-full px-8 py-6 w-full transition-all overflow-hidden gap-4"
              style={{
                background: 'url("/image copy copy copy.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <img src="/icons8-logo-discord-100 (1).png" alt="Discord" className="relative z-10 w-12 h-12 flex-shrink-0" />
              <div className="flex flex-col items-center flex-1">
                <span className="relative z-10 font-space text-sm tracking-widest uppercase text-white select-text">MY DISCORD</span>
                <span className="relative z-10 font-space text-xl text-white select-text">.tabajara</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy('.tabajara', 'discord');
                }}
                className="relative z-10 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {copiedText === 'discord' ? (
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <Copy className="w-5 h-5 text-white" />
                )}
              </button>
            </button>

            {/* Email */}
            <button
              ref={el => contactButtonsRef.current[2] = el}
              onClick={() => handleCopy('krib951@gmail.com', 'email')}
              className="btn-contato group relative flex flex-row items-center justify-center rounded-full px-8 py-6 w-full transition-all gap-4 overflow-hidden"
              style={{ backgroundImage: 'url("/image%20copy%20copy%20copy%20copy%20copy.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img src="/icons8-nova-mensagem-64.png" alt="Email" className="relative z-10 w-12 h-12 flex-shrink-0" />
              <div className="flex flex-col items-center flex-1">
                <span className="relative z-10 font-space text-sm tracking-widest uppercase text-gray-700 select-text">MY EMAIL</span>
                <span className="relative z-10 font-space text-xl text-gray-900 select-text">krib951@gmail.com</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy('krib951@gmail.com', 'email');
                }}
                className="relative z-10 p-2 hover:bg-black/10 rounded-lg transition-colors"
              >
                {copiedText === 'email' ? (
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <Copy className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </button>
          </div>

          {/* Image */}
          <div className="flex-1 flex justify-center items-start pt-8">
            <div className="relative w-96 h-96">
              <img
                src="/BORRACHA SEM FUNDO PERFEITO copy.png"
                alt="A highly realistic crumpled yellow sticky note secured by translucent tape at the top, with the bottom half gently peeling away and curling outwards, creating a floating effect. The post-it features handwritten text that reads 'LIKE WHAT YOU SEE? LET'S CREATE SOMETHING INCREDIBLE TOGETHER.' with realistic paper texture, wrinkles, and cinematic lighting against a dark blurred background."
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 border-t border-gray-800">
        <p className="font-space text-sm">© 2024 Gustavo Rodrigues. All rights reserved.</p>
      </footer>

      {/* Admin Modals */}
      {showAdminLogin && (
        <AdminLogin onClose={() => setShowAdminLogin(false)} />
      )}
      {showAdminPanel && isAuthenticated && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  );
}

export default App;
