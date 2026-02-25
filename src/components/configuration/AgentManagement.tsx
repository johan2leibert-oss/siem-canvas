import { useState, useMemo } from "react";
import { ArrowUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Agent {
  configId: string;
  username: string;
  agentType: string;
  healthStatus: string;
  ipAddress: string;
  os: string;
}

const agentTypes = ["Endpoint Agent", "Network Agent", "Log Collector", "HIDS", "NIDS"];
const healthStatuses = ["Healthy", "Degraded", "Offline", "Error"];
const osList = ["Windows 11", "Windows Server 2022", "Ubuntu 22.04", "RHEL 9", "macOS Sonoma", "CentOS 8"];

const initialAgents: Agent[] = Array.from({ length: 10 }, (_, i) => ({
  configId: `AGT-${String(i + 1).padStart(4, "0")}`,
  username: ["admin", "agent_svc", "collector01", "monitor02", "scan_svc", "log_fwd", "nids_01", "hids_02", "ep_agent", "net_mon"][i],
  agentType: agentTypes[i % agentTypes.length],
  healthStatus: healthStatuses[i % healthStatuses.length],
  ipAddress: `10.0.${Math.floor(i / 5) + 1}.${(i * 5) + 100}`,
  os: osList[i % osList.length],
}));

const AgentManagement = () => {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [sortField, setSortField] = useState<"configId" | "username" | "agentType" | "healthStatus" | "os" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterIp, setFilterIp] = useState("");
  const [filterAgentType, setFilterAgentType] = useState("");
  const [filterOs, setFilterOs] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAgent, setNewAgent] = useState<Partial<Agent & { password: string }>>({ agentType: "Endpoint Agent", os: "Ubuntu 22.04" });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field!); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let data = agents.filter((a) =>
      a.ipAddress.toLowerCase().includes(filterIp.toLowerCase()) &&
      a.agentType.toLowerCase().includes(filterAgentType.toLowerCase()) &&
      a.os.toLowerCase().includes(filterOs.toLowerCase())
    );
    if (sortField) {
      data = [...data].sort((a, b) => {
        const cmp = a[sortField].localeCompare(b[sortField]);
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return data;
  }, [agents, filterIp, filterAgentType, filterOs, sortField, sortDir]);

  const handleAdd = () => {
    const a: Agent = {
      configId: `AGT-${String(agents.length + 1).padStart(4, "0")}`,
      username: newAgent.username || "",
      agentType: newAgent.agentType || "Endpoint Agent",
      healthStatus: "Healthy",
      ipAddress: newAgent.ipAddress || "",
      os: newAgent.os || "Ubuntu 22.04",
    };
    setAgents((prev) => [a, ...prev]);
    setDialogOpen(false);
    setNewAgent({ agentType: "Endpoint Agent", os: "Ubuntu 22.04" });
  };

  const statusColor = (s: string) => {
    if (s === "Healthy") return "bg-green-500/10 text-green-500";
    if (s === "Degraded") return "bg-yellow-500/10 text-yellow-500";
    if (s === "Error") return "bg-destructive/10 text-destructive";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Input placeholder="Filter by IP address" value={filterIp} onChange={(e) => setFilterIp(e.target.value)} className="w-48" />
        <Input placeholder="Filter by agent type" value={filterAgentType} onChange={(e) => setFilterAgentType(e.target.value)} className="w-48" />
        <Input placeholder="Filter by OS" value={filterOs} onChange={(e) => setFilterOs(e.target.value)} className="w-48" />
        <Button onClick={() => setDialogOpen(true)} className="ml-auto gap-2"><Plus className="w-4 h-4" />Add New Agent</Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("configId")}>Config ID <ArrowUpDown className="w-3 h-3 inline ml-1" /></TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("username")}>Username <ArrowUpDown className="w-3 h-3 inline ml-1" /></TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("agentType")}>Agent Type <ArrowUpDown className="w-3 h-3 inline ml-1" /></TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("healthStatus")}>Health Status <ArrowUpDown className="w-3 h-3 inline ml-1" /></TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("os")}>OS <ArrowUpDown className="w-3 h-3 inline ml-1" /></TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((a) => (
              <TableRow key={a.configId}>
                <TableCell className="font-mono text-xs">{a.configId}</TableCell>
                <TableCell className="font-medium">{a.username}</TableCell>
                <TableCell>{a.agentType}</TableCell>
                <TableCell><span className={`text-xs font-medium px-2 py-0.5 rounded ${statusColor(a.healthStatus)}`}>{a.healthStatus}</span></TableCell>
                <TableCell className="font-mono text-xs">{a.ipAddress}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{a.os}</TableCell>
                <TableCell>
                  <span className="text-xs text-primary cursor-pointer hover:underline">Edit</span>
                  <span className="text-xs text-destructive cursor-pointer hover:underline ml-3">Delete</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Agent</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div><Label>Agent Type</Label>
              <Select value={newAgent.agentType} onValueChange={(v) => setNewAgent((p) => ({ ...p, agentType: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{agentTypes.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Username</Label><Input value={newAgent.username || ""} onChange={(e) => setNewAgent((p) => ({ ...p, username: e.target.value }))} /></div>
            <div><Label>Password</Label><Input type="password" value={newAgent.password || ""} onChange={(e) => setNewAgent((p) => ({ ...p, password: e.target.value }))} /></div>
            <div><Label>Target IP Address</Label><Input value={newAgent.ipAddress || ""} onChange={(e) => setNewAgent((p) => ({ ...p, ipAddress: e.target.value }))} /></div>
            <div><Label>Operating System</Label>
              <Select value={newAgent.os} onValueChange={(v) => setNewAgent((p) => ({ ...p, os: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{osList.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={handleAdd}>Add Agent</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentManagement;
