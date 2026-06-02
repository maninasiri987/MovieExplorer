import { FaCalendar, FaStar, FaThumbtack } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie, active, togglePin }) {
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

  // Handle card click navigation
  const handleCardClick = () => {
    const url = `/movie/${getMovieUrl(movie.title)}`;
    navigate(url);
  };

  return (
    <div
      onClick={active ? handleCardClick : undefined}
      className={`group w-75 h-100 bg-zinc-800 rounded-2xl overflow-hidden shrink-0 snap-center relative transition-all duration-300 ${
        active ? "cursor-pointer" : "cursor-default"
      }`}
    >
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-full object-cover"
      />

      {/* Gradient Shadow - Hidden on mobile */}
      <div
        className={`
          absolute inset-0
          bg-gradient-to-t
          from-black/90
          via-black/40
          to-transparent
          transition-opacity
          duration-300
          ${
            !isMobile && active
              ? "opacity-0 group-hover:opacity-100"
              : "opacity-0 pointer-events-none"
          }
        `}
      />

      {/* Content */}
      <div className="w-full h-1/2 absolute bottom-0 left-0 p-5 z-10">
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-white text-3xl font-bold pb-3 whitespace-nowrap">
              {movie.title}
            </h2>
          </div>

          <div className="flex text-center flex-col text-zinc-900 text-sm py-3 gap-2 w-fit relative">
            <span className="text-zinc-200 rounded-md text-sm bg-zinc-700/50 backdrop-blur-sm w-full p-1">
              {movie.genre}
            </span>

            <span className="flex text-center flex-row gap-1 bg-zinc-500/50 rounded-md p-1 backdrop-blur-sm w-full">
              <FaCalendar className="pt-1" />
              {movie.year}
            </span>

            <span className="flex text-center flex-row gap-1 text-yellow-500 bg-yellow-400/50 rounded-md p-1 backdrop-blur-sm w-full">
              <FaStar className="pt-1" />
              {movie.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Pin Button - Always visible on mobile when active */}
      {active && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePin(movie.id);
          }}
          className={`
            cursor-pointer
            group/pin
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
            ${
              movie.isPinned
                ? "border-yellow-500 bg-yellow-500/20 text-yellow-500"
                : "border-white/50 bg-black/10 text-white"
            }

            ${isMobile ? "" : "backdrop-blur-sm"}

            ${
              isMobile
                ? // Mobile styles - always visible with slight scale, NO backdrop-blur
                  `opacity-100 translate-x-0 translate-y-0 scale-100
                   active:scale-95 transition-transform duration-150`
                : // Desktop styles - hover effect WITH backdrop-blur
                  `opacity-0 translate-x-4 translate-y-4 scale-75
                   group-hover:opacity-100
                   group-hover:translate-x-0
                   group-hover:translate-y-0
                   group-hover:scale-100
                   transition-all duration-300`
            }

            hover:bg-black/30
          `}
          aria-label={movie.isPinned ? "Unpin movie" : "Pin movie"}
        >
          <FaThumbtack
            className={`
              text-sm
              transition-transform
              duration-300
              ${!isMobile && "group-hover/pin:rotate-12"}
              ${movie.isPinned ? "rotate-45" : ""}
            `}
          />
        </button>
      )}
    </div>
  );
}

export default MovieCard;
