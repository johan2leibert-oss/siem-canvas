import { useState } from "react";
import { BookOpen, FileText, Search } from "lucide-react";
import { CorrelationRule, generateRules } from "@/lib/correlation-data";
import ManageRules from "@/components/correlation/ManageRules";
import RuleEditor from "@/components/correlation/RuleEditor";
import Placeholder from "./Placeholder";

const tabs = [
  { id: "rules", label: "Rules", icon: BookOpen },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "dynamic-query", label: "Dynamic Query", icon: Search },
] as const;

type TabId = (typeof tabs)[number]["id"];
type RuleView = "manage" | "editor";

const Correlation = () => {
  const [activeTab, setActiveTab] = useState<TabId>("rules");
  const [ruleView, setRuleView] = useState<RuleView>("manage");
  const [rules, setRules] = useState<CorrelationRule[]>(() => generateRules(15));
  const [editingRule, setEditingRule] = useState<CorrelationRule | null>(null);

  const handleEditRule = (rule: CorrelationRule) => {
    setEditingRule(rule);
    setRuleView("editor");
  };

  const handleCreateRule = () => {
    setEditingRule(null);
    setRuleView("editor");
  };

  const handleToggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSaveRule = (ruleData: Partial<CorrelationRule>) => {
    if (ruleData.id) {
      setRules((prev) =>
        prev.map((r) =>
          r.id === ruleData.id ? { ...r, ...ruleData, lastModified: new Date() } : r
        )
      );
    } else {
      const newRule: CorrelationRule = {
        id: `RULE-${String(rules.length + 1).padStart(4, "0")}`,
        ruleName: ruleData.ruleName || "New Rule",
        lastModified: new Date(),
        username: ruleData.username || "admin",
        hitCount: 0,
        severity: ruleData.severity || "Medium",
        description: ruleData.description || "",
        enabled: true,
        ruleType: ruleData.ruleType || "Threshold",
        timeWindow: ruleData.timeWindow || 5,
        timeWindowUnit: ruleData.timeWindowUnit || "min",
        groupBy: ruleData.groupBy || [],
        mitreIds: ruleData.mitreIds || [],
        eventConfigs: ruleData.eventConfigs || [],
      };
      setRules((prev) => [newRule, ...prev]);
    }
    setRuleView("manage");
    setEditingRule(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Correlation</h1>

      <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); if (tab.id === "rules") setRuleView("manage"); }}
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

      {activeTab === "rules" && ruleView === "manage" && (
        <ManageRules
          rules={rules}
          onEditRule={handleEditRule}
          onCreateRule={handleCreateRule}
          onToggleRule={handleToggleRule}
          onDeleteRule={handleDeleteRule}
        />
      )}
      {activeTab === "rules" && ruleView === "editor" && (
        <RuleEditor
          rule={editingRule}
          onBack={() => { setRuleView("manage"); setEditingRule(null); }}
          onSave={handleSaveRule}
        />
      )}
      {activeTab === "reports" && <Placeholder />}
      {activeTab === "dynamic-query" && <Placeholder />}
    </div>
  );
};

export default Correlation;
