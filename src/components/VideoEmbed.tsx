import { getYouTubeEmbedUrl } from '../utils/youtube.utils';

interface VideoEmbedProps {
  videoId: string;
  title?: string;
  isShorts?: boolean;
}

export function VideoEmbed({ videoId, title = 'YouTube video', isShorts = false }: VideoEmbedProps) {
  const containerClass = isShorts
    ? "relative w-full mx-auto aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 hover:shadow-lg hover:shadow-emerald-500/20 group"
    : "relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 hover:shadow-lg hover:shadow-emerald-500/20 group";

  return (
    <div className={containerClass}>
      <iframe
        src={getYouTubeEmbedUrl(videoId)}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-emerald-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}
