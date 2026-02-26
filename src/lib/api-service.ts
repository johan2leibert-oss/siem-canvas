// API Service Layer - fetches from real backend, falls back to mock data
import { API_ENDPOINTS, API_KEY, isApiConfigured } from "./api-config";
import {
  EventRecord, IncidentRecord, RawLogRecord,
  generateEvents, generateIncidents, generateRawLogs,
} from "./monitor-data";
import { CorrelationRule, generateRules } from "./correlation-data";

// ---------- Generic fetch wrapper ----------

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

async function tryApi<T>(apiCall: () => Promise<T>, fallback: () => T): Promise<{ data: T; isLive: boolean }> {
  if (!isApiConfigured()) {
    return { data: fallback(), isLive: false };
  }
  try {
    const data = await apiCall();
    return { data, isLive: true };
  } catch (err) {
    console.warn("API unreachable, using mock data:", err);
    return { data: fallback(), isLive: false };
  }
}

// ---------- Events ----------

export async function fetchEvents() {
  return tryApi<EventRecord[]>(
    async () => {
      const res = await apiFetch<any>(API_ENDPOINTS.GET_EVENTS);
      // Map API response to EventRecord shape - adjust mapping based on your actual API response
      if (Array.isArray(res)) return res.map(mapApiEvent);
      if (res?.data && Array.isArray(res.data)) return res.data.map(mapApiEvent);
      return generateEvents(200);
    },
    () => generateEvents(200)
  );
}

function mapApiEvent(raw: any): EventRecord {
  return {
    id: raw.id || raw._id || raw.event_id || `EVT-${Date.now()}-${Math.random()}`,
    timestamp: new Date(raw.timestamp || raw.created_at || Date.now()),
    eventType: raw.eventType || raw.event_type || raw.type || "Unknown",
    eventName: raw.eventName || raw.event_name || raw.name || "Unknown",
    attackerIp: raw.attackerIp || raw.attacker_ip || raw.src_ip || raw.source_ip || "0.0.0.0",
    sourceId: raw.sourceId || raw.source_id || "N/A",
    deviceIp: raw.deviceIp || raw.device_ip || raw.dst_ip || "0.0.0.0",
    severity: raw.severity || "Low",
    source: raw.source || "SIEM",
  };
}

// ---------- Incidents ----------

export async function fetchIncidents() {
  return tryApi<IncidentRecord[]>(
    async () => {
      const res = await apiFetch<any>(API_ENDPOINTS.GET_INCIDENTS);
      if (Array.isArray(res)) return res.map(mapApiIncident);
      if (res?.data && Array.isArray(res.data)) return res.data.map(mapApiIncident);
      return generateIncidents(150);
    },
    () => generateIncidents(150)
  );
}

function mapApiIncident(raw: any): IncidentRecord {
  return {
    id: raw.id || raw._id || `INC-${Date.now()}`,
    timestamp: new Date(raw.timestamp || raw.created_at || Date.now()),
    incidentType: raw.incidentType || raw.incident_type || raw.type || "Unknown",
    eventCount: raw.eventCount || raw.event_count || 1,
    attackerIp: raw.attackerIp || raw.attacker_ip || raw.src_ip || "0.0.0.0",
    mitreId: raw.mitreId || raw.mitre_id || "T0000",
    isCorrelated: raw.isCorrelated ?? raw.is_correlated ?? false,
  };
}

// ---------- Raw Logs ----------

export async function fetchRawLogs() {
  return tryApi<RawLogRecord[]>(
    async () => {
      const res = await apiFetch<any>(API_ENDPOINTS.GET_RAW_LOG);
      if (Array.isArray(res)) return res.map(mapApiRawLog);
      if (res?.data && Array.isArray(res.data)) return res.data.map(mapApiRawLog);
      return generateRawLogs(300);
    },
    () => generateRawLogs(300)
  );
}

function mapApiRawLog(raw: any): RawLogRecord {
  return {
    id: raw.id || raw._id || `LOG-${Date.now()}`,
    timestamp: new Date(raw.timestamp || raw.created_at || Date.now()),
    logMessage: raw.logMessage || raw.log_message || raw.message || raw.msg || "",
    source: raw.source || "SIEM",
    hostname: raw.hostname || raw.host || "unknown",
    sourceIp: raw.sourceIp || raw.source_ip || raw.src_ip || "0.0.0.0",
  };
}

// ---------- Correlation Rules ----------

export async function fetchCorrelationRules() {
  return tryApi<CorrelationRule[]>(
    async () => {
      const url = `${API_ENDPOINTS.GET_RULES}?api_key=${API_KEY}`;
      const res = await apiFetch<any>(url);
      if (Array.isArray(res)) return res;
      if (res?.data && Array.isArray(res.data)) return res.data;
      return generateRules(15);
    },
    () => generateRules(15)
  );
}

export async function addCorrelationRule(rule: any) {
  return apiFetch(API_ENDPOINTS.ADD_RULE, {
    method: "POST",
    body: JSON.stringify(rule),
  });
}

export async function updateCorrelationRule(ruleId: string, rule: any) {
  return apiFetch(`${API_ENDPOINTS.UPDATE_RULE}${ruleId}`, {
    method: "PUT",
    body: JSON.stringify(rule),
  });
}

// ---------- Users ----------

export async function fetchUsers() {
  return tryApi<any[]>(
    async () => {
      const res = await apiFetch<any>(API_ENDPOINTS.GET_USERS);
      if (Array.isArray(res)) return res;
      if (res?.data && Array.isArray(res.data)) return res.data;
      return [];
    },
    () => []
  );
}

export async function addUser(user: any) {
  return apiFetch(API_ENDPOINTS.ADD_USERS, {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export async function deleteUser(userId: string) {
  return apiFetch(`${API_ENDPOINTS.DELETE_USERS}/${userId}?api_key=${API_KEY}`, {
    method: "DELETE",
  });
}

export async function updateUser(user: any) {
  return apiFetch(API_ENDPOINTS.UPDATE_USERS, {
    method: "PUT",
    body: JSON.stringify(user),
  });
}

// ---------- Assets / Devices ----------

export async function fetchAssets() {
  return tryApi<any[]>(
    async () => {
      const res = await apiFetch<any>(API_ENDPOINTS.GET_ASSET);
      if (Array.isArray(res)) return res;
      if (res?.data && Array.isArray(res.data)) return res.data;
      return [];
    },
    () => []
  );
}

export async function addAsset(asset: any) {
  return apiFetch(API_ENDPOINTS.ADD_ASSET, {
    method: "POST",
    body: JSON.stringify(asset),
  });
}

export async function deleteAsset(assetId: string) {
  return apiFetch(`${API_ENDPOINTS.DELETE_ASSET}&id=${assetId}`, {
    method: "DELETE",
  });
}

// ---------- Agents ----------

export async function fetchAgents() {
  return tryApi<any[]>(
    async () => {
      const res = await apiFetch<any>(API_ENDPOINTS.GET_AGENTS);
      if (Array.isArray(res)) return res;
      if (res?.data && Array.isArray(res.data)) return res.data;
      return [];
    },
    () => []
  );
}

export async function addAgent(agent: any) {
  return apiFetch(API_ENDPOINTS.ADD_AGENTS, {
    method: "POST",
    body: JSON.stringify(agent),
  });
}

// ---------- Security Stack Modules ----------

export async function fetchModules() {
  return tryApi<any[]>(
    async () => {
      const res = await apiFetch<any>(API_ENDPOINTS.GET_MODULES);
      if (Array.isArray(res)) return res;
      if (res?.data && Array.isArray(res.data)) return res.data;
      return [];
    },
    () => []
  );
}

export async function addModule(module: any) {
  return apiFetch(API_ENDPOINTS.ADD_MODULES, {
    method: "POST",
    body: JSON.stringify(module),
  });
}

export async function deleteModule(moduleId: string) {
  return apiFetch(`${API_ENDPOINTS.DELETE_MODULES}/${moduleId}`, {
    method: "DELETE",
  });
}

// ---------- Dashboard Charts ----------

export async function fetchEventSeverity() {
  return tryApi<any>(
    () => apiFetch(API_ENDPOINTS.GET_EVENT_SEVERITY),
    () => null
  );
}

export async function fetchIncidentSeverity() {
  return tryApi<any>(
    () => apiFetch(API_ENDPOINTS.GET_INCIDENT_SEVERITY),
    () => null
  );
}

export async function fetchEventCount() {
  return tryApi<any>(
    () => apiFetch(API_ENDPOINTS.GET_EVENT_COUNT),
    () => null
  );
}

export async function fetchIncidentCount() {
  return tryApi<any>(
    () => apiFetch(API_ENDPOINTS.GET_INCIDENT_COUNT),
    () => null
  );
}

// ---------- Auth ----------

export async function loginApi(credentials: { username: string; password: string }) {
  return apiFetch<any>(API_ENDPOINTS.POST_LOGIN, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
