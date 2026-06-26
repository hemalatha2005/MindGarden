import axios from "axios";

export const SESSION_KEY = "mindgarden_session";
const TRUSTED_SESSIONS_KEY = "mindgarden_trusted_sessions";

export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
};

export const saveSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const saveTrustedSession = (session) => {
  const sessions = getTrustedSessions();
  sessions[session.email] = session;
  localStorage.setItem(TRUSTED_SESSIONS_KEY, JSON.stringify(sessions));
};

export const getTrustedSessions = () => {
  try {
    return JSON.parse(localStorage.getItem(TRUSTED_SESSIONS_KEY)) || {};
  } catch {
    return {};
  }
};

export const getTrustedSession = (email) => {
  const session = getTrustedSessions()[email];
  return session?.token ? session : null;
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const requestOtp = async (email) => {
  const response = await axios.post("/api/auth/request-otp", { email });
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await axios.post("/api/auth/verify-otp", { email, otp });
  return response.data;
};
