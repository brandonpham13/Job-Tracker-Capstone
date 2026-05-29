import { ContactsAPI, getCurrentUserId } from "../api/fetch_api.js";

export async function initEditContactPage() {
  const form = document.querySelector(".edit-contact-form");
  if (!form) return;
  const params = new URLSearchParams(window.location.search);
  const contactId = params.get("id");

  if (!contactId) return;
  const userId = getCurrentUserId();

  // Form fields
  const nameInput = document.querySelector("#name");
  const urlInput = document.querySelector("#linkedin_url");
  const lastContactInput = document.querySelector("#last_contact_date");
  const notesInput = document.querySelector("#notes");

  try {
    const contact = await ContactsAPI.getById(contactId, userId);

    // Pre-populate main contact data
    nameInput.value = contact.name || "";
    urlInput.value = contact.linkedin_url || "";
    notesInput.value = contact.notes || "";

    // datetime-local requires YYYY-MM-DDTHH:mm
    if (contact.last_contact_date) {
      lastContactInput.value = contact.last_contact_date.slice(0, 16);
    }
  } catch (err) {
    console.error("Failed loading contact:", err);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedData = {
      name: nameInput.value,
      linkedin_url: urlInput.value,
      last_contact_date: lastContactInput.value,
      notes: notesInput.value,
    };

    try {
      await ContactsAPI.update(contactId, userId, updatedData);

      window.location.href = "contacts.html";
    } catch (err) {
      console.error("Update failed:", err);
    }
  });
}
