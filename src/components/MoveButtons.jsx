import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function MoveButtons({ onPrev, onNext }) {
  return (
    <div className="fixed left-0 right-0 top-1/2 -translate-y-1/2 z-40 flex justify-between px-13 pointer-events-none">
      {/* Previous Button - Hidden on mobile */}
      <button
        onClick={onPrev}
        className="hidden sm:flex border-2 border-white/50 pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/10 backdrop-blur-sm text-white items-center justify-center hover:bg-black/30 transition-all duration-300"
        aria-label="Previous movie"
      >
        <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Next Button - Hidden on mobile */}
      <button
        onClick={onNext}
        className="hidden sm:flex border-2 border-white/50 pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/10 backdrop-blur-sm text-white items-center justify-center hover:bg-black/30 transition-all duration-300"
        aria-label="Next movie"
      >
        <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}

export default MoveButtons;
