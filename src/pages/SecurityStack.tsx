import { useState } from "react";
import { Shield, Globe, UserCheck, Lock, Brain, Crosshair } from "lucide-react";

const modules = [
  { id: "ndr", label: "NDR", icon: Globe, description: "Network Detection & Response — monitors network traffic for threats and anomalies." },
  { id: "waf", label: "WAF", icon: Shield, description: "Web Application Firewall — protects web applications from exploits and attacks." },
  { id: "idam", label: "IDAM", icon: UserCheck, description: "Identity & Access Management — manages user identities and access policies." },
  { id: "dlp", label: "DLP", icon: Lock, description: "Data Loss Prevention — prevents unauthorized data exfiltration." },
  { id: "ueba", label: "UEBA", icon: Brain, description: "User & Entity Behavior Analytics — detects anomalous user behavior." },
  { id: "red-team", label: "Red Team", icon: Crosshair, description: "Red Team tools for offensive security testing and vulnerability assessment." },
];

const SecurityStack = () => {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Security Stack</h1>

      <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg w-fit flex-wrap">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.id}
              className="relative"
              onMouseEnter={() => setHoveredModule(mod.id)}
              onMouseLeave={() => setHoveredModule(null)}
            >
              <button className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                hoveredModule === mod.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}>
                <Icon className="w-4 h-4" />
                {mod.label}
              </button>
              {hoveredModule === mod.id && (
                <div className="absolute top-full left-0 mt-1 z-50 w-72 p-3 rounded-lg border border-border bg-popover text-popover-foreground shadow-lg">
                  <p className="text-sm font-semibold">{mod.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{mod.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center text-muted-foreground">
          <Shield className="w-12 h-12 mx-auto mb-3 text-primary/40" />
          <p className="text-sm">Hover on a module above to see its details. Click to navigate.</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityStack;
