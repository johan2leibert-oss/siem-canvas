import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const sources = [
  { key: "firewall", label: "Firewall", color: "hsl(187, 80%, 48%)" },
  { key: "ids", label: "IDS/IPS", color: "hsl(260, 60%, 55%)" },
  { key: "endpoint", label: "Endpoint", color: "hsl(142, 70%, 45%)" },
  { key: "email", label: "Email Gateway", color: "hsl(45, 93%, 47%)" },
  { key: "waf", label: "WAF", color: "hsl(340, 75%, 55%)" },
];

const generateData = () => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      firewall: Math.floor(Math.random() * 300 + 100),
      ids: Math.floor(Math.random() * 200 + 50),
      endpoint: Math.floor(Math.random() * 150 + 30),
      email: Math.floor(Math.random() * 100 + 20),
      waf: Math.floor(Math.random() * 80 + 10),
    });
  }
  return data;
};

const data = generateData();

const ThreatsBySourceChart = () => {
  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Threats by Source Types</h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }}
            axisLine={{ stroke: "hsl(220, 18%, 18%)" }}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }}
            axisLine={{ stroke: "hsl(220, 18%, 18%)" }}
            tickLine={false}
            label={{ value: "Count", angle: -90, position: "insideLeft", fill: "hsl(215, 15%, 55%)", fontSize: 12 }}
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
          <Legend
            formatter={(value: string) => (
              <span style={{ color: "hsl(215, 15%, 55%)", fontSize: "12px" }}>{value}</span>
            )}
          />
          {sources.map((src) => (
            <Line
              key={src.key}
              type="monotone"
              dataKey={src.key}
              name={src.label}
              stroke={src.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Legend color codes */}
      <div className="flex flex-wrap gap-4 mt-3 px-2">
        {sources.map((src) => (
          <div key={src.key} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: src.color }} />
            <span className="text-xs text-muted-foreground">{src.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreatsBySourceChart;
