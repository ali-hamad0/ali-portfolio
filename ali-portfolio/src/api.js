// src/api.js
// Set VITE_API_URL in your .env file to your Railway backend URL
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

let _token = localStorage.getItem("admin_token") || "";

export const setToken  = (t) => { _token = t; localStorage.setItem("admin_token", t); };
export const clearToken = () => { _token = ""; localStorage.removeItem("admin_token"); };
export const hasToken  = () => !!_token;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${_token}`,
});

// ── AUTH
export async function login(password) {
  const r = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!r.ok) throw new Error("Incorrect password");
  const data = await r.json();
  setToken(data.access_token);
  return data;
}

// ── PROJECTS (public)
export const getProjects = () =>
  fetch(`${BASE}/projects`).then(r => r.json());

// ── PROJECTS (admin)
export const createProject = async (body) => {
  const r = await fetch(`${BASE}/projects/`, {
    method: "POST", headers: authHeaders(), body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
};

export const updateProject = async (id, body) => {
  const r = await fetch(`${BASE}/projects/${id}`, {
    method: "PUT", headers: authHeaders(), body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
};

export const deleteProject = (id) =>
  fetch(`${BASE}/projects/${id}`, {
    method: "DELETE", headers: { Authorization: `Bearer ${_token}` },
  }).then(r => r.json());

export async function uploadProjectMedia(projectId, file) {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch(`${BASE}/projects/${projectId}/media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${_token}` },
    body: fd,
  });
  if (!r.ok) throw new Error("Upload failed");
  return r.json();
}

export const removeProjectMedia = (id) =>
  fetch(`${BASE}/projects/${id}/media`, {
    method: "DELETE", headers: { Authorization: `Bearer ${_token}` },
  }).then(r => r.json());

// ── CONTENT (generic key/value sections)
export const getContent = (key) =>
  fetch(`${BASE}/content/${key}`).then(r => r.json());

export const saveContent = async (key, value) => {
  const r = await fetch(`${BASE}/content/${key}`, {
    method: "PUT", headers: authHeaders(), body: JSON.stringify({ value }),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
};

// ── SKILLS
export const getSkills = () =>
  fetch(`${BASE}/skills`).then(r => r.json());

export const saveSkills = (body) =>
  fetch(`${BASE}/skills`, {
    method: "PUT", headers: authHeaders(), body: JSON.stringify(body),
  }).then(r => r.json());

// ── BIO
export const getBio = () =>
  fetch(`${BASE}/bio`).then(r => r.json());

export const saveBio = (body) =>
  fetch(`${BASE}/bio`, {
    method: "PUT", headers: authHeaders(), body: JSON.stringify(body),
  }).then(r => r.json());

export async function uploadPortrait(file) {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch(`${BASE}/bio/portrait`, {
    method: "POST",
    headers: { Authorization: `Bearer ${_token}` },
    body: fd,
  });
  if (!r.ok) throw new Error("Upload failed");
  return r.json();
}

export const removePortrait = () =>
  fetch(`${BASE}/bio/portrait`, {
    method: "DELETE", headers: { Authorization: `Bearer ${_token}` },
  }).then(r => r.json());
