import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";

const SEVERITY_COLORS = {
  Low: "hsl(142, 70%, 45%)",
  Medium: "hsl(45, 93%, 47%)",
  High: "hsl(25, 95%, 53%)",
  Critical: "hsl(0, 72%, 51%)",
};

const eventData = [
  { name: "Low", value: 4521 },
  { name: "Medium", value: 3200 },
  { name: "High", value: 1800 },
  { name: "Critical", value: 420 },
];

const incidentData = [
  { name: "Low", value: 120 },
  { name: "Medium", value: 85 },
  { name: "High", value: 45 },
  { name: "Critical", value: 12 },
];

interface Props {
  title: string;
  type: "event" | "incident";
}

const SeverityPieChart = ({ title, type }: Props) => {
  const allData = type === "event" ? eventData : incidentData;
  const [activeFilters, setActiveFilters] = useState<string[]>(["Low", "Medium", "High", "Critical"]);

  const toggleFilter = (name: string) => {
    setActiveFilters((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  const filteredData = allData.filter((d) => activeFilters.includes(d.name));

  return (
    <div className="glass-card rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className="flex gap-1">
          {Object.keys(SEVERITY_COLORS).map((sev) => (
            <Button
              key={sev}
              size="sm"
              variant="ghost"
              onClick={() => toggleFilter(sev)}
              className={`text-xs h-7 px-2 ${
                activeFilters.includes(sev)
                  ? "opacity-100"
                  : "opacity-40"
              }`}
              style={{ color: SEVERITY_COLORS[sev as keyof typeof SEVERITY_COLORS] }}
            >
              {sev}
            </Button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {filteredData.map((entry) => (
              <Cell
                key={entry.name}
                fill={SEVERITY_COLORS[entry.name as keyof typeof SEVERITY_COLORS]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220, 22%, 10%)",
              border: "1px solid hsl(220, 18%, 20%)",
              borderRadius: "8px",
              color: "hsl(210, 20%, 92%)",
              fontSize: "12px",
            }}
          />
          <Legend
            formatter={(value: string) => (
              <span style={{ color: "hsl(215, 15%, 55%)", fontSize: "12px" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SeverityPieChart;
