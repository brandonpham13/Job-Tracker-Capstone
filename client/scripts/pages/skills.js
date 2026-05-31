import { SkillsAPI, getCurrentUserId } from "../api/fetch_api.js";

export function initSkillsPage() {
  const tableBody = document.querySelector("#skills-table");
  const deletedOverlay = document.querySelector(".deleted-overlay");
  const confirmDelete = document.querySelector(".confirm-delete");
  const cancelDelete = document.querySelector(".cancel-delete");
  const filterSortOverlay = document.querySelector(".filter-sort-overlay");
  const filterSortButton = document.querySelector(".filter-sort-btn");
  const clearFilters = document.querySelector(".clear-filters");
  const submitFilters = document.querySelector(".submit-filters");
  const sortSelect = document.querySelector("#sort-select");
  const categorySelect = document.querySelector("#category-select");
  const detailOverlay = document.querySelector(".detail-overlay");
  const detailForm = document.querySelector(".skill-detail-form");
  const modalDeleteBtn = document.querySelector(".modal-delete-btn");
  const modalCancelBtn = document.querySelector(".modal-cancel-btn");

  if (!tableBody) return;

  let selectedSkillId = null;
  let allSkills = [];
  let filters = { category: "", sortBy: "" };

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
        <td>
          <button class="delete-btn" data-id="${skill.skill_id}"><i class="fa-solid fa-trash"></i></button>
          <button class="edit-btn" data-id="${skill.skill_id}"><i class="fa-solid fa-pen-to-square"></i></button>
        </td>
        <td>${skill.skill_name}</td>
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

  async function openDetailModal(skillId) {
    selectedSkillId = skillId;
    try {
      const userId = getCurrentUserId();
      const skill = await SkillsAPI.getById(skillId, userId);

      document.querySelector("#modal-skill-name").value =
        skill.skill_name || "";
      document.querySelector("#modal-category").value = skill.category || "";

      detailOverlay.classList.remove("hidden");
    } catch (err) {
      console.error("Failed loading skill:", err);
    }
  }

  tableBody.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-btn");
    const editBtn = e.target.closest(".edit-btn");

    if (deleteBtn) {
      selectedSkillId = deleteBtn.dataset.id;
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

    if (!selectedSkillId) return;

    try {
      const userId = getCurrentUserId();
      await SkillsAPI.delete(selectedSkillId, userId);
      selectedSkillId = null;
      deletedOverlay.classList.add("hidden");
      detailOverlay.classList.add("hidden");
      await loadSkills();
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

    if (!selectedSkillId) return;

    const userId = getCurrentUserId();
    const updatedData = {
      skill_name: document.querySelector("#modal-skill-name").value,
      category: document.querySelector("#modal-category").value,
    };

    try {
      await SkillsAPI.update(selectedSkillId, userId, updatedData);
      detailOverlay.classList.add("hidden");
      await loadSkills();
    } catch (err) {
      console.error("Update failed:", err);
    }
  });

  modalDeleteBtn.addEventListener("click", () => {
    detailOverlay.classList.add("hidden");
    deletedOverlay.classList.remove("hidden");
  });

  modalCancelBtn.addEventListener("click", () => {
    selectedSkillId = null;
    detailOverlay.classList.add("hidden");
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
