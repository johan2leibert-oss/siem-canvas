import { Shield, Globe, UserCheck, Lock, Brain, Crosshair, Activity, Zap } from "lucide-react";

const modules = [
  { label: "WAF", icon: Shield, desc: "Web Application Firewall protects applications from cross-site scripting, SQL injection, and other web exploits by filtering and monitoring HTTP traffic." },
  { label: "UEBA", icon: Brain, desc: "User & Entity Behavior Analytics leverages ML models to baseline normal behavior and detect anomalous actions indicating insider threats or compromised accounts." },
  { label: "NDR", icon: Globe, desc: "Network Detection & Response provides deep packet inspection and traffic analysis to identify lateral movement, C2 communication, and data exfiltration." },
  { label: "Red Team", icon: Crosshair, desc: "Red Team module enables adversary simulation, penetration testing workflows, and attack path mapping to proactively identify vulnerabilities." },
  { label: "SIEM", icon: Activity, desc: "Security Information & Event Management aggregates, normalizes, and correlates logs from across your infrastructure to provide unified threat visibility." },
  { label: "SOAR", icon: Zap, desc: "Security Orchestration, Automation & Response automates playbooks for incident handling, enrichment, and remediation to reduce mean time to respond." },
  { label: "IDAM", icon: UserCheck, desc: "Identity & Access Management enforces authentication policies, role-based access control, and privileged access management across the enterprise." },
  { label: "DLP", icon: Lock, desc: "Data Loss Prevention monitors and controls data flows to prevent sensitive information from leaving the organization through email, web, or endpoints." },
];

const About = () => {
  const leftModules = modules.filter((_, i) => i % 2 === 0);
  const rightModules = modules.filter((_, i) => i % 2 === 1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">About</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left modules */}
        <div className="space-y-4">
          {leftModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div key={mod.label} className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded bg-primary/10"><Icon className="w-4 h-4 text-primary" /></div>
                  <h3 className="font-semibold text-foreground">{mod.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{mod.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Center visual */}
        <div className="flex items-center justify-center">
          <div className="relative w-64 h-64">
            {/* Central label */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-28 h-28 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs font-bold text-primary leading-tight">NEXT GEN<br/>AI SOC</p>
                </div>
              </div>
            </div>
            {/* Orbiting icons */}
            {modules.map((mod, i) => {
              const Icon = mod.icon;
              const angle = (i / modules.length) * 360;
              const rad = (angle * Math.PI) / 180;
              const x = 50 + 40 * Math.cos(rad);
              const y = 50 + 40 * Math.sin(rad);
              return (
                <div
                  key={mod.label}
                  className="absolute w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-sm"
                  style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                  title={mod.label}
                >
                  <Icon className="w-4 h-4 text-primary" />
                </div>
              );
            })}
            {/* Connecting lines via SVG */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              {modules.map((_, i) => {
                const angle = (i / modules.length) * 360;
                const rad = (angle * Math.PI) / 180;
                const x = 50 + 40 * Math.cos(rad);
                const y = 50 + 40 * Math.sin(rad);
                return <line key={i} x1="50" y1="50" x2={x} y2={y} stroke="hsl(var(--primary))" strokeOpacity="0.15" strokeWidth="0.5" />;
              })}
            </svg>
          </div>
        </div>

        {/* Right modules */}
        <div className="space-y-4">
          {rightModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div key={mod.label} className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded bg-primary/10"><Icon className="w-4 h-4 text-primary" /></div>
                  <h3 className="font-semibold text-foreground">{mod.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{mod.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default About;
