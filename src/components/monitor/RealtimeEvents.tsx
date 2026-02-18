import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { EventRecord, generateEvents, EVENT_TYPE_OPTIONS, SEVERITY_OPTIONS } from "@/lib/monitor-data";
import ColumnFilter from "./ColumnFilter";
import SeverityBadge from "./SeverityBadge";

const RealtimeEvents = () => {
  const [events, setEvents] = useState<EventRecord[]>(() => generateEvents(20));
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>("desc");
  const [eventTypeFilter, setEventTypeFilter] = useState("All");
  const [eventNameFilter, setEventNameFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate realtime incoming events
  useEffect(() => {
    const interval = setInterval(() => {
      const newEvents = generateEvents(1).map((e) => ({
        ...e,
        timestamp: new Date(),
        id: `EVT-RT-${Date.now()}`,
      }));
      setEvents((prev) => [...newEvents, ...prev].slice(0, 200));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  let filtered = events;
  if (eventTypeFilter !== "All") {
    filtered = filtered.filter((e) =>
      eventTypeFilter === "NA" ? !e.eventType : e.eventType === eventTypeFilter
    );
  }
  if (eventNameFilter !== "All") {
    filtered = filtered.filter((e) =>
      eventNameFilter === "NA" ? !e.eventName : e.eventName === eventNameFilter
    );
  }
  if (severityFilter !== "All") {
    filtered = filtered.filter((e) =>
      severityFilter === "NA" ? !e.severity : e.severity === severityFilter
    );
  }
  if (sortDir) {
    filtered = [...filtered].sort((a, b) =>
      sortDir === "asc"
        ? a.timestamp.getTime() - b.timestamp.getTime()
        : b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  const uniqueNames = ["All", "NA", ...Array.from(new Set(events.map((e) => e.eventName)))];

  return (
    <div ref={containerRef} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Live feed — new events appear automatically.
      </p>
      <div className="overflow-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 sticky top-0">
            <tr>
              <th className="p-3 text-left">
                <ColumnFilter label="Timestamp" type="sort" sortDir={sortDir} onSort={setSortDir} />
              </th>
              <th className="p-3 text-left">
                <ColumnFilter
                  label="Event Type"
                  type="dropdown"
                  options={EVENT_TYPE_OPTIONS}
                  selectedOption={eventTypeFilter}
                  onFilter={setEventTypeFilter}
                />
              </th>
              <th className="p-3 text-left">
                <ColumnFilter
                  label="Event Name"
                  type="dropdown"
                  options={uniqueNames}
                  selectedOption={eventNameFilter}
                  onFilter={setEventNameFilter}
                />
              </th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Attacker IP
              </th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Source ID
              </th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Device IP
              </th>
              <th className="p-3 text-left">
                <ColumnFilter
                  label="Severity"
                  type="dropdown"
                  options={SEVERITY_OPTIONS}
                  selectedOption={severityFilter}
                  onFilter={setSeverityFilter}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map((evt) => (
              <tr
                key={evt.id}
                className="border-t border-border hover:bg-secondary/30 transition-colors"
              >
                <td className="p-3 font-mono text-xs whitespace-nowrap">
                  {format(evt.timestamp, "yyyy-MM-dd HH:mm:ss")}
                </td>
                <td className="p-3 text-xs">{evt.eventType}</td>
                <td className="p-3 text-xs">{evt.eventName}</td>
                <td className="p-3 font-mono text-xs">{evt.attackerIp}</td>
                <td className="p-3 font-mono text-xs">{evt.sourceId}</td>
                <td className="p-3 font-mono text-xs">{evt.deviceIp}</td>
                <td className="p-3">
                  <SeverityBadge severity={evt.severity} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RealtimeEvents;
