
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Box,
  Button,
  useTheme,
} from '@mui/material';

import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import SkeletonCard from './components/SkeletonCard';
import MovieDetailModal from './components/MovieDetailModal';
import ThemeToggle from './components/ThemeToggle';
import { searchMovies } from './api/omdb';

function App({ toggleTheme }) {
  const theme = useTheme();

  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const predefinedSuggestions = [
    'Dhoom 2',
    'Dhoom 3',
    'Inception',
    'Avengers',
    'Interstellar',
    'The Dark Knight',
  ];

  useEffect(() => {
    const loadSuggestions = async () => {
      setLoading(true);
      const allMovies = [];

      for (const title of predefinedSuggestions) {
        const { results } = await searchMovies(title, 1);
        if (results?.length > 0) allMovies.push(results[0]);
      }

      setMovies(allMovies);
      setLoading(false);
    };

    loadSuggestions();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    const { results, totalResults } = await searchMovies(query, 1);
    setMovies(results);
    setTotalResults(totalResults);
    setPage(1);
    setLoading(false);
  };

  const handlePageChange = async (newPage) => {
    setLoading(true);
    const { results } = await searchMovies(query, newPage);
    setMovies(results);
    setPage(newPage);
    setLoading(false);
  };

  const handleCardClick = (imdbID) => {
    setSelectedMovieId(imdbID);
    setOpenModal(true);
  };

  const totalPages = Math.ceil(totalResults / 10);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(https://wallpaperaccess.com/full/329583.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        px: 2,
        py: 6,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(0, 0, 0, 0.6)'
            : 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 4,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.7)'
            : '0 8px 32px rgba(31, 38, 135, 0.37)',
          padding: 4,
          color: theme.palette.text.primary,
        }}
      >
        <Box textAlign="right" mb={2}>
          <ThemeToggle toggleTheme={toggleTheme} />
        </Box>

        <Typography
          variant="h3"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          🎬
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(to right, #3f51b5, #9c27b0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Movie Masti
          </Box>
        </Typography>

        <SearchBar
          query={query}
          onChange={(e) => setQuery(e.target.value)}
          onSearch={handleSearch}
          onSelect={handleSearch}
        />

        <Typography variant="h5" sx={{ mt: 4, fontWeight: 600 }}>
          {query ? 'Search Results' : 'Popular Movie Suggestions'}
        </Typography>

        <Grid container spacing={3} mt={1}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <SkeletonCard />
                </Grid>
              ))
            : movies.map((movie) => (
                <Grid item xs={12} sm={6} md={4} key={movie.imdbID}>
                  <MovieCard
                    title={movie.Title}
                    poster={movie.Poster}
                    releaseDate={movie.Year}
                    imdbID={movie.imdbID}
                    movieData={movie}
                    onClick={() => handleCardClick(movie.imdbID)}
                  />
                </Grid>
              ))}
        </Grid>

        {query && movies.length > 0 && (
          <Box textAlign="center" mt={4}>
            <Button
              variant="contained"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              sx={{ mx: 1, px: 4, borderRadius: 2 }}
            >
              Prev
            </Button>

            <Button
              variant="contained"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              sx={{ mx: 1, px: 4, borderRadius: 2 }}
            >
              Next
            </Button>

            <Typography variant="body2" mt={2}>
              Page {page} of {totalPages}
            </Typography>
          </Box>
        )}

        <MovieDetailModal
          imdbID={selectedMovieId}
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      </Box>
    </Box>
  );
}

export default App;
