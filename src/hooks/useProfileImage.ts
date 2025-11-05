import { useState } from 'react';

const STORAGE_KEY = 'profile_image_url';

export function useProfileImage() {
  const [imageUrl, setImageUrl] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || '/minha foto.png';
  });

  const updateImageUrl = (url: string) => {
    setImageUrl(url);
    localStorage.setItem(STORAGE_KEY, url);
  };

  return { imageUrl, updateImageUrl };
}
