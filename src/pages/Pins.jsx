import { FaStar, FaThumbtack, FaTrash } from "react-icons/fa";

function Pins({ pinnedMovies, togglePin }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-20 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
          <FaThumbtack className="inline-block mr-3 text-yellow-500" />
          Pinned Movies
        </h1>

        {/* Pinned Movies Count */}
        <div className="mb-6 text-gray-400 text-center">
          {pinnedMovies.length === 0
            ? "No pinned movies yet"
            : `You have ${pinnedMovies.length} pinned movie${pinnedMovies.length !== 1 ? "s" : ""}`}
        </div>

        {/* Movies Grid */}
        {pinnedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {pinnedMovies.map((movie) => (
              <div
                key={movie.id}
                className="group relative bg-gray-800 rounded-xl overflow-hidden transition-transform hover:scale-105"
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Pinned badge */}
                  <div className="absolute top-2 right-2 bg-yellow-500/90 backdrop-blur-sm rounded-full p-1.5">
                    <FaThumbtack className="text-white text-xs rotate-45" />
                  </div>

                  {/* Overlay with movie info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
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
                </div>

                {/* Unpin Button */}
                <button
                  onClick={() => togglePin(movie.id)}
                  className="
                    cursor-pointer
                    group/unpin
                    absolute
                    bottom-4
                    right-4
                    z-20

                    w-9
                    h-9

                    flex
                    items-center
                    justify-center

                    rounded-full
                    border-2
                    border-red-500/50

                    bg-red-500/20
                    backdrop-blur-sm
                    text-red-500

                    opacity-0
                    translate-x-4
                    translate-y-4
                    scale-75

                    group-hover:opacity-100
                    group-hover:translate-x-0
                    group-hover:translate-y-0
                    group-hover:scale-100

                    hover:bg-red-500/40

                    transition-all
                    duration-300
                  "
                  aria-label="Unpin movie"
                >
                  <FaTrash
                    className="
                      text-sm
                      transition-transform
                      duration-300
                      group-hover/unpin:scale-110
                    "
                  />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FaThumbtack className="text-gray-600 text-6xl mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">No pinned movies yet</p>
            <p className="text-gray-500">
              Pin your favorite movies from the Home or Search page
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pins;
