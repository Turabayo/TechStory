import { useEffect, useState } from 'react';

export interface Story {
  _id: string;
  title: string;
  author: string;
  storyType: 'text' | 'voice' | 'video';
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export function useAdminStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stories');
      const data = await res.json();
      setStories(data);
    } catch (err) {
      setError('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return { stories, loading, error, refetch: fetchStories };
}
