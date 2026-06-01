import { ContactsAPI, getCurrentUserId } from "../api/fetch_api.js";

export function initAddContactsPage() {
  const contactForm = document.querySelector(".add-contact-form");
  const successOverlay = document.querySelector(".success-overlay");
  const submitAnother = document.querySelector(".submit-another");

  if (!contactForm || !successOverlay) return;

  submitAnother.addEventListener("click", () => {
    successOverlay.classList.add("hidden");
    contactForm.reset();
  });

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = getCurrentUserId();
    const formData = new FormData(contactForm);

    const payload = {
      name: formData.get("name"),
      linkedin_url: formData.get("linkedin_url") || null,
      last_contact_date: formData.get("last_contact_date") || null,
      notes: formData.get("notes") || null,
    };

    try {
      await ContactsAPI.create(userId, payload);
      successOverlay.classList.remove("hidden");
    } catch (err) {
      console.error("Failed to create contact:", err);
      alert("Could not create contact. Try again.");
    }
  });
}
