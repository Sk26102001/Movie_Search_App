import axios from 'axios';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

export async function searchMovies(query, page = 1) {
  const res = await axios.get(BASE_URL, {
    params: {
      apikey: API_KEY,
      s: query,
      page: page,
    },
  });

  console.log("API response:", res.data); // ← add this

  if (res.data.Response === 'True') {
    return { results: res.data.Search, totalResults: res.data.totalResults };
  } else {
    return { results: [], totalResults: 0 };
  }
}
