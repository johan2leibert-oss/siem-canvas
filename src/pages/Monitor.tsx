import { useState } from "react";
import { Activity, AlertTriangle, FileText, Terminal } from "lucide-react";
import RealtimeEvents from "@/components/monitor/RealtimeEvents";
import EventsTab from "@/components/monitor/EventsTab";
import IncidentsTab from "@/components/monitor/IncidentsTab";
import RawLogsTab from "@/components/monitor/RawLogsTab";

const tabs = [
  { id: "realtime", label: "Realtime Events", icon: Activity },
  { id: "incidents", label: "Incidents", icon: AlertTriangle },
  { id: "events", label: "Events", icon: FileText },
  { id: "rawlogs", label: "Raw Logs", icon: Terminal },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Monitor = () => {
  const [activeTab, setActiveTab] = useState<TabId>("realtime");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Monitor</h1>

      {/* Tab selector */}
      <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "realtime" && <RealtimeEvents />}
      {activeTab === "incidents" && <IncidentsTab />}
      {activeTab === "events" && <EventsTab />}
      {activeTab === "rawlogs" && <RawLogsTab />}
    </div>
  );
};

export default Monitor;
