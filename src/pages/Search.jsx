import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaStar,
  FaThumbtack,
} from "react-icons/fa";

function Search({ movies, togglePin }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Helper function to convert title to URL-friendly format
  const getMovieUrl = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  };

  // Get unique genres from movies
  const genres = ["All", ...new Set(movies.map((movie) => movie.genre))];

  // Filter and sort movies (derived from local data, so no extra render needed)
  const filteredMovies = useMemo(() => {
    let results = [...movies];

    // Search filter
    if (searchTerm) {
      results = results.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Genre filter
    if (selectedGenre !== "All") {
      results = results.filter((movie) => movie.genre === selectedGenre);
    }

    // Sorting
    switch (sortBy) {
      case "rating-high":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-low":
        results.sort((a, b) => a.rating - b.rating);
        break;
      case "year-new":
        results.sort((a, b) => b.year - a.year);
        break;
      case "year-old":
        results.sort((a, b) => a.year - b.year);
        break;
      default:
        break;
    }

    return results;
  }, [searchTerm, selectedGenre, sortBy, movies]);

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedGenre("All");
    setSortBy("relevance");
  };

  const handleMovieClick = (movie) => {
    navigate(`/movie/${getMovieUrl(movie.title)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-20 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
          Search Movies
        </h1>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <FaSearch className="text-gray-400 text-lg" />
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by movie title..."
            className="w-full pl-12 pr-12 py-4 bg-gray-800/50 backdrop-blur-sm text-white rounded-xl border border-gray-700 focus:border-blue-500 focus:outline-none transition-all"
            autoFocus
          />

          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors z-10"
              aria-label="Clear search"
            >
              <FaTimes className="text-lg" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button (Mobile) */}
        <div className="md:hidden flex justify-center mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg text-white"
          >
            <FaFilter />
            Filters
          </button>
        </div>

        {/* Filters Section */}
        <div className={`${showFilters ? "block" : "hidden"} md:block mb-8`}>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex flex-wrap gap-2">
                <span className="text-gray-400 mr-2">Genre:</span>
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      selectedGenre === genre
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating-high">Rating: High to Low</option>
                  <option value="rating-low">Rating: Low to High</option>
                  <option value="year-new">Year: Newest First</option>
                  <option value="year-old">Year: Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-400">
          Found {filteredMovies.length} movie
          {filteredMovies.length !== 1 ? "s" : ""}
        </div>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <div
            className={`
            grid
            gap-4 sm:gap-6
            ${isMobile ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}
          `}
          >
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie)}
                className={`
                  relative bg-gray-800 rounded-xl overflow-hidden cursor-pointer
                  ${!isMobile && "group transition-transform hover:scale-105"}
                `}
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay with movie info - Hidden on mobile, visible on desktop hover */}
                  <div
                    className={`
                      absolute inset-0
                      bg-gradient-to-t
                      from-black via-black/50 to-transparent
                      transition-opacity duration-300
                      ${!isMobile ? "opacity-0 group-hover:opacity-100" : "hidden"}
                    `}
                  >
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <h3 className="text-white text-sm sm:text-lg font-bold truncate">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-300 mt-1">
                        <span>{movie.year}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FaStar className="text-yellow-500 text-xs" />
                          {movie.rating}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{movie.genre}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile: Always show movie info at bottom */}
                  {isMobile && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2 p-sm-3">
                      <h3 className="text-white text-xs sm:text-sm font-bold truncate">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-300 mt-1">
                        <span>{movie.year}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FaStar className="text-yellow-500 text-xs" />
                          {movie.rating}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pin Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePin(movie.id);
                  }}
                  className={`
                    cursor-pointer
                    group/pin
                    absolute
                    bottom-2
                    right-2
                    z-20

                    w-7
                    h-7
                    sm:w-9
                    sm:h-9

                    flex
                    items-center
                    justify-center

                    rounded-full
                    border-2
                    ${
                      movie.isPinned
                        ? "border-yellow-500 bg-yellow-500/20 text-yellow-500"
                        : "border-white/50 bg-black/10 text-white"
                    }

                    backdrop-blur-sm

                    ${
                      isMobile
                        ? // Mobile styles - always visible with touch feedback
                          `opacity-100
                           translate-x-0
                           translate-y-0
                           scale-100
                           active:scale-95
                           transition-transform
                           duration-150`
                        : // Desktop styles - hover effect
                          `opacity-0
                           translate-x-4
                           translate-y-4
                           scale-75
                           group-hover:opacity-100
                           group-hover:translate-x-0
                           group-hover:translate-y-0
                           group-hover:scale-100
                           hover:bg-black/30
                           transition-all
                           duration-300`
                    }
                  `}
                  aria-label={movie.isPinned ? "Unpin movie" : "Pin movie"}
                >
                  <FaThumbtack
                    className={`
                      text-xs
                      sm:text-sm
                      transition-transform
                      duration-300
                      ${!isMobile && "group-hover/pin:rotate-12"}
                      ${movie.isPinned ? "rotate-45" : ""}
                    `}
                  />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No movies found matching your search.
            </p>
            <button
              onClick={clearSearch}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
