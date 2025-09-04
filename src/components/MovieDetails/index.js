import React, { useState, useEffect } from 'react';
import { getMovieDetails } from '../../api/tmdb';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './style.css';

const MovieDetails = ({ movieId, onAddFavorite, onRemoveFavorite, isFavorite, onBack }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const details = await getMovieDetails(movieId);
        setMovie(details);
      } catch (err) {
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movieId]);

  if (loading) {
    return <div className="loading">Loading movie details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!movie) {
    return null;
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const director = movie.credits?.crew.find((member) => member.job === 'Director');
  const cast = movie.credits?.cast.slice(0, 5).map((actor) => actor.name).join(', ');

  const handleFavoriteClick = () => {
    if (isFavorite) {
      onRemoveFavorite(movie.id);
    } else {
      onAddFavorite(movie);
    }
  };

  return (
    <div className="movie-details-container">
      <button className="back-button" onClick={onBack}>
        &larr; Back to results
      </button>
      <div className="details-content">
        <img src={posterUrl} alt={movie.title} className="details-poster" />
        <div className="details-info">
          <h2>{movie.title}</h2>
          <div className="favorite-action">
            <button onClick={handleFavoriteClick}>
              {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
              <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
            </button>
          </div>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10</p>
          <p><strong>Director:</strong> {director ? director.name : 'N/A'}</p>
          <p><strong>Cast:</strong> {cast ? cast : 'N/A'}</p>
          <p><strong>Sinopse:</strong> {movie.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;