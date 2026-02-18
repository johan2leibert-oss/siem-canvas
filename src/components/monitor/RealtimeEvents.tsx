import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { Search, CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  EventRecord,
  generateEvents,
  EVENT_TYPE_OPTIONS,
  SEVERITY_OPTIONS,
  SOURCE_OPTIONS,
} from "@/lib/monitor-data";
import ColumnFilter from "./ColumnFilter";
import SeverityBadge from "./SeverityBadge";
import PaginationControls from "./PaginationControls";

const PAGE_SIZE = 20;

const RealtimeEvents = () => {
  const [events, setEvents] = useState<EventRecord[]>(() => generateEvents(200));
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>("desc");
  const [eventTypeFilter, setEventTypeFilter] = useState("All");
  const [eventNameFilter, setEventNameFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [searchIp, setSearchIp] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [page, setPage] = useState(1);

  // Simulate realtime incoming events
  useEffect(() => {
    const interval = setInterval(() => {
      const newEvents = generateEvents(1).map((e) => ({
        ...e,
        timestamp: new Date(),
        id: `EVT-RT-${Date.now()}`,
      }));
      setEvents((prev) => [...newEvents, ...prev].slice(0, 500));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    let data = events;
    if (eventTypeFilter !== "All")
      data = data.filter((e) => (eventTypeFilter === "NA" ? !e.eventType : e.eventType === eventTypeFilter));
    if (eventNameFilter !== "All")
      data = data.filter((e) => (eventNameFilter === "NA" ? !e.eventName : e.eventName === eventNameFilter));
    if (severityFilter !== "All")
      data = data.filter((e) => (severityFilter === "NA" ? !e.severity : e.severity === severityFilter));
    if (sourceFilter !== "All")
      data = data.filter((e) => e.source === sourceFilter);
    if (searchIp)
      data = data.filter((e) => e.attackerIp.includes(searchIp));
    if (dateFrom)
      data = data.filter((e) => e.timestamp >= dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59);
      data = data.filter((e) => e.timestamp <= end);
    }
    if (sortDir)
      data = [...data].sort((a, b) =>
        sortDir === "asc" ? a.timestamp.getTime() - b.timestamp.getTime() : b.timestamp.getTime() - a.timestamp.getTime()
      );
    return data;
  }, [events, eventTypeFilter, eventNameFilter, severityFilter, sourceFilter, searchIp, dateFrom, dateTo, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const uniqueNames = ["All", "NA", ...Array.from(new Set(events.map((e) => e.eventName)))];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Live feed — new events appear automatically.
      </p>

      {/* Top filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("gap-1", !dateFrom && "text-muted-foreground")}>
                <CalendarIcon className="w-3.5 h-3.5" />
                {dateFrom ? format(dateFrom, "MMM dd") : "From"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
          <span className="text-muted-foreground text-xs">–</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("gap-1", !dateTo && "text-muted-foreground")}>
                <CalendarIcon className="w-3.5 h-3.5" />
                {dateTo ? format(dateTo, "MMM dd") : "To"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateTo} onSelect={setDateTo} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by IP…"
            value={searchIp}
            onChange={(e) => { setSearchIp(e.target.value); setPage(1); }}
            className="pl-8 h-9 w-48 text-sm"
          />
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 sticky top-0">
            <tr>
              <th className="p-3 text-left">
                <ColumnFilter label="Timestamp" type="sort" sortDir={sortDir} onSort={setSortDir} />
              </th>
              <th className="p-3 text-left">
                <ColumnFilter label="Event Type" type="dropdown" options={EVENT_TYPE_OPTIONS} selectedOption={eventTypeFilter} onFilter={(v) => { setEventTypeFilter(v); setPage(1); }} />
              </th>
              <th className="p-3 text-left">
                <ColumnFilter label="Event Name" type="dropdown" options={uniqueNames} selectedOption={eventNameFilter} onFilter={(v) => { setEventNameFilter(v); setPage(1); }} />
              </th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attacker IP</th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Source ID</th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Device IP</th>
              <th className="p-3 text-left">
                <ColumnFilter label="Source" type="dropdown" options={SOURCE_OPTIONS} selectedOption={sourceFilter} onFilter={(v) => { setSourceFilter(v); setPage(1); }} />
              </th>
              <th className="p-3 text-left">
                <ColumnFilter label="Severity" type="dropdown" options={SEVERITY_OPTIONS} selectedOption={severityFilter} onFilter={(v) => { setSeverityFilter(v); setPage(1); }} />
              </th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((evt) => (
              <tr key={evt.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                <td className="p-3 font-mono text-xs whitespace-nowrap">{format(evt.timestamp, "yyyy-MM-dd HH:mm:ss")}</td>
                <td className="p-3 text-xs">{evt.eventType}</td>
                <td className="p-3 text-xs">{evt.eventName}</td>
                <td className="p-3 font-mono text-xs">{evt.attackerIp}</td>
                <td className="p-3 font-mono text-xs">{evt.sourceId}</td>
                <td className="p-3 font-mono text-xs">{evt.deviceIp}</td>
                <td className="p-3 font-mono text-xs">{evt.source}</td>
                <td className="p-3"><SeverityBadge severity={evt.severity} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default RealtimeEvents;
