import {
  ApplicationsAPI,
  ApplicationSkillsAPI,
  ApplicationContactsAPI,
  SkillsAPI,
  ContactsAPI,
  getCurrentUserId,
} from "../api/fetch_api.js";

export function initApplicationsPage() {
  const tableBody = document.querySelector("#applications-table");
  const deletedOverlay = document.querySelector(".deleted-overlay");
  const confirmDelete = document.querySelector(".confirm-delete");
  const cancelDelete = document.querySelector(".cancel-delete");
  const filterSortOverlay = document.querySelector(".filter-sort-overlay");
  const filterSortButton = document.querySelector(".filter-sort-btn");
  const clearFilters = document.querySelector(".clear-filters");
  const submitFilters = document.querySelector(".submit-filters");
  const sortSelect = document.querySelector("#sort-select");
  const statusFilter = document.querySelector("#filter-status-select");
  const skillFilter = document.querySelector("#filter-skill-select");
  const organizationFilter = document.querySelector(
    "#filter-organization-select",
  );
  const detailOverlay = document.querySelector(".detail-overlay");
  const detailForm = document.querySelector(".application-detail-form");
  const modalDeleteBtn = document.querySelector(".modal-delete-btn");
  const modalCancelBtn = document.querySelector(".modal-cancel-btn");

  if (!tableBody) return;

  let selectedApplicationId = null;
  let allApplications = [];
  let allSkills = [];
  let filters = {
    sortBy: "",
    status: "",
    skill: "",
    organization: "",
  };

  function renderApplications() {
    let apps = [...allApplications];

    if (filters.status) {
      apps = apps.filter((a) => a.status === filters.status);
    }

    if (filters.organization) {
      apps = apps.filter(
        (a) => (a.company_name || "") === filters.organization,
      );
    }

    if (filters.skill) {
      apps = apps.filter((a) =>
        (a.skills || []).some((s) => s.skill_name === filters.skill),
      );
    }

    if (filters.sortBy === "status") {
      apps.sort((a, b) => (a.status || "").localeCompare(b.status || ""));
    }

    if (filters.sortBy === "organization") {
      apps.sort((a, b) =>
        (a.company_name || "").localeCompare(b.company_name || ""),
      );
    }

    if (filters.sortBy === "position-name") {
      apps.sort((a, b) => (a.role || "").localeCompare(b.role || ""));
    }

    tableBody.innerHTML = apps
      .map(
        (app) => `
      <tr>
        <td>
          <button class="delete-btn" data-id="${app.app_id}"><i class="fa-solid fa-trash"></i></button>
          <button class="edit-btn" data-id="${app.app_id}"><i class="fa-solid fa-pen-to-square"></i></button>
        </td>
        <td>${app.role}</td>
        <td>${app.company_name}</td>
        <td>${app.status}</td>
      </tr>
    `,
      )
      .join("");
  }

  function populateFilters() {
    const orgs = [...new Set(allApplications.map((a) => a.company_name))];
    const skills = [...new Set(allSkills.map((s) => s.skill_name))];

    organizationFilter.innerHTML = `
      <option value="">Select an option</option>
      ${orgs.map((o) => `<option value="${o}">${o}</option>`).join("")}
    `;

    skillFilter.innerHTML = `
      <option value="">Select an option</option>
      ${skills.map((s) => `<option value="${s}">${s}</option>`).join("")}
    `;
  }

  async function loadApplications() {
    const userId = getCurrentUserId();

    const [apps, skills] = await Promise.all([
      ApplicationsAPI.list(userId),
      SkillsAPI.list(userId),
    ]);

    const appSkillsMap = await Promise.all(
      apps.map(async (app) => {
        const appSkills = await fetch(
          `/api/application-skills/${app.app_id}`,
        ).then((r) => r.json());

        return {
          ...app,
          skills: appSkills.map((s) => s.skill),
        };
      }),
    );

    allApplications = appSkillsMap;
    allSkills = skills;

    populateFilters();
    renderApplications();
  }

  async function openDetailModal(appId) {
    selectedApplicationId = appId;
    try {
      const userId = getCurrentUserId();
      const [app, skills, contacts] = await Promise.all([
        ApplicationsAPI.getById(appId, userId),
        ApplicationSkillsAPI.listByApplication(appId),
        ApplicationContactsAPI.listByApplication(appId),
      ]);

      document.querySelector("#modal-role").value = app.role || "";
      document.querySelector("#modal-company").value = app.company_name || "";
      document.querySelector("#modal-status").value = app.status || "";
      document.querySelector("#modal-date").value = app.application_date
        ? app.application_date.slice(0, 16)
        : "";
      document.querySelector("#modal-skill-1").value =
        skills[0]?.skill?.skill_name || "";
      document.querySelector("#modal-skill-2").value =
        skills[1]?.skill?.skill_name || "";
      document.querySelector("#modal-skill-3").value =
        skills[2]?.skill?.skill_name || "";
      document.querySelector("#modal-contact-1").value =
        contacts[0]?.contact?.name || "";
      document.querySelector("#modal-contact-2").value =
        contacts[1]?.contact?.name || "";
      document.querySelector("#modal-contact-3").value =
        contacts[2]?.contact?.name || "";

      detailOverlay.classList.remove("hidden");
    } catch (err) {
      console.error("Failed loading application:", err);
    }
  }

  tableBody.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-btn");
    const editBtn = e.target.closest(".edit-btn");

    if (deleteBtn) {
      selectedApplicationId = deleteBtn.dataset.id;
      deletedOverlay.classList.remove("hidden");
    } else if (editBtn) {
      openDetailModal(editBtn.dataset.id);
    }
  });

  filterSortButton.addEventListener("click", () => {
    filterSortOverlay.classList.remove("hidden");
  });

  confirmDelete.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!selectedApplicationId) return;

    try {
      const userId = getCurrentUserId();
      await ApplicationsAPI.delete(selectedApplicationId, userId);
      selectedApplicationId = null;
      deletedOverlay.classList.add("hidden");
      detailOverlay.classList.add("hidden");
      await loadApplications();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  });

  cancelDelete.addEventListener("click", (e) => {
    e.preventDefault();
    deletedOverlay.classList.add("hidden");
  });

  detailForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!selectedApplicationId) return;

    const userId = getCurrentUserId();
    const rawStatus = document.querySelector("#modal-status").value;

    const updatedData = {
      role: document.querySelector("#modal-role").value,
      company_name: document.querySelector("#modal-company").value,
      status: rawStatus ? rawStatus.toUpperCase() : undefined,
      application_date: document.querySelector("#modal-date").value,
    };

    try {
      await ApplicationsAPI.update(selectedApplicationId, userId, updatedData);

      const skillInputs = [
        document.querySelector("#modal-skill-1").value,
        document.querySelector("#modal-skill-2").value,
        document.querySelector("#modal-skill-3").value,
      ]
        .filter(Boolean)
        .map((s) => s.trim());

      const existingSkills =
        await ApplicationSkillsAPI.listByApplication(selectedApplicationId);
      for (const s of existingSkills) {
        await ApplicationSkillsAPI.delete(selectedApplicationId, s.skill_id);
      }
      for (const skillName of skillInputs) {
        let skill = await SkillsAPI.findByName(userId, skillName);
        if (!skill) {
          skill = await SkillsAPI.create(userId, {
            skill_name: skillName,
            category: "None",
          });
        }
        await ApplicationSkillsAPI.create(selectedApplicationId, skill.skill_id);
      }

      const contactInputs = [
        document.querySelector("#modal-contact-1").value,
        document.querySelector("#modal-contact-2").value,
        document.querySelector("#modal-contact-3").value,
      ]
        .filter(Boolean)
        .map((c) => c.trim());

      const existingContacts =
        await ApplicationContactsAPI.listByApplication(selectedApplicationId);
      for (const c of existingContacts) {
        await ApplicationContactsAPI.delete(
          selectedApplicationId,
          c.contact_id,
        );
      }
      for (const contactName of contactInputs) {
        let contact = await ContactsAPI.findByName(userId, contactName);
        if (!contact) {
          contact = await ContactsAPI.create(userId, { name: contactName });
        }
        await ApplicationContactsAPI.create(
          selectedApplicationId,
          contact.contact_id,
        );
      }

      detailOverlay.classList.add("hidden");
      await loadApplications();
    } catch (err) {
      console.error("Update failed:", err);
    }
  });

  modalDeleteBtn.addEventListener("click", () => {
    detailOverlay.classList.add("hidden");
    deletedOverlay.classList.remove("hidden");
  });

  modalCancelBtn.addEventListener("click", () => {
    selectedApplicationId = null;
    detailOverlay.classList.add("hidden");
  });

  clearFilters.addEventListener("click", (e) => {
    e.preventDefault();

    filters = {
      sortBy: "",
      status: "",
      skill: "",
      organization: "",
    };

    sortSelect.value = "";
    statusFilter.value = "";
    skillFilter.value = "";
    organizationFilter.value = "";

    renderApplications();

    filterSortOverlay.classList.add("hidden");
  });

  submitFilters.addEventListener("click", (e) => {
    e.preventDefault();

    filters = {
      sortBy: sortSelect.value,
      status: statusFilter.value,
      skill: skillFilter.value,
      organization: organizationFilter.value,
    };

    filterSortOverlay.classList.add("hidden");
    renderApplications();
  });

  loadApplications();
}
