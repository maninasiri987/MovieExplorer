function DotsForCards({ totalDots, activeDot, onDotClick }) {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-16 sm:top-20 flex items-center justify-center gap-1 sm:gap-1.5 z-50 px-2">
      {Array.from({ length: totalDots }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick?.(index)}
          aria-label={`Go to movie ${index + 1}`}
          className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center touch-manipulation"
        >
          <span
            className={`block rounded-full transition-all duration-300 ${
              index === activeDot
                ? "w-5 sm:w-8 h-1.5 sm:h-2 bg-white/75"
                : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/20 hover:bg-white/80"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default DotsForCards;
