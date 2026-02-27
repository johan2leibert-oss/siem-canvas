// API Configuration - hardcoded for internal network deployment
// These IPs are your actual backend servers on the local network

const API_BASE = "http://10.229.42.103";
const WS_BASE = "ws://10.229.42.103";
const ASSET_USER_BASE = "http://10.229.40.134";
const AGENT_BASE = "http://10.229.40.67:5000";
const CHARTS_BASE = "http://10.229.40.96:5000";
const ENDPOINT_BASE = "http://10.229.40.134";

const SIEM_API_DATA = "/api/soc/siem/data";
const SIEM_API_BASE = "/api/soc/siem";

export const API_KEY = "2464dbbe45a19caf825db67f1e5ead1af3b7196dfc4be155f806adc9c414eb97";

export const API_ENDPOINTS = {
  // Events
  GET_EVENTS: `${ASSET_USER_BASE}${SIEM_API_DATA}/siem_recieve_events`,
  GET_WS_EVENTS: `${WS_BASE}${SIEM_API_BASE}/events`,

  // Incidents
  GET_INCIDENTS: `${ASSET_USER_BASE}${SIEM_API_DATA}/incident_table`,

  // Correlation Rules
  ADD_RULE: "http://10.229.40.67:8000/securityRules/createRules",
  UPDATE_RULE: "http://10.229.40.67:8000/securityRules/update/",
  GET_RULES: `${ASSET_USER_BASE}${SIEM_API_DATA}/correlation_rule`,

  // Users
  GET_USERS: `${ASSET_USER_BASE}${SIEM_API_DATA}/soc_user_mgmt_info?api_key=${API_KEY}`,
  ADD_USERS: `${ASSET_USER_BASE}${SIEM_API_DATA}/soc_user_mgmt_info?api_key=${API_KEY}`,
  DELETE_USERS: `${ASSET_USER_BASE}${SIEM_API_DATA}/soc_user_mgmt_info`,
  UPDATE_USERS: `${ASSET_USER_BASE}${SIEM_API_DATA}/soc_user_mgmt_info?api_key=${API_KEY}`,

  // Security Stack Modules
  ADD_MODULES: `${API_BASE}${SIEM_API_DATA}/securityStack`,
  GET_MODULES: `${API_BASE}${SIEM_API_DATA}/securityStack`,
  DELETE_MODULES: `${API_BASE}${SIEM_API_DATA}/securityStack`,
  UPDATE_MODULES: `${API_BASE}${SIEM_API_DATA}/securityStack`,

  // Assets / Devices
  GET_ASSET: `${ASSET_USER_BASE}${SIEM_API_DATA}/soc_asset_data_info?api_key=${API_KEY}`,
  ADD_ASSET: `${ASSET_USER_BASE}${SIEM_API_DATA}/soc_asset_data_info?api_key=${API_KEY}`,
  UPDATE_ASSET: `${ASSET_USER_BASE}${SIEM_API_DATA}/soc_asset_data_info?api_key=${API_KEY}`,
  DELETE_ASSET: `${ASSET_USER_BASE}${SIEM_API_DATA}/soc_asset_data_info?api_key=${API_KEY}`,

  // Agents
  GET_AGENTS: `${AGENT_BASE}/siem/agent_list`,
  ADD_AGENTS: `${AGENT_BASE}${SIEM_API_DATA}/soc_asset_data_info?api_key=${API_KEY}`,
  UPDATE_AGENTS: `${AGENT_BASE}${SIEM_API_DATA}/soc_asset_data_info?api_key=${API_KEY}`,
  DELETE_AGENTS: `${AGENT_BASE}${SIEM_API_DATA}/soc_asset_data_info?api_key=${API_KEY}`,

  // Logs
  GET_PROCESSED_LOG: `${ENDPOINT_BASE}/api/soc/v0_90/siem/getProcessedLog`,
  GET_RAW_LOG: `${ENDPOINT_BASE}/api/soc/v0_90/siem/getRawLog`,

  // Dashboard Charts
  GET_EVENT_SEVERITY: `${API_BASE}${SIEM_API_BASE}/eventSeverity`,
  GET_INCIDENT_SEVERITY: `${API_BASE}${SIEM_API_BASE}/incidentSeverity`,
  GET_EVENT_COUNT: `${API_BASE}${SIEM_API_BASE}/eventCount`,
  GET_INCIDENT_COUNT: `${API_BASE}${SIEM_API_BASE}/incidentCount`,
  GET_SUMMARY_CHART_HOURLY: `${CHARTS_BASE}/api/logs_hourly`,
  GET_LOGS_RATE_TODAY: `${CHARTS_BASE}/logs-rate-today`,
  GET_LOGS_PER_USER: `${CHARTS_BASE}/logs-per-user-today`,

  // Auth
  POST_LOGIN: `${API_BASE}/api/login`,

  // Traffic (NDR)
  GET_TRAFFIC_SUMMARY_PROTOCOL: `${ENDPOINT_BASE}/api/soc/v0_09/ndr/getTrafficSummary`,
  GET_TRAFFIC_SUMMARY: `${ENDPOINT_BASE}/api/soc/v0_09/ndr/getTrafficSummary`,
  GET_BASELINE_SUMMARY: `${ENDPOINT_BASE}/api/soc/v0_09/ndr/getBaselineTraffic`,
} as const;

/** Always configured now since URLs are hardcoded */
export const isApiConfigured = (): boolean => {
  return true;
};
