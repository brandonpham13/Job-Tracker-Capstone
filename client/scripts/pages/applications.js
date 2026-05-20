import { ApplicationsAPI, getCurrentUserId } from "../api/fetch_api.js";

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

  if (!tableBody) return;

  let selectedApplicationId = null;

  async function loadApplications() {
    const userId = getCurrentUserId();
    const applications = await ApplicationsAPI.list(userId);

    tableBody.innerHTML = applications
      .map(
        (app) => `
    <tr>
      <td><button class="delete-btn" data-id="${app.id}"><i class="fa-solid fa-trash"></i></button></td>
      <td>${app.role}</td>
      <td>${app.company_name}</td>
      <td>${app.status}</td>
    </tr>
  `,
      )
      .join("");
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
      deletedOverlay.classList.add("hidden");
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
    filterSortOverlay.classList.add("hidden");
  });

  submitFilters.addEventListener("click", (e) => {
    e.preventDefault();
    filterSortOverlay.classList.add("hidden");
  });

  loadApplications();
}
