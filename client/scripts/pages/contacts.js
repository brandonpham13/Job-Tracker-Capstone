import { ContactsAPI, getCurrentUserId } from "../api/fetch_api.js";

export function initContactsPage() {
  const tableBody = document.querySelector("#contacts-table");
  const deletedOverlay = document.querySelector(".deleted-overlay");
  const confirmDelete = document.querySelector(".confirm-delete");
  const cancelDelete = document.querySelector(".cancel-delete");
  const filterSortOverlay = document.querySelector(".filter-sort-overlay");
  const filterSortButton = document.querySelector(".filter-contacts");
  const clearFilters = document.querySelector(".clear-filters");
  const submitFilters = document.querySelector(".submit-filters");
  const sortSelect = document.querySelector("#sort-select");
  const filterSelect = document.querySelector("#filter-select");
  const detailOverlay = document.querySelector(".detail-overlay");
  const detailForm = document.querySelector(".contact-detail-form");
  const modalDeleteBtn = document.querySelector(".modal-delete-btn");
  const modalCancelBtn = document.querySelector(".modal-cancel-btn");

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
        <td>
          <button class="delete-btn" data-id="${contact.contact_id}"><i class="fa-solid fa-trash"></i></button>
          <button class="edit-btn" data-id="${contact.contact_id}"><i class="fa-solid fa-pen-to-square"></i></button>
        </td>
        <td>${contact.name}</td>
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

  async function openDetailModal(contactId) {
    selectedContactId = contactId;
    try {
      const userId = getCurrentUserId();
      const contact = await ContactsAPI.getById(contactId, userId);

      document.querySelector("#modal-name").value = contact.name || "";
      document.querySelector("#modal-linkedin").value =
        contact.linkedin_url || "";
      document.querySelector("#modal-last-contact").value =
        contact.last_contact_date
          ? contact.last_contact_date.slice(0, 16)
          : "";
      document.querySelector("#modal-notes").value = contact.notes || "";

      detailOverlay.classList.remove("hidden");
    } catch (err) {
      console.error("Failed loading contact:", err);
    }
  }

  tableBody.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-btn");
    const editBtn = e.target.closest(".edit-btn");

    if (deleteBtn) {
      selectedContactId = deleteBtn.dataset.id;
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

    if (!selectedContactId) return;

    try {
      const userId = getCurrentUserId();
      await ContactsAPI.delete(selectedContactId, userId);
      selectedContactId = null;
      deletedOverlay.classList.add("hidden");
      detailOverlay.classList.add("hidden");
      await loadContacts();
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

    if (!selectedContactId) return;

    const userId = getCurrentUserId();
    const updatedData = {
      name: document.querySelector("#modal-name").value,
      linkedin_url: document.querySelector("#modal-linkedin").value,
      last_contact_date: document.querySelector("#modal-last-contact").value,
      notes: document.querySelector("#modal-notes").value,
    };

    try {
      await ContactsAPI.update(selectedContactId, userId, updatedData);
      detailOverlay.classList.add("hidden");
      await loadContacts();
    } catch (err) {
      console.error("Update failed:", err);
    }
  });

  modalDeleteBtn.addEventListener("click", () => {
    detailOverlay.classList.add("hidden");
    deletedOverlay.classList.remove("hidden");
  });

  modalCancelBtn.addEventListener("click", () => {
    selectedContactId = null;
    detailOverlay.classList.add("hidden");
  });

  clearFilters.addEventListener("click", (e) => {
    e.preventDefault();
    filters = { sortBy: "", filterBy: "" };
    sortSelect.value = "";
    filterSelect.value = "";
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
