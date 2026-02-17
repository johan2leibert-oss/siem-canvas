import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";

type RangeFilter = "7days" | "30days" | "90days";

const generateBarData = (days: number) => {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: Math.floor(Math.random() * 500 + 50),
    });
  }
  return data;
};

const rangeMap: Record<RangeFilter, number> = {
  "7days": 7,
  "30days": 30,
  "90days": 90,
};

interface Props {
  title: string;
  type: "event" | "incident";
}

const CountBarChart = ({ title, type }: Props) => {
  const [range, setRange] = useState<RangeFilter>("7days");
  const data = generateBarData(rangeMap[range]);
  const barColor = type === "event" ? "hsl(187, 80%, 48%)" : "hsl(260, 60%, 55%)";

  const options: { label: string; value: RangeFilter }[] = [
    { label: "7 Days", value: "7days" },
    { label: "30 Days", value: "30days" },
    { label: "90 Days", value: "90days" },
  ];

  return (
    <div className="glass-card rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className="flex gap-1">
          {options.map((opt) => (
            <Button
              key={opt.value}
              size="sm"
              variant={range === opt.value ? "default" : "ghost"}
              onClick={() => setRange(opt.value)}
              className={`text-xs h-7 ${range === opt.value ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }}
            axisLine={{ stroke: "hsl(220, 18%, 18%)" }}
            tickLine={false}
            interval={range === "90days" ? 13 : range === "30days" ? 4 : 0}
            angle={range === "7days" ? 0 : -30}
            textAnchor={range === "7days" ? "middle" : "end"}
          />
          <YAxis
            tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }}
            axisLine={{ stroke: "hsl(220, 18%, 18%)" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220, 22%, 10%)",
              border: "1px solid hsl(220, 18%, 20%)",
              borderRadius: "8px",
              color: "hsl(210, 20%, 92%)",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="count" fill={barColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CountBarChart;
