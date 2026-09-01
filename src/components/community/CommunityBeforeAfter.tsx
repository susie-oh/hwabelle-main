import React, { useState, useRef, useEffect } from "react";

interface CommunityBeforeAfterProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  altBefore?: string;
  altAfter?: string;
  className?: string;
}

export const CommunityBeforeAfter: React.FC<CommunityBeforeAfterProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = "Before (Fresh)",
  afterLabel = "After (Pressed)",
  altBefore = "Fresh flowers before pressing",
  altAfter = "Pressed flowers keepsake after pressing",
  className = "",
}) => {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(clamped);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let delta = 0;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      delta = -5;
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      delta = 5;
    } else if (e.key === "Home") {
      setPosition(0);
      return;
    } else if (e.key === "End") {
      setPosition(100);
      return;
    } else if (e.key === "PageDown") {
      delta = -20;
    } else if (e.key === "PageUp") {
      delta = 20;
    }

    if (delta !== 0) {
      e.preventDefault();
      setPosition((prev) => Math.max(0, Math.min(100, prev + delta)));
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => updatePosition(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updatePosition(e.touches[0].clientX);
    };
    const onEnd = () => setIsDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isDragging]);

  // Reduced motion: side-by-side presentation
  if (prefersReducedMotion) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary border border-border">
          <img src={beforeImage} alt={altBefore} className="w-full h-full object-cover" />
          <span className="absolute bottom-3 left-3 bg-background/90 text-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            {beforeLabel}
          </span>
        </div>
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary border border-border">
          <img src={afterImage} alt={altAfter} className="w-full h-full object-cover" />
          <span className="absolute bottom-3 right-3 bg-background/90 text-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            {afterLabel}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative aspect-[4/3] w-full overflow-hidden select-none rounded-2xl border border-border shadow-sm bg-secondary ${className}`}
      onMouseDown={(e) => {
        setIsDragging(true);
        updatePosition(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        if (e.touches[0]) updatePosition(e.touches[0].clientX);
      }}
    >
      {/* Before Image (Background Layer) */}
      <img
        src={beforeImage}
        alt={altBefore}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />
      <div className="absolute left-4 top-4 bg-background/90 text-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm pointer-events-none backdrop-blur-sm z-10">
        {beforeLabel}
      </div>

      {/* After Image (Clipped Overlay) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}
      >
        <img
          src={afterImage}
          alt={altAfter}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
        <div className="absolute right-4 top-4 bg-background/90 text-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm pointer-events-none backdrop-blur-sm z-10">
          {afterLabel}
        </div>
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-background shadow-[0_0_8px_rgba(0,0,0,0.3)] pointer-events-none"
        style={{ left: `${position}%` }}
      />

      {/* Keyboard-accessible Slider Handle */}
      <div
        role="slider"
        aria-label="Before and after transformation comparison slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background border-2 border-border shadow-lg flex items-center justify-center cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-20"
        style={{ left: `${position}%` }}
      >
        <svg
          className="w-5 h-5 text-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9l-4 4 4 4m8 0l4-4-4-4"
          />
        </svg>
      </div>
    </div>
  );
};
