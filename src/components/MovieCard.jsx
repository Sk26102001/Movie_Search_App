import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  IconButton,
  Box,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { useFavorites } from '../context/FavoritesContext';

function MovieCard({ title, poster, releaseDate, onClick, imdbID, movieData }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const fav = isFavorite(imdbID);

  const toggleFavorite = () => {
    fav ? removeFavorite(imdbID) : addFavorite(movieData);
  };

  return (
    <Card sx={{ maxWidth: 300, position: 'relative' }}>
      <CardActionArea onClick={onClick}>
        <CardMedia
  component="img"
  height="450"
  image={poster !== 'N/A' ? poster : '/fallback.jpg'}
  alt={title}
/>

        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            Release Date: {releaseDate}
          </Typography>
        </CardContent>
      </CardActionArea>

      {/* YouTube Trailer Embed */}
      <Box sx={{ mt: 1, px: 2 }}>
     
      </Box>

      <IconButton
        onClick={toggleFavorite}
        sx={{ position: 'absolute', top: 8, right: 8, color: fav ? 'red' : 'grey' }}
      >
        {fav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Card>
  );
}

export default MovieCard;

