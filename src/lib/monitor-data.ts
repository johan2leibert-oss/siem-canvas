// Mock data generators for Monitor section

const eventTypes = [
  "Authentication Events",
  "File and Object Access Events",
  "System Events",
  "User Activity Events",
  "Network Events",
  "Configuration and Change Events",
  "Audit Events",
  "Behavioral Events",
];

const eventNames: Record<string, string[]> = {
  "Authentication Events": ["Login Success", "Login Failed", "MFA Triggered", "Password Reset", "Session Expired"],
  "File and Object Access Events": ["File Downloaded", "File Uploaded", "Object Deleted", "Permission Changed"],
  "System Events": ["Service Restart", "CPU Spike", "Memory Alert", "Disk Full"],
  "User Activity Events": ["Profile Updated", "Account Created", "Role Changed", "API Key Generated"],
  "Network Events": ["Port Scan Detected", "DNS Query Anomaly", "Lateral Movement", "C2 Communication"],
  "Configuration and Change Events": ["Policy Updated", "Firewall Rule Changed", "Config Backup", "Agent Deployed"],
  "Audit Events": ["Compliance Check", "Access Review", "Audit Log Export", "Policy Violation"],
  "Behavioral Events": ["Anomalous Login", "Data Exfiltration", "Privilege Escalation", "Unusual Process"],
};

const severities = ["Low", "Medium", "High", "Critical"] as const;
const sources = ["NDR", "WAF", "DLP", "DAM", "SIEM", "SOAR", "UEBA"];
const incidentTypes = [
  "Brute Force Attack",
  "Data Breach",
  "Malware Infection",
  "Insider Threat",
  "Phishing Campaign",
  "Ransomware",
  "DDoS Attack",
  "Unauthorized Access",
  "Privilege Escalation",
  "Supply Chain Attack",
];
const mitreIds = [
  "T1110", "T1566", "T1059", "T1071", "T1082", "T1083", "T1018",
  "T1021", "T1053", "T1027", "T1105", "T1036", "T1547", "T1078",
];
const hostnames = [
  "web-server-01", "db-primary-02", "fw-edge-01", "ids-sensor-03",
  "mail-server-01", "app-server-04", "proxy-01", "dns-resolver-02",
];

function randomIP() {
  return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

function randomDate(daysBack = 30) {
  const now = Date.now();
  return new Date(now - Math.random() * daysBack * 86400000);
}

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface EventRecord {
  id: string;
  timestamp: Date;
  eventType: string;
  eventName: string;
  attackerIp: string;
  sourceId: string;
  deviceIp: string;
  severity: string;
  source: string;
}

export interface IncidentRecord {
  id: string;
  timestamp: Date;
  incidentType: string;
  eventCount: number;
  attackerIp: string;
  mitreId: string;
  isCorrelated: boolean;
}

export interface RawLogRecord {
  id: string;
  timestamp: Date;
  logMessage: string;
  source: string;
  hostname: string;
  sourceIp: string;
}

export function generateEvents(count: number): EventRecord[] {
  return Array.from({ length: count }, (_, i) => {
    const evtType = randomFrom(eventTypes);
    const names = eventNames[evtType] || ["Unknown"];
    return {
      id: `EVT-${String(i + 1).padStart(5, "0")}`,
      timestamp: randomDate(),
      eventType: evtType,
      eventName: randomFrom(names),
      attackerIp: randomIP(),
      sourceId: `SRC-${Math.floor(Math.random() * 9000) + 1000}`,
      deviceIp: randomIP(),
      severity: randomFrom(severities),
      source: randomFrom(sources),
    };
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function generateIncidents(count: number): IncidentRecord[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `INC-${String(i + 1).padStart(5, "0")}`,
    timestamp: randomDate(),
    incidentType: randomFrom(incidentTypes),
    eventCount: Math.floor(Math.random() * 50) + 1,
    attackerIp: randomIP(),
    mitreId: randomFrom(mitreIds),
    isCorrelated: Math.random() > 0.4,
  })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function generateRawLogs(count: number): RawLogRecord[] {
  const messages = [
    "Failed password for root from {ip} port 22 ssh2",
    "Accepted publickey for admin from {ip} port 443",
    "Connection closed by {ip} [preauth]",
    "firewalld: ACCEPT_INPUT: IN=eth0 SRC={ip} DST=10.0.0.1 PROTO=TCP",
    "kernel: [UFW BLOCK] IN=eth0 OUT= SRC={ip} DST=10.0.0.5 PROTO=UDP",
    "sshd: pam_unix(sshd:auth): authentication failure; rhost={ip}",
    "nginx: access_log - {ip} - GET /api/v1/users 200",
    "systemd: Started Session 1452 of user admin",
    "auditd: USER_AUTH pid=3421 uid=0 auid=1000 msg=op=PAM:authentication",
    "snort: [1:2100498:7] GPL ATTACK_RESPONSE id check returned root from {ip}",
  ];
  return Array.from({ length: count }, (_, i) => {
    const ip = randomIP();
    return {
      id: `LOG-${String(i + 1).padStart(5, "0")}`,
      timestamp: randomDate(),
      logMessage: randomFrom(messages).replace(/\{ip\}/g, ip),
      source: randomFrom(sources),
      hostname: randomFrom(hostnames),
      sourceIp: ip,
    };
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export const EVENT_TYPE_OPTIONS = ["All", "NA", ...eventTypes];
export const SEVERITY_OPTIONS = ["All", "NA", ...severities];
export const SOURCE_OPTIONS = ["All", ...sources];
export const INCIDENT_TYPE_OPTIONS = ["All", ...incidentTypes];
export const EVENT_COUNT_FILTER_OPTIONS = ["All", "Correlated Events", "Isolated Events"];
