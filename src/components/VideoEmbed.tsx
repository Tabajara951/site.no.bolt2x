import { getYouTubeEmbedUrl } from '../utils/youtube.utils';

interface VideoEmbedProps {
  videoId: string;
  title?: string;
  isShorts?: boolean;
}

export function VideoEmbed({ videoId, title = 'YouTube video', isShorts = false }: VideoEmbedProps) {
  const containerClass = isShorts
    ? "relative w-full mx-auto aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 group transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:ring-2 hover:ring-emerald-500"
    : "relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 group transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:ring-2 hover:ring-emerald-500";

  return (
    <div className={containerClass}>
      <iframe
        src={getYouTubeEmbedUrl(videoId)}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
