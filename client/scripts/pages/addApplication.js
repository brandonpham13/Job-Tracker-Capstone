import { ApplicationsAPI, getCurrentUserId } from "../api/fetch_api.js";

export function initAddApplicationsPage() {
  const applicationForm = document.querySelector(".add-application-form");
  const successOverlay = document.querySelector(".success-overlay");
  const closeModal = document.querySelector(".close-modal");

  if (!applicationForm || !successOverlay || !closeModal) return;

  function showSuccess() {
    successOverlay.classList.remove("hidden");
  }

  function hideSuccess() {
    successOverlay.classList.add("hidden");
  }

  closeModal.addEventListener("click", hideSuccess);

  applicationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = getCurrentUserId();
    const formData = new FormData(applicationForm);

    const payload = {
      role: formData.get("role"),
      company_name: formData.get("company_name"),
      status: formData.get("status"),
      application_date: formData.get("application_date") || null,
    };

    try {
      await ApplicationsAPI.create(userId, payload);

      applicationForm.reset();
      showSuccess();
    } catch (err) {
      console.error("Failed to create application:", err);
      alert("Could not create application. Try again.");
    }
  });
  closeModal.addEventListener("click", hideSuccess);
}
