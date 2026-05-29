import { ContactsAPI, getCurrentUserId } from "../api/fetch_api.js";

export function initContactsPage() {
  const tableBody = document.querySelector("#contacts-table");
  const deletedOverlay = document.querySelector(".deleted-overlay");
  const deleteButton = document.querySelector(".delete-btn");
  const confirmDelete = document.querySelector(".confirm-delete");
  const cancelDelete = document.querySelector(".cancel-delete");
  const filterSortOverlay = document.querySelector(".filter-sort-overlay");
  const filterSortButton = document.querySelector(".filter-contacts");
  const clearFilters = document.querySelector(".clear-filters");
  const submitFilters = document.querySelector(".submit-filters");

  if (!tableBody) return;

  let selectedContactId = null;

  async function loadContacts() {
    const userId = getCurrentUserId();
    const contacts = await ContactsAPI.list(userId);

    tableBody.innerHTML = contacts
      .map(
        (contact) => `
    <tr>
      <td><button class="delete-btn" data-id="${contact.contact_id}"><i class="fa-solid fa-trash"></i></button></td>
      <td>
        <a
          href="edit-view-contact.html?id=${contact.contact_id}"
          class="contact-link"
        >
        ${contact.name}
        </a>
      </td>
    </tr>
  `,
      )
      .join("");
  }

  tableBody.addEventListener("click", (e) => {
    const btn = e.target.closest(".delete-btn");
    if (!btn) return;

    selectedContactId = btn.dataset.id;
    deletedOverlay.classList.remove("hidden");
  });

  filterSortButton.addEventListener("click", () => {
    filterSortOverlay.classList.remove("hidden");
  });

  confirmDelete.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!selectedContactId) return;

    try {
      const userId = getCurrentUserId();
      await ContactsAPI.delete(selectedContactId, userId);
      selectedContactId = null;
      deletedOverlay.classList.add("hidden");
      await loadContacts();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  });

  cancelDelete.addEventListener("click", (e) => {
    e.preventDefault();
    selectedContactId = null;
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

  loadContacts();
}
