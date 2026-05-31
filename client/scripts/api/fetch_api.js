const API_BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
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
      body: JSON.stringify({ userId, ...data }),
    });
  },

  delete(id, userId) {
    return request(`/applications/${id}?userId=${userId}`, {
      method: "DELETE",
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
      body: JSON.stringify({ userId, ...data }),
    });
  },

  delete(id, userId) {
    return request(`/contacts/${id}?userId=${userId}`, {
      method: "DELETE",
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
      body: JSON.stringify({ userId, ...data }),
    });
  },

  delete(id, userId) {
    return request(`/skills/${id}?userId=${userId}`, {
      method: "DELETE",
    });
  },

  getFrequencyStats(userId) {
    return request(`/skills/frequency/${userId}`);
  },
};

export const UsersAPI = {
  signup(email, displayName) {
    return request(`/users`, {
      method: "POST",
      body: JSON.stringify({ email, displayName }),
    });
  },

  getProfile(userId) {
    return request(`/users/${userId}`);
  },

  updateProfile(userId, data) {
    return request(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(userId) {
    return request(`/users/${userId}`, {
      method: "DELETE",
    });
  },
};

export function getCurrentUserId() {
  return localStorage.getItem("userId") || null;
}

export function setCurrentUserId(id) {
  localStorage.setItem("userId", id);
}

export function clearCurrentUserId() {
  localStorage.removeItem("userId");
}
