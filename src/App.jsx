import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Pins from "./pages/Pins";
import NavBar from "./components/NavBar";
import { useState, useEffect } from "react";

import poster1 from "./assets/Inception_(2010)_theatrical_poster.jpg";
import poster2 from "./assets/Interstellar_film_poster.jpg";
import poster3 from "./assets/The_Dark_Knight_(2008_film).jpg";
import poster4 from "./assets/Fight_Club_poster.jpg";
import poster5 from "./assets/The_Matrix.png";
import poster6 from "./assets/Batman_Three_Jokers.jpg";
import poster7 from "./assets/Parasite_(2019_film).png";
import poster8 from "./assets/Avengers_Endgame_poster.jpg";

import bgPoster1 from "./assets/bg/Inception_(2010)_theatrical_poster.jpg";
import bgPoster2 from "./assets/bg/Interstellar_film_poster.jpg";
import bgPoster3 from "./assets/bg/The_Dark_Knight_(2008_film).jpg";
import bgPoster4 from "./assets/bg/Fight_Club_poster.jpg";
import bgPoster5 from "./assets/bg/The_Matrix.png";
import bgPoster6 from "./assets/bg/Batman_Three_Jokers.jpg";
import bgPoster7 from "./assets/bg/Parasite_(2019_film).png";
import bgPoster8 from "./assets/bg/Avengers_Endgame_poster.jpg";

function App() {
  const [movies, setMovies] = useState(() => {
    // Load saved pins from localStorage
    const savedPins = localStorage.getItem("pinnedMovies");
    const pinnedIds = savedPins ? JSON.parse(savedPins) : [];

    const initialMovies = [
      {
        id: 1,
        title: "Inception",
        year: 2010,
        rating: 8.8,
        genre: "Sci-Fi",
        poster: poster1,
        bgPoster: bgPoster1,
        isPinned: false,
      },
      {
        id: 2,
        title: "Interstellar",
        year: 2014,
        rating: 8.7,
        genre: "Sci-Fi",
        poster: poster2,
        bgPoster: bgPoster2,
        isPinned: false,
      },
      {
        id: 3,
        title: "The Dark Knight",
        year: 2008,
        rating: 9.0,
        genre: "Action",
        poster: poster3,
        bgPoster: bgPoster3,
        isPinned: false,
      },
      {
        id: 4,
        title: "Fight Club",
        year: 1999,
        rating: 8.8,
        genre: "Drama",
        poster: poster4,
        bgPoster: bgPoster4,
        isPinned: false,
      },
      {
        id: 5,
        title: "The Matrix",
        year: 1999,
        rating: 8.7,
        genre: "Sci-Fi",
        poster: poster5,
        bgPoster: bgPoster5,
        isPinned: false,
      },
      {
        id: 6,
        title: "Joker",
        year: 2019,
        rating: 8.4,
        genre: "Crime",
        poster: poster6,
        bgPoster: bgPoster6,
        isPinned: false,
      },
      {
        id: 7,
        title: "Parasite",
        year: 2019,
        rating: 8.5,
        genre: "Thriller",
        poster: poster7,
        bgPoster: bgPoster7,
        isPinned: false,
      },
      {
        id: 8,
        title: "Avengers: Endgame",
        year: 2019,
        rating: 8.4,
        genre: "Action",
        poster: poster8,
        bgPoster: bgPoster8,
        isPinned: false,
      },
    ];

    // Mark pinned movies based on saved IDs
    return initialMovies.map((movie) => ({
      ...movie,
      isPinned: pinnedIds.includes(movie.id),
    }));
  });

  // Save pinned movies to localStorage whenever they change
  useEffect(() => {
    const pinnedIds = movies
      .filter((movie) => movie.isPinned)
      .map((movie) => movie.id);
    localStorage.setItem("pinnedMovies", JSON.stringify(pinnedIds));
  }, [movies]);

  const togglePin = (movieId) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === movieId ? { ...movie, isPinned: !movie.isPinned } : movie,
      ),
    );
  };

  const pinnedMovies = movies.filter((movie) => movie.isPinned);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <Home movies={movies} setMovies={setMovies} togglePin={togglePin} />
          }
        />
        <Route
          path="/search"
          element={<Search movies={movies} togglePin={togglePin} />}
        />
        <Route
          path="/pins"
          element={<Pins pinnedMovies={pinnedMovies} togglePin={togglePin} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
