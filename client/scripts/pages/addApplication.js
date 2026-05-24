import { ApplicationsAPI, getCurrentUserId } from "../api/fetch_api.js";

export function initAddApplicationsPage() {
  const applicationForm = document.querySelector(".add-application-form");
  const successOverlay = document.querySelector(".success-overlay");
  const submitAnother = document.querySelector(".submit-another");

  if (!applicationForm || !successOverlay) return;

  submitAnother.addEventListener("click", () => {
    successOverlay.classList.add("hidden");
    applicationForm.reset();
  });

  applicationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = getCurrentUserId();
    const formData = new FormData(applicationForm);

    const rawStatus = formData.get("status");
    const payload = {
      role: formData.get("role"),
      company_name: formData.get("company_name"),
      status: rawStatus ? rawStatus.toUpperCase() : undefined,
      application_date: formData.get("application_date") || null,
    };

    try {
      await ApplicationsAPI.create(userId, payload);
      successOverlay.classList.remove("hidden");
    } catch (err) {
      console.error("Failed to create application:", err);
      alert(`Could not create application: ${err.message}`);
    }
  });
}
