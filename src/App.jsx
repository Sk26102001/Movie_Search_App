
import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Grid,
  Box,
  Button,
  useTheme,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import SkeletonCard from './components/SkeletonCard';
import MovieDetailModal from './components/MovieDetailModal';
import ThemeToggle from './components/ThemeToggle';
import { searchMovies } from './api/omdb';

const backgroundImages = [
  'https://wallpaperaccess.com/full/329583.jpg',
  'https://wallpaperaccess.com/full/336878.jpg',
  'https://wallpaperaccess.com/full/288779.jpg',
  'https://wallpaperaccess.com/full/1082993.jpg',
  'https://wallpaperaccess.com/full/2441644.jpg',
  'https://wallpaperaccess.com/full/125561.jpg',
  'https://wallpaperaccess.com/full/547166.jpg',
];

function BackgroundSlideshow({ children }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {backgroundImages.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: 1.5 }}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>
        {children}
      </div>
    </>
  );
}

function App({ toggleTheme }) {
  const theme = useTheme();

  const [query, setQuery] = useState('');
  const lastQueryRef = useRef('');
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    lastQueryRef.current = query;
    setLoading(true);
    const { results, totalResults } = await searchMovies(query, 1);
    setMovies(results);
    setTotalResults(totalResults);
    setPage(1);
    setLoading(false);
  };

  const handlePageChange = async (newPage) => {
    setLoading(true);
    const { results } = await searchMovies(lastQueryRef.current, newPage);
    setMovies(results);
    setPage(newPage);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardClick = (imdbID) => {
    setSelectedMovieId(imdbID);
    setOpenModal(true);
  };

  const totalPages = Math.ceil(totalResults / 10);

  return (
    <BackgroundSlideshow>
      <Box
        sx={{
          minHeight: '100vh',
          px: 2,
          py: 6,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          position: 'relative',
          zIndex: 1,
          pointerEvents: 'auto',
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '1200px',
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(0, 0, 0, 0.6)'
                : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 4,
            boxShadow:
              theme.palette.mode === 'dark'
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
      <Grid item xs={12} sm={6} md={4} key={i} sx={{ display: 'flex', justifyContent: 'center' }}>
        <SkeletonCard />
      </Grid>
    ))

              : movies.length === 0 ? (
                  <Grid item xs={12} sx={{ textAlign: 'center', py: 10 }}>
                    <img
                      src="https://assets9.lottiefiles.com/packages/lf20_HpFqiS.json"
                      alt="No movies found"
                      style={{ width: 150, height: 150, marginBottom: 20, opacity: 0.6 }}
                    />
                    <Typography variant="h6" color="textSecondary">
                      No movies found. Try something more popular like{' '}
                      <Box component="span" sx={{ fontWeight: 'bold' }}>
                        Batman
                      </Box>
                      !
                    </Typography>
                  </Grid>
                ) : (
                  movies.map((movie, index) => (
                    <Grid item xs={12} sm={6} md={4} key={movie.imdbID}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <MovieCard
                          title={movie.Title}
                          poster={movie.Poster}
                          releaseDate={movie.Year}
                          imdbID={movie.imdbID}
                          movieData={movie}
                          onClick={() => handleCardClick(movie.imdbID)}
                        />
                      </motion.div>
                    </Grid>
                  ))
                )}
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

        <AnimatePresence>
          {showScrollTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                width: 48,
                height: 48,
                backgroundColor: '#3f51b5',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                zIndex: 1000,
              }}
              onClick={() =>
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            >
              <KeyboardArrowUpIcon />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </BackgroundSlideshow>
  );
}

export default App;
