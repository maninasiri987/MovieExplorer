import { useEffect, useRef, useState } from "react";
import MovieCard from "../components/MovieCard";
import DotsForCards from "../components/DotsForCards";
import MoveButtons from "../components/MoveButtons";

function Home({ movies, setMovies, togglePin }) {
  // Handle previous button click
  const handlePrev = () => {
    const newIndex = Math.max(0, activeIndex - 1);
    smoothScrollToCenter(newIndex);
  };

  // Handle next button click
  const handleNext = () => {
    const newIndex = Math.min(displayedMovies.length - 1, activeIndex + 1);
    smoothScrollToCenter(newIndex);
  };

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

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const displayedMovies = movies;

  // Smooth scroll function using requestAnimationFrame
  const smoothScrollToCenter = (index, duration = isMobile ? 400 : 500) => {
    const container = containerRef.current;
    if (!container || !container.children[index]) return;

    // Update activeIndex immediately when clicking
    setActiveIndex(index);

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

      // Easing function for smoother motion
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      const newScrollLeft = startScrollLeft + distance * easeOutCubic;
      container.scrollLeft = newScrollLeft;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        // Scroll finished
        setTimeout(() => {
          isManualScrollingRef.current = false;
          update3DTransforms();
        }, 100);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Add click handler with smooth scroll
  const handleCardClick = (index) => {
    smoothScrollToCenter(index);
  };

  // Handle dot click
  const handleDotClick = (index) => {
    smoothScrollToCenter(index);
  };

  // Update 3D transformations (simplified for mobile)
  const update3DTransforms = () => {
    const container = containerRef.current;
    if (!container) return;

    const center = container.scrollLeft + container.clientWidth / 2;
    const containerWidth = container.clientWidth;

    Array.from(container.children).forEach((childWrapper) => {
      const child = childWrapper.children[0];
      if (!child) return;

      if (isMobile) {
        // Mobile: No 3D transforms, just simple scaling and opacity
        const childCenter =
          childWrapper.offsetLeft + childWrapper.offsetWidth / 2;
        const distanceFromCenter = Math.abs(childCenter - center);
        const distancePercent = distanceFromCenter / (containerWidth / 2);

        // Simple scale effect for mobile
        const scale = 1 - distancePercent * 0.15;
        const minScale = 0.85;
        const finalScale = Math.max(minScale, Math.min(1, scale));

        // Opacity effect
        const opacity = 1 - distancePercent * 0.3;

        // Z-index based on distance
        const zIndex = Math.floor(100 - Math.abs(distanceFromCenter) / 10);

        // Apply simple transforms for mobile (no rotation, no blur)
        child.style.transform = `scale(${finalScale})`;
        child.style.transition = "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
        child.style.opacity = opacity;
        child.style.filter = "none"; // Remove any blur
        child.style.zIndex = zIndex;
        child.style.boxShadow = "0 10px 20px rgba(0,0,0,0.2)";
      } else {
        // Desktop: Full 3D transforms with rotation and blur
        const childCenter =
          childWrapper.offsetLeft + childWrapper.offsetWidth / 2;
        const distanceFromCenter = childCenter - center;
        const distancePercent =
          Math.abs(distanceFromCenter) / (containerWidth / 2);

        // Rotation logic for desktop
        let rotationY = 0;
        const maxRotation = 60;

        if (distanceFromCenter < 0) {
          // Card is on the LEFT - rotate to RIGHT (positive)
          const normalizedDistance =
            Math.abs(distanceFromCenter) / (containerWidth / 2);
          rotationY = Math.min(maxRotation, normalizedDistance * maxRotation);
        } else if (distanceFromCenter > 0) {
          // Card is on the RIGHT - rotate to LEFT (negative)
          const normalizedDistance = distanceFromCenter / (containerWidth / 2);
          rotationY =
            Math.min(maxRotation, normalizedDistance * maxRotation) * -1;
        }

        const rotationX = Math.abs(distancePercent) * 8;
        const rotationZ = (distanceFromCenter / (containerWidth / 2)) * 3;

        // Scale effect
        const scale = 1 - distancePercent * 0.25;
        const minScale = 0.7;
        const finalScale = Math.max(minScale, Math.min(1, scale));

        const opacity = 1 - distancePercent * 0.4;
        const blur = distancePercent * 8;
        const zIndex = Math.floor(100 - Math.abs(distanceFromCenter) / 10);

        // Apply full 3D transforms for desktop
        child.style.transform = `
          perspective(1000px)
          rotateY(${rotationY}deg)
          rotateX(${rotationX}deg)
          rotateZ(${rotationZ}deg)
          scale(${finalScale})
        `;
        child.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
        child.style.opacity = opacity;
        child.style.filter = `blur(${blur}px)`;
        child.style.zIndex = zIndex;

        // Shadow based on rotation direction
        if (Math.abs(rotationY) > 15) {
          child.style.boxShadow =
            rotationY > 0
              ? "-15px 10px 30px rgba(0,0,0,0.3)"
              : "15px 10px 30px rgba(0,0,0,0.3)";
        } else {
          child.style.boxShadow = "0 20px 40px rgba(0,0,0,0.2)";
        }
      }
    });
  };

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = null;

    const handleScroll = () => {
      if (isManualScrollingRef.current) return;

      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const center = container.scrollLeft + container.clientWidth / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        Array.from(container.children).forEach((child, index) => {
          const childCenter = child.offsetLeft + child.offsetWidth / 2;
          const distance = Math.abs(center - childCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        setActiveIndex((prev) => (prev !== closestIndex ? closestIndex : prev));
        update3DTransforms();

        rafId = null;
      });
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  // Snap to center with smooth animation after scroll ends
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScrollEnd = () => {
      if (isManualScrollingRef.current) return;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(
        () => {
          if (!container || isManualScrollingRef.current) return;

          const center = container.scrollLeft + container.clientWidth / 2;
          let closestIndex = 0;
          let closestDistance = Infinity;

          Array.from(container.children).forEach((child, index) => {
            const childCenter = child.offsetLeft + child.offsetWidth / 2;
            const distance = Math.abs(center - childCenter);

            if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = index;
            }
          });

          const currentCenter =
            container.scrollLeft + container.clientWidth / 2;
          const activeChild = container.children[closestIndex];
          if (activeChild) {
            const activeChildCenter =
              activeChild.offsetLeft + activeChild.offsetWidth / 2;
            const distanceToCenter = Math.abs(
              currentCenter - activeChildCenter,
            );

            const snapThreshold = isMobile ? 30 : 50;
            if (distanceToCenter > snapThreshold) {
              smoothScrollToCenter(closestIndex, isMobile ? 300 : 400);
            }
          }
        },
        isMobile ? 100 : 150,
      );
    };

    container.addEventListener("scroll", handleScrollEnd);
    return () => {
      container.removeEventListener("scroll", handleScrollEnd);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isMobile]);

  // Background transition with mobile optimizations
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
        isMobile ? 500 : 700,
      );

      return () => clearTimeout(timer);
    }
  }, [activeIndex, displayedMovies, currentBg.poster, isMobile]);

  // Padding calculations
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updatePadding = () => {
      if (container.children.length === 0) return;

      const firstChild = container.children[0];
      const lastChild = container.children[container.children.length - 1];

      const firstChildWidth = firstChild.offsetWidth;
      const lastChildWidth = lastChild.offsetWidth;
      const containerWidth = container.clientWidth;

      const paddingLeft = (containerWidth - firstChildWidth) / 2;
      const paddingRight = (containerWidth - lastChildWidth) / 2;

      container.style.paddingLeft = `${paddingLeft}px`;
      container.style.paddingRight = `${paddingRight}px`;
    };

    updatePadding();

    const resizeObserver = new ResizeObserver(() => {
      updatePadding();
      update3DTransforms();
    });

    if (container.children.length > 0) {
      Array.from(container.children).forEach((child) => {
        resizeObserver.observe(child);
      });
    }

    window.addEventListener("resize", () => {
      updatePadding();
      update3DTransforms();
    });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePadding);
    };
  }, [displayedMovies, isMobile]);

  // Initial setup
  useEffect(() => {
    setTimeout(() => {
      update3DTransforms();
      if (movies.length > 0) {
        smoothScrollToCenter(0, 0);
      }
    }, 100);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background with mobile optimizations */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          key={currentBg.key}
          className={`absolute inset-0 ${nextBg ? "animate-fade-out" : ""}`}
        >
          <img
            src={currentBg.poster}
            alt=""
            className="w-full h-full object-cover scale-110"
            style={{
              filter: `blur(${isMobile ? "10px" : "40px"})`, // Reduced blur on mobile
            }}
          />
        </div>

        {nextBg && (
          <div key={nextBg.key} className="absolute inset-0 animate-fade-in">
            <img
              src={nextBg.poster}
              alt=""
              className="w-full h-full object-cover scale-110"
              style={{
                filter: `blur(${isMobile ? "10px" : "40px"})`, // Reduced blur on mobile
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
            perspective: isMobile ? "none" : "1200px", // Disable perspective on mobile
            perspectiveOrigin: "center center",
            scrollSnapType: isMobile ? "x mandatory" : "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {displayedMovies.map((movie, index) => (
            <div
              key={movie.id}
              className={`shrink-0 transition-all duration-300 cursor-pointer ${
                isMobile ? "snap-center" : ""
              }`}
              style={{
                transformStyle: isMobile ? "flat" : "preserve-3d", // Flat transform on mobile
                width: isMobile ? "280px" : "auto", // Fixed width for mobile cards
              }}
              onClick={() => handleCardClick(index)}
            >
              <MovieCard
                movie={movie}
                active={index === activeIndex}
                togglePin={togglePin}
              />
            </div>
          ))}
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
