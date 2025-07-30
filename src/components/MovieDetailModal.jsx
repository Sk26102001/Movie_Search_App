
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  CircularProgress,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export default function MovieDetailModal({ imdbID, open, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trailerId, setTrailerId] = useState(null);

  useEffect(() => {
    const fetchMovieDetailsAndTrailer = async () => {
      if (!imdbID) return;

      setLoading(true);
      try {
        const { data } = await axios.get(
          `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}`
        );
        setDetails(data);

        const ytRes = await axios.get(
          'https://www.googleapis.com/youtube/v3/search',
          {
            params: {
              part: 'snippet',
              q: `${data.Title} official trailer`,
              key: YOUTUBE_API_KEY,
              maxResults: 1,
              type: 'video',
            },
          }
        );

        const videoId = ytRes.data.items?.[0]?.id?.videoId;
        setTrailerId(videoId);
      } catch (error) {
        console.error('Failed to fetch details or trailer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetailsAndTrailer();
  }, [imdbID]);

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') onClose();
      }}
      maxWidth="sm"
      fullWidth
    >
      <Box sx={{ position: 'relative', p: 2 }}>
        {/* <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton> */}
        <IconButton
  onClick={onClose}
  sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
>
  <CloseIcon />
  {/* <Typography variant="body2">X</Typography> */}
</IconButton>


        <DialogTitle sx={{ pr: 5 }}>
          {details?.Title || 'Loading...'}
        </DialogTitle>

        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
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

              {trailerId && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    🎥 Trailer
                  </Typography>
                  <iframe
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${trailerId}`}
                    title={`${details.Title} Trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </Box>
              )}
            </>
          ) : (
            <Typography>No details found.</Typography>
          )}
        </DialogContent>
      </Box>
    </Dialog>
  );
}
