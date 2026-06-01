import {
  ApplicationsAPI,
  SkillsAPI,
  getCurrentUserId,
} from "../api/fetch_api.js";

export function initApplicationsPage() {
  const tableBody = document.querySelector("#applications-table");
  const deletedOverlay = document.querySelector(".deleted-overlay");
  const deleteButton = document.querySelector(".delete-btn");
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
      <td><button class="delete-btn" data-id="${app.app_id}"><i class="fa-solid fa-trash"></i></button></td>
      <td>
        <a
          href="edit-view-application.html?id=${app.app_id}"
          class="application-link"
        >
          ${app.role}
        </a>
      </td>
      <td>${app.company_name}</td>
      <td>${app.status}</td>
    </tr>
  `,
      )
      .join("");
  }

  function populateFilters() {
    const userId = getCurrentUserId();

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
          skills: appSkills.map((s) => s.skill), // important
        };
      }),
    );

    allApplications = appSkillsMap;
    allSkills = skills;

    populateFilters();
    renderApplications();
  }

  tableBody.addEventListener("click", (e) => {
    const btn = e.target.closest(".delete-btn");
    if (!btn) return;

    selectedApplicationId = btn.dataset.id;
    deletedOverlay.classList.remove("hidden");
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
      debuggereletedOverlay.classList.add("hidden");
      await loadApplications();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  });

  cancelDelete.addEventListener("click", (e) => {
    e.preventDefault();
    selectedApplicationId = null;
    deletedOverlay.classList.add("hidden");
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
