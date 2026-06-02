// pages/MovieDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaCalendar,
  FaStar,
  FaThumbtack,
  FaArrowLeft,
  FaUser,
  FaUsers,
} from "react-icons/fa";

function MovieDetails({ movies, togglePin }) {
  const { movieName } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const foundMovie = movies.find(
      (m) => m.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === movieName,
    );
    setMovie(foundMovie);
  }, [movieName, movies]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Movie Not Found</h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl bg-white text-black font-semibold cursor-pointer"
          >
            Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="
          fixed
          top-4
          left-4
          z-50
          w-12
          h-12
          rounded-full
          bg-white/10
          backdrop-blur-xl
          border
          border-white/10
          flex
          items-center
          justify-center
          cursor-pointer
          hover:bg-white/20
          transition-all
        "
      >
        <FaArrowLeft />
      </button>

      {/* Hero */}
      <section className="relative h-[70vh] overflow-hidden">
        <img
          src={movie.bgPoster || movie.poster}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-end pb-16">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-3 mb-5">
              <span className="px-4 py-2 rounded-full bg-transparent border border-white/20 text-sm">
                <FaCalendar className="inline mr-2" />
                {movie.year}
              </span>

              <span className="px-4 py-2 rounded-full bg-transparent border border-white/20 text-sm">
                <FaStar className="inline mr-2 text-yellow-400" />
                {movie.rating}/10
              </span>

              <span className="px-4 py-2 rounded-full bg-transparent border border-white/20 text-sm">
                {movie.genre}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-5">
              {movie.title}
            </h1>

            <p className="text-gray-300 text-lg max-w-2xl">
              {movie.description}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[350px_1fr] gap-10">
          {/* Poster */}
          <div>
            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-xl
                shadow-2xl
              "
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-8">
            {/* About */}
            <div
              className="
                bg-white/5
                border
                border-white/10
                rounded-3xl
                p-6
                backdrop-blur-xl
              "
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">About the Movie</h2>

                <button
                  onClick={() => togglePin(movie.id)}
                  className={`
                    cursor-pointer
                    group/pin

                    w-10
                    h-10

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
                    transition-all
                    duration-300

                    hover:bg-black/30
                  `}
                >
                  <FaThumbtack
                    className={`
                      text-sm
                      transition-transform
                      duration-300
                      group-hover/pin:rotate-12
                      ${movie.isPinned ? "rotate-45" : ""}
                    `}
                  />
                </button>
              </div>

              <p className="text-gray-300 leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* Director */}
            <div
              className="
                bg-white/5
                border
                border-white/10
                rounded-3xl
                p-6
                backdrop-blur-xl
              "
            >
              <div className="flex items-center gap-4">
                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-white/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  <FaUser size={20} />
                </div>

                <div>
                  <p className="text-sm text-gray-400">Director</p>
                  <h3 className="text-xl font-semibold">{movie.director}</h3>
                </div>
              </div>
            </div>

            {/* Cast */}
            <div
              className="
                bg-white/5
                border
                border-white/10
                rounded-3xl
                p-6
                backdrop-blur-xl
              "
            >
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-white/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  <FaUsers size={20} />
                </div>

                <div>
                  <p className="text-sm text-gray-400">Cast</p>
                  <h3 className="text-xl font-semibold">Main Actors</h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {movie.cast.map((actor) => (
                  <span
                    key={actor}
                    className="
                      px-4
                      py-2
                      rounded-full
                      bg-white/10
                      border
                      border-white/10
                    "
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Release Year</p>
                <h3 className="text-2xl font-bold mt-1">{movie.year}</h3>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Rating</p>
                <h3 className="text-2xl font-bold mt-1 text-yellow-400">
                  {movie.rating}/10
                </h3>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Genre</p>
                <h3 className="text-2xl font-bold mt-1">{movie.genre}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MovieDetails;
