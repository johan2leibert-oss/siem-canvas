import { useState, useEffect } from "react";
import { FileText, AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import SeverityPieChart from "@/components/SeverityPieChart";
import ThreatsBySourceChart from "@/components/ThreatsBySourceChart";
import CountBarChart from "@/components/CountBarChart";
import { fetchEvents, fetchIncidents } from "@/lib/api-service";

type DayFilter = "today" | "7days" | "30days";

const mockStats: Record<DayFilter, { logEvents: number; incidents: number }> = {
  today: { logEvents: 14523, incidents: 47 },
  "7days": { logEvents: 98412, incidents: 312 },
  "30days": { logEvents: 412890, incidents: 1247 },
};

const Overview = () => {
  const [dayFilter, setDayFilter] = useState<DayFilter>("today");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [stats, setStats] = useState(mockStats["today"]);

  useEffect(() => {
    // Try to get real counts from API
    Promise.all([fetchEvents(), fetchIncidents()]).then(([evtRes, incRes]) => {
      if (evtRes.isLive || incRes.isLive) {
        setIsLive(true);
        setStats({
          logEvents: evtRes.data.length,
          incidents: incRes.data.length,
        });
      } else {
        setIsLive(false);
        setStats(mockStats[dayFilter]);
      }
    });
  }, [refreshKey]);

  useEffect(() => {
    if (!isLive) setStats(mockStats[dayFilter]);
  }, [dayFilter, isLive]);

  const dayOptions: { label: string; value: DayFilter }[] = [
    { label: "Today", value: "today" },
    { label: "7 Days", value: "7days" },
    { label: "30 Days", value: "30days" },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto" key={refreshKey}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">SIEM Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Security overview and threat intelligence</p>
          </div>
          <div className="flex items-center gap-1 ml-2">
            {isLive ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-muted-foreground" />}
            <span className="text-xs text-muted-foreground">{isLive ? "Live" : "Mock"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {dayOptions.map((opt) => (
            <Button
              key={opt.value}
              variant={dayFilter === opt.value ? "default" : "outline"}
              size="sm"
              onClick={() => setDayFilter(opt.value)}
              className={dayFilter === opt.value ? "bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"}
            >
              {opt.label}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshKey((k) => k + 1)}
            className="border-border text-muted-foreground hover:text-foreground ml-2"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Log Events"
          value={stats.logEvents}
          icon={FileText}
          trend={dayFilter === "today" && !isLive ? "+12% from yesterday" : undefined}
          trendUp
        />
        <StatCard
          title="Incidents"
          value={stats.incidents}
          icon={AlertTriangle}
          trend={dayFilter === "today" && !isLive ? "-5% from yesterday" : undefined}
          trendUp={false}
        />
      </div>

      {/* Pie charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SeverityPieChart title="Event Severity Distribution" type="event" />
        <SeverityPieChart title="Incident Severity Distribution" type="incident" />
      </div>

      {/* Line chart */}
      <ThreatsBySourceChart />

      {/* Bar charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CountBarChart title="Event Count" type="event" />
        <CountBarChart title="Incident Count" type="incident" />
      </div>
    </div>
  );
};

export default Overview;
