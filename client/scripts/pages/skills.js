import { SkillsAPI, getCurrentUserId } from "../api/fetch_api.js";

export function initSkillsPage() {
  const tableBody = document.querySelector("#skills-table");
  const deletedOverlay = document.querySelector(".deleted-overlay");
  const deleteButton = document.querySelector(".delete-btn");
  const confirmDelete = document.querySelector(".confirm-delete");
  const cancelDelete = document.querySelector(".cancel-delete");
  const filterSortOverlay = document.querySelector(".filter-sort-overlay");
  const filterSortButton = document.querySelector(".filter-sort-btn");
  const clearFilters = document.querySelector(".clear-filters");
  const submitFilters = document.querySelector(".submit-filters");
  const sortSelect = document.querySelector("#sort-select");
  const categorySelect = document.querySelector("#category-select");

  if (!tableBody) return;

  let selectedSkillId = null;
  let allSkills = [];
  let filters = { category: "", sortBy: "" };

  async function loadSkills() {
    const userId = getCurrentUserId();
    const skills = await SkillsAPI.list(userId);
  function renderSkills() {
    let skills = [...allSkills];

    if (filters.category) {
      skills = skills.filter((s) => (s.category || "") === filters.category);
    }

    if (filters.sortBy === "category") {
      skills.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
    }

    tableBody.innerHTML = skills
      .map(
        (skill) => `
    <tr>
      <td><button class="delete-btn" data-id="${skill.skill_id}"><i class="fa-solid fa-trash"></i></button></td>
      <td>
        <a
          href="edit-view-skill.html?id=${skill.skill_id}"
          class="skill-link"
        >
          ${skill.skill_name}
        </a>
      </td>
      <td>${skill.category ?? ""}</td>
    </tr>
  `,
      )
      .join("");
  }

  function populateCategories() {
    const categories = [
      ...new Set(allSkills.map((s) => s.category).filter(Boolean)),
    ];

    categorySelect.innerHTML = `
    <option value="">Select an option</option>
    ${categories.map((c) => `<option value="${c}">${c}</option>`).join("")}
  `;
  }

  async function loadSkills() {
    const userId = getCurrentUserId();
    allSkills = await SkillsAPI.list(userId);
    populateCategories();
    renderSkills();
  }

  tableBody.addEventListener("click", (e) => {
    const btn = e.target.closest(".delete-btn");
    if (!btn) return;

    selectedSkillId = btn.dataset.id;
    deletedOverlay.classList.remove("hidden");
  });

  filterSortButton.addEventListener("click", () => {
    filterSortOverlay.classList.remove("hidden");
  });

  confirmDelete.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!selectedSkillId) return;

    try {
      const userId = getCurrentUserId();
      await SkillsAPI.delete(selectedSkillId, userId);
      selectedSkillId = null;
      deletedOverlay.classList.add("hidden");
      await loadSkills();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  });

  cancelDelete.addEventListener("click", (e) => {
    e.preventDefault();
    selectedSkillId = null;
    deletedOverlay.classList.add("hidden");
  });

  clearFilters.addEventListener("click", (e) => {
    e.preventDefault();

    filters = {
      category: "",
      sortBy: "",
    };

    sortSelect.value = "";
    categorySelect.value = "";

    filterSortOverlay.classList.add("hidden");
    renderSkills();
  });

  submitFilters.addEventListener("click", (e) => {
    e.preventDefault();

    filters.category = categorySelect.value || "";
    filters.sortBy = sortSelect.value || "";

    filterSortOverlay.classList.add("hidden");
    renderSkills();
  });

  loadSkills();
}

