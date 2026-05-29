import { SkillsAPI, getCurrentUserId } from "../api/fetch_api.js";

export async function initEditSkillPage() {
  const form = document.querySelector(".edit-skill-form");
  if (!form) return;
  const params = new URLSearchParams(window.location.search);
  const skillId = params.get("id");

  if (!skillId) return;
  const userId = getCurrentUserId();

  // Form fields
  const skillNameInput = document.querySelector("#skill_name");
  const categoryInput = document.querySelector("#category");

  try {
    const skill = await SkillsAPI.getById(skillId, userId);

    // Pre-populate main skill data
    skillNameInput.value = skill.skill_name || "";
    categoryInput.value = skill.category || "";
  } catch (err) {
    console.error("Failed loading skill :", err);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedData = {
      skill_name: skillNameInput.value,
      category: categoryInput.value,
    };

    try {
      await SkillsAPI.update(skillId, userId, updatedData);

      window.location.href = "skills.html";
    } catch (err) {
      console.error("Update failed:", err);
    }
  });
}
