import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Search, CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  IncidentRecord,
  generateIncidents,
  INCIDENT_TYPE_OPTIONS,
  EVENT_COUNT_FILTER_OPTIONS,
} from "@/lib/monitor-data";
import ColumnFilter from "./ColumnFilter";
import PaginationControls from "./PaginationControls";

const PAGE_SIZE = 15;

const IncidentsTab = () => {
  const [allIncidents] = useState<IncidentRecord[]>(() => generateIncidents(150));
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>("desc");
  const [mitreSortDir, setMitreSortDir] = useState<"asc" | "desc" | null>(null);
  const [incidentTypeFilter, setIncidentTypeFilter] = useState("All");
  const [eventCountFilter, setEventCountFilter] = useState("All");
  const [searchIp, setSearchIp] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let data = allIncidents;
    if (incidentTypeFilter !== "All")
      data = data.filter((d) => d.incidentType === incidentTypeFilter);
    if (eventCountFilter === "Correlated Events")
      data = data.filter((d) => d.isCorrelated);
    else if (eventCountFilter === "Isolated Events")
      data = data.filter((d) => !d.isCorrelated);
    if (searchIp)
      data = data.filter((d) => d.attackerIp.includes(searchIp));
    if (dateFrom)
      data = data.filter((d) => d.timestamp >= dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59);
      data = data.filter((d) => d.timestamp <= end);
    }
    // Primary sort
    if (sortDir)
      data = [...data].sort((a, b) =>
        sortDir === "asc" ? a.timestamp.getTime() - b.timestamp.getTime() : b.timestamp.getTime() - a.timestamp.getTime()
      );
    else if (mitreSortDir)
      data = [...data].sort((a, b) =>
        mitreSortDir === "asc" ? a.mitreId.localeCompare(b.mitreId) : b.mitreId.localeCompare(a.mitreId)
      );
    return data;
  }, [allIncidents, incidentTypeFilter, eventCountFilter, searchIp, dateFrom, dateTo, sortDir, mitreSortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
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
          <thead className="bg-secondary/50">
            <tr>
              <th className="p-3 text-left">
                <ColumnFilter label="Timestamp" type="sort" sortDir={sortDir} onSort={(d) => { setSortDir(d); setMitreSortDir(null); }} />
              </th>
              <th className="p-3 text-left">
                <ColumnFilter label="Incident Type" type="dropdown" options={INCIDENT_TYPE_OPTIONS} selectedOption={incidentTypeFilter} onFilter={(v) => { setIncidentTypeFilter(v); setPage(1); }} />
              </th>
              <th className="p-3 text-left">
                <ColumnFilter label="Event Count" type="dropdown" options={EVENT_COUNT_FILTER_OPTIONS} selectedOption={eventCountFilter} onFilter={(v) => { setEventCountFilter(v); setPage(1); }} />
              </th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attacker IP</th>
              <th className="p-3 text-left">
                <ColumnFilter label="MITRE ID" type="sort" sortDir={mitreSortDir} onSort={(d) => { setMitreSortDir(d); setSortDir(null); }} />
              </th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((inc) => (
              <tr key={inc.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                <td className="p-3 font-mono text-xs whitespace-nowrap">{format(inc.timestamp, "yyyy-MM-dd HH:mm:ss")}</td>
                <td className="p-3 text-xs">{inc.incidentType}</td>
                <td className="p-3 text-xs">
                  <span className="font-mono">{inc.eventCount}</span>
                  <span className="ml-1.5 text-muted-foreground">({inc.isCorrelated ? "correlated" : "isolated"})</span>
                </td>
                <td className="p-3 font-mono text-xs">{inc.attackerIp}</td>
                <td className="p-3 font-mono text-xs text-primary">{inc.mitreId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default IncidentsTab;
