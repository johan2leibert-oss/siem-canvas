// Correlation rules mock data

export interface CorrelationRule {
  id: string;
  ruleName: string;
  lastModified: Date;
  username: string;
  hitCount: number;
  severity: string;
  description: string;
  enabled: boolean;
  ruleType: string;
  timeWindow: number;
  timeWindowUnit: "sec" | "min" | "hours";
  groupBy: string[];
  mitreIds: string[];
  eventConfigs: EventConfig[];
}

export interface EventConfig {
  id: string;
  eventType: string;
  threshold: number;
  logicalOperator?: "AND" | "OR";
}

const severities = ["Low", "Medium", "High", "Critical"];
const ruleTypes = ["Threshold", "Sequence", "Aggregation", "Pattern"];
const usernames = ["admin", "analyst01", "soc_lead", "security_ops", "threat_hunter"];
const groupByOptions = ["Hostname", "Attacker IP", "Username", "Device IP"];

export const EVENT_TYPES_LIST = [
  "Authentication Events",
  "File and Object Access Events",
  "System Events",
  "User Activity Events",
  "Network Events",
  "Configuration and Change Events",
  "Audit Events",
  "Behavioral Events",
];

export const MITRE_IDS_LIST = [
  "T1110 - Brute Force",
  "T1566 - Phishing",
  "T1059 - Command and Scripting",
  "T1071 - Application Layer Protocol",
  "T1082 - System Information Discovery",
  "T1083 - File and Directory Discovery",
  "T1018 - Remote System Discovery",
  "T1021 - Remote Services",
  "T1053 - Scheduled Task/Job",
  "T1027 - Obfuscated Files",
  "T1105 - Ingress Tool Transfer",
  "T1036 - Masquerading",
  "T1547 - Boot or Logon Autostart",
  "T1078 - Valid Accounts",
];

export const GROUP_BY_OPTIONS = groupByOptions;

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateRules(count: number): CorrelationRule[] {
  const ruleNames = [
    "Brute Force Detection",
    "Lateral Movement Alert",
    "Privilege Escalation Rule",
    "Data Exfiltration Monitor",
    "Suspicious Login Pattern",
    "Multi-Source Correlation",
    "Anomalous File Access",
    "Network Scan Detection",
    "Insider Threat Indicator",
    "Ransomware Behavior",
    "C2 Communication Alert",
    "Failed Auth Spike",
    "Config Change Anomaly",
    "Audit Log Tampering",
    "Account Compromise",
  ];

  return Array.from({ length: count }, (_, i) => {
    const numEvents = Math.floor(Math.random() * 3) + 1;
    const eventConfigs: EventConfig[] = Array.from({ length: numEvents }, (_, j) => ({
      id: `ec-${i}-${j}`,
      eventType: randomFrom(EVENT_TYPES_LIST),
      threshold: Math.floor(Math.random() * 50) + 1,
      logicalOperator: j < numEvents - 1 ? randomFrom(["AND", "OR"] as const) : undefined,
    }));

    return {
      id: `RULE-${String(i + 1).padStart(4, "0")}`,
      ruleName: ruleNames[i % ruleNames.length] + (i >= ruleNames.length ? ` v${Math.floor(i / ruleNames.length) + 1}` : ""),
      lastModified: new Date(Date.now() - Math.random() * 30 * 86400000),
      username: randomFrom(usernames),
      hitCount: Math.floor(Math.random() * 500),
      severity: randomFrom(severities),
      description: `Monitors ${randomFrom(EVENT_TYPES_LIST).toLowerCase()} for suspicious patterns and triggers alerts when threshold is exceeded.`,
      enabled: Math.random() > 0.3,
      ruleType: randomFrom(ruleTypes),
      timeWindow: Math.floor(Math.random() * 60) + 1,
      timeWindowUnit: randomFrom(["sec", "min", "hours"] as const),
      groupBy: Array.from(new Set(Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => randomFrom(groupByOptions)))),
      mitreIds: Array.from(new Set(Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => randomFrom(MITRE_IDS_LIST)))),
      eventConfigs,
    };
  });
}
