export const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export const get = async (resource) => {
  const response = await fetch(`${API_BASE}/api/${resource}`);
  const body = await response.json();
  if (!response.ok || !body.success) throw new Error(body.message || `Cannot load ${resource}`);
  return body.data;
};
export const assetUrl = (url) => url?.startsWith("/uploads/") ? `${API_BASE}${url}` : url;
