import { useState } from "react";
import { Shield, Globe, UserCheck, Lock, Brain, Crosshair, Activity, Zap, LucideIcon } from "lucide-react";

interface ModuleData {
  label: string;
  icon: LucideIcon;
  color: string;
  desc: string;
}

const modules: ModuleData[] = [
  { label: "WAF", icon: Shield, color: "187 80% 48%", desc: "Web Application Firewall protects applications from cross-site scripting, SQL injection, and other web exploits by filtering and monitoring HTTP traffic." },
  { label: "UEBA", icon: Brain, color: "260 60% 55%", desc: "User & Entity Behavior Analytics leverages ML models to baseline normal behavior and detect anomalous actions indicating insider threats or compromised accounts." },
  { label: "NDR", icon: Globe, color: "142 70% 45%", desc: "Network Detection & Response provides deep packet inspection and traffic analysis to identify lateral movement, C2 communication, and data exfiltration." },
  { label: "Red Team", icon: Crosshair, color: "0 72% 51%", desc: "Red Team module enables adversary simulation, penetration testing workflows, and attack path mapping to proactively identify vulnerabilities." },
  { label: "SIEM", icon: Activity, color: "45 93% 47%", desc: "Security Information & Event Management aggregates, normalizes, and correlates logs from across your infrastructure to provide unified threat visibility." },
  { label: "SOAR", icon: Zap, color: "340 75% 55%", desc: "Security Orchestration, Automation & Response automates playbooks for incident handling, enrichment, and remediation to reduce mean time to respond." },
  { label: "IDAM", icon: UserCheck, color: "200 70% 50%", desc: "Identity & Access Management enforces authentication policies, role-based access control, and privileged access management across the enterprise." },
  { label: "DLP", icon: Lock, color: "280 60% 50%", desc: "Data Loss Prevention monitors and controls data flows to prevent sensitive information from leaving the organization through email, web, or endpoints." },
];

const About = () => {
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [hoveredModule, setHoveredModule] = useState<number | null>(null);

  const highlighted = hoveredModule ?? activeModule;

  const leftModules = modules.filter((_, i) => i % 2 === 0);
  const rightModules = modules.filter((_, i) => i % 2 === 1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">About</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left modules */}
        <div className="space-y-4">
          {leftModules.map((mod) => {
            const idx = modules.indexOf(mod);
            return (
              <ModuleCard
                key={mod.label}
                mod={mod}
                isActive={highlighted === idx}
                onClick={() => setActiveModule(activeModule === idx ? null : idx)}
              />
            );
          })}
        </div>

        {/* Center interactive diagram */}
        <div className="flex items-center justify-center min-h-[420px]">
          <InteractiveDiagram
            modules={modules}
            highlighted={highlighted}
            onHover={setHoveredModule}
            onClick={(i) => setActiveModule(activeModule === i ? null : i)}
          />
        </div>

        {/* Right modules */}
        <div className="space-y-4">
          {rightModules.map((mod) => {
            const idx = modules.indexOf(mod);
            return (
              <ModuleCard
                key={mod.label}
                mod={mod}
                isActive={highlighted === idx}
                onClick={() => setActiveModule(activeModule === idx ? null : idx)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

function ModuleCard({ mod, isActive, onClick }: { mod: ModuleData; isActive: boolean; onClick: () => void }) {
  const Icon = mod.icon;
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border bg-card cursor-pointer transition-all duration-300 ${
        isActive
          ? "border-primary/50 shadow-lg shadow-primary/5 scale-[1.02]"
          : "border-border hover:border-primary/30"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="p-1.5 rounded transition-colors duration-300"
          style={{ backgroundColor: `hsl(${mod.color} / ${isActive ? 0.2 : 0.1})` }}
        >
          <Icon className="w-4 h-4" style={{ color: `hsl(${mod.color})` }} />
        </div>
        <h3 className="font-semibold text-foreground">{mod.label}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{mod.desc}</p>
    </div>
  );
}

function InteractiveDiagram({
  modules,
  highlighted,
  onHover,
  onClick,
}: {
  modules: ModuleData[];
  highlighted: number | null;
  onHover: (i: number | null) => void;
  onClick: (i: number) => void;
}) {
  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const orbitR = 130;
  const nodeR = 28;
  const centerR = 44;

  const positions = modules.map((_, i) => {
    const angle = (i / modules.length) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + orbitR * Math.cos(angle), y: cy + orbitR * Math.sin(angle) };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none">
      <defs>
        {/* Glow filter */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Pulse animation */}
        <radialGradient id="centerGrad">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Orbit ring */}
      <circle cx={cx} cy={cy} r={orbitR} fill="none" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4 4" opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="60s" repeatCount="indefinite" />
      </circle>

      {/* Connecting lines */}
      {positions.map((pos, i) => {
        const isHighlighted = highlighted === i;
        return (
          <line
            key={`line-${i}`}
            x1={cx}
            y1={cy}
            x2={pos.x}
            y2={pos.y}
            stroke={isHighlighted ? `hsl(${modules[i].color})` : "hsl(var(--border))"}
            strokeWidth={isHighlighted ? 2 : 1}
            strokeOpacity={isHighlighted ? 0.6 : 0.2}
            className="transition-all duration-300"
          />
        );
      })}

      {/* Data flow particles on highlighted line */}
      {highlighted !== null && (
        <>
          <circle r="3" fill={`hsl(${modules[highlighted].color})`} opacity="0.8" filter="url(#glow)">
            <animateMotion dur="1.5s" repeatCount="indefinite" path={`M${cx},${cy} L${positions[highlighted].x},${positions[highlighted].y}`} />
          </circle>
          <circle r="3" fill={`hsl(${modules[highlighted].color})`} opacity="0.8" filter="url(#glow)">
            <animateMotion dur="1.5s" repeatCount="indefinite" begin="0.75s" path={`M${positions[highlighted].x},${positions[highlighted].y} L${cx},${cy}`} />
          </circle>
        </>
      )}

      {/* Center pulse */}
      <circle cx={cx} cy={cy} r={centerR + 20} fill="url(#centerGrad)">
        <animate attributeName="r" values={`${centerR + 10};${centerR + 25};${centerR + 10}`} dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.2;0.5" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* Center node */}
      <circle cx={cx} cy={cy} r={centerR} fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
      <text x={cx} y={cy - 8} textAnchor="middle" fill="hsl(var(--primary))" fontSize="9" fontWeight="800" letterSpacing="0.5">NEXT GEN</text>
      <text x={cx} y={cy + 5} textAnchor="middle" fill="hsl(var(--primary))" fontSize="9" fontWeight="800" letterSpacing="0.5">AI SOC</text>
      {/* Small shield icon approximation */}
      <text x={cx} y={cy + 20} textAnchor="middle" fill="hsl(var(--primary))" fontSize="12">🛡️</text>

      {/* Module nodes */}
      {positions.map((pos, i) => {
        const mod = modules[i];
        const isHighlighted = highlighted === i;
        return (
          <g
            key={`node-${i}`}
            className="cursor-pointer"
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(i)}
          >
            {/* Hover glow */}
            {isHighlighted && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeR + 6}
                fill={`hsl(${mod.color} / 0.15)`}
                className="transition-all duration-300"
              >
                <animate attributeName="r" values={`${nodeR + 4};${nodeR + 8};${nodeR + 4}`} dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            {/* Node circle */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={nodeR}
              fill="hsl(var(--card))"
              stroke={isHighlighted ? `hsl(${mod.color})` : "hsl(var(--border))"}
              strokeWidth={isHighlighted ? 2 : 1}
              className="transition-all duration-300"
            />
            {/* Label */}
            <text
              x={pos.x}
              y={pos.y + 4}
              textAnchor="middle"
              fill={isHighlighted ? `hsl(${mod.color})` : "hsl(var(--muted-foreground))"}
              fontSize="10"
              fontWeight="600"
              className="transition-all duration-300 pointer-events-none"
            >
              {mod.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default About;
