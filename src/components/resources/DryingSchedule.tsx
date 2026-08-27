import React from "react";
import { DryingScheduleItem } from "@/content/resources/flower-pressing-guide";

interface DryingScheduleProps {
  schedule: DryingScheduleItem[];
}

const DryingSchedule: React.FC<DryingScheduleProps> = ({ schedule }) => {
  return (
    <div className="overflow-x-auto my-8 border border-border/60 rounded-xl bg-card shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-secondary/60 border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          <tr>
            <th scope="col" className="px-5 py-3.5">Flower Variety</th>
            <th scope="col" className="px-4 py-3.5">Moisture Level</th>
            <th scope="col" className="px-4 py-3.5">Average Drying Time</th>
            <th scope="col" className="px-5 py-3.5">Blotter Change?</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40 font-normal">
          {schedule.map((item, idx) => (
            <tr
              key={idx}
              className={idx % 2 === 0 ? "bg-background/80" : "bg-secondary/20"}
            >
              <td className="px-5 py-3.5 font-medium text-foreground">
                {item.variety}
              </td>
              <td className="px-4 py-3.5">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.moistureLevel === "Very Low" || item.moistureLevel === "Low"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : item.moistureLevel === "Medium"
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                  }`}
                >
                  {item.moistureLevel}
                </span>
              </td>
              <td className="px-4 py-3.5 text-muted-foreground font-medium">
                {item.pressingTime}
              </td>
              <td className="px-5 py-3.5 text-muted-foreground">
                {item.blotterChangeRequired}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DryingSchedule;
