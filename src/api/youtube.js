import axios from 'axios';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const fetchTrailer = async (title) => {
  try {
    const query = `${title} official trailer`;

    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          part: 'snippet',
          q: query,
          key: YOUTUBE_API_KEY,
          maxResults: 1,
          type: 'video',
          videoEmbeddable: 'true',
        },
      }
    );

    const videoId = response.data.items[0]?.id?.videoId;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch (error) {
    console.error('Failed to fetch trailer:', error);
    return null;
  }
};
