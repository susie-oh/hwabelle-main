import { useState, useRef, useEffect } from "react";
import freshBouquetImg from "@/assets/fresh-bouquet.png";
import pressedKeepsakeImg from "@/assets/pressed-keepsake.png";

const BeforeAfterSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <span className="caption mb-2 block">Before & After</span>
        <h2 className="font-serif text-display mb-4">From Fresh Bouquet to Lasting Keepsake</h2>
        <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-sm md:text-base">
          See the beautiful transformation. Drag the slider to view the journey from fresh wedding day flowers to a custom, hand-pressed botanical art frame.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full overflow-hidden select-none cursor-ew-resize rounded-2xl border border-border/80 shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-secondary"
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* Before Image (Fresh) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={freshBouquetImg}
            alt="Fresh Wedding Bouquet before pressing"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute left-6 top-6 bg-background/90 text-foreground text-xs tracking-widest uppercase font-semibold px-4 py-2 rounded-full shadow-sm backdrop-blur-sm z-10">
            Before: Fresh Bouquet
          </div>
        </div>

        {/* After Image (Pressed) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <img
            src={pressedKeepsakeImg}
            alt="Pressed Bouquet Keepsake after framing"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute right-6 top-6 bg-background/90 text-foreground text-xs tracking-widest uppercase font-semibold px-4 py-2 rounded-full shadow-sm backdrop-blur-sm z-10">
            After: Pressed Keepsake
          </div>
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-background/80 shadow-[0_0_10px_rgba(0,0,0,0.3)] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Slider Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background border-2 border-border shadow-[0_4px_10px_rgba(0,0,0,0.15)] flex items-center justify-center pointer-events-none">
            <svg
              className="w-5 h-5 text-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
