import { useCallback, useEffect, useMemo, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Pins from "./pages/Pins";
import MovieDetails from "./pages/MovieDetails";
import NavBar from "./components/NavBar";
import { moviesData } from "./data/movies";

const PINNED_MOVIES_KEY = "pinnedMovies";

function readPinnedMovieIds() {
  try {
    const savedPins = localStorage.getItem(PINNED_MOVIES_KEY);
    const parsedPins = savedPins ? JSON.parse(savedPins) : [];
    return Array.isArray(parsedPins) ? parsedPins : [];
  } catch (error) {
    console.error("Error reading pinned movies:", error);
    return [];
  }
}

function App() {
  const [movies, setMovies] = useState(() => {
    const pinnedIds = readPinnedMovieIds();

    return moviesData.map((movie) => ({
      ...movie,
      isPinned: pinnedIds.includes(movie.id),
    }));
  });

  useEffect(() => {
    try {
      const pinnedIds = movies
        .filter((movie) => movie.isPinned)
        .map((movie) => movie.id);
      localStorage.setItem(PINNED_MOVIES_KEY, JSON.stringify(pinnedIds));
    } catch (error) {
      console.error("Error saving pinned movies:", error);
    }
  }, [movies]);

  const togglePin = useCallback((movieId) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === movieId ? { ...movie, isPinned: !movie.isPinned } : movie,
      ),
    );
  }, []);

  const clearPins = useCallback(() => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.isPinned ? { ...movie, isPinned: false } : movie,
      ),
    );
  }, []);

  const pinnedMovies = useMemo(
    () => movies.filter((movie) => movie.isPinned),
    [movies],
  );

  return (
    <HashRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home movies={movies} togglePin={togglePin} />} />
        <Route
          path="/search"
          element={<Search movies={movies} togglePin={togglePin} />}
        />
        <Route
          path="/pins"
          element={
            <Pins
              pinnedMovies={pinnedMovies}
              togglePin={togglePin}
              clearPins={clearPins}
            />
          }
        />
        <Route
          path="/movie/:movieName"
          element={<MovieDetails movies={movies} togglePin={togglePin} />}
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
