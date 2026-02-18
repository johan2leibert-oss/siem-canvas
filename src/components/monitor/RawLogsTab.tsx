import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Search, CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { RawLogRecord, generateRawLogs, SOURCE_OPTIONS } from "@/lib/monitor-data";
import ColumnFilter from "./ColumnFilter";
import PaginationControls from "./PaginationControls";

const PAGE_SIZE = 20;

const RawLogsTab = () => {
  const [allLogs] = useState<RawLogRecord[]>(() => generateRawLogs(300));
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>("desc");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [searchIp, setSearchIp] = useState("");
  const [searchMsg, setSearchMsg] = useState("");
  const [searchHost, setSearchHost] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let data = allLogs;
    if (sourceFilter !== "All") data = data.filter((d) => d.source === sourceFilter);
    if (searchIp) data = data.filter((d) => d.sourceIp.includes(searchIp));
    if (searchMsg) data = data.filter((d) => d.logMessage.toLowerCase().includes(searchMsg.toLowerCase()));
    if (searchHost) data = data.filter((d) => d.hostname.toLowerCase().includes(searchHost.toLowerCase()));
    if (dateFrom) data = data.filter((d) => d.timestamp >= dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59);
      data = data.filter((d) => d.timestamp <= end);
    }
    if (sortDir)
      data = [...data].sort((a, b) =>
        sortDir === "asc" ? a.timestamp.getTime() - b.timestamp.getTime() : b.timestamp.getTime() - a.timestamp.getTime()
      );
    return data;
  }, [allLogs, sourceFilter, searchIp, searchMsg, searchHost, dateFrom, dateTo, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hostnames = ["All", ...Array.from(new Set(allLogs.map((l) => l.hostname)))];

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
          <Input placeholder="Source IP…" value={searchIp} onChange={(e) => { setSearchIp(e.target.value); setPage(1); }} className="pl-8 h-9 w-40 text-sm" />
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Log message…" value={searchMsg} onChange={(e) => { setSearchMsg(e.target.value); setPage(1); }} className="pl-8 h-9 w-48 text-sm" />
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Hostname…" value={searchHost} onChange={(e) => { setSearchHost(e.target.value); setPage(1); }} className="pl-8 h-9 w-40 text-sm" />
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr>
              <th className="p-3 text-left">
                <ColumnFilter label="Time" type="sort" sortDir={sortDir} onSort={setSortDir} />
              </th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Log Message</th>
              <th className="p-3 text-left">
                <ColumnFilter label="Source" type="dropdown" options={SOURCE_OPTIONS} selectedOption={sourceFilter} onFilter={(v) => { setSourceFilter(v); setPage(1); }} />
              </th>
              <th className="p-3 text-left">
                <ColumnFilter label="Hostname" type="dropdown" options={hostnames} selectedOption="All" onFilter={(v) => { setSearchHost(v === "All" ? "" : v); setPage(1); }} />
              </th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((log) => (
              <tr key={log.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                <td className="p-3 font-mono text-xs whitespace-nowrap">{format(log.timestamp, "yyyy-MM-dd HH:mm:ss")}</td>
                <td className="p-3 text-xs font-mono max-w-md truncate">{log.logMessage}</td>
                <td className="p-3 font-mono text-xs">{log.source}</td>
                <td className="p-3 font-mono text-xs">{log.hostname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default RawLogsTab;
