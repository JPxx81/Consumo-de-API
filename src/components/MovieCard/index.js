import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './style.css';

const MovieCard = ({ movie, onClick, onAddFavorite, onRemoveFavorite, isFavorite }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Image';

  const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Previne o clique de propagar para o card
    if (isFavorite) {
      onRemoveFavorite(movie.id);
    } else {
      onAddFavorite(movie);
    }
  };

  return (
    <div className="movie-card" onClick={() => onClick(movie)}>
      <img src={posterUrl} alt={movie.title} />
      <div className="card-info">
        <h3>{movie.title}</h3>
        <p>{year}</p>
        <button onClick={handleFavoriteClick} className="favorite-button">
          {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;