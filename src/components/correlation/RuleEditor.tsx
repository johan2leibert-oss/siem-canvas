import { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CorrelationRule,
  EventConfig,
  EVENT_TYPES_LIST,
  MITRE_IDS_LIST,
  GROUP_BY_OPTIONS,
} from "@/lib/correlation-data";

interface RuleEditorProps {
  rule?: CorrelationRule | null;
  onBack: () => void;
  onSave: (rule: Partial<CorrelationRule>) => void;
}

const RuleEditor = ({ rule, onBack, onSave }: RuleEditorProps) => {
  const [ruleName, setRuleName] = useState(rule?.ruleName || "");
  const [ruleType, setRuleType] = useState(rule?.ruleType || "Threshold");
  const [username, setUsername] = useState(rule?.username || "");
  const [severity, setSeverity] = useState(rule?.severity || "Medium");
  const [description, setDescription] = useState(rule?.description || "");
  const [timeWindow, setTimeWindow] = useState(rule?.timeWindow?.toString() || "");
  const [timeWindowUnit, setTimeWindowUnit] = useState<"sec" | "min" | "hours">(rule?.timeWindowUnit || "min");
  const [groupBy, setGroupBy] = useState<string[]>(rule?.groupBy || []);
  const [selectedMitre, setSelectedMitre] = useState<string[]>(rule?.mitreIds || []);
  const [eventConfigs, setEventConfigs] = useState<EventConfig[]>(
    rule?.eventConfigs || []
  );

  const toggleGroupBy = (item: string) => {
    setGroupBy((prev) => prev.includes(item) ? prev.filter((g) => g !== item) : [...prev, item]);
  };

  const toggleMitre = (id: string) => {
    setSelectedMitre((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
  };

  const addEventConfig = (eventType: string) => {
    if (eventConfigs.find((ec) => ec.eventType === eventType)) return;
    setEventConfigs((prev) => [
      ...prev.map((ec, i) => ({
        ...ec,
        logicalOperator: i === prev.length - 1 && !ec.logicalOperator ? "AND" as const : ec.logicalOperator,
      })),
      { id: `ec-new-${Date.now()}`, eventType, threshold: 1 },
    ]);
  };

  const removeEventConfig = (id: string) => {
    setEventConfigs((prev) => {
      const updated = prev.filter((ec) => ec.id !== id);
      // Remove trailing logical operator
      if (updated.length > 0) {
        updated[updated.length - 1] = { ...updated[updated.length - 1], logicalOperator: undefined };
      }
      return updated;
    });
  };

  const updateThreshold = (id: string, threshold: number) => {
    setEventConfigs((prev) => prev.map((ec) => ec.id === id ? { ...ec, threshold } : ec));
  };

  const updateOperator = (id: string, op: "AND" | "OR") => {
    setEventConfigs((prev) => prev.map((ec) => ec.id === id ? { ...ec, logicalOperator: op } : ec));
  };

  const handleSave = () => {
    onSave({
      id: rule?.id,
      ruleName,
      ruleType,
      username,
      severity,
      description,
      timeWindow: parseInt(timeWindow) || 0,
      timeWindowUnit,
      groupBy,
      mitreIds: selectedMitre,
      eventConfigs,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <h2 className="text-lg font-semibold text-foreground">
          {rule ? "Edit Rule" : "Create Rule"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Rule Form */}
        <div className="space-y-4 p-4 rounded-lg border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Rule Configuration</h3>

          <div className="space-y-3">
            <div>
              <Label>Rule Name</Label>
              <Input value={ruleName} onChange={(e) => setRuleName(e.target.value)} placeholder="Enter rule name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Rule Type</Label>
                <Select value={ruleType} onValueChange={setRuleType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Threshold", "Sequence", "Aggregation", "Pattern"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Severity</Label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Low", "Medium", "High", "Critical"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Username</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the rule" rows={3} />
            </div>
            <div>
              <Label>Rule Time Window</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={timeWindow}
                  onChange={(e) => setTimeWindow(e.target.value)}
                  placeholder="Enter number"
                  className="flex-1"
                />
                <Select value={timeWindowUnit} onValueChange={(v) => setTimeWindowUnit(v as "sec" | "min" | "hours")}>
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sec">sec</SelectItem>
                    <SelectItem value="min">min</SelectItem>
                    <SelectItem value="hours">hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Group By</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {GROUP_BY_OPTIONS.map((g) => (
                  <label key={g} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <Checkbox checked={groupBy.includes(g)} onCheckedChange={() => toggleGroupBy(g)} />
                    {g}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label>MITRE IDs</Label>
              <div className="flex flex-wrap gap-2 mt-1 max-h-32 overflow-auto">
                {MITRE_IDS_LIST.map((m) => (
                  <label key={m} className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <Checkbox checked={selectedMitre.includes(m)} onCheckedChange={() => toggleMitre(m)} />
                    {m}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">Save Rule</Button>
        </div>

        {/* Right: Event Type Selection & Threshold */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Select Event Types</h3>
            <div className="space-y-1">
              {EVENT_TYPES_LIST.map((et) => (
                <button
                  key={et}
                  onClick={() => addEventConfig(et)}
                  disabled={eventConfigs.some((ec) => ec.eventType === et)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    eventConfigs.some((ec) => ec.eventType === et)
                      ? "bg-primary/10 text-primary cursor-not-allowed"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  {et}
                </button>
              ))}
            </div>
          </div>

          {eventConfigs.length > 0 && (
            <div className="p-4 rounded-lg border border-border bg-card space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Event Threshold Configuration</h3>
              {eventConfigs.map((ec, idx) => (
                <div key={ec.id}>
                  <div className="flex items-center gap-3 p-3 rounded border border-border bg-secondary/30">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{ec.eventType}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Label className="text-xs">Threshold:</Label>
                        <Input
                          type="number"
                          min={1}
                          value={ec.threshold}
                          onChange={(e) => updateThreshold(ec.id, parseInt(e.target.value) || 1)}
                          className="w-20 h-7 text-xs"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeEventConfig(ec.id)}
                      className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {idx < eventConfigs.length - 1 && (
                    <div className="flex justify-center my-2">
                      <Select
                        value={ec.logicalOperator || "AND"}
                        onValueChange={(v) => updateOperator(ec.id, v as "AND" | "OR")}
                      >
                        <SelectTrigger className="w-24 h-8 text-xs font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AND">AND</SelectItem>
                          <SelectItem value="OR">OR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RuleEditor;
