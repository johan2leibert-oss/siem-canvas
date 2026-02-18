import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Shield, LogOut, Bell } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Dashboard", path: "/dashboard/overview" },
  { label: "Monitor", path: "/dashboard/monitor" },
  { label: "Correlation", path: "/dashboard/correlation" },
  { label: "Configuration", path: "/dashboard/configuration" },
  { label: "Security Stack", path: "/dashboard/security-stack" },
  { label: "About", path: "/dashboard/about" },
];

const DashboardLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center h-14 px-6">
          <div className="flex items-center gap-2 mr-8">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold text-foreground tracking-tight">
              Sentinel<span className="text-primary">SIEM</span>
            </span>
          </div>

          <nav className="flex items-center gap-1 flex-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <ThemeToggle />
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm ml-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
