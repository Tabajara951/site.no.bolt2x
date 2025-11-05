import { useState, useEffect } from 'react';
import { X, Plus, Trash2, LogOut, Youtube, Loader2, ChevronLeft, ChevronRight, GripVertical, Save, XCircle } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase } from '../lib/supabase';
import { useAdmin } from '../contexts/AdminContext';
import { extractYouTubeId, isValidYouTubeUrl, getYouTubeThumbnail, isYouTubeShorts } from '../utils/youtube.utils';
import type { YouTubeVideo } from '../types/database.types';

interface AdminPanelProps {
  onClose: () => void;
}

const VIDEOS_PER_PAGE = 6;

interface SortableVideoItemProps {
  video: YouTubeVideo;
  onDelete: (id: string) => void;
}

function SortableVideoItem({ video, onDelete }: SortableVideoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-emerald-500/30 transition-all group ${
        isDragging ? 'shadow-2xl shadow-emerald-500/20 scale-105 z-50' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-emerald-400 transition-colors flex-shrink-0"
        title="Drag to reorder"
      >
        <GripVertical size={24} />
      </div>
      <div className="relative flex-shrink-0">
        <img
          src={getYouTubeThumbnail(video.youtube_id)}
          alt="Video thumbnail"
          className="w-32 h-20 object-cover rounded"
        />
        {video.video_type === 'shorts' && (
          <span className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">
            Shorts
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-white font-medium truncate">{video.youtube_id}</p>
          <span className={`text-xs px-2 py-0.5 rounded ${
            video.video_type === 'shorts'
              ? 'bg-red-600/20 text-red-400 border border-red-600/30'
              : 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
          }`}>
            {video.video_type === 'shorts' ? '9:16' : '16:9'}
          </span>
        </div>
        <p className="text-sm text-slate-400 truncate">{video.youtube_url}</p>
        <p className="text-xs text-slate-500">
          Added {new Date(video.created_at).toLocaleDateString()}
        </p>
      </div>
      <button
        onClick={() => onDelete(video.id)}
        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const { logout } = useAdmin();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [originalVideos, setOriginalVideos] = useState<YouTubeVideo[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'normal' | 'shorts'>('normal');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    if (!supabase) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setVideos(data || []);
      setOriginalVideos(data || []);
      setHasUnsavedChanges(false);
    } catch (err) {
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      setError('Supabase not configured');
      return;
    }

    if (!isValidYouTubeUrl(newVideoUrl)) {
      setError('Invalid YouTube URL');
      return;
    }

    const videoId = extractYouTubeId(newVideoUrl);
    if (!videoId) {
      setError('Could not extract video ID');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const maxOrder = videos.length > 0 ? Math.max(...videos.map(v => v.display_order)) : -1;

      const { error: insertError } = await supabase
        .from('youtube_videos')
        .insert({
          youtube_url: newVideoUrl,
          youtube_id: videoId,
          display_order: maxOrder + 1,
          is_active: true,
          video_type: selectedFormat,
          title: '',
          description: '',
        });

      if (insertError) throw insertError;

      setSuccess('Video added successfully!');
      setNewVideoUrl('');
      setSelectedFormat('normal');
      setHasUnsavedChanges(false);
      await fetchVideos();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add video');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!supabase) return;
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('youtube_videos')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setSuccess('Video deleted successfully!');
      setHasUnsavedChanges(false);
      await fetchVideos();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete video');
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);
  const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
  const endIndex = startIndex + VIDEOS_PER_PAGE;
  const currentVideos = videos.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setVideos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        setHasUnsavedChanges(true);
        return newOrder;
      });
    }
  };

  const handleSaveOrder = () => {
    setShowConfirmModal(true);
  };

  const confirmSaveOrder = async () => {
    if (!supabase) return;

    try {
      setSaving(true);
      setError('');

      const updates = videos.map((video, index) => ({
        id: video.id,
        display_order: index,
      }));

      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('youtube_videos')
          .update({ display_order: update.display_order })
          .eq('id', update.id);

        if (updateError) throw updateError;
      }

      setSuccess('Video order saved successfully!');
      setOriginalVideos([...videos]);
      setHasUnsavedChanges(false);
      setShowConfirmModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save video order');
      setVideos([...originalVideos]);
      setHasUnsavedChanges(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelReorder = () => {
    setVideos([...originalVideos]);
    setHasUnsavedChanges(false);
    setSuccess('');
    setError('');
  };

  const activeVideo = videos.find(video => video.id === activeId);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-emerald-500/20 p-8 max-w-4xl w-full relative shadow-2xl shadow-emerald-500/10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Youtube className="text-emerald-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Video Management</h2>
              <p className="text-sm text-slate-400">{videos.length} videos</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <form onSubmit={handleAddVideo} className="mb-6">
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                placeholder="Paste YouTube URL here..."
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                disabled={submitting}
              />
            </div>

            <div className="flex gap-3 items-center">
              <label className="text-slate-300 text-sm font-medium">Video Format:</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFormat('normal')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedFormat === 'normal'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                  disabled={submitting}
                >
                  16:9 (Normal)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('shorts')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedFormat === 'shorts'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                  disabled={submitting}
                >
                  9:16 (Shorts)
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting || !newVideoUrl}
                className="ml-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                {submitting ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Plus size={20} />
                )}
                Add Video
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
            {success}
          </div>
        )}

        {videos.length > 0 && !hasUnsavedChanges && (
          <div className="mb-4 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg flex items-center gap-2 text-slate-400 text-sm">
            <GripVertical size={18} className="text-slate-500" />
            <span>Tip: Drag videos using the grip icon to reorder them. You can drag across pages!</span>
          </div>
        )}

        {hasUnsavedChanges && (
          <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400">
              <Save size={20} />
              <span className="font-medium">You have unsaved changes</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCancelReorder}
                disabled={saving}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <XCircle size={18} />
                Cancel
              </button>
              <button
                onClick={handleSaveOrder}
                disabled={saving}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Save Order
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-emerald-400" />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Youtube size={48} className="mx-auto mb-4 opacity-50" />
              <p>No videos yet. Add your first video above!</p>
            </div>
          ) : (
            <>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="space-y-3 min-h-[400px]">
                  <SortableContext
                    items={videos.map(v => v.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {currentVideos.map((video) => (
                      <SortableVideoItem
                        key={video.id}
                        video={video}
                        onDelete={handleDeleteVideo}
                      />
                    ))}
                  </SortableContext>
                </div>
                <DragOverlay>
                  {activeId && activeVideo ? (
                    <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg border border-emerald-500 shadow-2xl shadow-emerald-500/50 opacity-90">
                      <div className="text-emerald-400 flex-shrink-0">
                        <GripVertical size={24} />
                      </div>
                      <div className="relative flex-shrink-0">
                        <img
                          src={getYouTubeThumbnail(activeVideo.youtube_id)}
                          alt="Video thumbnail"
                          className="w-32 h-20 object-cover rounded"
                        />
                        {activeVideo.video_type === 'shorts' && (
                          <span className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                            Shorts
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium truncate">{activeVideo.youtube_id}</p>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            activeVideo.video_type === 'shorts'
                              ? 'bg-red-600/20 text-red-400 border border-red-600/30'
                              : 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                          }`}>
                            {activeVideo.video_type === 'shorts' ? '9:16' : '16:9'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 truncate">{activeVideo.youtube_url}</p>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-700">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-all ${
                          currentPage === page
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Save className="text-emerald-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Save Video Order?</h3>
                <p className="text-sm text-slate-400">This will update the display order</p>
              </div>
            </div>

            <p className="text-slate-300 mb-6">
              Are you sure you want to save the new video order? This will change how videos appear on your site.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={saving}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmSaveOrder}
                disabled={saving}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Confirm Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
