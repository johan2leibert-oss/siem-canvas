import { useState, useMemo } from "react";
import { ArrowUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Asset {
  assetId: string;
  hostname: string;
  deviceTag: string;
  ipAddress: string;
  location: string;
  owner: string;
  criticality: string;
  os: string;
}

const deviceTags = ["Server", "Workstation", "Router", "Switch", "Firewall", "IoT Device"];
const criticalities = ["Low", "Medium", "High", "Critical"];
const osList = ["Windows 11", "Windows Server 2022", "Ubuntu 22.04", "RHEL 9", "macOS Sonoma", "CentOS 8", "Debian 12"];

const initialAssets: Asset[] = Array.from({ length: 10 }, (_, i) => ({
  assetId: `AST-${String(i + 1).padStart(4, "0")}`,
  hostname: `host-${["web", "db", "app", "fw", "mail", "dns", "proxy", "nas", "dc", "vpn"][i]}-0${i + 1}`,
  deviceTag: deviceTags[i % deviceTags.length],
  ipAddress: `192.168.${Math.floor(i / 5) + 1}.${(i * 10) + 10}`,
  location: ["US-East", "US-West", "EU-Central", "AP-South", "US-Central"][i % 5],
  owner: ["admin", "netops", "devops", "secops", "sysadmin"][i % 5],
  criticality: criticalities[i % criticalities.length],
  os: osList[i % osList.length],
}));

const AssetManagement = () => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [sortField, setSortField] = useState<"hostname" | "deviceTag" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterHostname, setFilterHostname] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterOwner, setFilterOwner] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({ deviceTag: "Server", criticality: "Low", os: "Ubuntu 22.04" });

  const toggleSort = (field: "hostname" | "deviceTag") => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let data = assets.filter((a) =>
      a.hostname.toLowerCase().includes(filterHostname.toLowerCase()) &&
      a.location.toLowerCase().includes(filterLocation.toLowerCase()) &&
      a.owner.toLowerCase().includes(filterOwner.toLowerCase())
    );
    if (sortField) {
      data = [...data].sort((a, b) => {
        const cmp = a[sortField].localeCompare(b[sortField]);
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return data;
  }, [assets, filterHostname, filterLocation, filterOwner, sortField, sortDir]);

  const handleAdd = () => {
    const a: Asset = {
      assetId: newAsset.assetId || `AST-${String(assets.length + 1).padStart(4, "0")}`,
      hostname: newAsset.hostname || "",
      deviceTag: newAsset.deviceTag || "Server",
      ipAddress: newAsset.ipAddress || "",
      location: newAsset.location || "",
      owner: newAsset.owner || "",
      criticality: newAsset.criticality || "Low",
      os: newAsset.os || "Ubuntu 22.04",
    };
    setAssets((prev) => [a, ...prev]);
    setDialogOpen(false);
    setNewAsset({ deviceTag: "Server", criticality: "Low", os: "Ubuntu 22.04" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Input placeholder="Filter by hostname" value={filterHostname} onChange={(e) => setFilterHostname(e.target.value)} className="w-48" />
        <Input placeholder="Filter by location" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="w-48" />
        <Input placeholder="Filter by owner" value={filterOwner} onChange={(e) => setFilterOwner(e.target.value)} className="w-48" />
        <Button onClick={() => setDialogOpen(true)} className="ml-auto gap-2"><Plus className="w-4 h-4" />Add New Device</Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("hostname")}>Hostname <ArrowUpDown className="w-3 h-3 inline ml-1" /></TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("deviceTag")}>Device Tag <ArrowUpDown className="w-3 h-3 inline ml-1" /></TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Criticality</TableHead>
              <TableHead>OS</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((a) => (
              <TableRow key={a.assetId}>
                <TableCell className="font-medium">{a.hostname}</TableCell>
                <TableCell>{a.deviceTag}</TableCell>
                <TableCell className="font-mono text-xs">{a.ipAddress}</TableCell>
                <TableCell>{a.location}</TableCell>
                <TableCell>{a.owner}</TableCell>
                <TableCell><span className={`text-xs font-medium px-2 py-0.5 rounded ${a.criticality === "Critical" ? "bg-destructive/10 text-destructive" : a.criticality === "High" ? "bg-orange-500/10 text-orange-500" : a.criticality === "Medium" ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"}`}>{a.criticality}</span></TableCell>
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
          <DialogHeader><DialogTitle>Add New Device</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div><Label>Asset ID</Label><Input value={newAsset.assetId || ""} onChange={(e) => setNewAsset((p) => ({ ...p, assetId: e.target.value }))} placeholder="AST-0001" /></div>
            <div><Label>Hostname</Label><Input value={newAsset.hostname || ""} onChange={(e) => setNewAsset((p) => ({ ...p, hostname: e.target.value }))} /></div>
            <div><Label>Device Tag</Label>
              <Select value={newAsset.deviceTag} onValueChange={(v) => setNewAsset((p) => ({ ...p, deviceTag: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{deviceTags.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Location</Label><Input value={newAsset.location || ""} onChange={(e) => setNewAsset((p) => ({ ...p, location: e.target.value }))} /></div>
            <div><Label>IP Address</Label><Input value={newAsset.ipAddress || ""} onChange={(e) => setNewAsset((p) => ({ ...p, ipAddress: e.target.value }))} /></div>
            <div><Label>Owner</Label><Input value={newAsset.owner || ""} onChange={(e) => setNewAsset((p) => ({ ...p, owner: e.target.value }))} /></div>
            <div><Label>Criticality</Label>
              <Select value={newAsset.criticality} onValueChange={(v) => setNewAsset((p) => ({ ...p, criticality: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{criticalities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Operating System</Label>
              <Select value={newAsset.os} onValueChange={(v) => setNewAsset((p) => ({ ...p, os: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{osList.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={handleAdd}>Add Device</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssetManagement;
