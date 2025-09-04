import axios from 'axios';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: query,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching for movies:", error);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'credits',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};