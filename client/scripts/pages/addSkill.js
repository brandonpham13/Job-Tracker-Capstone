import { SkillsAPI, getCurrentUserId } from "../api/fetch_api.js";

export function initAddSkillsPage() {
  const skillForm = document.querySelector(".add-skill-form");
  const successOverlay = document.querySelector(".success-overlay");
  const submitAnother = document.querySelector(".submit-another");

  if (!skillForm || !successOverlay) return;

  submitAnother.addEventListener("click", () => {
    successOverlay.classList.add("hidden");
    skillForm.reset();
  });

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
      successOverlay.classList.remove("hidden");
    } catch (err) {
      console.error("Failed to create skill:", err);
      alert("Could not create skill. Try again.");
    }
  });
}
