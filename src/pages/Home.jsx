import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import MovieCard from "../components/MovieCard";
import DotsForCards from "../components/DotsForCards";
import MoveButtons from "../components/MoveButtons";

function Home({ movies, setMovies, togglePin }) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentBg, setCurrentBg] = useState({
    poster: movies[0]?.bgPoster || movies[0]?.poster,
    key: 0,
  });
  const [nextBg, setNextBg] = useState(null);
  const isManualScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const rafRef = useRef(null);
  const scrollTickingRef = useRef(false);

  // Check if mobile device - optimized with debounce
  useEffect(() => {
    let resizeTimer;

    const checkMobile = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(resizeTimer);
    };
  }, []);

  const displayedMovies = movies;

  // Handle previous button click
  const handlePrev = useCallback(() => {
    const newIndex = Math.max(0, activeIndex - 1);
    smoothScrollToCenter(newIndex);
  }, [activeIndex]);

  // Handle next button click
  const handleNext = useCallback(() => {
    const newIndex = Math.min(displayedMovies.length - 1, activeIndex + 1);
    smoothScrollToCenter(newIndex);
  }, [activeIndex, displayedMovies.length]);

  // Smooth scroll function - optimized for mobile
  const smoothScrollToCenter = useCallback(
    (index, duration = isMobile ? 300 : 500) => {
      const container = containerRef.current;
      if (!container || !container.children[index]) return;

      setActiveIndex(index);

      // Use native smooth scroll on mobile for better performance
      if (isMobile) {
        const child = container.children[index];
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const containerCenter = container.clientWidth / 2;
        const targetScrollLeft = childCenter - containerCenter;

        container.scrollTo({
          left: targetScrollLeft,
          behavior: "smooth",
        });

        setTimeout(() => {
          isManualScrollingRef.current = false;
          updateMobileTransforms();
        }, duration + 50);

        return;
      }

      // Desktop smooth scroll animation
      const child = container.children[index];
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const containerCenter = container.clientWidth / 2;
      const targetScrollLeft = childCenter - containerCenter;
      const startScrollLeft = container.scrollLeft;
      const distance = targetScrollLeft - startScrollLeft;
      const startTime = performance.now();

      isManualScrollingRef.current = true;

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);

        container.scrollLeft = startScrollLeft + distance * easeOutCubic;

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animateScroll);
        } else {
          setTimeout(() => {
            isManualScrollingRef.current = false;
            updateDesktopTransforms();
          }, 100);
        }
      };

      rafRef.current = requestAnimationFrame(animateScroll);
    },
    [isMobile],
  );

  // Handle card click
  const handleCardClick = useCallback(
    (index) => {
      smoothScrollToCenter(index);
    },
    [smoothScrollToCenter],
  );

  // Handle dot click
  const handleDotClick = useCallback(
    (index) => {
      smoothScrollToCenter(index);
    },
    [smoothScrollToCenter],
  );

  // Optimized mobile transforms - NO BLUR
  const updateMobileTransforms = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const center = container.scrollLeft + container.clientWidth / 2;
    const containerWidth = container.clientWidth;

    // Batch DOM operations
    const children = Array.from(container.children);
    children.forEach((childWrapper) => {
      const child = childWrapper.children[0];
      if (!child) return;

      const childCenter =
        childWrapper.offsetLeft + childWrapper.offsetWidth / 2;
      const distanceFromCenter = Math.abs(childCenter - center);
      const distancePercent = Math.min(
        distanceFromCenter / (containerWidth / 2),
        1,
      );

      // Simplified transforms for mobile - NO BLUR
      const scale = Math.max(0.85, 1 - distancePercent * 0.15);
      const opacity = Math.max(0.7, 1 - distancePercent * 0.3);

      // Use transform3d for GPU acceleration
      child.style.transform = `scale3d(${scale}, ${scale}, 1)`;
      child.style.opacity = opacity;
      child.style.filter = "none"; // Explicitly remove any blur
    });
  }, []);

  // Desktop transforms - keep original complex transforms with blur
  const updateDesktopTransforms = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const center = container.scrollLeft + container.clientWidth / 2;
    const containerWidth = container.clientWidth;

    Array.from(container.children).forEach((childWrapper) => {
      const child = childWrapper.children[0];
      if (!child) return;

      const childCenter =
        childWrapper.offsetLeft + childWrapper.offsetWidth / 2;
      const distanceFromCenter = childCenter - center;
      const distancePercent =
        Math.abs(distanceFromCenter) / (containerWidth / 2);

      let rotationY = 0;
      const maxRotation = 60;

      if (distanceFromCenter < 0) {
        const normalizedDistance =
          Math.abs(distanceFromCenter) / (containerWidth / 2);
        rotationY = Math.min(maxRotation, normalizedDistance * maxRotation);
      } else if (distanceFromCenter > 0) {
        const normalizedDistance = distanceFromCenter / (containerWidth / 2);
        rotationY =
          Math.min(maxRotation, normalizedDistance * maxRotation) * -1;
      }

      const rotationX = Math.abs(distancePercent) * 8;
      const rotationZ = (distanceFromCenter / (containerWidth / 2)) * 3;
      const scale = Math.max(0.7, 1 - distancePercent * 0.25);
      const opacity = Math.max(0.6, 1 - distancePercent * 0.4);
      const blur = Math.min(distancePercent * 8, 8); // Keep blur for desktop

      child.style.transform = `
        perspective(1000px)
        rotateY(${rotationY}deg)
        rotateX(${rotationX}deg)
        rotateZ(${rotationZ}deg)
        scale(${scale})
      `;
      child.style.opacity = opacity;
      child.style.filter = `blur(${blur}px)`; // Blur only on desktop
      child.style.zIndex = Math.floor(100 - Math.abs(distanceFromCenter) / 10);

      if (Math.abs(rotationY) > 15) {
        child.style.boxShadow =
          rotationY > 0
            ? "-15px 10px 30px rgba(0,0,0,0.3)"
            : "15px 10px 30px rgba(0,0,0,0.3)";
      } else {
        child.style.boxShadow = "0 20px 40px rgba(0,0,0,0.2)";
      }
    });
  }, []);

  // Optimized scroll handler with requestAnimationFrame throttling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!scrollTickingRef.current) {
        scrollTickingRef.current = true;

        requestAnimationFrame(() => {
          if (!isManualScrollingRef.current) {
            // Batch all scroll-related updates
            const center = container.scrollLeft + container.clientWidth / 2;

            let closestIndex = 0;
            let closestDistance = Infinity;

            // Cache children array
            const children = Array.from(container.children);
            children.forEach((child, index) => {
              const childCenter = child.offsetLeft + child.offsetWidth / 2;
              const distance = Math.abs(center - childCenter);
              if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
              }
            });

            setActiveIndex((prev) =>
              prev !== closestIndex ? closestIndex : prev,
            );

            // Only update transforms relevant to device
            if (isMobile) {
              updateMobileTransforms();
            } else {
              updateDesktopTransforms();
            }
          }

          scrollTickingRef.current = false;
        });
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMobile, updateMobileTransforms, updateDesktopTransforms]);

  // Simplified snap behavior for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScrollEnd = () => {
      if (isManualScrollingRef.current) return;

      clearTimeout(scrollTimeoutRef.current);

      scrollTimeoutRef.current = setTimeout(
        () => {
          if (!container || isManualScrollingRef.current) return;

          const center = container.scrollLeft + container.clientWidth / 2;
          let closestIndex = 0;
          let closestDistance = Infinity;

          const children = Array.from(container.children);
          children.forEach((child, index) => {
            const childCenter = child.offsetLeft + child.offsetWidth / 2;
            const distance = Math.abs(center - childCenter);
            if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = index;
            }
          });

          // Larger threshold for mobile to reduce unnecessary snaps
          const snapThreshold = isMobile ? 50 : 30;
          const activeChild = container.children[closestIndex];
          if (activeChild) {
            const activeChildCenter =
              activeChild.offsetLeft + activeChild.offsetWidth / 2;
            const currentCenter =
              container.scrollLeft + container.clientWidth / 2;
            const distanceToCenter = Math.abs(
              currentCenter - activeChildCenter,
            );

            if (distanceToCenter > snapThreshold) {
              smoothScrollToCenter(closestIndex, isMobile ? 200 : 400);
            }
          }
        },
        isMobile ? 150 : 100,
      );
    };

    container.addEventListener("scroll", handleScrollEnd, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScrollEnd);
      clearTimeout(scrollTimeoutRef.current);
    };
  }, [isMobile, smoothScrollToCenter]);

  // Optimized background transition
  useEffect(() => {
    const newPoster =
      displayedMovies[activeIndex]?.bgPoster ||
      displayedMovies[activeIndex]?.poster;

    if (newPoster && newPoster !== currentBg.poster) {
      setNextBg({
        poster: newPoster,
        key: Date.now(),
      });

      const timer = setTimeout(
        () => {
          setCurrentBg({
            poster: newPoster,
            key: Date.now(),
          });
          setNextBg(null);
        },
        isMobile ? 400 : 700,
      ); // Faster on mobile

      return () => clearTimeout(timer);
    }
  }, [activeIndex, displayedMovies, currentBg.poster, isMobile]);

  // Optimized padding calculation with debouncing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let updateTimer;

    const updatePadding = () => {
      clearTimeout(updateTimer);
      updateTimer = setTimeout(() => {
        if (!container || container.children.length === 0) return;

        const firstChild = container.children[0];
        const lastChild = container.children[container.children.length - 1];
        const containerWidth = container.clientWidth;

        const paddingLeft = (containerWidth - firstChild.offsetWidth) / 2;
        const paddingRight = (containerWidth - lastChild.offsetWidth) / 2;

        container.style.paddingLeft = `${paddingLeft}px`;
        container.style.paddingRight = `${paddingRight}px`;
      }, 50); // Debounce padding updates
    };

    // Use single ResizeObserver for efficiency
    const resizeObserver = new ResizeObserver(() => {
      updatePadding();
      if (isMobile) {
        updateMobileTransforms();
      } else {
        updateDesktopTransforms();
      }
    });

    resizeObserver.observe(container);
    window.addEventListener("resize", updatePadding);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePadding);
      clearTimeout(updateTimer);
    };
  }, [
    displayedMovies,
    isMobile,
    updateMobileTransforms,
    updateDesktopTransforms,
  ]);

  // Initial setup
  useEffect(() => {
    const initTimeout = setTimeout(() => {
      if (isMobile) {
        updateMobileTransforms();
      } else {
        updateDesktopTransforms();
      }

      if (movies.length > 0) {
        smoothScrollToCenter(0, 0);
      }
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Memoized movie cards to prevent unnecessary re-renders
  const movieCards = useMemo(
    () =>
      displayedMovies.map((movie, index) => (
        <div
          key={movie.id}
          className={`shrink-0 transition-all duration-300 cursor-pointer ${
            isMobile ? "snap-center" : ""
          }`}
          style={{
            transformStyle: isMobile ? "flat" : "preserve-3d",
            width: isMobile ? "280px" : "auto",
            willChange: isMobile
              ? "transform, opacity"
              : "transform, opacity, filter",
          }}
          onClick={() => handleCardClick(index)}
        >
          <MovieCard
            movie={movie}
            active={index === activeIndex}
            togglePin={togglePin}
          />
        </div>
      )),
    [displayedMovies, isMobile, activeIndex, togglePin, handleCardClick],
  );

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background with mobile optimizations - NO BLUR ON MOBILE */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          key={currentBg.key}
          className={`absolute inset-0 ${nextBg ? "animate-fade-out" : ""}`}
        >
          <img
            src={currentBg.poster}
            alt=""
            className="w-full h-full object-cover scale-110"
            loading="lazy"
            style={{
              filter: isMobile ? "none" : "blur(40px)", // No blur on mobile
              willChange: isMobile ? "none" : "filter",
            }}
          />
        </div>

        {nextBg && (
          <div key={nextBg.key} className="absolute inset-0 animate-fade-in">
            <img
              src={nextBg.poster}
              alt=""
              className="w-full h-full object-cover scale-110"
              loading="lazy"
              style={{
                filter: isMobile ? "none" : "blur(40px)", // No blur on mobile
                willChange: isMobile ? "none" : "filter",
              }}
            />
          </div>
        )}

        <div
          className={`absolute inset-0 z-10 ${isMobile ? "bg-black/80" : "bg-black/60"}`}
        />
      </div>

      {/* Movie cards container */}
      <div className="relative z-20 w-full h-full overflow-hidden">
        <div
          ref={containerRef}
          className={`absolute top-0 left-0 w-full h-full flex items-center overflow-x-auto scrollbar-none ${
            isMobile ? "gap-3" : "gap-5"
          }`}
          style={{
            perspective: isMobile ? "none" : "1200px",
            perspectiveOrigin: "center center",
            scrollSnapType: isMobile ? "x mandatory" : "none",
            WebkitOverflowScrolling: "touch",
            willChange: isMobile ? "scroll-position" : "auto",
          }}
        >
          {movieCards}
        </div>
      </div>

      {/* DotsForCards Component */}
      <DotsForCards
        totalDots={displayedMovies.length}
        activeDot={activeIndex}
        onDotClick={handleDotClick}
      />

      {/* Move Buttons Component */}
      <MoveButtons onPrev={handlePrev} onNext={handleNext} />
    </div>
  );
}

export default Home;
