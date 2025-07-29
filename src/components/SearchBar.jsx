import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

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
      options={suggestions.map((option) => option.Title)}
      onInputChange={(event, newInputValue) => {
        if (event) {
          onChange({ target: { value: newInputValue } });
        }
      }}
      onChange={(event, value) => {
        if (value) {
          onChange({ target: { value } }); // update query
          onSelect(); // automatically search
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Movies"
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
