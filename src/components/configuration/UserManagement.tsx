import { useState, useEffect, useMemo } from "react";
import { ArrowUpDown, Plus, Wifi, WifiOff } from "lucide-react";
import { fetchUsers, addUser as addUserApi } from "@/lib/api-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface User {
  userId: string;
  username: string;
  role: string;
  email: string;
  team: string;
  severity: string;
  action: string;
}

const roles = ["Admin", "Analyst", "SOC Lead", "Security Ops", "Viewer"];
const teams = ["SOC", "Threat Intelligence", "Incident Response", "Network Ops", "Management"];
const severities = ["Low", "Medium", "High", "Critical"];

const initialUsers: User[] = Array.from({ length: 12 }, (_, i) => ({
  userId: `USR-${String(i + 1).padStart(4, "0")}`,
  username: ["admin", "jdoe", "asmith", "mwilson", "kbrown", "ljones", "rlee", "tchen", "pgarcia", "nkumar", "dwhite", "smarsh"][i],
  role: roles[i % roles.length],
  email: `user${i + 1}@sentinel.io`,
  team: teams[i % teams.length],
  severity: severities[i % severities.length],
  action: "Active",
}));

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetchUsers().then(({ data, isLive: live }) => {
      if (live && data.length > 0) {
        setUsers(data.map((u: any) => ({
          userId: u.userId || u.user_id || u._id || "",
          username: u.username || u.user_name || "",
          role: u.role || "Analyst",
          email: u.email || "",
          team: u.team || "",
          severity: u.severity || "Low",
          action: u.action || "Active",
        })));
      }
      setIsLive(live);
    });
  }, []);
  const [sortField, setSortField] = useState<"username" | "role" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterUsername, setFilterUsername] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterTeam, setFilterTeam] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({ role: "Analyst", severity: "Low" });

  const toggleSort = (field: "username" | "role") => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let data = users.filter((u) =>
      u.username.toLowerCase().includes(filterUsername.toLowerCase()) &&
      u.role.toLowerCase().includes(filterRole.toLowerCase()) &&
      u.team.toLowerCase().includes(filterTeam.toLowerCase())
    );
    if (sortField) {
      data = [...data].sort((a, b) => {
        const cmp = a[sortField].localeCompare(b[sortField]);
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return data;
  }, [users, filterUsername, filterRole, filterTeam, sortField, sortDir]);

  const handleAdd = () => {
    const u: User = {
      userId: newUser.userId || `USR-${String(users.length + 1).padStart(4, "0")}`,
      username: newUser.username || "",
      role: newUser.role || "Analyst",
      email: newUser.email || "",
      team: newUser.team || "",
      severity: newUser.severity || "Low",
      action: newUser.action || "Active",
    };
    setUsers((prev) => [u, ...prev]);
    if (isLive) addUserApi(u).catch(console.error);
    setDialogOpen(false);
    setNewUser({ role: "Analyst", severity: "Low" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        {isLive ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-muted-foreground" />}
        <span className="text-xs text-muted-foreground">{isLive ? "Live API" : "Mock data"}</span>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Input placeholder="Filter by username" value={filterUsername} onChange={(e) => setFilterUsername(e.target.value)} className="w-48" />
        <Input placeholder="Filter by role" value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-48" />
        <Input placeholder="Filter by team" value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)} className="w-48" />
        <Button onClick={() => setDialogOpen(true)} className="ml-auto gap-2"><Plus className="w-4 h-4" />New User</Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("username")}>
                Username <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("role")}>
                Role <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.userId}>
                <TableCell className="font-medium">{u.username}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell>{u.team}</TableCell>
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
          <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div><Label>User ID</Label><Input value={newUser.userId || ""} onChange={(e) => setNewUser((p) => ({ ...p, userId: e.target.value }))} placeholder="USR-0001" /></div>
            <div><Label>Username</Label><Input value={newUser.username || ""} onChange={(e) => setNewUser((p) => ({ ...p, username: e.target.value }))} /></div>
            <div><Label>Role</Label>
              <Select value={newUser.role} onValueChange={(v) => setNewUser((p) => ({ ...p, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Email</Label><Input value={newUser.email || ""} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} /></div>
            <div><Label>Severity</Label>
              <Select value={newUser.severity} onValueChange={(v) => setNewUser((p) => ({ ...p, severity: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{severities.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Team</Label><Input value={newUser.team || ""} onChange={(e) => setNewUser((p) => ({ ...p, team: e.target.value }))} /></div>
            <div><Label>Action</Label><Input value={newUser.action || ""} onChange={(e) => setNewUser((p) => ({ ...p, action: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button onClick={handleAdd}>Add User</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
