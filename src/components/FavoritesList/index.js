import React from 'react';
import MovieCard from '../MovieCard';
import './style.css';

const FavoritesList = ({ favorites, onRemoveFavorite, onSelectMovie }) => {
  if (favorites.length === 0) {
    return <div className="favorites-empty">Your favorites list is empty.</div>;
  }

  return (
    <div className="favorites-list">
      {favorites.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={onSelectMovie}
          onRemoveFavorite={onRemoveFavorite}
          isFavorite={true}
        />
      ))}
    </div>
  );
};

export default FavoritesList;