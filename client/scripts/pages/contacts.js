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
  const sortSelect = document.querySelector("#sort-select");
  const filterSelect = document.querySelector("#filter-select");

  if (!tableBody) return;

  let selectedContactId = null;
  let allContacts = [];
  let filters = { sortBy: "", filterBy: "" };

  function renderContacts() {
    let contacts = [...allContacts];

    if (filters.filterBy === "notes") {
      contacts = contacts.filter((c) => c.notes && c.notes.trim() !== "");
    }

    if (filters.filterBy === "no-notes") {
      contacts = contacts.filter((c) => !c.notes || c.notes.trim() === "");
    }

    if (filters.sortBy === "name") {
      contacts.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    if (filters.sortBy === "last-contact-date") {
      contacts.sort(
        (a, b) =>
          new Date(b.last_contact_date || 0) -
          new Date(a.last_contact_date || 0),
      );
    }

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

  async function loadContacts() {
    const userId = getCurrentUserId();
    allContacts = await ContactsAPI.list(userId);
    renderContacts();
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
    filters = { location: "", organization: "" };

    locationSelect.value = "";
    organizationSelect.value = "";
    filterSortOverlay.classList.add("hidden");

    renderContacts();
  });

  submitFilters.addEventListener("click", (e) => {
    e.preventDefault();

    filters.sortBy = sortSelect.value || "";
    filters.filterBy = filterSelect.value || "";

    filterSortOverlay.classList.add("hidden");
    renderContacts();
  });

  loadContacts();
}
