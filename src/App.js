import React, { useState, useEffect } from 'react';
import { searchMovies } from './api/tmdb';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import MovieDetails from './components/MovieDetails';
import FavoritesList from './components/FavoritesList';
import Pagination from './components/Pagination';
import './App.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async (newQuery, page = 1) => {
    if (!newQuery) {
      setMovies([]);
      return;
    }
    setLoading(true);
    setError(null);
    setSelectedMovieId(null);
    setQuery(newQuery);
    setCurrentPage(page);
    try {
      const data = await searchMovies(newQuery, page);
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError("Failed to fetch movies. Please check your network connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = (movie) => {
    if (!favorites.some(fav => fav.id === movie.id)) {
      setFavorites(prevFavorites => [...prevFavorites, movie]);
    }
  };

  const handleRemoveFavorite = (movieId) => {
    setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== movieId));
  };

  const isMovieFavorite = (movieId) => {
    return favorites.some(fav => fav.id === movieId);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      handleSearch(query, page);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Movie Finder</h1>
      </header>

      <SearchBar onSearch={handleSearch} />

      {selectedMovieId ? (
        <MovieDetails
          movieId={selectedMovieId}
          onAddFavorite={handleAddFavorite}
          onRemoveFavorite={handleRemoveFavorite}
          isFavorite={isMovieFavorite(selectedMovieId)}
          onBack={() => setSelectedMovieId(null)}
        />
      ) : (
        <>
          {loading && <div className="loading">Loading...</div>}
          {error && <div className="error">{error}</div>}
          
          <div className="search-results-section">
            <h2 className="section-title">Search Results</h2>
            <div className="movie-list">
              {movies.length > 0 ? (
                movies.map(movie => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => setSelectedMovieId(movie.id)}
                    onAddFavorite={handleAddFavorite}
                    onRemoveFavorite={handleRemoveFavorite}
                    isFavorite={isMovieFavorite(movie.id)}
                  />
                ))
              ) : (
                query && !loading && !error && <div className="no-results">No movies found. Try another search.</div>
              )}
            </div>
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
          </div>

          <hr />

          <div className="favorites-section">
            <h2 className="section-title">My Favorites</h2>
            <FavoritesList
              favorites={favorites}
              onRemoveFavorite={handleRemoveFavorite}
              onSelectMovie={(movie) => setSelectedMovieId(movie.id)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default App;