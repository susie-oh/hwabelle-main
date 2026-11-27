import { BfcmCountdownParts, pad2 } from "@/lib/bfcmCampaign";

interface BfcmCountdownProps {
  countdown: BfcmCountdownParts;
  variant?: "inline" | "editorial";
  className?: string;
}

export const BfcmCountdown = ({
  countdown,
  variant = "editorial",
  className = "",
}: BfcmCountdownProps) => {
  if (countdown.expired) return null;

  if (variant === "inline") {
    return (
      <span
        data-testid="bfcm-countdown-inline"
        aria-label={`Time remaining: ${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, ${countdown.seconds} seconds`}
        className={`inline-flex items-center gap-1 font-sans text-[11px] sm:text-xs font-medium tracking-wider tabular-nums px-2 py-0.5 rounded bg-white/12 text-[#FAF9F5] ${className}`}
      >
        {countdown.days > 0 && <span>{countdown.days}d</span>}
        <span>{pad2(countdown.hours)}h</span>
        <span>{pad2(countdown.minutes)}m</span>
        <span>{pad2(countdown.seconds)}s</span>
      </span>
    );
  }

  const units = [
    { value: String(countdown.days), label: countdown.days === 1 ? "Day" : "Days" },
    { value: pad2(countdown.hours), label: "Hours" },
    { value: pad2(countdown.minutes), label: "Min" },
    { value: pad2(countdown.seconds), label: "Sec" },
  ];

  return (
    <div
      data-testid="bfcm-countdown-editorial"
      role="timer"
      aria-live="off"
      aria-label={`Offer ends in ${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, ${countdown.seconds} seconds`}
      className={`inline-flex items-center gap-2 sm:gap-2.5 ${className}`}
    >
      {units.map((unit, idx) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-2.5">
          <div className="flex flex-col items-center justify-center min-w-[3.1rem] sm:min-w-[3.5rem] px-2 py-1.5 bg-[#FAF9F5] border border-[#141414]/15 text-[#141414]">
            <span className="font-serif text-base sm:text-lg leading-none font-medium tabular-nums">
              {unit.value}
            </span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-[#141414]/65 mt-1 leading-none">
              {unit.label}
            </span>
          </div>
          {idx < units.length - 1 && (
            <span className="text-[#141414]/35 font-serif text-sm select-none" aria-hidden="true">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default BfcmCountdown;
