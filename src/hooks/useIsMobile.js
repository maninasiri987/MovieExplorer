import { useEffect, useState } from "react";

function getIsMobile() {
  return window.innerWidth < 768;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => getIsMobile());

  useEffect(() => {
    let frameId;

    const updateViewport = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        setIsMobile((current) => {
          const next = getIsMobile();
          return current === next ? current : next;
        });
      });
    };

    window.addEventListener("resize", updateViewport, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  return isMobile;
}

export default useIsMobile;
