export interface YouTubeVideo {
  id: string;
  youtube_url: string;
  youtube_id: string;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
  video_type: 'shorts' | 'normal';
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  password_hash: string;
  created_at: string;
  last_login: string | null;
}

export interface Database {
  public: {
    Tables: {
      youtube_videos: {
        Row: YouTubeVideo;
        Insert: Omit<YouTubeVideo, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<YouTubeVideo, 'id' | 'created_at' | 'updated_at'>>;
      };
      admin_users: {
        Row: AdminUser;
        Insert: Omit<AdminUser, 'id' | 'created_at' | 'last_login'>;
        Update: Partial<Omit<AdminUser, 'id' | 'created_at'>>;
      };
    };
  };
}
