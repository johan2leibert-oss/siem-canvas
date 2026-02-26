import { useState, useEffect, useMemo } from "react";
import { ArrowUpDown, Plus, Wifi, WifiOff } from "lucide-react";
import { fetchModules, addModule as addModuleApi } from "@/lib/api-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Module {
  id: string;
  moduleName: string;
  url: string;
}

const moduleNames = ["NDR", "WAF", "IDAM", "DLP", "UEBA", "SIEM", "SOAR", "Red Team"];

const initialModules: Module[] = [
  { id: "MOD-001", moduleName: "NDR", url: "https://ndr.sentinel.io" },
  { id: "MOD-002", moduleName: "WAF", url: "https://waf.sentinel.io" },
  { id: "MOD-003", moduleName: "SIEM", url: "https://siem.sentinel.io" },
  { id: "MOD-004", moduleName: "DLP", url: "https://dlp.sentinel.io" },
];

const SecurityStackConfig = () => {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetchModules().then(({ data, isLive: live }) => {
      if (live && data.length > 0) {
        setModules(data.map((m: any) => ({
          id: m.id || m._id || "",
          moduleName: m.moduleName || m.module_name || "",
          url: m.url || "",
        })));
      }
      setIsLive(live);
    });
  }, []);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [sorted, setSorted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newModule, setNewModule] = useState<Partial<Module>>({ moduleName: "NDR" });

  const toggleSort = () => {
    if (sorted) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else setSorted(true);
  };

  const displayed = useMemo(() => {
    if (!sorted) return modules;
    return [...modules].sort((a, b) => {
      const cmp = a.moduleName.localeCompare(b.moduleName);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [modules, sorted, sortDir]);

  const handleAdd = () => {
    const m: Module = {
      id: `MOD-${String(modules.length + 1).padStart(3, "0")}`,
      moduleName: newModule.moduleName || "NDR",
      url: newModule.url || "",
    };
    setModules((prev) => [m, ...prev]);
    if (isLive) addModuleApi(m).catch(console.error);
    setDialogOpen(false);
    setNewModule({ moduleName: "NDR" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        {isLive ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-muted-foreground" />}
        <span className="text-xs text-muted-foreground">{isLive ? "Live API" : "Mock data"}</span>
      </div>
      <div className="flex items-center">
        <Button onClick={() => setDialogOpen(true)} className="ml-auto gap-2"><Plus className="w-4 h-4" />Add New Module</Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="cursor-pointer select-none" onClick={toggleSort}>Module Name <ArrowUpDown className="w-3 h-3 inline ml-1" /></TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayed.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.moduleName}</TableCell>
                <TableCell className="font-mono text-xs text-primary">{m.url}</TableCell>
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
          <DialogHeader><DialogTitle>Add New Module</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div><Label>Module Name</Label>
              <Select value={newModule.moduleName} onValueChange={(v) => setNewModule((p) => ({ ...p, moduleName: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{moduleNames.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>URL</Label><Input value={newModule.url || ""} onChange={(e) => setNewModule((p) => ({ ...p, url: e.target.value }))} placeholder="https://module.sentinel.io" /></div>
          </div>
          <DialogFooter><Button onClick={handleAdd}>Add Module</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecurityStackConfig;
