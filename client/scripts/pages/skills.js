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

  if (!tableBody) return;

  let selectedSkillId = null;

  async function loadSKills() {
    const userId = getCurrentUserId();
    const skills = await SkillsAPI.list(userId);

    tableBody.innerHTML = skills
      .map(
        (skill) => `
    <tr>
      <td><button class="delete-btn" data-id="${skill.id}"><i class="fa-solid fa-trash"></i></button></td>
      <td>${skill.skill_name}</td>
      <td>${skill.category}</td>
    </tr>
  `,
      )
      .join("");
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
    filterSortOverlay.classList.add("hidden");
  });

  submitFilters.addEventListener("click", (e) => {
    e.preventDefault();
    filterSortOverlay.classList.add("hidden");
  });

  loadSkills();
}
