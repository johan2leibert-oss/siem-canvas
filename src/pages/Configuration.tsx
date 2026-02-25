import { useState } from "react";
import { Users, Server, Cpu, Shield, Tag } from "lucide-react";
import UserManagement from "@/components/configuration/UserManagement";
import AssetManagement from "@/components/configuration/AssetManagement";
import AgentManagement from "@/components/configuration/AgentManagement";
import SecurityStackConfig from "@/components/configuration/SecurityStackConfig";
import Placeholder from "./Placeholder";

const tabs = [
  { id: "users", label: "User Management", icon: Users },
  { id: "assets", label: "Asset Management", icon: Server },
  { id: "agents", label: "Agents with Endpoints", icon: Cpu },
  { id: "security-stack", label: "Security Stack Configuration", icon: Shield },
  { id: "event-incident", label: "Event & Incident Category", icon: Tag },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Configuration = () => {
  const [activeTab, setActiveTab] = useState<TabId>("users");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Configuration</h1>

      <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg w-fit flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "users" && <UserManagement />}
      {activeTab === "assets" && <AssetManagement />}
      {activeTab === "agents" && <AgentManagement />}
      {activeTab === "security-stack" && <SecurityStackConfig />}
      {activeTab === "event-incident" && <Placeholder />}
    </div>
  );
};

export default Configuration;
