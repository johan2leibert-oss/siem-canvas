import { useState } from "react";
import { format } from "date-fns";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CorrelationRule } from "@/lib/correlation-data";
import SeverityBadge from "@/components/monitor/SeverityBadge";

interface ManageRulesProps {
  rules: CorrelationRule[];
  onEditRule: (rule: CorrelationRule) => void;
  onCreateRule: () => void;
  onToggleRule: (id: string) => void;
  onDeleteRule: (id: string) => void;
}

const ManageRules = ({ rules, onEditRule, onCreateRule, onToggleRule, onDeleteRule }: ManageRulesProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Manage Rules</h2>
        <Button onClick={onCreateRule} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Create Rule
        </Button>
      </div>

      <div className="overflow-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last Modified</th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rule Name</th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Username</th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hit Count</th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Severity</th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Enable</th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr
                key={rule.id}
                className="border-t border-border hover:bg-secondary/30 transition-colors cursor-pointer"
                onClick={() => onEditRule(rule)}
              >
                <td className="p-3 font-mono text-xs whitespace-nowrap">{format(rule.lastModified, "yyyy-MM-dd HH:mm")}</td>
                <td className="p-3 text-xs font-medium text-foreground">{rule.ruleName}</td>
                <td className="p-3 text-xs">{rule.username}</td>
                <td className="p-3 font-mono text-xs">{rule.hitCount}</td>
                <td className="p-3"><SeverityBadge severity={rule.severity} /></td>
                <td className="p-3 text-xs text-muted-foreground max-w-[200px] truncate">{rule.description}</td>
                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                  <Switch checked={rule.enabled} onCheckedChange={() => onToggleRule(rule.id)} />
                </td>
                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onEditRule(rule)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="View/Edit">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onEditRule(rule)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onDeleteRule(rule.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRules;
