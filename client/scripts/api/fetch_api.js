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

  async findByName(userId, contactName) {
    const contacts = await request(`/contacts?userId=${userId}`);

    return contacts.find(
      (contact) => contact.name.toLowerCase() === contactName.toLowerCase(),
    );
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

  async findByName(userId, skillName) {
    const skills = await request(`/skills?userId=${userId}`);

    return skills.find(
      (skill) => skill.skill_name.toLowerCase() === skillName.toLowerCase(),
    );
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

export const ApplicationSkillsAPI = {
  listByApplication(appId) {
    return request(`/application-skills/${appId}`);
  },

  create(appId, skillId) {
    return request(`/application-skills/${appId}/${skillId}`, {
      method: "POST",
    });
  },

  delete(appId, skillId) {
    return request(`/application-skills/${appId}/${skillId}`, {
      method: "DELETE",
    });
  },
};

export const ApplicationContactsAPI = {
  listByApplication(appId) {
    return request(`/application-contacts/${appId}`);
  },

  create(appId, contactId) {
    return request(`/application-contacts/${appId}/${contactId}`, {
      method: "POST",
    });
  },

  delete(appId, contactId) {
    return request(`/application-contacts/${appId}/${contactId}`, {
      method: "DELETE",
    });
  },
};

export function getCurrentUserId() {
  return localStorage.getItem("userId");
}

export function setCurrentUserId(id) {
  return localStorage.setItem("userId", id);
}
