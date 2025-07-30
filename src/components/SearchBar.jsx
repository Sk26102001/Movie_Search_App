
import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { Typewriter } from 'react-simple-typewriter';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

function SearchBar({ query, onChange, onSearch, onSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async () => {
    if (query.length < 2) return setSuggestions([]);

    setLoading(true);
    let all = [];

    try {
      for (let page = 1; page <= 1; page++) {
        const res = await axios.get(`https://www.omdbapi.com/`, {
          params: {
            apikey: API_KEY,
            s: query,
            page,
          },
        });

        if (res.data.Search) {
          all = [...all, ...res.data.Search];
        }
      }

      const unique = Array.from(new Map(all.map(m => [m.imdbID, m])).values());
      setSuggestions(unique);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query) fetchSuggestions();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <Autocomplete
      freeSolo
      autoHighlight
      options={suggestions}
      getOptionLabel={(option) =>
        typeof option === 'string'
          ? option
          : `${option.Title} (${option.Year})`
      }
      onInputChange={(event, newInputValue) => {
        if (event) {
          onChange({ target: { value: newInputValue } });
        }
      }}
      onChange={(event, value) => {
        if (typeof value === 'string') {
          onChange({ target: { value } });
          onSelect();
        } else if (value?.Title) {
          onChange({ target: { value: value.Title } });
          onSelect();
        }
      }}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <img
            loading="lazy"
            width="40"
            src={option.Poster !== 'N/A' ? option.Poster : '/fallback.jpg'}
            alt=""
            style={{ marginRight: 8 }}
          />
          {option.Title} ({option.Year})
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={
            <Typewriter
              words={[
                'Search Iron Man...',
                'Search Avengers...',
                'Search Interstellar...',
                'Search Dhoom...',
              ]}
              loop={true}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          }
          variant="outlined"
          fullWidth
          value={query}
          sx={{ marginTop: 2 }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress size={20} />}
                <InputAdornment position="end">
                  <IconButton onClick={onSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              </>
            ),
          }}
        />
      )}
    />
  );
}

export default SearchBar;
