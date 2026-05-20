import { SkillsAPI, getCurrentUserId } from "../api/fetch_api.js";

export function initAddSkillsPage() {
  const skillForm = document.querySelector(".add-skill-form");
  const successOverlay = document.querySelector(".success-overlay");
  const closeModal = document.querySelector(".close-modal");

  if (!skillForm || !successOverlay || !closeModal) return;

  function showSuccess() {
    successOverlay.classList.remove("hidden");
  }

  function hideSuccess() {
    successOverlay.classList.add("hidden");
  }

  closeModal.addEventListener("click", hideSuccess);

  skillForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = getCurrentUserId();
    const formData = new FormData(skillForm);

    const payload = {
      skill_name: formData.get("skill_name"),
      category: formData.get("category"),
    };

    try {
      await SkillsAPI.create(userId, payload);

      skillForm.reset();
      showSuccess();
    } catch (err) {
      console.error("Failed to create skill:", err);
      alert("Could not create skill. Try again.");
    }
  });
  closeModal.addEventListener("click", hideSuccess);
}
