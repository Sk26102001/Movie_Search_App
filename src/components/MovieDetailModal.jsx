import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export default function MovieDetailModal({ imdbID, open, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (imdbID) {
      setLoading(true);
      axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`)
        .then((res) => {
          setDetails(res.data);
          setLoading(false);
        });
    }
  }, [imdbID]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{details?.Title || 'Loading...'}</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : details ? (
          <>
            <img
              src={details.Poster}
              alt={details.Title}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
            <Typography><strong>Year:</strong> {details.Year}</Typography>
            <Typography><strong>Genre:</strong> {details.Genre}</Typography>
            <Typography><strong>Director:</strong> {details.Director}</Typography>
            <Typography><strong>Actors:</strong> {details.Actors}</Typography>
            <Typography><strong>Plot:</strong> {details.Plot}</Typography>
            <Typography><strong>IMDB Rating:</strong> {details.imdbRating}</Typography>
          </>
        ) : (
          <Typography>No details found.</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
