const API_BASE = "/api";

async function request(path, options = {}) {
  const res = await window.Auth.apiFetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "API request failed");
  }

  return res.json();
}

export const ApplicationsAPI = {
  list(userId) {
    return request(`/applications?userId=${userId}`);
  },

  create(userId, data) {
    return request(`/applications`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  delete(id, userId) {
    return request(`/applications/${id}?userId=${userId}`, {
      method: "DELETE",
    });
  },

  getById(id, userId) {
    return request(`/applications/${id}?userId=${userId}`);
  },

  update(id, userId, data) {
    return request(`/applications/${id}?userId=${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

export const ContactsAPI = {
  list(userId) {
    return request(`/contacts?userId=${userId}`);
  },

  create(userId, data) {
    return request(`/contacts`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  delete(id, userId) {
    return request(`/contacts/${id}?userId=${userId}`, {
      method: "DELETE",
    });
  },

  getById(id, userId) {
    return request(`/contacts/${id}?userId=${userId}`);
  },

  update(id, userId, data) {
    return request(`/contacts/${id}?userId=${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

export const SkillsAPI = {
  list(userId) {
    return request(`/skills?userId=${userId}`);
  },

  create(userId, data) {
    return request(`/skills`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  delete(id, userId) {
    return request(`/skills/${id}?userId=${userId}`, {
      method: "DELETE",
    });
  },

  getById(id, userId) {
    return request(`/skills/${id}?userId=${userId}`);
  },

  update(id, userId, data) {
    return request(`/skills/${id}?userId=${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

export function getCurrentUserId() {
  return localStorage.getItem("userId") || "demo-user";
}

export function setCurrentUserId(id) {
  localStorage.setItem("userId", id);
}
